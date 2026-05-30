import { ArrowLeft, Camera, Check, Minus, Plus, Refrigerator, ShoppingBag, Snowflake } from "lucide-react-native";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";

import { theme } from "@ui/styles/theme";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function Eyebrow({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <Text style={{
      fontFamily: theme.fontFamily.mono.regular,
      fontSize: 9.5,
      letterSpacing: 0.12 * 9.5,
      textTransform: "uppercase",
      color: dark ? "rgba(250,245,235,0.65)" : theme.colors.muted,
    }}>{children}</Text>
  );
}

function CompTile({
  emoji,
  label,
  value,
  onChange,
}: {
  emoji: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: 18,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.hairline,
    }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text style={{
        fontFamily: theme.fontFamily.display.italic,
        fontSize: 28,
        color: theme.colors.ink,
        lineHeight: 32,
        marginTop: 4,
      }}>{value}</Text>
      <Text style={{
        fontFamily: theme.fontFamily.mono.regular,
        fontSize: 9,
        letterSpacing: 0.12 * 9,
        textTransform: "uppercase",
        color: theme.colors.muted,
        marginTop: 2,
      }}>{label}</Text>
      <View style={{ flexDirection: "row", gap: 4, marginTop: 8 }}>
        <Pressable
          onPress={() => onChange(Math.max(0, value - 1))}
          style={({ pressed }) => ({
            flex: 1, height: 28, borderRadius: 999,
            backgroundColor: theme.colors.canvas,
            alignItems: "center", justifyContent: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Minus size={12} color={theme.colors.ink} strokeWidth={2} />
        </Pressable>
        <Pressable
          onPress={() => onChange(value + 1)}
          style={({ pressed }) => ({
            flex: 1, height: 28, borderRadius: 999,
            backgroundColor: theme.colors.canvas,
            alignItems: "center", justifyContent: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Plus size={12} color={theme.colors.ink} strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
}

function CapTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: 18,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.hairline,
    }}>
      {icon}
      <Text style={{
        fontFamily: theme.fontFamily.sans.medium,
        fontSize: 13,
        color: theme.colors.ink,
        marginTop: 8,
      }}>{label}</Text>
      <Text style={{
        fontFamily: theme.fontFamily.mono.regular,
        fontSize: 9,
        letterSpacing: 0.12 * 9,
        textTransform: "uppercase",
        color: theme.colors.muted,
        marginTop: 2,
      }}>{value}</Text>
    </View>
  );
}

const RESTRICTIONS = [
  "Sem lactose",
  "Vegetariano",
  "Sem glúten",
  "Diabético",
  "Vegano",
  "Halal",
  "Kosher",
];

export function HouseholdProfile() {
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(1);
  const [pets, setPets] = useState(1);
  const [selected, setSelected] = useState<string[]>(["Sem lactose"]);

  function toggleRestriction(r: string) {
    setSelected(s => s.includes(r) ? s.filter(x => x !== r) : [...s, r]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas, paddingBottom: bottom }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.canvas} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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
              <ArrowLeft size={18} color={theme.colors.ink} strokeWidth={1.6} />
            </Pressable>
            <Text style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 9.5,
              letterSpacing: 0.12 * 9.5,
              textTransform: "uppercase",
              color: theme.colors.muted,
            }}>Perfil da casa</Text>
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
              <Check size={18} color={theme.colors.ink} strokeWidth={1.6} />
            </Pressable>
          </View>

          {/* Hero title */}
          <View style={{ paddingHorizontal: 18, paddingTop: 10, paddingBottom: 16 }}>
            <Eyebrow>Sobre vocês</Eyebrow>
            <Text style={{
              fontFamily: theme.fontFamily.display.regular,
              fontSize: 38,
              color: theme.colors.ink,
              marginTop: 6,
              marginBottom: 14,
              lineHeight: 42,
            }}>
              Sua casa,{"\n"}nossas <Text style={{ fontStyle: "italic" }}>sugestões.</Text>
            </Text>

            {/* Hero photo banner */}
            <View style={{
              height: 140, borderRadius: 20,
              backgroundColor: theme.colors.block.sage,
              overflow: "hidden",
              justifyContent: "flex-end",
            }}>
              {/* Gradient overlay */}
              <View style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                height: 80,
                backgroundColor: "rgba(0,0,0,0.35)",
              }} />
              {/* House name */}
              <View style={{ padding: 14 }}>
                <Text style={{
                  fontFamily: theme.fontFamily.mono.regular,
                  fontSize: 9,
                  letterSpacing: 0.12 * 9,
                  textTransform: "uppercase",
                  color: "rgba(250,245,235,0.7)",
                }}>Casa dos</Text>
                <Text style={{
                  fontFamily: theme.fontFamily.display.italic,
                  fontSize: 22,
                  color: theme.colors.canvas,
                  marginTop: 2,
                }}>Pires</Text>
              </View>
              {/* Camera button */}
              <Pressable
                style={({ pressed }) => ({
                  position: "absolute", top: 12, right: 12,
                  width: 36, height: 36, borderRadius: 999,
                  backgroundColor: "rgba(26,43,31,0.55)",
                  alignItems: "center", justifyContent: "center",
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Camera size={16} color={theme.colors.canvas} strokeWidth={1.6} />
              </Pressable>
            </View>
          </View>

          {/* Composição */}
          <View style={{ paddingHorizontal: 18, paddingBottom: 14 }}>
            <View style={{ marginBottom: 10 }}>
              <Eyebrow>Quem mora aqui</Eyebrow>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <CompTile emoji="🧑" label="Adultos"  value={adults} onChange={setAdults} />
              <CompTile emoji="🧒" label="Crianças" value={kids}   onChange={setKids} />
              <CompTile emoji="🐶" label="Pets"     value={pets}   onChange={setPets} />
            </View>
          </View>

          {/* Restrições alimentares */}
          <View style={{ paddingHorizontal: 18, paddingBottom: 14 }}>
            <Eyebrow>Restrições alimentares</Eyebrow>
            <Text style={{
              fontFamily: theme.fontFamily.sans.regular,
              fontSize: 12,
              color: theme.colors.muted,
              marginTop: 6,
              marginBottom: 10,
              lineHeight: 17,
            }}>
              Filtramos receitas que respeitam estas preferências
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {RESTRICTIONS.map(r => {
                const active = selected.includes(r);
                return (
                  <Pressable
                    key={r}
                    onPress={() => toggleRestriction(r)}
                    style={({ pressed }) => ({
                      height: 38, paddingHorizontal: 14,
                      borderRadius: 999,
                      backgroundColor: active ? theme.colors.ink : theme.colors.surface,
                      borderWidth: active ? 0 : 1,
                      borderColor: theme.colors.hairline,
                      alignItems: "center", justifyContent: "center",
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <Text style={{
                      fontFamily: theme.fontFamily.sans.medium,
                      fontSize: 13,
                      color: active ? theme.colors.canvas : theme.colors.ink,
                    }}>{r}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Equipamentos */}
          <View style={{ paddingHorizontal: 18, paddingBottom: 14 }}>
            <View style={{ marginBottom: 10 }}>
              <Eyebrow>Equipamentos</Eyebrow>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <CapTile
                icon={<ShoppingBag size={20} color={theme.colors.ink} strokeWidth={1.6} />}
                label="Despensa"
                value="Média"
              />
              <CapTile
                icon={<Refrigerator size={20} color={theme.colors.ink} strokeWidth={1.6} />}
                label="Geladeira"
                value="Grande"
              />
              <CapTile
                icon={<Snowflake size={20} color={theme.colors.ink} strokeWidth={1.6} />}
                label="Freezer"
                value="Pequena"
              />
            </View>
          </View>
        </ScrollView>

        <View style={{
          position: "absolute",
          left: 0, right: 0, bottom: 0,
          paddingHorizontal: 18,
          paddingBottom: bottom + 18,
          paddingTop: 14,
          backgroundColor: theme.colors.canvas,
        }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => ({
              height: 52, borderRadius: 999,
              backgroundColor: theme.colors.ink,
              alignItems: "center", justifyContent: "center",
              flexDirection: "row", gap: 8,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{
              fontFamily: theme.fontFamily.sans.medium,
              fontSize: 15,
              color: theme.colors.canvas,
            }}>Salvar perfil</Text>
            <Check size={18} color={theme.colors.canvas} strokeWidth={1.8} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
