import React, { useState, useMemo } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Clock, Search, Users } from 'lucide-react-native';

import { AppText } from '@ui/components/AppText';
import { Input } from '@ui/components/Input';
import { theme } from '@ui/styles/theme';
import { useAppData } from '@app/context/AppDataContext';
import { AppStackNavigationProps } from '@app/navigation/types';
import { Recipe } from '@app/types';
import { styles } from './styles';

function FeaturedCard({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.featuredCard, pressed && { opacity: 0.9 }]}
      onPress={onPress}
    >
      <ImageBackground
        source={recipe.imageUrl ? { uri: recipe.imageUrl } : undefined}
        style={styles.featuredBg}
        imageStyle={styles.featuredImage}
      >
        {!recipe.imageUrl && (
          <View style={styles.featuredEmojiFallback}>
            <AppText style={{ fontSize: 80 }}>{recipe.emoji}</AppText>
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.18)', 'rgba(0,0,0,0.72)']}
          locations={[0, 0.45, 1]}
          style={styles.featuredGradient}
        >
          <AppText size="xs" color="rgba(255,255,255,0.65)" family="medium">
            ⚡ Em destaque
          </AppText>
          <AppText size="xl" family="semiBold" color="#fff" numberOfLines={2} style={{ lineHeight: 30 }}>
            {recipe.title}
          </AppText>
          <View style={styles.featuredMeta}>
            <Clock size={13} color="rgba(255,255,255,0.7)" strokeWidth={2} />
            <AppText size="sm" color="rgba(255,255,255,0.85)">{recipe.duration} min</AppText>
            <AppText size="sm" color="rgba(255,255,255,0.4)">·</AppText>
            <Users size={13} color="rgba(255,255,255,0.7)" strokeWidth={2} />
            <AppText size="sm" color="rgba(255,255,255,0.85)">{recipe.servings} porções</AppText>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}

function RecipeCard({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.recipeCard, pressed && { opacity: 0.82 }]}
      onPress={onPress}
    >
      {recipe.imageUrl ? (
        <Image source={{ uri: recipe.imageUrl }} style={styles.recipeThumb} />
      ) : (
        <View style={[styles.recipeThumb, styles.recipeThumbFallback]}>
          <AppText style={{ fontSize: 38 }}>{recipe.emoji}</AppText>
        </View>
      )}
      <View style={styles.recipeInfo}>
        <AppText size="xs" color={theme.colors.primary} family="medium">
          {recipe.category.toUpperCase()}
        </AppText>
        <AppText size="base" family="semiBold" numberOfLines={2} style={styles.recipeTitle}>
          {recipe.title}
        </AppText>
        <View style={styles.recipeMeta}>
          <Clock size={12} color={theme.colors.textMuted} strokeWidth={2} />
          <AppText size="xs" color={theme.colors.textMuted}>{recipe.duration} min</AppText>
          <AppText size="xs" color={theme.colors.border}>  ·  </AppText>
          <Users size={12} color={theme.colors.textMuted} strokeWidth={2} />
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: top + 8 }]}>
          <View>
            <AppText size="sm" color={theme.colors.textMuted}>Bem-vindo de volta 👋</AppText>
            <AppText size="2xl" family="semiBold">O que cozinhar hoje?</AppText>
          </View>
          <Input
            placeholder="Buscar receita..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={18} color={theme.colors.textMuted} strokeWidth={1.8} />}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {categories.map((cat) => {
            const isActive = (cat === 'Todas' && !activeCategory) || activeCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setActiveCategory(cat === 'Todas' ? null : cat)}
              >
                <AppText
                  size="sm"
                  family="medium"
                  color={isActive ? '#fff' : theme.colors.text}
                >
                  {cat}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>

        {featured && (
          <FeaturedCard
            recipe={featured}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: featured.id })}
          />
        )}

        {rest.length > 0 && (
          <View style={styles.listSection}>
            <AppText size="lg" family="semiBold" style={styles.listTitle}>
              Mais receitas
            </AppText>
            {rest.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
