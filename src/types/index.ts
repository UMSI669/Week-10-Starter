/** The five traits measured by the quiz, in display order. */
export const TRAITS = ['courage', 'curiosity', 'ambition', 'empathy', 'independence'] as const;

export type Trait = (typeof TRAITS)[number];

/** A score for every trait. Final scores are always on a 1–5 scale. */
export type TraitScores = Record<Trait, number>;

/** Dobby has no Hogwarts house, so house may be null. */
export type House = 'Gryffindor' | 'Hufflepuff' | 'Ravenclaw' | 'Slytherin';

export interface CharacterProfile {
  /** Local, stable id used throughout the app. */
  id: string;
  name: string;
  house: House | null;
  /** Fan-written description (our interpretation, not official data). */
  description: string;
  scores: TraitScores;
  /** HP-API record id, verified against the API's published data file. */
  apiId: string;
  /** Extra exact names to accept if the API id ever changes. */
  apiAliases: string[];
}

export interface SliderAnswer {
  value: number;
  /** True only after the user moves or explicitly confirms the slider. */
  answered: boolean;
}

export interface ScenarioOption {
  id: string;
  label: string;
  trait: Trait;
}

export interface ScenarioQuestionData {
  id: string;
  prompt: string;
  options: ScenarioOption[];
}

export interface ValueOption {
  id: string;
  label: string;
  trait: Trait;
}

export interface SliderQuestionData {
  trait: Trait;
  title: string;
  prompt: string;
  minLabel: string;
  maxLabel: string;
}

export interface QuizAnswers {
  sliders: Record<Trait, SliderAnswer>;
  /** Scenario id → selected option id (null = unanswered). */
  scenarios: Record<string, string | null>;
  /** Selected value option ids (exactly two required). */
  values: string[];
}

/** Character metadata from the API after validation and normalization. */
export interface CharacterMetadata {
  apiId: string | null;
  name: string;
  house: string | null;
  species: string | null;
  imageUrl: string | null;
}

export type ApiStatus = 'idle' | 'success' | 'error';

export interface MetadataResult {
  status: 'success' | 'error';
  /** Local profile id → API metadata (only characters found in the API). */
  byProfileId: Record<string, CharacterMetadata>;
  errorMessage?: string;
}

export interface RankedMatch {
  profile: CharacterProfile;
  distance: number;
  /** "Quiz fit" 0–100. Not a probability. */
  fit: number;
  /** Competition rank: ties share a rank (1, 1, 3, ...). */
  rank: number;
}

export interface QuizResult {
  id: number;
  scores: TraitScores;
  ranked: RankedMatch[];
  topMatches: RankedMatch[];
  topThree: RankedMatch[];
  standoutTraits: Trait[];
  explanation: string;
  metadata: MetadataResult;
}
