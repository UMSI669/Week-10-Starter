import { StyleSheet, View } from 'react-native';
import { Button, Card, IconButton, Text, Tooltip, useTheme } from 'react-native-paper';
import { formatPrice } from '../data/mockData';

// Small icon with a Tooltip (hover on web, long-press on mobile).
function InfoIcon({ icon, title, color }) {
  return (
    <Tooltip title={title} enterTouchDelay={200} leaveTouchDelay={1500}>
      <IconButton
        icon={icon}
        size={18}
        iconColor={color}
        style={styles.infoIcon}
        accessibilityLabel={title}
        onPress={() => {}}
      />
    </Tooltip>
  );
}

export default function DrinkCard({ drink, unavailable, inCart, onAdd, style }) {
  const theme = useTheme();

  return (
    <Card style={[styles.card, style, unavailable && styles.unavailable]} mode="elevated">
      <Card.Cover source={{ uri: drink.image }} style={styles.cover} />
      <Card.Title
        title={drink.name}
        titleVariant="titleMedium"
        subtitle={unavailable ? 'Unavailable today' : formatPrice(drink.price)}
        subtitleStyle={unavailable && { color: theme.colors.error }}
      />
      <Card.Content style={styles.infoRow}>
        {drink.dairy ? (
          <InfoIcon icon="cow" title="Contains dairy (whole milk)" color={theme.colors.secondary} />
        ) : (
          <InfoIcon icon="leaf" title="Dairy-free / vegan" color="#2e7d32" />
        )}
        {drink.caffeineMg > 0 ? (
          <InfoIcon
            icon="lightning-bolt"
            title={`Caffeine: about ${drink.caffeineMg} mg per cup`}
            color="#b26a00"
          />
        ) : (
          <InfoIcon icon="sleep" title="Caffeine-free" color={theme.colors.outline} />
        )}
        {drink.needsOatMilk && (
          <InfoIcon icon="barley" title="Made with oat milk" color={theme.colors.tertiary} />
        )}
        <View style={{ flex: 1 }} />
        {inCart > 0 && (
          <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
            {inCart} in cart
          </Text>
        )}
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => onAdd(drink)}
          disabled={unavailable}
        >
          Add
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  unavailable: { opacity: 0.6 },
  cover: { height: 150 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginLeft: -12 },
  infoIcon: { margin: 0 },
});
