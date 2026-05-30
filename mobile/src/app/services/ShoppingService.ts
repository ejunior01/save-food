import { ShoppingItem } from "@app/types";
import { ShoppingStorage } from "@app/storage/ShoppingStorage";

export const ShoppingService = {
  async list(): Promise<ShoppingItem[]> {
    return ShoppingStorage.load();
  },

  async create(item: Omit<ShoppingItem, "id">): Promise<ShoppingItem> {
    const items = await ShoppingStorage.load();
    const newItem: ShoppingItem = { ...item, id: Date.now().toString() };
    await ShoppingStorage.save([...items, newItem]);
    return newItem;
  },

  async update(id: string, updates: Partial<Omit<ShoppingItem, "id">>): Promise<ShoppingItem> {
    const items = await ShoppingStorage.load();
    const updated = items.map((i) => (i.id === id ? { ...i, ...updates } : i));
    await ShoppingStorage.save(updated);
    const found = updated.find((i) => i.id === id);
    if (!found) { throw new Error(`ShoppingItem ${id} not found`); }
    return found;
  },

  async remove(id: string): Promise<void> {
    const items = await ShoppingStorage.load();
    await ShoppingStorage.save(items.filter((i) => i.id !== id));
  },

  async toggle(id: string): Promise<ShoppingItem> {
    const items = await ShoppingStorage.load();
    const item = items.find((i) => i.id === id);
    if (!item) { throw new Error(`ShoppingItem ${id} not found`); }
    return ShoppingService.update(id, { checked: !item.checked });
  },
};
