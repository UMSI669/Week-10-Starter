import { Button, LinearProgress, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Panel } from '../components/Panel';
import { ScenarioQuestion } from '../components/ScenarioQuestion';
import { TraitSlider } from '../components/TraitSlider';
import { ValuesQuestion } from '../components/ValuesQuestion';
import { SCENARIO_QUESTIONS, SLIDER_QUESTIONS } from '../data/quizQuestions';
import { palette, spacing } from '../theme';
import type { QuizAnswers, Trait } from '../types';
import { getCompletion, joinList } from '../utils/scoring';

interface Props {
  name: string;
  answers: QuizAnswers;
  onAnswersChange: (answers: QuizAnswers) => void;
  onReveal: () => void;
  loading: boolean;
}

export function QuizScreen({ name, answers, onAnswersChange, onReveal, loading }: Props) {
  const completion = getCompletion(answers);

  const setSlider = (trait: Trait, value: number) =>
    onAnswersChange({ ...answers, sliders: { ...answers.sliders, [trait]: { value, answered: true } } });

  const setScenario = (id: string, optionId: string) =>
    onAnswersChange({ ...answers, scenarios: { ...answers.scenarios, [id]: optionId } });

  const progressText = `${completion.completed} of ${completion.total} answered`;

  return (
    <View>
      <Panel>
        <Text h2 accessibilityRole="header">
          Welcome, {name.trim()}
        </Text>
        <Text style={styles.intro}>
          Move each slider or press “Use this value”, answer both scenarios, and choose two values.
          Sliders start at 3 but don’t count until you confirm them.
        </Text>
      </Panel>

      <Text h3 h3Style={styles.section}>
        Part 1 · Five traits
      </Text>
      {SLIDER_QUESTIONS.map((question, i) => (
        <TraitSlider
          key={question.trait}
          number={i + 1}
          question={question}
          answer={answers.sliders[question.trait]}
          onChange={(value) => setSlider(question.trait, value)}
        />
      ))}

      <Text h3 h3Style={styles.section}>
        Part 2 · Scenarios
      </Text>
      {SCENARIO_QUESTIONS.map((scenario, i) => (
        <ScenarioQuestion
          key={scenario.id}
          number={i + 1}
          scenario={scenario}
          selectedId={answers.scenarios[scenario.id]}
          onSelect={(optionId) => setScenario(scenario.id, optionId)}
        />
      ))}

      <Text h3 h3Style={styles.section}>
        Part 3 · Values
      </Text>
      <ValuesQuestion
        selected={answers.values}
        onChange={(values) => onAnswersChange({ ...answers, values })}
      />

      <Panel style={styles.submitPanel}>
        <Text h4 accessibilityLiveRegion="polite" testID="progress-text">
          Progress: {progressText}
        </Text>
        <LinearProgress
          value={completion.completed / completion.total}
          variant="determinate"
          color={palette.gold}
          trackColor={palette.border}
          animation={false}
          style={styles.progress}
        />
        {completion.isComplete ? (
          <Text style={styles.ready}>✓ All questions answered. You’re ready!</Text>
        ) : (
          <Text style={styles.remaining} testID="remaining-text">
            Still needed: {joinList(completion.missing)}.
          </Text>
        )}
        <Button
          testID="reveal-button"
          title={loading ? 'Consulting the Sorting Hat…' : 'Reveal my match'}
          onPress={onReveal}
          loading={loading}
          loadingProps={{ color: palette.gold, size: 'small' }}
          disabled={!completion.isComplete || loading}
          accessibilityLabel={loading ? 'Consulting the Sorting Hat' : 'Reveal my match'}
          accessibilityState={{ busy: loading, disabled: !completion.isComplete || loading }}
          accessibilityHint={completion.isComplete ? undefined : 'Answer all questions to enable.'}
          containerStyle={styles.reveal}
        />
        {loading ? (
          <Text style={styles.loadingText} accessibilityLiveRegion="polite" testID="loading-text">
            Consulting the Sorting Hat…
          </Text>
        ) : null}
      </Panel>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: spacing.sm },
  section: { color: palette.gold, marginBottom: spacing.md, marginTop: spacing.sm },
  submitPanel: { borderColor: palette.goldDark },
  progress: { height: 10, borderRadius: 5, marginVertical: spacing.md },
  ready: { color: palette.success, fontWeight: '700' },
  remaining: { color: palette.creamMuted },
  reveal: { marginTop: spacing.md },
  loadingText: { textAlign: 'center', marginTop: spacing.sm, color: palette.gold },
});
