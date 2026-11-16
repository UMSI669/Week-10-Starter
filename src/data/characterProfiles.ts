import type { CharacterProfile, TraitScores } from '../types';

/**
 * Hand-written, fan-made personality profiles.
 * These scores are our team's interpretations, not official personality data.
 * Order of the tuple: courage, curiosity, ambition, empathy, independence.
 */
function scores(
  courage: number,
  curiosity: number,
  ambition: number,
  empathy: number,
  independence: number,
): TraitScores {
  return { courage, curiosity, ambition, empathy, independence };
}

// apiId values were checked against data/characters.json in the HP-API
// repository (github.com/KostaSav/hp-api). If they ever change, the service
// falls back to exact-name matching (name + apiAliases).
export const CHARACTER_PROFILES: CharacterProfile[] = [
  {
    id: 'harry',
    name: 'Harry Potter',
    house: 'Gryffindor',
    scores: scores(5, 3, 3, 4, 5),
    description:
      'An action-oriented friend who values courage, connection, and following his own judgment.',
    apiId: '9e3f7ce4-b9a7-4244-b709-dae5c1f1d4a8',
    apiAliases: [],
  },
  {
    id: 'hermione',
    name: 'Hermione Granger',
    house: 'Gryffindor',
    scores: scores(4, 5, 4, 4, 4),
    description:
      'A thoughtful problem-solver who values learning, preparation, and working toward meaningful goals.',
    apiId: '4c7e6819-a91a-45b2-a454-f931e4a7cce3',
    apiAliases: [],
  },
  {
    id: 'ron',
    name: 'Ron Weasley',
    house: 'Gryffindor',
    scores: scores(4, 3, 3, 4, 3),
    description: 'A loyal companion who brings heart, humor, and courage to difficult situations.',
    apiId: 'c3b1f9a5-b87b-48bf-b00d-95b093ea6390',
    apiAliases: ['Ronald Weasley'],
  },
  {
    id: 'luna',
    name: 'Luna Lovegood',
    house: 'Ravenclaw',
    scores: scores(4, 5, 2, 4, 5),
    description: 'An independent thinker who embraces curiosity, originality, and kindness.',
    apiId: '861c4cde-2f0f-4796-8d8f-9492e74b2573',
    apiAliases: [],
  },
  {
    id: 'neville',
    name: 'Neville Longbottom',
    house: 'Gryffindor',
    scores: scores(5, 3, 2, 5, 3),
    description: 'A caring person whose courage grows when it matters most.',
    apiId: '3db6dc51-b461-4fa4-a6e4-b1ff352221c5',
    apiAliases: [],
  },
  {
    id: 'draco',
    name: 'Draco Malfoy',
    house: 'Slytherin',
    scores: scores(2, 3, 5, 2, 3),
    description:
      'A competitive, status-conscious character with a strong drive to prove himself.',
    apiId: 'af95bd8a-dfae-45bb-bc69-533860d34129',
    apiAliases: [],
  },
  {
    id: 'dobby',
    name: 'Dobby',
    // Dobby is not part of any Hogwarts house.
    house: null,
    scores: scores(5, 3, 2, 5, 5),
    description:
      'A fiercely loyal and caring character who values freedom, follows his convictions, and shows courage when helping others.',
    apiId: '0d8ea37f-35c4-4c7d-9dd2-8ccd96b0a2b3',
    apiAliases: [],
  },
];

export const NO_HOUSE_LABEL = 'No Hogwarts house';

export function houseLabel(house: string | null | undefined): string {
  return house && house.trim() ? house : NO_HOUSE_LABEL;
}
