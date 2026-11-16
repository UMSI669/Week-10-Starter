import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import EventShowcase from '../src/components/EventShowcase';
import { AppStateProvider } from '../src/state/AppState';

const walk = (id, title, startAt, extra = {}) => ({
  id,
  title,
  description: `${title} description`,
  startAt,
  endAt: startAt,
  timeZone: 'America/Detroit',
  timeZoneAbbreviation: 'ET',
  mode: 'local',
  location: { summary: `${title} meeting point`, detail: `${title} address` },
  themes: ['Nature'],
  whatToBring: ['Camera', 'Water bottle'],
  organizer: { name: 'Jordan Lee', email: 'jordan.lee@example.com' },
  attendanceStatus: 'not-attended',
  ...extra,
});

const day = (offset) => new Date(Date.now() + offset * 86400000).toISOString();

const EVENTS = [
  walk('u1', 'First Walk', day(1)),
  walk('u2', 'Second Walk', day(2)),
  walk('u3', 'Third Walk', day(3)),
  walk('u4', 'Fourth Walk', day(4)),
  walk('a1', 'Attended Walk', day(-5), { attendanceStatus: 'attended' }),
  walk('p1', 'Skipped Walk', day(-6)),
];

// React 19 flushes state updates asynchronously, so every press is awaited.
async function press(element) {
  await act(async () => {
    fireEvent.press(element);
  });
}

async function renderEvents(props = {}) {
  const view = render(
    <AppStateProvider>
      <EventShowcase events={EVENTS} {...props} />
    </AppStateProvider>
  );
  // AppStateProvider renders children only after reading stored preferences.
  await waitFor(() => expect(screen.getByTestId('section-saved')).toBeTruthy());
  return view;
}

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('inline expansion', () => {
  it('expands and collapses details in place, with no navigation', async () => {
    await renderEvents();
    expect(screen.queryByTestId('event-upcoming:u1-details')).toBeNull();

    await press(screen.getByTestId('event-upcoming:u1-summary'));
    expect(screen.getByTestId('event-upcoming:u1-details')).toBeTruthy();
    expect(screen.getByText('First Walk description')).toBeTruthy();
    expect(screen.getByText('What to bring')).toBeTruthy();
    expect(screen.getByText('Have questions?')).toBeTruthy();
    expect(screen.getByText(/jordan\.lee@example\.com/)).toBeTruthy();

    await press(screen.getByTestId('event-upcoming:u1-summary'));
    expect(screen.queryByTestId('event-upcoming:u1-details')).toBeNull();
  });

  it('reports expanded state to screen readers', async () => {
    await renderEvents();
    const summary = screen.getByTestId('event-upcoming:u1-summary');
    expect(summary.props.accessibilityState.expanded).toBe(false);
    await press(summary);
    expect(screen.getByTestId('event-upcoming:u1-summary').props.accessibilityState.expanded).toBe(true);
  });

  it('allows several cards to stay open at once', async () => {
    await renderEvents();
    await press(screen.getByTestId('event-upcoming:u1-summary'));
    await press(screen.getByTestId('event-upcoming:u2-summary'));
    expect(screen.getByTestId('event-upcoming:u1-details')).toBeTruthy();
    expect(screen.getByTestId('event-upcoming:u2-details')).toBeTruthy();
  });

  it('pre-expands the card a Home deep link asked for', async () => {
    await renderEvents({ eventId: 'u2' });
    expect(screen.getByTestId('event-upcoming:u2-details')).toBeTruthy();
    expect(screen.queryByTestId('event-upcoming:u1-details')).toBeNull();
  });
});

describe('bookmarking', () => {
  it('toggles saved state without expanding the card', async () => {
    await renderEvents();
    const bookmark = screen.getByTestId('event-upcoming:u1-bookmark');
    expect(bookmark.props.accessibilityState.selected).toBe(false);

    await press(bookmark);

    expect(screen.queryByTestId('event-upcoming:u1-details')).toBeNull();
    expect(screen.getByTestId('event-upcoming:u1-bookmark').props.accessibilityState.selected).toBe(true);
  });

  it('exposes saved status as an accessible label, not only as color', async () => {
    await renderEvents();
    await press(screen.getByTestId('event-upcoming:u1-bookmark'));
    const bookmark = screen.getByTestId('event-upcoming:u1-bookmark');
    expect(bookmark.props.accessibilityLabel).toBe('Saved: First Walk');
    expect(screen.getAllByText('Saved').length).toBeGreaterThan(0);
  });

  it('adds the walk to Saved events and keeps both bookmarks in sync', async () => {
    await renderEvents();
    expect(screen.getByText(/No saved events yet/)).toBeTruthy();

    await press(screen.getByTestId('event-upcoming:u1-bookmark'));

    const savedBookmark = screen.getByTestId('event-saved:u1-bookmark');
    expect(savedBookmark.props.accessibilityState.selected).toBe(true);
    expect(screen.getByTestId('event-upcoming:u1-bookmark').props.accessibilityState.selected).toBe(true);
    expect(screen.queryByText(/No saved events yet/)).toBeNull();
  });

  it('removes the walk from Saved events when unsaved from the saved copy', async () => {
    await renderEvents();
    await press(screen.getByTestId('event-upcoming:u1-bookmark'));
    await press(screen.getByTestId('event-saved:u1-bookmark'));

    expect(screen.queryByTestId('event-saved:u1-bookmark')).toBeNull();
    expect(screen.getByTestId('event-upcoming:u1-bookmark').props.accessibilityState.selected).toBe(false);
    expect(screen.getByText(/No saved events yet/)).toBeTruthy();
  });

  it('persists saved ids through the app-wide storage key', async () => {
    await renderEvents();
    await press(screen.getByTestId('event-upcoming:u1-bookmark'));

    await waitFor(() => {
      const written = AsyncStorage.setItem.mock.calls.filter(([key]) => key === 'dlv-profile-v1');
      expect(written.length).toBeGreaterThan(0);
      expect(JSON.parse(written[written.length - 1][1]).savedEventIds).toEqual(['u1']);
    });
  });

  it('restores saved ids from storage and ignores stale ones', async () => {
    await AsyncStorage.setItem(
      'dlv-profile-v1',
      JSON.stringify({ mode: 'light', colorBlind: false, savedEventIds: ['u2', 'deleted-event'] })
    );
    await renderEvents();

    expect(screen.getByTestId('event-saved:u2-bookmark').props.accessibilityState.selected).toBe(true);
    expect(screen.queryByTestId('event-saved:deleted-event-bookmark')).toBeNull();
  });
});

describe('section view all', () => {
  it('previews three walks, expands the rest inline, then shows less', async () => {
    await renderEvents();
    expect(screen.getByTestId('event-upcoming:u3-summary')).toBeTruthy();
    expect(screen.queryByTestId('event-upcoming:u4-summary')).toBeNull();

    await press(screen.getByTestId('section-upcoming-toggle'));
    expect(screen.getByTestId('event-upcoming:u4-summary')).toBeTruthy();

    await press(screen.getByTestId('section-upcoming-toggle'));
    expect(screen.queryByTestId('event-upcoming:u4-summary')).toBeNull();
  });

  it('hides the control for a section that fits in the preview', async () => {
    await renderEvents();
    expect(screen.queryByTestId('section-attended-toggle')).toBeNull();
  });
});

describe('attendance classification', () => {
  it('lists only explicitly attended walks', async () => {
    await renderEvents();
    expect(screen.getByTestId('event-attended:a1-summary')).toBeTruthy();
    expect(screen.queryByTestId('event-attended:p1-summary')).toBeNull();
    expect(screen.queryByTestId('event-upcoming:p1-summary')).toBeNull();
  });
});

describe('email handoff', () => {
  it('opens a draft without sending anything', async () => {
    const Linking = require('react-native').Linking;
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    await renderEvents();

    await press(screen.getByTestId('event-upcoming:u1-summary'));
    await press(screen.getByTestId('event-upcoming:u1-organizer-send-email'));

    expect(openURL).toHaveBeenCalledWith(
      'mailto:jordan.lee@example.com?subject=Question%20about%20First%20Walk'
    );
    openURL.mockRestore();
  });

  it('shows a fallback message when no email app opens', async () => {
    const Linking = require('react-native').Linking;
    const openURL = jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('no handler'));
    await renderEvents();

    await press(screen.getByTestId('event-upcoming:u1-summary'));
    await press(screen.getByTestId('event-upcoming:u1-organizer-send-email'));

    expect(screen.getByText(/No email app opened on this device/)).toBeTruthy();
    openURL.mockRestore();
  });
});
