import { Camera, ChevronRight, Eye, Lock, Trash2, User, X } from "lucide-react-native";
import {
  Image,
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

import { theme } from "@ui/styles/theme";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserStore } from "@app/stores/userStore";

function Eyebrow({ children }: { children: string }) {
  return (
    <Text style={{
      fontFamily: theme.fontFamily.mono.regular,
      fontSize: 9.5,
      letterSpacing: 0.12 * 9.5,
      textTransform: "uppercase",
      color: theme.colors.muted,
    }}>{children}</Text>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{
      fontFamily: theme.fontFamily.mono.regular,
      fontSize: 9,
      letterSpacing: 0.12 * 9,
      textTransform: "uppercase",
      color: theme.colors.muted,
      marginBottom: 6,
    }}>{children}</Text>
  );
}

function DangerRow({
  icon,
  label,
  sub,
  onPress,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.hairlineSoft,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View style={{
        width: 32, height: 32, borderRadius: 10,
        backgroundColor: danger ? theme.colors.dangerSoft : theme.colors.surfaceSoft,
        alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 13.5, color: danger ? theme.colors.danger : theme.colors.ink }}>
          {label}
        </Text>
        {sub && (
          <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 11.5, color: theme.colors.muted }}>{sub}</Text>
        )}
      </View>
      <ChevronRight size={14} color={danger ? theme.colors.danger : theme.colors.muted} strokeWidth={1.6} />
    </Pressable>
  );
}

export function EditAccount() {
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const {
    name: storedName,
    email: storedEmail,
    avatarUri,
    setProfile,
  } = useUserStore();

  const [name, setName] = useState(storedName);
  const [email, setEmail] = useState(storedEmail);
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState("");

  function handleSave() {
    setProfile({
      name: name.trim(),
      email: email.trim(),
    });
    navigation.goBack();
  }

  const inputStyle = {
    fontFamily: theme.fontFamily.sans.regular,
    fontSize: 15,
    color: theme.colors.ink,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    paddingHorizontal: 16,
    paddingVertical: 14,
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas, paddingBottom: bottom }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.canvas} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottom + 100 }}
        >
          {/* Header */}
          <View style={{
            paddingTop: top + 14,
            paddingHorizontal: 18,
            paddingBottom: 6,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
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
              <X size={18} color={theme.colors.ink} strokeWidth={1.6} />
            </Pressable>
            <Text style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 9.5,
              letterSpacing: 0.12 * 9.5,
              textTransform: "uppercase",
              color: theme.colors.muted,
            }}>Editar conta</Text>
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => ({
                paddingHorizontal: 14, paddingVertical: 8,
                borderRadius: 999,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 14, color: theme.colors.primary }}>Salvar</Text>
            </Pressable>
          </View>

          {/* Title */}
          <View style={{ paddingHorizontal: 22, paddingTop: 10, paddingBottom: 18 }}>
            <Eyebrow>Dados pessoais</Eyebrow>
            <Text style={{
              fontFamily: theme.fontFamily.display.regular,
              fontSize: 34,
              color: theme.colors.ink,
              marginTop: 6,
              lineHeight: 38,
            }}>
              Sua <Text style={{ fontStyle: "italic" }}>conta.</Text>
            </Text>
          </View>

          {/* Avatar */}
          <View style={{ alignItems: "center", paddingBottom: 22 }}>
            <View style={{ position: "relative" }}>
              <View style={{
                width: 110, height: 110, borderRadius: 55,
                backgroundColor: theme.colors.block.cream,
                alignItems: "center", justifyContent: "center",
                borderWidth: 1,
                borderColor: theme.colors.hairline,
              }}>
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={{ width: "100%", height: "100%", borderRadius: 55 }}
                    resizeMode="cover"
                  />
                ) : (
                  <User size={42} color={theme.colors.muted} strokeWidth={1.4} />
                )}
              </View>
              <Pressable style={({ pressed }) => ({
                position: "absolute", right: -4, bottom: -4,
                width: 40, height: 40, borderRadius: 999,
                backgroundColor: theme.colors.ink,
                borderWidth: 3, borderColor: theme.colors.canvas,
                alignItems: "center", justifyContent: "center",
                opacity: pressed ? 0.7 : 1,
              })}>
                <Camera size={18} color={theme.colors.canvas} strokeWidth={1.6} />
              </Pressable>
            </View>
            <Pressable style={({ pressed }) => ({
              marginTop: 14, paddingHorizontal: 16, paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1, borderColor: theme.colors.hairline,
              backgroundColor: theme.colors.surface,
              opacity: pressed ? 0.7 : 1,
            })}>
              <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 13, color: theme.colors.ink }}>Trocar foto</Text>
            </Pressable>
          </View>

          {/* Fields */}
          <View style={{ paddingHorizontal: 22, gap: 18 }}>
            <View>
              <FieldLabel>Nome completo</FieldLabel>
              <TextInput
                style={inputStyle}
                value={name}
                onChangeText={setName}
                placeholderTextColor={theme.colors.muted}
              />
            </View>
            <View>
              <FieldLabel>Email</FieldLabel>
              <TextInput
                style={inputStyle}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={theme.colors.muted}
              />
            </View>
            <View>
              <FieldLabel>
                Telefone{" "}
                <Text style={{ textTransform: "none", letterSpacing: 0, color: theme.colors.muted2 }}>(opcional)</Text>
              </FieldLabel>
              <TextInput
                style={inputStyle}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor={theme.colors.muted}
              />
            </View>
            <View>
              <FieldLabel>
                Data de nascimento{" "}
                <Text style={{ textTransform: "none", letterSpacing: 0, color: theme.colors.muted2 }}>(opcional)</Text>
              </FieldLabel>
              <TextInput
                style={inputStyle}
                value={birthdate}
                onChangeText={setBirthdate}
                placeholder="DD / MM / AAAA"
                placeholderTextColor={theme.colors.muted}
              />
            </View>
          </View>

          {/* Danger zone */}
          <View style={{ paddingHorizontal: 18, paddingTop: 28 }}>
            <View style={{ paddingHorizontal: 4, marginBottom: 8 }}>
              <Eyebrow>Zona perigosa</Eyebrow>
            </View>
            <View style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: theme.colors.hairline,
              overflow: "hidden",
            }}>
              <DangerRow
                icon={<Lock size={16} color={theme.colors.ink} strokeWidth={1.6} />}
                label="Alterar senha"
              />
              <DangerRow
                icon={<Eye size={16} color={theme.colors.ink} strokeWidth={1.6} />}
                label="Exportar meus dados"
                sub="LGPD · arquivo JSON"
              />
              <View style={{ borderBottomWidth: 0 }}>
                <DangerRow
                  icon={<Trash2 size={16} color={theme.colors.danger} strokeWidth={1.6} />}
                  label="Excluir conta"
                  sub="Apaga sua despensa e todos os dados"
                  danger
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Floating CTA */}
        <View style={{
          position: "absolute",
          left: 0, right: 0, bottom: 0,
          paddingHorizontal: 18,
          paddingBottom: bottom + 18,
          paddingTop: 14,
          backgroundColor: theme.colors.canvas,
        }}>
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => ({
              height: 52, borderRadius: 999,
              backgroundColor: theme.colors.ink,
              alignItems: "center", justifyContent: "center",
              flexDirection: "row", gap: 8,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 15, color: theme.colors.canvas }}>
              Salvar alterações
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
