import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';

import { AppText } from '@ui/components/AppText';
import { theme } from '@ui/styles/theme';

export function Splash() {
  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
    }}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600 }}
        style={{ alignItems: 'center', gap: 12 }}
      >
        <AppText size="xs" family="medium" color={theme.colors.textMuted}
          style={{ letterSpacing: 2, textTransform: 'uppercase' }}>
          DespensaCerta
        </AppText>
        <AppText
          family="displayItalic"
          align="center"
          style={{ fontSize: 40, lineHeight: 48, color: theme.colors.text }}
        >
          Menos desperdício,{'\n'}mais economia.
        </AppText>
      </MotiView>
    </View>
  );
}
