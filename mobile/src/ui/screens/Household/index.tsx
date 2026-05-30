import {
  ArrowLeft,
  Check,
  ChefHat,
  MoreHorizontal,
  Plus,
  Settings,
  ShoppingCart,
  Trash2,
} from "lucide-react-native";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";

import React from "react";
import { theme } from "@ui/styles/theme";
import { useAppData } from "@app/context/AppDataContext";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserStore } from "@app/stores/userStore";

function Eyebrow({
  children,
  dark = false,
}: {
  children: string;
  dark?: boolean;
}) {
  return (
    <Text
      style={{
        fontFamily: theme.fontFamily.mono.regular,
        fontSize: 9.5,
        letterSpacing: 0.12 * 9.5,
        textTransform: "uppercase",
        color: dark ? "rgba(250,245,235,0.65)" : theme.colors.muted,
      }}
    >
      {children}
    </Text>
  );
}

function MiniCard({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: theme.colors.hairline,
      }}
    >
      <Text
        style={{
          fontFamily: theme.fontFamily.display.italic,
          fontSize: 24,
          color: accent ? theme.colors.safe : theme.colors.ink,
          lineHeight: 28,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: theme.fontFamily.mono.regular,
          fontSize: 9,
          letterSpacing: 0.12 * 9,
          textTransform: "uppercase",
          color: theme.colors.muted,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

const MEMBERS = [
  {
    id: "m1",
    name: "Marina",
    role: "Admin",
    items: 8,
    color: theme.colors.block.pistachio,
  },
  {
    id: "m2",
    name: "Pedro",
    role: "Membro",
    items: 5,
    color: theme.colors.block.peach,
  },
  {
    id: "m3",
    name: "Luiza",
    role: "Convidada",
    items: 2,
    color: theme.colors.block.rose,
  },
];

type ActivityTone = "safe" | "danger" | "soon" | "ink";

const ACTIVITY: Array<{
  who: string;
  what: string;
  item: string;
  when: string;
  tone: ActivityTone;
  icon: React.ReactNode;
}> = [
  {
    who: "Pedro",
    what: "adicionou",
    item: "Iogurte natural",
    when: "há 12 min",
    tone: "safe",
    icon: <Plus size={12} color={theme.colors.safe} strokeWidth={2} />,
  },
  {
    who: "Marina",
    what: "marcou consumido",
    item: "Leite integral",
    when: "há 2h",
    tone: "ink",
    icon: <Check size={12} color={theme.colors.ink} strokeWidth={2} />,
  },
  {
    who: "Pedro",
    what: "descartou",
    item: "Alface (vencido)",
    when: "há 5h",
    tone: "danger",
    icon: <Trash2 size={12} color={theme.colors.danger} strokeWidth={2} />,
  },
  {
    who: "Luiza",
    what: "comprou da lista",
    item: "Manjericão fresco",
    when: "ontem",
    tone: "soon",
    icon: <ShoppingCart size={12} color={theme.colors.soon} strokeWidth={2} />,
  },
  {
    who: "Marina",
    what: "cozinhou",
    item: "Bruschetta de tomate",
    when: "ontem",
    tone: "ink",
    icon: <ChefHat size={12} color={theme.colors.ink} strokeWidth={2} />,
  },
];

function activityIconBg(tone: ActivityTone): string {
  switch (tone) {
    case "safe":
      return theme.colors.safeSoft;
    case "danger":
      return theme.colors.dangerSoft;
    case "soon":
      return theme.colors.soonSoft;
    default:
      return theme.colors.surfaceSoft;
  }
}

export function Household() {
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { pantryItems } = useAppData();
  const { houseName } = useUserStore();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.canvas}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + 40 }}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: top + 14,
            paddingHorizontal: 18,
            paddingBottom: 6,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: theme.colors.hairline,
              backgroundColor: theme.colors.surface,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <ArrowLeft size={18} color={theme.colors.ink} strokeWidth={1.6} />
          </Pressable>
          <Text
            style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 9.5,
              letterSpacing: 0.12 * 9.5,
              textTransform: "uppercase",
              color: theme.colors.muted,
            }}
          >
            Casa compartilhada
          </Text>
          <Pressable
            onPress={() => navigation.navigate("HouseholdProfile")}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: theme.colors.hairline,
              backgroundColor: theme.colors.surface,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Settings size={18} color={theme.colors.ink} strokeWidth={1.6} />
          </Pressable>
        </View>

        {/* Hero */}
        <View
          style={{ paddingHorizontal: 18, paddingTop: 10, paddingBottom: 14 }}
        >
          <Eyebrow>Nossa casa</Eyebrow>
          <Text
            style={{
              fontFamily: theme.fontFamily.display.regular,
              fontSize: 38,
              color: theme.colors.ink,
              marginTop: 6,
              marginBottom: 14,
              lineHeight: 42,
            }}
          >
            <Text style={{ fontStyle: "italic" }}>{houseName}</Text>
          </Text>

          {/* Avatar stack */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {MEMBERS.map((m, i) => (
                <View
                  key={m.id}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: m.color,
                    marginLeft: i === 0 ? 0 : -12,
                    borderWidth: 3,
                    borderColor: theme.colors.canvas,
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: MEMBERS.length - i,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.display.italic,
                      fontSize: 18,
                      color: theme.colors.ink,
                    }}
                  >
                    {m.name[0]}
                  </Text>
                </View>
              ))}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: theme.colors.ink,
                  marginLeft: -12,
                  borderWidth: 3,
                  borderColor: theme.colors.canvas,
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 0,
                }}
              >
                <Plus size={20} color={theme.colors.canvas} strokeWidth={1.8} />
              </View>
            </View>
            <Text
              style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9.5,
                letterSpacing: 0.12 * 9.5,
                textTransform: "uppercase",
                color: theme.colors.muted,
              }}
            >
              3 pessoas
            </Text>
          </View>
        </View>

        {/* Quick stats */}
        <View
          style={{
            paddingHorizontal: 18,
            paddingBottom: 14,
            flexDirection: "row",
            gap: 8,
          }}
        >
          <MiniCard
            value={String(pantryItems.length || 18)}
            label="alimentos"
          />
          <MiniCard value="5" label="receitas salvas" />
          <MiniCard value="12.3kg" label="salvos em maio" accent />
        </View>

        {/* Members section */}
        <View style={{ paddingHorizontal: 18, paddingBottom: 8 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View style={{ gap: 4 }}>
              <Eyebrow>Quem mora aqui</Eyebrow>
              <Text
                style={{
                  fontFamily: theme.fontFamily.display.regular,
                  fontSize: 22,
                  color: theme.colors.ink,
                  lineHeight: 26,
                }}
              >
                3 moradores
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => ({
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: theme.colors.hairline,
                backgroundColor: theme.colors.surface,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Plus size={14} color={theme.colors.ink} strokeWidth={1.6} />
              <Text
                style={{
                  fontFamily: theme.fontFamily.sans.medium,
                  fontSize: 12,
                  color: theme.colors.ink,
                }}
              >
                Convidar
              </Text>
            </Pressable>
          </View>

          <View style={{ gap: 10 }}>
            {MEMBERS.map((m) => (
              <View
                key={m.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  backgroundColor: theme.colors.surface,
                  padding: 12,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: theme.colors.hairline,
                }}
              >
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 23,
                    backgroundColor: m.color,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.display.italic,
                      fontSize: 20,
                      color: theme.colors.ink,
                    }}
                  >
                    {m.name[0]}
                  </Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.sans.medium,
                      fontSize: 14,
                      color: theme.colors.ink,
                    }}
                  >
                    {m.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.sans.regular,
                      fontSize: 12,
                      color: theme.colors.muted,
                    }}
                  >
                    {m.role} · {m.items} alimentos cadastrados
                  </Text>
                </View>
                <Pressable
                  style={({ pressed }) => ({
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <MoreHorizontal
                    size={16}
                    color={theme.colors.muted}
                    strokeWidth={1.6}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* Activity section */}
        <View
          style={{ paddingHorizontal: 18, paddingTop: 8, paddingBottom: 14 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View style={{ gap: 4 }}>
              <Eyebrow>Atividade recente</Eyebrow>
              <Text
                style={{
                  fontFamily: theme.fontFamily.display.regular,
                  fontSize: 22,
                  color: theme.colors.ink,
                  lineHeight: 26,
                }}
              >
                O que rolou hoje
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text
                style={{
                  fontFamily: theme.fontFamily.mono.regular,
                  fontSize: 9.5,
                  letterSpacing: 0.12 * 9.5,
                  textTransform: "uppercase",
                  color: theme.colors.muted,
                }}
              >
                VER TUDO →
              </Text>
            </Pressable>
          </View>

          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: theme.colors.hairline,
              paddingHorizontal: 14,
            }}
          >
            {ACTIVITY.map((a, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingVertical: 12,
                  borderBottomWidth: i < ACTIVITY.length - 1 ? 1 : 0,
                  borderBottomColor: theme.colors.hairlineSoft,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    backgroundColor: activityIconBg(a.tone),
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {a.icon}
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.sans.regular,
                      fontSize: 13,
                      color: theme.colors.ink,
                      lineHeight: 18,
                    }}
                  >
                    <Text style={{ fontFamily: theme.fontFamily.sans.medium }}>
                      {a.who}
                    </Text>{" "}
                    {a.what}{" "}
                    <Text
                      style={{ fontFamily: theme.fontFamily.display.italic }}
                    >
                      {a.item}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.mono.regular,
                      fontSize: 9.5,
                      letterSpacing: 0.12 * 9.5,
                      textTransform: "uppercase",
                      color: theme.colors.muted,
                    }}
                  >
                    {a.when}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
