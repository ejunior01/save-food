import { Animated, Easing, Pressable, StatusBar, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";

import { Sparkles } from "lucide-react-native";
import { theme } from "@ui/styles/theme";
import { useAuth } from "@app/context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserStore } from "@app/stores/userStore";

export function SignUpSuccess() {
  const { top, bottom } = useSafeAreaInsets();
  const { completeSignUp } = useAuth();
  const { name } = useUserStore();

  const firstName = name ? name.split(" ")[0] : "você";

  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(32)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 420, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.ink }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.ink} />

      <View style={{ position: "absolute", right: -24, top: 80 }}>
        <Text style={{ fontSize: 200, opacity: 0.05, color: theme.colors.block.pistachio }}>✦</Text>
      </View>

      <View style={{
        flex: 1,
        paddingTop: top + 60,
        paddingHorizontal: 28,
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}>
        <Animated.View style={{
          transform: [{ scale }],
          opacity,
          alignItems: "center",
          marginBottom: 40,
        }}>
          <View style={{
            width: 100, height: 100, borderRadius: 999,
            backgroundColor: theme.colors.block.pistachio,
            alignItems: "center", justifyContent: "center",
            shadowColor: theme.colors.block.pistachio,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.45,
            shadowRadius: 30,
          }}>
            <Text style={{ fontSize: 46 }}>🎉</Text>
          </View>
        </Animated.View>

        <Animated.View style={{
          opacity,
          transform: [{ translateY: slideUp }],
          alignItems: "center",
          gap: 12,
        }}>
          <View style={{
            flexDirection: "row", alignItems: "center", gap: 6,
            backgroundColor: theme.colors.block.pistachio,
            paddingHorizontal: 12, paddingVertical: 5,
            borderRadius: 999,
            marginBottom: 4,
          }}>
            <Sparkles size={12} color={theme.colors.ink} strokeWidth={1.6} />
            <Text style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 9,
              letterSpacing: 0.12 * 9,
              textTransform: "uppercase",
              color: theme.colors.ink,
            }}>4/4 · Tudo pronto</Text>
          </View>

          <Text style={{
            fontFamily: theme.fontFamily.display.regular,
            fontSize: 44,
            color: theme.colors.canvas,
            textAlign: "center",
            lineHeight: 48,
          }}>
            Que bom ter{"\n"}você aqui,{"\n"}
            <Text style={{ fontStyle: "italic", color: theme.colors.block.pistachio }}>
              {firstName}!
            </Text>
          </Text>

          <Text style={{
            fontFamily: theme.fontFamily.sans.regular,
            fontSize: 15,
            color: "rgba(250,245,235,0.65)",
            textAlign: "center",
            lineHeight: 22,
            maxWidth: 280,
            marginTop: 4,
          }}>
            Sua despensa está esperando por você. Bora aproveitar melhor o que tem em casa.
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={{
        opacity,
        paddingHorizontal: 24,
        paddingBottom: Math.max(bottom, 36),
        gap: 12,
      }}>
        <Pressable
          onPress={completeSignUp}
          style={({ pressed }) => ({
            height: 54,
            borderRadius: 999,
            backgroundColor: theme.colors.block.pistachio,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{
            fontFamily: theme.fontFamily.sans.semiBold,
            fontSize: 16,
            color: theme.colors.ink,
          }}>Ir para minha despensa →</Text>
        </Pressable>

        <Text style={{
          fontFamily: theme.fontFamily.mono.regular,
          fontSize: 9,
          letterSpacing: 0.12 * 9,
          textTransform: "uppercase",
          color: "rgba(250,245,235,0.35)",
          textAlign: "center",
        }}>Redirecionando automaticamente…</Text>
      </Animated.View>
    </View>
  );
}
