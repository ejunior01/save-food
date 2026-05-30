import { useQuery } from "@tanstack/react-query";
import { StorageLocationService } from "@app/services/StorageLocationService";

export function useStorageLocations() {
  return useQuery({
    queryKey: ["storage-locations"],
    queryFn: () => StorageLocationService.list(),
  });
}
