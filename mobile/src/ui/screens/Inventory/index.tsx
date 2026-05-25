import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Archive, Grid3X3, List, Plus, Search } from 'lucide-react-native';

import { Tag } from '@ui/components/Tag';
import { ActionSheet } from '@ui/components/ActionSheet';
import { theme } from '@ui/styles/theme';
import {
  useAppData,
  getDaysUntilExpiry,
  getExpiryStatus,
  formatExpiryLabel,
} from '@app/context/AppDataContext';
import { getCategoryColor, getCategoryIcon, getLocationName } from '@app/utils/categories';
import { PantryItem } from '@app/types';
import { useNavigation } from '@react-navigation/native';
import { useDeletePantryItem } from '@app/hooks/mutations/useDeletePantryItem';
import { useUpdatePantryItem } from '@app/hooks/mutations/useUpdatePantryItem';

type LocFilter = 'all' | 'loc_pantry' | 'loc_fridge' | 'loc_freezer';

function Eyebrow({ children }: { children: string }) {
  return (
    <Text style={{
      fontFamily: theme.fontFamily.mono.regular,
      fontSize: 9.5,
      letterSpacing: 0.12 * 9.5,
      textTransform: 'uppercase',
      color: theme.colors.muted,
    }}>{children}</Text>
  );
}

function ChipBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 36,
        paddingHorizontal: 13,
        borderRadius: 999,
        backgroundColor: active ? theme.colors.ink : theme.colors.surface,
        borderWidth: active ? 0 : 1,
        borderColor: theme.colors.hairline,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Text style={{
        fontFamily: theme.fontFamily.sans.medium,
        fontSize: 12.5,
        color: active ? theme.colors.canvas : theme.colors.ink,
      }}>{label}</Text>
    </Pressable>
  );
}

function GridCard({ item, onPress }: { item: PantryItem; onPress: () => void }) {
  const days = getDaysUntilExpiry(item.expiresAt);
  const status = getExpiryStatus(item.expiresAt);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 12,
        borderWidth: 1,
        borderColor: theme.colors.hairline,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      {item.photo ? (
        <Image
          source={{ uri: item.photo }}
          style={{ width: '100%', height: 120, borderRadius: 14 }}
          resizeMode="cover"
        />
      ) : (
        <View style={{
          width: '100%', height: 120, borderRadius: 14,
          backgroundColor: getCategoryColor(item.category),
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 44 }}>{item.emoji}</Text>
        </View>
      )}
      <View style={{ marginTop: 10, gap: 4 }}>
        <Text style={{
          fontFamily: theme.fontFamily.sans.medium,
          fontSize: 13,
          color: theme.colors.ink,
        }} numberOfLines={1}>{item.name}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{
            fontFamily: theme.fontFamily.sans.regular,
            fontSize: 11,
            color: theme.colors.muted,
          }}>{item.quantity} {item.unit}</Text>
          <Tag label={formatExpiryLabel(days)} tone={status} size="sm" />
        </View>
      </View>
    </Pressable>
  );
}

function ListRow({ item, onPress }: { item: PantryItem; onPress: () => void }) {
  const days = getDaysUntilExpiry(item.expiresAt);
  const status = getExpiryStatus(item.expiresAt);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: theme.colors.surface,
        padding: 12,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: theme.colors.hairline,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      {item.photo ? (
        <Image
          source={{ uri: item.photo }}
          style={{ width: 52, height: 52, borderRadius: 14 }}
          resizeMode="cover"
        />
      ) : (
        <View style={{
          width: 52, height: 52, borderRadius: 14,
          backgroundColor: getCategoryColor(item.category),
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
        </View>
      )}
      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
        <Text style={{
          fontFamily: theme.fontFamily.sans.medium,
          fontSize: 15,
          color: theme.colors.ink,
        }} numberOfLines={1}>{item.name}</Text>
        <Text style={{
          fontFamily: theme.fontFamily.sans.regular,
          fontSize: 12,
          color: theme.colors.muted,
        }}>
          {item.quantity} {item.unit} · {getLocationName(item.locationId)}
        </Text>
      </View>
      <Tag label={formatExpiryLabel(days)} tone={status} size="sm" />
    </Pressable>
  );
}

export function Inventory() {
  const { top } = useSafeAreaInsets();
  const { pantryItems } = useAppData();
  const navigation = useNavigation<any>();
  const [loc, setLoc] = useState<LocFilter>('all');
  const [cat, setCat] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
  const { deletePantryItem } = useDeletePantryItem();
  const { updatePantryItem } = useUpdatePantryItem();

  const locCounts = useMemo(() => ({
    pantry:  pantryItems.filter((i) => i.locationId === 'loc_pantry').length,
    fridge:  pantryItems.filter((i) => i.locationId === 'loc_fridge').length,
    freezer: pantryItems.filter((i) => i.locationId === 'loc_freezer').length,
  }), [pantryItems]);

  const byLoc = useMemo(
    () => loc === 'all' ? pantryItems : pantryItems.filter((i) => i.locationId === loc),
    [pantryItems, loc],
  );

  const byCat = useMemo(
    () => cat === 'all' ? byLoc : byLoc.filter((i) => i.category === cat),
    [byLoc, cat],
  );

  const sorted = useMemo(
    () => [...byCat].sort((a, b) => getDaysUntilExpiry(a.expiresAt) - getDaysUntilExpiry(b.expiresAt)),
    [byCat],
  );

  const presentCats = useMemo(
    () => Array.from(new Set(byLoc.map((i) => i.category))),
    [byLoc],
  );

  const locLabel = loc === 'loc_fridge' ? 'Geladeira' : loc === 'loc_freezer' ? 'Freezer' : '3 locais';

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
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View style={{ gap: 2 }}>
            <Eyebrow>Sua casa</Eyebrow>
            <Text style={{
              fontFamily: theme.fontFamily.sans.medium,
              fontSize: 15,
              color: theme.colors.ink,
            }}>Despensa de Marina</Text>
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
              onPress={() => navigation.navigate('AddFood')}
              style={{
                width: 40, height: 40, borderRadius: 999,
                borderWidth: 1, borderColor: theme.colors.hairline,
                backgroundColor: theme.colors.surface,
                alignItems: 'center', justifyContent: 'center',
              }}>
              <Plus size={18} color={theme.colors.ink} strokeWidth={1.6} />
            </Pressable>
          </View>
        </View>

        {/* Hero title */}
        <View style={{ paddingHorizontal: 18, paddingTop: 12, paddingBottom: 6 }}>
          <Text style={{
            fontFamily: theme.fontFamily.display.regular,
            fontSize: 40,
            color: theme.colors.ink,
            marginTop: 4,
            marginBottom: 16,
            lineHeight: 44,
          }}>
            {byLoc.length} itens{'\n'}em <Text style={{ fontStyle: 'italic' }}>{locLabel}.</Text>
          </Text>
        </View>

        {/* Location segmented */}
        <View style={{ paddingHorizontal: 18, paddingBottom: 14 }}>
          <View style={{
            flexDirection: 'row',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radii.pill,
            padding: 3,
            borderWidth: 1,
            borderColor: theme.colors.hairline,
          }}>
            {([
              { id: 'all',          label: `Todos · ${pantryItems.length}` },
              { id: 'loc_pantry',   label: `🗄️ ${locCounts.pantry}` },
              { id: 'loc_fridge',   label: `🧊 ${locCounts.fridge}` },
              { id: 'loc_freezer',  label: `❄️ ${locCounts.freezer}` },
            ] as Array<{ id: LocFilter; label: string }>).map((o) => (
              <Pressable
                key={o.id}
                onPress={() => setLoc(o.id)}
                style={{
                  flex: 1,
                  height: 34,
                  borderRadius: 999,
                  backgroundColor: loc === o.id ? theme.colors.ink : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{
                  fontFamily: theme.fontFamily.sans.medium,
                  fontSize: 12.5,
                  color: loc === o.id ? theme.colors.canvas : theme.colors.ink,
                }}>{o.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 18, gap: 8, paddingBottom: 14 }}
        >
          <ChipBtn label="Todas" active={cat === 'all'} onPress={() => setCat('all')} />
          {presentCats.map((c) => (
            <ChipBtn key={c} label={`${getCategoryIcon(c)} ${c}`} active={cat === c} onPress={() => setCat(c)} />
          ))}
        </ScrollView>

        {/* Sort + view toggle */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 18,
          paddingBottom: 14,
        }}>
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 9.5,
            letterSpacing: 0.12 * 9.5,
            textTransform: 'uppercase',
            color: theme.colors.muted,
          }}>Ordenado por validade</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Pressable
              onPress={() => setView('grid')}
              style={{
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: view === 'grid' ? theme.colors.surface : 'transparent',
                borderWidth: view === 'grid' ? 1 : 0,
                borderColor: theme.colors.hairline,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Grid3X3 size={16} color={theme.colors.ink} strokeWidth={1.6} />
            </Pressable>
            <Pressable
              onPress={() => setView('list')}
              style={{
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: view === 'list' ? theme.colors.surface : 'transparent',
                borderWidth: view === 'list' ? 1 : 0,
                borderColor: theme.colors.hairline,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <List size={16} color={theme.colors.ink} strokeWidth={1.6} />
            </Pressable>
          </View>
        </View>

        {/* Items */}
        {view === 'grid' ? (
          <View style={{ paddingHorizontal: 18 }}>
            {Array.from({ length: Math.ceil(sorted.length / 2) }, (_, rowIdx) => (
              <View key={rowIdx} style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                <GridCard item={sorted[rowIdx * 2]} onPress={() => setSelectedItem(sorted[rowIdx * 2])} />
                {sorted[rowIdx * 2 + 1] ? (
                  <GridCard item={sorted[rowIdx * 2 + 1]} onPress={() => setSelectedItem(sorted[rowIdx * 2 + 1])} />
                ) : (
                  <View style={{ flex: 1 }} />
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={{ paddingHorizontal: 18, gap: 8 }}>
            {sorted.map((item) => (
              <ListRow key={item.id} item={item} onPress={() => setSelectedItem(item)} />
            ))}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      <ActionSheet
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onConsume={(item, qty) => {
          if (qty >= item.quantity) deletePantryItem(item.id);
          else updatePantryItem({ id: item.id, updates: { quantity: item.quantity - qty } });
        }}
        onDiscard={(item) => deletePantryItem(item.id)}
        onViewRecipes={() => navigation.navigate('Recipes')}
        onAddReplenishment={(item) => navigation.navigate('Replenishment', { itemId: item.id })}
      />
    </View>
  );
}
