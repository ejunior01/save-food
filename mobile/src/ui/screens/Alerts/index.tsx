import React, { useState, useMemo } from 'react';
import { FlatList, Pressable, ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Trash2, ChevronRight } from 'lucide-react-native';

import { AppText } from '@ui/components/AppText';
import { Tag } from '@ui/components/Tag';
import { theme } from '@ui/styles/theme';
import { useAppData, getDaysUntilExpiry, getExpiryStatus, formatExpiryLabel } from '@app/context/AppDataContext';
import { getCategoryIcon } from '@app/utils/categories';
import { useDeletePantryItem } from '@app/hooks/mutations/useDeletePantryItem';

type FilterKey = 'all' | 'danger' | 'warning' | 'info';

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'danger', label: 'Vencidos' },
  { key: 'warning', label: 'Urgente' },
  { key: 'info', label: 'Atenção' },
];

export function Alerts() {
  const { top } = useSafeAreaInsets();
  const { pantryItems } = useAppData();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const { deletePantryItem } = useDeletePantryItem();

  const urgentCount = pantryItems.filter((i) => getDaysUntilExpiry(i.expiresAt) <= 3).length;

  const filteredItems = useMemo(() => {
    const sorted = [...pantryItems].sort(
      (a, b) => a.expiresAt.getTime() - b.expiresAt.getTime(),
    );
    if (activeFilter === 'all') { return sorted; }
    return sorted.filter((item) => getExpiryStatus(item.expiresAt) === activeFilter);
  }, [pantryItems, activeFilter]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={{ paddingTop: top + 20, paddingHorizontal: 20, paddingBottom: 16 }}>
        <AppText size="xs" family="medium" color={theme.colors.textMuted}
          style={{ letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
          Minha despensa
        </AppText>
        <AppText family="displayItalic"
          style={{ fontSize: 32, lineHeight: 38, color: theme.colors.text }}>
          Alertas
        </AppText>
        {urgentCount > 0 && (
          <AppText size="sm" color={theme.colors.danger.DEFAULT} style={{ marginTop: 4 }}>
            {urgentCount} {urgentCount === 1 ? 'item precisa' : 'itens precisam'} de atenção
          </AppText>
        )}
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 16 }}
      >
        {FILTERS.map(({ key, label }) => (
          <Pressable
            key={key}
            onPress={() => setActiveFilter(key)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: theme.radii.pill,
              backgroundColor: activeFilter === key ? theme.colors.text : theme.colors.surface,
              borderWidth: 1,
              borderColor: activeFilter === key ? theme.colors.text : theme.colors.border,
            }}
          >
            <AppText
              size="sm"
              family="medium"
              color={activeFilter === key ? '#fff' : theme.colors.text}
            >
              {label}
            </AppText>
          </Pressable>
        ))}
      </ScrollView>

      {filteredItems.length === 0 ? (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 }}>
          <AppText style={{ fontSize: 48 }}>✓</AppText>
          <AppText family="display" style={{ fontSize: 22, color: theme.colors.text }}>
            Tudo em ordem!
          </AppText>
          <AppText size="sm" color={theme.colors.textMuted} align="center">
            Todos os itens estão dentro do prazo.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 2, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const days = getDaysUntilExpiry(item.expiresAt);
            const status = getExpiryStatus(item.expiresAt);
            const isFirst = index === 0;
            const isLast = index === filteredItems.length - 1;

            return (
              <View style={{
                backgroundColor: theme.colors.surface,
                borderTopLeftRadius: isFirst ? theme.radii.md : 4,
                borderTopRightRadius: isFirst ? theme.radii.md : 4,
                borderBottomLeftRadius: isLast ? theme.radii.md : 4,
                borderBottomRightRadius: isLast ? theme.radii.md : 4,
                paddingHorizontal: 14,
                paddingVertical: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                borderWidth: 1,
                borderColor: theme.colors.border,
                marginBottom: isLast ? 0 : -1,
              }}>
                {/* Expiry color bar */}
                <View style={{
                  width: 4,
                  height: 36,
                  borderRadius: 2,
                  backgroundColor: days <= 0
                    ? theme.colors.danger.DEFAULT
                    : days <= 3
                      ? theme.colors.info.DEFAULT
                      : theme.colors.warning.DEFAULT,
                }} />

                <View style={{
                  width: 40, height: 40, borderRadius: theme.radii.sm,
                  backgroundColor: theme.colors.surface2,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <AppText style={{ fontSize: 22 }}>{getCategoryIcon(item.category)}</AppText>
                </View>

                <View style={{ flex: 1, gap: 2 }}>
                  <AppText size="base" family="medium" numberOfLines={1}>{item.name}</AppText>
                  <AppText size="xs" color={theme.colors.textMuted}>
                    {item.quantity} {item.unit} · {item.category}
                  </AppText>
                </View>

                <Tag label={formatExpiryLabel(days)} tone={status} size="sm" />

                <Pressable
                  onPress={() => deletePantryItem(item.id)}
                  hitSlop={8}
                  style={{ padding: 4 }}
                >
                  <Trash2 size={15} color={theme.colors.textMuted} strokeWidth={1.8} />
                </Pressable>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
