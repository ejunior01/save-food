import React, { useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Pressable, ScrollView, View, Text } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Trash2, Lock, Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@ui/components/AppText';
import { Button } from '@ui/components/Button';
import { Input } from '@ui/components/Input';
import { theme } from '@ui/styles/theme';
import { StorageLocation, UserPlan } from '@app/types';
import { useCreateStorageLocation } from '@app/hooks/mutations/useCreateStorageLocation';
import { useDeleteStorageLocation } from '@app/hooks/mutations/useDeleteStorageLocation';
import { styles } from './styles';

const EMOJI_OPTIONS = ['🧊', '❄️', '🥫', '🍷', '🌿', '📦', '🧁', '🫙', '🏠', '🔧'];

export type LocationsSheetHandle = { open: () => void; close: () => void };

type Props = {
  ref: React.Ref<LocationsSheetHandle>;
  locations: StorageLocation[];
  plan: UserPlan;
  onUpgrade: () => void;
};

export function LocationsSheet({ ref, locations, plan, onUpgrade }: Props) {
  const { bottom } = useSafeAreaInsets();
  const modalRef = useRef<BottomSheetModal>(null);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState(EMOJI_OPTIONS[0]);
  const { createStorageLocation, isLoading } = useCreateStorageLocation();
  const { deleteStorageLocation } = useDeleteStorageLocation();

  useImperativeHandle(ref, () => ({
    open: () => modalRef.current?.present(),
    close: () => modalRef.current?.dismiss(),
  }));

  async function handleCreate() {
    if (!newName.trim()) { return; }
    await createStorageLocation({ name: newName.trim(), icon: newIcon });
    setNewName('');
    setNewIcon(EMOJI_OPTIONS[0]);
    setShowForm(false);
  }

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} pressBehavior="close" />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      enableDynamicSizing
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={[styles.container, { paddingBottom: Math.max(bottom, 32) }]}>
        <View style={styles.header}>
          <AppText size="xl" family="semiBold">Locais de armazenamento</AppText>
          {plan === 'premium' && !showForm && (
            <Pressable style={styles.addBtn} onPress={() => setShowForm(true)} hitSlop={8}>
              <Plus size={18} color="#fff" strokeWidth={2.5} />
            </Pressable>
          )}
        </View>

        {/* Locations list */}
        <View style={styles.list}>
          {locations.map((loc) => (
            <View key={loc.id} style={styles.locationRow}>
              <Text style={styles.locationIcon}>{loc.icon}</Text>
              <AppText size="base" family="medium" style={{ flex: 1 }}>{loc.name}</AppText>
              {loc.isDefault ? (
                <AppText size="xs" color={theme.colors.textMuted}>Padrão</AppText>
              ) : plan === 'premium' ? (
                <Pressable onPress={() => deleteStorageLocation(loc.id)} hitSlop={8}>
                  <Trash2 size={16} color={theme.colors.danger.DEFAULT} strokeWidth={1.8} />
                </Pressable>
              ) : null}
            </View>
          ))}
        </View>

        {/* Free upsell */}
        {plan === 'free' && (
          <View style={styles.upsellCard}>
            <Lock size={20} color={theme.colors.primary} strokeWidth={1.8} />
            <View style={{ flex: 1, gap: 2 }}>
              <AppText size="sm" family="semiBold">Crie locais personalizados</AppText>
              <AppText size="xs" color={theme.colors.textMuted}>
                Geladeira, freezer, adega e muito mais com o plano Premium.
              </AppText>
            </View>
            <Button variant="primary" size="sm" label="Upgrade" onPress={onUpgrade} />
          </View>
        )}

        {/* New location form (premium only) */}
        {plan === 'premium' && showForm && (
          <View style={styles.form}>
            <AppText size="sm" family="semiBold" color={theme.colors.textMuted}>Novo local</AppText>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.emojiRow}>
              {EMOJI_OPTIONS.map((emoji) => (
                <Pressable
                  key={emoji}
                  style={[styles.emojiBtn, newIcon === emoji && styles.emojiBtnSelected]}
                  onPress={() => setNewIcon(emoji)}
                >
                  <Text style={{ fontSize: 22 }}>{emoji}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <Input
              InputComponent={BottomSheetTextInput}
              label="Nome"
              placeholder="Ex: Geladeira"
              value={newName}
              onChangeText={setNewName}
              autoCapitalize="words"
            />

            <View style={styles.formActions}>
              <Button
                variant="ghost"
                size="md"
                label="Cancelar"
                onPress={() => { setShowForm(false); setNewName(''); }}
                style={{ flex: 1 }}
              />
              <Button
                variant="primary"
                size="md"
                label="Criar"
                onPress={handleCreate}
                loading={isLoading}
                disabled={!newName.trim() || isLoading}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}
