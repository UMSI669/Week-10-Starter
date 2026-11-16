import Screen from '../components/Screen';
import EventShowcase from '../components/EventShowcase';
export default function Events({ route }) {
  return <Screen title="Photo walks" subtitle="Browse nearby and virtual walks, save the ones you want, and expand a card for details.">
    <EventShowcase key={route.params?.request || 'initial'} eventId={route.params?.eventId} />
  </Screen>;
}
