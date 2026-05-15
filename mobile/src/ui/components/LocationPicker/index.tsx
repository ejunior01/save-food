import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Settings2, Lock } from 'lucide-react-native';

import { AppText } from '@ui/components/AppText';
import { theme } from '@ui/styles/theme';
import { StorageLocation, UserPlan } from '@app/types';
import { styles } from './styles';

type Props = {
  locations: StorageLocation[];
  selectedId: string;
  plan: UserPlan;
  onSelect: (id: string) => void;
  onManage: () => void;
};

export function LocationPicker({ locations, selectedId, plan, onSelect, onManage }: Props) {
  if (plan === 'free') {
    const defaultLoc = locations.find((l) => l.isDefault);
    return (
      <View style={styles.freeContainer}>
        <View style={styles.freeRow}>
          <View style={styles.lockedPill}>
            <Text style={styles.pillIcon}>{defaultLoc?.icon ?? '🗄️'}</Text>
            <AppText size="sm" family="medium" color={theme.colors.text}>
              {defaultLoc?.name ?? 'Despensa'}
            </AppText>
          </View>
          <Pressable style={styles.upgradeLink} onPress={onManage} hitSlop={8}>
            <Lock size={12} color={theme.colors.primary} strokeWidth={2} />
            <AppText size="xs" family="medium" color={theme.colors.primary}>
              Upgrade para mais locais
            </AppText>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <AppText size="sm" family="medium" color={theme.colors.textMuted}>Local de armazenamento</AppText>
        <Pressable onPress={onManage} hitSlop={8} style={styles.manageBtn}>
          <Settings2 size={14} color={theme.colors.textMuted} strokeWidth={1.8} />
          <AppText size="xs" color={theme.colors.textMuted}>Gerenciar</AppText>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
      >
        {locations.map((loc) => {
          const isSelected = loc.id === selectedId;
          return (
            <Pressable
              key={loc.id}
              style={[styles.pill, isSelected && styles.pillSelected]}
              onPress={() => onSelect(loc.id)}
            >
              <Text style={styles.pillIcon}>{loc.icon}</Text>
              <AppText
                size="sm"
                family="medium"
                color={isSelected ? '#fff' : theme.colors.text}
              >
                {loc.name}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
