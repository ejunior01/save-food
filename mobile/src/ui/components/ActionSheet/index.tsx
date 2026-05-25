import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import {
  ArrowRight,
  Calendar,
  Check,
  ChefHat,
  ShoppingCart,
  Star,
  Trash2,
} from 'lucide-react-native';

import { Tag } from '@ui/components/Tag';
import { ConsumeModal } from '@ui/components/ConsumeModal';
import { theme } from '@ui/styles/theme';
import { PantryItem } from '@app/types';
import { getCategoryColor, getLocationName } from '@app/utils/categories';
import {
  getDaysUntilExpiry,
  getExpiryStatus,
  formatExpiryLabel,
} from '@app/context/AppDataContext';

type Props = {
  item: PantryItem | null;
  onClose: () => void;
  onConsume?: (item: PantryItem, qty: number) => void;
  onDiscard?: (item: PantryItem, qty: number) => void;
  onViewRecipes?: (item: PantryItem) => void;
  onAddReplenishment?: (item: PantryItem) => void;
  onEditExpiry?: (item: PantryItem) => void;
};

function ActionRow({
  icon,
  label,
  tone,
  onPress,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  tone?: 'safe' | 'danger' | 'ink';
  onPress?: () => void;
  badge?: string;
}) {
  const color =
    tone === 'danger' ? theme.colors.danger :
    tone === 'safe' ? theme.colors.safe :
    theme.colors.ink;

  const iconBg =
    tone === 'danger' ? theme.colors.dangerSoft :
    tone === 'safe' ? theme.colors.safeSoft :
    theme.colors.surfaceSoft;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: theme.colors.surface,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.colors.hairline,
        opacity: pressed ? 0.82 : 1,
      })}
    >
      <View style={{
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: iconBg,
        alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </View>
      <Text style={{
        flex: 1,
        fontFamily: theme.fontFamily.sans.medium,
        fontSize: 14,
        color,
      }}>{label}</Text>
      {badge && (
        <View style={{
          paddingHorizontal: 7, paddingVertical: 3,
          borderRadius: 999,
          backgroundColor: theme.colors.ink,
        }}>
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 8.5,
            letterSpacing: 0.12 * 8.5,
            color: theme.colors.block.pistachio,
          }}>★ {badge}</Text>
        </View>
      )}
      <ArrowRight size={16} color={color} strokeWidth={1.6} />
    </Pressable>
  );
}

export function ActionSheet({
  item,
  onClose,
  onConsume,
  onDiscard,
  onViewRecipes,
  onAddReplenishment,
  onEditExpiry,
}: Props) {
  const [pendingMode, setPendingMode] = useState<'consume' | 'discard' | null>(null);

  if (!item) return null;

  const days = getDaysUntilExpiry(item.expiresAt);
  const status = getExpiryStatus(item.expiresAt);

  function handleConsumeConfirm(qty: number) {
    onConsume?.(item!, qty);
    setPendingMode(null);
    onClose();
  }

  function handleDiscardConfirm(qty: number) {
    onDiscard?.(item!, qty);
    setPendingMode(null);
    onClose();
  }

  return (
    <>
      <Modal
        visible
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(26,43,31,0.45)',
            justifyContent: 'flex-end',
          }}
          onPress={onClose}
        >
          <Pressable
            onPress={undefined}
            style={{
              backgroundColor: theme.colors.canvas,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingHorizontal: 18,
              paddingTop: 14,
              paddingBottom: 28,
            }}
          >
            {/* Handle */}
            <View style={{
              width: 38, height: 4, borderRadius: 2,
              backgroundColor: theme.colors.hairline,
              alignSelf: 'center',
              marginBottom: 14,
            }} />

            {/* Item header */}
            <View style={{ flexDirection: 'row', gap: 14, marginBottom: 18, alignItems: 'center' }}>
              {item.photo ? (
                <Image
                  source={{ uri: item.photo }}
                  style={{ width: 64, height: 64, borderRadius: 14 }}
                  resizeMode="cover"
                />
              ) : (
                <View style={{
                  width: 64, height: 64, borderRadius: 14,
                  backgroundColor: getCategoryColor(item.category),
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
                </View>
              )}
              <View style={{ flex: 1, gap: 4, minWidth: 0 }}>
                <Text style={{
                  fontFamily: theme.fontFamily.mono.regular,
                  fontSize: 9.5,
                  letterSpacing: 0.12 * 9.5,
                  textTransform: 'uppercase',
                  color: theme.colors.muted,
                }}>
                  {item.category} · {getLocationName(item.locationId)}
                </Text>
                <Text style={{
                  fontFamily: theme.fontFamily.display.regular,
                  fontSize: 22,
                  color: theme.colors.ink,
                  lineHeight: 26,
                }} numberOfLines={1}>{item.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Tag label={formatExpiryLabel(days)} tone={status} size="sm" />
                  <Text style={{
                    fontFamily: theme.fontFamily.sans.regular,
                    fontSize: 12,
                    color: theme.colors.muted,
                  }}>{item.quantity} {item.unit}</Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={{ gap: 8 }}>
              <ActionRow
                icon={<Check size={16} color={theme.colors.safe} strokeWidth={2} />}
                label="Marcar como consumido"
                tone="safe"
                onPress={() => setPendingMode('consume')}
              />
              <ActionRow
                icon={<ChefHat size={16} color={theme.colors.ink} strokeWidth={1.6} />}
                label="Ver receitas que aproveitam"
                tone="ink"
                onPress={() => { onViewRecipes?.(item); onClose(); }}
              />
              <ActionRow
                icon={<Star size={16} color={theme.colors.ink} strokeWidth={1.6} />}
                label="Dica de armazenamento"
                tone="ink"
                badge="PREMIUM"
              />
              <ActionRow
                icon={<ShoppingCart size={16} color={theme.colors.ink} strokeWidth={1.6} />}
                label="Adicionar reposição"
                tone="ink"
                onPress={() => { onAddReplenishment?.(item); onClose(); }}
              />
              <ActionRow
                icon={<Calendar size={16} color={theme.colors.ink} strokeWidth={1.6} />}
                label="Editar validade ou local"
                tone="ink"
                onPress={() => { onEditExpiry?.(item); onClose(); }}
              />
              <ActionRow
                icon={<Trash2 size={16} color={theme.colors.danger} strokeWidth={1.6} />}
                label="Descartar"
                tone="danger"
                onPress={() => setPendingMode('discard')}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {pendingMode && (
        <ConsumeModal
          item={item}
          mode={pendingMode}
          onConfirm={pendingMode === 'consume' ? handleConsumeConfirm : handleDiscardConfirm}
          onClose={() => setPendingMode(null)}
        />
      )}
    </>
  );
}
