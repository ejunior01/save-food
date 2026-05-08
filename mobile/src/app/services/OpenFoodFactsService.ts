import { openFoodFactsApi } from '@app/lib/api';

export type OpenFoodFactsProduct = {
  barcode: string;
  name: string;
  brand: string;
  category: string;
  emoji: string;
  quantity: number;
  unit: string;
};

function categoryToEmoji(tags: string[]): string {
  const tag = (tags[0] ?? '').toLowerCase();
  if (tag.includes('milk') || tag.includes('dairy') || tag.includes('laticini')) { return '🥛'; }
  if (tag.includes('fruit')) { return '🍎'; }
  if (tag.includes('vegetable') || tag.includes('legume')) { return '🥕'; }
  if (tag.includes('bread') || tag.includes('bakery')) { return '🍞'; }
  if (tag.includes('meat') || tag.includes('chicken') || tag.includes('protein')) { return '🍗'; }
  if (tag.includes('fish') || tag.includes('seafood')) { return '🐟'; }
  if (tag.includes('egg')) { return '🥚'; }
  if (tag.includes('beverage') || tag.includes('drink') || tag.includes('juice')) { return '🧃'; }
  if (tag.includes('chocolate') || tag.includes('candy') || tag.includes('sweet')) { return '🍫'; }
  if (tag.includes('cereal') || tag.includes('grain')) { return '🌾'; }
  return '🛒';
}

function parseQuantity(raw?: string): { quantity: number; unit: string } {
  if (!raw) { return { quantity: 1, unit: 'un' }; }
  const match = raw.match(/^([\d.,]+)\s*(.*)$/);
  if (!match) { return { quantity: 1, unit: 'un' }; }
  return {
    quantity: parseFloat(match[1].replace(',', '.')) || 1,
    unit: match[2].trim() || 'un',
  };
}

export const OpenFoodFactsService = {
  async searchByBarcode(barcode: string): Promise<OpenFoodFactsProduct | null> {
    const { data } = await openFoodFactsApi.get(`/product/${barcode}.json`);
    if (data.status !== 1 || !data.product) { return null; }

    const p = data.product;
    const name: string = p.product_name_pt || p.product_name || '';
    if (!name) { return null; }

    const categoryTags: string[] = p.categories_tags ?? [];
    const category: string = p.categories?.split(',')[0]?.trim() ?? 'Geral';
    const { quantity, unit } = parseQuantity(p.quantity as string | undefined);

    return {
      barcode,
      name,
      brand: (p.brands as string) ?? '',
      category,
      emoji: categoryToEmoji(categoryTags),
      quantity,
      unit,
    };
  },
};
