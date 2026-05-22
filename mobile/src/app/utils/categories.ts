export const CATEGORY_ICONS: Record<string, string> = {
  'Frutas': '🍎',
  'Legumes': '🥕',
  'Folhosas': '🥬',
  'Laticínios': '🥛',
  'Proteínas': '🍗',
  'Peixes': '🐟',
  'Ovos': '🥚',
  'Padaria': '🍞',
  'Grãos': '🌾',
  'Massas': '🍝',
  'Temperos': '🧂',
  'Bebidas': '🥤',
  'Sucos': '🧃',
  'Frios': '❄️',
  'Congelados': '🧊',
  'Enlatados': '🥫',
  'Doces': '🍫',
  'Snacks': '🍿',
  'Limpeza': '🧹',
  'Higiene': '🪥',
  'Geral': '🛒',
};

export function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] ?? '🛒';
}
