import { DEFAULT_LOCATION_ID, StorageLocation } from "@app/types";

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@despensacerta:storage_locations";

export const DEFAULT_LOCATION: StorageLocation = {
  id: DEFAULT_LOCATION_ID,
  name: "Despensa",
  icon: "🗄️",
  isDefault: true,
};

async function load(): Promise<StorageLocation[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) { return [DEFAULT_LOCATION]; }
  const parsed: StorageLocation[] = JSON.parse(raw);
  if (!parsed.find((l) => l.isDefault)) { parsed.unshift(DEFAULT_LOCATION); }
  return parsed;
}

async function save(locations: StorageLocation[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(locations));
}

export const StorageLocationStorage = { load, save };
