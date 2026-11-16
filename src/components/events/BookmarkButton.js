import { Pressable, StyleSheet } from 'react-native';
import { Text, useTheme } from '@rneui/themed';

import { useAppState } from '../../state/AppState';
import BookmarkIcon from './BookmarkIcon';

/**
 * Toggles saved state for one event. Rendered as a sibling of the card's
 * expand control, never inside it, so pressing it can never expand the card.
 */
export default function BookmarkButton({ event, testID }) {
  const { theme } = useTheme();
  const { savedEventIds, toggleSavedEvent } = useAppState();
  const isSaved = Array.isArray(savedEventIds) && savedEventIds.includes(event.id);
  const color = isSaved ? theme.colors.saved : theme.colors.muted;

  return (
    <Pressable
      testID={testID}
      onPress={() => toggleSavedEvent(event.id)}
      accessibilityRole="button"
      accessibilityState={{ selected: isSaved }}
      accessibilityLabel={isSaved ? `Saved: ${event.title}` : `Save ${event.title}`}
      accessibilityHint={
        isSaved ? 'Removes this walk from Saved events.' : 'Adds this walk to Saved events.'
      }
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        isSaved && { backgroundColor: theme.colors.savedSurface },
        pressed && styles.pressed,
      ]}
    >
      <BookmarkIcon filled={isSaved} color={color} size={22} />
      {/* Text label so saved status is never carried by color alone. */}
      <Text style={[styles.label, { color }]}>{isSaved ? 'Saved' : 'Save'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 52,
    minHeight: 52,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  pressed: { opacity: 0.6 },
  label: { fontSize: 11, fontWeight: '700' },
});
