import {
  buildEventMailtoUrl,
  formatFullDateTime,
  formatLocationDetail,
  formatLocationSummary,
  formatSummaryDateTime,
  isVirtual,
  timeZoneLabel,
} from '../src/utils/eventFormatting';

const localWalk = {
  id: 'golden-hour',
  title: 'Golden Hour Walk',
  startAt: '2026-06-18T22:00:00Z',
  endAt: '2026-06-18T23:30:00Z',
  timeZone: 'America/Detroit',
  timeZoneAbbreviation: 'ET',
  mode: 'local',
  location: { summary: 'Diag steps (sample nearby location)', detail: '913 S University Ave' },
  organizer: { name: 'Aisha Patel', email: 'aisha.patel@example.com' },
};

const virtualWalk = {
  ...localWalk,
  id: 'virtual-night-critique',
  title: 'Virtual Night-Photo Critique',
  mode: 'virtual',
  location: { summary: 'Virtual', detail: 'Online video call. Link emailed to members.' },
};

describe('mailto construction', () => {
  it('addresses the organizer with a URL-encoded subject', () => {
    expect(buildEventMailtoUrl(localWalk)).toBe(
      'mailto:aisha.patel@example.com?subject=Question%20about%20Golden%20Hour%20Walk'
    );
  });

  it('encodes punctuation in the event title', () => {
    const url = buildEventMailtoUrl({ ...localWalk, title: 'Walk & Talk?' });
    expect(url).toContain('subject=Question%20about%20Walk%20%26%20Talk%3F');
    expect(url.startsWith('mailto:aisha.patel@example.com?')).toBe(true);
  });
});

describe('date and time formatting', () => {
  it('includes a time-zone label in the collapsed summary', () => {
    expect(formatSummaryDateTime(localWalk)).toContain('ET');
    expect(formatSummaryDateTime(localWalk)).toContain('Jun 18');
  });

  it('names the IANA zone in the expanded detail and shows a range', () => {
    const full = formatFullDateTime(localWalk);
    expect(full).toContain('America/Detroit');
    expect(full).toContain('ET');
    expect(full).toContain('–');
  });

  it('survives a missing or unparsable start time', () => {
    expect(formatSummaryDateTime({ ...localWalk, startAt: 'not-a-date' })).toBe('Date to be announced');
    expect(formatFullDateTime({ ...localWalk, startAt: undefined })).toBe('Date to be announced');
  });

  it('falls back to the IANA name when there is no abbreviation', () => {
    expect(timeZoneLabel({ timeZone: 'UTC' })).toBe('UTC');
  });
});

describe('local versus virtual', () => {
  it('labels virtual walks instead of naming a venue', () => {
    expect(isVirtual(virtualWalk)).toBe(true);
    expect(formatLocationSummary(virtualWalk)).toBe('Virtual');
    expect(formatLocationDetail(virtualWalk)).toContain('Online video call');
  });

  it('shows the sample venue and address for local walks', () => {
    expect(formatLocationSummary(localWalk)).toContain('sample nearby location');
    expect(formatLocationDetail(localWalk)).toContain('913 S University Ave');
  });
});
