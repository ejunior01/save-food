import React, { useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Fingerprint } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@ui/components/AppText';
import { Input } from '@ui/components/Input';
import { Button } from '@ui/components/Button';
import { theme } from '@ui/styles/theme';
import { useAuth } from '@app/context/AuthContext';
import { useBiometrics } from '@app/hooks/useBiometrics';
import { styles } from './styles';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;
type Step = 'form' | 'biometricOffer';

export type AuthBottomSheetHandle = {
  open: () => void;
  close: () => void;
};

interface Props {
  ref: React.Ref<AuthBottomSheetHandle>;
}

export function AuthBottomSheet({ ref }: Props) {
  const { bottom } = useSafeAreaInsets();
  const { signIn } = useAuth();
  const modalRef = useRef<BottomSheetModal>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const { isAvailable, isEnabled, wasOffered, isReady, enable, markOffered, authenticate } = useBiometrics();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useImperativeHandle(ref, () => ({
    open: () => {
      setStep('form');
      modalRef.current?.present();
    },
    close: () => modalRef.current?.dismiss(),
  }));

  function finish() {
    signIn();
    modalRef.current?.dismiss();
  }

  async function onSubmit() {
    if (isAvailable && !wasOffered) {
      setStep('biometricOffer');
    } else {
      finish();
    }
  }

  async function handleBiometricLogin() {
    const success = await authenticate();
    if (success) { finish(); }
  }

  async function handleEnableBiometrics() {
    await enable();
    finish();
  }

  async function handleSkipBiometrics() {
    await markOffered();
    finish();
  }

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      enableDynamicSizing
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={[styles.container, { paddingBottom: Math.max(bottom, 32) }]}>
        {step === 'biometricOffer' ? (
          <View style={styles.biometricOffer}>
            <View style={styles.biometricIconCircle}>
              <Fingerprint size={40} color={theme.colors.primary} strokeWidth={1.5} />
            </View>
            <AppText size="2xl" family="semiBold" align="center" style={styles.heading}>
              Acesse mais rápido
            </AppText>
            <AppText size="sm" color={theme.colors.textMuted} align="center">
              Ative a biometria para entrar sem precisar digitar sua senha nos próximos acessos.
            </AppText>
            <View style={styles.biometricOfferActions}>
              <Button
                variant="primary"
                size="lg"
                label="Ativar biometria"
                onPress={handleEnableBiometrics}
                style={{ width: '100%' }}
              />
              <Button
                variant="ghost"
                size="md"
                label="Agora não"
                onPress={handleSkipBiometrics}
                style={{ width: '100%' }}
              />
            </View>
          </View>
        ) : (
          <>
            <AppText size="2xl" family="semiBold" style={styles.heading}>
              Entrar na conta
            </AppText>

            {isReady && isAvailable && isEnabled && (
              <Pressable style={styles.biometricLoginButton} onPress={handleBiometricLogin}>
                <Fingerprint size={20} color={theme.colors.primary} strokeWidth={1.8} />
                <AppText size="sm" family="medium" color={theme.colors.primary}>
                  Entrar com biometria
                </AppText>
              </Pressable>
            )}

            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    InputComponent={BottomSheetTextInput}
                    label="E-mail"
                    placeholder="seu@email.com"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    InputComponent={BottomSheetTextInput}
                    label="Senha"
                    placeholder="••••••"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    error={errors.password?.message}
                    rightElement={
                      <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                        {showPassword ? (
                          <EyeOff size={20} color={theme.colors.textMuted} strokeWidth={1.8} />
                        ) : (
                          <Eye size={20} color={theme.colors.textMuted} strokeWidth={1.8} />
                        )}
                      </Pressable>
                    }
                  />
                )}
              />

              <Button
                variant="primary"
                size="lg"
                label="Entrar"
                onPress={handleSubmit(onSubmit)}
                style={{ width: '100%' }}
              />
            </View>
          </>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}
