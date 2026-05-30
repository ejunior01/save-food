import { PantryItem } from "@app/types";
import { PantryService } from "@app/services/PantryService";
import { queryClient } from "@app/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export function useCreatePantryItem() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (item: Omit<PantryItem, "id">) => PantryService.create(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pantry-items"] });
    },
  });
  return { createPantryItem: mutateAsync, isLoading: isPending };
}

export function useCreatePantryItems() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (items: Array<Omit<PantryItem, "id">>) => PantryService.createMany(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pantry-items"] });
    },
  });
  return { createPantryItems: mutateAsync, isLoading: isPending };
}
