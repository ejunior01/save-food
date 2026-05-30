import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { ArrowLeft, Check, ShoppingCart } from "lucide-react-native";

import { theme } from "@ui/styles/theme";
import { useAppData, getDaysUntilExpiry } from "@app/context/AppDataContext";
import { getCategoryColor } from "@app/utils/categories";
import { PantryItem } from "@app/types";
import { useCreateShoppingItem } from "@app/hooks/mutations/useCreateShoppingItem";
import { AppStackParamList } from "@app/navigation/types";

type RouteType = RouteProp<AppStackParamList, "Replenishment">;

function ItemRow({
  item,
  selected,
  onToggle,
}: {
  item: PantryItem;
  selected: boolean;
  onToggle: () => void;
}) {
  const days = getDaysUntilExpiry(item.expiresAt);
  const isExpired = days <= 0;

  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        backgroundColor: theme.colors.surface,
        padding: 12,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: selected ? theme.colors.ink : theme.colors.hairline,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      {/* Checkbox */}
      <View style={{
        width: 26, height: 26, borderRadius: 8,
        backgroundColor: selected ? theme.colors.ink : "transparent",
        borderWidth: selected ? 0 : 1.5,
        borderColor: theme.colors.hairline,
        alignItems: "center", justifyContent: "center",
      }}>
        {selected && <Check size={14} color={theme.colors.canvas} strokeWidth={2.5} />}
      </View>

      {/* Thumbnail */}
      {item.photo ? (
        <Image
          source={{ uri: item.photo }}
          style={{ width: 48, height: 48, borderRadius: 12 }}
          resizeMode="cover"
        />
      ) : (
        <View style={{
          width: 48, height: 48, borderRadius: 12,
          backgroundColor: getCategoryColor(item.category),
          alignItems: "center", justifyContent: "center",
        }}>
          <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
        </View>
      )}

      {/* Info */}
      <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
        <Text style={{
          fontFamily: theme.fontFamily.sans.medium,
          fontSize: 15,
          color: theme.colors.ink,
        }} numberOfLines={1}>{item.name}</Text>
        <Text style={{
          fontFamily: theme.fontFamily.sans.regular,
          fontSize: 12,
          color: theme.colors.muted,
        }}>
          {item.category} · {item.quantity} {item.unit} restante
        </Text>
      </View>

      {/* Status badge */}
      <View style={{
        paddingHorizontal: 9, paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: isExpired ? theme.colors.dangerSoft : theme.colors.soonSoft,
      }}>
        <Text style={{
          fontFamily: theme.fontFamily.mono.regular,
          fontSize: 9.5,
          letterSpacing: 0.08 * 9.5,
          color: isExpired ? theme.colors.danger : theme.colors.soon,
        }}>
          {isExpired ? "VENCIDO" : "BAIXO"}
        </Text>
      </View>
    </Pressable>
  );
}

export function Replenishment() {
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteType>();
  const { pantryItems } = useAppData();
  const { createShoppingItem, isLoading } = useCreateShoppingItem();

  const candidates = useMemo(() => {
    const expired = pantryItems.filter((i) => getDaysUntilExpiry(i.expiresAt) <= 0);
    const low = pantryItems.filter(
      (i) => getDaysUntilExpiry(i.expiresAt) > 0 && i.quantity <= 2,
    );
    const expiredIds = new Set(expired.map((i) => i.id));
    return [...expired, ...low.filter((i) => !expiredIds.has(i.id))];
  }, [pantryItems]);

  const [selected, setSelected] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (route.params?.itemId) {s.add(route.params.itemId);}
    return s;
  });

  const groups = useMemo(() => {
    const g: Record<string, PantryItem[]> = {};
    candidates.forEach((item) => {
      if (!g[item.category]) {g[item.category] = [];}
      g[item.category].push(item);
    });
    return g;
  }, [candidates]);

  function toggleItem(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {next.delete(id);}
      else {next.add(id);}
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(candidates.map((i) => i.id)));
  }

  async function addToList() {
    const items = candidates.filter((i) => selected.has(i.id));
    await Promise.all(
      items.map((item) =>
        createShoppingItem({
          name: item.name,
          quantity: 1,
          unit: item.unit,
          category: item.category,
          checked: false,
          source: "replenishment",
        }),
      ),
    );
    navigation.goBack();
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.canvas} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottom + 100 }}>
        {/* Header */}
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
          }}>Lista de reposição</Text>
          <Pressable
            onPress={selectAll}
            style={{
              height: 40, paddingHorizontal: 14,
              borderRadius: 999,
              borderWidth: 1, borderColor: theme.colors.hairline,
              backgroundColor: theme.colors.surface,
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Text style={{
              fontFamily: theme.fontFamily.sans.medium,
              fontSize: 13,
              color: theme.colors.ink,
            }}>Selec. todos</Text>
          </Pressable>
        </View>

        {/* Hero */}
        <View style={{ paddingHorizontal: 18, paddingTop: 10, paddingBottom: 6 }}>
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 9.5,
            letterSpacing: 0.12 * 9.5,
            textTransform: "uppercase",
            color: theme.colors.muted,
          }}>Reposição</Text>
          <Text style={{
            fontFamily: theme.fontFamily.display.regular,
            fontSize: 38,
            color: theme.colors.ink,
            marginTop: 6,
            marginBottom: 10,
            lineHeight: 42,
          }}>
            O que <Text style={{ fontStyle: "italic" }}>repor.</Text>
          </Text>
          <Text style={{
            fontFamily: theme.fontFamily.sans.regular,
            fontSize: 14,
            color: theme.colors.muted,
            marginBottom: 14,
            lineHeight: 20,
          }}>
            Alimentos vencidos ou com quantidade baixa. Selecione e adicione à lista de compras.
          </Text>
        </View>

        {/* Empty state */}
        {candidates.length === 0 && (
          <View style={{ paddingHorizontal: 18, paddingTop: 40, alignItems: "center", gap: 12 }}>
            <View style={{
              width: 64, height: 64, borderRadius: 32,
              backgroundColor: theme.colors.block.pistachio,
              alignItems: "center", justifyContent: "center",
            }}>
              <Text style={{ fontSize: 28 }}>✅</Text>
            </View>
            <Text style={{
              fontFamily: theme.fontFamily.display.regular,
              fontSize: 22,
              color: theme.colors.ink,
              textAlign: "center",
            }}>Despensa em dia!</Text>
            <Text style={{
              fontFamily: theme.fontFamily.sans.regular,
              fontSize: 14,
              color: theme.colors.muted,
              textAlign: "center",
              maxWidth: 260,
              lineHeight: 20,
            }}>
              Não há alimentos vencidos nem com quantidade crítica no momento.
            </Text>
          </View>
        )}

        {/* Groups */}
        {Object.entries(groups).length > 0 && (
          <View style={{ paddingHorizontal: 18, gap: 22 }}>
            {Object.entries(groups).map(([category, items]) => (
              <View key={category} style={{ gap: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View style={{
                    width: 30, height: 30, borderRadius: 8,
                    backgroundColor: getCategoryColor(category),
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Text style={{ fontSize: 15 }}>{items[0]?.emoji ?? "🛒"}</Text>
                  </View>
                  <Text style={{
                    fontFamily: theme.fontFamily.sans.medium,
                    fontSize: 14,
                    color: theme.colors.ink,
                  }}>{category}</Text>
                  <Text style={{
                    fontFamily: theme.fontFamily.mono.regular,
                    fontSize: 11,
                    color: theme.colors.muted,
                  }}>{items.length}</Text>
                </View>
                <View style={{ gap: 8 }}>
                  {items.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      selected={selected.has(item.id)}
                      onToggle={() => toggleItem(item.id)}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom action */}
      {selected.size > 0 && (
        <View style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          backgroundColor: theme.colors.canvas,
          borderTopWidth: 1,
          borderTopColor: theme.colors.hairline,
          paddingHorizontal: 18,
          paddingTop: 14,
          paddingBottom: bottom + 14,
        }}>
          <Pressable
            onPress={addToList}
            disabled={isLoading}
            style={({ pressed }) => ({
              height: 54,
              borderRadius: 16,
              backgroundColor: theme.colors.ink,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 10,
              opacity: pressed || isLoading ? 0.7 : 1,
            })}
          >
            <ShoppingCart size={18} color={theme.colors.canvas} strokeWidth={1.6} />
            <Text style={{
              fontFamily: theme.fontFamily.sans.semiBold,
              fontSize: 15,
              color: theme.colors.canvas,
            }}>
              Adicionar {selected.size} {selected.size === 1 ? "alimento" : "alimentos"} à lista
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
