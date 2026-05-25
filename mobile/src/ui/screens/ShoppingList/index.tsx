import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Svg1, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Bell, Check, ChefHat, MoreHorizontal, Plus } from 'lucide-react-native';

import { theme } from '@ui/styles/theme';
import { useAppData } from '@app/context/AppDataContext';
import { useUpdateShoppingItem } from '@app/hooks/mutations/useUpdateShoppingItem';
import { getCategoryColor, getCategoryIcon } from '@app/utils/categories';
import { ShoppingItem } from '@app/types';

function Eyebrow({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <Text style={{
      fontFamily: theme.fontFamily.mono.regular,
      fontSize: 9.5,
      letterSpacing: 0.12 * 9.5,
      textTransform: 'uppercase',
      color: dark ? 'rgba(250,245,235,0.65)' : theme.colors.muted,
    }}>{children}</Text>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Pressable
        onPress={() => onChange(Math.max(1, value - 1))}
        hitSlop={6}
        style={{
          width: 26, height: 26, borderRadius: 8,
          backgroundColor: theme.colors.surface,
          borderWidth: 1, borderColor: theme.colors.hairline,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 16, color: theme.colors.ink, lineHeight: 18 }}>−</Text>
      </Pressable>
      <Text style={{
        fontFamily: theme.fontFamily.sans.medium,
        fontSize: 14,
        color: theme.colors.ink,
        minWidth: 20,
        textAlign: 'center',
      }}>{value}</Text>
      <Pressable
        onPress={() => onChange(value + 1)}
        hitSlop={6}
        style={{
          width: 26, height: 26, borderRadius: 8,
          backgroundColor: theme.colors.surface,
          borderWidth: 1, borderColor: theme.colors.hairline,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 16, color: theme.colors.ink, lineHeight: 18 }}>+</Text>
      </Pressable>
    </View>
  );
}

export function ShoppingList() {
  const { top } = useSafeAreaInsets();
  const { shoppingItems, toggleShoppingItem } = useAppData();
  const { updateShoppingItem } = useUpdateShoppingItem();
  const navigation = useNavigation<any>();

  const checked = shoppingItems.filter((i) => i.checked).length;
  const pct = shoppingItems.length > 0 ? Math.round((checked / shoppingItems.length) * 100) : 0;
  const remaining = shoppingItems.length - checked;
  const circumference = 2 * Math.PI * 42;

  const groups = useMemo(() => {
    const g: Record<string, ShoppingItem[]> = {};
    shoppingItems.forEach((item) => {
      if (!g[item.category]) g[item.category] = [];
      g[item.category].push(item);
    });
    return Object.entries(g);
  }, [shoppingItems]);

  const hasDuplicate = shoppingItems.some((i) => i.duplicate && !i.checked);

  function setQty(item: ShoppingItem, qty: number) {
    updateShoppingItem({ id: item.id, updates: { quantity: qty } });
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.block.charcoal} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingTop: top + 14, paddingHorizontal: 18, paddingBottom: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable
            onPress={() => navigation.navigate('Home')}
            style={{
              width: 40, height: 40, borderRadius: 999,
              backgroundColor: 'rgba(250,245,235,0.15)',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ArrowLeft size={18} color={theme.colors.canvas} strokeWidth={1.6} />
          </Pressable>
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 9.5,
            letterSpacing: 0.12 * 9.5,
            textTransform: 'uppercase',
            color: 'rgba(250,245,235,0.65)',
          }}>Compras</Text>
          <Pressable style={{
            width: 40, height: 40, borderRadius: 999,
            backgroundColor: 'rgba(250,245,235,0.15)',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Plus size={18} color={theme.colors.canvas} strokeWidth={1.6} />
          </Pressable>
        </View>

        {/* Hero — charcoal color block */}
        <View style={{ paddingHorizontal: 18, paddingBottom: 14 }}>
          <View style={{
            backgroundColor: theme.colors.block.charcoal,
            borderRadius: 22,
            padding: 22,
          }}>
            <Eyebrow dark>· lista da semana ·</Eyebrow>
            <Text style={{
              fontFamily: theme.fontFamily.display.regular,
              fontSize: 38,
              color: theme.colors.canvas,
              marginTop: 8,
              marginBottom: 16,
              lineHeight: 42,
            }}>
              {remaining} itens{'\n'}para <Text style={{ fontStyle: 'italic' }}>comprar.</Text>
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <View style={{ gap: 4 }}>
                <Text style={{
                  fontFamily: theme.fontFamily.mono.regular,
                  fontSize: 9.5,
                  letterSpacing: 0.12 * 9.5,
                  textTransform: 'uppercase',
                  color: 'rgba(250,245,235,0.65)',
                }}>Progresso</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                  <Text style={{
                    fontFamily: theme.fontFamily.display.italic,
                    fontSize: 36,
                    color: theme.colors.canvas,
                  }}>{checked}</Text>
                  <Text style={{
                    fontFamily: theme.fontFamily.sans.regular,
                    fontSize: 15,
                    color: 'rgba(250,245,235,0.6)',
                  }}>/ {shoppingItems.length}</Text>
                </View>
              </View>
              {/* Circular progress */}
              <View style={{ width: 70, height: 70, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                <Svg1 width={70} height={70} style={{ position: 'absolute' }}>
                  <Circle cx={35} cy={35} r={29} fill="none" stroke="rgba(250,245,235,0.18)" strokeWidth={7} />
                  <Circle
                    cx={35} cy={35} r={29}
                    fill="none"
                    stroke={theme.colors.block.peach}
                    strokeWidth={7}
                    strokeLinecap="round"
                    strokeDasharray={`${(pct / 100) * 2 * Math.PI * 29} ${2 * Math.PI * 29}`}
                    transform="rotate(-90 35 35)"
                  />
                </Svg1>
                <Text style={{
                  fontFamily: theme.fontFamily.display.italic,
                  fontSize: 16,
                  color: theme.colors.canvas,
                }}>{pct}%</Text>
              </View>
            </View>

            <View style={{ height: 14 }} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{
                height: 36, paddingHorizontal: 14, borderRadius: 999,
                backgroundColor: 'rgba(250,245,235,0.15)',
                flexDirection: 'row', alignItems: 'center', gap: 6,
              }}>
                <Plus size={14} color={theme.colors.canvas} strokeWidth={1.6} />
                <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 13, color: theme.colors.canvas }}>
                  Adicionar item
                </Text>
              </View>
              <View style={{
                height: 36, paddingHorizontal: 14, borderRadius: 999,
                backgroundColor: theme.colors.canvas,
                flexDirection: 'row', alignItems: 'center', gap: 6,
              }}>
                <ChefHat size={14} color={theme.colors.ink} strokeWidth={1.6} />
                <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 13, color: theme.colors.ink }}>
                  Das receitas
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Duplicate warning */}
        {hasDuplicate && (
          <View style={{ paddingHorizontal: 18, paddingBottom: 14 }}>
            <View style={{
              backgroundColor: theme.colors.block.cream,
              borderRadius: 18,
              padding: 14,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 12,
            }}>
              <View style={{
                width: 36, height: 36, borderRadius: 999,
                backgroundColor: theme.colors.ink,
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Bell size={18} color={theme.colors.canvas} strokeWidth={1.6} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{
                  fontFamily: theme.fontFamily.mono.regular,
                  fontSize: 9.5,
                  letterSpacing: 0.12 * 9.5,
                  textTransform: 'uppercase',
                  color: theme.colors.muted,
                }}>· cuidado com duplicidade ·</Text>
                <Text style={{
                  fontFamily: theme.fontFamily.sans.regular,
                  fontSize: 13,
                  color: theme.colors.ink,
                  lineHeight: 18,
                }}>
                  Você já tem <Text style={{ fontFamily: theme.fontFamily.sans.medium }}>Iogurte natural</Text> ativo na geladeira. Tem certeza?
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Category groups */}
        <View style={{ paddingHorizontal: 18, gap: 18 }}>
          {groups.map(([cat, items]) => (
            <View key={cat} style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{
                    width: 32, height: 32, borderRadius: 10,
                    backgroundColor: getCategoryColor(cat),
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 16 }}>{getCategoryIcon(cat)}</Text>
                  </View>
                  <View style={{ gap: 2 }}>
                    <Text style={{
                      fontFamily: theme.fontFamily.sans.medium,
                      fontSize: 14,
                      color: theme.colors.ink,
                    }}>{cat}</Text>
                    <Text style={{
                      fontFamily: theme.fontFamily.mono.regular,
                      fontSize: 9.5,
                      letterSpacing: 0.12 * 9.5,
                      textTransform: 'uppercase',
                      color: theme.colors.muted,
                    }}>{items.length} · {items.filter((x) => x.checked).length} feitos</Text>
                  </View>
                </View>
                <MoreHorizontal size={18} color={theme.colors.muted} strokeWidth={1.6} />
              </View>

              <View style={{ gap: 8 }}>
                {items.map((item) => (
                  <View key={item.id} style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    backgroundColor: theme.colors.surface,
                    padding: 10,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: theme.colors.hairline,
                  }}>
                    <Pressable
                      onPress={() => toggleShoppingItem(item.id)}
                      hitSlop={4}
                      style={{
                        width: 26, height: 26, borderRadius: 8,
                        backgroundColor: item.checked ? theme.colors.ink : theme.colors.surface,
                        borderWidth: item.checked ? 0 : 1.5,
                        borderColor: theme.colors.hairline,
                        alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.checked && <Check size={14} color={theme.colors.canvas} strokeWidth={2} />}
                    </Pressable>

                    <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                      <Text style={{
                        fontFamily: theme.fontFamily.sans.medium,
                        fontSize: 14,
                        color: item.checked ? theme.colors.muted : theme.colors.ink,
                        textDecorationLine: item.checked ? 'line-through' : 'none',
                      }} numberOfLines={1}>{item.name}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        {item.source === 'recipe' && (
                          <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 11.5, color: theme.colors.muted }}>
                            🍳 Receita
                          </Text>
                        )}
                        {item.source === 'replenishment' && (
                          <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 11.5, color: theme.colors.muted }}>
                            🔔 Reposição
                          </Text>
                        )}
                        {item.duplicate && (
                          <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 11.5, color: theme.colors.urgent }}>
                            · já tem em casa
                          </Text>
                        )}
                      </View>
                    </View>

                    <Stepper value={item.quantity} onChange={(v) => setQty(item, v)} />
                  </View>
                ))}
              </View>
            </View>
          ))}
          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
    </View>
  );
}
