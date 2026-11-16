import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useConcertTheme } from "../../useConcertTheme";
export default function TabLayout() {
  const theme = useConcertTheme();
  return (
    <Tabs
      screenListeners={{
        tabPress: () => {
          if (Platform.OS !== "web")
            void Haptics.selectionAsync().catch(() => {});
        },
      }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: { fontWeight: "600", fontSize: 11 },
        tabBarLabelPosition: "below-icon",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={focused ? "compass" : "compass-outline"}
              color={focused ? theme.colors.accent : theme.colors.muted}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              color={focused ? theme.colors.accent : theme.colors.muted}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              color={focused ? theme.colors.accent : theme.colors.muted}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
