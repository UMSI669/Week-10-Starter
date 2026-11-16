# CFL Wizard Match

A fan-made Harry Potter personality quiz built for CFL’s React Native Elements component showcase.

Answer questions about your personality to discover which of seven characters is your closest match—including Dobby!

> This quiz is for entertainment only. Character profiles are our team’s interpretations, not official personality data or a scientific assessment.

## Project Goal

This project explores **React Native Elements inputs and selection components** through an interactive prototype.

Rather than building a large production app, we focused on how UI components work together to collect answers, validate selections, provide feedback, and display results.

## Features

The intended app experience includes:

- A wizard-name input with validation.
- Five personality sliders.
- Single-choice scenario questions.
- A values question requiring exactly two selections.
- Quiz progress and disabled submission until answers are complete.
- A loading state while revealing results.
- Character matches with an explanation and quiz-fit indicator.
- A searchable character explorer.
- A rating control for feedback on the match.
- Options to edit answers or retake the quiz.
- Local character details when live API data is unavailable.

Update this list to reflect the features implemented in the final app.

## Possible Matches

- Harry Potter
- Hermione Granger
- Ron Weasley
- Luna Lovegood
- Neville Longbottom
- Draco Malfoy
- Dobby

Dobby participates in the same matching process as every other character. Because he does not belong to a Hogwarts house, his card displays **“No Hogwarts house.”**

## Technology

The project is designed to use:

- React Native
- Expo
- TypeScript
- React Native Elements
- A public Harry Potter character API, if verified and integrated

See `package.json` for the actual dependencies and installed versions.

## Getting Started

### Prerequisites

- Node.js compatible with the project’s Expo version.
- The package manager used by the repository.
- A browser for the web demo.
- Optionally, Expo Go or a compatible mobile simulator.

### Installation

Clone your team’s repository and enter its directory:

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_FOLDER>
```

For an npm-based project:

```bash
npm install
```

### Run the App

For an Expo project:

```bash
npx expo start
```

Follow the terminal instructions to open the app on a supported device or simulator.

To start the web version:

```bash
npx expo start --web
```

If the starter repository uses different commands, replace these instructions with the scripts from `package.json`.

## How the Quiz Works

### Personality Traits

The quiz measures five traits on a scale from **1 to 5**:

- **Courage:** Willingness to act despite risk.
- **Curiosity:** Interest in learning and exploring.
- **Ambition:** Drive to achieve goals.
- **Empathy:** Attention to others’ feelings.
- **Independence:** Comfort following your own judgment.

### Questions and Scoring

Each trait has a slider. Scenario answers and selected values contribute smaller bonuses.

The planned scoring formula is:

```text
final trait score = clamp(slider value + 0.25 × bonus count, 1, 5)
```

Bonuses are calculated from the current answers, so changing a selection removes its previous contribution.

A slider’s initial value does not count as answered until the user moves it or explicitly confirms it.

### Character Profiles

Our hand-written profiles use the following scores:

| Character | Courage | Curiosity | Ambition | Empathy | Independence |
| --- | ---: | ---: | ---: | ---: | ---: |
| Harry Potter | 5 | 3 | 3 | 4 | 5 |
| Hermione Granger | 4 | 5 | 4 | 4 | 4 |
| Ron Weasley | 4 | 3 | 3 | 4 | 3 |
| Luna Lovegood | 4 | 5 | 2 | 4 | 5 |
| Neville Longbottom | 5 | 3 | 2 | 5 | 3 |
| Draco Malfoy | 2 | 3 | 5 | 2 | 3 |
| Dobby | 5 | 3 | 2 | 5 | 5 |

These scores are subjective design choices. A character match is not a judgment of the user’s morality.

### Finding a Match

The app compares the user’s scores with each character’s scores using **Manhattan distance**:

```text
distance = sum of the absolute differences across all five traits
```

The character with the smallest distance is the closest match. Characters tied for first place are shown as shared matches.

### Quiz Fit

The planned fit indicator is:

```text
quiz fit = round(100 × (1 − distance / 20))
```

The result is limited to 0–100.

**Quiz fit describes similarity to our profiles. It is not a probability, scientific confidence score, or measure of psychological accuracy.**

## React Native Elements Showcase

Each component has a specific role:

- **Input:** Collects the wizard name and displays validation feedback.
- **Slider:** Captures personality-trait answers.
- **ButtonGroup:** Supports single-choice scenario answers.
- **CheckBox:** Supports multiple values with a two-selection limit.
- **Button:** Demonstrates enabled, disabled, and loading states.
- **SearchBar:** Filters characters by name or house.
- **Rating:** Lets users indicate how well the match feels.
- **ThemeProvider:** Supports consistent component styling.

## Character API and Fallback Data

Personality matching uses local profiles. The API, when integrated, supplies character metadata such as names, houses, and images—not personality scores.

Before submission, add the verified details:

- **API provider:** <ADD VERIFIED PROVIDER OR “NOT INTEGRATED”>
- **Documentation:** <ADD VERIFIED DOCUMENTATION URL>
- **Integration status:** <DESCRIBE ACTUAL STATUS>

The intended fallback behavior is:

- Display local character details when requests fail.
- Use a placeholder when an image is missing or fails to load.
- Keep quiz results usable without the API.
- Use Dobby’s local details if the API does not include him.
- Clearly identify when local details are being displayed.

## Accessibility

The interface is designed to include:

- Visible labels and helpful validation messages.
- Numeric slider values and descriptive endpoints.
- Clear selection counts.
- Text explanations for disabled actions.
- Readable contrast and comfortable touch targets.
- Keyboard and screen-reader support where available.
- States that do not rely on color alone.

These are design goals, not a claim of formally audited accessibility compliance.

## Testing

Use the scripts available in `package.json`.

Document actual verification results before submission:

- **Type checking:** <RESULT OR “NOT RUN”>
- **Automated tests:** <RESULT OR “NOT RUN”>
- **Web build:** <RESULT OR “NOT RUN”>
- **Manual web demo:** <RESULT OR “NOT RUN”>
- **Mobile testing:** <RESULT OR “NOT RUN”>

Important cases to check:

- Invalid names prevent starting.
- Unanswered questions prevent submission.
- Users cannot select more than two values.
- Changing answers updates scores correctly.
- Tied matches display correctly.
- All seven characters can be matched through valid answers.
- Dobby renders without a Hogwarts house.
- API failures do not prevent results.
- Empty searches and missing images have helpful fallbacks.
- Editing preserves answers.
- Retaking resets answers while preserving the wizard name.

## Classroom Demo

1. Enter a wizard name and show validation.
2. Confirm a slider’s default value, then change another slider.
3. Answer a scenario using a button group.
4. Select two values and demonstrate the selection limit.
5. Show quiz progress and the disabled submit button.
6. Complete the quiz and reveal a result.
7. Explain character profiles, distance, and quiz fit.
8. Search for Dobby and show “No Hogwarts house.”
9. Rate the match.
10. Edit answers or retake the quiz.

## Limitations

- Character profiles are subjective fan interpretations.
- The quiz is not a validated personality assessment.
- Only seven characters are included.
- API availability and image coverage may vary.
- Results and feedback are not intended to require a backend.
- Supported platforms depend on the final implementation and testing.

## Team

**CFL**

- Monica Cichon
- Victor Fang
- Qier Long

## Acknowledgments

Harry Potter characters and setting belong to their respective rights holders. This is an unofficial educational fan project and is not affiliated with or endorsed by them.
