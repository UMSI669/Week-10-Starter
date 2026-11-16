import './src/theme/icons';

import { ThemeProvider } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import type { ScrollViewInstance } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CHARACTER_PROFILES } from './src/data/characterProfiles';
import { QuizScreen } from './src/screens/QuizScreen';
import { ResultsScreen } from './src/screens/ResultsScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { loadCharacterMetadata } from './src/services/characterApi';
import { MAX_CONTENT_WIDTH, palette, spacing, theme } from './src/theme';
import type { QuizAnswers, QuizResult } from './src/types';
import { buildQuizResult, createInitialAnswers, getCompletion } from './src/utils/scoring';

type Stage = 'welcome' | 'quiz' | 'results';

export default function App() {
  const [stage, setStage] = useState<Stage>('welcome');
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<QuizAnswers>(createInitialAnswers);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);
  const submitting = useRef(false);
  const resultCounter = useRef(0);
  const scrollRef = useRef<ScrollViewInstance>(null);

  // Start loading API metadata early (cached per session). Failures are fine.
  useEffect(() => {
    loadCharacterMetadata().catch(() => undefined);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [stage]);

  const reveal = async () => {
    if (submitting.current || !getCompletion(answers).isComplete) return;
    submitting.current = true;
    setLoading(true);
    try {
      let metadata: QuizResult['metadata'];
      try {
        metadata = await loadCharacterMetadata();
      } catch {
        metadata = { status: 'error', byProfileId: {} };
      }
      resultCounter.current += 1;
      setResult(buildQuizResult(answers, CHARACTER_PROFILES, metadata, resultCounter.current));
      setStage('results');
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  const retake = () => {
    setAnswers(createInitialAnswers());
    setResult(null);
    setStage('quiz');
  };

  const edit = () => {
    setStage('quiz');
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.safe}>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              ref={scrollRef}
              style={styles.flex}
              contentContainerStyle={styles.scroll}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.content}>
                {stage === 'welcome' && (
                  <WelcomeScreen name={name} onNameChange={setName} onBegin={() => setStage('quiz')} />
                )}
                {stage === 'quiz' && (
                  <QuizScreen
                    name={name}
                    answers={answers}
                    onAnswersChange={setAnswers}
                    onReveal={reveal}
                    loading={loading}
                  />
                )}
                {stage === 'results' && result && (
                  <ResultsScreen
                    key={result.id}
                    name={name}
                    result={result}
                    onRetake={retake}
                    onEdit={edit}
                  />
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.lg },
  content: { width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' },
});
