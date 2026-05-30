import { useMutation } from "@tanstack/react-query";
import { ShoppingService } from "@app/services/ShoppingService";
import { queryClient } from "@app/lib/queryClient";

export function useDeleteShoppingItem() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => ShoppingService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["shopping-items"] }); },
  });
  return { deleteShoppingItem: mutateAsync, isLoading: isPending };
}
