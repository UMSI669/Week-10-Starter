import { useConcertTheme } from "../useConcertTheme";
import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Platform,
  Pressable,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Box, Text } from "../theme";
import { Artist } from "../data";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) setReduced(value);
      })
      .catch(() => {});
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced,
    );
    return () => {
      active = false;
      listener.remove();
    };
  }, []);
  return reduced;
}
export function Touch({
  children,
  label,
  onPress,
  checked,
}: {
  children: React.ReactNode;
  label: string;
  onPress: () => void;
  checked?: boolean;
}) {
  const [scale] = useState(() => new Animated.Value(1));
  const lastPress = useRef(0);
  const reduced = useReducedMotion();
  const animate = (value: number) => {
    scale.stopAnimation();
    if (reduced) {
      scale.setValue(1);
      return;
    }
    Animated.spring(scale, {
      toValue: value,
      stiffness: 280,
      damping: 26,
      mass: 0.7,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => () => scale.stopAnimation(), [scale]);
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole={checked === undefined ? "button" : "radio"}
        accessibilityState={checked === undefined ? undefined : { checked }}
        accessibilityLabel={label}
        onPressIn={() => animate(0.98)}
        onPressOut={() => animate(1)}
        onPress={() => {
          if (Date.now() - lastPress.current < 600) return;
          lastPress.current = Date.now();
          if (Platform.OS !== "web")
            void Haptics.selectionAsync().catch(() => {});
          onPress();
        }}
        style={({ pressed }) => ({
          opacity: pressed ? 0.85 : 1,
          minHeight: 48,
          justifyContent: "center",
        })}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
export function Artwork({
  artist,
  compact = false,
}: {
  artist: Artist;
  compact?: boolean;
}) {
  const colors = useConcertTheme(artist.atmosphere).colors;
  return (
    <View
      accessible
      accessibilityLabel={`Abstract cover artwork for ${artist.name}`}
      style={{
        height: compact ? 150 : 240,
        backgroundColor: colors.surface,
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            right: -35 + i * 19,
            top: -60 + i * 19,
            width: 290 - i * 38,
            height: 290 - i * 38,
            borderRadius: 200,
            borderColor: colors.accent,
            borderWidth: 14,
            opacity: 0.16 + i * 0.12,
            transform: [
              { scaleX: artist.atmosphere === "sunset" ? 1 : 0.7 },
              { rotate: artist.atmosphere === "midnight" ? "-25deg" : "20deg" },
            ],
          }}
        />
      ))}
      <Box position="absolute" bottom={16} left={20}>
        <Text
          style={{
            color: colors.accent,
            fontWeight: "900",
            fontSize: compact ? 44 : 66,
            lineHeight: compact ? 54 : 76,
            letterSpacing: -3,
          }}
        >
          {artist.initials}
        </Text>
      </Box>
      <Box position="absolute" top={16} left={20}>
        <Text
          style={{
            color: colors.accent,
            fontSize: 10,
            lineHeight: 16,
            letterSpacing: 2,
          }}
        >
          AFTERGLOW PRESENTS
        </Text>
      </Box>
    </View>
  );
}
