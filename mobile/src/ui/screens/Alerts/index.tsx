import React, { useState, useMemo } from 'react';
import { FlatList, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@ui/components/AppText';
import { ProductImage } from '@ui/components/ProductImage';
import { Tag } from '@ui/components/Tag';
import { Button } from '@ui/components/Button';
import { theme } from '@ui/styles/theme';
import { useAppData, getDaysUntilExpiry, getExpiryStatus, formatExpiryLabel } from '@app/context/AppDataContext';
import { getCategoryIcon } from '@app/utils/categories';
import { useDeletePantryItem } from '@app/hooks/mutations/useDeletePantryItem';
import { styles } from './styles';

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

  const filteredItems = useMemo(() => {
    const sorted = [...pantryItems].sort(
      (a, b) => a.expiresAt.getTime() - b.expiresAt.getTime(),
    );
    if (activeFilter === 'all') { return sorted; }
    return sorted.filter((item) => getExpiryStatus(item.expiresAt) === activeFilter);
  }, [pantryItems, activeFilter]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <View style={[styles.header, { paddingTop: top + 8 }]}>
        <AppText size="2xl" family="semiBold">Alertas</AppText>
        <AppText size="sm" color={theme.colors.textMuted} style={{ marginTop: 2 }}>
          {pantryItems.filter((i) => getDaysUntilExpiry(i.expiresAt) <= 3).length} itens precisam de atenção
        </AppText>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {FILTERS.map(({ key, label }) => (
          <Pressable
            key={key}
            style={[styles.filterPill, activeFilter === key && styles.filterPillActive]}
            onPress={() => setActiveFilter(key)}
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
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 48 }}>✅</Text>
          <AppText size="base" family="semiBold">Nada vencendo!</AppText>
          <AppText size="sm" color={theme.colors.textMuted} align="center">
            Todos os itens estão dentro do prazo.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const days = getDaysUntilExpiry(item.expiresAt);
            const status = getExpiryStatus(item.expiresAt);
            const showActions = days <= 3;

            return (
              <View style={styles.alertCard}>
                <View style={styles.alertCardTop}>
                  <ProductImage emoji={getCategoryIcon(item.category)} size={52} />
                  <View style={styles.alertInfo}>
                    <AppText size="base" family="semiBold">{item.name}</AppText>
                    <AppText size="sm" color={theme.colors.textMuted}>
                      {item.quantity} {item.unit} · {item.category}
                    </AppText>
                  </View>
                  <Tag label={formatExpiryLabel(days)} tone={status} />
                </View>

                {showActions && (
                  <View style={styles.alertActions}>
                    <Button
                      variant="secondary"
                      size="sm"
                      label="Usar agora"
                      onPress={() => deletePantryItem(item.id)}
                      style={{ flex: 1 }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      label="Descartar"
                      onPress={() => deletePantryItem(item.id)}
                      style={{ flex: 1 }}
                    />
                  </View>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
