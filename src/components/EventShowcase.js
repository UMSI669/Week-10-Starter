import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge, Button, ListItem, Overlay, Text, useTheme } from '@rneui/themed';

import { events } from '../data/events';

// Teammate 3 can add RSVP, photo grids, and richer event details here.
export default function EventShowcase() {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <View>
      <View style={[styles.listBox, { borderColor: theme.colors.border }]}>
        <ListItem.Accordion
          content={
            <ListItem.Content>
              <ListItem.Title style={{ color: theme.colors.ink, fontWeight: '800' }}>
                Explore photo walks
              </ListItem.Title>
              <ListItem.Subtitle style={{ color: theme.colors.muted }}>
                Tap to {expanded ? 'hide' : 'show'} {events.length} events
              </ListItem.Subtitle>
            </ListItem.Content>
          }
          isExpanded={expanded}
          onPress={() => setExpanded(!expanded)}
        >
          {events.map((event) => (
            <ListItem key={event.id} bottomDivider onPress={() => setSelected(event)}>
              <ListItem.Content>
                <ListItem.Title style={{ color: theme.colors.ink, fontWeight: '700' }}>
                  {event.title}
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: theme.colors.muted }}>
                  {event.date} · {event.place}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          ))}
        </ListItem.Accordion>
      </View>

      <Overlay
        isVisible={selected !== null}
        onBackdropPress={() => setSelected(null)}
        overlayStyle={[styles.overlay, { backgroundColor: theme.colors.surface }]}
      >
        {selected && (
          <View>
            <Badge value={selected.theme} status="primary" containerStyle={styles.badge} />
            <Text h4 style={{ color: theme.colors.ink }}>{selected.title}</Text>
            <Text style={[styles.meta, { color: theme.colors.primary }]}>
              {selected.date} · {selected.place}
            </Text>
            <Text style={[styles.description, { color: theme.colors.muted }]}>
              {selected.description}
            </Text>
            <Button title="Close event" onPress={() => setSelected(null)} />
          </View>
        )}
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  listBox: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  overlay: { width: '86%', borderRadius: 20, padding: 24 },
  badge: { alignSelf: 'flex-start', marginBottom: 12 },
  meta: { fontSize: 14, fontWeight: '700', marginTop: 6 },
  description: { fontSize: 15, lineHeight: 23, marginVertical: 20 },
});
