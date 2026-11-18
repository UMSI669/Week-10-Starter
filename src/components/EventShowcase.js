import { useState } from "react";
import { Linking, View } from "react-native";
import {
  Badge,
  Button,
  ListItem,
  Text,
  Tooltip,
  useTheme,
} from "@rneui/themed";
import { events } from "../data/events";

// Teammate-owned event components, kept separate from navigation and settings.
export default function EventShowcase({ eventId }) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(eventId || null);
  const [tip, setTip] = useState(null);
  const [error, setError] = useState("");
  async function email(event) {
    try {
      await Linking.openURL(
        "mailto:rsvp@example.com?subject=" +
          encodeURIComponent("RSVP: " + event.title),
      );
    } catch {
      setError("No email app is available. Demo address: rsvp@example.com");
    }
  }
  return (
    <View style={{ gap: 16 }}>
      {events.map((event) => (
        <View
          key={event.id}
          style={{
            borderRadius: 18,
            borderWidth: 1,
            borderColor: theme.colors.border,
            overflow: "hidden",
          }}
        >
          <ListItem.Accordion
            accessibilityLabel={"Expand " + event.title}
            accessibilityState={{ expanded: expanded === event.id }}
            containerStyle={{ backgroundColor: theme.colors.surface }}
            content={
              <ListItem.Content>
                <ListItem.Title
                  style={{ color: theme.colors.ink, fontWeight: "800" }}
                >
                  {event.title}
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: theme.colors.muted }}>
                  {event.date}
                </ListItem.Subtitle>
              </ListItem.Content>
            }
            isExpanded={expanded === event.id}
            onPress={() => setExpanded(expanded === event.id ? null : event.id)}
          >
            <View
              style={{
                padding: 18,
                gap: 14,
                backgroundColor: theme.colors.surface,
              }}
            >
              <Badge
                value={event.theme}
                status="primary"
                containerStyle={{ alignSelf: "flex-start" }}
              />
              <Text style={{ color: theme.colors.ink, lineHeight: 22 }}>
                {event.description}
              </Text>
              <Text style={{ color: theme.colors.muted }}>
                Meet at {event.place}
              </Text>
              <Text style={{ color: theme.colors.ink, fontWeight: "800" }}>
                Prepare for the walk
              </Text>
              {["Camera or phone", "Charged battery", "Comfortable shoes"].map(
                (item) => (
                  <Text key={item} style={{ color: theme.colors.muted }}>
                    • {item}
                  </Text>
                ),
              )}
              <Tooltip
                visible={tip === event.id}
                onOpen={() => setTip(event.id)}
                onClose={() => setTip(null)}
                width={260}
                height={100}
                backgroundColor={theme.colors.hero}
                popover={
                  <Text style={{ color: "#fff", lineHeight: 20 }}>
                    Email the organizer with your name and the event title. This
                    prototype uses a demo email address.
                  </Text>
                }
              >
                <Text
                  accessibilityRole="button"
                  style={{
                    color: theme.colors.primary,
                    paddingVertical: 12,
                    fontWeight: "700",
                  }}
                >
                  How do I RSVP?
                </Text>
              </Tooltip>
              <Text style={{ color: theme.colors.muted }}>
                rsvp@example.com · demo address
              </Text>
              <Button title="Open email draft" onPress={() => email(event)} />
            </View>
          </ListItem.Accordion>
        </View>
      ))}
      {!!error && <Text style={{ color: theme.colors.muted }}>{error}</Text>}
    </View>
  );
}
