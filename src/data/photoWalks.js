// MOCK DATA ONLY — this prototype has no backend.
// Organizers and addresses are fictional; organizer addresses use example.com so
// nothing can reach a real person. Start times are generated relative to today so
// the Upcoming section never goes stale.
//
// Three ids (golden-hour, street-stories, blue-hour) match src/data/events.js on
// purpose, so Home's "Explore event" deep link still opens the right card here.

export const MOCK_DATA_NOTICE =
  'Sample photo walks. Organizers, addresses, and join details are fictional; no live event data is loaded.';

const MS_PER_DAY = 86400000;

/** ISO-8601 timestamp with an explicit UTC designator, offset whole days from today. */
export function isoDaysFromToday(dayOffset, utcHour, utcMinute = 0, now = new Date()) {
  const midnightUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return new Date(midnightUtc + dayOffset * MS_PER_DAY + utcHour * 3600000 + utcMinute * 60000).toISOString();
}

const ET = { timeZone: 'America/Detroit', timeZoneAbbreviation: 'ET' };
const PT = { timeZone: 'America/Los_Angeles', timeZoneAbbreviation: 'PT' };

const JORDAN = { name: 'Jordan Lee', email: 'jordan.lee@example.com' };
const MAYA = { name: 'Maya Chen', email: 'maya.chen@example.com' };
const AISHA = { name: 'Aisha Patel', email: 'aisha.patel@example.com' };

export function buildPhotoWalks(now = new Date()) {
  const at = (day, hour, minute) => isoDaysFromToday(day, hour, minute, now);
  const local = (summary, detail) => ({ summary, detail });
  const virtual = (detail) => ({ summary: 'Virtual', detail });

  return [
    {
      id: 'arb-nature-walk',
      title: 'Nichols Arboretum Nature Walk',
      description: 'Slow walk along the river paths looking for late-season texture, bare branches, and soft overcast light.',
      startAt: at(2, 20, 0), endAt: at(2, 22, 0), ...ET, mode: 'local',
      location: local('Nichols Arboretum (sample nearby location)', '1610 Washington Heights, Ann Arbor, MI 48104 — meet at the Washington Heights gate.'),
      themes: ['Nature', 'Macro'],
      whatToBring: ['Camera', 'Water bottle', 'Comfortable shoes', 'Weather-appropriate layers'],
      organizer: JORDAN, attendanceStatus: 'not-attended',
    },
    {
      id: 'golden-hour',
      title: 'Golden Hour Walk',
      description: 'Practice warm light, silhouettes, and portrait framing across the Diag before sunset.',
      startAt: at(4, 22, 0), endAt: at(4, 23, 30), ...ET, mode: 'local',
      location: local('Diag steps (sample nearby location)', '913 S University Ave, Ann Arbor, MI 48109 — meet at the block M.'),
      themes: ['Portrait', 'Architecture'],
      whatToBring: ['Camera', 'Charged phone', 'Comfortable shoes', 'Light jacket'],
      organizer: AISHA, attendanceStatus: 'not-attended',
    },
    {
      id: 'virtual-night-critique',
      title: 'Virtual Night-Photo Critique',
      description: 'Bring three night frames and we talk through exposure, noise, and color balance together on a call.',
      startAt: at(5, 1, 0), endAt: at(5, 2, 30), ...PT, mode: 'virtual',
      location: virtual('Online video call. The join link is emailed to everyone who signs up on the morning of the session.'),
      themes: ['Night colors', 'Critique'],
      whatToBring: ['Three edited night frames', 'Headphones', 'Charged laptop or phone'],
      organizer: MAYA, attendanceStatus: 'not-attended',
    },
    {
      id: 'street-stories',
      title: 'Street Stories',
      description: 'Look for small details and candid moments around downtown. Good walk for practicing clean backgrounds in a busy block.',
      startAt: at(7, 19, 30), endAt: at(7, 21, 30), ...ET, mode: 'local',
      location: local('State Street storefronts (sample nearby location)', '300 S State St, Ann Arbor, MI 48104 — meet outside the corner bookstore.'),
      themes: ['Everyday life', 'Portrait'],
      whatToBring: ['Camera', 'Comfortable shoes', 'Charged phone', 'Lens cloth'],
      organizer: MAYA, attendanceStatus: 'not-attended',
    },
    {
      id: 'farm-animal-walk',
      title: 'County Farm Park Animal Walk',
      description: 'Birds, squirrels, and the occasional deer. We practice patience, panning, and faster shutter speeds.',
      startAt: at(9, 14, 0), endAt: at(9, 16, 0), ...ET, mode: 'local',
      location: local('County Farm Park (sample nearby location)', '2230 Platt Rd, Ann Arbor, MI 48104 — meet at the Platt Road parking lot.'),
      themes: ['Animal', 'Nature'],
      whatToBring: ['Camera', 'Telephoto lens if you have one', 'Water bottle', 'Warm gloves'],
      organizer: JORDAN, attendanceStatus: 'not-attended',
    },
    {
      id: 'blue-hour',
      title: 'Blue Hour Frames',
      description: 'Explore low-light composition and the changing colors after sunset around the Law Quad.',
      startAt: at(11, 23, 0), endAt: at(12, 0, 30), ...ET, mode: 'local',
      location: local('Law Quadrangle (sample nearby location)', '625 S State St, Ann Arbor, MI 48109 — meet under the Reading Room windows.'),
      themes: ['Night colors', 'Architecture'],
      whatToBring: ['Camera', 'Tripod if you have one', 'Warm gloves', 'Charged phone'],
      organizer: AISHA, attendanceStatus: 'not-attended',
    },
    {
      id: 'virtual-nature-share',
      title: 'Virtual Nature Frames Share-Out',
      description: 'Open screen-share session for nature work from the term. No critique format, just show and tell.',
      startAt: at(14, 2, 0), endAt: at(14, 3, 0), ...PT, mode: 'virtual',
      location: virtual('Online video call. Dial-in audio is available for anyone joining without a camera.'),
      themes: ['Nature', 'Critique'],
      whatToBring: ['Five favorite frames', 'Headphones', 'Charged laptop or phone'],
      organizer: AISHA, attendanceStatus: 'not-attended',
    },
    {
      id: 'kerrytown-architecture',
      title: 'Kerrytown Brick and Light',
      description: 'Warm brick, fire escapes, and market stalls. Focus on repeating shapes and strong edges.',
      startAt: at(17, 19, 0), endAt: at(17, 21, 0), ...ET, mode: 'local',
      location: local('Kerrytown Market (sample nearby location)', '407 N 5th Ave, Ann Arbor, MI 48104 — meet by the market clock.'),
      themes: ['Architecture', 'Everyday life'],
      whatToBring: ['Camera', 'Water bottle', 'Comfortable shoes', 'Lens cloth'],
      organizer: JORDAN, attendanceStatus: 'not-attended',
    },
    {
      id: 'gallup-park-animals',
      title: 'Gallup Park Waterfowl Morning',
      description: 'Early session for geese and herons on the pond. Cold hands, good reflections.',
      startAt: at(20, 13, 0), endAt: at(20, 15, 0), ...ET, mode: 'local',
      location: local('Gallup Park (sample nearby location)', '3000 Fuller Rd, Ann Arbor, MI 48105 — meet at the canoe livery.'),
      themes: ['Animal', 'Nature'],
      whatToBring: ['Camera', 'Warm gloves', 'Thermos', 'Comfortable shoes'],
      organizer: MAYA, attendanceStatus: 'not-attended',
    },

    // --- Past walks. Attendance is recorded explicitly: huron-river-fog is in the
    // --- past and was NOT attended, so it must stay out of the Attended section.
    {
      id: 'matthaei-greenhouse',
      title: 'Matthaei Greenhouse Macro Session',
      description: 'Indoor macro practice among the conservatory plants, out of the wind.',
      startAt: at(-6, 18, 0), endAt: at(-6, 20, 0), ...ET, mode: 'local',
      location: local('Matthaei Botanical Gardens (sample nearby location)', '1800 N Dixboro Rd, Ann Arbor, MI 48105 — conservatory entrance.'),
      themes: ['Nature', 'Macro'],
      whatToBring: ['Camera', 'Macro or kit lens', 'Lens cloth', 'Water bottle'],
      organizer: JORDAN, attendanceStatus: 'attended',
    },
    {
      id: 'huron-river-fog',
      title: 'Huron River Fog Morning',
      description: 'Early fog along the river. Listed as a past walk that nobody checked in for.',
      startAt: at(-9, 12, 0), endAt: at(-9, 14, 0), ...ET, mode: 'local',
      location: local('Argo Park (sample nearby location)', '1055 Longshore Dr, Ann Arbor, MI 48105 — meet at the Argo Cascades bridge.'),
      themes: ['Nature'],
      whatToBring: ['Camera', 'Warm gloves', 'Thermos'],
      organizer: MAYA, attendanceStatus: 'not-attended',
    },
    {
      id: 'virtual-composition-clinic',
      title: 'Virtual Composition Clinic',
      description: 'Walked through framing, negative space, and leading lines using member submissions.',
      startAt: at(-13, 1, 30), endAt: at(-13, 3, 0), ...PT, mode: 'virtual',
      location: virtual('Online video call. The recording was shared with everyone who signed up.'),
      themes: ['Critique'],
      whatToBring: ['Headphones', 'Notebook', 'Charged laptop or phone'],
      organizer: MAYA, attendanceStatus: 'attended',
    },
    {
      id: 'museum-steps-architecture',
      title: 'Museum Steps Architecture Walk',
      description: 'Columns, stair rails, and hard midday shadow on the museum facade.',
      startAt: at(-20, 17, 0), endAt: at(-20, 19, 0), ...ET, mode: 'local',
      location: local('UMMA steps (sample nearby location)', '525 S State St, Ann Arbor, MI 48109 — meet at the front steps.'),
      themes: ['Architecture'],
      whatToBring: ['Camera', 'Comfortable shoes', 'Water bottle'],
      organizer: AISHA, attendanceStatus: 'attended',
    },
    {
      id: 'nickels-arcade-everyday',
      title: 'Nickels Arcade Everyday Life',
      description: 'Candid frames in the arcade: reflections, shopfronts, and people passing through.',
      startAt: at(-27, 19, 30), endAt: at(-27, 21, 0), ...ET, mode: 'local',
      location: local('Nickels Arcade (sample nearby location)', '326 S State St, Ann Arbor, MI 48104 — meet at the State Street entrance.'),
      themes: ['Everyday life', 'Portrait'],
      whatToBring: ['Camera', 'Charged phone', 'Comfortable shoes'],
      organizer: JORDAN, attendanceStatus: 'attended',
    },
  ];
}

export const photoWalks = buildPhotoWalks();
