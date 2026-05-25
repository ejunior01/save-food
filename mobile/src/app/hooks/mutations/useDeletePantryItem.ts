import { useMutation } from '@tanstack/react-query';
import { PantryService } from '@app/services/PantryService';
import { queryClient } from '@app/lib/queryClient';
import { cancelItemNotifications } from '@app/services/NotificationService';

export function useDeletePantryItem() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => PantryService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['pantry-items'] });
      cancelItemNotifications(id).catch(() => {});
    },
  });
  return { deletePantryItem: mutateAsync, isLoading: isPending };
}
