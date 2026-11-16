import { Ionicons } from "@expo/vector-icons";
import { Box } from "../theme";
import { useConcertTheme } from "../useConcertTheme";
import { useSavedConcerts } from "../state/SavedConcerts";
import { Artist } from "../data";
import { Touch } from "./ConcertUI";

// Keep this overlay a sibling of the concert link so saving never opens it.
export function SaveConcertButton({ artist }: { artist: Artist }) {
  const saved = useSavedConcerts();
  const theme = useConcertTheme(artist.atmosphere);
  const selected = saved.ids.includes(artist.id);
  return (
    <Box position="absolute" top={12} right={12}>
      <Touch
        label={selected ? `Unsave ${artist.name}` : `Save ${artist.name}`}
        onPress={() => saved.toggle(artist.id)}
      >
        <Box
          width={48}
          height={48}
          borderRadius="pill"
          backgroundColor="background"
          borderWidth={1}
          borderColor="border"
          alignItems="center"
          justifyContent="center"
        >
          <Ionicons
            name={selected ? "bookmark" : "bookmark-outline"}
            size={23}
            color={theme.colors.accent}
          />
        </Box>
      </Touch>
    </Box>
  );
}
