import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Check } from 'lucide-react-native';

import { AppText } from '@ui/components/AppText';
import { ProductImage } from '@ui/components/ProductImage';
import { Tag } from '@ui/components/Tag';
import { Button } from '@ui/components/Button';
import { theme } from '@ui/styles/theme';
import { useAppData } from '@app/context/AppDataContext';
import { AppStackScreenProps } from '@app/navigation/types';
import { styles } from './styles';

type Props = AppStackScreenProps<'RecipeDetail'>;

export function RecipeDetail({ route, navigation }: Props) {
  const { top, bottom } = useSafeAreaInsets();
  const { recipes } = useAppData();
  const recipe = recipes.find((r) => r.id === route.params.recipeId);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  if (!recipe) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <AppText>Receita não encontrada</AppText>
      </View>
    );
  }

  function toggleIngredient(index: number) {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.success.soft} />

      {/* Hero */}
      <View style={[styles.hero, { paddingTop: top }]}>
        <ProductImage emoji={recipe.emoji} size={120} />
        <Pressable
          style={[styles.backButton, { top: top + 8 }]}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={22} color={theme.colors.text} strokeWidth={2} />
        </Pressable>
      </View>

      {/* Card */}
      <ScrollView
        style={styles.card}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <AppText size="2xl" family="semiBold">{recipe.title}</AppText>

        <View style={styles.metaRow}>
          <Tag label={`⏱ ${recipe.duration} min`} tone="info" />
          <Tag label={`🍽 ${recipe.servings} porções`} tone="neutral" />
          <Tag label={recipe.category} tone="primary" />
        </View>

        {/* Ingredients */}
        <View style={styles.sectionTitle}>
          <AppText size="lg" family="semiBold">Ingredientes</AppText>
        </View>
        {recipe.ingredients.map((ing, index) => {
          const isChecked = checkedIngredients.has(index);
          return (
            <Pressable
              key={index}
              style={styles.ingredientRow}
              onPress={() => toggleIngredient(index)}
            >
              <View style={[styles.ingredientCheck, isChecked && styles.ingredientCheckDone]}>
                {isChecked && <Check size={12} color="#fff" strokeWidth={2.5} />}
              </View>
              <AppText
                size="base"
                style={{ flex: 1 }}
                color={isChecked ? theme.colors.textMuted : theme.colors.text}
              >
                {ing.name}
              </AppText>
              <AppText size="sm" color={theme.colors.textMuted}>{ing.amount}</AppText>
            </Pressable>
          );
        })}

        {/* Steps */}
        <View style={styles.sectionTitle}>
          <AppText size="lg" family="semiBold">Modo de preparo</AppText>
        </View>
        {recipe.steps.map((step, index) => (
          <View key={index} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                  fontFamily: theme.fontFamily.sans.semiBold,
                  includeFontPadding: false,
                }}
              >
                {index + 1}
              </Text>
            </View>
            <AppText size="base" style={{ flex: 1, lineHeight: 22 }}>{step}</AppText>
          </View>
        ))}
      </ScrollView>

      {/* Floating button */}
      <View style={[styles.floatingButton, { paddingBottom: Math.max(bottom, 16) }]}>
        <Button
          variant="primary"
          size="lg"
          label="Começar a cozinhar 👨‍🍳"
          onPress={() => {}}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}
