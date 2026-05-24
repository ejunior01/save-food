import { ImageBackground, Pressable, StatusBar, View } from 'react-native';
import React, { useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@ui/components/AppText';
import { AuthStackScreenProps } from '@app/navigation/types';
import { Button } from '@ui/components/Button';
import { Logo } from '@ui/components/Logo';
import {
  AuthBottomSheet,
  type AuthBottomSheetHandle,
} from '@ui/components/AuthBottomSheet';
import { styles } from './styles';
import authBg from '@ui/assets/auth-bg/image.jpg';

type Props = AuthStackScreenProps<'Login'>;

export function Login({ navigation }: Props) {
  const authSheetRef = useRef<AuthBottomSheetHandle>(null);
  const { top, bottom } = useSafeAreaInsets();

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ImageBackground
        source={authBg}
        resizeMode="cover"
        style={styles.container}
      >
        <LinearGradient
          colors={[
            'rgba(0,0,0,0.55)',
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0.2)',
            'rgba(0,0,0,0.82)',
          ]}
          locations={[0, 0.28, 0.5, 1]}
          style={styles.gradient}
        />

        <View style={[styles.content, { paddingTop: top + 16, paddingBottom: bottom + 16 }]}>
          {/* Logo */}
          <View style={styles.logoArea}>
            <Logo  />
          </View>

          {/* CTA */}
          <View style={styles.ctaArea}>
            <View>
              <AppText
                family="displayItalic"
                color="#fff"
                style={{ fontSize: 34, lineHeight: 42, letterSpacing: -0.5 }}
              >
                Organize seus{'\n'}alimentos.
              </AppText>
              <AppText
                size="base"
                color="rgba(255,255,255,0.72)"
                style={{ marginTop: 10, lineHeight: 24 }}
              >
                Reduza o desperdício e economize com sua despensa.
              </AppText>
            </View>
            <View style={styles.actions}>
              <Button
                variant="primary"
                size="lg"
                label="Criar conta"
                onPress={() => navigation.navigate('SignUp')}
                style={{ width: '100%' }}
              />

              <View style={styles.signInRow}>
                <AppText size="sm" color="rgba(255,255,255,0.75)">
                  Já tem conta?
                </AppText>
                <Pressable
                  hitSlop={8}
                  onPress={() => authSheetRef.current?.open()}
                >
                  <AppText size="sm" color="#fff" family="semiBold">
                    Entrar
                  </AppText>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>

      <AuthBottomSheet ref={authSheetRef} />
    </>
  );
}
