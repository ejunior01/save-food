import { useMutation } from '@tanstack/react-query';
import { PantryItem } from '@app/types';
import { PantryService } from '@app/services/PantryService';
import { queryClient } from '@app/lib/queryClient';

export function useCreatePantryItem() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (item: Omit<PantryItem, 'id'>) => PantryService.create(item),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['pantry-items'] }); },
  });
  return { createPantryItem: mutateAsync, isLoading: isPending };
}
