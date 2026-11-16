import { useMemo } from "react";
import { Atmosphere } from "./data";
import { lightThemes, themes, Theme } from "./theme";
import { useAppearance } from "./state/Appearance";
import { useLayoutPreferences } from "./state/LayoutPreferences";
export function useDaytime() {
  return useAppearance().light;
}
export function useContentWidth() {
  const { size } = useLayoutPreferences();
  return { small: 600, medium: 840, large: 1080 }[size];
}
export function useConcertTheme(atmosphere: Atmosphere = "electric"): Theme {
  const light = useDaytime();
  const { density, size } = useLayoutPreferences();
  return useMemo(() => {
    const base = (light ? lightThemes : themes)[atmosphere];
    const scale = { small: 0.9, medium: 1, large: 1.2 }[size];
    const textVariants = Object.fromEntries(
      Object.entries(base.textVariants).map(([key, value]) => [
        key,
        {
          ...value,
          fontSize: Math.round(value.fontSize * scale),
          lineHeight: Math.ceil(value.lineHeight * scale),
        },
      ]),
    ) as Theme["textVariants"];
    return {
      ...base,
      textVariants,
      spacing:
        density === "compact"
          ? { none: 0, xs: 4, s: 8, m: 14, l: 20, xl: 28, xxl: 44 }
          : base.spacing,
    };
  }, [light, atmosphere, density, size]);
}
