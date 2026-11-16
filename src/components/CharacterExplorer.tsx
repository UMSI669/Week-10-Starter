import { Button, SearchBar, Text } from '@rneui/themed';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CHARACTER_PROFILES } from '../data/characterProfiles';
import { palette, spacing } from '../theme';
import type { MetadataResult } from '../types';
import { filterCharacters } from '../utils/search';
import { CharacterCard } from './CharacterCard';
import { Panel } from './Panel';

interface Props {
  /** Already-loaded metadata; the explorer never fetches on its own. */
  metadata: MetadataResult;
}

export function CharacterExplorer({ metadata }: Props) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => filterCharacters(CHARACTER_PROFILES, query), [query]);
  const apiLoaded = metadata.status === 'success';

  return (
    <Panel testID="character-explorer">
      <Text h2>Explore the characters</Text>
      <Text style={styles.intro}>
        Search all seven possible matches by name or house. Try “Dobby” or “No Hogwarts house”.
      </Text>
      <Text style={styles.label} nativeID="character-search-label">
        Search characters
      </Text>
      <SearchBar
        testID="character-search"
        placeholder="Name or house"
        value={query}
        onChangeText={(text: string) => setQuery(text)}
        onClear={() => setQuery('')}
        searchIcon={{ type: 'material', name: 'search', color: palette.creamMuted }}
        clearIcon={{ type: 'material', name: 'clear', color: palette.creamMuted }}
        accessibilityLabel="Search characters by name or house"
        autoCorrect={false}
        autoCapitalize="none"
      />
      <Text style={styles.count} accessibilityLiveRegion="polite">
        Showing {results.length} of {CHARACTER_PROFILES.length} characters
      </Text>
      {results.length === 0 ? (
        <View style={styles.empty} testID="explorer-empty">
          <Text style={styles.emptyTitle}>No characters match “{query.trim()}”.</Text>
          <Text style={styles.emptyText}>
            Try a name like “Luna” or a house like “Gryffindor”.
          </Text>
          <Button title="Clear search" type="outline" onPress={() => setQuery('')} buttonStyle={styles.clear} titleStyle={styles.clearTitle} />
        </View>
      ) : (
        <View style={styles.list}>
          {results.map((profile) => (
            <CharacterCard
              key={profile.id}
              profile={profile}
              metadata={metadata.byProfileId[profile.id]}
              apiLoaded={apiLoaded}
              compact
            />
          ))}
        </View>
      )}
    </Panel>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: spacing.sm, marginBottom: spacing.md },
  label: { fontWeight: '700' },
  count: { color: palette.creamMuted, marginBottom: spacing.sm },
  list: { gap: spacing.md },
  empty: { gap: spacing.sm, alignItems: 'flex-start', paddingVertical: spacing.md },
  emptyTitle: { fontWeight: '700' },
  emptyText: { color: palette.creamMuted },
  clear: { backgroundColor: 'transparent', borderColor: palette.gold },
  clearTitle: { color: palette.gold },
});
