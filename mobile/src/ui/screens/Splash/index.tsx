import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MotiView } from 'moti';

import { Logo } from '@ui/components/Logo';
import { AppText } from '@ui/components/AppText';
import { theme } from '@ui/styles/theme';

export function Splash() {
  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        style={styles.content}
      >
        <Logo textColor="#fff" />
        <AppText size="sm" color="rgba(255,255,255,0.6)" align="center" style={styles.tagline}>
          Menos desperdício, mais economia.
        </AppText>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  tagline: {
    marginTop: 10,
  },
});
