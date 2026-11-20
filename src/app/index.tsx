import { router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Checkbox, HelperText, MD3LightTheme, RadioButton, Searchbar, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
import { components, type ComponentId } from '../data/components';

function PreviewContent({ id }: { id: ComponentId }) {
  switch (id) {
    case 'radio-button': return <View style={styles.previewRow}><Text>Normal</Text><RadioButton value="normal" status="checked" /></View>;
    case 'checkbox': return <View style={styles.previewRow}><Text>Send me updates</Text><Checkbox status="checked" /></View>;
    case 'menu': return <View style={styles.previewMenu}><Button mode="outlined" icon="chevron-down">Open menu</Button></View>;
    case 'text-input': return <TextInput mode="outlined" label="Your name" value="" editable={false} style={styles.previewInput} />;
    case 'helper-text': return <View><TextInput mode="outlined" label="Username" value="" editable={false} style={styles.previewInput} /><HelperText type="info" visible>Use at least 3 characters for your username.</HelperText></View>;
    case 'validation': return <View><TextInput mode="outlined" label="Email address" value="name@" editable={false} error style={styles.previewInput} /><HelperText type="error" visible>Enter a valid email address.</HelperText></View>;
    case 'search-bar': return <Searchbar placeholder="Search fruits" value="" editable={false} style={styles.previewSearch} />;
  }
}

// Previews are decorative: they must not swallow taps meant for the card or be read out by screen readers.
function Preview({ id }: { id: ComponentId }) {
  return <View style={styles.preview} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><PreviewContent id={id} /></View>;
}

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => components.filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase())), [query]);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={<View style={styles.header}><Text variant="headlineSmall" style={styles.heading}>React Native Paper Showcase</Text><Text style={styles.subtitle}>Explore the components and try their states.</Text><Searchbar placeholder="Search components" value={query} onChangeText={setQuery} style={styles.search} accessibilityLabel="Search components" /></View>}
        ListEmptyComponent={<Text style={styles.empty}>No components found.</Text>}
        renderItem={({ item }) => <Card style={styles.card} onPress={() => router.push({ pathname: '/component/[id]', params: { id: item.id } })} accessibilityLabel={`Open ${item.title} example`}><Card.Content><Preview id={item.id} /><Text variant="titleMedium" style={styles.cardTitle}>{item.title}</Text><Text variant="bodySmall" style={styles.description}>{item.description}</Text></Card.Content></Card>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: MD3LightTheme.colors.background },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
  header: { paddingTop: 20, paddingBottom: 12 },
  heading: { fontWeight: '700', color: MD3LightTheme.colors.onSurface },
  subtitle: { marginTop: 6, marginBottom: 20, color: MD3LightTheme.colors.onSurfaceVariant },
  search: { marginBottom: 8 },
  card: { marginBottom: 16, borderRadius: 18 },
  cardTitle: { marginTop: 14, fontWeight: '700' },
  description: { color: MD3LightTheme.colors.onSurfaceVariant, marginTop: 3 },
  previewRow: { borderWidth: 1, borderColor: MD3LightTheme.colors.outline, minHeight: 56, borderRadius: 4, paddingLeft: 16, paddingRight: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  preview: { pointerEvents: 'none' },
  previewMenu: { alignItems: 'flex-start' },
  previewInput: { backgroundColor: MD3LightTheme.colors.surface, height: 56 },
  previewSearch: { backgroundColor: MD3LightTheme.colors.surfaceVariant },
  empty: { textAlign: 'center', marginTop: 32, color: MD3LightTheme.colors.onSurfaceVariant },
});
