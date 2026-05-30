import { Check, Lock, Mail } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";

import { AuthStackScreenProps } from "@app/navigation/types";
import { theme } from "@ui/styles/theme";
import { useAuth } from "@app/context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

type Props = AuthStackScreenProps<"Login">;

function FieldLabel({ children }: { children: string }) {
  return (
    <Text style={{
      fontFamily: theme.fontFamily.mono.regular,
      fontSize: 9.5,
      letterSpacing: 0.12 * 9.5,
      textTransform: "uppercase",
      color: theme.colors.muted,
      marginBottom: 6,
    }}>{children}</Text>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) { return null; }
  return (
    <Text style={{
      fontFamily: theme.fontFamily.sans.regular,
      fontSize: 12,
      color: theme.colors.danger,
      marginTop: 4,
      paddingLeft: 4,
    }}>{message}</Text>
  );
}

function InputField({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  icon,
  hasError,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "email-address" | "default";
  icon: React.ReactNode;
  hasError?: boolean;
}) {
  return (
    <View style={{ position: "relative" }}>
      <TextInput
        style={{
          height: 52,
          backgroundColor: theme.colors.surface,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: hasError ? theme.colors.danger : theme.colors.hairline,
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
        position: "absolute",
        left: 16,
        top: 0, bottom: 0,
        justifyContent: "center",
      }}>
        {icon}
      </View>
    </View>
  );
}

export function Login({ navigation }: Props) {
  const { top, bottom } = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [keepConnected, setKeepConnected] = useState(true);
  const [credentialsError, setCredentialsError] = useState(false);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(data: LoginFormData) {
    setCredentialsError(false);
    const ok = signIn(data.email, data.password);
    if (!ok) {
      setCredentialsError(true);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas, paddingTop: top + 60 }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.canvas} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={{ paddingHorizontal: 22, paddingTop: 18, gap: 20 }}>
            <View style={{ gap: 10 }}>
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9.5,
                letterSpacing: 0.12 * 9.5,
                textTransform: "uppercase",
                color: theme.colors.muted,
              }}>Bem-vindo de volta</Text>
              <Text style={{
                fontFamily: theme.fontFamily.display.regular,
                fontSize: 36,
                color: theme.colors.ink,
                lineHeight: 40,
              }}>
                Entre na sua <Text style={{ fontStyle: "italic" }}>despensa.</Text>
              </Text>
            </View>

            <View style={{ gap: 14 }}>
              <View>
                <FieldLabel>Email</FieldLabel>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      placeholder="seu@email.com"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      icon={<Mail size={18} color={errors.email ? theme.colors.danger : theme.colors.muted} strokeWidth={1.6} />}
                      hasError={!!errors.email}
                    />
                  )}
                />
                <FieldError message={errors.email?.message} />
              </View>

              <View>
                <FieldLabel>Senha</FieldLabel>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      placeholder="••••••••"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry
                      icon={<Lock size={18} color={errors.password ? theme.colors.danger : theme.colors.muted} strokeWidth={1.6} />}
                      hasError={!!errors.password}
                    />
                  )}
                />
                <FieldError message={errors.password?.message} />
              </View>

              {credentialsError && (
                <View style={{
                  paddingTop: 4,
                  paddingBottom: 12,
                }}>
                  <Text style={{
                    fontFamily: theme.fontFamily.sans.regular,
                    fontSize: 13,
                    color: theme.colors.danger,
                  }}>
                    E-mail ou senha incorretos.
                  </Text>
                </View>
              )}

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 4 }}>
                <Pressable
                  onPress={() => setKeepConnected(!keepConnected)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <View style={{
                    width: 16, height: 16, borderRadius: 4,
                    backgroundColor: keepConnected ? theme.colors.ink : theme.colors.surface,
                    borderWidth: keepConnected ? 0 : 1,
                    borderColor: theme.colors.hairline,
                    alignItems: "center", justifyContent: "center",
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

            <View style={{ gap: 10, marginTop: 24 }}>
              <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                style={({ pressed }) => ({
                  height: 54,
                  borderRadius: 999,
                  backgroundColor: theme.colors.ink,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pressed || isSubmitting ? 0.75 : 1,
                })}
              >
                <Text style={{
                  fontFamily: theme.fontFamily.sans.semiBold,
                  fontSize: 16,
                  color: theme.colors.canvas,
                }}>Entrar</Text>
              </Pressable>
            </View>
          </View>
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 9.5,
            letterSpacing: 0.12 * 9.5,
            textTransform: "uppercase",
            color: theme.colors.muted,
            textAlign: "center",
            paddingVertical: 20,
            paddingBottom: Math.max(bottom, 28),
            marginTop: 24,
          }}>
            Novo por aqui?{" "}
            <Text
              onPress={() => navigation.navigate("SignUp")}
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
