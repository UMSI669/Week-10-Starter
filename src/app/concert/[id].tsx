import { Ionicons } from "@expo/vector-icons";
import { SaveConcertButton } from "../../components/SaveConcertButton";
import { useConcertTheme, useContentWidth } from "../../useConcertTheme";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider } from "@shopify/restyle";
import { Box, Text } from "../../theme";
import { artists, concerts } from "../../data";
import { Artwork, Touch } from "../../components/ConcertUI";
export default function ConcertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const concert = concerts.find((c) => c.artistId === id);
  const artist = artists.find((a) => a.id === id);
  const contentWidth = useContentWidth();
  const theme = useConcertTheme(artist?.atmosphere ?? "electric");
  const back = () => (router.canGoBack() ? router.back() : router.replace("/"));
  if (!concert || !artist)
    return (
      <ThemeProvider theme={theme}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
          <Box padding="m" gap="m">
            <Touch label="Back to concerts" onPress={back}>
              <Text>‹ Concerts</Text>
            </Touch>
            <Text variant="title">Concert not found</Text>
            <Text color="muted">Choose one of the upcoming shows.</Text>
          </Box>
        </SafeAreaView>
      </ThemeProvider>
    );
  const openingActs = artists.filter(
    (a) => concert.lineup.includes(a.id) && a.id !== artist.id,
  );
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <Box
          paddingHorizontal="m"
          paddingVertical="xs"
          width="100%"
          maxWidth={contentWidth}
          alignSelf="center"
        >
          <Touch label="Back to concerts" onPress={back}>
            <Text color="accent" fontWeight="600">
              ‹ Concerts
            </Text>
          </Touch>
        </Box>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <Box
            paddingHorizontal="m"
            gap="l"
            width="100%"
            maxWidth={contentWidth}
            alignSelf="center"
          >
            <Box>
              <Artwork artist={artist} />
              <SaveConcertButton artist={artist} />
            </Box>
            <Box gap="s">
              <Text variant="label">{artist.genre.toUpperCase()}</Text>
              <Box gap="xs">
                <Text variant="hero">{artist.name}</Text>
                <Text color="muted">{concert.title}</Text>
              </Box>
              <Text variant="body">{concert.date}</Text>
              <Text variant="caption">
                {concert.venue} · {concert.city}
              </Text>
              <Box flexDirection="row" gap="m">
                <Text variant="caption">Doors {concert.doors}</Text>
                <Text variant="caption">Headline {artist.time}</Text>
              </Box>
            </Box>
            <Box gap="s">
              <Text variant="heading">Setlist preview</Text>
              <Text variant="caption">
                An expected selection. Songs and order may change.
              </Text>
              <Box>
                {artist.setlist.map((song, index) => (
                  <Touch
                    key={song}
                    label={`Open ${song} in player preview`}
                    onPress={() =>
                      router.push({
                        pathname: "/player/[artistId]",
                        params: { artistId: artist.id, track: String(index) },
                      })
                    }
                  >
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      gap="m"
                      paddingVertical="m"
                      borderBottomWidth={
                        index === artist.setlist.length - 1 ? 0 : 1
                      }
                      borderColor="border"
                    >
                      <Text color="accent" width={24} fontSize={13}>
                        {String(index + 1).padStart(2, "0")}
                      </Text>
                      <Text flex={1} fontWeight="500">
                        {song}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={theme.colors.muted}
                      />
                    </Box>
                  </Touch>
                ))}
              </Box>
            </Box>
            <Box gap="m">
              <Text variant="heading">Also on the lineup</Text>
              {openingActs.map((act) => (
                <Box
                  key={act.id}
                  backgroundColor="surface"
                  padding="m"
                  borderRadius="m"
                  gap="s"
                >
                  <Box
                    flexDirection="row"
                    justifyContent="space-between"
                    gap="s"
                  >
                    <Text variant="heading" flex={1}>
                      {act.name}
                    </Text>
                    <Text variant="caption">{act.time}</Text>
                  </Box>
                  <Text variant="caption">{act.genre}</Text>
                  {act.setlist.map((song, index) => (
                    <Touch
                      key={song}
                      label={`Open ${song} in player preview`}
                      onPress={() =>
                        router.push({
                          pathname: "/player/[artistId]",
                          params: { artistId: act.id, track: String(index) },
                        })
                      }
                    >
                      <Box flexDirection="row" alignItems="center" gap="s">
                        <Text color="muted" flex={1}>
                          {song}
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color={theme.colors.muted}
                        />
                      </Box>
                    </Touch>
                  ))}
                </Box>
              ))}
            </Box>
            <Text variant="caption">
              Demo concert and fictional artists. No audio playback.
            </Text>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </ThemeProvider>
  );
}
