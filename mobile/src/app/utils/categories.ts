export const CATEGORY_ICONS: Record<string, string> = {
  "Vegetais": "🥬",
  "Frutas": "🍎",
  "Laticínios": "🥛",
  "Proteínas": "🍗",
  "Grãos": "🌾",
  "Padaria": "🍞",
  "Mercearia": "🫒",
  "Limpeza": "🧴",
  "Legumes": "🥕",
  "Folhosas": "🥬",
  "Peixes": "🐟",
  "Ovos": "🥚",
  "Massas": "🍝",
  "Temperos": "🧂",
  "Bebidas": "🥤",
  "Sucos": "🧃",
  "Frios": "❄️",
  "Congelados": "🧊",
  "Enlatados": "🥫",
  "Doces": "🍫",
  "Snacks": "🍿",
  "Higiene": "🪥",
  "Geral": "🛒",
};

export const CATEGORY_COLORS: Record<string, string> = {
  "Vegetais": "#C8D9B5",
  "Frutas": "#F2C57C",
  "Laticínios": "#F0E6CF",
  "Proteínas": "#EAB5A8",
  "Grãos": "#D5E2A8",
  "Padaria": "#E8D2A8",
  "Mercearia": "#DCC9A3",
  "Limpeza": "#D6D6CC",
};

export function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] ?? "🛒";
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "#F6F0E2";
}

export function getLocationName(locationId: string): string {
  if (locationId === "loc_fridge") {return "Geladeira";}
  if (locationId === "loc_freezer") {return "Freezer";}
  return "Despensa";
}
