import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { palette, radius, spacing } from '../theme';

/** Rounded card used for every section of the app. */
export function Panel({ style, ...rest }: ViewProps) {
  return <View style={[styles.panel, style]} {...rest} />;
}

/** A small gold divider with a star, purely decorative. */
export function Flourish() {
  return (
    <View style={styles.flourish} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={styles.line} />
      <View style={styles.diamond} />
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  flourish: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  line: { flex: 1, height: 1, backgroundColor: palette.goldDark, opacity: 0.6 },
  diamond: {
    width: 10,
    height: 10,
    marginHorizontal: spacing.sm,
    backgroundColor: palette.gold,
    transform: [{ rotate: '45deg' }],
  },
});
