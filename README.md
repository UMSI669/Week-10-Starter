# DLV Week 10 — Photography Club

React Native Elements showcase with five independent bottom tabs: Home, Photographers, Events, Profile, and Settings.

## Run

1. `npm install`
2. `npx expo start --tunnel --clear --port 8083`
3. Scan the Terminal QR code with the iPhone Camera and open Expo Go (SDK 58).

Restart Expo after pulling this navigation update because it adds dependencies. For a browser preview, run `npm run web`.

## Features

- Home: photographer and event cards linking to their pages.
- Photographers: profiles, avatars, gallery badges, and a photo-grid overlay.
- Events: individual expandable events, preparation lists, themed badges, RSVP tooltip, and an email-draft button using the clearly marked demo address `rsvp@example.com`.
- Profile: seeded member data, editable bio saved on the device, and native profile sharing.
- Settings: working dark/light and Color Blind Mode switches. More settings uses interactive previews: support/account/deletion dialogs, a text-size slider, a notification toggle, and a time-zone picker. These controls keep only temporary local UI state; they do not send messages, change an account, delete data, schedule notifications, or apply text size/time zone to the app.
- Appearance preferences persist on the device. The alternate palette uses blue/amber and retains text labels; it is not a simulation of individual color-vision conditions.

## Team ownership

- Navigation: `App.js`.
- Shared theme and persistence: `src/theme.js`, `src/state/AppState.js`.
- Pages: `src/screens/`.
- Photographer cards: `src/components/MemberCards.js`.
- Event accordions/tooltips: `src/components/EventShowcase.js`.
- Sample content: `src/data/`.

Image upload is not included. Gallery photos are bundled demo images from Lorem Picsum: https://picsum.photos/id/1015, https://picsum.photos/id/1016, https://picsum.photos/id/1025.

## Validation

`npm run lint` and iOS/web exports pass. Browser checks cover navigation, photographer detail and photo overlay, event expansion/RSVP tooltip, and both settings switches. Native sharing, email handoff, and physical-device rendering still need phone verification.
