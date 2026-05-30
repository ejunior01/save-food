import { useQuery } from "@tanstack/react-query";
import { RecipesService } from "@app/services/RecipesService";

export function useRecipes() {
  return useQuery({ queryKey: ["recipes"], queryFn: RecipesService.list });
}
