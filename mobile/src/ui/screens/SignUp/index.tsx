import * as ImagePicker from "expo-image-picker";

import { ArrowLeft, Camera, Check } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { AuthStackScreenProps } from "@app/navigation/types";
import { theme } from "@ui/styles/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserStore } from "@app/stores/userStore";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});
type SignUpFormData = z.infer<typeof signUpSchema>;

type Props = AuthStackScreenProps<"SignUp">;

function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 999,
            backgroundColor: i < current ? theme.colors.ink : theme.colors.hairline,
          }}
        />
      ))}
    </View>
  );
}

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
  autoCapitalize,
  onFocus,
  hasError,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "email-address" | "default";
  autoCapitalize?: "none" | "words" | "sentences";
  onFocus?: () => void;
  hasError?: boolean;
}) {
  return (
    <TextInput
      style={{
        height: 52,
        backgroundColor: theme.colors.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: hasError ? theme.colors.danger : theme.colors.hairline,
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
      autoCapitalize={autoCapitalize ?? "none"}
      onFocus={onFocus}
    />
  );
}

export function SignUp({ navigation }: Props) {
  const { top, bottom } = useSafeAreaInsets();
  const { setProfile, setAvatarUri, avatarUri } = useUserStore();
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffsetY = useRef(0);
  const emailWrapperRef = useRef<View>(null);
  const passwordWrapperRef = useRef<View>(null);
  const activeWrapperRef = useRef<React.RefObject<View | null> | null>(null);

  function scrollToWrapper(wrapperRef: React.RefObject<View | null>) {
    wrapperRef.current?.measureInWindow((_x, screenY) => {
      const headerH = top + 87;
      const delta = screenY - (headerH + 20);
      scrollRef.current?.scrollTo({
        y: Math.max(0, scrollOffsetY.current + delta),
        animated: true,
      });
    });
  }

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {
      if (activeWrapperRef.current) { scrollToWrapper(activeWrapperRef.current); }
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      activeWrapperRef.current = null;
    });
    return () => { show.remove(); hide.remove(); };
  }, [top]);

  const [name, setName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const canContinue = name.trim().length > 0 && termsAccepted && isValid;

  async function pickAvatar() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {return;}
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  function onSubmit(data: SignUpFormData) {
    if (!name.trim() || !termsAccepted) { return; }
    setProfile({ name: name.trim(), email: data.email, avatarUri });
    navigation.navigate("FamilySetup");
  }

  const initials = name.trim()
    ? name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.canvas} />

      <View style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        paddingTop: top + 18,
        paddingHorizontal: 18,
        paddingBottom: 12,
        backgroundColor: theme.colors.canvas,
        zIndex: 10,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => ({
              width: 40, height: 40, borderRadius: 999,
              borderWidth: 1, borderColor: theme.colors.hairline,
              backgroundColor: theme.colors.surface,
              alignItems: "center", justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <ArrowLeft size={18} color={theme.colors.ink} strokeWidth={1.6} />
          </Pressable>
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 9.5,
            letterSpacing: 0.12 * 9.5,
            textTransform: "uppercase",
            color: theme.colors.muted,
          }}>1/4 · Criar conta</Text>
          <View style={{ width: 40 }} />
        </View>
        <StepBar current={1} total={4} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          onScroll={(e) => { scrollOffsetY.current = e.nativeEvent.contentOffset.y; }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={{ height: top + 87 }} />

          <View style={{ paddingHorizontal: 22, paddingTop: 14, gap: 22 }}>
            <View style={{ gap: 8 }}>
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9.5,
                letterSpacing: 0.12 * 9.5,
                textTransform: "uppercase",
                color: theme.colors.muted,
              }}>Comece em 1 minuto</Text>
              <Text style={{
                fontFamily: theme.fontFamily.display.regular,
                fontSize: 34,
                color: theme.colors.ink,
                lineHeight: 38,
              }}>
                Crie sua <Text style={{ fontStyle: "italic" }}>despensa.</Text>
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Pressable onPress={pickAvatar} style={{ position: "relative" }}>
                <View style={{
                  width: 96, height: 96, borderRadius: 48,
                  backgroundColor: theme.colors.block.pistachio,
                  alignItems: "center", justifyContent: "center",
                  borderWidth: 3,
                  borderColor: theme.colors.hairline,
                  overflow: "hidden",
                }}>
                  {avatarUri ? (
                    <Image
                      source={{ uri: avatarUri }}
                      style={{ width: 96, height: 96, borderRadius: 48 }}
                      resizeMode="cover"
                    />
                  ) : initials ? (
                    <Text style={{ fontFamily: theme.fontFamily.display.italic, fontSize: 32, color: theme.colors.ink }}>{initials}</Text>
                  ) : (
                    <Text style={{ fontSize: 36 }}>🧑</Text>
                  )}
                </View>
                <View style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 30, height: 30, borderRadius: 999,
                  backgroundColor: theme.colors.ink,
                  borderWidth: 2, borderColor: theme.colors.canvas,
                  alignItems: "center", justifyContent: "center",
                }}>
                  <Camera size={14} color={theme.colors.canvas} strokeWidth={1.6} />
                </View>
              </Pressable>
              <Text style={{
                fontFamily: theme.fontFamily.sans.regular,
                fontSize: 11.5,
                color: theme.colors.muted,
                marginTop: 8,
              }}>Toque para adicionar foto</Text>
            </View>
            <View style={{ gap: 14 }}>
              <View>
                <FieldLabel>Nome</FieldLabel>
                <InputField
                  placeholder="Como você gosta de ser chamado"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
              <View ref={emailWrapperRef}>
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
                      hasError={!!errors.email}
                      onFocus={() => {
                        activeWrapperRef.current = emailWrapperRef;
                        scrollToWrapper(emailWrapperRef);
                      }}
                    />
                  )}
                />
                <FieldError message={errors.email?.message} />
              </View>
              <View ref={passwordWrapperRef}>
                <FieldLabel>Senha</FieldLabel>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      placeholder="Mínimo 8 caracteres"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry
                      hasError={!!errors.password}
                      onFocus={() => {
                        activeWrapperRef.current = passwordWrapperRef;
                        scrollToWrapper(passwordWrapperRef);
                      }}
                    />
                  )}
                />
                <FieldError message={errors.password?.message} />
              </View>
            </View>
            <Pressable
              onPress={() => setTermsAccepted(!termsAccepted)}
              style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}
            >
              <View style={{
                width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 2,
                backgroundColor: termsAccepted ? theme.colors.ink : theme.colors.surface,
                borderWidth: termsAccepted ? 0 : 1,
                borderColor: theme.colors.hairline,
                alignItems: "center", justifyContent: "center",
              }}>
                {termsAccepted && <Check size={12} color={theme.colors.canvas} strokeWidth={2.5} />}
              </View>
              <Text style={{
                fontFamily: theme.fontFamily.sans.regular,
                fontSize: 12.5,
                color: theme.colors.muted,
                lineHeight: 18,
                flex: 1,
              }}>
                Concordo com os{" "}
                <Text style={{ textDecorationLine: "underline", color: theme.colors.ink }}>termos de uso</Text>
                {" "}e a{" "}
                <Text style={{ textDecorationLine: "underline", color: theme.colors.ink }}>política de privacidade</Text>
                {" "}alinhada à LGPD.
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit(onSubmit)}
              style={({ pressed }) => ({
                height: 54,
                borderRadius: 999,
                backgroundColor: canContinue ? theme.colors.ink : theme.colors.hairline,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.88 : 1,
              })}
            >
              <Text style={{
                fontFamily: theme.fontFamily.sans.semiBold,
                fontSize: 16,
                color: canContinue ? theme.colors.canvas : theme.colors.muted,
              }}>Continuar →</Text>
            </Pressable>
          </View>

          <View style={{ flex: 1 }} />
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 9.5,
            letterSpacing: 0.12 * 9.5,
            textTransform: "uppercase",
            color: theme.colors.muted,
            textAlign: "center",
            paddingVertical: 20,
            paddingBottom: Math.max(bottom, 28),
          }}>
            Já tem conta?{" "}
            <Text
              onPress={() => navigation.navigate("Login")}
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
