/**
 * Scoring and matching for CFL Wizard Match.
 *
 * This is a simple, hand-designed ENTERTAINMENT model, not a validated
 * personality assessment. Everything here is a pure function so it can be
 * unit-tested and explained line by line.
 *
 *   finalScore(trait) = clamp(sliderValue + 0.25 * bonusCount, 1, 5)
 *   distance          = sum over traits of |user - character|   (Manhattan)
 *   quizFit           = clamp(round(100 * (1 - distance / 20)), 0, 100)
 */
import {
  REQUIRED_VALUE_COUNT,
  SCENARIO_QUESTIONS,
  SLIDER_QUESTIONS,
  TRAIT_LABELS,
  VALUE_OPTIONS,
} from '../data/quizQuestions';
import { TRAITS } from '../types';
import type {
  CharacterProfile,
  MetadataResult,
  QuizAnswers,
  QuizResult,
  RankedMatch,
  Trait,
  TraitScores,
} from '../types';

export const BONUS_WEIGHT = 0.25;
export const MIN_SCORE = 1;
export const MAX_SCORE = 5;
export const DEFAULT_SLIDER_VALUE = 3;
/** Largest possible distance: 5 traits × (5 − 1). */
export const MAX_DISTANCE = TRAITS.length * (MAX_SCORE - MIN_SCORE);
/** Distances closer than this are treated as ties (guards float rounding). */
export const TIE_TOLERANCE = 1e-6;
export const TOTAL_REQUIREMENTS = SLIDER_QUESTIONS.length + SCENARIO_QUESTIONS.length + 1;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function zeroScores(): TraitScores {
  return { courage: 0, curiosity: 0, ambition: 0, empathy: 0, independence: 0 };
}

/** Fresh answers: sliders shown at 3 but NOT answered, nothing selected. */
export function createInitialAnswers(): QuizAnswers {
  const sliders = {} as QuizAnswers['sliders'];
  for (const trait of TRAITS) {
    sliders[trait] = { value: DEFAULT_SLIDER_VALUE, answered: false };
  }
  const scenarios: QuizAnswers['scenarios'] = {};
  for (const scenario of SCENARIO_QUESTIONS) {
    scenarios[scenario.id] = null;
  }
  return { sliders, scenarios, values: [] };
}

/**
 * Bonuses are always derived from the CURRENT selections, so changing an
 * answer can never leave a stale bonus behind.
 */
export function computeBonusCounts(answers: QuizAnswers): TraitScores {
  const counts = zeroScores();
  for (const scenario of SCENARIO_QUESTIONS) {
    const selectedId = answers.scenarios[scenario.id];
    const option = scenario.options.find((o) => o.id === selectedId);
    if (option) counts[option.trait] += 1;
  }
  for (const valueId of answers.values) {
    const option = VALUE_OPTIONS.find((o) => o.id === valueId);
    if (option) counts[option.trait] += 1;
  }
  return counts;
}

export function computeFinalScores(answers: QuizAnswers): TraitScores {
  const bonuses = computeBonusCounts(answers);
  const scores = zeroScores();
  for (const trait of TRAITS) {
    const slider = Math.round(clamp(answers.sliders[trait].value, MIN_SCORE, MAX_SCORE));
    scores[trait] = clamp(slider + BONUS_WEIGHT * bonuses[trait], MIN_SCORE, MAX_SCORE);
  }
  return scores;
}

export interface CompletionStatus {
  confirmedSliders: number;
  answeredScenarios: number;
  valuesComplete: boolean;
  completed: number;
  total: number;
  isComplete: boolean;
  /** Short human-readable list of what is still missing. */
  missing: string[];
}

export function getCompletion(answers: QuizAnswers): CompletionStatus {
  const unconfirmed = SLIDER_QUESTIONS.filter((q) => !answers.sliders[q.trait].answered);
  const unansweredScenarios = SCENARIO_QUESTIONS.filter((s) => !answers.scenarios[s.id]);
  const valuesComplete = answers.values.length === REQUIRED_VALUE_COUNT;

  const missing: string[] = [];
  if (unconfirmed.length > 0) {
    const names = unconfirmed.map((q) => q.title.toLowerCase());
    missing.push(
      `${unconfirmed.length} ${unconfirmed.length === 1 ? 'slider' : 'sliders'} to confirm (${joinList(names)})`,
    );
  }
  if (unansweredScenarios.length > 0) {
    missing.push(
      `${unansweredScenarios.length} ${unansweredScenarios.length === 1 ? 'scenario' : 'scenarios'} to answer`,
    );
  }
  if (!valuesComplete) {
    const left = REQUIRED_VALUE_COUNT - answers.values.length;
    missing.push(`${left} more ${left === 1 ? 'value' : 'values'} to choose`);
  }

  const confirmedSliders = SLIDER_QUESTIONS.length - unconfirmed.length;
  const answeredScenarios = SCENARIO_QUESTIONS.length - unansweredScenarios.length;
  const completed = confirmedSliders + answeredScenarios + (valuesComplete ? 1 : 0);
  return {
    confirmedSliders,
    answeredScenarios,
    valuesComplete,
    completed,
    total: TOTAL_REQUIREMENTS,
    isComplete: completed === TOTAL_REQUIREMENTS,
    missing,
  };
}

/** Toggle a value option while enforcing the two-selection limit. */
export function toggleValue(
  selected: string[],
  valueId: string,
): { values: string[]; blocked: boolean } {
  if (selected.includes(valueId)) {
    return { values: selected.filter((id) => id !== valueId), blocked: false };
  }
  if (selected.length >= REQUIRED_VALUE_COUNT) {
    return { values: selected, blocked: true };
  }
  return { values: [...selected, valueId], blocked: false };
}

export function manhattanDistance(a: TraitScores, b: TraitScores): number {
  return TRAITS.reduce((sum, trait) => sum + Math.abs(a[trait] - b[trait]), 0);
}

export function quizFit(distance: number): number {
  return clamp(Math.round(100 * (1 - distance / MAX_DISTANCE)), 0, 100);
}

function isTie(a: number, b: number): boolean {
  return Math.abs(a - b) <= TIE_TOLERANCE;
}

/**
 * Rank every profile by ascending distance. Ties (within tolerance) share a
 * rank; original profile order is only used to keep display order stable.
 */
export function rankMatches(scores: TraitScores, profiles: CharacterProfile[]): RankedMatch[] {
  const sorted = profiles
    .map((profile, index) => ({ profile, index, distance: manhattanDistance(scores, profile.scores) }))
    .sort((a, b) => (isTie(a.distance, b.distance) ? a.index - b.index : a.distance - b.distance));

  const ranked: RankedMatch[] = [];
  sorted.forEach((item, position) => {
    const previous = ranked[position - 1];
    const rank =
      previous && isTie(previous.distance, item.distance) ? previous.rank : position + 1;
    ranked.push({ profile: item.profile, distance: item.distance, fit: quizFit(item.distance), rank });
  });
  return ranked;
}

/** All characters tied for first place. */
export function getTopMatches(ranked: RankedMatch[]): RankedMatch[] {
  return ranked.filter((m) => m.rank === 1);
}

/**
 * The top `count` matches, plus anyone tied at the cutoff so no tied
 * character is arbitrarily hidden.
 */
export function getTopRanked(ranked: RankedMatch[], count = 3): RankedMatch[] {
  if (ranked.length <= count) return ranked;
  const cutoff = ranked[count - 1].distance;
  return ranked.filter((m, i) => i < count || isTie(m.distance, cutoff));
}

/** The user's top two traits, plus any trait tied with second place. */
export function getStandoutTraits(scores: TraitScores, count = 2): Trait[] {
  const sorted = [...TRAITS].sort((a, b) => scores[b] - scores[a]);
  const cutoff = scores[sorted[count - 1]];
  return sorted.filter((t, i) => i < count || isTie(scores[t], cutoff));
}

export function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

const TRAIT_PHRASES: Record<Trait, string> = {
  courage: 'are willing to step forward when things feel uncertain',
  curiosity: 'enjoy exploring ideas',
  ambition: 'like working toward challenging goals',
  empathy: 'consider how others feel',
  independence: 'are comfortable trusting your own judgment',
};

/** Templated explanation tied only to the user's own standout traits. */
export function explainTraits(traits: Trait[]): string {
  if (traits.length === 0) return '';
  const names = traits.map((t, i) =>
    i === 0 ? TRAIT_LABELS[t] : TRAIT_LABELS[t].toLowerCase(),
  );
  const lead =
    traits.length === TRAITS.length
      ? 'Your answers were balanced across all five traits.'
      : `${joinList(names)} stood out in your answers.`;
  const phrases = traits.map((t) => TRAIT_PHRASES[t]);
  return `${lead} Based on this quiz, you ${joinList(phrases)}.`;
}

/** Combine everything the Results screen needs. Pure and deterministic. */
export function buildQuizResult(
  answers: QuizAnswers,
  profiles: CharacterProfile[],
  metadata: MetadataResult,
  id: number,
): QuizResult {
  const scores = computeFinalScores(answers);
  const ranked = rankMatches(scores, profiles);
  const standoutTraits = getStandoutTraits(scores);
  return {
    id,
    scores,
    ranked,
    topMatches: getTopMatches(ranked),
    topThree: getTopRanked(ranked, 3),
    standoutTraits,
    explanation: explainTraits(standoutTraits),
    metadata,
  };
}

/** Format scores like 4, 4.25, 3.5 without trailing zeros. */
export function formatScore(value: number): string {
  return String(Math.round(value * 100) / 100);
}
