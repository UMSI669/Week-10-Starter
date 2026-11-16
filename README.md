# Afterglow — KMZ Week 10

A minimal mobile concert companion built with Expo, TypeScript, and Shopify Restyle. Browse three upcoming fictional concerts, then open a concert to see the artist, date, venue, expected songs, and opening act. Selectable light and dark surfaces with artist-specific accents keep the focus on the music.

## Run

Use Node 22.13+ and npm. No API keys, accounts, or `.env` are needed.

```sh
npm ci
npm start
```

Press `i` for the iOS simulator (macOS/Xcode required), or scan the QR code with Expo Go compatible with SDK 58. `npm run web` provides a browser version for a Zoom presentation. Keep the Expo server running while testing a development preview.

## What to try

1. Open Discover and tap any of the three concert cards.
2. Notice the gentle press response and native slide into the concert detail screen.
3. Read the artist, venue, date, doors time, and setlist preview. The opening act and its expected songs are below.
4. Tap Concerts at the top, or swipe back on iOS. Open another concert to see its artist-specific accent palette.
5. On a physical phone, opening a concert and tapping Back produce subtle selection haptics. Haptics cannot be felt in the simulator; web deliberately skips them.
6. Enable the device’s Reduce Motion setting to disable custom press scaling and screen transitions.

The bottom navigation is Discover | Saved | Profile. Bookmark a concert from its card or detail screen; Saved updates immediately and persists on this device using AsyncStorage. Profile is a guest summary with saved count and Light, Dark, and Automatic appearance controls; no account is created. Concert detail opens above the tabs and returns to the originating tab.

Tap any headliner or opening-act song to open the full-screen player preview. Next/previous cycle through that artist’s setlist. Close returns to the concert. Because the songs are fictional, the play control is disabled and the progress display remains at zero; no playback or duration is fabricated.

## Restyle showcase

- `createTheme` defines semantic color tokens, spacing, radii, and typography variants.
- Each detail screen has its own `ThemeProvider`: the artist identity arrives with the screen instead of abruptly recoloring a shared page.
- `createBox` and `createText` provide typed styling primitives for concert cards, metadata, and song rows. A shared artwork component composes native shapes.
- Shared light/dark surfaces stay consistent while artist accents use contrast-adjusted green, peach, and lavender palettes.
- React Native Animated supplies native-driver press feedback. Expo Router supplies native stack transitions and bottom navigation. These are complementary tools, not Restyle animation features.
- `expo-haptics` supplies subtle selection feedback. Unsupported or unavailable feedback does not block navigation.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build:web
```

Tests validate the fixture relationships and schedule helpers retained in the sample data. Typecheck, lint, and web export validate the current screens. Navigation is now a real Expo Router list/detail stack with direct-link fallback for an unknown concert.

## Prototype boundaries

Artists, songs, venues, and dates are fictional sample data. Setlists are previews, not verified real-world information. There is no audio, payment, ticketing, live feed, account, or backend. Saved concert IDs persist locally on the device; storage errors are surfaced in the lists. Android and physical-device haptic feel have not been manually tested. The original starter instructions remain in `docs/README.md`. PR creation and Canvas submission are separate steps.

## AI use

Codex helped brainstorm the concept with Mustafa, implement the Expo/Restyle prototype, author fictional sample content and geometric artwork, and run checks. The final direction is an advance concert companion with a minimal black interface and artist-specific accents.

## Automatic daylight appearance

Profile → Appearance offers Light, Dark, and Automatic with an accessible selected indicator and haptic feedback. The preference is saved on the device and applies across navigation, concert pages, artwork, and the player. Automatic is the default; the device's local clock selects light mode from 07:00 through 18:59 and dark mode from 19:00 through 06:59. This is clock-based, not the OS appearance setting or sunrise/sunset. The app rechecks every 30 seconds and on foregrounding, so no location permission is needed. Each artist has contrast-adjusted accents in both modes. Boundary tests cover 07:00 and 19:00.

## Layout preferences and resizing

Profile includes **Spacing: Compact / Comfortable** and **Content size: Small / Medium / Large**. Comfortable and Medium are defaults. Both preferences persist locally. Spacing replaces shared Restyle spacing tokens; content size scales theme typography (90%, 100%, 120%) and sets the maximum content width (600, 840, 1080 points). Containers remain 100% of available width up to that cap, so narrowing the web window or using a phone keeps content within the viewport. The player is capped at 680 points for readability. Controls retain at least 48-point touch targets in compact mode, and system font scaling remains enabled.

Demo: open Profile, switch Compact/Comfortable, change content size, then resize the web window and visit Discover/detail. These are live theme changes, not screenshots or separate layouts. Controls were observed on iOS and web; the complete manual resize/selection flow still needs a visual pass.

## Submission PR

[KMZ Week 10 submission PR #7](https://github.com/UMSI669/Week-10-Starter/pull/7) targets the original class starter. Code is pushed to [Mustafa16192/Week-10-Starter](https://github.com/Mustafa16192/Week-10-Starter). Canvas submission has not been performed.
