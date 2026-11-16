import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import App from '../App';
import { resetMetadataCache } from '../src/services/characterApi';
import { API_SAMPLE } from '../test-utils/fixtures';

type Answers = {
  sliders: [number, number, number, number, number];
  obstacle: string;
  disagreement: string;
  values: [string, string];
};

const TRAIT_TITLES = ['Courage', 'Curiosity', 'Ambition', 'Empathy', 'Independence'];
const DOBBY: Answers = {
  sliders: [5, 3, 2, 5, 5],
  obstacle: 'Check on everyone',
  disagreement: 'Follow my judgment',
  values: ['Helping others', 'Being true to yourself'],
};
const HARRY: Answers = {
  sliders: [5, 3, 3, 4, 5],
  obstacle: 'Take action',
  disagreement: 'Follow my judgment',
  values: ["Standing up for what's right", 'Being true to yourself'],
};

function mockFetch(impl: () => Promise<unknown>) {
  const fn = jest.fn(impl);
  (globalThis as unknown as { fetch: unknown }).fetch = fn;
  return fn;
}
const okResponse = (body: unknown) => async () => ({ ok: true, status: 200, json: async () => body });

function startQuiz(name = 'Minerva') {
  fireEvent.changeText(screen.getByTestId('name-input'), name);
  fireEvent.press(screen.getByText('Begin quiz'));
}

function answerQuiz(a: Answers) {
  a.sliders.forEach((value, i) => {
    const title = TRAIT_TITLES[i];
    if (value === 3) fireEvent.press(screen.getByLabelText(`Use 3 as my ${title} answer`));
    for (let n = 0; n < Math.abs(value - 3); n++) {
      fireEvent.press(screen.getByLabelText(`${value > 3 ? 'Increase' : 'Decrease'} ${title}`));
    }
  });
  fireEvent.press(screen.getByText(a.obstacle));
  fireEvent.press(screen.getByText(a.disagreement));
  a.values.forEach((v) => fireEvent.press(screen.getByText(v)));
}

const revealButton = () => screen.getByLabelText(/Reveal my match|Consulting the Sorting Hat/);

async function reveal() {
  await act(async () => {
    fireEvent.press(revealButton());
  });
  await screen.findByText(/^Your match, /);
}

beforeEach(() => {
  resetMetadataCache();
});

it('1. invalid name prevents starting', () => {
  mockFetch(okResponse(API_SAMPLE));
  render(<App />);
  expect(screen.getByRole('button', { name: /Begin quiz/ })).toBeDisabled();
  fireEvent.changeText(screen.getByTestId('name-input'), '   ');
  expect(screen.getByText(/Please enter a wizard name/)).toBeTruthy();
  expect(screen.getByRole('button', { name: /Begin quiz/ })).toBeDisabled();
  fireEvent.press(screen.getByText('Begin quiz'));
  expect(screen.queryByText(/Part 1/)).toBeNull();
});

it('2–3. unconfirmed default sliders do not count; all answers enable submission', () => {
  mockFetch(okResponse(API_SAMPLE));
  render(<App />);
  startQuiz();
  expect(screen.getByTestId('progress-text')).toHaveTextContent('Progress: 0 of 8 answered');
  expect(revealButton()).toBeDisabled();

  fireEvent.press(screen.getByLabelText('Use 3 as my Courage answer'));
  expect(screen.getByTestId('progress-text')).toHaveTextContent('Progress: 1 of 8 answered');

  // Third value is blocked with an explanation.
  fireEvent.press(screen.getByText('Helping others'));
  fireEvent.press(screen.getByText('Discovering new things'));
  fireEvent.press(screen.getByText('Achieving your goals'));
  expect(screen.getByTestId('values-count')).toHaveTextContent('2 of 2 selected');
  expect(screen.getByText(/You can choose only two/)).toBeTruthy();
  fireEvent.press(screen.getByText('Helping others'));
  fireEvent.press(screen.getByText('Discovering new things'));
  expect(screen.getByTestId('values-count')).toHaveTextContent('0 of 2 selected');

  answerQuiz(HARRY);
  expect(screen.getByTestId('progress-text')).toHaveTextContent('Progress: 8 of 8 answered');
  expect(revealButton()).not.toBeDisabled();
});

it('4. loading state disables duplicate submissions', async () => {
  let resolve!: (v: unknown) => void;
  const fetchFn = mockFetch(() => new Promise((r) => (resolve = r)));
  render(<App />);
  startQuiz();
  answerQuiz(HARRY);
  fireEvent.press(revealButton());
  expect(await screen.findByTestId('loading-text')).toHaveTextContent('Consulting the Sorting Hat…');
  expect(revealButton()).toBeDisabled();
  fireEvent.press(revealButton());
  expect(fetchFn).toHaveBeenCalledTimes(1);
  await act(async () => resolve({ ok: true, status: 200, json: async () => API_SAMPLE }));
  expect(await screen.findByText('Your match, Minerva')).toBeTruthy();
});

it('5. results render when the API succeeds', async () => {
  mockFetch(okResponse(API_SAMPLE));
  render(<App />);
  startQuiz();
  answerQuiz(HARRY);
  await reveal();
  expect(screen.getAllByTestId('character-card-harry').length).toBe(2); // result + explorer
  expect(screen.queryByTestId('fallback-note')).toBeNull();
  expect(screen.getAllByTestId('character-image').length).toBeGreaterThan(0);
  expect(screen.getByText(/Quiz fit reflects similarity/)).toBeTruthy();
});

it('6. results still render when the API fails', async () => {
  mockFetch(() => Promise.reject(new Error('offline')));
  render(<App />);
  startQuiz();
  answerQuiz(HARRY);
  await reveal();
  expect(screen.getByTestId('fallback-note')).toHaveTextContent(
    /Showing local character details; live data is unavailable\./,
  );
  expect(screen.getAllByText('Harry Potter').length).toBeGreaterThan(0);
});

it('7–8. Dobby renders without an API record; broken images fall back', async () => {
  const withoutDobby = API_SAMPLE.filter(
    (r) => !(r && typeof r === 'object' && 'name' in r && r.name === 'Dobby'),
  );
  mockFetch(okResponse(withoutDobby));
  render(<App />);
  startQuiz();
  answerQuiz(DOBBY);
  await reveal();
  const card = screen.getAllByTestId('character-card-dobby')[0];
  expect(card).toHaveTextContent(/No Hogwarts house/);
  expect(screen.getAllByTestId('local-note-dobby').length).toBeGreaterThan(0);

  // Harry has an image in the sample; simulate it failing to load.
  const images = screen.getAllByTestId('character-image');
  const placeholdersBefore = screen.getAllByTestId('character-placeholder').length;
  fireEvent(images[0], 'error');
  expect(screen.getAllByTestId('character-placeholder').length).toBe(placeholdersBefore + 1);
});

it('9. search with no matches shows an empty state; Dobby is searchable', async () => {
  mockFetch(okResponse(API_SAMPLE));
  render(<App />);
  startQuiz();
  answerQuiz(HARRY);
  await reveal();
  const search = screen.getByPlaceholderText('Name or house');
  fireEvent.changeText(search, 'No Hogwarts house');
  expect(screen.getByText('Showing 1 of 7 characters')).toBeTruthy();
  fireEvent.changeText(search, 'basilisk');
  expect(screen.getByTestId('explorer-empty')).toBeTruthy();
  fireEvent.press(screen.getByText('Clear search'));
  expect(screen.getByText('Showing 7 of 7 characters')).toBeTruthy();
});

it('10–11. editing preserves answers; retaking resets them but keeps the name', async () => {
  mockFetch(okResponse(API_SAMPLE));
  render(<App />);
  startQuiz('Minerva');
  answerQuiz(HARRY);
  await reveal();

  fireEvent.press(screen.getByLabelText('Raise rating by one star'));
  expect(screen.getByTestId('rating-text')).toHaveTextContent('You rated it 1 of 5 stars');

  fireEvent.press(screen.getByText('Edit answers'));
  expect(screen.getByTestId('progress-text')).toHaveTextContent('Progress: 8 of 8 answered');
  expect(screen.getByText('Selected: Take action')).toBeTruthy();

  // Re-submitting creates a new result and clears the feedback rating.
  await reveal();
  expect(screen.getByTestId('rating-text')).toHaveTextContent('Not rated yet');

  fireEvent.press(screen.getByText('Retake quiz'));
  expect(screen.getByText('Welcome, Minerva')).toBeTruthy();
  expect(screen.getByTestId('progress-text')).toHaveTextContent('Progress: 0 of 8 answered');
  expect(screen.getByTestId('values-count')).toHaveTextContent('0 of 2 selected');
});
