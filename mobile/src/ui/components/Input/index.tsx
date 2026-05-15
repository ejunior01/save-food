import React, { useState } from 'react';
import { TextInput, TextInputProps, View, StyleProp, ViewStyle, Text } from 'react-native';
import { AppText } from '@ui/components/AppText';
import { theme } from '@ui/styles/theme';
import { styles } from './styles';

type InputProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  InputComponent?: React.ComponentType<any>;
}

export function Input({
  label,
  error,
  leftIcon,
  rightElement,
  style,
  onFocus,
  onBlur,
  InputComponent = TextInput,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <AppText size="sm" family="medium" color={theme.colors.textMuted}>
          {label}
        </AppText>
      )}

      <View
        style={[
          styles.row,
          isFocused && styles.rowFocused,
          error && styles.rowError,
        ]}
      >
        {leftIcon}
        <InputComponent
          style={styles.input}
          placeholderTextColor={theme.colors.textMuted}
          onFocus={(e: any) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e: any) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightElement}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
