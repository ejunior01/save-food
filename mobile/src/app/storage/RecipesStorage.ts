import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recipe } from "@app/types";

const KEY = "@despensacerta:recipes";

async function load(): Promise<Recipe[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) { return []; }
  return JSON.parse(raw) as Recipe[];
}

async function save(items: Recipe[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export const RecipesStorage = { load, save };
