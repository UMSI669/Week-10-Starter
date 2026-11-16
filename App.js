import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, ThemeProvider, useTheme, useThemeMode } from '@rneui/themed';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import MemberCards from './src/components/MemberCards';
import EventShowcase from './src/components/EventShowcase';
import { appTheme } from './src/theme';

function SectionHeading({ number, title, description }) {
  const { theme } = useTheme();
  return (
    <View style={styles.sectionHeading}>
      <Text style={[styles.sectionNumber, { color: theme.colors.primary }]}>{number}</Text>
      <View style={styles.sectionCopy}>
        <Text h4 style={{ color: theme.colors.ink }}>{title}</Text>
        <Text style={[styles.sectionDescription, { color: theme.colors.muted }]}>{description}</Text>
      </View>
    </View>
  );
}

function DirectoryScreen() {
  const { theme } = useTheme();
  const { mode, setMode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.wordmark, { color: theme.colors.primary }]}>FRAME / CAMPUS</Text>
          <Text style={[styles.courseTag, { color: theme.colors.muted }]}>DLV · WEEK 10</Text>
        </View>

        <View style={[styles.hero, { backgroundColor: theme.colors.hero }]}>
          <Text style={[styles.eyebrow, { color: theme.colors.heroAccent }]}>PHOTOGRAPHY CLUB</Text>
          <Text h2 style={styles.heroTitle}>See campus through a different lens.</Text>
          <Text style={styles.heroDescription}>Meet our photographers and explore the next photo walk.</Text>
          <Button
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            type="outline"
            onPress={() => setMode(isDark ? 'light' : 'dark')}
            buttonStyle={styles.heroButton}
            titleStyle={styles.heroButtonText}
          />
        </View>

        <SectionHeading number="01" title="Our photographers" description="Explore profile cards and tap a badge for context." />
        <MemberCards />
        <SectionHeading number="02" title="Upcoming photo walks" description="Expand the event list and open the details." />
        <EventShowcase />
        <Text style={[styles.footer, { color: theme.colors.muted }]}>Photography Club · DLV React Native Elements showcase</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={appTheme}>
        <DirectoryScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  wordmark: { fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  courseTag: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  hero: { borderRadius: 26, padding: 24, marginBottom: 30 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 12 },
  heroTitle: { color: '#FFFFFF', fontWeight: '800', lineHeight: 36, marginBottom: 12 },
  heroDescription: { color: '#DDE6FF', fontSize: 15, lineHeight: 22, marginBottom: 22 },
  heroButton: { borderColor: '#FFFFFF', alignSelf: 'flex-start', paddingHorizontal: 18 },
  heroButtonText: { color: '#FFFFFF' },
  sectionHeading: { flexDirection: 'row', gap: 12, marginBottom: 16, alignItems: 'flex-start' },
  sectionNumber: { fontSize: 14, fontWeight: '900', paddingTop: 5 },
  sectionCopy: { flex: 1 },
  sectionDescription: { fontSize: 14, marginTop: 4, lineHeight: 20 },
  footer: { textAlign: 'center', fontSize: 12, marginTop: 36 },
});
