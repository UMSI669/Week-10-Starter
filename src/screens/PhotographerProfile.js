import { useState } from "react";
import { Image, Pressable, View } from "react-native";
import { Avatar, Badge, Button, Overlay, Text, useTheme } from "@rneui/themed";
import Screen from "../components/Screen";
import { members } from "../data/members";
const photos = [
  {
    source: require("../../assets/gallery/river.jpg"),
    title: "River study",
    tag: "Landscape",
  },
  {
    source: require("../../assets/gallery/mountain.jpg"),
    title: "Open horizons",
    tag: "Magazine · Issue 01",
  },
  {
    source: require("../../assets/gallery/portrait.jpg"),
    title: "A quiet moment",
    tag: "Portrait study",
  },
];
export default function PhotographerProfile({ route }) {
  const { theme } = useTheme();
  const member = members.find((item) => item.id === route.params?.id);
  const [photo, setPhoto] = useState(null);
  if (!member) return <Screen title="Photographer unavailable" />;
  return (
    <Screen title={member.name} subtitle={member.detail}>
      <Avatar
        title={member.initials}
        containerStyle={{ backgroundColor: member.avatarColor }}
        titleStyle={{ color: "#172B65" }}
      />
      <Text h4 style={{ color: theme.colors.ink }}>
        Sample gallery
      </Text>
      <Text style={{ color: theme.colors.muted }}>
        Tap a photograph to see it full size.
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {photos.map((item) => (
          <View
            key={item.title}
            style={{
              flexBasis: "47%",
              flexGrow: 0,
              flexShrink: 1,
              minWidth: 0,
              gap: 4,
            }}
          >
            <Pressable
              onPress={() => setPhoto(item)}
              accessibilityRole="button"
              accessibilityLabel={"Open " + item.title}
              style={{ width: "100%", aspectRatio: 1.5, borderRadius: 12, overflow: "hidden" }}
            >
              <Image
                source={item.source}
                resizeMode="cover"
                style={{ width: "100%", height: "100%" }}
              />
            </Pressable>
            <Badge
              value={item.tag}
              status="primary"
              containerStyle={{ alignSelf: "flex" }}
            />
          </View>
        ))}
      </View>
      <Text style={{ color: theme.colors.muted, fontSize: 12 }}>
        Demo photos from Lorem Picsum; illustrative gallery content.
      </Text>
      <Overlay
        isVisible={photo !== null}
        onBackdropPress={() => setPhoto(null)}
        onRequestClose={() => setPhoto(null)}
        overlayStyle={{
          width: "100%",
          maxWidth: 520,
          backgroundColor: theme.colors.surface,
          borderRadius: 18,
          padding: 16,
        }}
      >
        {photo && (
          <View style={{ gap: 10 }}>
            <Image
              source={photo.source}
              resizeMode="contain"
              style={{ width: "100%", aspectRatio: 1.5, maxHeight: 245 }}
            />
            <Text style={{ color: theme.colors.ink }}>{photo.title}</Text>
            <Button title="Close photo" onPress={() => setPhoto(null)} />
          </View>
        )}
      </Overlay>
    </Screen>
  );
}
