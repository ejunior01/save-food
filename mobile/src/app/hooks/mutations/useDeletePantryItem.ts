import { PantryService } from "@app/services/PantryService";
import { queryClient } from "@app/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export function useDeletePantryItem() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => PantryService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pantry-items"] });
    },
  });
  return { deletePantryItem: mutateAsync, isLoading: isPending };
}
