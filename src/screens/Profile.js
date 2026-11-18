import { useState } from "react";
import { Share, View } from "react-native";
import { Avatar, Button, Card, Input, Text, useTheme } from "@rneui/themed";
import Screen from "../components/Screen";
import { useAppState } from "../state/AppState";
export default function Profile() {
  const { theme } = useTheme();
  const { bio, update, storageError } = useAppState();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(bio);
  const [message, setMessage] = useState("");
  async function shareProfile() {
    try {
      await Share.share({ message: "Alex Morgan — Photography Club\n" + bio });
    } catch {
      setMessage("Sharing is unavailable on this device.");
    }
  }
  return (
    <Screen
      title="My profile"
      subtitle="Your place in the photography community."
    >
      <Card>
        <View style={{ gap: 16 }}>
          <Avatar
            title="AM"
            containerStyle={{ backgroundColor: "#DDE7FF" }}
            titleStyle={{ color: "#172B65" }}
          />
          <Text h4 style={{ color: theme.colors.ink }}>
            Alex Morgan
          </Text>
          <Text style={{ color: theme.colors.muted }}>
            Sample member · Photography Club
          </Text>
          {editing ? (
            <>
              <Input
                label="Bio"
                multiline
                value={draft}
                onChangeText={setDraft}
                maxLength={280}
                inputStyle={{ color: theme.colors.ink, minHeight: 90 }}
                labelStyle={{ color: theme.colors.muted }}
              />
              <Button
                title="Save bio"
                onPress={() => {
                  update({ bio: draft.trim() });
                  setEditing(false);
                  setMessage("Bio updated.");
                }}
              />
              <Button
                title="Cancel"
                type="clear"
                onPress={() => setEditing(false)}
              />
            </>
          ) : (
            <>
              <Text style={{ color: theme.colors.ink, lineHeight: 24 }}>
                {bio || "Add a short bio to introduce yourself."}
              </Text>
              <Button
                title="Edit bio"
                onPress={() => {
                  setDraft(bio);
                  setEditing(true);
                  setMessage("");
                }}
              />
            </>
          )}
          <Button title="Share profile" type="outline" onPress={shareProfile} />
        </View>
      </Card>
      {!!(message || storageError) && (
        <Text
          accessibilityLiveRegion="polite"
          style={{ color: theme.colors.muted }}
        >
          {storageError || message}
        </Text>
      )}
    </Screen>
  );
}
