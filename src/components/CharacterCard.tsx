import { Text } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { houseLabel } from '../data/characterProfiles';
import { palette, radius, spacing } from '../theme';
import type { CharacterMetadata, CharacterProfile } from '../types';

interface Props {
  profile: CharacterProfile;
  /** API metadata if the API returned a record for this character. */
  metadata?: CharacterMetadata;
  /** True when the API request as a whole succeeded. */
  apiLoaded: boolean;
  compact?: boolean;
  children?: React.ReactNode;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** Image, or an initials placeholder if none is available or it fails to load. */
function Portrait({ name, uri, size }: { name: string; uri: string | null; size: number }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [uri]);
  const box = { width: size, height: size * 1.25, borderRadius: radius.md };

  if (uri && !failed) {
    return (
      <Image
        testID="character-image"
        source={{ uri }}
        style={[styles.image, box]}
        onError={() => setFailed(true)}
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Image of ${name} provided by HP-API`}
      />
    );
  }
  return (
    <View
      testID="character-placeholder"
      style={[styles.placeholder, box]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`No image available. Placeholder showing the initials of ${name}.`}
    >
      <Text style={[styles.initials, { fontSize: size / 3 }]}>{initials(name)}</Text>
    </View>
  );
}

export function CharacterCard({ profile, metadata, apiLoaded, compact, children }: Props) {
  const house = metadata?.house ?? profile.house;
  const species = metadata?.species ?? null;
  const usingLocal = apiLoaded && !metadata;

  return (
    <View style={[styles.card, compact && styles.cardCompact]} testID={`character-card-${profile.id}`}>
      <Portrait name={profile.name} uri={metadata?.imageUrl ?? null} size={compact ? 64 : 104} />
      <View style={styles.body}>
        <Text h3={!compact} h4={compact} h3Style={styles.name} h4Style={styles.name}>
          {profile.name}
        </Text>
        <Text style={styles.meta}>
          {houseLabel(house)}
          {species ? ` · Species: ${species}` : ''}
        </Text>
        <Text style={styles.description}>{profile.description}</Text>
        <Text style={styles.fan}>Fan interpretation</Text>
        {usingLocal ? (
          <Text style={styles.localNote} testID={`local-note-${profile.id}`}>
            ⓘ This card uses local character details.
          </Text>
        ) : null}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    backgroundColor: palette.surfaceRaised,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
  },
  cardCompact: { padding: spacing.sm + 4 },
  image: { backgroundColor: palette.background },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.background,
    borderWidth: 2,
    borderColor: palette.goldDark,
  },
  initials: { color: palette.gold, fontWeight: '700' },
  body: { flex: 1, minWidth: 200 },
  name: { color: palette.gold },
  meta: { color: palette.cream, fontWeight: '600', marginTop: 2 },
  description: { color: palette.cream, marginTop: spacing.sm },
  fan: { color: palette.creamMuted, fontSize: 13, fontStyle: 'italic', marginTop: spacing.xs },
  localNote: { color: palette.creamMuted, fontSize: 14, marginTop: spacing.xs },
});
