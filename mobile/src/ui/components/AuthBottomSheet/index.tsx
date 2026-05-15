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
import { Eye, EyeOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@ui/components/AppText';
import { Input } from '@ui/components/Input';
import { Button } from '@ui/components/Button';
import { theme } from '@ui/styles/theme';
import { useAuth } from '@app/context/AuthContext';
import { styles } from './styles';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useImperativeHandle(ref, () => ({
    open: () => modalRef.current?.present(),
    close: () => modalRef.current?.dismiss(),
  }));

  function onSubmit() {
    signIn();
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
        <AppText size="2xl" family="semiBold" style={styles.heading}>
          Entrar na conta
        </AppText>

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
      </BottomSheetView>
    </BottomSheetModal>
  );
}
