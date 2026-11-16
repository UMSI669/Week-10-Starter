import { CheckBox, Text } from '@rneui/themed';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { REQUIRED_VALUE_COUNT, VALUES_PROMPT, VALUE_OPTIONS } from '../data/quizQuestions';
import { palette, spacing } from '../theme';
import { toggleValue } from '../utils/scoring';
import { Panel } from './Panel';

interface Props {
  selected: string[];
  onChange: (values: string[]) => void;
}

/** Values question: CheckBox controls with a strict two-selection limit. */
export function ValuesQuestion({ selected, onChange }: Props) {
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const atLimit = selected.length >= REQUIRED_VALUE_COUNT;

  const handlePress = (id: string) => {
    const { values, blocked } = toggleValue(selected, id);
    setLimitMessage(
      blocked
        ? 'You can choose only two. Uncheck one of your current choices to pick this one instead.'
        : null,
    );
    if (!blocked) onChange(values);
  };

  return (
    <Panel testID="values-question">
      <Text h4 h4Style={styles.title}>
        Values
      </Text>
      <Text style={styles.prompt} accessibilityRole="header">
        {VALUES_PROMPT}
      </Text>
      <Text style={styles.count} accessibilityLiveRegion="polite" testID="values-count">
        {selected.length} of {REQUIRED_VALUE_COUNT} selected
      </Text>
      <View style={styles.list}>
        {VALUE_OPTIONS.map((option) => {
          const checked = selected.includes(option.id);
          const unavailable = atLimit && !checked;
          return (
            <CheckBox
              key={option.id}
              title={option.label}
              checked={checked}
              onPress={() => handlePress(option.id)}
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              size={26}
              containerStyle={[
                styles.box,
                checked && styles.boxChecked,
                unavailable && styles.boxUnavailable,
              ]}
              textStyle={[styles.text, checked && styles.textChecked, unavailable && styles.textUnavailable]}
              accessibilityLabel={option.label}
              accessibilityHint={
                unavailable
                  ? 'Two values are already selected. Uncheck one first.'
                  : checked
                    ? 'Selected. Press to uncheck.'
                    : 'Press to select.'
              }
            />
          );
        })}
      </View>
      {limitMessage ? (
        <Text style={styles.limit} accessibilityLiveRegion="assertive" accessibilityRole="alert">
          ⓘ {limitMessage}
        </Text>
      ) : atLimit ? (
        <Text style={styles.hint}>Limit reached. To swap, uncheck a choice first.</Text>
      ) : null}
    </Panel>
  );
}

const styles = StyleSheet.create({
  title: { color: palette.gold },
  prompt: { marginTop: spacing.sm },
  count: { color: palette.gold, fontWeight: '700', marginVertical: spacing.sm },
  list: { gap: spacing.sm },
  box: {
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: palette.surfaceRaised,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
  },
  text: { color: palette.cream, fontSize: 16, fontWeight: '500' },
  textChecked: { fontWeight: '700' },
  boxChecked: { borderColor: palette.gold, borderWidth: 2 },
  boxUnavailable: { opacity: 0.75 },
  textUnavailable: { color: palette.creamMuted },
  limit: { color: palette.gold, marginTop: spacing.md, fontWeight: '600' },
  hint: { color: palette.creamMuted, marginTop: spacing.md },
});
