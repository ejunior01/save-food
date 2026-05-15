import { ImageBackground, Pressable, StatusBar, View } from 'react-native';
import React, { useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

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

        <SafeAreaView style={styles.content}>
          {/* Logo */}
          <View style={styles.logoArea}>
            <Logo />
          </View>

          {/* CTA */}
          <View style={styles.ctaArea}>
            <View>
              <AppText
                size="2xl"
                family="semiBold"
                color="#fff"
                style={styles.headline}
              >
                Organize seus alimentos,
              </AppText>
              <AppText
                size="2xl"
                family="semiBold"
                color="#fff"
                style={[styles.headline, { textAlign: 'center' }]}
              >
                Reduza o desperdício. Economize.
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
        </SafeAreaView>
      </ImageBackground>

      <AuthBottomSheet ref={authSheetRef} />
    </>
  );
}
