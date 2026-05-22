import { openFoodFactsApi } from '@app/lib/api';
import { getCategoryIcon } from '@app/utils/categories';

export type OpenFoodFactsProduct = {
  barcode: string;
  name: string;
  brand: string;
  category: string;
  emoji: string;
  quantity: number;
  unit: string;
};

function tagsToCategory(tags: string[]): string {
  const tag = tags.map((t) => t.toLowerCase()).join(' ');
  if (tag.includes('milk') || tag.includes('dairy') || tag.includes('laticini') || tag.includes('fromage') || tag.includes('cheese') || tag.includes('yogurt')) { return 'Laticínios'; }
  if (tag.includes('fruit')) { return 'Frutas'; }
  if (tag.includes('vegetable') || tag.includes('legume') || tag.includes('vegetal')) { return 'Legumes'; }
  if (tag.includes('bread') || tag.includes('bakery') || tag.includes('padaria')) { return 'Padaria'; }
  if (tag.includes('pasta') || tag.includes('noodle') || tag.includes('macarr')) { return 'Massas'; }
  if (tag.includes('meat') || tag.includes('chicken') || tag.includes('beef') || tag.includes('pork')) { return 'Proteínas'; }
  if (tag.includes('fish') || tag.includes('seafood') || tag.includes('peixe')) { return 'Peixes'; }
  if (tag.includes('egg')) { return 'Ovos'; }
  if (tag.includes('juice') || tag.includes('suco')) { return 'Sucos'; }
  if (tag.includes('beverage') || tag.includes('drink') || tag.includes('bebida')) { return 'Bebidas'; }
  if (tag.includes('chocolate') || tag.includes('candy') || tag.includes('sweet') || tag.includes('confect')) { return 'Doces'; }
  if (tag.includes('snack') || tag.includes('chip') || tag.includes('crisp')) { return 'Snacks'; }
  if (tag.includes('cereal') || tag.includes('grain') || tag.includes('rice') || tag.includes('bean')) { return 'Grãos'; }
  if (tag.includes('frozen')) { return 'Congelados'; }
  if (tag.includes('can') || tag.includes('conserv')) { return 'Enlatados'; }
  if (tag.includes('spice') || tag.includes('sauce') || tag.includes('condiment')) { return 'Temperos'; }
  return 'Geral';
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
    const category = tagsToCategory(categoryTags);
    const { quantity, unit } = parseQuantity(p.quantity as string | undefined);

    return {
      barcode,
      name,
      brand: (p.brands as string) ?? '',
      category,
      emoji: getCategoryIcon(category),
      quantity,
      unit,
    };
  },
};
