import { View } from 'react-native';
import { ListItem, Switch, Text, useTheme } from '@rneui/themed';
import Screen from '../components/Screen';
import { useAppState } from '../state/AppState';
const demos = ['Contact and Support', 'Text size', 'Log in / Log out', 'Delete data', 'Notifications', 'Time zone'];
export default function Settings() {
  const { theme } = useTheme();
  const { mode, colorBlind, update, storageError } = useAppState();
  return <Screen title="Make it yours" subtitle="Appearance settings apply to every page.">
    <ListItem><ListItem.Content><ListItem.Title style={{ color: theme.colors.ink }}>Dark mode</ListItem.Title>
      <ListItem.Subtitle style={{ color: theme.colors.muted }}>{mode === 'dark' ? 'Dark' : 'Light'} appearance</ListItem.Subtitle></ListItem.Content>
      <Switch accessibilityLabel="Dark mode" value={mode === 'dark'} onValueChange={value => update({ mode: value ? 'dark' : 'light' })} />
    </ListItem>
    <ListItem><ListItem.Content><ListItem.Title style={{ color: theme.colors.ink }}>Color Blind Mode</ListItem.Title>
      <ListItem.Subtitle style={{ color: theme.colors.muted }}>Blue and amber palette; labels stay visible</ListItem.Subtitle></ListItem.Content>
      <Switch accessibilityLabel="Color Blind Mode" value={colorBlind} onValueChange={value => update({ colorBlind: value })} />
    </ListItem>
    {!!storageError && <Text style={{ color: theme.colors.muted }}>{storageError}</Text>}
    <Text h4 style={{ color: theme.colors.ink }}>More settings</Text>
    <View style={{ gap: 1 }}>{demos.map(label => <ListItem key={label} disabled accessibilityState={{ disabled: true }} containerStyle={{ backgroundColor: theme.colors.surface, opacity: 0.65 }}>
      <ListItem.Content><ListItem.Title style={{ color: theme.colors.ink }}>{label}</ListItem.Title>
      <ListItem.Subtitle style={{ color: theme.colors.muted }}>Demo only · unavailable</ListItem.Subtitle></ListItem.Content>
    </ListItem>)}</View>
  </Screen>;
}
