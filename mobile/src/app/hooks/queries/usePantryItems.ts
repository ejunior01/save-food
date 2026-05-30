import { useQuery } from "@tanstack/react-query";
import { PantryService } from "@app/services/PantryService";

export function usePantryItems() {
  return useQuery({ queryKey: ["pantry-items"], queryFn: PantryService.list });
}
