import { Button, Slider, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View, type AccessibilityActionEvent, type ViewProps } from 'react-native';
import { palette, radius, spacing } from '../theme';
import type { SliderAnswer, SliderQuestionData } from '../types';
import { MAX_SCORE, MIN_SCORE } from '../utils/scoring';
import { Panel } from './Panel';

interface Props {
  question: SliderQuestionData;
  number: number;
  answer: SliderAnswer;
  /** Called with the new integer value; also marks the slider answered. */
  onChange: (value: number) => void;
}

/**
 * One trait slider. It starts visually at 3 but is NOT answered until the
 * user moves it, steps it with −/+, or presses "Use this value".
 */
export function TraitSlider({ question, number, answer, onChange }: Props) {
  const { value, answered } = answer;
  const setValue = (next: number) =>
    onChange(Math.min(MAX_SCORE, Math.max(MIN_SCORE, Math.round(next))));

  // RNE's Slider forwards extra View props to its container at runtime
  // (see @rneui/base/dist/Slider/Slider.js), but its TypeScript props omit
  // them, so we pass them through a typed ViewProps object.
  const a11y: ViewProps = {
    testID: `slider-control-${question.trait}`,
    accessibilityLabel: `${question.title}: ${question.prompt}`,
    accessibilityHint: `1 means ${question.minLabel}. 5 means ${question.maxLabel}.`,
    accessibilityActions: [{ name: 'increment' }, { name: 'decrement' }],
    onAccessibilityAction: (event: AccessibilityActionEvent) => {
      if (event.nativeEvent.actionName === 'increment') setValue(value + 1);
      if (event.nativeEvent.actionName === 'decrement') setValue(value - 1);
    },
  };
  const sliderA11y = a11y as Record<string, unknown>;

  return (
    <Panel testID={`slider-${question.trait}`}>
      <View style={styles.header}>
        <Text h4 h4Style={styles.title}>
          {number}. {question.title}
        </Text>
        <View
          style={[styles.status, answered ? styles.statusDone : styles.statusTodo]}
          accessibilityLabel={answered ? 'Answered' : 'Not answered yet'}
        >
          <Text style={answered ? styles.statusDoneText : styles.statusTodoText}>
            {answered ? '✓ Answered' : '○ Not answered'}
          </Text>
        </View>
      </View>
      <Text style={styles.prompt}>{question.prompt}</Text>

      <View style={styles.valueRow}>
        <Text style={styles.valueText} accessibilityLiveRegion="polite">
          Value: <Text style={styles.valueNumber}>{value}</Text> of 5
        </Text>
      </View>

      <Slider
        {...sliderA11y}
        value={value}
        minimumValue={MIN_SCORE}
        maximumValue={MAX_SCORE}
        step={1}
        allowTouchTrack
        onValueChange={setValue}
        minimumTrackTintColor={palette.gold}
        maximumTrackTintColor={palette.border}
        thumbTintColor={palette.gold}
        thumbStyle={styles.thumb}
        trackStyle={styles.track}
        thumbTouchSize={{ width: 44, height: 44 }}
      />
      <View style={styles.endpoints}>
        <Text style={styles.endpoint}>1 · {question.minLabel}</Text>
        <Text style={[styles.endpoint, styles.endpointRight]}>5 · {question.maxLabel}</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="−"
          type="outline"
          onPress={() => setValue(value - 1)}
          disabled={value <= MIN_SCORE}
          accessibilityLabel={`Decrease ${question.title}`}
          buttonStyle={styles.stepButton}
          titleStyle={styles.stepTitle}
          containerStyle={styles.stepContainer}
        />
        <Button
          title="+"
          type="outline"
          onPress={() => setValue(value + 1)}
          disabled={value >= MAX_SCORE}
          accessibilityLabel={`Increase ${question.title}`}
          buttonStyle={styles.stepButton}
          titleStyle={styles.stepTitle}
          containerStyle={styles.stepContainer}
        />
        <Button
          title={answered ? `Using ${value}` : `Use this value (${value})`}
          onPress={() => setValue(value)}
          disabled={answered}
          accessibilityLabel={
            answered
              ? `${question.title} confirmed at ${value}`
              : `Use ${value} as my ${question.title} answer`
          }
          containerStyle={styles.confirmContainer}
        />
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  title: { color: palette.gold },
  status: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
  },
  statusDone: { borderColor: palette.success, backgroundColor: 'rgba(159,224,176,0.12)' },
  statusTodo: { borderColor: palette.creamMuted, borderStyle: 'dashed' },
  statusDoneText: { color: palette.success, fontSize: 14, fontWeight: '700' },
  statusTodoText: { color: palette.creamMuted, fontSize: 14 },
  prompt: { marginTop: spacing.sm, marginBottom: spacing.sm },
  valueRow: { marginBottom: spacing.xs },
  valueText: { color: palette.creamMuted },
  valueNumber: { color: palette.gold, fontWeight: '700', fontSize: 20 },
  thumb: { width: 26, height: 26, borderRadius: 13, borderWidth: 3, borderColor: palette.cream },
  track: { height: 6, borderRadius: 3 },
  endpoints: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  endpoint: { color: palette.creamMuted, fontSize: 14, flex: 1 },
  endpointRight: { textAlign: 'right' },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  stepButton: { backgroundColor: 'transparent', borderColor: palette.gold, minWidth: 48 },
  stepTitle: { color: palette.gold, fontSize: 20 },
  stepContainer: { minWidth: 48 },
  confirmContainer: { flexGrow: 1, minWidth: 180 },
});
