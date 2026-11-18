import { View } from "react-native";
import { Button, Card, Text, useTheme } from "@rneui/themed";
import Screen from "../components/Screen";
import MemberCards from "../components/MemberCards";
import { events } from "../data/events";
export default function Home({ navigation }) {
  const { theme } = useTheme();
  return (
    <Screen
      title="See campus differently."
      subtitle="Your photography community. New perspectives, familiar places."
    >
      <Text h4 style={{ color: theme.colors.ink }}>
        Featured photographers
      </Text>
      <MemberCards
        limit={4}
        layout="grid"
        onSelect={(id) => navigation.navigate("PhotographerProfile", { id })}
      />
      <Button
        type="outline"
        title="View all photographers"
        onPress={() => navigation.navigate("Photographers")}
      />
      <Text h4 style={{ color: theme.colors.ink }}>
        Next photo walks
      </Text>
      {events.map((event) => (
        <Card key={event.id}>
          <View style={{ gap: 10 }}>
            <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>
              {event.theme}
            </Text>
            <Text h4 style={{ color: theme.colors.ink }}>
              {event.title}
            </Text>
            <Text style={{ color: theme.colors.muted }}>
              {event.date} · {event.place}
            </Text>
            <Button
              title="Explore event"
              onPress={() =>
                navigation.navigate("Events", {
                  eventId: event.id,
                  request: Date.now(),
                })
              }
            />
          </View>
        </Card>
      ))}
    </Screen>
  );
}
