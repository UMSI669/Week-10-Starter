import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Badge, Button, Card, Text, Tooltip, useTheme } from '@rneui/themed';

import { members } from '../data/members';

// Teammate 2 can extend this working example with photo avatars and magazine badges.
export default function MemberCards({ onSelect, limit = members.length, layout = 'stack' }) {
  const { theme } = useTheme();
  const [openTip, setOpenTip] = useState(null);
  const isGrid = layout === 'grid';

  return (
    <View style={isGrid ? styles.grid : styles.stack}>
      {members.slice(0, limit).map((member) => {
        const roleBadge = (
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
        );

        return (
          <Card key={member.id} containerStyle={isGrid ? styles.gridCard : undefined}>
            <View style={[styles.row, isGrid && styles.gridRow]}>
              <Avatar
                size={isGrid ? 44 : undefined}
                title={member.initials}
                titleStyle={{ color: '#172B65', fontWeight: '800' }}
                containerStyle={{ backgroundColor: member.avatarColor }}
              />
              <View style={styles.copy}>
                <Text style={[styles.name, { color: theme.colors.ink }]}>{member.name}</Text>
                <Text style={[styles.club, { color: theme.colors.muted }]}>{member.club}</Text>
              </View>
              {!isGrid && roleBadge}
            </View>
            {isGrid && <View style={styles.gridRole}>{roleBadge}</View>}
            <Text style={[styles.summary, { color: theme.colors.muted }]}>{member.summary}</Text>
            {onSelect && (
              <Button
                title={isGrid ? 'View' : 'View photographer'}
                titleStyle={isGrid ? styles.gridButtonTitle : undefined}
                type="outline"
                onPress={() => onSelect(member.id)}
                containerStyle={{ marginTop: 14 }}
              />
            )}
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12, marginBottom: 30 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 30 },
  gridCard: { width: '47%', margin: 0, padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  gridRow: { flexDirection: 'column', alignItems: 'flex-start', gap: 8 },
  copy: { flex: 1 },
  gridButtonTitle: { fontSize: 12 },
  gridRole: { alignSelf: 'flex-start', marginTop: 10 },
  name: { fontSize: 16, fontWeight: '800' },
  club: { fontSize: 12, marginTop: 3 },
  summary: { fontSize: 14, lineHeight: 20, marginTop: 14 },
  tipText: { color: '#FFFFFF', fontSize: 12, lineHeight: 17 },
});
