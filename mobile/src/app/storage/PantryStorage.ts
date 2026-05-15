import AsyncStorage from '@react-native-async-storage/async-storage';
import { PantryItem } from '@app/types';

const KEY = '@savefood:pantry';

type RawPantryItem = Omit<PantryItem, 'expiresAt'> & { expiresAt: string };

async function load(): Promise<PantryItem[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) { return []; }
  const parsed: RawPantryItem[] = JSON.parse(raw);
  return parsed.map((item) => ({
    ...item,
    locationId: item.locationId ?? 'loc_pantry',
    expiresAt: new Date(item.expiresAt),
  }));
}

async function save(items: PantryItem[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export const PantryStorage = { load, save };
