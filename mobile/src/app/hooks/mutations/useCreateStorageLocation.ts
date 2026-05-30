import { useMutation } from "@tanstack/react-query";
import { StorageLocationService } from "@app/services/StorageLocationService";
import { queryClient } from "@app/lib/queryClient";

export function useCreateStorageLocation() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: { name: string; icon: string }) => StorageLocationService.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["storage-locations"] }); },
  });
  return { createStorageLocation: mutateAsync, isLoading: isPending };
}
