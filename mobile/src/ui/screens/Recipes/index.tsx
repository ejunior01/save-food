import React, { useState, useMemo } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Clock, Users } from 'lucide-react-native';

import { AppText } from '@ui/components/AppText';
import { theme } from '@ui/styles/theme';
import { useAppData } from '@app/context/AppDataContext';
import { AppStackNavigationProps } from '@app/navigation/types';
import { Recipe } from '@app/types';

const BLOCK_COLORS = [
  theme.colors.block.pistachio,
  theme.colors.block.peach,
  theme.colors.block.rose,
  theme.colors.block.sage,
  theme.colors.block.cream,
];

function FeaturedCard({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => ({
        marginHorizontal: 20,
        marginBottom: 24,
        borderRadius: theme.radii.lg,
        overflow: 'hidden',
        opacity: pressed ? 0.9 : 1,
      })}
      onPress={onPress}
    >
      <ImageBackground
        source={recipe.imageUrl ? { uri: recipe.imageUrl } : undefined}
        style={{
          height: 240,
          backgroundColor: theme.colors.text,
          justifyContent: 'flex-end',
        }}
        imageStyle={{ borderRadius: theme.radii.lg }}
      >
        {!recipe.imageUrl && (
          <View style={{
            ...StyleSheet.absoluteFillObject,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.text,
          }}>
            <AppText style={{ fontSize: 80 }}>{recipe.emoji}</AppText>
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.18)', 'rgba(0,0,0,0.78)']}
          locations={[0, 0.4, 1]}
          style={{ padding: 20, gap: 6 }}
        >
          <AppText size="xs" family="medium" color="rgba(255,255,255,0.6)"
            style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>
            Em destaque
          </AppText>
          <AppText family="displayItalic" color="#fff"
            style={{ fontSize: 24, lineHeight: 30 }} numberOfLines={2}>
            {recipe.title}
          </AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <Clock size={12} color="rgba(255,255,255,0.65)" strokeWidth={2} />
            <AppText size="sm" color="rgba(255,255,255,0.8)">{recipe.duration} min</AppText>
            <AppText size="sm" color="rgba(255,255,255,0.35)">·</AppText>
            <Users size={12} color="rgba(255,255,255,0.65)" strokeWidth={2} />
            <AppText size="sm" color="rgba(255,255,255,0.8)">{recipe.servings} porções</AppText>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}

function RecipeCard({ recipe, index, onPress }: { recipe: Recipe; index: number; onPress: () => void }) {
  const blockColor = BLOCK_COLORS[index % BLOCK_COLORS.length];
  return (
    <Pressable
      style={({ pressed }) => ({
        flexDirection: 'row',
        borderRadius: theme.radii.md,
        marginBottom: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
        opacity: pressed ? 0.82 : 1,
      })}
      onPress={onPress}
    >
      {recipe.imageUrl ? (
        <Image source={{ uri: recipe.imageUrl }} style={{ width: 96, height: 96 }} />
      ) : (
        <View style={{
          width: 96, height: 96,
          backgroundColor: blockColor,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <AppText style={{ fontSize: 38 }}>{recipe.emoji}</AppText>
        </View>
      )}
      <View style={{
        flex: 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 3,
        justifyContent: 'center',
        backgroundColor: theme.colors.surface,
      }}>
        <AppText size="xs" family="medium" color={theme.colors.primary}
          style={{ letterSpacing: 0.8, textTransform: 'uppercase' }}>
          {recipe.category}
        </AppText>
        <AppText family="display" style={{ fontSize: 16, lineHeight: 22 }} numberOfLines={2}>
          {recipe.title}
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <Clock size={11} color={theme.colors.textMuted} strokeWidth={2} />
          <AppText size="xs" color={theme.colors.textMuted}>{recipe.duration} min</AppText>
          <AppText size="xs" color={theme.colors.border}>·</AppText>
          <Users size={11} color={theme.colors.textMuted} strokeWidth={2} />
          <AppText size="xs" color={theme.colors.textMuted}>{recipe.servings} porções</AppText>
        </View>
      </View>
    </Pressable>
  );
}

export function Recipes() {
  const { top } = useSafeAreaInsets();
  const { recipes } = useAppData();
  const navigation = useNavigation<AppStackNavigationProps>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const unique = [...new Set(recipes.map((r) => r.category))];
    return ['Todas', ...unique];
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !activeCategory || r.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchQuery, activeCategory]);

  const featured = filteredRecipes[0];
  const rest = filteredRecipes.slice(1);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingTop: top + 20, paddingHorizontal: 20, paddingBottom: 20 }}>
          <AppText size="xs" family="medium" color={theme.colors.textMuted}
            style={{ letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
            Inspiração
          </AppText>
          <AppText family="displayItalic"
            style={{ fontSize: 32, lineHeight: 38, color: theme.colors.text }}>
            O que cozinhar hoje?
          </AppText>
        </View>

        {/* Category filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8, marginBottom: 20 }}
        >
          {categories.map((cat) => {
            const isActive = (cat === 'Todas' && !activeCategory) || activeCategory === cat;
            return (
              <Pressable
                key={cat}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: theme.radii.pill,
                  backgroundColor: isActive ? theme.colors.text : theme.colors.surface,
                  borderWidth: 1,
                  borderColor: isActive ? theme.colors.text : theme.colors.border,
                }}
                onPress={() => setActiveCategory(cat === 'Todas' ? null : cat)}
              >
                <AppText size="sm" family="medium"
                  color={isActive ? '#fff' : theme.colors.text}>
                  {cat}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Featured */}
        {featured && (
          <FeaturedCard
            recipe={featured}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: featured.id })}
          />
        )}

        {/* Recipe list */}
        {rest.length > 0 && (
          <View style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
            <AppText size="xs" family="medium" color={theme.colors.textMuted}
              style={{ letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 14 }}>
              Mais receitas
            </AppText>
            {rest.map((recipe, i) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                index={i}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
