import { PantryItem } from '@app/types';
import { PantryStorage } from '@app/storage/PantryStorage';

export const PantryService = {
  async list(): Promise<PantryItem[]> {
    return PantryStorage.load();
  },

  async create(item: Omit<PantryItem, 'id'>): Promise<PantryItem> {
    const items = await PantryStorage.load();
    const newItem: PantryItem = { ...item, id: Date.now().toString() };
    await PantryStorage.save([...items, newItem]);
    return newItem;
  },

  async update(id: string, updates: Partial<Omit<PantryItem, 'id'>>): Promise<PantryItem> {
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
