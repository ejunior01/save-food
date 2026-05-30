import React, { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { Check, Minus, Plus, Trash2 } from "lucide-react-native";

import { theme } from "@ui/styles/theme";
import { PantryItem } from "@app/types";
import { getCategoryColor } from "@app/utils/categories";

type Props = {
  item: PantryItem;
  mode: "consume" | "discard";
  onConfirm: (qty: number) => void;
  onClose: () => void;
};

export function ConsumeModal({ item, mode, onConfirm, onClose }: Props) {
  const [qty, setQty] = useState(1);
  const isConsume = mode === "consume";
  const accent = isConsume ? theme.colors.safe : theme.colors.danger;
  const accentSoft = isConsume ? theme.colors.safeSoft : theme.colors.dangerSoft;
  const removesAll = qty >= item.quantity;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(26,43,31,0.55)",
          justifyContent: "center",
          paddingHorizontal: 18,
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={undefined}
          style={{ backgroundColor: theme.colors.canvas, borderRadius: 24, padding: 22 }}
        >
          {/* Item header */}
          <View style={{ flexDirection: "row", gap: 14, marginBottom: 20, alignItems: "center" }}>
            {item.photo ? (
              <Image
                source={{ uri: item.photo }}
                style={{ width: 56, height: 56, borderRadius: 14 }}
                resizeMode="cover"
              />
            ) : (
              <View style={{
                width: 56, height: 56, borderRadius: 14,
                backgroundColor: getCategoryColor(item.category),
                alignItems: "center", justifyContent: "center",
              }}>
                <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
              </View>
            )}
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9,
                letterSpacing: 0.12 * 9,
                textTransform: "uppercase",
                color: theme.colors.muted,
              }}>
                {isConsume ? "Quantidade consumida" : "Quantidade a descartar"}
              </Text>
              <Text style={{
                fontFamily: theme.fontFamily.display.regular,
                fontSize: 20,
                color: theme.colors.ink,
                lineHeight: 24,
              }} numberOfLines={1}>{item.name}</Text>
              <Text style={{
                fontFamily: theme.fontFamily.sans.regular,
                fontSize: 12,
                color: theme.colors.muted,
              }}>
                {item.quantity} {item.unit} disponível
              </Text>
            </View>
          </View>

          {/* Counter */}
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            backgroundColor: accentSoft,
            borderRadius: 18,
            paddingVertical: 18,
            marginBottom: 14,
          }}>
            <Pressable
              onPress={() => setQty(q => Math.max(1, q - 1))}
              style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: theme.colors.surface,
                borderWidth: 1, borderColor: theme.colors.hairline,
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Minus size={18} color={theme.colors.ink} strokeWidth={2} />
            </Pressable>

            <View style={{ alignItems: "center", minWidth: 80 }}>
              <Text style={{
                fontFamily: theme.fontFamily.display.regular,
                fontSize: 42,
                color: theme.colors.ink,
                lineHeight: 46,
              }}>{qty}</Text>
              <Text style={{
                fontFamily: theme.fontFamily.sans.regular,
                fontSize: 11,
                color: theme.colors.muted,
              }}>{item.unit}</Text>
            </View>

            <Pressable
              onPress={() => setQty(q => Math.min(item.quantity, q + 1))}
              style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: theme.colors.surface,
                borderWidth: 1, borderColor: theme.colors.hairline,
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Plus size={18} color={theme.colors.ink} strokeWidth={2} />
            </Pressable>
          </View>

          {removesAll && (
            <Text style={{
              fontFamily: theme.fontFamily.sans.regular,
              fontSize: 12,
              color: theme.colors.muted,
              textAlign: "center",
              marginBottom: 12,
            }}>
              O alimento será removido da despensa
            </Text>
          )}

          {/* Confirm */}
          <Pressable
            onPress={() => onConfirm(qty)}
            style={({ pressed }) => ({
              height: 54,
              borderRadius: 16,
              backgroundColor: accent,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 10,
              opacity: pressed ? 0.88 : 1,
            })}
          >
            {isConsume
              ? <Check size={18} color="#fff" strokeWidth={2.5} />
              : <Trash2 size={18} color="#fff" strokeWidth={1.8} />
            }
            <Text style={{
              fontFamily: theme.fontFamily.sans.semiBold,
              fontSize: 15,
              color: "#fff",
            }}>
              {isConsume ? `Consumir ${qty} ${item.unit}` : `Descartar ${qty} ${item.unit}`}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
