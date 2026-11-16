import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@rneui/themed';
import { Feather } from '@expo/vector-icons';

import { PREVIEW_COUNT, hasMoreThanPreview, previewEvents } from '../../events/eventSelectors';
import ExpandableEventCard from './ExpandableEventCard';

/**
 * One page section: heading, up to three events, and a "View all" control that
 * expands the rest of the list inline. No navigation, no nested scroll view —
 * the list is short and lives inside the shared Screen scroll view.
 */
export default function EventSection({
  section,
  isSectionExpanded,
  onToggleSection,
  expandedCardKeys,
  onToggleCard,
}) {
  const { theme } = useTheme();
  const { events, title, emptyMessage, id } = section;
  const visible = previewEvents(events, isSectionExpanded);
  const showControl = hasMoreThanPreview(events);
  const hidden = events.length - PREVIEW_COUNT;

  return (
    <View style={styles.section} testID={`section-${id}`}>
      <View style={styles.headingRow}>
        <Text
          h4
          accessibilityRole="header"
          style={[styles.heading, { color: theme.colors.ink }]}
        >
          {title}
        </Text>
        <Text style={[styles.count, { color: theme.colors.muted }]}>
          {events.length === 1 ? '1 walk' : `${events.length} walks`}
        </Text>
      </View>

      {events.length === 0 ? (
        <View style={[styles.empty, { backgroundColor: theme.colors.subtleSurface }]}>
          <Text style={[styles.emptyText, { color: theme.colors.muted }]}>{emptyMessage}</Text>
        </View>
      ) : (
        <View style={styles.stack}>
          {visible.map((event) => {
            const cardKey = `${id}:${event.id}`;
            return (
              <ExpandableEventCard
                key={cardKey}
                event={event}
                testID={`event-${cardKey}`}
                isExpanded={expandedCardKeys.includes(cardKey)}
                onToggleExpanded={() => onToggleCard(cardKey)}
              />
            );
          })}
        </View>
      )}

      {showControl && (
        <Pressable
          testID={`section-${id}-toggle`}
          onPress={() => onToggleSection(id)}
          accessibilityRole="button"
          accessibilityState={{ expanded: isSectionExpanded }}
          accessibilityLabel={
            isSectionExpanded
              ? `Show less in ${title}`
              : `View all ${events.length} walks in ${title}`
          }
          style={({ pressed }) => [
            styles.control,
            { borderColor: theme.colors.border },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.controlText, { color: theme.colors.primary }]}>
            {isSectionExpanded ? 'Show less' : `View all (${hidden} more)`}
          </Text>
          <Feather
            name={isSectionExpanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={theme.colors.primary}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  headingRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  heading: { fontWeight: '800', flexShrink: 1 },
  count: { fontSize: 12, fontWeight: '700' },
  stack: { gap: 12 },
  empty: { borderRadius: 14, padding: 16 },
  emptyText: { fontSize: 14, lineHeight: 21 },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  pressed: { opacity: 0.6 },
  controlText: { fontSize: 14, fontWeight: '700' },
});
