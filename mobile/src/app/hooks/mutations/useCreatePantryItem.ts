import { useMutation } from '@tanstack/react-query';
import { PantryItem } from '@app/types';
import { PantryService } from '@app/services/PantryService';
import { queryClient } from '@app/lib/queryClient';
import { scheduleItemNotifications } from '@app/services/NotificationService';

export function useCreatePantryItem() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (item: Omit<PantryItem, 'id'>) => PantryService.create(item),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: ['pantry-items'] });
      scheduleItemNotifications(newItem).catch(() => {});
    },
  });
  return { createPantryItem: mutateAsync, isLoading: isPending };
}
