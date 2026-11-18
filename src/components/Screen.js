import { ScrollView, View } from "react-native";
import { Text, useTheme } from "@rneui/themed";
export default function Screen({ title, subtitle, children }) {
  const { theme } = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <View>
        <Text h3 style={{ color: theme.colors.ink, fontWeight: "800" }}>
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{ color: theme.colors.muted, lineHeight: 22, marginTop: 8 }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {children}
    </ScrollView>
  );
}
