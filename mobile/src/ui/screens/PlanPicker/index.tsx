import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@ui/styles/theme";
import { AuthStackScreenProps } from "@app/navigation/types";
import { useUserStore } from "@app/stores/userStore";
import { UserPlan } from "@app/types";

type Props = AuthStackScreenProps<"PlanPicker">;

type Billing = "annual" | "monthly";

const FEATURES: { label: string; free: boolean; premium: boolean; badge?: string }[] = [
  { label: "Cadastro manual + escaneamento de código de barras", free: true,  premium: true },
  { label: "Alertas de validade (30, 15 e 5 dias)",               free: true,  premium: true },
  { label: "Receitas sugeridas com o que você tem",               free: true,  premium: true },
  { label: "Lista de compras inteligente",                        free: true,  premium: true },
  { label: "Reconhecimento por IA · frutas e verduras",           free: false, premium: true, badge: "IA" },
  { label: "Dicas de armazenamento curadas",                      free: false, premium: true, badge: "IA" },
  { label: "Importar NFe (cupom fiscal)",                         free: false, premium: true },
  { label: "Insights de desperdício e economia",                  free: false, premium: true },
  { label: "Planejador semanal de refeições",                     free: false, premium: true },
  { label: "Casa compartilhada · convide a família",              free: false, premium: true },
  { label: "Sem publicidade",                                     free: false, premium: true },
];

function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={{
          flex: 1, height: 4, borderRadius: 999,
          backgroundColor: i < current ? theme.colors.ink : theme.colors.hairline,
        }} />
      ))}
    </View>
  );
}

function PlanCard({
  selected, onSelect, label, price, sub, blurb, dark, badge,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
  price: string;
  sub: string;
  blurb: string;
  dark?: boolean;
  badge?: string;
}) {
  const bg = selected
    ? (dark ? theme.colors.ink : theme.colors.surface)
    : (dark ? theme.colors.ink2 : theme.colors.surfaceSoft);
  const fg = dark ? theme.colors.canvas : theme.colors.ink;
  const muted = dark ? "rgba(250,245,235,0.65)" : theme.colors.muted;
  const ringColor = selected ? (dark ? theme.colors.block.pistachio : theme.colors.ink) : "transparent";

  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: bg,
        borderRadius: 20,
        padding: 14,
        paddingBottom: 18,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? ringColor : (dark ? "transparent" : theme.colors.hairline),
        opacity: pressed ? 0.9 : 1,
      })}
    >
      {badge && (
        <View style={{
          position: "absolute", top: -10, right: 10,
          backgroundColor: theme.colors.block.pistachio,
          paddingHorizontal: 8, paddingVertical: 4,
          borderRadius: 999,
        }}>
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 8.5, letterSpacing: 0.12 * 8.5,
            color: theme.colors.ink, textTransform: "uppercase",
          }}>{badge}</Text>
        </View>
      )}

      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 }}>
        {dark && <Sparkles size={13} color={theme.colors.block.pistachio} strokeWidth={1.6} />}
        <Text style={{
          fontFamily: theme.fontFamily.mono.regular,
          fontSize: 9.5, letterSpacing: 0.12 * 9.5, textTransform: "uppercase",
          color: dark ? theme.colors.block.pistachio : theme.colors.muted,
        }}>{dark ? "★ PREMIUM" : "GRÁTIS"}</Text>
      </View>

      <Text style={{
        fontFamily: theme.fontFamily.display.italic,
        fontSize: 28, lineHeight: 30, color: fg,
      }}>{price}</Text>
      <Text style={{
        fontFamily: theme.fontFamily.mono.regular,
        fontSize: 9, letterSpacing: 0.12 * 9, textTransform: "uppercase",
        color: muted, marginTop: 2,
      }}>{sub}</Text>
      <Text style={{
        fontFamily: theme.fontFamily.sans.regular,
        fontSize: 11.5, lineHeight: 16, color: muted, marginTop: 10,
      }}>{blurb}</Text>

      {selected && (
        <View style={{
          marginTop: 12, paddingVertical: 6, paddingHorizontal: 10,
          borderRadius: 999,
          backgroundColor: dark ? theme.colors.block.pistachio : theme.colors.ink,
          alignItems: "center",
        }}>
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 9, letterSpacing: 0.14 * 9, textTransform: "uppercase",
            color: dark ? theme.colors.ink : theme.colors.canvas,
          }}>· Selecionado ·</Text>
        </View>
      )}
    </Pressable>
  );
}

export function PlanPicker({ navigation }: Props) {
  const { top, bottom } = useSafeAreaInsets();
  const { setPlan } = useUserStore();
  const [billing, setBilling] = useState<Billing>("annual");
  const [selected, setSelected] = useState<UserPlan>("premium");

  function handleConfirm() {
    setPlan(selected);
    navigation.navigate("SignUpSuccess");
  }

  const premiumPrice = billing === "annual" ? "R$ 8,90" : "R$ 12,90";
  const premiumSub = billing === "annual" ? "/mês · cob. anual" : "/mês";

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.canvas} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: bottom + 140 }}
      >
        {/* Step header */}
        <View style={{ paddingTop: top + 18, paddingHorizontal: 18, paddingBottom: 6 }}>
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
              fontSize: 9.5, letterSpacing: 0.12 * 9.5, textTransform: "uppercase",
              color: theme.colors.muted,
            }}>3/4 · Plano</Text>
            <View style={{ width: 40 }} />
          </View>
          <StepBar current={3} total={4} />
        </View>

        {/* Title */}
        <View style={{ paddingHorizontal: 22, paddingTop: 18, gap: 8 }}>
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 9.5, letterSpacing: 0.12 * 9.5, textTransform: "uppercase",
            color: theme.colors.muted,
          }}>Escolha como começar</Text>
          <Text style={{
            fontFamily: theme.fontFamily.display.regular,
            fontSize: 42, lineHeight: 44, color: theme.colors.ink,
          }}>
            Free ou{"\n"}<Text style={{ fontStyle: "italic" }}>Premium?</Text>
          </Text>
        </View>

        {/* Billing toggle */}
        <View style={{ paddingHorizontal: 18, paddingTop: 16 }}>
          <View style={{
            flexDirection: "row",
            backgroundColor: theme.colors.surfaceSoft,
            borderRadius: 999, padding: 3,
          }}>
            {(["annual", "monthly"] as Billing[]).map((b) => (
              <Pressable
                key={b}
                onPress={() => setBilling(b)}
                style={{
                  flex: 1, height: 36, borderRadius: 999,
                  flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
                  backgroundColor: billing === b ? theme.colors.canvas : "transparent",
                  shadowColor: billing === b ? "#000" : "transparent",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: billing === b ? 0.06 : 0,
                  shadowRadius: 2,
                  elevation: billing === b ? 2 : 0,
                }}
              >
                <Text style={{
                  fontFamily: theme.fontFamily.sans.medium,
                  fontSize: 13, color: theme.colors.ink,
                }}>
                  {b === "annual" ? "Anual" : "Mensal"}
                </Text>
                {b === "annual" && (
                  <View style={{
                    backgroundColor: theme.colors.block.pistachio,
                    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999,
                  }}>
                    <Text style={{
                      fontFamily: theme.fontFamily.mono.regular,
                      fontSize: 9, letterSpacing: 0.1 * 9, textTransform: "uppercase",
                      color: theme.colors.ink,
                    }}>-30%</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Plan cards */}
        <View style={{ paddingHorizontal: 18, paddingTop: 14, flexDirection: "row", gap: 10 }}>
          <PlanCard
            selected={selected === "free"}
            onSelect={() => setSelected("free")}
            label="Free"
            price="R$ 0"
            sub="para sempre"
            blurb="O essencial para reduzir desperdício."
          />
          <PlanCard
            selected={selected === "premium"}
            onSelect={() => setSelected("premium")}
            label="Premium"
            price={premiumPrice}
            sub={premiumSub}
            blurb="IA, NFe, planejamento e casa compartilhada."
            dark
            badge="14 DIAS GRÁTIS"
          />
        </View>

        {/* Feature comparison */}
        <View style={{ paddingHorizontal: 18, paddingTop: 22 }}>
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 9.5, letterSpacing: 0.12 * 9.5, textTransform: "uppercase",
            color: theme.colors.muted, marginBottom: 10,
          }}>O que está incluído</Text>

          <View style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 18, borderWidth: 1, borderColor: theme.colors.hairline,
            overflow: "hidden",
          }}>
            {/* Table header */}
            <View style={{
              flexDirection: "row", alignItems: "center",
              paddingHorizontal: 14, paddingVertical: 12,
              backgroundColor: theme.colors.surfaceSoft,
            }}>
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular, fontSize: 9.5,
                letterSpacing: 0.12 * 9.5, textTransform: "uppercase",
                color: theme.colors.muted, flex: 1,
              }}>Recurso</Text>
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular, fontSize: 9.5,
                letterSpacing: 0.12 * 9.5, textTransform: "uppercase",
                color: theme.colors.muted, width: 44, textAlign: "center",
              }}>Free</Text>
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular, fontSize: 9.5,
                letterSpacing: 0.12 * 9.5, textTransform: "uppercase",
                color: theme.colors.ink, width: 60, textAlign: "center",
              }}>★ Premium</Text>
            </View>

            {FEATURES.map((f, i) => (
              <View key={i} style={{
                flexDirection: "row", alignItems: "center",
                paddingHorizontal: 14, paddingVertical: 12,
                borderTopWidth: 1, borderTopColor: theme.colors.hairlineSoft,
              }}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingRight: 8, gap: 6 }}>
                  <Text style={{
                    fontFamily: theme.fontFamily.sans.regular,
                    fontSize: 12.5, lineHeight: 17, color: theme.colors.ink, flex: 1,
                  }}>{f.label}</Text>
                  {f.badge && (
                    <View style={{
                      backgroundColor: theme.colors.block.pistachio,
                      paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999,
                    }}>
                      <Text style={{
                        fontFamily: theme.fontFamily.mono.regular,
                        fontSize: 8.5, letterSpacing: 0.1 * 8.5, textTransform: "uppercase",
                        color: theme.colors.ink,
                      }}>{f.badge}</Text>
                    </View>
                  )}
                </View>
                <View style={{ width: 44, alignItems: "center" }}>
                  {f.free
                    ? <Check size={14} color={theme.colors.ink} strokeWidth={2} />
                    : <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 11, color: theme.colors.muted2 }}>—</Text>
                  }
                </View>
                <View style={{ width: 60, alignItems: "center" }}>
                  {f.premium && <Check size={14} color={theme.colors.primary} strokeWidth={2} />}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Trial guarantee */}
        <View style={{ paddingHorizontal: 18, paddingTop: 14 }}>
          <View style={{
            backgroundColor: theme.colors.block.pistachio,
            borderRadius: 18, padding: 14,
            flexDirection: "row", alignItems: "center", gap: 12,
          }}>
            <View style={{
              width: 36, height: 36, borderRadius: 999,
              backgroundColor: theme.colors.ink,
              alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Sparkles size={16} color={theme.colors.block.pistachio} strokeWidth={1.6} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9.5, letterSpacing: 0.12 * 9.5, textTransform: "uppercase",
                color: theme.colors.muted,
              }}>· sem compromisso ·</Text>
              <Text style={{
                fontFamily: theme.fontFamily.sans.regular,
                fontSize: 12.5, lineHeight: 17, color: theme.colors.ink,
              }}>
                14 dias grátis · sem cobrança automática · cancele a qualquer momento
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed CTA */}
      <View style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: Math.max(bottom, 24),
        backgroundColor: theme.colors.canvas,
        borderTopWidth: 1,
        borderTopColor: theme.colors.hairlineSoft,
        gap: 10,
      }}>
        {selected === "premium" ? (
          <>
            <Pressable
              onPress={handleConfirm}
              style={({ pressed }) => ({
                height: 54, borderRadius: 999,
                backgroundColor: theme.colors.ink,
                flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
                opacity: pressed ? 0.88 : 1,
              })}
            >
              <Text style={{
                fontFamily: theme.fontFamily.sans.semiBold,
                fontSize: 16, color: theme.colors.canvas,
              }}>Começar 14 dias Premium grátis</Text>
              <ArrowRight size={18} color={theme.colors.canvas} strokeWidth={1.8} />
            </Pressable>
            <Pressable onPress={() => setSelected("free")} style={{ alignItems: "center", paddingVertical: 4 }}>
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9.5, letterSpacing: 0.12 * 9.5, textTransform: "uppercase",
                color: theme.colors.muted,
              }}>Continuar com o plano Free →</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              onPress={handleConfirm}
              style={({ pressed }) => ({
                height: 54, borderRadius: 999,
                backgroundColor: theme.colors.ink,
                flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
                opacity: pressed ? 0.88 : 1,
              })}
            >
              <Text style={{
                fontFamily: theme.fontFamily.sans.semiBold,
                fontSize: 16, color: theme.colors.canvas,
              }}>Continuar grátis</Text>
              <ArrowRight size={18} color={theme.colors.canvas} strokeWidth={1.8} />
            </Pressable>
            <Pressable onPress={() => setSelected("premium")} style={{ alignItems: "center", paddingVertical: 4 }}>
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9.5, letterSpacing: 0.12 * 9.5, textTransform: "uppercase",
                color: theme.colors.primary,
              }}>★ Experimentar 14 dias de Premium</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
