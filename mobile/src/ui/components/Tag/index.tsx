import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { AppText } from '@ui/components/AppText';
import { containerVariants, toneTextColors } from './styles';
import { VariantProps } from '@ui/styles/utils/createVariants';

type TagVariantProps = VariantProps<typeof containerVariants>;

type TagProps = TagVariantProps & {
  label: string;
  style?: StyleProp<ViewStyle>;
}

export function Tag({ label, tone = 'neutral', size = 'md', style }: TagProps) {
  const containerStyle = containerVariants({ tone, size });
  const textColor = toneTextColors[tone ?? 'neutral'];

  return (
    <View style={[containerStyle, style]}>
      <AppText size={size === 'sm' ? 'xs' : 'xs'} family="medium" color={textColor} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}
