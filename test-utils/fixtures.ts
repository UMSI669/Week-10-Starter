import type { CharacterProfile, QuizAnswers } from '../src/types';
import { TRAITS } from '../src/types';
import { createInitialAnswers } from '../src/utils/scoring';

/**
 * Build answers exactly as a user would: five slider values (all confirmed),
 * one option per scenario, and two value selections.
 */
export function answersFrom(
  sliders: [number, number, number, number, number],
  obstacle: string,
  disagreement: string,
  values: [string, string],
): QuizAnswers {
  const answers = createInitialAnswers();
  TRAITS.forEach((trait, i) => {
    answers.sliders[trait] = { value: sliders[i], answered: true };
  });
  answers.scenarios.obstacle = obstacle;
  answers.scenarios.disagreement = disagreement;
  answers.values = values;
  return answers;
}

/** Valid, achievable answer sets that make each character the unique top match. */
export const REACHABILITY_FIXTURES: Record<string, QuizAnswers> = {
  harry: answersFrom([5, 3, 3, 4, 5], 'take-action', 'own-judgment', ['standing-up', 'true-to-yourself']),
  hermione: answersFrom([4, 5, 4, 4, 4], 'research', 'gather-info', ['discovering', 'achieving-goals']),
  ron: answersFrom([4, 3, 3, 4, 3], 'check-on-everyone', 'listen', ['helping-others', 'standing-up']),
  luna: answersFrom([4, 5, 2, 4, 5], 'research', 'own-judgment', ['discovering', 'true-to-yourself']),
  neville: answersFrom([5, 3, 2, 5, 3], 'check-on-everyone', 'speak-up', ['helping-others', 'standing-up']),
  draco: answersFrom([2, 3, 5, 2, 3], 'plan', 'gather-info', ['achieving-goals', 'discovering']),
  dobby: answersFrom([5, 3, 2, 5, 5], 'check-on-everyone', 'own-judgment', ['helping-others', 'true-to-yourself']),
};

export function makeProfile(
  id: string,
  scores: [number, number, number, number, number],
): CharacterProfile {
  const [courage, curiosity, ambition, empathy, independence] = scores;
  return {
    id,
    name: id,
    house: null,
    description: '',
    scores: { courage, curiosity, ambition, empathy, independence },
    apiId: `api-${id}`,
    apiAliases: [],
  };
}

// Shape mirrors data/characters.json in the HP-API repository.
// Image URLs here are placeholders, not real API data.
export const API_SAMPLE = [
  {
    id: '9e3f7ce4-b9a7-4244-b709-dae5c1f1d4a8',
    name: 'Harry Potter',
    species: 'human',
    house: 'Gryffindor',
    image: 'https://example.com/harry.jpg',
  },
  {
    id: '0d8ea37f-35c4-4c7d-9dd2-8ccd96b0a2b3',
    name: 'Dobby',
    species: 'house-elf',
    house: '',
    image: '',
  },
  { id: 'changed-id', name: 'Luna Lovegood', species: 'human', house: 'Ravenclaw', image: 'http://insecure.example/luna.jpg' },
  { name: '' },
  null,
  'junk',
];

