import { ArrowLeft, Filter } from "lucide-react-native";
import { ExpiryStatus, PantryItem } from "@app/types";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import {
  formatExpiryLabel,
  getDaysUntilExpiry,
  getExpiryStatus,
  useAppData,
} from "@app/context/AppDataContext";
import { getCategoryColor, getLocationName } from "@app/utils/categories";

import { ActionSheet } from "@ui/components/ActionSheet";
import { Tag } from "@ui/components/Tag";
import { theme } from "@ui/styles/theme";
import { useDeletePantryItem } from "@app/hooks/mutations/useDeletePantryItem";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUpdatePantryItem } from "@app/hooks/mutations/useUpdatePantryItem";

type FilterKey = "all" | ExpiryStatus;

const FILTERS: Array<{ id: FilterKey; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "expired", label: "Vencidos" },
  { id: "urgent", label: "Use agora" },
  { id: "soon", label: "Em breve" },
  { id: "safe", label: "Tranquilos" },
];

const GROUP_META: Record<
  ExpiryStatus,
  { title: string; caption: string; accent: string }
> = {
  expired: {
    title: "Vencidos",
    caption: "descarte ou registre",
    accent: theme.colors.danger,
  },
  urgent: {
    title: "Use agora",
    caption: "até 5 dias",
    accent: theme.colors.urgent,
  },
  soon: {
    title: "Em breve",
    caption: "6 a 15 dias",
    accent: theme.colors.soon,
  },
  planned: {
    title: "Com tempo",
    caption: "16 a 30 dias",
    accent: theme.colors.ink,
  },
  safe: {
    title: "Tranquilos",
    caption: "mais de 30 dias",
    accent: theme.colors.safe,
  },
};

function FoodRow({ item, onPress }: { item: PantryItem; onPress: () => void }) {
  const days = getDaysUntilExpiry(item.expiresAt);
  const status = getExpiryStatus(item.expiresAt);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        backgroundColor: theme.colors.surface,
        padding: 12,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: theme.colors.hairline,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      {item.photo ? (
        <Image
          source={{ uri: item.photo }}
          style={{ width: 52, height: 52, borderRadius: 14 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            backgroundColor: getCategoryColor(item.category),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
        </View>
      )}
      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
        <Text
          style={{
            fontFamily: theme.fontFamily.sans.medium,
            fontSize: 15,
            color: theme.colors.ink,
          }}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text
          style={{
            fontFamily: theme.fontFamily.sans.regular,
            fontSize: 12,
            color: theme.colors.muted,
          }}
        >
          {item.quantity} {item.unit} · {getLocationName(item.locationId)}
        </Text>
      </View>
      <Tag label={formatExpiryLabel(days)} tone={status} size="sm" />
    </Pressable>
  );
}

export function Alerts() {
  const { top, bottom } = useSafeAreaInsets();
  const { pantryItems } = useAppData();
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
  const { deletePantryItem } = useDeletePantryItem();
  const { updatePantryItem } = useUpdatePantryItem();

  const sorted = useMemo(
    () =>
      [...pantryItems].sort(
        (a, b) =>
          getDaysUntilExpiry(a.expiresAt) - getDaysUntilExpiry(b.expiresAt),
      ),
    [pantryItems],
  );

  const groups = useMemo(() => {
    const g: Record<ExpiryStatus, PantryItem[]> = {
      expired: [],
      urgent: [],
      soon: [],
      planned: [],
      safe: [],
    };
    sorted.forEach((i) => {
      g[getExpiryStatus(i.expiresAt)].push(i);
    });
    return g;
  }, [sorted]);

  const filterCounts = useMemo(
    () => ({
      all: sorted.length,
      expired: groups.expired.length,
      urgent: groups.urgent.length,
      soon: groups.soon.length,
      safe: groups.planned.length + groups.safe.length,
    }),
    [groups, sorted],
  );

  const filtered = useMemo(() => {
    if (filter === "all") {
      return groups;
    }
    const empty: Record<ExpiryStatus, PantryItem[]> = {
      expired: [],
      urgent: [],
      soon: [],
      planned: [],
      safe: [],
    };
    if (filter === "safe") {
      empty.planned = groups.planned;
      empty.safe = groups.safe;
      return empty;
    }
    empty[filter] = groups[filter];
    return empty;
  }, [filter, groups]);

  const STATUS_ORDER: ExpiryStatus[] = [
    "expired",
    "urgent",
    "soon",
    "planned",
    "safe",
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas, paddingBottom: bottom + 32 }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.canvas} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingTop: top + 14,
            paddingHorizontal: 18,
            paddingBottom: 4,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            onPress={() => navigation.navigate("Home")}
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: theme.colors.hairline,
              backgroundColor: theme.colors.surface,
              alignItems: "center",
              justifyContent: "center",
            }}
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
            Fila de validade
          </Text>
          <Pressable
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: theme.colors.hairline,
              backgroundColor: theme.colors.surface,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Filter size={18} color={theme.colors.ink} strokeWidth={1.6} />
          </Pressable>
        </View>
        <View style={{ paddingHorizontal: 18, paddingTop: 10 }}>
          <Text
            style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 9.5,
              letterSpacing: 0.12 * 9.5,
              textTransform: "uppercase",
              color: theme.colors.muted,
            }}
          >
            Alertas
          </Text>
          <Text
            style={{
              fontFamily: theme.fontFamily.display.regular,
              fontSize: 38,
              color: theme.colors.ink,
              marginTop: 6,
              marginBottom: 12,
              lineHeight: 42,
            }}
          >
            O que decidir <Text style={{ fontStyle: "italic" }}>hoje.</Text>
          </Text>
          <Text
            style={{
              fontFamily: theme.fontFamily.sans.regular,
              fontSize: 14,
              color: theme.colors.muted,
              marginBottom: 14,
              lineHeight: 20,
            }}
          >
            Alimentos ordenados do mais urgente ao seguro. Toque para escolher o que fazer.
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 18,
            gap: 8,
            paddingBottom: 14,
          }}
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            const count = filterCounts[f.id as keyof typeof filterCounts] ?? 0;
            return (
              <Pressable
                key={f.id}
                onPress={() => setFilter(f.id)}
                style={{
                  height: 38,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  backgroundColor: active
                    ? theme.colors.ink
                    : theme.colors.surface,
                  borderWidth: active ? 0 : 1,
                  borderColor: theme.colors.hairline,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <Text
                  style={{
                    fontFamily: theme.fontFamily.sans.medium,
                    fontSize: 13,
                    color: active ? theme.colors.canvas : theme.colors.ink,
                  }}
                >
                  {f.label}
                </Text>
                <View
                  style={{
                    paddingHorizontal: 7,
                    paddingVertical: 2,
                    borderRadius: 999,
                    backgroundColor: active
                      ? "rgba(250,245,235,0.2)"
                      : theme.colors.canvas,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.mono.regular,
                      fontSize: 11,
                      color: active ? theme.colors.canvas : theme.colors.muted,
                    }}
                  >
                    {count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={{ paddingHorizontal: 18, gap: 18 }}>
          {STATUS_ORDER.map((key) => {
            const g = filtered[key];
            if (!g || g.length === 0) {
              return null;
            }
            const meta = GROUP_META[key];
            return (
              <View key={key} style={{ gap: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    paddingTop: 6,
                  }}
                >
                  <View style={{ gap: 2 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: meta.accent,
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: theme.fontFamily.sans.medium,
                          fontSize: 14,
                          color: theme.colors.ink,
                        }}
                      >
                        {meta.title}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: theme.fontFamily.sans.regular,
                        fontSize: 12,
                        color: theme.colors.muted,
                      }}
                    >
                      {meta.caption}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.display.italic,
                      fontSize: 30,
                      color: theme.colors.ink,
                    }}
                  >
                    {g.length}
                  </Text>
                </View>
                <View style={{ gap: 8 }}>
                  {g.map((item) => (
                    <FoodRow
                      key={item.id}
                      item={item}
                      onPress={() => setSelectedItem(item)}
                    />
                  ))}
                </View>
              </View>
            );
          })}
          <View style={{ height: 8 }} />
        </View>
      </ScrollView>

      <ActionSheet
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onConsume={(item, qty) => {
          if (qty >= item.quantity) {
            deletePantryItem(item.id);
          } else {
            updatePantryItem({
              id: item.id,
              updates: { quantity: item.quantity - qty },
            });
          }
        }}
        onDiscard={(item) => deletePantryItem(item.id)}
        onViewRecipes={() => navigation.navigate("Recipes")}
        onAddReplenishment={(item) =>
          navigation.navigate("Replenishment", { itemId: item.id })
        }
      />
    </View>
  );
}
