import { Button, Input, Text } from '@rneui/themed';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Flourish, Panel } from '../components/Panel';
import { palette, spacing } from '../theme';

export const MAX_NAME_LENGTH = 30;

export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length === 0) return 'Please enter a wizard name (spaces alone don’t count).';
  if (trimmed.length > MAX_NAME_LENGTH) return `Please use ${MAX_NAME_LENGTH} characters or fewer.`;
  return null;
}

interface Props {
  name: string;
  onNameChange: (name: string) => void;
  onBegin: () => void;
}

export function WelcomeScreen({ name, onNameChange, onBegin }: Props) {
  const [touched, setTouched] = useState(false);
  const error = validateName(name);
  const showError = touched && error !== null;

  const begin = () => {
    setTouched(true);
    if (!error) onBegin();
  };

  return (
    <View>
      <View style={styles.hero}>
        <Text style={styles.kicker} accessibilityElementsHidden importantForAccessibility="no">
          ✦ A fan-made personality quiz ✦
        </Text>
        <Text h1 accessibilityRole="header" style={styles.title}>
          CFL Wizard Match
        </Text>
        <Text style={styles.subtitle}>
          Discover your Harry Potter character personality match.
        </Text>
      </View>

      <Panel>
        <Text style={styles.body}>
          Answer a few questions about how you think and act. We’ll compare your answers with our
          fan-made character profiles.
        </Text>
        <Flourish />
        <Input
          testID="name-input"
          label="Wizard name"
          placeholder="e.g. Minerva"
          value={name}
          onChangeText={(text) => {
            setTouched(true);
            onNameChange(text);
          }}
          onBlur={() => setTouched(true)}
          maxLength={MAX_NAME_LENGTH}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="go"
          onSubmitEditing={begin}
          errorMessage={showError ? `⚠ ${error}` : undefined}
          renderErrorMessage={showError}
          accessibilityLabel="Wizard name"
          accessibilityHint={`Required. Up to ${MAX_NAME_LENGTH} characters.`}
          aria-invalid={showError}
        />
        <Text style={styles.counter}>
          {name.length}/{MAX_NAME_LENGTH} characters
        </Text>
        <Button
          testID="begin-button"
          title="Begin quiz"
          onPress={begin}
          disabled={error !== null}
          accessibilityHint={error ? 'Enter a wizard name to enable this button.' : undefined}
          icon={{ type: 'material', name: 'auto-stories', color: error ? palette.disabledText : palette.onGold }}
          iconRight
          containerStyle={styles.begin}
        />
        {error ? (
          <Text style={styles.disabledNote}>The button unlocks once you enter a name.</Text>
        ) : null}
      </Panel>

      <Text style={styles.disclaimer}>
        For entertainment only. Character traits are our interpretations, not official personality
        data.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: spacing.xl },
  kicker: { color: palette.gold, letterSpacing: 2, fontSize: 14, marginBottom: spacing.sm },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', fontSize: 19, lineHeight: 28, marginTop: spacing.sm },
  body: { fontSize: 17, lineHeight: 26 },
  counter: { color: palette.creamMuted, fontSize: 14, marginTop: -spacing.sm, marginBottom: spacing.md },
  begin: { marginTop: spacing.sm },
  disabledNote: { color: palette.creamMuted, fontSize: 14, marginTop: spacing.sm, textAlign: 'center' },
  disclaimer: {
    color: palette.creamMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: spacing.md,
  },
});
