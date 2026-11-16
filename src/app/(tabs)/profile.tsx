import { useLayoutPreferences } from "../../state/LayoutPreferences";
import { ScrollView } from "react-native";
import { Touch } from "../../components/ConcertUI";
import { useAppearance } from "../../state/Appearance";
import { ThemeProvider } from "@shopify/restyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Box, Text } from "../../theme";
import {
  useConcertTheme,
  useContentWidth,
  useDaytime,
} from "../../useConcertTheme";
import { useSavedConcerts } from "../../state/SavedConcerts";
export default function ProfileScreen() {
  const contentWidth = useContentWidth();
  const theme = useConcertTheme();
  const day = useDaytime();
  const saved = useSavedConcerts();
  const appearance = useAppearance();
  const layout = useLayoutPreferences();
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <ScrollView>
          <Box
            padding="m"
            gap="l"
            maxWidth={contentWidth}
            width="100%"
            alignSelf="center"
          >
            <Text variant="hero">Profile</Text>
            <Box backgroundColor="surface" borderRadius="m" padding="m" gap="s">
              <Ionicons
                name="person-circle-outline"
                size={56}
                color={theme.colors.accent}
              />
              <Text variant="heading">Your space</Text>
              <Text color="muted">Explore as a guest. No account needed.</Text>
            </Box>
            <Box gap="xs">
              <Text variant="heading">{saved.ids.length} saved concerts</Text>
              <Text color="muted">Bookmarks stay on this device.</Text>
            </Box>
            <Box gap="s">
              <Text variant="heading">
                Appearance · {day ? "Light" : "Dark"}
              </Text>
              <Text color="muted">
                Choose a look. Automatic uses light from 7 AM to 7 PM and dark
                overnight.
              </Text>
              {(["light", "dark", "automatic"] as const).map((mode) => (
                <Touch
                  key={mode}
                  label={`${mode.charAt(0).toUpperCase() + mode.slice(1)} appearance`}
                  checked={appearance.mode === mode}
                  onPress={() => appearance.select(mode)}
                >
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    backgroundColor="surface"
                    borderRadius="m"
                    padding="m"
                  >
                    <Text fontWeight="600">
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Text>
                    <Ionicons
                      name={
                        appearance.mode === mode
                          ? "checkmark-circle"
                          : "ellipse-outline"
                      }
                      size={24}
                      color={
                        appearance.mode === mode
                          ? theme.colors.accent
                          : theme.colors.muted
                      }
                    />
                  </Box>
                </Touch>
              ))}
              {appearance.error ? (
                <Text accessibilityRole="alert">{appearance.error}</Text>
              ) : null}
            </Box>
            <Box gap="s">
              <Text variant="heading">Spacing</Text>
              <Text color="muted">
                Compact fits more on screen. Comfortable gives everything room
                to breathe.
              </Text>
              {(["compact", "comfortable"] as const).map((value) => (
                <Touch
                  key={value}
                  label={`${value} spacing`}
                  checked={layout.density === value}
                  onPress={() => layout.setDensity(value)}
                >
                  <Box
                    padding="m"
                    backgroundColor="surface"
                    borderRadius="m"
                    flexDirection="row"
                    alignItems="center"
                    gap="s"
                  >
                    <Text flex={1}>
                      {value === "compact" ? "Compact" : "Comfortable"}
                    </Text>
                    <Ionicons
                      name={
                        layout.density === value
                          ? "checkmark-circle"
                          : "ellipse-outline"
                      }
                      size={24}
                      color={theme.colors.accent}
                    />
                  </Box>
                </Touch>
              ))}
            </Box>
            <Box gap="s">
              <Text variant="heading">Content size</Text>
              <Text color="muted">
                Adjust text size and the content width on larger screens. On
                your phone, content always fits the screen.
              </Text>
              {(["small", "medium", "large"] as const).map((value) => (
                <Touch
                  key={value}
                  label={`${value} content size`}
                  checked={layout.size === value}
                  onPress={() => layout.setSize(value)}
                >
                  <Box
                    padding="m"
                    backgroundColor="surface"
                    borderRadius="m"
                    flexDirection="row"
                    alignItems="center"
                    gap="s"
                  >
                    <Text flex={1}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </Text>
                    <Ionicons
                      name={
                        layout.size === value
                          ? "checkmark-circle"
                          : "ellipse-outline"
                      }
                      size={24}
                      color={theme.colors.accent}
                    />
                  </Box>
                </Touch>
              ))}
              {layout.error ? (
                <Text accessibilityRole="alert">{layout.error}</Text>
              ) : null}
              <Box
                backgroundColor="surface"
                borderRadius="m"
                padding="m"
                gap="s"
              >
                <Text variant="heading">Your layout preview</Text>
                <Text>Changes apply immediately throughout Afterglow.</Text>
                <Text variant="caption">
                  Resize the web window to see this content adapt.
                </Text>
              </Box>
            </Box>
            <Text variant="caption">
              Afterglow · KMZ prototype. Fictional shows and song previews.
            </Text>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </ThemeProvider>
  );
}
