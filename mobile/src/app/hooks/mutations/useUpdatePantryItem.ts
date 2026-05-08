import { useMutation } from '@tanstack/react-query';
import { PantryItem } from '@app/types';
import { PantryService } from '@app/services/PantryService';
import { queryClient } from '@app/lib/queryClient';

type Params = { id: string; updates: Partial<Omit<PantryItem, 'id'>> };

export function useUpdatePantryItem() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, updates }: Params) => PantryService.update(id, updates),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['pantry-items'] }); },
  });
  return { updatePantryItem: mutateAsync, isLoading: isPending };
}
