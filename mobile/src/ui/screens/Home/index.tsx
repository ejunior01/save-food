import React from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScanLine, Bell, ChefHat } from 'lucide-react-native';

import { AppText } from '@ui/components/AppText';
import { ProductImage } from '@ui/components/ProductImage';
import { Tag } from '@ui/components/Tag';
import { theme } from '@ui/styles/theme';
import { useAppData, getDaysUntilExpiry, getExpiryStatus, formatExpiryLabel } from '@app/context/AppDataContext';
import { getCategoryIcon } from '@app/utils/categories';
import { AppStackNavigationProps } from '@app/navigation/types';
import { styles } from './styles';

const SHORTCUTS = [
  { label: 'Escanear', icon: ScanLine, tab: 'Scanner' },
  { label: 'Alertas', icon: Bell, tab: 'Alerts' },
  { label: 'Receitas', icon: ChefHat, tab: 'Recipes' },
] as const;

export function Home() {
  const { top } = useSafeAreaInsets();
  const { pantryItems, expiringItems, recipes } = useAppData();
  const navigation = useNavigation<AppStackNavigationProps>();
  const tabNavigation = useNavigation<any>();

  const expiredCount = pantryItems.filter((i) => getDaysUntilExpiry(i.expiresAt) <= 0).length;
  const urgentCount = pantryItems.filter((i) => {
    const d = getDaysUntilExpiry(i.expiresAt);
    return d > 0 && d <= 3;
  }).length;
  const okCount = pantryItems.length - expiredCount - urgentCount;

  const suggestedRecipes = recipes.slice(0, 2);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: top + 8 }]}>
          <View>
            <AppText size="sm" color={theme.colors.textMuted}>Bom dia,</AppText>
            <AppText size="lg" family="semiBold">Sua despensa 👋</AppText>
          </View>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 18 }}>🧑</Text>
          </View>
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <AppText size="sm" family="semiBold" color="rgba(255,255,255,0.8)">
            Resumo da despensa
          </AppText>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <AppText size="2xl" family="semiBold" color="#fff">
                {pantryItems.length}
              </AppText>
              <AppText size="xs" color="rgba(255,255,255,0.7)">Total</AppText>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <AppText size="2xl" family="semiBold" color="#fff">
                {expiredCount + urgentCount}
              </AppText>
              <AppText size="xs" color="rgba(255,255,255,0.7)">Vencendo</AppText>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <AppText size="2xl" family="semiBold" color="#fff">
                {okCount}
              </AppText>
              <AppText size="xs" color="rgba(255,255,255,0.7)">OK</AppText>
            </View>
          </View>
        </View>

        {/* Quick shortcuts */}
        <View style={styles.sectionHeader}>
          <AppText size="base" family="semiBold">Ações rápidas</AppText>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.shortcutsScroll}
        >
          {SHORTCUTS.map(({ label, icon: Icon, tab }) => (
            <Pressable
              key={tab}
              style={({ pressed }) => [styles.shortcutCard, pressed && { opacity: 0.7 }]}
              onPress={() => tabNavigation.navigate(tab)}
            >
              <Icon size={24} color={theme.colors.primary} strokeWidth={1.8} />
              <AppText size="xs" family="medium" align="center">{label}</AppText>
            </Pressable>
          ))}
        </ScrollView>

        {/* Expiring soon */}
        <View style={styles.sectionHeader}>
          <AppText size="base" family="semiBold">Vencendo em breve</AppText>
          <Pressable onPress={() => tabNavigation.navigate('Alerts')}>
            <AppText size="sm" color={theme.colors.primary} family="medium">Ver todos</AppText>
          </Pressable>
        </View>
        <FlatList
          horizontal
          data={expiringItems}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.expiringScroll}
          renderItem={({ item }) => {
            const days = getDaysUntilExpiry(item.expiresAt);
            const status = getExpiryStatus(item.expiresAt);
            return (
              <View style={styles.expiringCard}>
                <ProductImage emoji={getCategoryIcon(item.category)} size={48} />
                <AppText size="sm" family="medium" numberOfLines={1}>
                  {item.name}
                </AppText>
                <Tag label={formatExpiryLabel(days)} tone={status} />
              </View>
            );
          }}
        />

        {/* Recipe suggestions */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <AppText size="base" family="semiBold">Receitas sugeridas</AppText>
          <Pressable onPress={() => tabNavigation.navigate('Recipes')}>
            <AppText size="sm" color={theme.colors.primary} family="medium">Ver todas</AppText>
          </Pressable>
        </View>
        {suggestedRecipes.map((recipe) => (
          <Pressable
            key={recipe.id}
            style={({ pressed }) => [styles.recipeCard, pressed && { opacity: 0.8 }]}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
          >
            <ProductImage emoji={recipe.emoji} size={56} />
            <View style={styles.recipeInfo}>
              <AppText size="base" family="semiBold" numberOfLines={1}>{recipe.title}</AppText>
              <AppText size="sm" color={theme.colors.textMuted}>
                {recipe.duration} min · {recipe.servings} porções
              </AppText>
            </View>
          </Pressable>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}
