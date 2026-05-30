import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect } from "react";

import { AuthStackScreenProps } from "@app/navigation/types";
import { Logo } from "@ui/components/Logo";
import { theme } from "@ui/styles/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = AuthStackScreenProps<"Splash">;

export function Splash({ navigation }: Props) {
  const heroOpacity = useSharedValue(0);
  const heroTranslateY = useSharedValue(16);
  const collageOpacity = useSharedValue(0);
  const ctaOpacity = useSharedValue(0);
  const { bottom, top } = useSafeAreaInsets();

  useEffect(() => {
    heroOpacity.value = withTiming(1, { duration: 520 });
    heroTranslateY.value = withTiming(0, { duration: 520 });
    collageOpacity.value = withDelay(180, withTiming(1, { duration: 500 }));
    ctaOpacity.value = withDelay(320, withTiming(1, { duration: 450 }));
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroTranslateY.value }],
  }));
  const collageStyle = useAnimatedStyle(() => ({
    opacity: collageOpacity.value,
  }));
  const ctaStyle = useAnimatedStyle(() => ({ opacity: ctaOpacity.value }));

  return (
    <View
      style={[styles.container, { paddingBottom: bottom, paddingTop: top }]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.canvas}
      />
      <View style={styles.topBar}>
        <Logo variant="full" size={240} />
        <Text style={styles.version}>v 1.0 · BR</Text>
      </View>
      <Animated.View style={[styles.hero, heroStyle]}>
        <Text style={styles.eyebrow}>Cuide do que está em casa</Text>
        <Text style={styles.headline}>
          {"Sua despensa,\n"}
          <Text style={styles.headlineAccent}>com cabeça.</Text>
        </Text>
        <Text style={styles.body}>
          Acompanhe validades, planeje compras e cozinhe com o que vence
          primeiro.
        </Text>
      </Animated.View>
      <Animated.View style={[styles.collage, collageStyle]}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&q=80",
          }}
          style={[styles.photo, styles.photoTomato]}
        />
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=400&q=80",
          }}
          style={[styles.photo, styles.photoAvocado]}
        />
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
          }}
          style={[styles.photo, styles.photoBread]}
        />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>· 3 alimentos vencem hoje ·</Text>
        </View>
      </Animated.View>
      <Animated.View style={[styles.ctas, ctaStyle]}>
        <Pressable
          style={({ pressed }) => [
            styles.btnPrimary,
            pressed && styles.btnPressed,
          ]}
          onPress={() => navigation.navigate("Onboarding")}
        >
          <Text style={styles.btnPrimaryText}>Começar agora</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.btnGhost,
            pressed && styles.btnPressed,
          ]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.btnGhostText}>Já tenho conta</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const photoShadow = {
  shadowColor: theme.colors.ink,
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.18,
  shadowRadius: 32,
  elevation: 10,
} as const;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.canvas,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 6,
    paddingRight: 24,
    paddingTop: 28,
  },
  version: {
    fontFamily: theme.fontFamily.mono.regular,
    fontSize: 10.5,
    letterSpacing: 10.5 * 0.08,
    textTransform: "uppercase",
    color: theme.colors.muted,
  },

  hero: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 24,
    justifyContent: "center",
  },
  eyebrow: {
    fontFamily: theme.fontFamily.mono.regular,
    fontSize: 10.5,
    letterSpacing: 10.5 * 0.16,
    textTransform: "uppercase",
    color: theme.colors.muted,
  },
  headline: {
    fontFamily: theme.fontFamily.display.regular,
    fontSize: 52,
    lineHeight: 52 * 0.92,
    letterSpacing: 52 * -0.025,
    color: theme.colors.ink,
  },
  headlineAccent: {
    fontFamily: theme.fontFamily.display.italic,
    fontSize: 52,
    lineHeight: 52 * 0.92,
    letterSpacing: 52 * -0.025,
    color: theme.colors.primary,
    fontStyle: "italic",
  },
  body: {
    fontFamily: theme.fontFamily.sans.regular,
    fontSize: 15,
    lineHeight: 15 * 1.5,
    color: theme.colors.muted,
    maxWidth: 280,
  },

  collage: {
    height: 200,
    marginVertical: 24,
  },
  photo: {
    position: "absolute",
    ...photoShadow,
  },
  photoTomato: {
    width: 120,
    height: 150,
    borderRadius: 20,
    left: 18,
    top: 10,
    transform: [{ rotate: "-6deg" }],
  },
  photoAvocado: {
    width: 108,
    height: 130,
    borderRadius: 20,
    left: 140,
    top: 50,
    transform: [{ rotate: "4deg" }],
  },
  photoBread: {
    width: 92,
    height: 110,
    borderRadius: 18,
    right: 14,
    top: 0,
    transform: [{ rotate: "8deg" }],
  },
  badge: {
    position: "absolute",
    left: 130,
    bottom: 6,
    backgroundColor: theme.colors.ink,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    transform: [{ rotate: "-3deg" }],
  },
  badgeText: {
    fontFamily: theme.fontFamily.mono.regular,
    fontSize: 10,
    letterSpacing: 10 * 0.18,
    textTransform: "uppercase",
    color: theme.colors.canvas,
  },

  ctas: {
    gap: 10,
    paddingHorizontal: 22,
    paddingBottom: 32,
  },
  btnPrimary: {
    height: 56,
    borderRadius: 999,
    backgroundColor: theme.colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: {
    fontFamily: theme.fontFamily.sans.medium,
    fontSize: 16,
    letterSpacing: 16 * -0.005,
    color: theme.colors.canvas,
  },
  btnGhost: {
    height: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  btnGhostText: {
    fontFamily: theme.fontFamily.sans.medium,
    fontSize: 15,
    letterSpacing: 15 * -0.005,
    color: theme.colors.ink,
  },
  btnPressed: {
    opacity: 0.72,
  },
});
