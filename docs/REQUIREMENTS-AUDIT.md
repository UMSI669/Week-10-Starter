# Week 10 requirements audit

Reviewed November 16, 2026 against the KMZ In Class 10 assignment and subsequent product requests.

## Assignment

| Requirement | Status / evidence |
| --- | --- |
| KMZ explores Restyle | Implemented: Shopify Restyle themes, typed Box/Text primitives, typography and spacing tokens, nested artist themes. See `src/theme.ts`. |
| Showcase composition and library capabilities | Implemented: geometric artwork composed from native views; shared themed screens, light/dark palettes and per-artist accents. Restyle supplies styling; Animated, Expo Router and Expo Haptics supply motion/navigation/feedback. |
| Explore beyond the class demonstration | Demo capabilities are ready; what was demonstrated in class was not supplied, so novelty relative to class cannot be verified. |
| Sincere working prototype | Expo mobile app runs in the iPhone 17 simulator. Web export is available for presentation. |
| Fork starter and submit a PR | Completed: pushed `main` to `Mustafa16192/Week-10-Starter`, forked from the class starter. Open PR: https://github.com/UMSI669/Week-10-Starter/pull/7. Ashley's remote is retained as `ashley`; class repository is `upstream`. |
| Submit PR link to Canvas by 11:50 AM | Not submitted. A local commit is not a submission. |
| Present Nov 30; no slides required | Simulator and web presentation paths documented. Actual presentation remains to be done. |
| No process docs needed | No process document required. This file is an engineering checklist. |
| Group naming | Project folder is `KMZ-week10`; README identifies KMZ. |

## Current product requirements

| Requirement | Status / evidence |
| --- | --- |
| Multiple concerts planned in advance | Three fictional upcoming concerts with dates, venues, headliners and opening acts in `src/data.ts`. |
| Artist information and setlists | Concert detail includes genre, doors, performance time and numbered songs; opening acts have their own songs. |
| Artist-specific themes | Concert detail, artwork and player use the artist palette. |
| Clean mobile interface; minimal black dark mode | Implemented with safe areas, scrolling and restrained surfaces; complementary light palette available. |
| Simplified navigation | Discover, Saved and Profile tabs; concert detail and player open above tabs. Earlier three-page maximum was superseded by later explicit navbar/player requests. |
| Smooth animation | Native stack transitions and native-driver spring press feedback; respects Reduce Motion. Perceived smoothness remains subjective. |
| Haptic feedback | Implemented for presses and tabs; physical-device feel is not verified in simulator. |
| Time-based appearance | Automatic: light 07:00–18:59, dark otherwise; checks on foreground and every 30 seconds. |
| Profile appearance toggle | Light, Dark, Automatic controls with accessible selected state; shared app-wide preference stored locally. Dark selection survived simulator app reload. |
| Save button at image top right | Shared 48-point bookmark overlay on Discover, Saved and detail artwork. Save tap verified without opening concert. |
| Saved concerts | Local AsyncStorage persistence; Saved list and profile count use shared state. No account required. |
| Song opens music-player interface | Headliner and opening-act songs route to themed player, with working previous/next controls and close. Verified song selection/next in simulator. |
| Actual music playback | Not implemented or claimed: fictional tracks have no audio files. Disabled play control and explicit preview notice. |
| Commit each completed change to main | Adopted in `AGENTS.md`; initial prototype checkpoint committed with this audit. Future completed changes receive separate commits. |

## Validation and limits

Typecheck, ESLint, four fixture/daylight tests, and production web export are the automated checks. Simulator checks cover navigation, saving without navigation, song player/next, and persisted appearance. Automated tests do not cover every UI interaction. Android, physical-device haptics, full screen-reader navigation, and a real music provider have not been tested.

## Suggested presentation

1. Discover: explain that cards share typed Restyle primitives and tokens.
2. Save a concert, then open Saved to show the shared local state.
3. Open two different concerts to demonstrate per-artist palettes and composed artwork.
4. Open a song and use next/previous; clearly identify this as a player interface preview.
5. Profile → Appearance: switch light/dark to show coordinated styling across all screens.
6. Explain the boundary: Restyle is a styling system, not an audio, navigation, haptic or animation engine.

## Additional requested layout showcase

- Compact / Comfortable spacing: implemented through shared Restyle spacing tokens; defaults to Comfortable.
- User-controlled content size in Profile: Small / Medium / Large scales text and desktop content width, persists locally, and includes a live preview.
- Web resizing: fluid 100%-width containers capped by the selected content width; screens remain scrollable. No fixed minimum desktop width.
- Validation: lint, typecheck, web export passed; controls observed in simulator and browser. Full manual resize-and-toggle verification remains pending because browser interaction was interrupted.
