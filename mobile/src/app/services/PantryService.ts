import { PantryItem } from "@app/types";
import { PantryStorage } from "@app/storage/PantryStorage";

function createId(index = 0): string {
  return `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`;
}

export const PantryService = {
  async list(): Promise<PantryItem[]> {
    return PantryStorage.load();
  },

  async create(item: Omit<PantryItem, "id">): Promise<PantryItem> {
    const items = await PantryStorage.load();
    const newItem: PantryItem = { ...item, id: createId() };
    await PantryStorage.save([...items, newItem]);
    return newItem;
  },

  async createMany(newItems: Array<Omit<PantryItem, "id">>): Promise<PantryItem[]> {
    const items = await PantryStorage.load();
    const created = newItems.map((item, index) => ({ ...item, id: createId(index) }));
    await PantryStorage.save([...items, ...created]);
    return created;
  },

  async update(id: string, updates: Partial<Omit<PantryItem, "id">>): Promise<PantryItem> {
    const items = await PantryStorage.load();
    const updated = items.map((i) => (i.id === id ? { ...i, ...updates } : i));
    await PantryStorage.save(updated);
    const found = updated.find((i) => i.id === id);
    if (!found) { throw new Error(`PantryItem ${id} not found`); }
    return found;
  },

  async remove(id: string): Promise<void> {
    const items = await PantryStorage.load();
    await PantryStorage.save(items.filter((i) => i.id !== id));
  },
};
