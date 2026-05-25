import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { theme } from '@ui/styles/theme';

export function Splash() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas, alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.canvas} />
      <View style={{ alignItems: 'center', gap: 12 }}>
        <Text style={{
          fontFamily: theme.fontFamily.display.regular,
          fontSize: 28,
          color: theme.colors.ink,
        }}>
          Despensa<Text style={{ fontStyle: 'italic' }}>Certa</Text>
        </Text>
        <Text style={{
          fontFamily: theme.fontFamily.mono.regular,
          fontSize: 9.5,
          letterSpacing: 0.12 * 9.5,
          textTransform: 'uppercase',
          color: theme.colors.muted,
        }}>Carregando…</Text>
      </View>
    </View>
  );
}
