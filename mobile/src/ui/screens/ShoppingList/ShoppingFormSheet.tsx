import React, { useCallback, useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@ui/components/AppText';
import { Input } from '@ui/components/Input';
import { Button } from '@ui/components/Button';
import { ShoppingItem } from '@app/types';

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  quantity: z.coerce.number({ error: 'Quantidade inválida' }).min(0.1, 'Mínimo 0.1'),
  unit: z.string().min(1, 'Unidade obrigatória'),
  category: z.string().min(1, 'Categoria obrigatória'),
});

export type FormData = z.infer<typeof schema>;

export type ShoppingFormSheetHandle = {
  openAdd: () => void;
  openEdit: (item: ShoppingItem) => void;
  close: () => void;
};

type Props = {
  ref: React.Ref<ShoppingFormSheetHandle>;
  onSubmit: (data: FormData, item?: ShoppingItem) => void;
};

const DEFAULT_VALUES: FormData = { name: '', quantity: 1, unit: 'un', category: 'Outros' };

export function ShoppingFormSheet({ ref, onSubmit }: Props) {
  const { bottom } = useSafeAreaInsets();
  const modalRef = useRef<BottomSheetModal>(null);
  const editingItem = useRef<ShoppingItem | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  useImperativeHandle(ref, () => ({
    openAdd: () => {
      editingItem.current = null;
      reset(DEFAULT_VALUES);
      modalRef.current?.present();
    },
    openEdit: (item: ShoppingItem) => {
      editingItem.current = item;
      reset({ name: item.name, quantity: item.quantity, unit: item.unit, category: item.category });
      modalRef.current?.present();
    },
    close: () => modalRef.current?.dismiss(),
  }));

  function handleFormSubmit(data: FormData) {
    onSubmit(data, editingItem.current ?? undefined);
    modalRef.current?.dismiss();
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
      <BottomSheetView style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: Math.max(bottom, 32), gap: 16 }}>
        <AppText size="2xl" family="semiBold" style={{ letterSpacing: -0.3, marginBottom: 4 }}>
          {editingItem.current ? 'Editar item' : 'Novo item'}
        </AppText>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              InputComponent={BottomSheetTextInput}
              label="Nome"
              placeholder="Ex: Leite"
              value={value}
              onChangeText={onChange}
              autoCapitalize="words"
              error={errors.name?.message}
            />
          )}
        />

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Controller
              control={control}
              name="quantity"
              render={({ field: { onChange, value } }) => (
                <Input
                  InputComponent={BottomSheetTextInput}
                  label="Quantidade"
                  placeholder="1"
                  value={String(value)}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  error={errors.quantity?.message}
                />
              )}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Controller
              control={control}
              name="unit"
              render={({ field: { onChange, value } }) => (
                <Input
                  InputComponent={BottomSheetTextInput}
                  label="Unidade"
                  placeholder="un, kg, L..."
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  error={errors.unit?.message}
                />
              )}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <Input
              InputComponent={BottomSheetTextInput}
              label="Categoria"
              placeholder="Ex: Laticínios"
              value={value}
              onChangeText={onChange}
              autoCapitalize="words"
              error={errors.category?.message}
            />
          )}
        />

        <Button
          variant="primary"
          size="lg"
          label={editingItem.current ? 'Salvar alterações' : 'Adicionar'}
          onPress={handleSubmit(handleFormSubmit)}
          style={{ width: '100%' }}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}
