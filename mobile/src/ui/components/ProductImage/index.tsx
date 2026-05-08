import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { theme } from '@ui/styles/theme';

type ProductImageProps = {
  emoji: string;
  size?: number;
  bgColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function ProductImage({ emoji, size = 64, bgColor, style }: ProductImageProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor ?? theme.colors.success.soft,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: size * 0.5,
          includeFontPadding: false,
          lineHeight: size * 0.6,
          textAlign: 'center',
        }}
      >
        {emoji}
      </Text>
    </View>
  );
}
