import React, { useState } from "react";
import { Image, Pressable, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, FingerprintPattern, Lock } from "lucide-react-native";

import { theme } from "@ui/styles/theme";
import { useAuth } from "@app/context/AuthContext";
import { useBiometrics } from "@app/hooks/useBiometrics";
import { AuthStackScreenProps } from "@app/navigation/types";
import { useUserStore } from "@app/stores/userStore";

type ScanState = "idle" | "scanning" | "success";

export function Biometric({ navigation }: AuthStackScreenProps<"Biometric">) {
  const { top, bottom } = useSafeAreaInsets();
  const { signInWithStoredUser } = useAuth();
  const { authenticate } = useBiometrics();
  const { name, email, avatarUri } = useUserStore();
  const [scanState, setScanState] = useState<ScanState>("idle");
  const firstName = name.trim() ? name.trim().split(" ")[0] : "você";

  async function handlePress() {
    if (scanState !== "idle") {return;}
    if (!email) {
      navigation.navigate("Login");
      return;
    }
    setScanState("scanning");
    const ok = await authenticate();
    if (ok) {
      setScanState("success");
      setTimeout(() => {
        const signedIn = signInWithStoredUser();
        if (!signedIn) {
          setScanState("idle");
          navigation.navigate("Login");
        }
      }, 600);
    } else {
      setScanState("idle");
    }
  }

  const ringColor =
    scanState === "success" ? theme.colors.safe :
    scanState === "scanning" ? theme.colors.block.peach :
    theme.colors.hairline;

  const iconColor =
    scanState === "success" ? theme.colors.safe :
    scanState === "scanning" ? theme.colors.block.peach :
    theme.colors.ink;

  const caption =
    scanState === "idle" ? "· Toque o sensor para continuar ·" :
    scanState === "scanning" ? "· Identificando ·" :
    "· Acesso liberado ·";

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.canvas} />

      {/* Header */}
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 22,
        paddingTop: top + 22,
        paddingBottom: 8,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{
            width: 20, height: 20, borderRadius: 6,
            backgroundColor: theme.colors.primary,
          }} />
          <Text style={{
            fontFamily: theme.fontFamily.display.regular,
            fontSize: 18,
            color: theme.colors.ink,
          }}>
            Despensa<Text style={{ fontStyle: "italic" }}>Certa</Text>
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={({ pressed }) => ({
            height: 34, paddingHorizontal: 14, borderRadius: 999,
            borderWidth: 1, borderColor: theme.colors.hairline,
            backgroundColor: theme.colors.surface,
            alignItems: "center", justifyContent: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{
            fontFamily: theme.fontFamily.sans.medium,
            fontSize: 13,
            color: theme.colors.ink,
          }}>Outra conta</Text>
        </Pressable>
      </View>

      {/* Center */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 28, paddingHorizontal: 28 }}>
        {/* Avatar */}
        <View style={{
          width: 72, height: 72, borderRadius: 36,
          backgroundColor: theme.colors.block.pistachio,
          alignItems: "center", justifyContent: "center",
        }}>
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={{ width: "100%", height: "100%", borderRadius: 36 }}
            />
          ) : (
            <Text style={{ fontSize: 32 }}>👤</Text>
          )}
        </View>

        <View style={{ gap: 6, alignItems: "center" }}>
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 9.5,
            letterSpacing: 0.12 * 9.5,
            textTransform: "uppercase",
            color: theme.colors.muted,
          }}>De volta</Text>
          <Text style={{
            fontFamily: theme.fontFamily.display.regular,
            fontSize: 36,
            color: theme.colors.ink,
            lineHeight: 40,
          }}>
            Olá, <Text style={{ fontStyle: "italic" }}>{firstName}</Text>
          </Text>
          <Text style={{
            fontFamily: theme.fontFamily.sans.regular,
            fontSize: 14,
            color: theme.colors.muted,
            textAlign: "center",
            maxWidth: 240,
            lineHeight: 20,
          }}>
            Toque para entrar com biometria
          </Text>
        </View>

        {/* Fingerprint button */}
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => ({
            width: 140, height: 140, borderRadius: 70,
            backgroundColor: theme.colors.surface,
            borderWidth: 2,
            borderColor: ringColor,
            alignItems: "center", justifyContent: "center",
            shadowColor: theme.colors.ink,
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.10,
            shadowRadius: 30,
            elevation: 8,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          {scanState === "success" ? (
            <Check size={56} color={theme.colors.safe} strokeWidth={1.5} />
          ) : (
            <FingerprintPattern size={64} color={iconColor} strokeWidth={1.2} />
          )}
        </Pressable>

        <Text style={{
          fontFamily: theme.fontFamily.mono.regular,
          fontSize: 10,
          letterSpacing: 0.16 * 10,
          textTransform: "uppercase",
          color: scanState === "success" ? theme.colors.safe : theme.colors.muted,
        }}>{caption}</Text>
      </View>

      {/* Bottom */}
      <View style={{
        paddingHorizontal: 22,
        paddingBottom: bottom + 32,
        alignItems: "center",
      }}>
        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={({ pressed }) => ({
            height: 44, paddingHorizontal: 20, borderRadius: 999,
            borderWidth: 1, borderColor: theme.colors.hairline,
            backgroundColor: theme.colors.surface,
            flexDirection: "row", alignItems: "center", gap: 8,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Lock size={16} color={theme.colors.ink} strokeWidth={1.6} />
          <Text style={{
            fontFamily: theme.fontFamily.sans.medium,
            fontSize: 14,
            color: theme.colors.ink,
          }}>Entrar com senha</Text>
        </Pressable>
      </View>
    </View>
  );
}
