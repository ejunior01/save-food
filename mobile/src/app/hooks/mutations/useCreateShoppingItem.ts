import { useMutation } from '@tanstack/react-query';
import { ShoppingItem } from '@app/types';
import { ShoppingService } from '@app/services/ShoppingService';
import { queryClient } from '@app/lib/queryClient';

export function useCreateShoppingItem() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (item: Omit<ShoppingItem, 'id'>) => ShoppingService.create(item),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['shopping-items'] }); },
  });
  return { createShoppingItem: mutateAsync, isLoading: isPending };
}
