import { ArrowLeft, ArrowUpRight, Clock, Search } from "lucide-react-native";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";

import { AppStackNavigationProps } from "@app/navigation/types";
import { Recipe } from "@app/types";
import { Tag } from "@ui/components/Tag";
import { theme } from "@ui/styles/theme";
import { useAppData } from "@app/context/AppDataContext";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

function ChipBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 36,
        paddingHorizontal: 13,
        borderRadius: 999,
        backgroundColor: active ? theme.colors.ink : theme.colors.surface,
        borderWidth: active ? 0 : 1,
        borderColor: theme.colors.hairline,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Text style={{
        fontFamily: theme.fontFamily.sans.medium,
        fontSize: 12.5,
        color: active ? theme.colors.canvas : theme.colors.ink,
      }}>{label}</Text>
    </Pressable>
  );
}

const FILTERS = [
  { id: "priority", label: "🔥 Em alerta" },
  { id: "all",      label: "Você tem tudo" },
  { id: "quick",    label: "Até 15 min" },
  { id: "veggie",   label: "Vegetarianas" },
];

export function Recipes() {
  const { top, bottom } = useSafeAreaInsets();
  const { recipes } = useAppData();
  const navigation = useNavigation<AppStackNavigationProps>();
  const [filter, setFilter] = useState("priority");

  const featured = recipes[0];
  const list = recipes.slice(1);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas, paddingBottom: bottom + 60 }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.canvas} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{
          paddingTop: top + 14,
          paddingHorizontal: 18,
          paddingBottom: 4,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              width: 40, height: 40, borderRadius: 999,
              borderWidth: 1, borderColor: theme.colors.hairline,
              backgroundColor: theme.colors.surface,
              alignItems: "center", justifyContent: "center",
            }}
          >
            <ArrowLeft size={18} color={theme.colors.ink} strokeWidth={1.6} />
          </Pressable>
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 9.5,
            letterSpacing: 0.12 * 9.5,
            textTransform: "uppercase",
            color: theme.colors.muted,
          }}>Receitas</Text>
          <Pressable style={{
            width: 40, height: 40, borderRadius: 999,
            borderWidth: 1, borderColor: theme.colors.hairline,
            backgroundColor: theme.colors.surface,
            alignItems: "center", justifyContent: "center",
          }}>
            <Search size={18} color={theme.colors.ink} strokeWidth={1.6} />
          </Pressable>
        </View>
        <View style={{ paddingHorizontal: 18, paddingTop: 10, paddingBottom: 4 }}>
          <Eyebrow>Cozinhe com o que tem</Eyebrow>
          <Text style={{
            fontFamily: theme.fontFamily.display.regular,
            fontSize: 38,
            color: theme.colors.ink,
            marginTop: 6,
            marginBottom: 14,
            lineHeight: 42,
          }}>
            Aproveite{"\n"}antes de <Text style={{ fontStyle: "italic" }}>vencer.</Text>
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 18, gap: 8, paddingBottom: 14 }}
        >
          {FILTERS.map((f) => (
            <ChipBtn key={f.id} label={f.label} active={filter === f.id} onPress={() => setFilter(f.id)} />
          ))}
        </ScrollView>

        {featured && (
          <View style={{ paddingHorizontal: 18, paddingBottom: 18 }}>
            <Pressable
              onPress={() => navigation.navigate("RecipeDetail", { recipeId: featured.id })}
              style={({ pressed }) => ({
                backgroundColor: theme.colors.ink,
                borderRadius: 26,
                overflow: "hidden",
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <View style={{ position: "relative" }}>
                {featured.photo ? (
                  <Image
                    source={{ uri: featured.photo }}
                    style={{ width: "100%", height: 220 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={{ width: "100%", height: 220, backgroundColor: theme.colors.block.sage, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 80 }}>{featured.emoji}</Text>
                  </View>
                )}
                <View style={{
                  position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: "transparent",
                }} />
                <View style={{ position: "absolute", top: 14, left: 14 }}>
                  <View style={{
                    height: 28, paddingHorizontal: 10, borderRadius: 999,
                    backgroundColor: theme.colors.block.peach,
                    flexDirection: "row", alignItems: "center", gap: 5,
                  }}>
                    <Text style={{ fontSize: 12 }}>🔥</Text>
                    <Text style={{
                      fontFamily: theme.fontFamily.mono.regular,
                      fontSize: 9.5,
                      letterSpacing: 0.12 * 9.5,
                      textTransform: "uppercase",
                      color: theme.colors.ink,
                    }}>Use primeiro</Text>
                  </View>
                </View>
                <View style={{ position: "absolute", bottom: 14, left: 14, right: 14 }}>
                  <Text style={{
                    fontFamily: theme.fontFamily.mono.regular,
                    fontSize: 9.5,
                    letterSpacing: 0.12 * 9.5,
                    textTransform: "uppercase",
                    color: "rgba(250,245,235,0.75)",
                  }}>Destaque · hoje</Text>
                  <Text style={{
                    fontFamily: theme.fontFamily.display.regular,
                    fontSize: 24,
                    color: theme.colors.canvas,
                    marginTop: 6,
                  }}>{featured.title}</Text>
                </View>
              </View>
              <View style={{ padding: 14, gap: 10 }}>
                <Text style={{
                  fontFamily: theme.fontFamily.sans.regular,
                  fontSize: 13,
                  color: "rgba(250,245,235,0.78)",
                }}>{featured.reason}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <Clock size={12} color="rgba(250,245,235,0.75)" strokeWidth={1.6} />
                      <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 12, color: "rgba(250,245,235,0.75)" }}>
                        {featured.duration} min
                      </Text>
                    </View>
                    <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 12, color: "rgba(250,245,235,0.75)" }}>
                      ✦ {featured.have}/{featured.total} ingredientes
                    </Text>
                    <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 12, color: "rgba(250,245,235,0.75)" }}>
                      {featured.level}
                    </Text>
                  </View>
                  <View style={{
                    height: 32, paddingHorizontal: 14, borderRadius: 999,
                    backgroundColor: theme.colors.canvas,
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Text style={{
                      fontFamily: theme.fontFamily.sans.medium,
                      fontSize: 13,
                      color: theme.colors.ink,
                    }}>Ver receita →</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          </View>
        )}

        <View style={{
          paddingHorizontal: 18,
          paddingBottom: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}>
          <View style={{ gap: 4 }}>
            <Eyebrow>Para você</Eyebrow>
            <Text style={{
              fontFamily: theme.fontFamily.display.regular,
              fontSize: 22,
              color: theme.colors.ink,
            }}>{list.length} sugestões</Text>
          </View>
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 9.5,
            letterSpacing: 0.12 * 9.5,
            textTransform: "uppercase",
            color: theme.colors.muted,
          }}>Match score ↓</Text>
        </View>

        <View style={{ paddingHorizontal: 18, gap: 12 }}>
          {list.map((r) => (
            <RecipeListRow
              key={r.id}
              recipe={r}
              onPress={() => navigation.navigate("RecipeDetail", { recipeId: r.id })}
            />
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

function RecipeListRow({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  const missing = recipe.missing?.length ?? 0;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "stretch",
        gap: 14,
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.hairline,
        padding: 12,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      {recipe.photo ? (
        <Image
          source={{ uri: recipe.photo }}
          style={{ width: 94, height: 94, borderRadius: 14 }}
          resizeMode="cover"
        />
      ) : (
        <View style={{
          width: 94, height: 94, borderRadius: 14,
          backgroundColor: theme.colors.block.sage,
          alignItems: "center", justifyContent: "center",
        }}>
          <Text style={{ fontSize: 40 }}>{recipe.emoji}</Text>
        </View>
      )}
      <View style={{ flex: 1, minWidth: 0, justifyContent: "space-between" }}>
        <View style={{ gap: 4 }}>
          <Text style={{
            fontFamily: theme.fontFamily.sans.medium,
            fontSize: 15,
            color: theme.colors.ink,
          }} numberOfLines={1}>{recipe.title}</Text>
          <Text style={{
            fontFamily: theme.fontFamily.sans.regular,
            fontSize: 12,
            color: theme.colors.muted,
          }} numberOfLines={1}>{recipe.reason}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
          <Tag
            label={missing === 0 ? "Você tem tudo" : `Falta ${missing}`}
            tone={missing === 0 ? "safe" : "soon"}
            size="sm"
          />
          <View style={{
            height: 24, paddingHorizontal: 10, borderRadius: 999,
            backgroundColor: theme.colors.surfaceSoft,
            flexDirection: "row", alignItems: "center", gap: 4,
          }}>
            <Clock size={10} color={theme.colors.muted} strokeWidth={1.6} />
            <Text style={{
              fontFamily: theme.fontFamily.sans.medium,
              fontSize: 11,
              color: theme.colors.muted,
            }}>{recipe.duration} min</Text>
          </View>
        </View>
      </View>
      <View style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
        <Text style={{
          fontFamily: theme.fontFamily.display.italic,
          fontSize: 30,
          color: theme.colors.ink,
          lineHeight: 34,
        }}>
          {recipe.have}
          <Text style={{
            fontFamily: theme.fontFamily.sans.regular,
            fontSize: 14,
            color: theme.colors.muted,
          }}>/{recipe.total}</Text>
        </Text>
        <ArrowUpRight size={18} color={theme.colors.ink} strokeWidth={1.6} />
      </View>
    </Pressable>
  );
}
