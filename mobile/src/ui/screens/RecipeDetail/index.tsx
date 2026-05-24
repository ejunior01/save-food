import React, { useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Check, Clock, Users } from 'lucide-react-native';

import { AppText } from '@ui/components/AppText';
import { ProductImage } from '@ui/components/ProductImage';
import { Button } from '@ui/components/Button';
import { theme } from '@ui/styles/theme';
import { useAppData } from '@app/context/AppDataContext';
import { AppStackScreenProps } from '@app/navigation/types';

type Props = AppStackScreenProps<'RecipeDetail'>;

export function RecipeDetail({ route, navigation }: Props) {
  const { top, bottom } = useSafeAreaInsets();
  const { recipes } = useAppData();
  const recipe = recipes.find((r) => r.id === route.params.recipeId);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  if (!recipe) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <AppText>Receita não encontrada</AppText>
      </View>
    );
  }

  function toggleIngredient(index: number) {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) { next.delete(index); } else { next.add(index); }
      return next;
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.text} />

      {/* Hero */}
      <ImageBackground
        source={recipe.imageUrl ? { uri: recipe.imageUrl } : undefined}
        style={{ height: 280, backgroundColor: theme.colors.text, alignItems: 'center', justifyContent: 'center' }}
      >
        {recipe.imageUrl ? (
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <ProductImage emoji={recipe.emoji} size={110} />
        )}
        <Pressable
          style={{
            position: 'absolute',
            top: top + 8, left: 16,
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.18)',
            alignItems: 'center', justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={22} color="#fff" strokeWidth={2} />
        </Pressable>
      </ImageBackground>

      {/* Content card */}
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: theme.radii.xl,
          borderTopRightRadius: theme.radii.xl,
          marginTop: -24,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
      >
        <AppText size="xs" family="medium" color={theme.colors.primary}
          style={{ letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>
          {recipe.category}
        </AppText>
        <AppText family="displayItalic" style={{ fontSize: 28, lineHeight: 34, color: theme.colors.text }}>
          {recipe.title}
        </AppText>

        <View style={{ flexDirection: 'row', gap: 20, marginTop: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Clock size={14} color={theme.colors.textMuted} strokeWidth={1.8} />
            <AppText size="sm" color={theme.colors.textMuted}>{recipe.duration} min</AppText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Users size={14} color={theme.colors.textMuted} strokeWidth={1.8} />
            <AppText size="sm" color={theme.colors.textMuted}>{recipe.servings} porções</AppText>
          </View>
        </View>

        {/* Pistachio match block */}
        <View style={{
          marginTop: 20,
          backgroundColor: theme.colors.block.pistachio,
          borderRadius: theme.radii.md,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        }}>
          <View style={{
            width: 40, height: 40, borderRadius: theme.radii.sm,
            backgroundColor: 'rgba(26,43,31,0.12)',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <AppText style={{ fontSize: 22 }}>🥦</AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText family="display" style={{ fontSize: 17, color: theme.colors.text }}>
              {recipe.ingredients.length} ingredientes
            </AppText>
            <AppText size="xs" color={theme.colors.textMuted} style={{ marginTop: 2 }}>
              Toque para marcar os que você tem
            </AppText>
          </View>
        </View>

        {/* Ingredients */}
        <AppText size="xs" family="medium" color={theme.colors.textMuted}
          style={{ letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 24, marginBottom: 10 }}>
          Ingredientes
        </AppText>

        {recipe.ingredients.map((ing, index) => {
          const isChecked = checkedIngredients.has(index);
          return (
            <Pressable
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
                gap: 12,
              }}
              onPress={() => toggleIngredient(index)}
            >
              <View style={{
                width: 22, height: 22, borderRadius: 11,
                borderWidth: 1.5,
                borderColor: isChecked ? theme.colors.primary : theme.colors.border,
                backgroundColor: isChecked ? theme.colors.primary : 'transparent',
                alignItems: 'center', justifyContent: 'center',
              }}>
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
        <AppText size="xs" family="medium" color={theme.colors.textMuted}
          style={{ letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 28, marginBottom: 14 }}>
          Modo de preparo
        </AppText>

        {recipe.steps.map((step, index) => (
          <View key={index} style={{ flexDirection: 'row', gap: 14, marginBottom: 18 }}>
            <View style={{
              width: 28, height: 28, borderRadius: 14,
              backgroundColor: theme.colors.block.pistachio,
              alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
            }}>
              <AppText size="xs" family="semiBold" color={theme.colors.primary}>
                {index + 1}
              </AppText>
            </View>
            <AppText size="base" style={{ flex: 1, lineHeight: 24 }}>{step}</AppText>
          </View>
        ))}
      </ScrollView>

      {/* Floating CTA */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 20, paddingBottom: Math.max(bottom, 20),
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1, borderTopColor: theme.colors.border,
      }}>
        <Button
          variant="primary"
          size="lg"
          label="Começar a cozinhar"
          onPress={() => {}}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}
