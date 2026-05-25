import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react-native';

import { theme } from '@ui/styles/theme';
import { useAuth } from '@app/context/AuthContext';
import { AuthStackScreenProps } from '@app/navigation/types';

type Props = AuthStackScreenProps<'SignUp'>;

function FieldLabel({ children }: { children: string }) {
  return (
    <Text style={{
      fontFamily: theme.fontFamily.mono.regular,
      fontSize: 9.5,
      letterSpacing: 0.12 * 9.5,
      textTransform: 'uppercase',
      color: theme.colors.muted,
      marginBottom: 6,
    }}>{children}</Text>
  );
}

function InputField({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address' | 'default';
  autoCapitalize?: 'none' | 'words' | 'sentences';
}) {
  return (
    <TextInput
      style={{
        height: 52,
        backgroundColor: theme.colors.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.colors.hairline,
        paddingHorizontal: 16,
        fontFamily: theme.fontFamily.sans.regular,
        fontSize: 15,
        color: theme.colors.ink,
      }}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.muted2}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize ?? 'none'}
    />
  );
}

export function SignUp({ navigation }: Props) {
  const { top, bottom } = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.canvas} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Back */}
          <View style={{
            paddingTop: top + 18,
            paddingHorizontal: 18,
            paddingBottom: 6,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                width: 40, height: 40, borderRadius: 999,
                borderWidth: 1, borderColor: theme.colors.hairline,
                backgroundColor: theme.colors.surface,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ArrowLeft size={18} color={theme.colors.ink} strokeWidth={1.6} />
            </Pressable>
            <Text style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 9.5,
              letterSpacing: 0.12 * 9.5,
              textTransform: 'uppercase',
              color: theme.colors.muted,
            }}>Criar conta</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={{ paddingHorizontal: 22, paddingTop: 18, gap: 20 }}>
            {/* Heading */}
            <View style={{ gap: 10 }}>
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9.5,
                letterSpacing: 0.12 * 9.5,
                textTransform: 'uppercase',
                color: theme.colors.muted,
              }}>Comece em 1 minuto</Text>
              <Text style={{
                fontFamily: theme.fontFamily.display.regular,
                fontSize: 36,
                color: theme.colors.ink,
                lineHeight: 40,
              }}>
                Crie sua <Text style={{ fontStyle: 'italic' }}>despensa.</Text>
              </Text>
            </View>

            {/* Fields */}
            <View style={{ gap: 14 }}>
              <View>
                <FieldLabel>Nome</FieldLabel>
                <InputField
                  placeholder="Como podemos te chamar"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
              <View>
                <FieldLabel>Email</FieldLabel>
                <InputField
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>
              <View>
                <FieldLabel>Senha</FieldLabel>
                <InputField
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Terms */}
            <Pressable
              onPress={() => setTermsAccepted(!termsAccepted)}
              style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}
            >
              <View style={{
                width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 2,
                backgroundColor: termsAccepted ? theme.colors.ink : theme.colors.surface,
                borderWidth: termsAccepted ? 0 : 1,
                borderColor: theme.colors.hairline,
                alignItems: 'center', justifyContent: 'center',
              }}>
                {termsAccepted && <Check size={14} color={theme.colors.canvas} strokeWidth={2} />}
              </View>
              <Text style={{
                fontFamily: theme.fontFamily.sans.regular,
                fontSize: 12.5,
                color: theme.colors.muted,
                lineHeight: 18,
                flex: 1,
              }}>
                Concordo com os{' '}
                <Text style={{ textDecorationLine: 'underline', color: theme.colors.ink }}>termos de uso</Text>
                {' '}e a{' '}
                <Text style={{ textDecorationLine: 'underline', color: theme.colors.ink }}>política de privacidade</Text>
                {' '}alinhada à LGPD.
              </Text>
            </Pressable>

            {/* CTA */}
            <Pressable
              onPress={termsAccepted ? signIn : undefined}
              style={({ pressed }) => ({
                height: 54,
                borderRadius: 999,
                backgroundColor: termsAccepted ? theme.colors.ink : theme.colors.hairline,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                opacity: pressed ? 0.88 : 1,
              })}
            >
              <Text style={{
                fontFamily: theme.fontFamily.sans.semiBold,
                fontSize: 16,
                color: termsAccepted ? theme.colors.canvas : theme.colors.muted,
              }}>Criar conta</Text>
              <ArrowRight size={18} color={termsAccepted ? theme.colors.canvas : theme.colors.muted} strokeWidth={1.6} />
            </Pressable>
          </View>

          <View style={{ flex: 1 }} />
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 9.5,
            letterSpacing: 0.12 * 9.5,
            textTransform: 'uppercase',
            color: theme.colors.muted,
            textAlign: 'center',
            paddingVertical: 20,
            paddingBottom: Math.max(bottom, 28),
          }}>
            Já tem conta?{' '}
            <Text
              onPress={() => navigation.navigate('Login')}
              style={{ color: theme.colors.ink }}
            >
              Entrar →
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
