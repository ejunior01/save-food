import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Leaf, TrendingDown, TrendingUp } from 'lucide-react-native';

import { theme } from '@ui/styles/theme';
import { useAppData, getDaysUntilExpiry, getExpiryStatus } from '@app/context/AppDataContext';
import { getCategoryColor } from '@app/utils/categories';

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

function StatBlock({
  n, label, sub, accent, bg,
}: {
  n: string | number;
  label: string;
  sub: string;
  accent: string;
  bg: string;
}) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: bg,
      borderRadius: 18,
      padding: 16,
      gap: 4,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
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
        fontSize: 38,
        color: theme.colors.ink,
        lineHeight: 40,
      }}>{n}</Text>
      <Text style={{
        fontFamily: theme.fontFamily.sans.regular,
        fontSize: 11,
        color: theme.colors.muted,
      }}>{sub}</Text>
    </View>
  );
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
const MOCK_TREND = [4, 7, 5, 2, 3, 1];

export function Insights() {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { pantryItems } = useAppData();

  const stats = useMemo(() => {
    const expired  = pantryItems.filter((i) => getExpiryStatus(i.expiresAt) === 'expired').length;
    const urgent   = pantryItems.filter((i) => getExpiryStatus(i.expiresAt) === 'urgent').length;
    const safe     = pantryItems.filter((i) => ['planned', 'safe'].includes(getExpiryStatus(i.expiresAt))).length;
    const total    = pantryItems.length;

    // Category breakdown by risk
    const catRisk: Record<string, number> = {};
    pantryItems.forEach((i) => {
      const s = getExpiryStatus(i.expiresAt);
      if (s === 'expired' || s === 'urgent') {
        catRisk[i.category] = (catRisk[i.category] ?? 0) + 1;
      }
    });
    const catBreakdown = Object.entries(catRisk)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { expired, urgent, safe, total, catBreakdown };
  }, [pantryItems]);

  const maxTrend = Math.max(...MOCK_TREND, 1);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.canvas} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{
          paddingTop: top + 14,
          paddingHorizontal: 18,
          paddingBottom: 4,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => ({
              width: 40, height: 40, borderRadius: 999,
              borderWidth: 1, borderColor: theme.colors.hairline,
              backgroundColor: theme.colors.surface,
              alignItems: 'center', justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <ArrowLeft size={18} color={theme.colors.ink} strokeWidth={1.6} />
          </Pressable>
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 9.5,
            letterSpacing: 0.12 * 9.5,
            textTransform: 'uppercase',
            color: theme.colors.muted,
          }}>Relatório</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hero */}
        <View style={{ paddingHorizontal: 18, paddingTop: 10, paddingBottom: 4 }}>
          <Eyebrow>Seus dados</Eyebrow>
          <Text style={{
            fontFamily: theme.fontFamily.display.regular,
            fontSize: 38,
            color: theme.colors.ink,
            marginTop: 6,
            marginBottom: 8,
            lineHeight: 42,
          }}>
            Como vai a{'\n'}sua <Text style={{ fontStyle: 'italic' }}>despensa.</Text>
          </Text>
          <Text style={{
            fontFamily: theme.fontFamily.sans.regular,
            fontSize: 14,
            color: theme.colors.muted,
            marginBottom: 14,
            lineHeight: 20,
          }}>
            Acompanhe o que está em risco e o quanto você está aproveitando.
          </Text>
        </View>

        {/* Pistachio summary block */}
        <View style={{ paddingHorizontal: 18, paddingBottom: 14 }}>
          <View style={{
            backgroundColor: theme.colors.block.pistachio,
            borderRadius: 22,
            padding: 22,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <Eyebrow>Resumo geral</Eyebrow>
              <Leaf size={20} color={theme.colors.ink} strokeWidth={1.6} />
            </View>
            <Text style={{
              fontFamily: theme.fontFamily.display.regular,
              fontSize: 28,
              color: theme.colors.ink,
              marginBottom: 16,
              lineHeight: 32,
            }}>
              Sua despensa em <Text style={{ fontStyle: 'italic' }}>números.</Text>
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1, backgroundColor: theme.colors.canvas, borderRadius: 16, padding: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: theme.colors.danger }} />
                  <Text style={{ fontFamily: theme.fontFamily.mono.regular, fontSize: 9, letterSpacing: 0.12 * 9, textTransform: 'uppercase', color: theme.colors.muted }}>Em risco</Text>
                </View>
                <Text style={{ fontFamily: theme.fontFamily.display.italic, fontSize: 36, color: theme.colors.ink, lineHeight: 38 }}>
                  {stats.expired + stats.urgent}
                </Text>
                <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 11, color: theme.colors.muted, marginTop: 2 }}>
                  {stats.expired} vencidos · {stats.urgent} urgentes
                </Text>
              </View>
              <View style={{ flex: 1, backgroundColor: theme.colors.canvas, borderRadius: 16, padding: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: theme.colors.safe }} />
                  <Text style={{ fontFamily: theme.fontFamily.mono.regular, fontSize: 9, letterSpacing: 0.12 * 9, textTransform: 'uppercase', color: theme.colors.muted }}>Seguros</Text>
                </View>
                <Text style={{ fontFamily: theme.fontFamily.display.italic, fontSize: 36, color: theme.colors.ink, lineHeight: 38 }}>
                  {stats.safe}
                </Text>
                <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 11, color: theme.colors.muted, marginTop: 2 }}>
                  +15 dias
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stat blocks row */}
        <View style={{ paddingHorizontal: 18, flexDirection: 'row', gap: 10, marginBottom: 14 }}>
          <StatBlock
            n={stats.total}
            label="Total"
            sub="itens cadastrados"
            accent={theme.colors.ink}
            bg={theme.colors.surface}
          />
          <StatBlock
            n="R$ 0"
            label="Economizados"
            sub="estimativa do mês"
            accent={theme.colors.safe}
            bg={theme.colors.surface}
          />
        </View>

        {/* Trend chart — charcoal block */}
        <View style={{ paddingHorizontal: 18, paddingBottom: 14 }}>
          <View style={{
            backgroundColor: theme.colors.block.charcoal,
            borderRadius: 22,
            padding: 20,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <View>
                <Eyebrow dark>Histórico de desperdício</Eyebrow>
                <Text style={{
                  fontFamily: theme.fontFamily.display.regular,
                  fontSize: 24,
                  color: theme.colors.canvas,
                  marginTop: 4,
                  lineHeight: 28,
                }}>Itens <Text style={{ fontStyle: 'italic' }}>descartados.</Text></Text>
              </View>
              <TrendingDown size={22} color={theme.colors.block.peach} strokeWidth={1.6} />
            </View>
            <View style={{ height: 12 }} />
            {/* Bar chart */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 80 }}>
              {MOCK_TREND.map((val, idx) => (
                <View key={idx} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                  <View style={{
                    width: '100%',
                    height: Math.round((val / maxTrend) * 60) + 4,
                    borderRadius: 6,
                    backgroundColor: val === Math.min(...MOCK_TREND) ? theme.colors.block.peach : 'rgba(250,245,235,0.25)',
                  }} />
                  <Text style={{
                    fontFamily: theme.fontFamily.mono.regular,
                    fontSize: 9,
                    color: 'rgba(250,245,235,0.5)',
                  }}>{MONTHS[idx]}</Text>
                </View>
              ))}
            </View>
            <View style={{ height: 10 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <TrendingDown size={14} color={theme.colors.block.pistachio} strokeWidth={2} />
              <Text style={{
                fontFamily: theme.fontFamily.sans.regular,
                fontSize: 12,
                color: 'rgba(250,245,235,0.7)',
              }}>
                {MOCK_TREND[MOCK_TREND.length - 1] < MOCK_TREND[0]
                  ? 'Tendência de melhora — continue assim.'
                  : 'Atenção ao desperdício este mês.'}
              </Text>
            </View>
          </View>
        </View>

        {/* Category breakdown */}
        {stats.catBreakdown.length > 0 && (
          <View style={{ paddingHorizontal: 18, paddingBottom: 14 }}>
            <View style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 22,
              padding: 20,
              borderWidth: 1,
              borderColor: theme.colors.hairline,
            }}>
              <Eyebrow>Por categoria</Eyebrow>
              <Text style={{
                fontFamily: theme.fontFamily.display.regular,
                fontSize: 22,
                color: theme.colors.ink,
                marginTop: 4,
                marginBottom: 16,
                lineHeight: 26,
              }}>Onde está o <Text style={{ fontStyle: 'italic' }}>risco.</Text></Text>

              <View style={{ gap: 12 }}>
                {stats.catBreakdown.map(([cat, count]) => {
                  const pct = Math.round((count / (stats.expired + stats.urgent || 1)) * 100);
                  return (
                    <View key={cat} style={{ gap: 6 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{
                          fontFamily: theme.fontFamily.sans.medium,
                          fontSize: 13,
                          color: theme.colors.ink,
                        }}>{cat}</Text>
                        <Text style={{
                          fontFamily: theme.fontFamily.mono.regular,
                          fontSize: 11,
                          color: theme.colors.muted,
                        }}>{count} itens</Text>
                      </View>
                      <View style={{
                        height: 6, borderRadius: 3,
                        backgroundColor: theme.colors.hairline,
                      }}>
                        <View style={{
                          height: 6, borderRadius: 3,
                          width: `${pct}%`,
                          backgroundColor: getCategoryColor(cat),
                        }} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* Tips block */}
        <View style={{ paddingHorizontal: 18, paddingBottom: 14 }}>
          <View style={{
            backgroundColor: theme.colors.block.cream,
            borderRadius: 22,
            padding: 20,
          }}>
            <Eyebrow>Dica do dia</Eyebrow>
            <Text style={{
              fontFamily: theme.fontFamily.display.regular,
              fontSize: 22,
              color: theme.colors.ink,
              marginTop: 4,
              marginBottom: 10,
              lineHeight: 26,
            }}>
              Organize pelo <Text style={{ fontStyle: 'italic' }}>FIFO.</Text>
            </Text>
            <Text style={{
              fontFamily: theme.fontFamily.sans.regular,
              fontSize: 14,
              color: theme.colors.ink,
              lineHeight: 20,
            }}>
              Sempre coloque itens mais novos atrás dos mais antigos. Assim você consome o que vence primeiro naturalmente.
            </Text>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}
