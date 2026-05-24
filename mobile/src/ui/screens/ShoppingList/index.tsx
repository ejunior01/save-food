import React, { useMemo, useRef } from 'react';
import { Pressable, SectionList, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Minus, Plus, Trash2 } from 'lucide-react-native';

import { AppText } from '@ui/components/AppText';
import { theme } from '@ui/styles/theme';
import { useAppData } from '@app/context/AppDataContext';
import { useCreateShoppingItem } from '@app/hooks/mutations/useCreateShoppingItem';
import { useUpdateShoppingItem } from '@app/hooks/mutations/useUpdateShoppingItem';
import { useDeleteShoppingItem } from '@app/hooks/mutations/useDeleteShoppingItem';
import { ShoppingItem } from '@app/types';
import { ShoppingFormSheet, type ShoppingFormSheetHandle, type FormData } from './ShoppingFormSheet';

export function ShoppingList() {
  const { top, bottom } = useSafeAreaInsets();
  const { shoppingItems, toggleShoppingItem } = useAppData();
  const { createShoppingItem } = useCreateShoppingItem();
  const { updateShoppingItem } = useUpdateShoppingItem();
  const { deleteShoppingItem } = useDeleteShoppingItem();
  const formSheetRef = useRef<ShoppingFormSheetHandle>(null);

  const checkedCount = shoppingItems.filter((i) => i.checked).length;
  const progress = shoppingItems.length > 0 ? checkedCount / shoppingItems.length : 0;
  const progressPct = Math.round(progress * 100);

  const sections = useMemo(() => {
    const groups: Record<string, typeof shoppingItems> = {};
    shoppingItems.forEach((item) => {
      if (!groups[item.category]) { groups[item.category] = []; }
      groups[item.category].push(item);
    });
    return Object.entries(groups).map(([title, data]) => ({ title, data }));
  }, [shoppingItems]);

  function handleFormSubmit(data: FormData, item?: ShoppingItem) {
    if (item) {
      updateShoppingItem({ id: item.id, updates: data });
    } else {
      createShoppingItem({ ...data, checked: false });
    }
  }

  function handleQuantityChange(item: ShoppingItem, delta: number) {
    const next = Math.max(1, item.quantity + delta);
    updateShoppingItem({ id: item.id, updates: { quantity: next } });
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.block.charcoal} />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + 80 }}
        ListHeaderComponent={
          <>
            {/* Charcoal hero */}
            <View style={{
              backgroundColor: theme.colors.block.charcoal,
              paddingTop: top + 20,
              paddingHorizontal: 20,
              paddingBottom: 28,
            }}>
              <AppText size="xs" family="medium" color="rgba(255,255,255,0.45)"
                style={{ letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
                Mercado
              </AppText>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <AppText family="displayItalic" color="#fff"
                  style={{ fontSize: 32, lineHeight: 38, flex: 1 }}>
                  Lista de{'\n'}compras
                </AppText>
                <Pressable
                  style={({ pressed }) => ({
                    width: 44, height: 44, borderRadius: theme.radii.pill,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    alignItems: 'center', justifyContent: 'center',
                    opacity: pressed ? 0.7 : 1,
                    marginTop: 4,
                  })}
                  onPress={() => formSheetRef.current?.openAdd()}
                >
                  <Plus size={20} color="#fff" strokeWidth={2.5} />
                </Pressable>
              </View>

              {/* Progress */}
              <View style={{ marginTop: 20, gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <AppText size="xs" family="medium" color="rgba(255,255,255,0.6)">
                    {checkedCount} de {shoppingItems.length} itens
                  </AppText>
                  <AppText size="xs" family="medium" color="rgba(255,255,255,0.6)">
                    {progressPct}%
                  </AppText>
                </View>
                <View style={{
                  height: 4, backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: theme.radii.pill, overflow: 'hidden',
                }}>
                  <View style={{
                    height: '100%',
                    width: `${progressPct}%`,
                    backgroundColor: theme.colors.block.pistachio,
                    borderRadius: theme.radii.pill,
                  }} />
                </View>
              </View>
            </View>

            <View style={{ height: 8, backgroundColor: theme.colors.background }} />
          </>
        }
        renderSectionHeader={({ section }) => (
          <View style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: theme.colors.background,
          }}>
            <AppText size="xs" family="medium" color={theme.colors.textMuted}
              style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>
              {section.title}
            </AppText>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            marginHorizontal: 20,
            marginBottom: 2,
            borderRadius: 0,
            paddingHorizontal: 14,
            paddingVertical: 12,
            gap: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          }}>
            <Pressable
              onPress={() => toggleShoppingItem(item.id)}
              hitSlop={4}
              style={{
                width: 22, height: 22, borderRadius: 11,
                borderWidth: 1.5,
                borderColor: item.checked ? theme.colors.primary : theme.colors.border,
                backgroundColor: item.checked ? theme.colors.primary : 'transparent',
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {item.checked && <Check size={12} color="#fff" strokeWidth={2.5} />}
            </Pressable>

            <Pressable style={{ flex: 1, gap: 2 }} onPress={() => formSheetRef.current?.openEdit(item)}>
              <AppText
                size="base"
                color={item.checked ? theme.colors.textMuted : theme.colors.text}
                style={item.checked ? { textDecorationLine: 'line-through' } : undefined}
                numberOfLines={1}
              >
                {item.name}
              </AppText>
              <AppText size="xs" color={theme.colors.textMuted}>
                {item.category}
              </AppText>
            </Pressable>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <Pressable
                style={{
                  width: 26, height: 26, borderRadius: theme.radii.pill,
                  backgroundColor: theme.colors.surface2,
                  borderWidth: 1, borderColor: theme.colors.border,
                  alignItems: 'center', justifyContent: 'center',
                }}
                onPress={() => handleQuantityChange(item, -1)}
                hitSlop={4}
              >
                <Minus size={12} color={theme.colors.text} strokeWidth={2.5} />
              </Pressable>
              <AppText size="sm" family="medium" style={{ minWidth: 34, textAlign: 'center' }}>
                {item.quantity} {item.unit}
              </AppText>
              <Pressable
                style={{
                  width: 26, height: 26, borderRadius: theme.radii.pill,
                  backgroundColor: theme.colors.surface2,
                  borderWidth: 1, borderColor: theme.colors.border,
                  alignItems: 'center', justifyContent: 'center',
                }}
                onPress={() => handleQuantityChange(item, 1)}
                hitSlop={4}
              >
                <Plus size={12} color={theme.colors.text} strokeWidth={2.5} />
              </Pressable>
            </View>

            <Pressable
              onPress={() => deleteShoppingItem(item.id)}
              hitSlop={4}
              style={{ padding: 4, flexShrink: 0 }}
            >
              <Trash2 size={15} color={theme.colors.textMuted} strokeWidth={1.8} />
            </Pressable>
          </View>
        )}
      />

      <ShoppingFormSheet ref={formSheetRef} onSubmit={handleFormSubmit} />
    </View>
  );
}
