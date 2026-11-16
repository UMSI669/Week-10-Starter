import { ButtonGroup, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { palette, spacing } from '../theme';
import type { ScenarioQuestionData } from '../types';
import { Panel } from './Panel';

interface Props {
  scenario: ScenarioQuestionData;
  number: number;
  selectedId: string | null;
  onSelect: (optionId: string) => void;
}

/** Single-choice scenario using React Native Elements ButtonGroup. */
export function ScenarioQuestion({ scenario, number, selectedId, onSelect }: Props) {
  const { width } = useWindowDimensions();
  const vertical = width < 640;
  const selectedIndex = scenario.options.findIndex((o) => o.id === selectedId);
  const selected = selectedIndex >= 0 ? scenario.options[selectedIndex] : null;

  // A check mark is added to the selected label so selection never relies on color alone.
  const buttons = scenario.options.map((o) => (o.id === selectedId ? `✓ ${o.label}` : o.label));

  return (
    <Panel testID={`scenario-${scenario.id}`}>
      <Text h4 h4Style={styles.title}>
        Scenario {number}
      </Text>
      <Text style={styles.prompt} accessibilityRole="header">
        {scenario.prompt}
      </Text>
      <ButtonGroup
        buttons={buttons}
        selectedIndex={selectedIndex >= 0 ? selectedIndex : null}
        onPress={(index: number) => onSelect(scenario.options[index].id)}
        vertical={vertical}
        containerStyle={[styles.group, vertical ? styles.groupVertical : styles.groupHorizontal]}
        buttonContainerStyle={vertical ? styles.verticalItem : undefined}
        buttonStyle={styles.button}
        textStyle={styles.buttonText}
      />
      <Text style={styles.selection} accessibilityLiveRegion="polite">
        {selected ? `Selected: ${selected.label}` : 'No option selected yet.'}
      </Text>
    </Panel>
  );
}

const styles = StyleSheet.create({
  title: { color: palette.gold },
  prompt: { marginTop: spacing.sm, marginBottom: spacing.md },
  group: { marginLeft: 0, marginRight: 0 },
  groupHorizontal: { height: 64 },
  groupVertical: { height: undefined },
  verticalItem: { minHeight: 52 },
  button: { paddingHorizontal: spacing.sm, paddingVertical: spacing.sm },
  buttonText: { fontSize: 15, lineHeight: 20 },
  selection: { color: palette.creamMuted, marginTop: spacing.sm },
});
