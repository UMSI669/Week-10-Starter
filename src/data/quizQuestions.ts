import type { ScenarioQuestionData, SliderQuestionData, Trait, ValueOption } from '../types';

export const TRAIT_LABELS: Record<Trait, string> = {
  courage: 'Courage',
  curiosity: 'Curiosity',
  ambition: 'Ambition',
  empathy: 'Empathy',
  independence: 'Independence',
};

export const SLIDER_QUESTIONS: SliderQuestionData[] = [
  {
    trait: 'courage',
    title: 'Courage',
    prompt: 'You discover a hidden passage. How willing are you to explore it?',
    minLabel: 'Prefer to stay safe',
    maxLabel: 'Ready to take the risk',
  },
  {
    trait: 'curiosity',
    title: 'Curiosity',
    prompt: 'You find a mysterious book. How much do you want to investigate?',
    minLabel: 'Not very interested',
    maxLabel: 'Need to know everything',
  },
  {
    trait: 'ambition',
    title: 'Ambition',
    prompt: 'How important is achieving a challenging personal goal to you?',
    minLabel: 'Prefer a relaxed approach',
    maxLabel: 'Highly driven',
  },
  {
    trait: 'empathy',
    title: 'Empathy',
    prompt: "How much do other people's feelings influence your decisions?",
    minLabel: 'Focus on the task first',
    maxLabel: 'Consider feelings closely',
  },
  {
    trait: 'independence',
    title: 'Independence',
    prompt: 'How comfortable are you following your own judgment when others disagree?',
    minLabel: 'Prefer group agreement',
    maxLabel: 'Comfortable choosing my own path',
  },
];

export const SCENARIO_QUESTIONS: ScenarioQuestionData[] = [
  {
    id: 'obstacle',
    prompt: 'Your team encounters an unexpected obstacle. What do you do first?',
    options: [
      { id: 'take-action', label: 'Take action', trait: 'courage' },
      { id: 'research', label: 'Research a solution', trait: 'curiosity' },
      { id: 'check-on-everyone', label: 'Check on everyone', trait: 'empathy' },
      { id: 'plan', label: 'Plan how to succeed', trait: 'ambition' },
    ],
  },
  {
    id: 'disagreement',
    prompt: 'Your friends disagree with an idea you care about. What do you do?',
    options: [
      { id: 'own-judgment', label: 'Follow my judgment', trait: 'independence' },
      { id: 'listen', label: 'Listen to their concerns', trait: 'empathy' },
      { id: 'gather-info', label: 'Gather more information', trait: 'curiosity' },
      { id: 'speak-up', label: 'Speak up for the idea', trait: 'courage' },
    ],
  },
];

export const VALUES_PROMPT = 'Choose exactly two things that matter most to you.';
export const REQUIRED_VALUE_COUNT = 2;

export const VALUE_OPTIONS: ValueOption[] = [
  { id: 'helping-others', label: 'Helping others', trait: 'empathy' },
  { id: 'discovering', label: 'Discovering new things', trait: 'curiosity' },
  { id: 'achieving-goals', label: 'Achieving your goals', trait: 'ambition' },
  { id: 'standing-up', label: "Standing up for what's right", trait: 'courage' },
  { id: 'true-to-yourself', label: 'Being true to yourself', trait: 'independence' },
];
