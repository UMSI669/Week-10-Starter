import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@rneui/themed';
import { AppStateProvider, useAppState } from './src/state/AppState';
import Home from './src/screens/Home';
import Photographers from './src/screens/Photographers';
import PhotographerProfile from './src/screens/PhotographerProfile';
import Events from './src/screens/Events';
import Profile from './src/screens/Profile';
import Settings from './src/screens/Settings';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const icons = { Home: 'home', Photographers: 'camera', Events: 'calendar', Profile: 'user', Settings: 'settings' };
function MainTabs() {
  const { theme } = useTheme();
  return <Tab.Navigator screenOptions={({ route }) => ({
    headerTitle: 'FRAME / CAMPUS', headerShadowVisible: false,
    headerStyle: { backgroundColor: theme.colors.surface }, headerTintColor: theme.colors.ink,
    tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border },
    tabBarActiveTintColor: theme.colors.primary, tabBarInactiveTintColor: theme.colors.muted,
    tabBarIcon: ({ color, size }) => <Feather name={icons[route.name]} size={size} color={color} />,
  })}>
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Photographers" component={Photographers} />
    <Tab.Screen name="Events" component={Events} />
    <Tab.Screen name="Profile" component={Profile} />
    <Tab.Screen name="Settings" component={Settings} />
  </Tab.Navigator>;
}
function Navigation() {
  const { theme } = useTheme();
  const { mode } = useAppState();
  const base = mode === 'dark' ? DarkTheme : DefaultTheme;
  return <NavigationContainer theme={{ ...base, colors: { ...base.colors, primary: theme.colors.primary, background: theme.colors.background, card: theme.colors.surface, text: theme.colors.ink, border: theme.colors.border } }}>
    <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="PhotographerProfile" component={PhotographerProfile} options={{ title: 'Photographer' }} />
    </Stack.Navigator>
  </NavigationContainer>;
}
export default function App() {
  return <SafeAreaProvider><AppStateProvider><Navigation /></AppStateProvider></SafeAreaProvider>;
}
