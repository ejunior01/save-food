import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react-native';

import { AppText } from '@ui/components/AppText';
import { Input } from '@ui/components/Input';
import { Button } from '@ui/components/Button';
import { theme } from '@ui/styles/theme';
import { useAuth } from '@app/context/AuthContext';
import { AuthStackScreenProps } from '@app/navigation/types';
import { styles } from './styles';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

type Props = AuthStackScreenProps<'Login'>;

export function Login({ navigation }: Props) {
  const { top, bottom } = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  function onSubmit() {
    signIn();
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.logoEmoji}>🥗</Text>
        <AppText size="2xl" family="semiBold" color="#fff" align="center">
          SaveFood
        </AppText>
        <AppText size="sm" color="rgba(255,255,255,0.8)" align="center">
          Reduza o desperdício, valorize o alimento
        </AppText>
      </View>

      {/* Card */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.card}
          contentContainerStyle={{ paddingBottom: Math.max(bottom, 32) }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>
            <AppText size="xl" family="semiBold">Entrar</AppText>
            <AppText size="sm" color={theme.colors.textMuted} style={styles.subtitle}>
              Bem-vindo de volta!
            </AppText>
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
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

          <View style={styles.forgotRow}>
            <Pressable hitSlop={8}>
              <AppText size="sm" color={theme.colors.primary} family="medium">
                Esqueci a senha
              </AppText>
            </Pressable>
          </View>

          <Button
            variant="primary"
            size="lg"
            label="Entrar"
            onPress={handleSubmit(onSubmit)}
            style={{ width: '100%' }}
          />

          <View style={styles.signUpRow}>
            <AppText size="sm" color={theme.colors.textMuted}>Não tem conta?</AppText>
            <Pressable onPress={() => navigation.navigate('SignUp')}>
              <AppText size="sm" color={theme.colors.primary} family="medium">
                Cadastrar
              </AppText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
