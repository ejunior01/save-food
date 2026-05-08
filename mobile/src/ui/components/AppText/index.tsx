import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { theme } from '@ui/styles/theme';

type AppTextProps = {
  size?: keyof typeof theme.fontSize;
  family?: keyof typeof theme.fontFamily.sans;
  color?: string;
  align?: TextStyle['textAlign'];
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
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
    fontFamily: theme.fontFamily.sans[family],
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
