// Pure helpers for turning the event list + saved IDs into the three sections.
// Kept free of React so they stay easy to test.

const isEvent = (event) => Boolean(event && typeof event.id === 'string');

function startTime(event) {
  const parsed = Date.parse(event.startAt);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function byStartAscending(a, b) {
  const diff = startTime(a) - startTime(b);
  return diff !== 0 ? diff : a.id.localeCompare(b.id);
}

function byStartDescending(a, b) {
  const diff = startTime(b) - startTime(a);
  return diff !== 0 ? diff : a.id.localeCompare(b.id);
}

/** Future events, soonest first. */
export function selectUpcomingEvents(events, now = new Date()) {
  const cutoff = now.getTime();
  return events.filter(isEvent).filter((event) => startTime(event) > cutoff).sort(byStartAscending);
}

/**
 * Only events explicitly marked attended. A past event with
 * attendanceStatus 'not-attended' is deliberately left out.
 */
export function selectAttendedEvents(events) {
  return events
    .filter(isEvent)
    .filter((event) => event.attendanceStatus === 'attended')
    .sort(byStartDescending);
}

/**
 * Drops IDs that no longer match an event, plus duplicates and non-strings,
 * so a stale value left in storage cannot break the page.
 */
export function sanitizeSavedIds(savedIds, events) {
  if (!Array.isArray(savedIds)) return [];
  const known = new Set(events.filter(isEvent).map((event) => event.id));
  const seen = new Set();
  return savedIds.filter((id) => {
    if (typeof id !== 'string' || !known.has(id) || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

/**
 * Saved events in a deterministic order: upcoming walks first (soonest first),
 * then past walks (most recent first). Independent of tap order.
 */
export function selectSavedEvents(events, savedIds, now = new Date()) {
  const ids = new Set(sanitizeSavedIds(savedIds, events));
  const saved = events.filter((event) => isEvent(event) && ids.has(event.id));
  const cutoff = now.getTime();
  const upcoming = saved.filter((event) => startTime(event) > cutoff).sort(byStartAscending);
  const past = saved.filter((event) => startTime(event) <= cutoff).sort(byStartDescending);
  return [...upcoming, ...past];
}

/** The three page sections, in display order. Saved is always first. */
export function selectEventSections(events, savedIds, now = new Date()) {
  return [
    {
      id: 'saved',
      title: 'Saved events',
      emptyMessage: 'No saved events yet. Tap the bookmark on any walk to save it here.',
      events: selectSavedEvents(events, savedIds, now),
    },
    {
      id: 'upcoming',
      title: 'Upcoming events',
      emptyMessage: 'No upcoming walks are scheduled right now. Check back soon.',
      events: selectUpcomingEvents(events, now),
    },
    {
      id: 'attended',
      title: 'Attended events',
      emptyMessage: 'No attended walks yet. Your check-ins will show up here.',
      events: selectAttendedEvents(events),
    },
  ];
}

export const PREVIEW_COUNT = 3;

/** What a section shows right now, given whether it has been expanded. */
export function previewEvents(sectionEvents, isExpanded, previewCount = PREVIEW_COUNT) {
  return isExpanded ? sectionEvents : sectionEvents.slice(0, previewCount);
}

export function hasMoreThanPreview(sectionEvents, previewCount = PREVIEW_COUNT) {
  return sectionEvents.length > previewCount;
}
