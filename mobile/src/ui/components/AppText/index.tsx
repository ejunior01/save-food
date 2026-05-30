import React from "react";
import { Text, TextStyle, StyleProp } from "react-native";
import { theme } from "@ui/styles/theme";

type FontFamily = "regular" | "medium" | "semiBold" | "display" | "displayItalic" | "mono";

type AppTextProps = {
  size?: keyof typeof theme.fontSize;
  family?: FontFamily;
  color?: string;
  align?: TextStyle["textAlign"];
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
};

function resolveFontFamily(family: FontFamily): string {
  switch (family) {
    case "display": return theme.fontFamily.display.regular;
    case "displayItalic": return theme.fontFamily.display.italic;
    case "mono": return theme.fontFamily.mono.regular;
    case "medium": return theme.fontFamily.sans.medium;
    case "semiBold": return theme.fontFamily.sans.semiBold;
    default: return theme.fontFamily.sans.regular;
  }
}

export function AppText({
  size = "base",
  family = "regular",
  color,
  align = "left",
  numberOfLines,
  style,
  children,
}: AppTextProps) {
  const textStyle: TextStyle = {
    fontFamily: resolveFontFamily(family),
    fontSize: theme.fontSize[size],
    color: color ?? theme.colors.ink,
    textAlign: align,
    includeFontPadding: false,
  };

  return (
    <Text style={[textStyle, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}
