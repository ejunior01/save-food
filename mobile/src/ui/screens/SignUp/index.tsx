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
import { ChevronLeft, Check, Eye, EyeOff } from 'lucide-react-native';

import { AppText } from '@ui/components/AppText';
import { Input } from '@ui/components/Input';
import { Button } from '@ui/components/Button';
import { theme } from '@ui/styles/theme';
import { useAuth } from '@app/context/AuthContext';
import { AuthStackScreenProps } from '@app/navigation/types';
import { styles } from './styles';

const schema = z
  .object({
    name: z.string().min(2, 'Mínimo 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
      });
    }
  });

type FormData = z.infer<typeof schema>;

type Props = AuthStackScreenProps<'SignUp'>;

export function SignUp({ navigation }: Props) {
  const { top, bottom } = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  function onSubmit() {
    if (!termsAccepted) { return; }
    signIn();
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Math.max(bottom, 32) }}
        >
          {/* Back button */}
          <View style={styles.backRow}>
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
              <ChevronLeft size={20} color={theme.colors.text} strokeWidth={2} />
            </Pressable>
          </View>

          {/* Header */}
          <View style={[styles.content, { paddingBottom: 0 }]}>
            <AppText size="2xl" family="semiBold">Criar conta</AppText>
            <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: -8 }}>
              Preencha seus dados para começar
            </AppText>
          </View>

          {/* Form */}
          <View style={[styles.content, { marginTop: 24 }]}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Nome completo"
                  placeholder="Seu nome"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="words"
                  error={errors.name?.message}
                />
              )}
            />

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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Confirmar senha"
                  placeholder="••••••"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  autoCapitalize="none"
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            {/* Terms */}
            <Pressable
              style={styles.termsRow}
              onPress={() => setTermsAccepted((v) => !v)}
            >
              <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                {termsAccepted && <Check size={12} color="#fff" strokeWidth={2.5} />}
              </View>
              <Text style={styles.termsText}>
                <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: theme.fontSize.sm, color: theme.colors.textMuted }}>
                  Aceito os{' '}
                </Text>
                <Text style={styles.termsLink}>termos de uso</Text>
                <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: theme.fontSize.sm, color: theme.colors.textMuted }}>
                  {' '}e a{' '}
                </Text>
                <Text style={styles.termsLink}>política de privacidade</Text>
              </Text>
            </Pressable>

            <Button
              variant="primary"
              size="lg"
              label="Criar conta"
              onPress={handleSubmit(onSubmit)}
              disabled={!termsAccepted}
              style={{ width: '100%' }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
              <AppText size="sm" color={theme.colors.textMuted}>Já tem conta?</AppText>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <AppText size="sm" color={theme.colors.primary} family="medium">Entrar</AppText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
