import React, { useState, useMemo } from 'react';
import { FlatList, Pressable, ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search } from 'lucide-react-native';

import { AppText } from '@ui/components/AppText';
import { ProductImage } from '@ui/components/ProductImage';
import { Input } from '@ui/components/Input';
import { theme } from '@ui/styles/theme';
import { useAppData } from '@app/context/AppDataContext';
import { AppStackNavigationProps } from '@app/navigation/types';
import { styles } from './styles';

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
          <AppText size="2xl" family="semiBold">Receitas</AppText>
          <Input
            placeholder="Buscar receita..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={18} color={theme.colors.textMuted} strokeWidth={1.8} />}
          />
        </View>

        {/* Category filter */}
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

        {/* Featured recipe */}
        {featured && (
          <Pressable
            style={({ pressed }) => [styles.featuredCard, pressed && { opacity: 0.88 }]}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: featured.id })}
          >
            <ProductImage emoji={featured.emoji} size={72} bgColor="rgba(255,255,255,0.2)" />
            <View style={styles.featuredInfo}>
              <AppText size="xs" color="rgba(255,255,255,0.75)" family="medium">
                ⚡ Aproveite agora
              </AppText>
              <AppText size="lg" family="semiBold" color="#fff" numberOfLines={2}>
                {featured.title}
              </AppText>
              <AppText size="sm" color="rgba(255,255,255,0.75)">
                {featured.duration} min · {featured.servings} porções
              </AppText>
            </View>
          </Pressable>
        )}

        {/* Recipe grid */}
        <FlatList
          data={rest}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.gridCard, pressed && { opacity: 0.8 }]}
              onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
            >
              <ProductImage emoji={item.emoji} size={56} />
              <AppText size="sm" family="semiBold" align="center" numberOfLines={2}>
                {item.title}
              </AppText>
              <AppText size="xs" color={theme.colors.textMuted}>
                {item.duration} min
              </AppText>
            </Pressable>
          )}
        />
      </ScrollView>
    </View>
  );
}
