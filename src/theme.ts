import { ViewProps } from "react-native";
import {
  createBox,
  createText,
  createTheme,
  createRestyleComponent,
  createVariant,
  VariantProps,
  BoxProps,
} from "@shopify/restyle";
import { Atmosphere } from "./data";
const palettes = {
  electric: {
    background: "#000000",
    surface: "#111111",
    elevated: "#1C1C1E",
    text: "#F5F5F7",
    muted: "#A1A1A6",
    accent: "#D5FF63",
    onAccent: "#17200B",
    border: "#29292B",
    art: "#758C35",
  },
  sunset: {
    background: "#000000",
    surface: "#111111",
    elevated: "#1C1C1E",
    text: "#F5F5F7",
    muted: "#A1A1A6",
    accent: "#FFBC8B",
    onAccent: "#35150D",
    border: "#29292B",
    art: "#BD5D46",
  },
  midnight: {
    background: "#000000",
    surface: "#111111",
    elevated: "#1C1C1E",
    text: "#F5F5F7",
    muted: "#A1A1A6",
    accent: "#BEC3FF",
    onAccent: "#202347",
    border: "#29292B",
    art: "#6874BC",
  },
};
const base = createTheme({
  colors: palettes.electric,
  spacing: { none: 0, xs: 6, s: 12, m: 20, l: 28, xl: 40, xxl: 64 },
  borderRadii: { s: 10, m: 20, l: 30, pill: 999 },
  breakpoints: { phone: 0, tablet: 760 },
  textVariants: {
    defaults: { color: "text", fontSize: 15, lineHeight: 23 },
    hero: {
      color: "text",
      fontSize: 36,
      lineHeight: 40,
      fontWeight: "900",
      letterSpacing: -1.5,
    },
    title: {
      color: "text",
      fontSize: 28,
      lineHeight: 34,
      fontWeight: "800",
      letterSpacing: -0.8,
    },
    heading: { color: "text", fontSize: 19, lineHeight: 26, fontWeight: "700" },
    body: { color: "text", fontSize: 15, lineHeight: 24 },
    caption: { color: "muted", fontSize: 12, lineHeight: 18 },
    label: {
      color: "accent",
      fontSize: 11,
      lineHeight: 18,
      letterSpacing: 2,
      fontWeight: "800",
    },
  },
  cardVariants: {
    defaults: { padding: "m", borderRadius: "m" },
    standard: {
      backgroundColor: "surface",
      borderWidth: 0,
      borderColor: "border",
    },
    elevated: { backgroundColor: "elevated" },
    accent: { backgroundColor: "accent" },
  },
});
export type Theme = typeof base;
export const themes: Record<Atmosphere, Theme> = {
  electric: base,
  sunset: { ...base, colors: palettes.sunset },
  midnight: { ...base, colors: palettes.midnight },
};
export const Box = createBox<Theme>();
export const Text = createText<Theme>();
export const Card = createRestyleComponent<
  VariantProps<Theme, "cardVariants"> & BoxProps<Theme> & ViewProps,
  Theme
>([createVariant({ themeKey: "cardVariants" })], Box);

// Semantic tokens keep daylight contrast independent from each artist's palette.
const lightColors = {
  background: "#FAFAF9",
  surface: "#F0F0EE",
  elevated: "#E7E7E4",
  text: "#171719",
  muted: "#626268",
  border: "#DADAD6",
  onAccent: "#FFFFFF",
};
export const lightThemes: Record<Atmosphere, Theme> = {
  electric: {
    ...base,
    colors: {
      ...palettes.electric,
      ...lightColors,
      accent: "#426600",
      art: "#DDE9BB",
    },
  },
  sunset: {
    ...base,
    colors: {
      ...palettes.sunset,
      ...lightColors,
      accent: "#9A4323",
      art: "#F2DACC",
    },
  },
  midnight: {
    ...base,
    colors: {
      ...palettes.midnight,
      ...lightColors,
      accent: "#5357A5",
      art: "#DEDEF4",
    },
  },
};
