import { Recipe } from "@app/types";
import { RecipesStorage } from "@app/storage/RecipesStorage";

export const RecipesService = {
  async list(): Promise<Recipe[]> {
    return RecipesStorage.load();
  },
};
