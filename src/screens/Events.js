import Screen from "../components/Screen";
import EventShowcase from "../components/EventShowcase";
export default function Events({ route }) {
  return (
    <Screen
      title="Photo walks"
      subtitle="Pick an event, check what to bring, and join the walk."
    >
      <EventShowcase
        key={route.params?.request || "initial"}
        eventId={route.params?.eventId}
      />
    </Screen>
  );
}
