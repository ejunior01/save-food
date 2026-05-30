import { ArrowLeft, Minus, Plus, Users } from "lucide-react-native";
import { DietaryRestriction, useUserStore } from "@app/stores/userStore";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = AuthStackScreenProps<"FamilySetup">;

const RESTRICTIONS: { id: DietaryRestriction; label: string }[] = [
  { id: "sem_lactose", label: "Sem lactose" },
  { id: "vegetariano", label: "Vegetariano" },
  { id: "sem_gluten", label: "Sem glúten" },
  { id: "diabetico", label: "Diabético" },
  { id: "vegano", label: "Vegano" },
  { id: "halal", label: "Halal" },
  { id: "sem_frutos_do_mar", label: "Sem frutos do mar" },
];

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

function CounterTile({
  emoji,
  label,
  value,
  onDecrement,
  onIncrement,
}: {
  emoji: string;
  label: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.hairline,
      padding: 14,
      alignItems: "center",
      gap: 6,
    }}>
      <Text style={{ fontSize: 26 }}>{emoji}</Text>
      <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 12, color: theme.colors.muted, textAlign: "center" }}>{label}</Text>
      <Text style={{ fontFamily: theme.fontFamily.display.italic, fontSize: 22, color: theme.colors.ink }}>{value}</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable
          onPress={onDecrement}
          style={({ pressed }) => ({
            width: 30, height: 30, borderRadius: 999,
            borderWidth: 1, borderColor: theme.colors.hairline,
            backgroundColor: theme.colors.surface,
            alignItems: "center", justifyContent: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Minus size={14} color={theme.colors.ink} strokeWidth={1.6} />
        </Pressable>
        <Pressable
          onPress={onIncrement}
          style={({ pressed }) => ({
            width: 30, height: 30, borderRadius: 999,
            backgroundColor: theme.colors.ink,
            alignItems: "center", justifyContent: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Plus size={14} color={theme.colors.canvas} strokeWidth={1.6} />
        </Pressable>
      </View>
    </View>
  );
}

export function FamilySetup({ navigation }: Props) {
  const { top, bottom } = useSafeAreaInsets();
  const { setHousehold, houseName } = useUserStore();
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(1);
  const [pets, setPets] = useState(0);
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>([]);

  function toggleRestriction(id: DietaryRestriction) {
    setRestrictions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  }

  function handleContinue() {
    setHousehold({ houseName, adults, kids, pets, restrictions });
    navigation.navigate("PlanPicker");
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.canvas} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: bottom + 100 }}
        >
          {/* Header */}
          <View style={{
            paddingTop: top + 18,
            paddingHorizontal: 18,
            paddingBottom: 12,
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
              }}>2/4 · Sobre sua casa</Text>
              <View style={{ width: 40 }} />
            </View>
            <StepBar current={2} total={4} />
          </View>

          <View style={{ paddingHorizontal: 22, paddingTop: 16, gap: 24 }}>
            {/* Title */}
            <View style={{ gap: 6 }}>
              <Text style={{
                fontFamily: theme.fontFamily.display.regular,
                fontSize: 32,
                color: theme.colors.ink,
                lineHeight: 36,
              }}>
                Quem mora{"\n"}com <Text style={{ fontStyle: "italic" }}>você?</Text>
              </Text>
              <Text style={{
                fontFamily: theme.fontFamily.sans.regular,
                fontSize: 13,
                color: theme.colors.muted,
                lineHeight: 18,
              }}>
                Assim a gente ajusta as sugestões pra quem vai comer de verdade.
              </Text>
            </View>

            {/* House name */}
            <View>
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9.5,
                letterSpacing: 0.12 * 9.5,
                textTransform: "uppercase",
                color: theme.colors.muted,
                marginBottom: 8,
              }}>Nome da casa</Text>
              <TextInput
                style={{
                  height: 52,
                  backgroundColor: theme.colors.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: theme.colors.hairline,
                  paddingHorizontal: 16,
                  fontFamily: theme.fontFamily.sans.regular,
                  fontSize: 15,
                  color: theme.colors.ink,
                }}
                placeholder="Ex: Casa dos Pires"
                placeholderTextColor={theme.colors.muted2}
                value={houseName}
                autoCapitalize="words"
              />
            </View>

            {/* Family tiles */}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <CounterTile
                emoji="👨‍👩‍👧"
                label="Adultos"
                value={adults}
                onDecrement={() => setAdults((v) => Math.max(1, v - 1))}
                onIncrement={() => setAdults((v) => v + 1)}
              />
              <CounterTile
                emoji="🧒"
                label="Crianças"
                value={kids}
                onDecrement={() => setKids((v) => Math.max(0, v - 1))}
                onIncrement={() => setKids((v) => v + 1)}
              />
              <CounterTile
                emoji="🐾"
                label="Pets"
                value={pets}
                onDecrement={() => setPets((v) => Math.max(0, v - 1))}
                onIncrement={() => setPets((v) => v + 1)}
              />
            </View>

            {/* Dietary restrictions */}
            <View>
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9.5,
                letterSpacing: 0.12 * 9.5,
                textTransform: "uppercase",
                color: theme.colors.muted,
                marginBottom: 10,
              }}>Restrições alimentares</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {RESTRICTIONS.map((r) => {
                  const active = restrictions.includes(r.id);
                  return (
                    <Pressable
                      key={r.id}
                      onPress={() => toggleRestriction(r.id)}
                      style={({ pressed }) => ({
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: active ? theme.colors.ink : theme.colors.hairline,
                        backgroundColor: active ? theme.colors.ink : theme.colors.surface,
                        opacity: pressed ? 0.75 : 1,
                      })}
                    >
                      <Text style={{
                        fontFamily: theme.fontFamily.sans.medium,
                        fontSize: 13,
                        color: active ? theme.colors.canvas : theme.colors.ink,
                      }}>{r.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Family invite teaser */}
            <View style={{
              backgroundColor: theme.colors.block.cream,
              borderRadius: 18,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
            }}>
              <View style={{
                width: 44, height: 44, borderRadius: 999,
                backgroundColor: theme.colors.canvas,
                alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Users size={20} color={theme.colors.ink} strokeWidth={1.6} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontFamily: theme.fontFamily.sans.semiBold, fontSize: 13.5, color: theme.colors.ink }}>
                  Convide sua família e amigos
                </Text>
                <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 12, color: theme.colors.muted, lineHeight: 16 }}>
                  Chame quem divide a cozinha com você — você convida logo após o cadastro.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Floating CTA */}
        <View style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          paddingHorizontal: 22,
          paddingBottom: Math.max(bottom, 28),
          paddingTop: 12,
          backgroundColor: theme.colors.canvas,
          borderTopWidth: 1,
          borderTopColor: theme.colors.hairlineSoft,
        }}>
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => ({
              height: 54,
              borderRadius: 999,
              backgroundColor: theme.colors.ink,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.88 : 1,
            })}
          >
            <Text style={{
              fontFamily: theme.fontFamily.sans.semiBold,
              fontSize: 16,
              color: theme.colors.canvas,
            }}>Continuar →</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
