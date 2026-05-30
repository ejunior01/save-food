import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import { theme } from "@ui/styles/theme";
import { ExpiryStatus } from "@app/types";

type TagProps = {
  label: string;
  tone?: ExpiryStatus | "neutral";
  size?: "sm" | "md";
  style?: StyleProp<ViewStyle>;
};

const toneMap: Record<string, { bg: string; color: string; dot: string }> = {
  expired: { bg: theme.colors.dangerSoft, color: theme.colors.danger, dot: theme.colors.danger },
  urgent: { bg: theme.colors.urgentSoft, color: theme.colors.urgent, dot: theme.colors.urgent },
  soon: { bg: theme.colors.soonSoft,   color: theme.colors.soon,   dot: theme.colors.soon },
  planned: { bg: theme.colors.surfaceSoft, color: theme.colors.ink,   dot: theme.colors.muted },
  safe: { bg: theme.colors.safeSoft,   color: theme.colors.safe,   dot: theme.colors.safe },
  neutral: { bg: theme.colors.surfaceSoft, color: theme.colors.ink,   dot: theme.colors.muted },
};

export function Tag({ label, tone = "neutral", size = "md", style }: TagProps) {
  const map = toneMap[tone] ?? toneMap.neutral;
  const height = size === "sm" ? 24 : 26;
  const fontSize = size === "sm" ? 11 : 12;

  return (
    <View style={[{
      height,
      paddingHorizontal: 10,
      borderRadius: theme.radii.pill,
      backgroundColor: map.bg,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      flexShrink: 0,
    }, style]}>
      <View style={{
        width: 6, height: 6, borderRadius: 3,
        backgroundColor: map.dot,
      }} />
      <Text style={{
        fontFamily: theme.fontFamily.sans.medium,
        fontSize,
        color: map.color,
        includeFontPadding: false,
      }}>
        {label}
      </Text>
    </View>
  );
}
