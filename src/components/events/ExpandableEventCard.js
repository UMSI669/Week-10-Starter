import { Pressable, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from '@rneui/themed';
import { Feather } from '@expo/vector-icons';

import {
  formatFullDateTime,
  formatLocationDetail,
  formatLocationSummary,
  formatSummaryDateTime,
  isVirtual,
  locationHeading,
} from '../../utils/eventFormatting';
import BookmarkButton from './BookmarkButton';
import OrganizerContact from './OrganizerContact';
import ThemeBadges from './ThemeBadges';

/**
 * Full-width card with a horizontal summary row. Details open inline — there is
 * no event details page. The bookmark sits outside the expand pressable so the
 * two controls can never trigger each other.
 */
export default function ExpandableEventCard({ event, isExpanded, onToggleExpanded, testID }) {
  const { theme } = useTheme();
  const virtual = isVirtual(event);
  const modeLabel = virtual ? 'Virtual' : 'In person';

  return (
    <Card containerStyle={styles.card} testID={testID}>
      <View style={styles.summaryRow}>
        <Pressable
          testID={testID ? `${testID}-summary` : undefined}
          onPress={onToggleExpanded}
          accessibilityRole="button"
          accessibilityState={{ expanded: isExpanded }}
          accessibilityLabel={`${event.title}. ${modeLabel}. ${formatSummaryDateTime(event)}. ${formatLocationSummary(event)}.`}
          accessibilityHint={isExpanded ? 'Collapses the walk details.' : 'Expands the walk details.'}
          style={({ pressed }) => [styles.summaryPressable, pressed && styles.pressed]}
        >
          <View style={[styles.modePill, { backgroundColor: theme.colors.subtleSurface }]}>
            <Feather
              name={virtual ? 'video' : 'map-pin'}
              size={12}
              color={theme.colors.ink}
            />
            <Text style={[styles.modeText, { color: theme.colors.ink }]}>{modeLabel}</Text>
          </View>

          <Text style={[styles.title, { color: theme.colors.ink }]}>{event.title}</Text>
          <Text style={[styles.meta, { color: theme.colors.primary }]}>
            {formatSummaryDateTime(event)}
          </Text>
          <Text style={[styles.meta, { color: theme.colors.muted }]}>
            {formatLocationSummary(event)}
          </Text>
          <ThemeBadges themes={event.themes} />

          <View style={styles.indicatorRow}>
            <Text style={[styles.indicatorText, { color: theme.colors.primary }]}>
              {isExpanded ? 'Hide details' : 'Show details'}
            </Text>
            <Feather
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={theme.colors.primary}
            />
          </View>
        </Pressable>

        <BookmarkButton event={event} testID={testID ? `${testID}-bookmark` : undefined} />
      </View>

      {isExpanded && (
        <View
          style={[styles.details, { borderTopColor: theme.colors.border }]}
          testID={testID ? `${testID}-details` : undefined}
        >
          <Text style={[styles.body, { color: theme.colors.ink }]}>{event.description}</Text>

          <View>
            <Text style={[styles.detailHeading, { color: theme.colors.ink }]}>When</Text>
            <Text style={[styles.body, { color: theme.colors.muted }]}>
              {formatFullDateTime(event)}
            </Text>
          </View>

          <View>
            <Text style={[styles.detailHeading, { color: theme.colors.ink }]}>
              {locationHeading(event)}
            </Text>
            <Text style={[styles.body, { color: theme.colors.muted }]}>
              {formatLocationDetail(event)}
            </Text>
          </View>

          <View>
            <Text style={[styles.detailHeading, { color: theme.colors.ink }]}>Themes</Text>
            <ThemeBadges themes={event.themes} />
          </View>

          <View>
            <Text style={[styles.detailHeading, { color: theme.colors.ink }]}>What to bring</Text>
            {(event.whatToBring || []).map((item) => (
              <Text key={item} style={[styles.body, { color: theme.colors.muted }]}>
                {`•  ${item}`}
              </Text>
            ))}
          </View>

          <OrganizerContact event={event} testID={testID ? `${testID}-organizer` : undefined} />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', marginBottom: 0 },
  summaryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  summaryPressable: { flex: 1, gap: 6, paddingVertical: 2, minHeight: 44 },
  pressed: { opacity: 0.7 },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  title: { fontSize: 17, fontWeight: '800', lineHeight: 23 },
  meta: { fontSize: 13, fontWeight: '600', lineHeight: 19 },
  indicatorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6, minHeight: 28 },
  indicatorText: { fontSize: 13, fontWeight: '700' },
  details: { gap: 14, marginTop: 16, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth },
  detailHeading: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  body: { fontSize: 14, lineHeight: 21 },
});
