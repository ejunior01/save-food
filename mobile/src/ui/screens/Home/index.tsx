import React from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScanLine, ChefHat, ArrowRight } from 'lucide-react-native';

import { AppText } from '@ui/components/AppText';
import { ProductImage } from '@ui/components/ProductImage';
import { Tag } from '@ui/components/Tag';
import { theme } from '@ui/styles/theme';
import { useAppData, getDaysUntilExpiry, getExpiryStatus, formatExpiryLabel } from '@app/context/AppDataContext';
import { getCategoryIcon } from '@app/utils/categories';
import { AppStackNavigationProps } from '@app/navigation/types';

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

  const mostUrgent = expiringItems[0];
  const suggestedRecipes = recipes.slice(0, 3);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Header ── */}
        <View style={{
          paddingTop: top + 20,
          paddingHorizontal: 20,
          paddingBottom: 8,
        }}>
          <AppText size="xs" family="medium" color={theme.colors.textMuted}
            style={{ letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
            DespensaCerta
          </AppText>
          <AppText
            family="displayItalic"
            style={{ fontSize: 36, lineHeight: 42, color: theme.colors.text }}
          >
            Sua despensa,{'\n'}sempre fresca.
          </AppText>
        </View>

        {/* ── Urgency featured card (dark) ── */}
        {mostUrgent && (
          <Pressable
            onPress={() => tabNavigation.navigate('Alerts')}
            style={({ pressed }) => ({
              marginHorizontal: 20,
              marginTop: 20,
              marginBottom: 4,
              backgroundColor: theme.colors.text,
              borderRadius: theme.radii.lg,
              padding: 20,
              opacity: pressed ? 0.88 : 1,
            })}
          >
            <AppText size="xs" family="medium" color="rgba(255,255,255,0.55)"
              style={{ letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>
              Atenção urgente
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{
                width: 52, height: 52, borderRadius: theme.radii.md,
                backgroundColor: 'rgba(255,255,255,0.1)',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <AppText style={{ fontSize: 28 }}>{getCategoryIcon(mostUrgent.category)}</AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText family="display" color="#fff"
                  style={{ fontSize: 20, lineHeight: 26 }} numberOfLines={1}>
                  {mostUrgent.name}
                </AppText>
                <AppText size="sm" color="rgba(255,255,255,0.65)" style={{ marginTop: 2 }}>
                  {mostUrgent.quantity} {mostUrgent.unit}
                </AppText>
              </View>
              <Tag
                label={formatExpiryLabel(getDaysUntilExpiry(mostUrgent.expiresAt))}
                tone={getExpiryStatus(mostUrgent.expiresAt)}
                style={{ flexShrink: 0 }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 14 }}>
              <AppText size="xs" family="medium" color="rgba(255,255,255,0.55)">
                Ver todos os alertas
              </AppText>
              <ArrowRight size={13} color="rgba(255,255,255,0.45)" strokeWidth={2} />
            </View>
          </Pressable>
        )}

        {/* ── Pistachio summary block ── */}
        <View style={{
          marginHorizontal: 20,
          marginTop: 12,
          marginBottom: 8,
          backgroundColor: theme.colors.block.pistachio,
          borderRadius: theme.radii.lg,
          padding: 20,
          flexDirection: 'row',
        }}>
          <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
            <AppText family="display" style={{ fontSize: 32, color: theme.colors.text }}>
              {pantryItems.length}
            </AppText>
            <AppText size="xs" family="medium" color={theme.colors.textMuted}
              style={{ letterSpacing: 0.8, textTransform: 'uppercase' }}>
              Total
            </AppText>
          </View>
          <View style={{ width: 1, backgroundColor: 'rgba(26,43,31,0.15)' }} />
          <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
            <AppText family="display" style={{ fontSize: 32, color: theme.colors.danger.DEFAULT }}>
              {expiredCount + urgentCount}
            </AppText>
            <AppText size="xs" family="medium" color={theme.colors.textMuted}
              style={{ letterSpacing: 0.8, textTransform: 'uppercase' }}>
              Urgente
            </AppText>
          </View>
          <View style={{ width: 1, backgroundColor: 'rgba(26,43,31,0.15)' }} />
          <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
            <AppText family="display" style={{ fontSize: 32, color: theme.colors.success.DEFAULT }}>
              {okCount}
            </AppText>
            <AppText size="xs" family="medium" color={theme.colors.textMuted}
              style={{ letterSpacing: 0.8, textTransform: 'uppercase' }}>
              OK
            </AppText>
          </View>
        </View>

        {/* ── Quick actions ── */}
        <View style={{
          flexDirection: 'row',
          gap: 10,
          paddingHorizontal: 20,
          marginTop: 16,
          marginBottom: 8,
        }}>
          <Pressable
            onPress={() => tabNavigation.navigate('Scanner')}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.md,
              padding: 16,
              alignItems: 'center',
              gap: 8,
              borderWidth: 1,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <ScanLine size={22} color={theme.colors.primary} strokeWidth={1.8} />
            <AppText size="xs" family="medium" color={theme.colors.textMuted}
              style={{ letterSpacing: 0.8, textTransform: 'uppercase' }}>
              Escanear
            </AppText>
          </Pressable>
          <Pressable
            onPress={() => tabNavigation.navigate('Recipes')}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.md,
              padding: 16,
              alignItems: 'center',
              gap: 8,
              borderWidth: 1,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <ChefHat size={22} color={theme.colors.primary} strokeWidth={1.8} />
            <AppText size="xs" family="medium" color={theme.colors.textMuted}
              style={{ letterSpacing: 0.8, textTransform: 'uppercase' }}>
              Receitas
            </AppText>
          </Pressable>
        </View>

        {/* ── Expiring soon ── */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginTop: 20,
          marginBottom: 12,
        }}>
          <AppText size="xs" family="medium" color={theme.colors.textMuted}
            style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>
            Vencendo em breve
          </AppText>
          <Pressable onPress={() => tabNavigation.navigate('Alerts')}>
            <AppText size="xs" family="medium" color={theme.colors.primary}
              style={{ letterSpacing: 0.8 }}>
              Ver todos
            </AppText>
          </Pressable>
        </View>

        <FlatList
          horizontal
          data={expiringItems}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
          renderItem={({ item }) => {
            const days = getDaysUntilExpiry(item.expiresAt);
            const status = getExpiryStatus(item.expiresAt);
            return (
              <View style={{
                width: 120,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radii.md,
                padding: 12,
                gap: 8,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}>
                <ProductImage emoji={getCategoryIcon(item.category)} size={44} />
                <AppText size="sm" family="medium" numberOfLines={1}>
                  {item.name}
                </AppText>
                <Tag label={formatExpiryLabel(days)} tone={status} size="sm" />
              </View>
            );
          }}
        />

        {/* ── Recipe suggestions ── */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginTop: 24,
          marginBottom: 12,
        }}>
          <AppText size="xs" family="medium" color={theme.colors.textMuted}
            style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>
            Receitas sugeridas
          </AppText>
          <Pressable onPress={() => tabNavigation.navigate('Recipes')}>
            <AppText size="xs" family="medium" color={theme.colors.primary}
              style={{ letterSpacing: 0.8 }}>
              Ver todas
            </AppText>
          </Pressable>
        </View>

        {suggestedRecipes.map((recipe, i) => (
          <Pressable
            key={recipe.id}
            style={({ pressed }) => ({
              marginHorizontal: 20,
              marginBottom: 10,
              backgroundColor: i === 0 ? theme.colors.block.cream : theme.colors.surface,
              borderRadius: theme.radii.md,
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              borderWidth: 1,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.8 : 1,
            })}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
          >
            <ProductImage emoji={recipe.emoji} size={52} />
            <View style={{ flex: 1, gap: 4 }}>
              <AppText size="xs" family="medium" color={theme.colors.primary}
                style={{ letterSpacing: 0.8, textTransform: 'uppercase' }}>
                {recipe.category}
              </AppText>
              <AppText family="display" style={{ fontSize: 17, lineHeight: 22 }} numberOfLines={2}>
                {recipe.title}
              </AppText>
              <AppText size="xs" color={theme.colors.textMuted}>
                {recipe.duration} min · {recipe.servings} porções
              </AppText>
            </View>
          </Pressable>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}
