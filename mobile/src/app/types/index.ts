// expired=vencido · urgent=1-5d · soon=6-15d · planned=16-30d · safe=30d+
export type ExpiryStatus = 'expired' | 'urgent' | 'soon' | 'planned' | 'safe';

export type UserPlan = 'free' | 'premium';

export type StorageLocation = {
  id: string;
  name: string;
  icon: string;
  isDefault: boolean;
};

export const DEFAULT_LOCATION_ID = 'loc_pantry';

export type PantryItem = {
  id: string;
  name: string;
  category: string;
  expiresAt: Date;
  quantity: number;
  unit: string;
  emoji: string;
  locationId: string;
  photo?: string;
};

export type RecipeIngredient = {
  name: string;
  amount: string;
  have?: boolean;
  urgent?: boolean;
};

export type Recipe = {
  id: string;
  title: string;
  duration: number;
  servings: number;
  category: string;
  emoji: string;
  photo?: string;
  imageUrl?: string;
  reason?: string;
  have?: number;
  total?: number;
  missing?: string[];
  level?: string;
  ingredients: RecipeIngredient[];
  steps: string[];
};

export type ShoppingItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  source?: 'manual' | 'recipe' | 'replenishment';
  duplicate?: boolean;
};
