import { CHARACTER_PROFILES } from '../src/data/characterProfiles';
import type { MetadataResult, TraitScores } from '../src/types';
import {
  buildQuizResult,
  computeBonusCounts,
  computeFinalScores,
  createInitialAnswers,
  explainTraits,
  getCompletion,
  getStandoutTraits,
  getTopMatches,
  getTopRanked,
  manhattanDistance,
  quizFit,
  rankMatches,
  toggleValue,
} from '../src/utils/scoring';
import { REACHABILITY_FIXTURES, answersFrom, makeProfile } from '../test-utils/fixtures';

const scores = (a: number, b: number, c: number, d: number, e: number): TraitScores => ({
  courage: a,
  curiosity: b,
  ambition: c,
  empathy: d,
  independence: e,
});
const noMeta: MetadataResult = { status: 'error', byProfileId: {} };

describe('distance and fit', () => {
  it('gives zero distance for identical profiles', () => {
    expect(manhattanDistance(scores(5, 3, 3, 4, 5), scores(5, 3, 3, 4, 5))).toBe(0);
  });

  it('sums absolute differences across all five traits', () => {
    expect(manhattanDistance(scores(1, 2, 3, 4, 5), scores(5, 4, 3, 2, 1))).toBe(12);
    expect(manhattanDistance(scores(4.25, 3, 3, 4.75, 3), scores(4, 3, 3, 4, 3))).toBeCloseTo(1);
  });

  it('keeps quiz fit within 0–100', () => {
    expect(quizFit(0)).toBe(100);
    expect(quizFit(20)).toBe(0);
    expect(quizFit(25)).toBe(0);
    expect(quizFit(-3)).toBe(100);
    expect(quizFit(1)).toBe(95);
    for (let d = 0; d <= 20; d += 0.25) {
      const fit = quizFit(d);
      expect(fit).toBeGreaterThanOrEqual(0);
      expect(fit).toBeLessThanOrEqual(100);
    }
  });
});

describe('final scores', () => {
  it('stay within 1–5 even with every bonus stacked on one trait', () => {
    const maxed = answersFrom([5, 1, 1, 1, 1], 'take-action', 'speak-up', ['standing-up', 'helping-others']);
    const result = computeFinalScores(maxed);
    expect(result.courage).toBe(5);
    Object.values(result).forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(5);
    });
  });

  it('adds 0.25 per current bonus', () => {
    const a = answersFrom([3, 3, 3, 3, 3], 'take-action', 'speak-up', ['standing-up', 'helping-others']);
    expect(computeFinalScores(a)).toEqual(scores(3.75, 3, 3, 3.25, 3));
  });

  it('recalculates bonuses when answers change (no stale bonuses)', () => {
    const a = answersFrom([3, 3, 3, 3, 3], 'take-action', 'speak-up', ['standing-up', 'helping-others']);
    expect(computeBonusCounts(a).courage).toBe(3);
    const changed = { ...a, scenarios: { ...a.scenarios, obstacle: 'research' }, values: ['discovering', 'helping-others'] };
    const bonuses = computeBonusCounts(changed);
    expect(bonuses.courage).toBe(1);
    expect(bonuses.curiosity).toBe(2);
    expect(computeFinalScores(changed).courage).toBe(3.25);
  });
});

describe('completion', () => {
  it('does not count default slider values as answered', () => {
    const fresh = createInitialAnswers();
    const status = getCompletion(fresh);
    expect(fresh.sliders.courage.value).toBe(3);
    expect(status.confirmedSliders).toBe(0);
    expect(status.completed).toBe(0);
    expect(status.total).toBe(8);
    expect(status.isComplete).toBe(false);
  });

  it('detects incomplete quizzes and lists what remains', () => {
    const a = REACHABILITY_FIXTURES.harry;
    const missingScenario = { ...a, scenarios: { ...a.scenarios, disagreement: null } };
    const status = getCompletion(missingScenario);
    expect(status.isComplete).toBe(false);
    expect(status.completed).toBe(7);
    expect(status.missing.join(' ')).toMatch(/1 scenario to answer/);
  });

  it('requires exactly two values', () => {
    const a = REACHABILITY_FIXTURES.harry;
    expect(getCompletion(a).isComplete).toBe(true);
    expect(getCompletion({ ...a, values: ['standing-up'] }).isComplete).toBe(false);
    expect(getCompletion({ ...a, values: [] }).isComplete).toBe(false);
  });

  it('blocks a third value and allows unchecking', () => {
    expect(toggleValue(['a', 'b'], 'c')).toEqual({ values: ['a', 'b'], blocked: true });
    expect(toggleValue(['a', 'b'], 'a')).toEqual({ values: ['b'], blocked: false });
    expect(toggleValue(['a'], 'c')).toEqual({ values: ['a', 'c'], blocked: false });
  });
});

describe('ranking and ties', () => {
  const user = scores(3, 3, 3, 3, 3);

  it('ranks by ascending distance with stable order', () => {
    const profiles = [makeProfile('far', [5, 5, 5, 5, 5]), makeProfile('near', [3, 3, 3, 3, 4]), makeProfile('exact', [3, 3, 3, 3, 3])];
    expect(rankMatches(user, profiles).map((m) => m.profile.id)).toEqual(['exact', 'near', 'far']);
  });

  it('treats near-equal distances as ties and shows all first-place ties', () => {
    const profiles = [makeProfile('a', [4, 3, 3, 3, 3]), makeProfile('b', [3, 3, 3, 3, 2]), makeProfile('c', [5, 5, 3, 3, 3])];
    const ranked = rankMatches(scores(3 + 1e-9, 3, 3, 3, 3), profiles);
    const top = getTopMatches(ranked);
    expect(top.map((m) => m.profile.id)).toEqual(['a', 'b']);
    expect(ranked.map((m) => m.rank)).toEqual([1, 1, 3]);
  });

  it('uses original order only for display among ties', () => {
    const profiles = [makeProfile('first', [4, 3, 3, 3, 3]), makeProfile('second', [2, 3, 3, 3, 3])];
    const ranked = rankMatches(user, profiles);
    expect(ranked.map((m) => m.profile.id)).toEqual(['first', 'second']);
    expect(getTopMatches(ranked)).toHaveLength(2);
  });

  it('includes characters tied at the third-place cutoff', () => {
    const profiles = [
      makeProfile('p1', [3, 3, 3, 3, 3]),
      makeProfile('p2', [4, 3, 3, 3, 3]),
      makeProfile('p3', [3, 4, 3, 3, 4]),
      makeProfile('p4', [3, 3, 5, 3, 3]),
      makeProfile('p5', [1, 1, 1, 1, 1]),
    ];
    const top = getTopRanked(rankMatches(user, profiles), 3);
    expect(top.map((m) => m.profile.id)).toEqual(['p1', 'p2', 'p3', 'p4']);
  });
});

describe('standout traits and explanation', () => {
  it('returns top two traits plus anyone tied at second place', () => {
    expect(getStandoutTraits(scores(5, 4, 1, 2, 3))).toEqual(['courage', 'curiosity']);
    expect(getStandoutTraits(scores(5, 4, 4, 2, 4))).toEqual(['courage', 'curiosity', 'ambition', 'independence']);
  });

  it('writes grammatical explanations for two or more traits', () => {
    expect(explainTraits(['curiosity', 'empathy'])).toBe(
      'Curiosity and empathy stood out in your answers. Based on this quiz, you enjoy exploring ideas and consider how others feel.',
    );
    expect(explainTraits(['courage', 'empathy', 'independence'])).toMatch(
      /^Courage, empathy, and independence stood out/,
    );
  });
});

describe('reachability: every character is a unique top match for valid answers', () => {
  it.each(Object.entries(REACHABILITY_FIXTURES))('%s', (id, answers) => {
    expect(getCompletion(answers).isComplete).toBe(true);
    const result = buildQuizResult(answers, CHARACTER_PROFILES, noMeta, 1);
    expect(result.topMatches).toHaveLength(1);
    expect(result.topMatches[0].profile.id).toBe(id);
  });

  it('Dobby participates in matching and can be the unique top match', () => {
    const result = buildQuizResult(REACHABILITY_FIXTURES.dobby, CHARACTER_PROFILES, noMeta, 1);
    expect(result.ranked).toHaveLength(7);
    expect(result.topMatches.map((m) => m.profile.name)).toEqual(['Dobby']);
    expect(result.topMatches[0].profile.house).toBeNull();
    // Independence is what separates Dobby from Neville.
    expect(result.ranked.find((m) => m.profile.id === 'neville')!.distance).toBeGreaterThan(0);
  });
});
