import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Badge, Card, Text, Tooltip, useTheme } from '@rneui/themed';

import { members } from '../data/members';

// Teammate 2 can extend this working example with photo avatars and magazine badges.
export default function MemberCards() {
  const { theme } = useTheme();
  const [openTip, setOpenTip] = useState(null);

  return (
    <View style={styles.stack}>
      {members.map((member) => (
        <Card key={member.id}>
          <View style={styles.row}>
            <Avatar
              title={member.initials}
              titleStyle={{ color: '#172B65', fontWeight: '800' }}
              containerStyle={{ backgroundColor: member.avatarColor }}
            />
            <View style={styles.copy}>
              <Text style={[styles.name, { color: theme.colors.ink }]}>{member.name}</Text>
              <Text style={[styles.club, { color: theme.colors.muted }]}>{member.club}</Text>
            </View>
            <Tooltip
              visible={openTip === member.id}
              onOpen={() => setOpenTip(member.id)}
              onClose={() => setOpenTip(null)}
              popover={<Text style={styles.tipText}>{member.role} is this photographer’s focus.</Text>}
              width={190}
              height={58}
              backgroundColor={theme.colors.hero}
            >
              <Badge value={member.role} status="primary" />
            </Tooltip>
          </View>
          <Text style={[styles.summary, { color: theme.colors.muted }]}>{member.summary}</Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12, marginBottom: 30 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  copy: { flex: 1 },
  name: { fontSize: 16, fontWeight: '800' },
  club: { fontSize: 12, marginTop: 3 },
  summary: { fontSize: 14, lineHeight: 20, marginTop: 14 },
  tipText: { color: '#FFFFFF', fontSize: 12, lineHeight: 17 },
});
