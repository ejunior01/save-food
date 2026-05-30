import { useMutation } from "@tanstack/react-query";
import { StorageLocationService } from "@app/services/StorageLocationService";
import { queryClient } from "@app/lib/queryClient";

export function useDeleteStorageLocation() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => StorageLocationService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["storage-locations"] }); },
  });
  return { deleteStorageLocation: mutateAsync, isLoading: isPending };
}
