import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  Calendar,
  Camera,
  Check,
  ChevronRight,
  Eye,
  Minus,
  Plus,
  RefreshCw,
  Settings,
  Sparkles,
  X,
} from "lucide-react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";

import { VisionRecognitionService } from "@app/services/VisionRecognitionService";
import { theme } from "@ui/styles/theme";
import { useCreatePantryItems } from "@app/hooks/mutations/useCreatePantryItem";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "@app/stores/userStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScanState = "aiming" | "scanning" | "detected";

interface IDetectedItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  cat: string;
  emoji: string;
  conf: number;
  validityDays: number;
  locationId: LocationId;
  box: { x: number; y: number; w: number; h: number };
}

type LocationId = "loc_fridge" | "loc_pantry" | "loc_freezer";

const CATEGORIES = ["Frutas", "Legumes", "Vegetais"] as const;
const UNITS = ["un", "g", "kg"] as const;
const LOCATIONS: Array<{ id: LocationId; label: string; icon: string }> = [
  { id: "loc_fridge", label: "Geladeira", icon: "🧊" },
  { id: "loc_pantry", label: "Despensa", icon: "🗄️" },
  { id: "loc_freezer", label: "Freezer", icon: "❄️" },
];

function randomBox(index: number) {
  const col = index % 2;
  const row = Math.floor(index / 2);
  return { x: 8 + col * 46, y: 20 + row * 28, w: 28, h: 22 };
}

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

function BoundingBox({ box, label, conf }: { box: IDetectedItem["box"]; label: string; conf: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1, duration: 300, easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  const color = theme.colors.block.pistachio;

  const corners = [
    { top: -2, left: -2, borderTopWidth: 2.5, borderLeftWidth: 2.5 },
    { top: -2, right: -2, borderTopWidth: 2.5, borderRightWidth: 2.5 },
    { bottom: -2, left: -2, borderBottomWidth: 2.5, borderLeftWidth: 2.5 },
    { bottom: -2, right: -2, borderBottomWidth: 2.5, borderRightWidth: 2.5 },
  ] as const;

  return (
    <Animated.View style={{
      position: "absolute",
      left: `${box.x}%` as any,
      top: `${box.y}%` as any,
      width: `${box.w}%` as any,
      height: `${box.h}%` as any,
      opacity: anim,
    }}>
      {corners.map((c, i) => (
        <View key={i} style={{
          position: "absolute", width: 14, height: 14,
          borderColor: color, borderStyle: "solid",
          borderTopWidth: 0, borderBottomWidth: 0,
          borderLeftWidth: 0, borderRightWidth: 0,
          ...c,
        }} />
      ))}
      <View style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(213,226,168,0.10)", borderRadius: 4,
      }} />
      <View style={{
        position: "absolute", left: -2, top: -26,
        backgroundColor: color,
        paddingHorizontal: 8, paddingVertical: 3,
        borderRadius: 6,
        flexDirection: "row", alignItems: "center", gap: 4,
      }}>
        <Check size={10} color={theme.colors.ink} strokeWidth={2.5} />
        <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 11, color: theme.colors.ink }}>
          {label}
        </Text>
        <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 10, color: "rgba(26,43,31,0.65)" }}>
          · {Math.round(conf * 100)}%
        </Text>
      </View>
    </Animated.View>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <Pressable
        onPress={() => onChange(Math.max(1, value - 1))}
        style={({ pressed }) => ({
          width: 28, height: 28, borderRadius: 999,
          backgroundColor: theme.colors.surfaceSoft,
          alignItems: "center", justifyContent: "center",
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Minus size={12} color={theme.colors.ink} strokeWidth={2} />
      </Pressable>
      <Text style={{ fontFamily: theme.fontFamily.display.italic, fontSize: 18, color: theme.colors.ink, minWidth: 22, textAlign: "center" }}>
        {value}
      </Text>
      <Pressable
        onPress={() => onChange(Math.min(99, value + 1))}
        style={({ pressed }) => ({
          width: 28, height: 28, borderRadius: 999,
          backgroundColor: theme.colors.surfaceSoft,
          alignItems: "center", justifyContent: "center",
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Plus size={12} color={theme.colors.ink} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

function AimRing() {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.04, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View style={{
      position: "absolute",
      left: "50%", top: "45%",
      marginLeft: -120, marginTop: -120,
      width: 240, height: 240,
      transform: [{ scale: pulse }],
    }}>
      <View style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: theme.colors.block.pistachio,
        shadowColor: theme.colors.block.pistachio,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.45,
        shadowRadius: 14,
      }} />
      <Text style={{
        position: "absolute", bottom: -28, left: 0, right: 0, textAlign: "center",
        fontFamily: theme.fontFamily.mono.regular,
        fontSize: 9.5, letterSpacing: 0.16 * 9.5, textTransform: "uppercase",
        color: theme.colors.block.pistachio,
      }}>· Aproximando ·</Text>
    </Animated.View>
  );
}

function DetectedSheet({
  items,
  setItems,
  onSave,
  isSaving,
  onRescan,
}: {
  items: IDetectedItem[];
  setItems: (items: IDetectedItem[]) => void;
  onSave: () => void;
  isSaving: boolean;
  onRescan: () => void;
}) {
  const { bottom } = useSafeAreaInsets();
  const avgConf = items.reduce((a, i) => a + i.conf, 0) / Math.max(items.length, 1);

  function updateItem(id: string, updates: Partial<IDetectedItem>) {
    setItems(items.map(i => i.id === id ? { ...i, ...updates } : i));
  }

  function remove(id: string) {
    setItems(items.filter(i => i.id !== id));
  }

  function renderItem({ item }: { item: IDetectedItem }) {
    return (
      <View style={{
        backgroundColor: theme.colors.surface,
        padding: 12, borderRadius: 18,
        borderWidth: 1, borderColor: theme.colors.hairline,
        gap: 10,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{
            width: 46, height: 46, borderRadius: 14,
            backgroundColor: item.cat === "Frutas" ? theme.colors.block.peach : theme.colors.block.pistachio,
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <TextInput
                value={item.name}
                onChangeText={(name) => updateItem(item.id, { name })}
                placeholder="Nome"
                placeholderTextColor={theme.colors.muted2}
                style={{
                  flex: 1,
                  fontFamily: theme.fontFamily.sans.medium,
                  fontSize: 15,
                  color: theme.colors.ink,
                  paddingVertical: 0,
                }}
              />
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9,
                color: item.conf > 0.9 ? theme.colors.safe : theme.colors.soon,
              }}>
                {Math.round(item.conf * 100)}%
              </Text>
            </View>
            <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 11.5, color: theme.colors.muted }}>
              Revise antes de adicionar ao inventário
            </Text>
          </View>
          <Pressable
            onPress={() => remove(item.id)}
            style={({ pressed }) => ({
              width: 30, height: 30, borderRadius: 999,
              alignItems: "center", justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <X size={14} color={theme.colors.muted} strokeWidth={1.8} />
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 8.5,
              letterSpacing: 0.12 * 8.5,
              textTransform: "uppercase",
              color: theme.colors.muted,
              marginBottom: 5,
            }}>quantidade</Text>
            <Stepper value={item.qty} onChange={qty => updateItem(item.id, { qty })} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 8.5,
              letterSpacing: 0.12 * 8.5,
              textTransform: "uppercase",
              color: theme.colors.muted,
              marginBottom: 5,
            }}>unidade</Text>
            <View style={{ flexDirection: "row", gap: 4 }}>
              {UNITS.map(unit => (
                <Pressable
                  key={unit}
                  onPress={() => updateItem(item.id, { unit })}
                  style={{
                    flex: 1,
                    height: 28,
                    borderRadius: 999,
                    backgroundColor: item.unit === unit ? theme.colors.ink : theme.colors.surfaceSoft,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{
                    fontFamily: theme.fontFamily.sans.medium,
                    fontSize: 11,
                    color: item.unit === unit ? theme.colors.canvas : theme.colors.ink,
                  }}>{unit}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 6 }}>
          {CATEGORIES.map(cat => (
            <Pressable
              key={cat}
              onPress={() => updateItem(item.id, { cat })}
              style={{
                flex: 1,
                height: 30,
                borderRadius: 999,
                backgroundColor: item.cat === cat ? theme.colors.block.pistachio : theme.colors.surfaceSoft,
                borderWidth: item.cat === cat ? 1 : 0,
                borderColor: theme.colors.hairline,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 11, color: theme.colors.ink }}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 8.5,
              letterSpacing: 0.12 * 8.5,
              textTransform: "uppercase",
              color: theme.colors.muted,
              marginBottom: 5,
            }}>validade em dias</Text>
            <TextInput
              value={String(item.validityDays)}
              onChangeText={(value) => {
                const validityDays = Math.max(1, Number(value.replace(/\D/g, "")) || 1);
                updateItem(item.id, { validityDays });
              }}
              keyboardType="number-pad"
              style={{
                height: 36,
                borderRadius: 12,
                backgroundColor: theme.colors.surfaceSoft,
                paddingHorizontal: 12,
                fontFamily: theme.fontFamily.sans.medium,
                fontSize: 13,
                color: theme.colors.ink,
              }}
            />
          </View>
          <View style={{ flex: 1.4 }}>
            <Text style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 8.5,
              letterSpacing: 0.12 * 8.5,
              textTransform: "uppercase",
              color: theme.colors.muted,
              marginBottom: 5,
            }}>local</Text>
            <View style={{ flexDirection: "row", gap: 4 }}>
              {LOCATIONS.map(location => (
                <Pressable
                  key={location.id}
                  onPress={() => updateItem(item.id, { locationId: location.id })}
                  style={{
                    flex: 1,
                    height: 36,
                    borderRadius: 12,
                    backgroundColor: item.locationId === location.id ? theme.colors.ink : theme.colors.surfaceSoft,
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Text style={{ fontSize: 12 }}>{location.icon}</Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      fontFamily: theme.fontFamily.sans.medium,
                      fontSize: 9.5,
                      color: item.locationId === location.id ? theme.colors.canvas : theme.colors.ink,
                    }}
                  >
                    {location.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{
      position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 8,
      backgroundColor: theme.colors.canvas,
      borderTopLeftRadius: 28, borderTopRightRadius: 28,
      maxHeight: "74%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -20 },
      shadowOpacity: 0.4,
      shadowRadius: 50,
      elevation: 20,
    }}>
      <View style={{ padding: 14, paddingBottom: 0 }}>
        <View style={{ width: 38, height: 4, backgroundColor: theme.colors.hairline, borderRadius: 999, alignSelf: "center", marginBottom: 12 }} />

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <View style={{ gap: 2 }}>
            <Eyebrow>· revisar candidatos ·</Eyebrow>
            <Text style={{ fontFamily: theme.fontFamily.display.regular, fontSize: 22, color: theme.colors.ink, lineHeight: 26 }}>
              {items.length} para confirmar
            </Text>
          </View>
          <View style={{ alignItems: "flex-end", gap: 2 }}>
            <Text style={{ fontFamily: theme.fontFamily.display.italic, fontSize: 24, color: theme.colors.ink, lineHeight: 28 }}>
              {Math.round(avgConf * 100)}%
            </Text>
            <Text style={{
              fontFamily: theme.fontFamily.mono.regular, fontSize: 9,
              letterSpacing: 0.12 * 9, textTransform: "uppercase", color: theme.colors.muted,
            }}>confiança média</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ paddingHorizontal: 14, gap: 10, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      <View style={{ flexDirection: "row", gap: 10, padding: 14, paddingBottom: bottom + 14 }}>
        <Pressable
          onPress={onRescan}
          style={({ pressed }) => ({
            height: 50, paddingHorizontal: 18, borderRadius: 999,
            backgroundColor: theme.colors.surface,
            borderWidth: 1, borderColor: theme.colors.hairline,
            flexDirection: "row", alignItems: "center", gap: 8,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <RefreshCw size={14} color={theme.colors.ink} strokeWidth={1.6} />
          <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 14, color: theme.colors.ink }}>Refazer</Text>
        </Pressable>
        <Pressable
          onPress={onSave}
          disabled={isSaving || items.length === 0}
          style={({ pressed }) => ({
            flex: 1, height: 50, borderRadius: 999,
            backgroundColor: theme.colors.ink,
            flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
            opacity: pressed || isSaving || items.length === 0 ? 0.72 : 1,
          })}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={theme.colors.canvas} />
          ) : (
            <>
              <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 15, color: theme.colors.canvas }}>
                Salvar {items.length} no inventário
              </Text>
              <Check size={18} color={theme.colors.canvas} strokeWidth={1.8} />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function FeatureRow({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
      <View style={{
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: "rgba(213,226,168,0.18)",
        alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </View>
      <View style={{ paddingTop: 4, gap: 2, flex: 1 }}>
        <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 14, color: theme.colors.canvas }}>
          {title}
        </Text>
        <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 12, color: "rgba(250,245,235,0.65)" }}>
          {sub}
        </Text>
      </View>
    </View>
  );
}

function GateBox({ box, label, conf, color }: {
  box: { x: number; y: number; w: number; h: number };
  label: string;
  conf: number;
  color: string;
}) {
  const corners = [
    { top: -2, left: -2, borderTopWidth: 2, borderLeftWidth: 2 },
    { top: -2, right: -2, borderTopWidth: 2, borderRightWidth: 2 },
    { bottom: -2, left: -2, borderBottomWidth: 2, borderLeftWidth: 2 },
    { bottom: -2, right: -2, borderBottomWidth: 2, borderRightWidth: 2 },
  ] as const;
  return (
    <View style={{
      position: "absolute",
      left: `${box.x}%` as any, top: `${box.y}%` as any,
      width: `${box.w}%` as any, height: `${box.h}%` as any,
    }}>
      {corners.map((c, i) => (
        <View key={i} style={{
          position: "absolute", width: 12, height: 12,
          borderColor: color, borderStyle: "solid",
          borderTopWidth: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderRightWidth: 0,
          ...c,
        }} />
      ))}
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(213,226,168,0.08)", borderRadius: 3 }} />
      <View style={{
        position: "absolute", left: -0, top: -26, right: -54,
        backgroundColor: color,
        paddingHorizontal: 6, paddingVertical: 2,
        borderRadius: 5,
        flexDirection: "row", alignItems: "center", gap: 3,
      }}>
        <Check size={9} color={theme.colors.ink} strokeWidth={2.5} />
        <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 10, color: theme.colors.ink }}>
          {label}
        </Text>
        <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 9.5, color: "rgba(26,43,31,0.6)" }}>
          · {Math.round(conf * 100)}%
        </Text>
      </View>
    </View>
  );
}

function PremiumGate({ onClose }: { onClose: () => void }) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.ink }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.ink} />
      <View style={{ position: "absolute", top: 56, left: 138, right: 0, height: 280, overflow: "hidden" }}>
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: theme.colors.ink }} />
        <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, backgroundColor: theme.colors.ink, opacity: 0.95 }} />
        <View style={{ position: "absolute", top: "18%", left: "16%", right: "14%", bottom: "12%" }}>
          <GateBox box={{ x: 45, y: 0, w: 30, h: 28 }} label="Banana · 5" conf={0.94} color={theme.colors.block.peach} />
          <GateBox box={{ x: 62, y: 38, w: 26, h: 30 }} label="Alface · 1" conf={0.92} color={theme.colors.block.pistachio} />
        </View>
        <Text style={{ position: "absolute", top: "20%", left: "46%", fontSize: 28, opacity: 0.6 }}>🍌</Text>
        <Text style={{ position: "absolute", top: "52%", left: "62%", fontSize: 26, opacity: 0.55 }}>🥬</Text>
      </View>
      <View style={{
        position: "absolute", top: top + 14, left: 16, right: 16,
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        zIndex: 5,
      }}>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => ({
            width: 40, height: 40, borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.15)",
            alignItems: "center", justifyContent: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <X size={18} color={theme.colors.canvas} strokeWidth={1.6} />
        </Pressable>
        <Text style={{
          fontFamily: theme.fontFamily.mono.regular,
          fontSize: 9.5, letterSpacing: 0.12 * 9.5, textTransform: "uppercase",
          color: "rgba(250,245,235,0.65)",
        }}>Recurso Premium</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={{ height: 100 }} />
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 10 }}>
        <View style={{
          flexDirection: "row", alignItems: "center", gap: 6,
          backgroundColor: theme.colors.block.pistachio,
          alignSelf: "flex-start",
          paddingHorizontal: 10, paddingVertical: 5,
          borderRadius: 999, marginBottom: 12,
        }}>
          <Sparkles size={12} color={theme.colors.ink} strokeWidth={1.6} />
          <Text style={{ fontFamily: theme.fontFamily.mono.regular, fontSize: 9, letterSpacing: 0.12 * 9, textTransform: "uppercase", color: theme.colors.ink }}>Premium</Text>
        </View>

        <Text style={{
          fontFamily: theme.fontFamily.display.regular,
          fontSize: 42, color: theme.colors.canvas,
          lineHeight: 44, marginBottom: 10,
        }}>
          Aponte. A IA{"\n"}<Text style={{ fontStyle: "italic", color: theme.colors.block.pistachio }}>reconhece.</Text>
        </Text>
        <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 14, color: "rgba(250,245,235,0.75)", lineHeight: 20, marginBottom: 22 }}>
          Aponte a câmera para suas frutas, legumes e verduras. A gente identifica o que é, conta a quantidade e sugere a validade.
        </Text>
        <View style={{ gap: 10 }}>
          <FeatureRow
            icon={<Sparkles size={16} color={theme.colors.block.pistachio} strokeWidth={1.6} />}
            title="Reconhece dezenas de alimentos"
            sub="Frutas, legumes e verduras frescos"
          />
          <FeatureRow
            icon={<Eye size={16} color={theme.colors.block.pistachio} strokeWidth={1.6} />}
            title="Conta a quantidade"
            sub="Detecta múltiplos alimentos na foto"
          />
          <FeatureRow
            icon={<Calendar size={16} color={theme.colors.block.pistachio} strokeWidth={1.6} />}
            title="Sugere validade automática"
            sub="Baseada na categoria e estado"
          />
          <FeatureRow
            icon={<Camera size={16} color={theme.colors.block.pistachio} strokeWidth={1.6} />}
            title="Funciona com a foto da sacola"
            sub="Direto do mercado, sem cadastrar 1 a 1"
          />
        </View>
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: bottom + 24, paddingTop: 18 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
          <View style={{ gap: 2 }}>
            <Text style={{ fontFamily: theme.fontFamily.mono.regular, fontSize: 9.5, letterSpacing: 0.12 * 9.5, textTransform: "uppercase", color: "rgba(250,245,235,0.6)" }}>
              Premium · anual
            </Text>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
              <Text style={{ fontFamily: theme.fontFamily.display.italic, fontSize: 32, color: theme.colors.canvas }}>R$ 8,90</Text>
              <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 13, color: "rgba(250,245,235,0.55)" }}>/mês</Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={onClose}
          style={({ pressed }) => ({
            height: 54, borderRadius: 999,
            backgroundColor: theme.colors.block.pistachio,
            flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
            opacity: pressed ? 0.85 : 1,
            marginBottom: 6,
            marginTop: 6,
          })}
        >
          <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 15, color: theme.colors.ink }}>
            Experimentar 14 dias grátis
          </Text>
          <ChevronRight size={18} color={theme.colors.ink} strokeWidth={1.8} />
        </Pressable>
        <Text style={{
          fontFamily: theme.fontFamily.mono.regular, fontSize: 9, letterSpacing: 0.12 * 9,
          textTransform: "uppercase", color: "rgba(250,245,235,0.5)",
          textAlign: "center", marginTop: 10,
        }}>
          Cancele a qualquer momento · sem renovação automática
        </Text>
      </View>
    </View>
  );
}

export function AIRecognize() {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { plan } = useUserStore();
  const isPremium = plan === "premium";
  const { createPantryItems, isLoading: isSaving } = useCreatePantryItems();

  const [state, setState] = useState<ScanState>("aiming");
  const [items, setItems] = useState<IDetectedItem[]>([]);

  const scanProgress = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  async function startScan() {
    if (!cameraRef.current) { return; };
    setState("scanning");
    scanProgress.setValue(0);
    Animated.timing(scanProgress, {
      toValue: 1, duration: 1600, easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.6 });
      if (!photo?.base64) { throw new Error("no_photo"); }

      const foods = await VisionRecognitionService.recognizeFoods(photo.base64);

      if (foods.length === 0) {
        setState("aiming");
        Alert.alert("Nenhum alimento encontrado", "Aproxime a câmera e tente novamente.");
        return;
      }

      setItems(foods.map((f, i) => ({
        id: String(i),
        name: f.name,
        qty: f.qty,
        unit: f.unit,
        cat: f.cat,
        emoji: f.emoji,
        conf: f.conf,
        validityDays: f.validityDays ?? 7,
        locationId: "loc_fridge",
        box: randomBox(i),
      })));
      setState("detected");
    } catch (error) {
      setState("aiming");
      const message = error instanceof Error && error.message === "missing_openai_api_key"
        ? "A chave da OpenAI não está configurada para este app."
        : error instanceof Error && error.message === "openai_quota_exceeded"
          ? "O limite da API da OpenAI foi atingido. Verifique a cota ou o billing da conta."
          : error instanceof Error && error.message === "openai_api_key_rejected"
            ? "A chave da OpenAI foi recusada. Verifique se ela está ativa."
            : error instanceof Error && error.message === "openai_timeout"
              ? "A análise demorou mais que o esperado. Tente novamente com uma foto mais próxima."
              : error instanceof Error && error.message === "invalid_ai_json"
                ? "A IA respondeu em um formato inesperado. Tente uma foto mais próxima."
                : "Verifique sua conexão e tente novamente.";
      Alert.alert("Erro no reconhecimento", message);
    }
  }

  function rescan() {
    setItems([]);
    setState("aiming");
  }

  function createExpiryDate(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + Math.max(1, days));
    return date;
  }

  async function saveRecognizedItems() {
    const validItems = items
      .map(item => ({
        ...item,
        name: item.name.trim(),
      }))
      .filter(item => item.name.length > 0);

    if (validItems.length === 0) {
      Alert.alert("Revise os alimentos", "Mantenha pelo menos um alimento com nome para salvar.");
      return;
    }

    try {
      await createPantryItems(validItems.map(item => ({
        name: item.name,
        quantity: item.qty,
        unit: item.unit,
        category: item.cat,
        emoji: item.emoji,
        locationId: item.locationId,
        expiresAt: createExpiryDate(item.validityDays),
      })));
      navigation.goBack();
    } catch {
      Alert.alert("Erro ao salvar", "Não foi possível adicionar os alimentos ao inventário.");
    }
  }

  if (!isPremium) {
    return <PremiumGate onClose={() => navigation.goBack()} />;
  }

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: "#0a0f0c" }} />;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0a0f0c", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0f0c" />
        <View style={{
          width: 72, height: 72, borderRadius: 36,
          backgroundColor: "rgba(255,255,255,0.12)",
          alignItems: "center", justifyContent: "center", marginBottom: 20,
        }}>
          <Camera size={32} color={theme.colors.canvas} strokeWidth={1.4} />
        </View>
        <Text style={{
          fontFamily: theme.fontFamily.display.regular, fontSize: 26,
          color: theme.colors.canvas, textAlign: "center", marginBottom: 10,
        }}>Acesso à câmera</Text>
        <Text style={{
          fontFamily: theme.fontFamily.sans.regular, fontSize: 14,
          color: "rgba(250,245,235,0.7)", textAlign: "center", lineHeight: 20, marginBottom: 28,
        }}>
          Necessário para identificar alimentos frescos com IA.
        </Text>
        <Pressable
          onPress={requestPermission}
          style={({ pressed }) => ({
            height: 52, paddingHorizontal: 28, borderRadius: 999,
            backgroundColor: theme.colors.block.pistachio,
            alignItems: "center", justifyContent: "center",
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ fontFamily: theme.fontFamily.sans.semiBold, fontSize: 15, color: theme.colors.ink }}>
            Permitir câmera
          </Text>
        </Pressable>
        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 14, color: "rgba(250,245,235,0.55)" }}>
            Voltar
          </Text>
        </Pressable>
      </View>
    );
  }

  const titleText = state === "detected"
    ? `${items.length} alimentos\nidentificados.`
    : state === "scanning"
      ? "Identificando\nalimentos…"
      : "Aponte para suas\nfrutas e verduras.";

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0f0c" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f0c" />
      <CameraView
        ref={cameraRef}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        facing="back"
      />
      <View style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.30)",
      }} />
      <View style={{
        position: "absolute", top: top + 14, left: 16, right: 16,
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        zIndex: 5,
      }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => ({
            width: 40, height: 40, borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.15)",
            alignItems: "center", justifyContent: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <X size={18} color={theme.colors.canvas} strokeWidth={1.6} />
        </Pressable>
        <View style={{
          flexDirection: "row", alignItems: "center", gap: 6,
          backgroundColor: theme.colors.ink,
          paddingHorizontal: 10, paddingVertical: 5,
          borderRadius: 999,
          borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
        }}>
          <Sparkles size={12} color={theme.colors.block.pistachio} strokeWidth={1.6} />
          <Text style={{ fontFamily: theme.fontFamily.mono.regular, fontSize: 9, letterSpacing: 0.12 * 9, textTransform: "uppercase", color: theme.colors.canvas }}>
            IA · Premium
          </Text>
        </View>
        <Pressable style={({ pressed }) => ({
          width: 40, height: 40, borderRadius: 999,
          backgroundColor: "rgba(255,255,255,0.15)",
          alignItems: "center", justifyContent: "center",
          opacity: pressed ? 0.7 : 1,
        })}>
          <Settings size={18} color={theme.colors.canvas} strokeWidth={1.6} />
        </Pressable>
      </View>

      {/* Title */}
      <View style={{ position: "absolute", top: top + 80, left: 24, right: 24, zIndex: 5 }}>
        <Eyebrow dark>· visão computacional ·</Eyebrow>
        <Text style={{
          fontFamily: theme.fontFamily.display.regular,
          fontSize: 30, color: theme.colors.canvas,
          lineHeight: 34, marginTop: 8,
        }}>
          {state === "detected"
            ? <Text><Text style={{ color: theme.colors.block.pistachio }}>{items.length}</Text>{" alimentos\nidentificados."}</Text>
            : titleText
          }
        </Text>
      </View>
      {(state === "scanning" || state === "detected") && (
        <View style={{
          position: "absolute", top: 150, left: 24, right: 24, bottom: 280,
          zIndex: 3,
        }}>
          {items.map((it) => (
            <BoundingBox
              key={it.id}
              box={it.box}
              label={`${it.name} · ${it.qty}`}
              conf={it.conf}
            />
          ))}
        </View>
      )}
      {state === "aiming" && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
          <AimRing />
        </View>
      )}
      {state === "scanning" && (
        <View style={{
          position: "absolute", left: 24, right: 24, top: 200, zIndex: 5,
          backgroundColor: "rgba(10,15,12,0.75)",
          borderRadius: 14, padding: 14,
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: theme.colors.block.pistachio }} />
            <Text style={{ flex: 1, fontFamily: theme.fontFamily.mono.regular, fontSize: 9.5, letterSpacing: 0.16 * 9.5, textTransform: "uppercase", color: theme.colors.canvas }}>
              · Analisando imagem ·
            </Text>
            <Text style={{ fontFamily: theme.fontFamily.display.italic, fontSize: 18, color: theme.colors.block.pistachio }}>
              {items.length}
            </Text>
          </View>
          <View style={{ height: 3, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 999, marginTop: 8, overflow: "hidden" }}>
            <Animated.View style={{
              height: "100%",
              width: scanProgress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "76%"] }),
              backgroundColor: theme.colors.block.pistachio,
              borderRadius: 999,
            }} />
          </View>
        </View>
      )}

      {state === "aiming" && (
        <>
          <View style={{
            position: "absolute", left: 0, right: 0, bottom: 200, zIndex: 5,
            alignItems: "center",
          }}>
            <View style={{
              flexDirection: "row", alignItems: "center", gap: 6,
              backgroundColor: "rgba(0,0,0,0.55)",
              paddingHorizontal: 14, paddingVertical: 8,
              borderRadius: 999,
            }}>
              <Sparkles size={12} color={theme.colors.block.pistachio} strokeWidth={1.6} />
              <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 13, color: theme.colors.canvas }}>
                Frutas, legumes e verduras
              </Text>
            </View>
          </View>
          <View style={{
            position: "absolute", left: 0, right: 0, bottom: 80, zIndex: 5,
            alignItems: "center",
          }}>
            <Pressable
              onPress={startScan}
              style={({ pressed }) => ({
                width: 74, height: 74, borderRadius: 999,
                backgroundColor: theme.colors.canvas,
                borderWidth: 4, borderColor: "rgba(255,255,255,0.35)",
                alignItems: "center", justifyContent: "center",
                shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 24,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <View style={{ width: 54, height: 54, borderRadius: 999, backgroundColor: theme.colors.ink }} />
            </Pressable>
          </View>
        </>
      )}
      {state === "detected" && (
        <DetectedSheet
          items={items}
          setItems={setItems}
          onSave={saveRecognizedItems}
          isSaving={isSaving}
          onRescan={rescan}
        />
      )}
    </View>
  );
}
