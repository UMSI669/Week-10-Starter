import {
  hasMoreThanPreview,
  previewEvents,
  sanitizeSavedIds,
  selectAttendedEvents,
  selectEventSections,
  selectSavedEvents,
  selectUpcomingEvents,
} from '../src/events/eventSelectors';

const NOW = new Date('2026-06-15T12:00:00Z');
const event = (id, startAt, attendanceStatus = 'not-attended') => ({ id, title: id, startAt, attendanceStatus });

const soon = event('soon', '2026-06-18T12:00:00Z');
const later = event('later', '2026-06-25T12:00:00Z');
const muchLater = event('much-later', '2026-07-10T12:00:00Z');
const latest = event('latest', '2026-08-01T12:00:00Z');
const attendedRecent = event('attended-recent', '2026-06-10T12:00:00Z', 'attended');
const attendedOld = event('attended-old', '2026-05-01T12:00:00Z', 'attended');
const pastSkipped = event('past-skipped', '2026-06-01T12:00:00Z');
const all = [latest, attendedOld, soon, pastSkipped, muchLater, attendedRecent, later];

describe('upcoming and attended classification', () => {
  it('lists future events chronologically', () => {
    expect(selectUpcomingEvents(all, NOW).map((e) => e.id)).toEqual([
      'soon',
      'later',
      'much-later',
      'latest',
    ]);
  });

  it('only lists events explicitly marked attended, most recent first', () => {
    expect(selectAttendedEvents(all).map((e) => e.id)).toEqual(['attended-recent', 'attended-old']);
  });

  it('leaves a past event that was not attended out of both sections', () => {
    expect(selectUpcomingEvents(all, NOW).map((e) => e.id)).not.toContain('past-skipped');
    expect(selectAttendedEvents(all).map((e) => e.id)).not.toContain('past-skipped');
  });
});

describe('saved events', () => {
  it('drops stale, duplicate, and non-string ids', () => {
    expect(sanitizeSavedIds(['soon', 'deleted-event', 'soon', 42, null], all)).toEqual(['soon']);
    expect(sanitizeSavedIds(undefined, all)).toEqual([]);
    expect(sanitizeSavedIds('soon', all)).toEqual([]);
  });

  it('orders upcoming saved walks first, then past walks most recent first', () => {
    const savedIds = ['attended-old', 'later', 'attended-recent', 'soon'];
    expect(selectSavedEvents(all, savedIds, NOW).map((e) => e.id)).toEqual([
      'soon',
      'later',
      'attended-recent',
      'attended-old',
    ]);
  });

  it('is order-independent, so tap order does not change the list', () => {
    const a = selectSavedEvents(all, ['later', 'soon'], NOW).map((e) => e.id);
    const b = selectSavedEvents(all, ['soon', 'later'], NOW).map((e) => e.id);
    expect(a).toEqual(b);
  });
});

describe('page sections', () => {
  it('puts Saved first, then Upcoming, then Attended', () => {
    const sections = selectEventSections(all, ['later'], NOW);
    expect(sections.map((s) => s.id)).toEqual(['saved', 'upcoming', 'attended']);
    expect(sections[0].events.map((e) => e.id)).toEqual(['later']);
  });

  it('gives every section an empty-state message', () => {
    selectEventSections([], [], NOW).forEach((section) => {
      expect(section.events).toEqual([]);
      expect(section.emptyMessage.length).toBeGreaterThan(0);
    });
  });

  it('keeps a saved event in its Upcoming or Attended section as well', () => {
    const sections = selectEventSections(all, ['soon'], NOW);
    expect(sections[1].events.map((e) => e.id)).toContain('soon');
  });
});

describe('section previews', () => {
  it('shows three events collapsed and everything expanded', () => {
    const upcoming = selectUpcomingEvents(all, NOW);
    expect(previewEvents(upcoming, false)).toHaveLength(3);
    expect(previewEvents(upcoming, true)).toHaveLength(4);
    expect(hasMoreThanPreview(upcoming)).toBe(true);
    expect(hasMoreThanPreview(upcoming.slice(0, 3))).toBe(false);
  });
});
