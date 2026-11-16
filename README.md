# DLV Week 10 — Photography Club

An interactive React Native Elements showcase for avatars, badges, cards, tooltips, expandable list items, overlays, and themed component defaults. The photography club data is local so the demo works without an account or network request.

## Run in Expo Go

1. Install dependencies with `npm install`.
2. Run `npx expo start`.
3. Scan the QR code with Expo Go on a phone. Update Expo Go if it does not support Expo SDK 58.

The light/dark button at the top demonstrates shared theme colors. Tap a photographer's badge to see a tooltip. Expand the photo walk list and tap an event to open its detail overlay.

## Team ownership

- App setup, theme, screen integration, and PR: `App.js` and `src/theme.js`.
- Avatars, badges, cards, tooltips: `src/components/MemberCards.js`.
- Expandable list items and overlays: `src/components/EventShowcase.js`.
- Shared sample content: `src/data/members.js` and `src/data/events.js`.

The two component files contain small working examples for teammates to build on. Keep the imports and default exports intact so both sections stay connected to the main screen. The group's shared document also proposes separate photographer and event pages, a photo-grid overlay, and a color-friendly palette; those are good next additions after this first working version.
