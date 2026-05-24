import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { theme } from '@ui/styles/theme';

type FontFamily = keyof typeof theme.fontFamily.sans | 'display' | 'displayItalic';

type AppTextProps = {
  size?: keyof typeof theme.fontSize;
  family?: FontFamily;
  color?: string;
  align?: TextStyle['textAlign'];
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

function resolveFontFamily(family: FontFamily): string {
  if (family === 'display') { return theme.fontFamily.display.regular; }
  if (family === 'displayItalic') { return theme.fontFamily.display.italic; }
  return theme.fontFamily.sans[family];
}

export function AppText({
  size = 'base',
  family = 'regular',
  color,
  align = 'left',
  numberOfLines,
  style,
  children,
}: AppTextProps) {
  const textStyle: TextStyle = {
    fontFamily: resolveFontFamily(family),
    fontSize: theme.fontSize[size],
    color: color ?? theme.colors.text,
    textAlign: align,
    includeFontPadding: false,
  };

  return (
    <Text style={[textStyle, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}
