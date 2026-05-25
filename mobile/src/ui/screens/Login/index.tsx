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
import { ArrowLeft, Check, Lock, Mail } from 'lucide-react-native';

import { theme } from '@ui/styles/theme';
import { useAuth } from '@app/context/AuthContext';
import { AuthStackScreenProps } from '@app/navigation/types';

type Props = AuthStackScreenProps<'Login'>;

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
  icon,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address' | 'default';
  icon: React.ReactNode;
}) {
  return (
    <View style={{ position: 'relative' }}>
      <TextInput
        style={{
          height: 52,
          backgroundColor: theme.colors.surface,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: theme.colors.hairline,
          paddingLeft: 46,
          paddingRight: 16,
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
        autoCapitalize="none"
      />
      <View style={{
        position: 'absolute',
        left: 16,
        top: 0, bottom: 0,
        justifyContent: 'center',
      }}>
        {icon}
      </View>
    </View>
  );
}

export function Login({ navigation }: Props) {
  const { top, bottom } = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('marina@email.com');
  const [password, setPassword] = useState('••••••••');
  const [keepConnected, setKeepConnected] = useState(true);

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
            }}>Entrar</Text>
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
              }}>Bem-vindo de volta</Text>
              <Text style={{
                fontFamily: theme.fontFamily.display.regular,
                fontSize: 36,
                color: theme.colors.ink,
                lineHeight: 40,
              }}>
                Entre na sua <Text style={{ fontStyle: 'italic' }}>despensa.</Text>
              </Text>
            </View>

            {/* Fields */}
            <View style={{ gap: 14 }}>
              <View>
                <FieldLabel>Email</FieldLabel>
                <InputField
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  icon={<Mail size={18} color={theme.colors.muted} strokeWidth={1.6} />}
                />
              </View>
              <View>
                <FieldLabel>Senha</FieldLabel>
                <InputField
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  icon={<Lock size={18} color={theme.colors.muted} strokeWidth={1.6} />}
                />
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 }}>
                <Pressable
                  onPress={() => setKeepConnected(!keepConnected)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <View style={{
                    width: 16, height: 16, borderRadius: 4,
                    backgroundColor: keepConnected ? theme.colors.ink : theme.colors.surface,
                    borderWidth: keepConnected ? 0 : 1,
                    borderColor: theme.colors.hairline,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    {keepConnected && <Check size={12} color={theme.colors.canvas} strokeWidth={2} />}
                  </View>
                  <Text style={{
                    fontFamily: theme.fontFamily.sans.regular,
                    fontSize: 13,
                    color: theme.colors.muted,
                  }}>Manter conectado</Text>
                </Pressable>
                <Text style={{
                  fontFamily: theme.fontFamily.sans.regular,
                  fontSize: 13,
                  color: theme.colors.ink,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.ink,
                }}>Esqueci a senha</Text>
              </View>
            </View>

            {/* CTAs */}
            <View style={{ gap: 10 }}>
              <Pressable
                onPress={signIn}
                style={({ pressed }) => ({
                  height: 54,
                  borderRadius: 999,
                  backgroundColor: theme.colors.ink,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.88 : 1,
                })}
              >
                <Text style={{
                  fontFamily: theme.fontFamily.sans.semiBold,
                  fontSize: 16,
                  color: theme.colors.canvas,
                }}>Entrar</Text>
              </Pressable>

              <View style={{ height: 1, backgroundColor: theme.colors.hairline, marginVertical: 4 }} />

              <Pressable
                onPress={() => navigation.navigate('Biometric')}
                style={({ pressed }) => ({
                  height: 48,
                  borderRadius: 999,
                  backgroundColor: theme.colors.surface,
                  borderWidth: 1,
                  borderColor: theme.colors.hairline,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  opacity: pressed ? 0.88 : 1,
                })}
              >
                <Text style={{ fontSize: 18 }}>👆</Text>
                <Text style={{
                  fontFamily: theme.fontFamily.sans.medium,
                  fontSize: 14,
                  color: theme.colors.ink,
                }}>Usar biometria</Text>
              </Pressable>
            </View>
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
            Novo por aqui?{' '}
            <Text
              onPress={() => navigation.navigate('SignUp')}
              style={{ color: theme.colors.ink }}
            >
              Criar conta →
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
