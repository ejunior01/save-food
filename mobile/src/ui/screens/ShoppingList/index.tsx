import React, { useMemo } from 'react';
import { Pressable, SectionList, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';

import { AppText } from '@ui/components/AppText';
import { theme } from '@ui/styles/theme';
import { useAppData } from '@app/context/AppDataContext';
import { styles } from './styles';

export function ShoppingList() {
  const { top } = useSafeAreaInsets();
  const { shoppingItems, toggleShoppingItem } = useAppData();

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: top + 8 }]}>
            <AppText size="2xl" family="semiBold">Lista de compras</AppText>

            {/* Progress bar */}
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
          <Pressable
            style={({ pressed }) => [styles.itemRow, pressed && { opacity: 0.8 }]}
            onPress={() => toggleShoppingItem(item.id)}
          >
            <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
              {item.checked && <Check size={13} color="#fff" strokeWidth={2.5} />}
            </View>
            <View style={styles.itemInfo}>
              <AppText
                size="base"
                color={item.checked ? theme.colors.textMuted : theme.colors.text}
                style={item.checked ? { textDecorationLine: 'line-through' } : undefined}
              >
                {item.name}
              </AppText>
              <AppText size="sm" color={theme.colors.textMuted}>
                {item.quantity} {item.unit}
              </AppText>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
