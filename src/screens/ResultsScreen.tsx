import { Button, Rating, Text } from '@rneui/themed';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CharacterCard } from '../components/CharacterCard';
import { CharacterExplorer } from '../components/CharacterExplorer';
import { Panel } from '../components/Panel';
import { TRAIT_LABELS } from '../data/quizQuestions';
import { palette, radius, spacing } from '../theme';
import { TRAITS } from '../types';
import type { QuizResult } from '../types';
import { formatScore, joinList } from '../utils/scoring';

interface Props {
  name: string;
  result: QuizResult;
  onRetake: () => void;
  onEdit: () => void;
}

function FitMeter({ fit }: { fit: number }) {
  return (
    <View style={styles.fit} accessible accessibilityLabel={`Quiz fit ${fit} out of 100`}>
      <Text style={styles.fitLabel}>
        Quiz fit: <Text style={styles.fitValue}>{fit}</Text> / 100
      </Text>
      <View style={styles.fitTrack}>
        <View style={[styles.fitFill, { width: `${fit}%` }]} />
      </View>
    </View>
  );
}

export function ResultsScreen({ name, result, onRetake, onEdit }: Props) {
  // Feedback lives only in this component's state; a new result remounts it.
  const [rating, setRating] = useState(0);
  const [showHow, setShowHow] = useState(false);
  const apiLoaded = result.metadata.status === 'success';
  const shared = result.topMatches.length > 1;

  return (
    <View>
      <Panel style={styles.hero}>
        <Text h1 accessibilityRole="header" style={styles.center}>
          Your match, {name.trim()}
        </Text>
        {shared ? (
          <Text style={[styles.center, styles.shared]} testID="shared-note">
            It’s a tie! {joinList(result.topMatches.map((m) => m.profile.name))} are equally close
            to your answers, so you share a match.
          </Text>
        ) : null}
        {!apiLoaded ? (
          <Text style={[styles.center, styles.status]} testID="fallback-note">
            ⓘ Showing local character details; live data is unavailable.
          </Text>
        ) : null}

        <View style={styles.matches}>
          {result.topMatches.map((match) => (
            <CharacterCard
              key={match.profile.id}
              profile={match.profile}
              metadata={result.metadata.byProfileId[match.profile.id]}
              apiLoaded={apiLoaded}
            >
              <FitMeter fit={match.fit} />
            </CharacterCard>
          ))}
        </View>
        <Text style={styles.fitNote}>
          Quiz fit reflects similarity to our hand-written character profiles. It is not a
          probability or a scientific measure.
        </Text>
      </Panel>

      <Panel>
        <Text h2 accessibilityRole="header">
          What stood out
        </Text>
        <Text style={styles.explanation} testID="explanation">
          {result.explanation}
        </Text>
        <Text h4 style={styles.subhead}>
          Your trait scores (1–5)
        </Text>
        {TRAITS.map((trait) => {
          const score = result.scores[trait];
          const standout = result.standoutTraits.includes(trait);
          return (
            <View
              key={trait}
              style={styles.traitRow}
              accessible
              accessibilityLabel={`${TRAIT_LABELS[trait]} ${formatScore(score)} out of 5${standout ? ', stood out' : ''}`}
            >
              <Text style={[styles.traitName, standout && styles.traitStandout]}>
                {standout ? '★ ' : ''}
                {TRAIT_LABELS[trait]}
              </Text>
              <View style={styles.traitTrack}>
                <View style={[styles.traitFill, { width: `${((score - 1) / 4) * 100}%` }]} />
              </View>
              <Text style={styles.traitScore}>{formatScore(score)}</Text>
            </View>
          );
        })}
        <Text style={styles.legend}>★ marks your standout traits.</Text>
      </Panel>

      <Panel>
        <Text h2 accessibilityRole="header">
          Closest matches
        </Text>
        {result.topThree.map((match) => (
          <View key={match.profile.id} style={styles.rankRow} testID={`rank-${match.profile.id}`}>
            <Text style={styles.rankNum}>#{match.rank}</Text>
            <Text style={styles.rankName}>{match.profile.name}</Text>
            <Text style={styles.rankFit}>Quiz fit {match.fit}</Text>
          </View>
        ))}
        <Text style={styles.legend}>Characters with the same rank are tied.</Text>
      </Panel>

      <Panel>
        <Text h3 accessibilityRole="header">
          How well does this match feel?
        </Text>
        <View testID="match-rating" accessible accessibilityLabel={`Star rating, ${rating} of 5`}>
        <Rating
          type="custom"
          ratingCount={5}
          startingValue={rating}
          key={rating}
          imageSize={40}
          fractions={0}
          jumpValue={1}
          minValue={0}
          ratingColor={palette.gold}
          ratingBackgroundColor={palette.border}
          tintColor={palette.surface}
          onFinishRating={(value: number) => setRating(Math.round(value))}
          style={styles.rating}
        />
        </View>
        <View style={styles.ratingButtons}>
          <Button
            title="−"
            type="outline"
            onPress={() => setRating((r) => Math.max(0, r - 1))}
            disabled={rating <= 0}
            accessibilityLabel="Lower rating by one star"
            buttonStyle={styles.outline}
            titleStyle={styles.outlineTitle}
          />
          <Text style={styles.ratingText} accessibilityLiveRegion="polite" testID="rating-text">
            {rating === 0 ? 'Not rated yet' : `You rated it ${rating} of 5 stars`}
          </Text>
          <Button
            title="+"
            type="outline"
            onPress={() => setRating((r) => Math.min(5, r + 1))}
            disabled={rating >= 5}
            accessibilityLabel="Raise rating by one star"
            buttonStyle={styles.outline}
            titleStyle={styles.outlineTitle}
          />
        </View>
        <Text style={styles.legend}>Your rating is not submitted anywhere.</Text>
      </Panel>

      <View style={styles.actions}>
        <Button
          testID="edit-button"
          title="Edit answers"
          type="outline"
          onPress={onEdit}
          icon={{ type: 'material', name: 'edit', color: palette.gold }}
          buttonStyle={styles.outline}
          titleStyle={styles.outlineTitle}
          containerStyle={styles.actionButton}
        />
        <Button
          testID="retake-button"
          title="Retake quiz"
          onPress={onRetake}
          icon={{ type: 'material', name: 'refresh', color: palette.onGold }}
          containerStyle={styles.actionButton}
        />
      </View>

      <Panel>
        <Button
          testID="how-toggle"
          title={showHow ? 'Hide how matching works' : 'How matching works'}
          type="clear"
          onPress={() => setShowHow((v) => !v)}
          accessibilityState={{ expanded: showHow }}
          icon={{
            type: 'material',
            name: showHow ? 'expand-less' : 'expand-more',
            color: palette.gold,
          }}
          iconRight
          buttonStyle={styles.clearButton}
          titleStyle={styles.outlineTitle}
        />
        {showHow ? (
          <View style={styles.how} testID="how-content">
            <Text>
              <Text style={styles.bold}>Hand-written profiles. </Text>
              Our team gave each of the seven characters a 1–5 score for courage, curiosity,
              ambition, empathy, and independence. These are fan interpretations.
            </Text>
            <Text>
              <Text style={styles.bold}>Scoring. </Text>
              Each slider sets a trait from 1 to 5. Every scenario answer or value that points to a
              trait adds 0.25, and the total is kept between 1 and 5.
            </Text>
            <Text>
              <Text style={styles.bold}>Distance. </Text>
              We add up the differences between your five scores and each character’s five scores.
              A smaller total means a closer match.
            </Text>
            <Text>
              <Text style={styles.bold}>Ties. </Text>
              Characters with the same distance share a rank, and all first-place ties are shown.
            </Text>
            <Text>
              <Text style={styles.bold}>Quiz fit. </Text>
              100 × (1 − distance ÷ 20), rounded and kept between 0 and 100. It describes similarity
              to our profiles, not probability or accuracy.
            </Text>
            <Text style={styles.italic}>
              This quiz is for entertainment only. A match says nothing about anyone’s character or
              morality.
            </Text>
          </View>
        ) : null}
      </Panel>

      <CharacterExplorer metadata={result.metadata} />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { borderColor: palette.goldDark, borderWidth: 2 },
  center: { textAlign: 'center' },
  shared: { marginTop: spacing.sm, fontWeight: '600' },
  status: { marginTop: spacing.sm, color: palette.creamMuted },
  matches: { gap: spacing.md, marginTop: spacing.lg },
  fit: { marginTop: spacing.md },
  fitLabel: { fontWeight: '600' },
  fitValue: { color: palette.gold, fontWeight: '700', fontSize: 20 },
  fitTrack: { height: 10, backgroundColor: palette.background, borderRadius: 5, marginTop: 6, overflow: 'hidden' },
  fitFill: { height: 10, backgroundColor: palette.gold },
  fitNote: { color: palette.creamMuted, marginTop: spacing.md, fontSize: 14 },
  explanation: { fontSize: 17, lineHeight: 26, marginTop: spacing.sm },
  subhead: { marginTop: spacing.lg, marginBottom: spacing.sm },
  traitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginVertical: 6 },
  traitName: { width: 150 },
  traitStandout: { color: palette.gold, fontWeight: '700' },
  traitTrack: { flex: 1, height: 10, backgroundColor: palette.background, borderRadius: 5, overflow: 'hidden' },
  traitFill: { height: 10, backgroundColor: palette.gold },
  traitScore: { width: 44, textAlign: 'right', fontWeight: '700' },
  legend: { color: palette.creamMuted, fontSize: 14, marginTop: spacing.sm },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  rankNum: { color: palette.gold, fontWeight: '700', width: 32 },
  rankName: { flex: 1, fontWeight: '600' },
  rankFit: { color: palette.creamMuted },
  rating: { alignItems: 'flex-start', marginVertical: spacing.md },
  ratingButtons: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' },
  ratingText: { minWidth: 160 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  actionButton: { flexGrow: 1, minWidth: 200 },
  outline: { backgroundColor: 'transparent', borderColor: palette.gold, borderWidth: 1, borderRadius: radius.sm },
  outlineTitle: { color: palette.gold, fontWeight: '700' },
  clearButton: { backgroundColor: 'transparent', justifyContent: 'space-between' },
  how: { gap: spacing.md, marginTop: spacing.md },
  bold: { fontWeight: '700', color: palette.gold },
  italic: { fontStyle: 'italic', color: palette.creamMuted },
});
