import AsyncStorage from "@react-native-async-storage/async-storage";
import { ShoppingItem } from "@app/types";

const KEY = "@despensacerta:shopping";

async function load(): Promise<ShoppingItem[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) { return []; }
  return JSON.parse(raw) as ShoppingItem[];
}

async function save(items: ShoppingItem[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export const ShoppingStorage = { load, save };
