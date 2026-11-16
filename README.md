# DLV Week 10 — Photography Club

React Native Elements showcase with five independent bottom tabs: Home, Photographers, Events, Profile, and Settings.

## Run

1. `npm install`
2. `npx expo start --tunnel --clear --port 8083`
3. Scan the Terminal QR code with the iPhone Camera and open Expo Go (SDK 58).

Restart Expo after pulling because this update adds dependencies (`react-native-svg` for the bookmark icon, plus `jest`/`jest-expo` for tests). For a browser preview, run `npm run web`. Run the tests with `npm test`.

## Features

- Home: photographer and event cards linking to their pages.
- Photographers: profiles, avatars, gallery badges, and a photo-grid overlay.
- Events: Saved, Upcoming, and Attended sections of nearby and virtual photo walks. Cards expand inline (no details page), show date/time with a time-zone label, place or `Virtual`, and theme badges. Expanded cards add a description, full date and time, venue address or join details, a "What to bring" list, a "Have questions?" tooltip, and the organizer's demo `example.com` address with a "Send email" button that opens a draft and never sends. An SVG bookmark saves a walk to the top section; saved walks also stay in their own section and bookmark state stays in sync. Each section previews three walks with "View all" / "Show less".
- Profile: seeded member data, editable bio saved on the device, and native profile sharing.
- Settings: working dark/light and Color Blind Mode switches. More settings uses interactive previews: support/account/deletion dialogs, a text-size slider, a notification toggle, and a time-zone picker. These controls keep only temporary local UI state; they do not send messages, change an account, delete data, schedule notifications, or apply text size/time zone to the app.
- Appearance preferences persist on the device. The alternate palette uses blue/amber and retains text labels; it is not a simulation of individual color-vision conditions.

## Team ownership

- Navigation: `App.js`.
- Shared theme and persistence: `src/theme.js`, `src/state/AppState.js`.
- Pages: `src/screens/`.
- Photographer cards: `src/components/MemberCards.js`.
- Events page: `src/components/EventShowcase.js` with `src/components/events/` (`EventSection`, `ExpandableEventCard`, `ThemeBadges`, `BookmarkButton`, `BookmarkIcon`, `OrganizerContact`), `src/events/eventSelectors.js`, and `src/utils/eventFormatting.js`.
- Sample content: `src/data/` (`photoWalks.js` holds the events page's mock walks).
- Tests: `__tests__/`.

Image upload is not included. Gallery photos are bundled demo images from Lorem Picsum: https://picsum.photos/id/1015, https://picsum.photos/id/1016, https://picsum.photos/id/1025.

## Validation

`npm run lint`, `npm test` (33 tests), and the iOS export pass. Browser checks cover navigation, photographer detail and photo overlay, event expansion/RSVP tooltip, and both settings switches. Native sharing, email handoff, and physical-device rendering still need phone verification.

Events page notes: every walk, address, and organizer is mock data in `src/data/photoWalks.js`; start times are generated relative to today so Upcoming stays current. No device location is requested and no distance is calculated — nearby venues are labeled as sample locations. Saved walks persist in the same AsyncStorage preferences blob as the appearance settings. Saved bookmarks are green by default and switch to the accessible blue in Color Blind Mode; a "Saved" text label and an accessible selected state carry the status either way.
