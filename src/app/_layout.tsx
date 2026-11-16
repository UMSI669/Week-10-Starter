import {
  LayoutPreferencesProvider,
  useLayoutPreferences,
} from "../state/LayoutPreferences";
import { AppearanceProvider, useAppearance } from "../state/Appearance";
import { SavedConcertsProvider } from "../state/SavedConcerts";
import { useConcertTheme, useDaytime } from "../useConcertTheme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useReducedMotion } from "../components/ConcertUI";
export default function RootLayout() {
  return (
    <AppearanceProvider>
      <LayoutPreferencesProvider>
        <AppNavigator />
      </LayoutPreferencesProvider>
    </AppearanceProvider>
  );
}
function AppNavigator() {
  const { ready } = useAppearance();
  const layout = useLayoutPreferences();
  const theme = useConcertTheme();
  const daytime = useDaytime();
  const reduced = useReducedMotion();
  if (!ready || !layout.ready) return null;
  return (
    <SavedConcertsProvider>
      <StatusBar style={daytime ? "dark" : "light"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: reduced ? "none" : "slide_from_right",
          animationDuration: 300,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="player/[artistId]"
          options={{
            presentation: "fullScreenModal",
            animation: reduced ? "none" : "slide_from_bottom",
          }}
        />
      </Stack>
    </SavedConcertsProvider>
  );
}
