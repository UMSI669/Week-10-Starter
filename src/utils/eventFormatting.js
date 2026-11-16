// Date, location, and mailto formatting for the events page.
// Every Intl call is guarded: Hermes ships Intl, but a missing time-zone
// database should degrade to a readable string rather than crash the page.

function format(date, timeZone, options) {
  try {
    return new Intl.DateTimeFormat('en-US', { ...options, timeZone }).format(date);
  } catch {
    try {
      return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch {
      return date.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
    }
  }
}

function parseStart(event) {
  const parsed = event && event.startAt ? Date.parse(event.startAt) : NaN;
  return Number.isNaN(parsed) ? null : new Date(parsed);
}

function parseEnd(event) {
  const parsed = event && event.endAt ? Date.parse(event.endAt) : NaN;
  return Number.isNaN(parsed) ? null : new Date(parsed);
}

/** Short time-zone label, e.g. "ET". Falls back to the IANA name. */
export function timeZoneLabel(event) {
  return event.timeZoneAbbreviation || event.timeZone || 'local time';
}

/** Collapsed-card line, e.g. "Sat, Nov 21 · 5:00 PM ET". */
export function formatSummaryDateTime(event) {
  const start = parseStart(event);
  if (!start) return 'Date to be announced';
  const day = format(start, event.timeZone, { weekday: 'short', month: 'short', day: 'numeric' });
  const time = format(start, event.timeZone, { hour: 'numeric', minute: '2-digit' });
  return `${day} · ${time} ${timeZoneLabel(event)}`;
}

/** Expanded-card line, e.g. "Saturday, November 21, 2026 · 5:00 PM – 7:00 PM ET (America/Detroit)". */
export function formatFullDateTime(event) {
  const start = parseStart(event);
  if (!start) return 'Date to be announced';
  const day = format(start, event.timeZone, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const startTime = format(start, event.timeZone, { hour: 'numeric', minute: '2-digit' });
  const end = parseEnd(event);
  const endTime = end ? format(end, event.timeZone, { hour: 'numeric', minute: '2-digit' }) : null;
  const zone = event.timeZone
    ? `${timeZoneLabel(event)} (${event.timeZone})`
    : timeZoneLabel(event);
  const clock = endTime ? `${startTime} – ${endTime}` : startTime;
  return `${day} · ${clock} ${zone}`;
}

export const isVirtual = (event) => event.mode === 'virtual';

/** Collapsed-card place line. Virtual walks say so instead of naming a venue. */
export function formatLocationSummary(event) {
  if (isVirtual(event)) return 'Virtual';
  return (event.location && event.location.summary) || 'Location to be announced';
}

/** Expanded-card place detail: street address, or how to join a virtual walk. */
export function formatLocationDetail(event) {
  const detail = event.location && event.location.detail;
  if (detail) return detail;
  return isVirtual(event) ? 'Join details to be announced.' : 'Address to be announced.';
}

export function locationHeading(event) {
  return isVirtual(event) ? 'How to join' : 'Where to meet';
}

/**
 * mailto: URL for a question about one event. Opens a draft in the
 * device's email app — it never sends anything on its own.
 */
export function buildEventMailtoUrl(event) {
  const address = (event.organizer && event.organizer.email) || '';
  const subject = encodeURIComponent(`Question about ${event.title}`);
  // The address is left unescaped so every mail client recognises it;
  // the subject is URL-encoded because titles contain spaces.
  return `mailto:${address}?subject=${subject}`;
}
