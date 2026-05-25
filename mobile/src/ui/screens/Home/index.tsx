import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Bell, Search, Leaf, ArrowUpRight, Clock } from 'lucide-react-native';

import { Tag } from '@ui/components/Tag';
import { theme } from '@ui/styles/theme';
import {
  useAppData,
  getDaysUntilExpiry,
  getExpiryStatus,
  formatExpiryLabel,
} from '@app/context/AppDataContext';
import { getCategoryColor, getCategoryIcon, getLocationName } from '@app/utils/categories';
import { AppStackNavigationProps } from '@app/navigation/types';
import { PantryItem, Recipe } from '@app/types';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return 'Boa noite';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function FoodPhoto({ item, size = 52, radius = 14 }: { item: PantryItem; size?: number; radius?: number }) {
  if (item.photo) {
    return (
      <Image
        source={{ uri: item.photo }}
        style={{ width: size, height: size, borderRadius: radius }}
        resizeMode="cover"
      />
    );
  }
  return (
    <View style={{
      width: size, height: size, borderRadius: radius,
      backgroundColor: getCategoryColor(item.category),
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ fontSize: size * 0.45 }}>{item.emoji}</Text>
    </View>
  );
}

function Eyebrow({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <Text style={{
      fontFamily: theme.fontFamily.mono.regular,
      fontSize: 9.5,
      letterSpacing: 0.12 * 9.5,
      textTransform: 'uppercase',
      color: dark ? 'rgba(250,245,235,0.7)' : theme.colors.muted,
    }}>
      {children}
    </Text>
  );
}

function ResumeBox({ n, label, sub, accent }: { n: number; label: string; sub: string; accent: string }) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.canvas,
      borderRadius: 18,
      padding: 14,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: accent }} />
        <Text style={{
          fontFamily: theme.fontFamily.mono.regular,
          fontSize: 9.5,
          letterSpacing: 0.12 * 9.5,
          textTransform: 'uppercase',
          color: theme.colors.muted,
        }}>{label}</Text>
      </View>
      <Text style={{
        fontFamily: theme.fontFamily.display.italic,
        fontSize: 40,
        color: theme.colors.ink,
        lineHeight: 44,
      }}>{n}</Text>
      <Text style={{
        fontFamily: theme.fontFamily.sans.regular,
        fontSize: 11,
        color: theme.colors.muted,
        marginTop: 2,
      }}>{sub}</Text>
    </View>
  );
}

function RecipeCard({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: 240,
        backgroundColor: theme.colors.surface,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: theme.colors.hairline,
        overflow: 'hidden',
        flexShrink: 0,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      {recipe.photo ? (
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: recipe.photo }}
            style={{ width: '100%', height: 140 }}
            resizeMode="cover"
          />
          <View style={{
            position: 'absolute', top: 10, left: 10,
            backgroundColor: theme.colors.canvas,
            borderRadius: theme.radii.pill,
            paddingHorizontal: 10, paddingVertical: 4,
            flexDirection: 'row', alignItems: 'center', gap: 4,
          }}>
            <Text style={{ fontSize: 10 }}>✦</Text>
            <Text style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 9.5,
              color: theme.colors.ink,
            }}>{recipe.have}/{recipe.total} itens</Text>
          </View>
        </View>
      ) : (
        <View style={{ width: '100%', height: 140, backgroundColor: theme.colors.block.sage, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 48 }}>{recipe.emoji}</Text>
        </View>
      )}
      <View style={{ padding: 14, gap: 6 }}>
        <Text style={{
          fontFamily: theme.fontFamily.sans.medium,
          fontSize: 15,
          color: theme.colors.ink,
        }} numberOfLines={1}>{recipe.title}</Text>
        <Text style={{
          fontFamily: theme.fontFamily.sans.regular,
          fontSize: 12,
          color: theme.colors.muted,
        }} numberOfLines={1}>{recipe.reason}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Clock size={12} color={theme.colors.muted} strokeWidth={1.6} />
            <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 12, color: theme.colors.muted }}>
              {recipe.duration} min
            </Text>
          </View>
          <Text style={{ color: theme.colors.muted, fontSize: 12 }}>·</Text>
          <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 12, color: theme.colors.muted }}>
            {recipe.servings} porções
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function FoodTileCard({ item, onPress }: { item: PantryItem; onPress: () => void }) {
  const days = getDaysUntilExpiry(item.expiresAt);
  const status = getExpiryStatus(item.expiresAt);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: 168,
        padding: 14,
        backgroundColor: theme.colors.surface,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: theme.colors.hairline,
        gap: 10,
        flexShrink: 0,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      <FoodPhoto item={item} size={140} radius={14} />
      <View style={{ gap: 4 }}>
        <Text style={{
          fontFamily: theme.fontFamily.sans.medium,
          fontSize: 14,
          color: theme.colors.ink,
        }} numberOfLines={1}>{item.name}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{
            fontFamily: theme.fontFamily.sans.regular,
            fontSize: 12,
            color: theme.colors.muted,
          }}>{getLocationName(item.locationId)}</Text>
          <Tag label={formatExpiryLabel(days)} tone={status} size="sm" />
        </View>
      </View>
    </Pressable>
  );
}

export function Home() {
  const { top } = useSafeAreaInsets();
  const { pantryItems, expiringItems, recipes, shoppingItems } = useAppData();
  const navigation = useNavigation<AppStackNavigationProps>();
  const tabNavigation = useNavigation<any>();

  const urgent = useMemo(
    () =>
      pantryItems
        .filter((i) => ['expired', 'urgent'].includes(getExpiryStatus(i.expiresAt)))
        .sort((a, b) => getDaysUntilExpiry(a.expiresAt) - getDaysUntilExpiry(b.expiresAt)),
    [pantryItems],
  );

  const counts = useMemo(() => ({
    expired: pantryItems.filter((i) => getExpiryStatus(i.expiresAt) === 'expired').length,
    urgent:  pantryItems.filter((i) => getExpiryStatus(i.expiresAt) === 'urgent').length,
    soon:    pantryItems.filter((i) => getExpiryStatus(i.expiresAt) === 'soon').length,
    safe:    pantryItems.filter((i) => ['planned', 'safe'].includes(getExpiryStatus(i.expiresAt))).length,
  }), [pantryItems]);

  const featured = urgent[0];
  const nextInLine = urgent.slice(1, 6);
  const suggested = recipes.slice(0, 3);
  const shopChecked = shoppingItems.filter((s) => s.checked).length;
  const shopUnchecked = shoppingItems.filter((s) => !s.checked);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.canvas} />

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* ── Header ── */}
        <View style={{
          paddingTop: top + 14,
          paddingHorizontal: 18,
          paddingBottom: 4,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 42, height: 42, borderRadius: 999, backgroundColor: theme.colors.block.sage, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 18 }}>👤</Text>
            </View>
            <View style={{ gap: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{
                  fontFamily: theme.fontFamily.mono.regular,
                  fontSize: 9.5,
                  letterSpacing: 0.12 * 9.5,
                  textTransform: 'uppercase',
                  color: theme.colors.muted,
                }}>{greeting()}</Text>
                <View style={{
                  paddingHorizontal: 6, paddingVertical: 2,
                  borderRadius: 999,
                  backgroundColor: theme.colors.ink,
                }}>
                  <Text style={{
                    fontFamily: theme.fontFamily.mono.regular,
                    fontSize: 8.5,
                    letterSpacing: 0.12 * 8.5,
                    textTransform: 'uppercase',
                    color: theme.colors.block.pistachio,
                  }}>✰ Premium</Text>
                </View>
              </View>
              <Text style={{
                fontFamily: theme.fontFamily.sans.medium,
                fontSize: 15,
                color: theme.colors.ink,
              }}>Marina</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable style={{
              width: 40, height: 40, borderRadius: 999,
              borderWidth: 1, borderColor: theme.colors.hairline,
              backgroundColor: theme.colors.surface,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Search size={18} color={theme.colors.ink} strokeWidth={1.6} />
            </Pressable>
            <Pressable
              onPress={() => tabNavigation.navigate('Alerts')}
              style={{ position: 'relative' }}
            >
              <View style={{
                width: 40, height: 40, borderRadius: 999,
                borderWidth: 1, borderColor: theme.colors.hairline,
                backgroundColor: theme.colors.surface,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Bell size={18} color={theme.colors.ink} strokeWidth={1.6} />
              </View>
              <View style={{
                position: 'absolute', top: 6, right: 6,
                width: 8, height: 8, borderRadius: 4,
                backgroundColor: theme.colors.danger,
                borderWidth: 2, borderColor: theme.colors.canvas,
              }} />
            </Pressable>
          </View>
        </View>

        {/* ── Hero — Use primeiro ── */}
        <View style={{ paddingHorizontal: 18, paddingTop: 14, paddingBottom: 6 }}>
          <Eyebrow>Use primeiro</Eyebrow>
          <Text style={{
            fontFamily: theme.fontFamily.display.regular,
            fontSize: 38,
            color: theme.colors.ink,
            marginTop: 8,
            marginBottom: 14,
            lineHeight: 42,
          }}>
            {counts.expired + counts.urgent} itens{'\n'}
            pedem <Text style={{ fontStyle: 'italic' }}>cuidado.</Text>
          </Text>

          {/* Featured urgent card */}
          {featured && (
            <Pressable
              onPress={() => tabNavigation.navigate('Alerts')}
              style={({ pressed }) => ({
                backgroundColor: theme.colors.ink,
                borderRadius: 24,
                overflow: 'hidden',
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <View style={{ position: 'relative' }}>
                {featured.photo ? (
                  <Image
                    source={{ uri: featured.photo }}
                    style={{ width: '100%', height: 140 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={{ width: '100%', height: 140, backgroundColor: getCategoryColor(featured.category), alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 64 }}>{featured.emoji}</Text>
                  </View>
                )}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0)', }} />
                <View style={{ position: 'absolute', top: 12, left: 12 }}>
                  <Tag
                    label={formatExpiryLabel(getDaysUntilExpiry(featured.expiresAt))}
                    tone={getExpiryStatus(featured.expiresAt)}
                    size="sm"
                  />
                </View>
              </View>
              <View style={{ padding: 14, gap: 10 }}>
                <View style={{ gap: 4 }}>
                  <Eyebrow dark>O mais urgente</Eyebrow>
                  <Text style={{
                    fontFamily: theme.fontFamily.display.regular,
                    fontSize: 24,
                    color: theme.colors.canvas,
                  }}>{featured.name}</Text>
                  <Text style={{
                    fontFamily: theme.fontFamily.sans.regular,
                    fontSize: 13,
                    color: 'rgba(250,245,235,0.7)',
                  }}>
                    {featured.quantity} {featured.unit} · {getLocationName(featured.locationId)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <View style={{
                    height: 34, paddingHorizontal: 14, borderRadius: 999,
                    backgroundColor: 'rgba(250,245,235,0.15)',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{
                      fontFamily: theme.fontFamily.sans.medium,
                      fontSize: 13,
                      color: theme.colors.canvas,
                    }}>Marcar consumido</Text>
                  </View>
                  <View style={{
                    height: 34, paddingHorizontal: 14, borderRadius: 999,
                    backgroundColor: theme.colors.canvas,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{
                      fontFamily: theme.fontFamily.sans.medium,
                      fontSize: 13,
                      color: theme.colors.ink,
                    }}>Ver receita</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
        </View>

        {/* ── Próximos da fila ── */}
        <View style={{ paddingTop: 18, paddingBottom: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, marginBottom: 10 }}>
            <Eyebrow>· Próximos da fila ·</Eyebrow>
            <Pressable onPress={() => tabNavigation.navigate('Alerts')}>
              <Text style={{
                fontFamily: theme.fontFamily.sans.regular,
                fontSize: 13,
                color: theme.colors.ink,
                textDecorationLine: 'underline',
              }}>Ver todos</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 18, gap: 12, paddingBottom: 12 }}
          >
            {(nextInLine.length > 0 ? nextInLine : expiringItems.slice(0, 5)).map((item) => (
              <FoodTileCard key={item.id} item={item} onPress={() => tabNavigation.navigate('Alerts')} />
            ))}
          </ScrollView>
        </View>

        {/* ── Resumo pistachio block ── */}
        <View style={{ paddingHorizontal: 18, paddingVertical: 10 }}>
          <View style={{
            backgroundColor: theme.colors.block.pistachio,
            borderRadius: 22,
            padding: 22,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <Eyebrow>Resumo</Eyebrow>
              <Leaf size={20} color={theme.colors.ink} strokeWidth={1.6} />
            </View>
            <Text style={{
              fontFamily: theme.fontFamily.display.regular,
              fontSize: 24,
              color: theme.colors.ink,
              marginBottom: 16,
            }}>
              Sua despensa em <Text style={{ fontStyle: 'italic' }}>números.</Text>
            </Text>
            <View style={{ flexDirection: 'row', gap: 14 }}>
              <ResumeBox
                n={counts.expired + counts.urgent}
                label="Em risco"
                sub={`${counts.expired} vencidos · ${counts.urgent} urgentes`}
                accent={theme.colors.danger}
              />
              <ResumeBox
                n={counts.soon}
                label="Próximos"
                sub="6–15 dias"
                accent={theme.colors.soon}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 14, marginTop: 14 }}>
              <ResumeBox
                n={counts.safe}
                label="Seguros"
                sub="+15 dias"
                accent={theme.colors.safe}
              />
              <ResumeBox
                n={pantryItems.length}
                label="Total"
                sub="em 3 locais"
                accent={theme.colors.ink}
              />
            </View>
          </View>
        </View>

        {/* ── Receitas sugeridas ── */}
        <View style={{ paddingTop: 18 }}>
          <View style={{ paddingHorizontal: 18, marginBottom: 12 }}>
            <Eyebrow>Cozinhe com o que tem</Eyebrow>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 6 }}>
              <Text style={{
                fontFamily: theme.fontFamily.display.regular,
                fontSize: 24,
                color: theme.colors.ink,
              }}>
                Receitas <Text style={{ fontStyle: 'italic' }}>sugeridas</Text>
              </Text>
              <Pressable onPress={() => navigation.navigate('Recipes')}>
                <Text style={{
                  fontFamily: theme.fontFamily.mono.regular,
                  fontSize: 9.5,
                  letterSpacing: 0.12 * 9.5,
                  color: theme.colors.ink,
                  textTransform: 'uppercase',
                }}>VER TODAS →</Text>
              </Pressable>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 18, gap: 12, paddingBottom: 16 }}
          >
            {suggested.map((r) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: r.id })}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Shopping list summary ── */}
        <View style={{ paddingHorizontal: 18, paddingBottom: 16 }}>
          <Pressable
            onPress={() => tabNavigation.navigate('ShoppingList')}
            style={({ pressed }) => ({
              backgroundColor: theme.colors.surface,
              borderRadius: 22,
              padding: 18,
              borderWidth: 1,
              borderColor: theme.colors.hairline,
              opacity: pressed ? 0.88 : 1,
            })}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Eyebrow>Lista de compras</Eyebrow>
              <ArrowUpRight size={16} color={theme.colors.ink} strokeWidth={1.6} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <View style={{ gap: 4 }}>
                <Text style={{
                  fontFamily: theme.fontFamily.display.italic,
                  fontSize: 32,
                  color: theme.colors.ink,
                }}>
                  {shopChecked}{' '}
                  <Text style={{ fontFamily: theme.fontFamily.display.regular, fontSize: 20, color: theme.colors.muted }}>
                    / {shoppingItems.length}
                  </Text>
                </Text>
                <Text style={{
                  fontFamily: theme.fontFamily.mono.regular,
                  fontSize: 9.5,
                  letterSpacing: 0.12 * 9.5,
                  textTransform: 'uppercase',
                  color: theme.colors.muted,
                }}>itens comprados</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                {shoppingItems.slice(0, 6).map((s, i) => (
                  <View key={i} style={{
                    width: 8,
                    height: s.checked ? 28 : 14,
                    backgroundColor: s.checked ? theme.colors.ink : theme.colors.hairline,
                    borderRadius: 4,
                  }} />
                ))}
              </View>
            </View>
            {shopUnchecked.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                {shopUnchecked.slice(0, 3).map((s) => (
                  <View key={s.id} style={{
                    height: 26,
                    paddingHorizontal: 10,
                    borderRadius: 999,
                    backgroundColor: s.duplicate ? theme.colors.urgentSoft : theme.colors.surfaceSoft,
                    justifyContent: 'center',
                  }}>
                    <Text style={{
                      fontFamily: theme.fontFamily.sans.medium,
                      fontSize: 12,
                      color: s.duplicate ? theme.colors.urgent : theme.colors.ink,
                    }}>{s.name}</Text>
                  </View>
                ))}
                {shopUnchecked.length > 3 && (
                  <View style={{
                    height: 26, paddingHorizontal: 10, borderRadius: 999,
                    backgroundColor: theme.colors.surfaceSoft, justifyContent: 'center',
                  }}>
                    <Text style={{
                      fontFamily: theme.fontFamily.sans.medium,
                      fontSize: 12,
                      color: theme.colors.muted,
                    }}>+{shopUnchecked.length - 3} mais</Text>
                  </View>
                )}
              </View>
            )}
          </Pressable>
        </View>

        {/* Quick links — Insights + Household */}
        <View style={{ paddingHorizontal: 18, paddingBottom: 8, flexDirection: 'row', gap: 10 }}>
          <Pressable
            onPress={() => navigation.navigate('Insights')}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: theme.colors.block.pistachio,
              borderRadius: 18,
              padding: 16,
              gap: 8,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ fontFamily: theme.fontFamily.mono.regular, fontSize: 9.5, letterSpacing: 0.12 * 9.5, textTransform: 'uppercase', color: theme.colors.muted }}>Relatório</Text>
            <Text style={{ fontFamily: theme.fontFamily.display.regular, fontSize: 20, color: theme.colors.ink, lineHeight: 24 }}>
              Seus <Text style={{ fontStyle: 'italic' }}>dados.</Text>
            </Text>
            <ArrowUpRight size={16} color={theme.colors.ink} strokeWidth={1.6} />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Household')}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: theme.colors.surface,
              borderRadius: 18,
              padding: 16,
              gap: 8,
              borderWidth: 1,
              borderColor: theme.colors.hairline,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ fontFamily: theme.fontFamily.mono.regular, fontSize: 9.5, letterSpacing: 0.12 * 9.5, textTransform: 'uppercase', color: theme.colors.muted }}>Casa</Text>
            <Text style={{ fontFamily: theme.fontFamily.display.regular, fontSize: 20, color: theme.colors.ink, lineHeight: 24 }}>
              Sua <Text style={{ fontStyle: 'italic' }}>equipe.</Text>
            </Text>
            <ArrowUpRight size={16} color={theme.colors.ink} strokeWidth={1.6} />
          </Pressable>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
