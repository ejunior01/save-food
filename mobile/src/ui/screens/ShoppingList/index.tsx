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
import { styles } from './styles';

export function ShoppingList() {
  const { top, bottom } = useSafeAreaInsets();
  const { shoppingItems, toggleShoppingItem } = useAppData();
  const { createShoppingItem } = useCreateShoppingItem();
  const { updateShoppingItem } = useUpdateShoppingItem();
  const { deleteShoppingItem } = useDeleteShoppingItem();
  const formSheetRef = useRef<ShoppingFormSheetHandle>(null);

  const checkedCount = shoppingItems.filter((i) => i.checked).length;
  const progress = shoppingItems.length > 0 ? checkedCount / shoppingItems.length : 0;

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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottom + 80 }]}
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: top + 8 }]}>
            <View style={styles.headerRow}>
              <AppText size="2xl" family="semiBold">Lista de compras</AppText>
              <Pressable
                style={styles.addButton}
                onPress={() => formSheetRef.current?.openAdd()}
                hitSlop={8}
              >
                <Plus size={20} color="#fff" strokeWidth={2.5} />
              </Pressable>
            </View>

            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <AppText size="sm" color={theme.colors.textMuted}>
              {checkedCount} de {shoppingItems.length} itens concluídos
            </AppText>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <AppText size="sm" family="semiBold" color={theme.colors.textMuted}>
              {section.title}
            </AppText>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Pressable
              onPress={() => toggleShoppingItem(item.id)}
              hitSlop={4}
              style={[styles.checkbox, item.checked && styles.checkboxChecked]}
            >
              {item.checked && <Check size={13} color="#fff" strokeWidth={2.5} />}
            </Pressable>

            <Pressable style={styles.itemInfo} onPress={() => formSheetRef.current?.openEdit(item)}>
              <AppText
                size="base"
                color={item.checked ? theme.colors.textMuted : theme.colors.text}
                style={item.checked ? { textDecorationLine: 'line-through' } : undefined}
                numberOfLines={1}
              >
                {item.name}
              </AppText>
              <AppText size="sm" color={theme.colors.textMuted}>
                {item.category}
              </AppText>
            </Pressable>

            <View style={styles.stepper}>
              <Pressable
                style={styles.stepperBtn}
                onPress={() => handleQuantityChange(item, -1)}
                hitSlop={4}
              >
                <Minus size={13} color={theme.colors.text} strokeWidth={2.5} />
              </Pressable>
              <AppText size="sm" family="semiBold" style={styles.stepperCount}>
                {item.quantity} {item.unit}
              </AppText>
              <Pressable
                style={styles.stepperBtn}
                onPress={() => handleQuantityChange(item, 1)}
                hitSlop={4}
              >
                <Plus size={13} color={theme.colors.text} strokeWidth={2.5} />
              </Pressable>
            </View>

            <Pressable
              onPress={() => deleteShoppingItem(item.id)}
              hitSlop={4}
              style={styles.deleteBtn}
            >
              <Trash2 size={16} color={theme.colors.danger.DEFAULT} strokeWidth={1.8} />
            </Pressable>
          </View>
        )}
      />

      <ShoppingFormSheet ref={formSheetRef} onSubmit={handleFormSubmit} />
    </View>
  );
}
