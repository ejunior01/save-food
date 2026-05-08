import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  Text,
  ViewStyle,
} from 'react-native';
import { containerVariants, labelVariants } from './styles';
import { VariantProps } from '@ui/styles/utils/createVariants';
import { theme } from '@ui/styles/theme';

type ButtonVariantProps = VariantProps<typeof containerVariants>;

type ButtonProps = ButtonVariantProps & {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  style,
}: ButtonProps) {
  const containerStyle = containerVariants({ variant, size });
  const textStyle = labelVariants({ variant, size });

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        containerStyle,
        style,
        (pressed || disabled) && { opacity: 0.72 },
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? '#fff' : theme.colors.primary}
          size="small"
        />
      ) : (
        <>
          {leftIcon}
          <Text style={textStyle}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}
