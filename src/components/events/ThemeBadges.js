import { StyleSheet, View } from 'react-native';
import { Badge, useTheme } from '@rneui/themed';

import { useAppState } from '../../state/AppState';

// Each theme keeps a readable text label; color only supplements it.
const PALETTE = {
  light: {
    Nature: ['#DEF2E3', '#13532C'],
    Animal: ['#FBEBD3', '#7A3C06'],
    Architecture: ['#E1E7FB', '#1E3A8A'],
    'Night colors': ['#E6E0F8', '#4A1D95'],
    Portrait: ['#FBE2EC', '#831843'],
    Macro: ['#D9F0F5', '#0E4A54'],
    'Everyday life': ['#FDF0D5', '#6B4A05'],
    Critique: ['#E7E9EE', '#303A4C'],
  },
  dark: {
    Nature: ['#1D3B2A', '#A7E8C0'],
    Animal: ['#3C2A12', '#F7D2A1'],
    Architecture: ['#1E2A4D', '#C3D0FF'],
    'Night colors': ['#2C2348', '#D9CCFF'],
    Portrait: ['#3E1C2B', '#F9C4D8'],
    Macro: ['#133C44', '#AEE7F0'],
    'Everyday life': ['#3A2F12', '#F3DCA6'],
    Critique: ['#2A3346', '#D3DBE8'],
  },
};

export default function ThemeBadges({ themes, testID }) {
  const { theme } = useTheme();
  const { mode, colorBlind } = useAppState();
  if (!Array.isArray(themes) || themes.length === 0) return null;

  // Color Blind Mode drops the hue coding entirely: the labels already say it.
  const neutral = [theme.colors.subtleSurface, theme.colors.ink];
  const palette = PALETTE[mode === 'dark' ? 'dark' : 'light'];

  return (
    <View style={styles.row} testID={testID}>
      {themes.map((label) => {
        const [background, color] = colorBlind ? neutral : palette[label] || neutral;
        return (
          <Badge
            key={label}
            value={label}
            accessibilityLabel={`Theme: ${label}`}
            badgeStyle={[styles.badge, { backgroundColor: background, borderColor: color }]}
            textStyle={[styles.text, { color }]}
            containerStyle={styles.container}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  container: { alignSelf: 'flex-start' },
  badge: { minHeight: 24, paddingHorizontal: 9, borderWidth: StyleSheet.hairlineWidth },
  text: { fontSize: 12, fontWeight: '700' },
});
