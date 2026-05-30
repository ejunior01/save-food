import { useMutation } from "@tanstack/react-query";
import { ShoppingItem } from "@app/types";
import { ShoppingService } from "@app/services/ShoppingService";
import { queryClient } from "@app/lib/queryClient";

type Params = { id: string; updates: Partial<Omit<ShoppingItem, "id">> };

export function useUpdateShoppingItem() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, updates }: Params) => ShoppingService.update(id, updates),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["shopping-items"] }); },
  });
  return { updateShoppingItem: mutateAsync, isLoading: isPending };
}
