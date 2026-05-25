import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bookmark, Flame, MoreHorizontal, Plus } from 'lucide-react-native';

import { Tag } from '@ui/components/Tag';
import { theme } from '@ui/styles/theme';
import { useAppData } from '@app/context/AppDataContext';
import { AppStackScreenProps } from '@app/navigation/types';

type Props = AppStackScreenProps<'RecipeDetail'>;

function Eyebrow({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <Text style={{
      fontFamily: theme.fontFamily.mono.regular,
      fontSize: 9.5,
      letterSpacing: 0.12 * 9.5,
      textTransform: 'uppercase',
      color: dark ? 'rgba(250,245,235,0.7)' : theme.colors.muted,
    }}>{children}</Text>
  );
}

function MiniStat({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {icon}
        <Text style={{
          fontFamily: theme.fontFamily.display.italic,
          fontSize: 22,
          color: theme.colors.ink,
        }}>{value}</Text>
      </View>
      <Text style={{
        fontFamily: theme.fontFamily.mono.regular,
        fontSize: 9.5,
        letterSpacing: 0.12 * 9.5,
        textTransform: 'uppercase',
        color: theme.colors.muted,
      }}>{label}</Text>
    </View>
  );
}

export function RecipeDetail({ route, navigation }: Props) {
  const { bottom } = useSafeAreaInsets();
  const { recipes } = useAppData();
  const r = recipes.find((x) => x.id === route.params.recipeId) ?? recipes[0];

  if (!r) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.canvas, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: theme.fontFamily.sans.regular, color: theme.colors.muted }}>Receita não encontrada</Text>
      </View>
    );
  }

  const missing = r.missing ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero photo */}
        <View style={{ position: 'relative' }}>
          {r.photo ? (
            <Image
              source={{ uri: r.photo }}
              style={{ width: '100%', height: 320 }}
              resizeMode="cover"
            />
          ) : (
            <View style={{ width: '100%', height: 320, backgroundColor: theme.colors.block.sage, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 80 }}>{r.emoji}</Text>
            </View>
          )}
          {/* Dark overlay gradient */}
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.22)',
          }} />
          {/* Nav */}
          <View style={{ position: 'absolute', top: 52, left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                width: 40, height: 40, borderRadius: 999,
                backgroundColor: 'rgba(0,0,0,0.35)',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ArrowLeft size={18} color="#fff" strokeWidth={1.6} />
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable style={{
                width: 40, height: 40, borderRadius: 999,
                backgroundColor: 'rgba(0,0,0,0.35)',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Bookmark size={18} color="#fff" strokeWidth={1.6} />
              </Pressable>
              <Pressable style={{
                width: 40, height: 40, borderRadius: 999,
                backgroundColor: 'rgba(0,0,0,0.35)',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <MoreHorizontal size={18} color="#fff" strokeWidth={1.6} />
              </Pressable>
            </View>
          </View>
          {/* Title overlay */}
          <View style={{ position: 'absolute', bottom: 18, left: 18, right: 18 }}>
            <View style={{
              height: 28, paddingHorizontal: 10, borderRadius: 999,
              backgroundColor: theme.colors.block.peach,
              flexDirection: 'row', alignItems: 'center', gap: 5,
              alignSelf: 'flex-start',
              marginBottom: 14,
            }}>
              <Text style={{ fontSize: 12 }}>🔥</Text>
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9.5,
                letterSpacing: 0.12 * 9.5,
                textTransform: 'uppercase',
                color: theme.colors.ink,
              }}>Use primeiro</Text>
            </View>
            <Eyebrow dark>{`Almoço · ${r.servings} porções`}</Eyebrow>
            <Text style={{
              fontFamily: theme.fontFamily.display.regular,
              fontSize: 42,
              color: theme.colors.canvas,
              marginTop: 8,
              lineHeight: 46,
            }}>{r.title}</Text>
          </View>
        </View>

        {/* Match block */}
        <View style={{ paddingHorizontal: 18, paddingTop: 14 }}>
          <View style={{
            backgroundColor: theme.colors.block.pistachio,
            borderRadius: 18,
            padding: 16,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ gap: 4, flex: 1 }}>
                <Eyebrow>Por que sugerimos</Eyebrow>
                <Text style={{
                  fontFamily: theme.fontFamily.sans.medium,
                  fontSize: 14,
                  color: theme.colors.ink,
                }}>{r.reason}</Text>
              </View>
              <Text style={{
                fontFamily: theme.fontFamily.display.italic,
                fontSize: 36,
                color: theme.colors.ink,
                lineHeight: 40,
              }}>
                {r.have}
                <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 16, color: theme.colors.muted }}>
                  /{r.total}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Stats row */}
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 22,
          paddingVertical: 18,
          alignItems: 'center',
        }}>
          <MiniStat icon={<Text style={{ fontSize: 16 }}>⏱</Text>} value={r.duration} label="minutos" />
          <View style={{ width: 1, height: 36, backgroundColor: theme.colors.hairline }} />
          <MiniStat icon={<Text style={{ fontSize: 16 }}>👥</Text>} value={r.servings} label="porções" />
          <View style={{ width: 1, height: 36, backgroundColor: theme.colors.hairline }} />
          <MiniStat icon={<Flame size={16} color={theme.colors.ink} strokeWidth={1.6} />} value={r.level ?? 'Fácil'} label="dificuldade" />
        </View>

        {/* Ingredients */}
        <View style={{ paddingHorizontal: 18, paddingTop: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
            <View style={{ gap: 4 }}>
              <Eyebrow>Ingredientes</Eyebrow>
              <Text style={{
                fontFamily: theme.fontFamily.display.regular,
                fontSize: 22,
                color: theme.colors.ink,
              }}>O que você precisa</Text>
            </View>
            {missing.length > 0 && (
              <Pressable style={{
                height: 34, paddingHorizontal: 12, borderRadius: 999,
                backgroundColor: theme.colors.surface,
                borderWidth: 1, borderColor: theme.colors.hairline,
                flexDirection: 'row', alignItems: 'center', gap: 6,
              }}>
                <Plus size={14} color={theme.colors.ink} strokeWidth={1.6} />
                <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 13, color: theme.colors.ink }}>
                  Adicionar à lista
                </Text>
              </Pressable>
            )}
          </View>

          <View style={{ gap: 8 }}>
            {r.ingredients.map((ing, i) => (
              <View key={i} style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                backgroundColor: theme.colors.surface,
                padding: 10,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: theme.colors.hairline,
              }}>
                <View style={{
                  width: 24, height: 24, borderRadius: 999,
                  backgroundColor: ing.have ? theme.colors.safeSoft : theme.colors.dangerSoft,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{
                    color: ing.have ? theme.colors.safe : theme.colors.danger,
                    fontSize: 14,
                    fontWeight: '600',
                  }}>{ing.have ? '✓' : '+'}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{
                    fontFamily: theme.fontFamily.sans.medium,
                    fontSize: 14,
                    color: theme.colors.ink,
                  }}>{ing.name}</Text>
                  <Text style={{
                    fontFamily: theme.fontFamily.sans.regular,
                    fontSize: 12,
                    color: theme.colors.muted,
                  }}>
                    {ing.amount} · {ing.have
                      ? (ing.urgent ? 'você tem — usa antes de vencer' : 'você tem em casa')
                      : 'precisa comprar'}
                  </Text>
                </View>
                {ing.urgent && (
                  <Tag label="urgente" tone="urgent" size="sm" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Steps */}
        <View style={{ paddingHorizontal: 18, paddingTop: 24 }}>
          <Eyebrow>Modo de preparo</Eyebrow>
          <Text style={{
            fontFamily: theme.fontFamily.display.regular,
            fontSize: 22,
            color: theme.colors.ink,
            marginTop: 4,
            marginBottom: 14,
          }}>Passo a passo</Text>
          <View style={{ gap: 12 }}>
            {r.steps.map((step, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                <Text style={{
                  fontFamily: theme.fontFamily.display.italic,
                  fontSize: 32,
                  color: theme.colors.primary,
                  lineHeight: 36,
                  width: 36,
                  flexShrink: 0,
                }}>{String(i + 1).padStart(2, '0')}</Text>
                <Text style={{
                  fontFamily: theme.fontFamily.sans.regular,
                  fontSize: 14,
                  color: theme.colors.ink,
                  lineHeight: 20,
                  paddingTop: 4,
                  flex: 1,
                }}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fixed CTA */}
      <View style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: Math.max(bottom, 18),
        backgroundColor: 'transparent',
      }}>
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: theme.colors.canvas,
          opacity: 0.95,
        }} />
        <Pressable
          style={({ pressed }) => ({
            height: 54,
            borderRadius: 999,
            backgroundColor: theme.colors.ink,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            opacity: pressed ? 0.88 : 1,
          })}
        >
          <Text style={{
            fontFamily: theme.fontFamily.sans.semiBold,
            fontSize: 16,
            color: theme.colors.canvas,
          }}>Cozinhar agora</Text>
          <Flame size={18} color={theme.colors.canvas} strokeWidth={1.6} />
        </Pressable>
      </View>
    </View>
  );
}
