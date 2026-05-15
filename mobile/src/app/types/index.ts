export type ExpiryStatus = 'danger' | 'warning' | 'info' | 'success';

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
};

export type RecipeIngredient = {
  name: string;
  amount: string;
};

export type Recipe = {
  id: string;
  title: string;
  duration: number;
  servings: number;
  category: string;
  emoji: string;
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
};
