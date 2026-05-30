import { StorageLocation } from "@app/types";
import { StorageLocationStorage } from "@app/storage/StorageLocationStorage";

export const StorageLocationService = {
  async list(): Promise<StorageLocation[]> {
    return StorageLocationStorage.load();
  },

  async create(data: { name: string; icon: string }): Promise<StorageLocation> {
    const locations = await StorageLocationStorage.load();
    const newLoc: StorageLocation = { ...data, id: Date.now().toString(), isDefault: false };
    await StorageLocationStorage.save([...locations, newLoc]);
    return newLoc;
  },

  async remove(id: string): Promise<void> {
    const locations = await StorageLocationStorage.load();
    const loc = locations.find((l) => l.id === id);
    if (!loc || loc.isDefault) { return; }
    await StorageLocationStorage.save(locations.filter((l) => l.id !== id));
  },
};
