import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Button, Text, Tooltip, useTheme } from '@rneui/themed';

import { buildEventMailtoUrl } from '../../utils/eventFormatting';

/**
 * Organizer name, address, and an email button. The address and button stay
 * visible in the card, so the tooltip is never the only route to contact info.
 */
export default function OrganizerContact({ event, testID }) {
  const { theme } = useTheme();
  const [tipOpen, setTipOpen] = useState(false);
  const [error, setError] = useState('');
  const organizer = event.organizer || {};

  async function openEmailDraft() {
    setError('');
    try {
      // Opens a draft in the device's email app. Nothing is ever sent from here.
      await Linking.openURL(buildEventMailtoUrl(event));
    } catch {
      setError(`No email app opened on this device. You can write to ${organizer.email} instead.`);
    }
  }

  return (
    <View style={styles.block} testID={testID}>
      <Tooltip
        visible={tipOpen}
        onOpen={() => setTipOpen(true)}
        onClose={() => setTipOpen(false)}
        width={280}
        height={110}
        backgroundColor={theme.colors.hero}
        popover={
          <Text style={styles.tipText}>
            {organizer.name} organizes this walk. Email them with questions about meeting
            spots, gear, or accessibility. This prototype uses a demo address.
          </Text>
        }
      >
        <Text
          accessibilityRole="button"
          accessibilityLabel={`Have questions? Shows how to reach ${organizer.name}.`}
          accessibilityState={{ expanded: tipOpen }}
          style={[styles.tipTrigger, { color: theme.colors.primary }]}
          testID={testID ? `${testID}-tooltip-trigger` : undefined}
        >
          Have questions?
        </Text>
      </Tooltip>

      <Text style={[styles.heading, { color: theme.colors.ink }]}>Organizer</Text>
      <Text style={[styles.body, { color: theme.colors.muted }]}>
        {organizer.name} · {organizer.email} (demo address)
      </Text>
      <Button
        title="Send email"
        type="outline"
        accessibilityLabel={`Send email to ${organizer.name} about ${event.title}`}
        accessibilityHint="Opens a draft in your email app. Nothing is sent automatically."
        onPress={openEmailDraft}
        containerStyle={styles.button}
        testID={testID ? `${testID}-send-email` : undefined}
      />
      {!!error && (
        <Text accessibilityLiveRegion="polite" style={[styles.body, { color: theme.colors.ink }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 6 },
  tipTrigger: { fontWeight: '700', paddingVertical: 12, minHeight: 44 },
  heading: { fontSize: 14, fontWeight: '800', marginTop: 4 },
  body: { fontSize: 14, lineHeight: 21 },
  button: { marginTop: 10, alignSelf: 'flex-start', minWidth: 160 },
  tipText: { color: '#FFFFFF', fontSize: 13, lineHeight: 19 }
});
