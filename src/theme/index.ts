import { createTheme } from '@rneui/themed';

/** Magical-library palette: dark navy, warm cream, gold accents. */
export const palette = {
  background: '#0E1630',
  surface: '#18223F',
  surfaceRaised: '#202C50',
  border: '#34406A',
  cream: '#F6EEDB',
  creamMuted: '#D4CBB3',
  gold: '#E2B84B',
  goldDark: '#B48A26',
  onGold: '#1A1405',
  error: '#FFAB9B',
  success: '#9FE0B0',
  disabledBg: '#2A3352',
  disabledText: '#A7A9B8',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius = { sm: 8, md: 14, lg: 20 };
export const MAX_CONTENT_WIDTH = 760;

export const theme = createTheme({
  mode: 'dark',
  darkColors: {
    primary: palette.gold,
    secondary: palette.goldDark,
    background: palette.background,
    white: palette.surface,
    black: palette.cream,
    grey0: palette.cream,
    grey1: palette.creamMuted,
    grey2: palette.creamMuted,
    grey3: palette.border,
    grey4: palette.border,
    grey5: palette.surfaceRaised,
    greyOutline: palette.border,
    searchBg: palette.surfaceRaised,
    error: palette.error,
    success: palette.success,
    disabled: palette.disabledBg,
    divider: palette.border,
  },
  components: {
    Text: {
      style: { color: palette.cream, fontSize: 16, lineHeight: 24 },
      h1Style: { color: palette.gold, fontSize: 34, lineHeight: 42, fontWeight: '700' },
      h2Style: { color: palette.gold, fontSize: 24, lineHeight: 32, fontWeight: '700' },
      h3Style: { color: palette.cream, fontSize: 19, lineHeight: 26, fontWeight: '700' },
      h4Style: { color: palette.cream, fontSize: 17, lineHeight: 24, fontWeight: '600' },
    },
    Button: {
      raised: false,
      radius: radius.sm,
      buttonStyle: { minHeight: 48, paddingHorizontal: spacing.md, backgroundColor: palette.gold },
      titleStyle: { color: palette.onGold, fontWeight: '700', fontSize: 16 },
      disabledStyle: {
        backgroundColor: palette.disabledBg,
        borderWidth: 1,
        borderColor: palette.border,
        borderStyle: 'dashed',
      },
      disabledTitleStyle: { color: palette.disabledText },
      loadingProps: { color: palette.onGold },
    },
    Input: {
      inputStyle: { color: palette.cream, fontSize: 17 },
      labelStyle: { color: palette.cream, fontSize: 16, fontWeight: '700', marginBottom: 6 },
      inputContainerStyle: {
        borderWidth: 1,
        borderBottomWidth: 1,
        borderColor: palette.border,
        borderRadius: radius.sm,
        paddingHorizontal: spacing.sm,
        backgroundColor: palette.surfaceRaised,
        minHeight: 48,
      },
      errorStyle: { color: palette.error, fontSize: 15, marginLeft: 0 },
      placeholderTextColor: palette.disabledText,
      containerStyle: { paddingHorizontal: 0 },
    },
    CheckBox: {
      containerStyle: {
        backgroundColor: palette.surfaceRaised,
        borderColor: palette.border,
        borderRadius: radius.sm,
        marginLeft: 0,
        marginRight: 0,
        paddingVertical: 12,
      },
      textStyle: { color: palette.cream, fontSize: 16, fontWeight: '500' },
      checkedColor: palette.gold,
      uncheckedColor: palette.creamMuted,
    },
    ButtonGroup: {
      containerStyle: {
        backgroundColor: palette.surfaceRaised,
        borderColor: palette.border,
        borderRadius: radius.sm,
        marginHorizontal: 0,
      },
      textStyle: { color: palette.cream, fontSize: 15, textAlign: 'center' },
      selectedButtonStyle: { backgroundColor: palette.gold },
      selectedTextStyle: { color: palette.onGold, fontWeight: '700' },
      innerBorderStyle: { color: palette.border, width: 1 },
    },
    SearchBar: {
      containerStyle: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        paddingHorizontal: 0,
      },
      inputContainerStyle: {
        backgroundColor: palette.surfaceRaised,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: palette.border,
        minHeight: 48,
      },
      inputStyle: { color: palette.cream, fontSize: 16 },
      placeholderTextColor: palette.disabledText,
    },
  },
});
