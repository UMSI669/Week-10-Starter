import { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Button,
  ListItem,
  Overlay,
  Slider,
  Switch,
  Text,
  useTheme,
} from "@rneui/themed";
import Screen from "../components/Screen";
import { useAppState } from "../state/AppState";

const zones = [
  "America/Detroit",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Asia/Taipei",
  "UTC",
];

export default function Settings() {
  const { theme } = useTheme();
  const { mode, colorBlind, update, storageError } = useAppState();
  // These preview controls intentionally stay local: no account, storage, or OS actions.
  const [notifications, setNotifications] = useState(false);
  const [textSize, setTextSize] = useState(16);
  const [timeZone, setTimeZone] = useState("America/Detroit");
  const [dialog, setDialog] = useState(null);
  const [result, setResult] = useState("");
  const open = (name) => {
    setResult("");
    setDialog(name);
  };
  const close = () => setDialog(null);
  const ink = { color: theme.colors.ink };
  const muted = { color: theme.colors.muted, lineHeight: 22 };
  const titles = {
    support: "Contact and Support",
    text: "Text size",
    zone: "Time zone",
    account: "Log in / Log out",
    delete: "Delete data",
  };

  function row(title, name, value) {
    return (
      <ListItem
        onPress={() => open(name)}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <ListItem.Content>
          <ListItem.Title style={ink}>{title}</ListItem.Title>
        </ListItem.Content>
        {!!value && <Text style={muted}>{value}</Text>}
        <ListItem.Chevron color={theme.colors.muted} />
      </ListItem>
    );
  }

  return (
    <Screen
      title="Make it yours"
      subtitle="Choose your appearance and preferences."
    >
      <ListItem>
        <ListItem.Content>
          <ListItem.Title style={ink}>Dark mode</ListItem.Title>
          <ListItem.Subtitle style={muted}>
            {mode === "dark" ? "Dark" : "Light"} appearance
          </ListItem.Subtitle>
        </ListItem.Content>
        <Switch
          accessibilityLabel="Dark mode"
          value={mode === "dark"}
          onValueChange={(value) => update({ mode: value ? "dark" : "light" })}
        />
      </ListItem>
      <ListItem>
        <ListItem.Content>
          <ListItem.Title style={ink}>Color Blind Mode</ListItem.Title>
          <ListItem.Subtitle style={muted}>
            Blue and amber palette; labels stay visible
          </ListItem.Subtitle>
        </ListItem.Content>
        <Switch
          accessibilityLabel="Color Blind Mode"
          value={colorBlind}
          onValueChange={(value) => update({ colorBlind: value })}
        />
      </ListItem>
      {!!storageError && <Text style={muted}>{storageError}</Text>}
      <Text h4 style={ink}>
        More settings
      </Text>
      <View style={{ gap: 1 }}>
        {row("Contact and Support", "support")}
        {row("Text size", "text", textSize + " pt")}
        {row("Log in / Log out", "account")}
        {row("Delete data", "delete")}
        <ListItem>
          <ListItem.Content>
            <ListItem.Title style={ink}>Notifications</ListItem.Title>
          </ListItem.Content>
          <Switch
            accessibilityLabel="Notifications"
            value={notifications}
            onValueChange={setNotifications}
          />
        </ListItem>
        {row(
          "Time zone",
          "zone",
          timeZone.split("/").pop().replaceAll("_", " "),
        )}
      </View>

      <Overlay
        isVisible={dialog !== null}
        onBackdropPress={close}
        onRequestClose={close}
        overlayStyle={{
          width: "90%",
          maxWidth: 460,
          maxHeight: "85%",
          padding: 24,
          borderRadius: 20,
          backgroundColor: theme.colors.surface,
        }}
      >
        <ScrollView contentContainerStyle={{ gap: 18 }}>
          <Text h4 accessibilityRole="header" style={ink}>
            {titles[dialog]}
          </Text>
          {result ? (
            <Text accessibilityLiveRegion="polite" style={muted}>
              {result}
            </Text>
          ) : (
            <>
              {dialog === "support" && (
                <>
                  <Text style={muted}>
                    Need help with a photo walk or your profile? Contact the
                    photography club team.
                  </Text>
                  <Button
                    title="Contact support"
                    onPress={() =>
                      setResult(
                        "This would open a support request. No message has been sent.",
                      )
                    }
                  />
                </>
              )}
              {dialog === "text" && (
                <>
                  <Text
                    style={{
                      ...ink,
                      fontSize: textSize,
                      lineHeight: textSize * 1.5,
                    }}
                  >
                    See campus through a different lens.
                  </Text>
                  <Text style={muted}>{textSize} pt</Text>
                  <Slider
                    value={textSize}
                    onValueChange={setTextSize}
                    minimumValue={12}
                    maximumValue={24}
                    step={1}
                    allowTouchTrack
                    thumbTintColor={theme.colors.primary}
                    minimumTrackTintColor={theme.colors.primary}
                    maximumTrackTintColor={theme.colors.border}
                  />
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <Button
                      title="Smaller"
                      type="outline"
                      disabled={textSize === 12}
                      onPress={() =>
                        setTextSize((size) => Math.max(12, size - 1))
                      }
                      containerStyle={{ flex: 1 }}
                    />
                    <Button
                      title="Larger"
                      type="outline"
                      disabled={textSize === 24}
                      onPress={() =>
                        setTextSize((size) => Math.min(24, size + 1))
                      }
                      containerStyle={{ flex: 1 }}
                    />
                  </View>
                </>
              )}
              {dialog === "zone" &&
                zones.map((zone) => (
                  <Button
                    key={zone}
                    title={
                      (timeZone === zone ? "✓  " : "") +
                      zone.replaceAll("_", " ")
                    }
                    accessibilityLabel={zone}
                    accessibilityState={{ selected: timeZone === zone }}
                    type={timeZone === zone ? "solid" : "outline"}
                    onPress={() => setTimeZone(zone)}
                  />
                ))}
              {dialog === "account" && (
                <>
                  <Text style={muted}>
                    Choose an account action to preview.
                  </Text>
                  <Button
                    title="Log in"
                    onPress={() =>
                      setResult(
                        "Login flow previewed. Your account has not changed.",
                      )
                    }
                  />
                  <Button
                    title="Log out"
                    type="outline"
                    onPress={() =>
                      setResult(
                        "Logout flow previewed. You have not been signed out.",
                      )
                    }
                  />
                </>
              )}
              {dialog === "delete" && (
                <>
                  <Text style={muted}>
                    Delete your saved profile and preferences? This confirmation
                    is a preview; your data will be kept.
                  </Text>
                  <Button
                    title="Confirm deletion"
                    color="error"
                    onPress={() =>
                      setResult(
                        "Confirmation preview complete. No data was deleted.",
                      )
                    }
                  />
                </>
              )}
            </>
          )}
          <Button
            title={dialog === "delete" && !result ? "Cancel" : "Done"}
            type="clear"
            onPress={close}
          />
        </ScrollView>
      </Overlay>
    </Screen>
  );
}
