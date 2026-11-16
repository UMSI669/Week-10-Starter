import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@rneui/themed';

import { selectEventSections } from '../events/eventSelectors';
import { MOCK_DATA_NOTICE, photoWalks } from '../data/photoWalks';
import { useAppState } from '../state/AppState';
import EventSection from './events/EventSection';

/**
 * Teammate-owned events feature: Saved, Upcoming, and Attended sections of
 * inline-expandable photo walk cards. Saved stays at the top of the page and
 * shares bookmark state with the other sections through AppState.
 *
 * `eventId` pre-expands one card so Home's "Explore event" button still lands
 * on the right walk. Rendered inside the shared Screen scroll view, so the
 * sections map their cards instead of nesting another vertical list.
 */
export default function EventShowcase({ eventId, events = photoWalks }) {
  const { theme } = useTheme();
  const { savedEventIds } = useAppState();
  const [expandedSectionIds, setExpandedSectionIds] = useState([]);
  const [expandedCardKeys, setExpandedCardKeys] = useState(() =>
    eventId ? ['upcoming:' + eventId, 'attended:' + eventId, 'saved:' + eventId] : []
  );

  const sections = useMemo(
    () => selectEventSections(events, savedEventIds, new Date()),
    [events, savedEventIds]
  );

  const toggle = (setter) => (value) =>
    setter((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );

  return (
    <View style={styles.page}>
      <Text style={[styles.notice, { color: theme.colors.muted }]}>{MOCK_DATA_NOTICE}</Text>
      {sections.map((section) => (
        <EventSection
          key={section.id}
          section={section}
          isSectionExpanded={expandedSectionIds.includes(section.id)}
          onToggleSection={toggle(setExpandedSectionIds)}
          expandedCardKeys={expandedCardKeys}
          onToggleCard={toggle(setExpandedCardKeys)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { gap: 28 },
  notice: { fontSize: 12, lineHeight: 18 },
});
