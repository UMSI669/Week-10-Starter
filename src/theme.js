import { createTheme } from '@rneui/themed';

// Shared tokens and defaults keep the teammates' sections visually consistent.
export function makeTheme(mode = 'light', colorBlind = false) {
return createTheme({
  mode,
  lightColors: {
    primary: colorBlind ? '#00689D' : '#3157D5', secondary: colorBlind ? '#A64B00' : '#F0AD45', background: '#F4F6FB',
    surface: '#FFFFFF', ink: '#17213B', muted: '#62708B',
    hero: colorBlind ? '#123C50' : '#172B65', heroAccent: '#FFD27C', border: '#E2E7F1',
  },
  darkColors: {
    primary: colorBlind ? '#72CFFF' : '#9AB0FF', secondary: '#FFD27C', background: '#111827',
    surface: '#202B3E', ink: '#F7F9FF', muted: '#B5C1D5',
    hero: colorBlind ? '#123C50' : '#283D78', heroAccent: '#FFD27C', border: '#35435B',
  },
  components: {
    Avatar: { rounded: true, size: 56 },
    Badge: { badgeStyle: { borderRadius: 8, paddingHorizontal: 7, minHeight: 22 } },
    Button: { buttonStyle: { borderRadius: 12, paddingVertical: 11 } },
    Card: (_props, theme) => ({
      containerStyle: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderRadius: 18, margin: 0, padding: 18,
      },
    }),
    ListItem: (_props, theme) => ({ containerStyle: { backgroundColor: theme.colors.surface } }),
  },
});

}
