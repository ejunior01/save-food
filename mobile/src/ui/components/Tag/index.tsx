import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { AppText } from '@ui/components/AppText';
import { containerVariants, toneTextColors, toneDotColors } from './styles';
import { VariantProps } from '@ui/styles/utils/createVariants';

type TagVariantProps = VariantProps<typeof containerVariants>;

type TagProps = TagVariantProps & {
  label: string;
  style?: StyleProp<ViewStyle>;
}

export function Tag({ label, tone = 'neutral', size = 'md', style }: TagProps) {
  const containerStyle = containerVariants({ tone, size });
  const textColor = toneTextColors[tone ?? 'neutral'];
  const dotColor = toneDotColors[tone ?? 'neutral'];

  return (
    <View style={[containerStyle, style]}>
      <View style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: dotColor,
        flexShrink: 0,
      }} />
      <AppText size="xs" family="medium" color={textColor} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}
