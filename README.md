# CFL Wizard Match

A fan-made Harry Potter character personality quiz built by **CFL** to showcase **React Native Elements inputs and selection components**.

> For entertainment only. Character traits are our interpretations, not official personality data or a scientific assessment.

The app is a single page with three stages (Welcome → Quiz → Results), managed with React state. It needs no backend, accounts, or secrets.

## Setup and run

Requires Node.js 22.13+ (Expo SDK 58 requirement) and npm.

```bash
npm install          # uses package-lock.json
npm run web          # Expo dev server + opens the web app (best for the Zoom demo)
npm start            # Expo dev server; scan the QR code with Expo Go, or press i / a for a simulator
```

Other scripts:

```bash
npm test             # Jest: logic + interaction tests
npm run typecheck    # tsc --noEmit
npm run build:web    # static web build into dist/
```

### Web demo tips

- Run `npm run web`, then open the printed `localhost` URL in Chrome.
- Share only the browser window on Zoom and zoom the page to 110–125% for readability. The layout stays centered with a 760 px max width.

## Library versions

| Package | Version |
| --- | --- |
| expo | 58.0.25 |
| react / react-dom | 19.3.0 |
| react-native | 0.88.1 |
| react-native-web | 0.21.4 |
| @rneui/themed / @rneui/base | 5.0.0 |
| @expo/vector-icons | 15.1.1 |
| react-native-safe-area-context | 5.11.1 |
| typescript | 6.0.3 |
| jest / jest-expo | 30.5.2 / 58.0.14 |
| @testing-library/react-native | 13.3.3 |

Notes on React Native Elements 5:

- Imports come from `@rneui/themed`, following RNE 5's documented API. No legacy `react-native-elements` imports are used.
- RNE 5 looks for icons in `@react-native-vector-icons/*`. We register Expo's bundled icon sets through RNE's `registerCustomIconType` instead (`src/theme/icons.ts`).
- RNE 5 lists `@testing-library/*` and `react-test-renderer` as peer dependencies. They're installed as dev dependencies, with `react-test-renderer` pinned to match React 19.3.0, so `npm install` succeeds without `--legacy-peer-deps`.

## Component showcase checklist

| Component | Where | What it demonstrates |
| --- | --- | --- |
| `Input` | Welcome | Labeled “Wizard name”, 30-char limit, validation message after interaction |
| `Button` (disabled) | Welcome, Quiz | “Begin quiz” and “Reveal my match” stay disabled until the input is valid |
| `Button` (loading) | Quiz | “Consulting the Sorting Hat…” while metadata loads; blocks duplicate submits |
| `Slider` | Quiz | Five 1–5 integer sliders with numeric value, endpoint labels, −/+ and “Use this value” |
| `ButtonGroup` | Quiz | Two single-choice scenarios (vertical on narrow screens) |
| `CheckBox` | Quiz | Values question limited to exactly two choices, with a count and limit message |
| `LinearProgress` | Quiz | Progress toward 8 requirements |
| `Rating` | Results | “How well does this match feel?” (local state only) |
| `SearchBar` | Results | Character explorer that searches by name or house |
| `ThemeProvider` / `createTheme` | App | Shared navy, cream, and gold styling (`src/theme/index.ts`) |

## How scoring works

This is a simple, hand-designed **entertainment model** (`src/utils/scoring.ts`, all pure functions).

1. **Traits:** courage, curiosity, ambition, empathy, independence.
2. **Sliders** give each trait a value from 1 to 5. A slider starts at 3 but only counts once it's moved or confirmed.
3. **Bonuses:** each scenario answer and each chosen value points to one trait. Bonuses are recomputed from current selections every time, so changed answers never leave stale bonuses.
   `finalScore = clamp(sliderValue + 0.25 × bonusCount, 1, 5)`
4. **Distance:** Manhattan distance to each profile, the sum of `|user − character|` across the five traits.
5. **Ranking:** ascending distance. Distances within `1e-6` count as ties. All first-place ties are shown as shared matches, and anyone tied at the third-place cutoff is included in “Closest matches.” Profile order is used only for stable display among ties.
6. **Quiz fit:** `clamp(round(100 × (1 − distance / 20)), 0, 100)`. This reflects similarity to our hand-written profiles. It is not a probability, accuracy, or scientific confidence.

## The seven possible matches

Scores are our fan interpretations (courage, curiosity, ambition, empathy, independence):

| Character | House | Scores |
| --- | --- | --- |
| Harry Potter | Gryffindor | 5, 3, 3, 4, 5 |
| Hermione Granger | Gryffindor | 4, 5, 4, 4, 4 |
| Ron Weasley | Gryffindor | 4, 3, 3, 4, 3 |
| Luna Lovegood | Ravenclaw | 4, 5, 2, 4, 5 |
| Neville Longbottom | Gryffindor | 5, 3, 2, 5, 3 |
| Draco Malfoy | Slytherin | 2, 3, 5, 2, 3 |
| Dobby | No Hogwarts house | 5, 3, 2, 5, 5 |

Dobby is a full match option. He takes part in scoring, ranking, results, and search. His house is `null` and displays as **“No Hogwarts house.”** His higher independence score separates him from Neville. Each of the seven characters is the unique top match for at least one valid answer set (see `test-utils/fixtures.ts`).

## Character API

- **Provider:** HP-API, `https://hp-api.onrender.com/api/characters` (adapter in `src/services/characterApi.ts`)
- **Docs and source:** https://hp-api.onrender.com/ and https://github.com/KostaSav/hp-api
- **What was verified:** the endpoint, response schema (`id`, `name`, `species`, `house`, `image`, …), and `Access-Control-Allow-Origin: *` were checked in the API's open-source repo (`server.js`, `data/characters.json`). That data includes all seven characters, so each profile stores its verified HP-API `id`. Dobby's record has `species: "house-elf"`, an empty `house`, and an empty `image`.
- **What was not verified:** our build environment's network blocked the live host, so no live HTTP request was made during development. Run the app once with internet to confirm.

The API supplies **metadata only** (house, species, image). Personality scores always come from local profiles.

### Fallback behavior

- The character list is requested once per session (started when the app loads), cached in memory, and capped by an 8-second timeout.
- HTTP errors, network failures, timeouts, and malformed responses all produce a normal result screen with the note *“Showing local character details; live data is unavailable.”*
- Records are validated and normalized. Empty strings become `null`, and only `https://` image URLs are used.
- Matching uses the verified `id` first, then the exact normalized name or alias.
- If the API loads but a character is missing, only that card says it uses local details.
- A missing or broken image shows an initials placeholder.
- Only successful responses are cached, so a later submission can retry after a failure.

## Testing

`npm test` runs 46 Jest tests in 4 suites:

- `__tests__/scoring.test.ts`: distance, clamping, bonus recalculation, completion rules, the two-value limit, ties, stable ranking, cutoff ties, the 0–100 fit range, explanations, and **reachability of all seven characters** from real slider, scenario, and value selections.
- `__tests__/search.test.ts`: case and whitespace handling, house search, null houses, and Dobby / “No Hogwarts house.”
- `__tests__/characterApi.test.ts`: normalization, id/name matching, HTTP errors, malformed JSON, network failure, timeout, and caching.
- `__tests__/App.test.tsx`: interaction flows for name validation, unconfirmed sliders, enabling submit, loading and duplicate prevention, API success, API failure, Dobby without an API record, broken-image fallback, search empty state, edit (answers kept, rating cleared) and retake (answers reset, name kept).

## Accessibility notes

- Every input has a visible label. Placeholders are only examples.
- States never rely on color alone: sliders show “✓ Answered” / “○ Not answered,” the chosen scenario gets a ✓ plus a “Selected: …” line, checked values get a bold border and a count, errors start with ⚠, and disabled buttons use a dashed outline with an explanation underneath.
- Sliders expose an accessible label, hint, and increment/decrement actions. The −/+ buttons make them fully keyboard-operable on web.
- Touch targets are at least 48 px, and text is cream on navy with gold accents.

These are design goals, not a formal accessibility audit.

## Known limitations

- Profiles are subjective fan interpretations, and the quiz is not a validated assessment.
- The live HP-API request hasn't been tested from our build environment (see above). The free host may be slow to wake up, in which case the 8-second timeout falls back to local details.
- HP-API's images are portraits hosted by the API. They load at runtime and aren't bundled with the app.
- RNE's `Rating` is swipe/tap-based, so the −/+ buttons next to it provide keyboard and screen-reader control.
- RNE's `ButtonGroup` doesn't expose a per-option “selected” state to screen readers, so the “Selected: …” line announces it instead.
- iOS and Android haven't been run on a device or simulator here. The code uses only Expo Go–compatible modules.

## Classroom demo script (≈5 minutes)

1. Type only spaces in **Wizard name** to show the validation message and disabled **Begin quiz**, then enter a real name.
2. On **Courage**, press **Use this value (3)**. Point out “✓ Answered” and the progress count.
3. Drag the **Curiosity** slider (or use −/+) and watch the value change.
4. Choose a **ButtonGroup** scenario answer, then change it.
5. Check two values, then try a third to show the explanation and “2 of 2 selected.”
6. Scroll to the progress card: the **Reveal my match** button stays disabled and lists what's missing.
7. Finish the quiz and press **Reveal my match** to show “Consulting the Sorting Hat…”.
8. Explain the result, standout traits, and **Quiz fit**, and open **How matching works**.
9. In **Explore the characters**, search “Dobby” and then “No Hogwarts house.”
10. Rate the match with the **Rating** stars.
11. Press **Edit answers** (answers kept), or **Retake quiz** (answers reset, name kept).

Dobby answer set: Courage 5, Curiosity 3, Ambition 2, Empathy 5, Independence 5 · “Check on everyone” · “Follow my judgment” · “Helping others” + “Being true to yourself.”

## Project structure

```
App.tsx                      stage state (welcome / quiz / results), layout, submit logic
src/components/              TraitSlider, ScenarioQuestion, ValuesQuestion, CharacterCard, CharacterExplorer, Panel
src/screens/                 WelcomeScreen, QuizScreen, ResultsScreen
src/data/                    characterProfiles.ts, quizQuestions.ts
src/services/characterApi.ts HP-API adapter (timeout, validation, cache)
src/utils/                   scoring.ts (pure model), search.ts
src/types/                   shared types (+ a tiny icon-type shim for RNE 5)
src/theme/                   RNE theme + icon registration
__tests__/, test-utils/      Jest tests and answer fixtures
```

## Team

**CFL**: Monica Cichon, Victor Fang, Qier Long

Harry Potter characters and setting belong to their respective rights holders. This is an unofficial educational fan project, not affiliated with or endorsed by them.
