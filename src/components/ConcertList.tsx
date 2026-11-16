import { useSavedConcerts } from "../state/SavedConcerts";
import { SaveConcertButton } from "./SaveConcertButton";
import { useConcertTheme, useContentWidth } from "../useConcertTheme";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider } from "@shopify/restyle";
import { Box, Text } from "../theme";
import { artists, concerts } from "../data";
import { Artwork, Touch } from "./ConcertUI";
export default function ConcertList({
  savedOnly = false,
}: {
  savedOnly?: boolean;
}) {
  const saved = useSavedConcerts();
  const shows = concerts.filter(
    (c) => !savedOnly || saved.ids.includes(c.artistId),
  );
  const contentWidth = useContentWidth();
  const theme = useConcertTheme();
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          <Box
            padding="m"
            gap="l"
            maxWidth={contentWidth}
            width="100%"
            alignSelf="center"
          >
            <Box paddingTop="s" gap="m">
              <Text variant="caption" letterSpacing={3}>
                AFTERGLOW
              </Text>
              <Box gap="xs">
                <Text variant="hero">{savedOnly ? "Saved" : "Discover"}</Text>
                <Text color="muted">
                  {savedOnly
                    ? "The shows you don’t want to miss."
                    : "Your next night out starts here."}
                </Text>
              </Box>
            </Box>
            {!!saved.error && (
              <Text accessibilityRole="alert" color="muted">
                {saved.error}
              </Text>
            )}
            {savedOnly && !shows.length && (
              <Box gap="s" paddingVertical="l">
                <Text variant="heading">
                  {saved.ready
                    ? "Your next favourite is out there."
                    : "Loading saved concerts…"}
                </Text>
                {saved.ready && (
                  <>
                    <Text color="muted">
                      Bookmark a concert in Discover to keep it here.
                    </Text>
                    <Touch
                      label="Explore concerts"
                      onPress={() => router.navigate("/")}
                    >
                      <Text color="accent">Explore concerts →</Text>
                    </Touch>
                  </>
                )}
              </Box>
            )}
            {shows.map((concert) => {
              const artist = artists.find((a) => a.id === concert.artistId)!;
              return (
                <Box key={artist.id} gap="xs">
                  <Touch
                    label={`${artist.name}, ${concert.date}. View concert and setlist`}
                    onPress={() =>
                      router.navigate({
                        pathname: "/concert/[id]",
                        params: { id: artist.id },
                      })
                    }
                  >
                    <Box gap="s">
                      <Artwork artist={artist} compact />
                      <Box
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        gap="s"
                      >
                        <Box flex={1} gap="xs">
                          <Text variant="heading">{artist.name}</Text>
                          <Text variant="caption">
                            {concert.shortDate} · {concert.venue}
                          </Text>
                        </Box>
                        <Text color="muted" fontSize={24} lineHeight={30}>
                          ›
                        </Text>
                      </Box>
                    </Box>
                  </Touch>
                  <SaveConcertButton artist={artist} />
                </Box>
              );
            })}
            <Text variant="caption">
              Three fictional shows. A little inspiration for your next night
              out.
            </Text>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </ThemeProvider>
  );
}
