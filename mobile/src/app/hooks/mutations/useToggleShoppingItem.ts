import { useMutation } from '@tanstack/react-query';
import { ShoppingService } from '@app/services/ShoppingService';
import { queryClient } from '@app/lib/queryClient';

export function useToggleShoppingItem() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => ShoppingService.toggle(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['shopping-items'] }); },
  });
  return { toggleShoppingItem: mutateAsync, isLoading: isPending };
}
