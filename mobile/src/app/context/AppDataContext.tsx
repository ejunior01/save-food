import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { PantryItem, Recipe, ShoppingItem, ExpiryStatus } from '@app/types';
import { usePantryItems } from '@app/hooks/queries/usePantryItems';
import { useShoppingItems } from '@app/hooks/queries/useShoppingItems';
import { useRecipes } from '@app/hooks/queries/useRecipes';
import { ShoppingService } from '@app/services/ShoppingService';
import { queryClient } from '@app/lib/queryClient';
import { seed } from '@app/storage/StorageSeed';

export type { PantryItem, RecipeIngredient, Recipe, ShoppingItem, ExpiryStatus } from '@app/types';

export function getDaysUntilExpiry(expiresAt: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(expiresAt);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function getExpiryStatus(expiresAt: Date): ExpiryStatus {
  const days = getDaysUntilExpiry(expiresAt);
  if (days <= 0) { return 'danger'; }
  if (days <= 3) { return 'warning'; }
  if (days <= 7) { return 'info'; }
  return 'success';
}

export function formatExpiryLabel(days: number): string {
  if (days < 0) { return 'Vencido'; }
  if (days === 0) { return 'Hoje'; }
  if (days === 1) { return 'Amanhã'; }
  return `${days} dias`;
}

type AppDataContextValue = {
  pantryItems: PantryItem[];
  recipes: Recipe[];
  shoppingItems: ShoppingItem[];
  expiringItems: PantryItem[];
  toggleShoppingItem: (id: string) => void;
  getExpiryStatus: typeof getExpiryStatus;
  getDaysUntilExpiry: typeof getDaysUntilExpiry;
  formatExpiryLabel: typeof formatExpiryLabel;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { data: pantryItems = [] } = usePantryItems();
  const { data: recipes = [] } = useRecipes();
  const { data: shoppingItems = [] } = useShoppingItems();

  useEffect(() => {
    seed().then(() => {
      queryClient.invalidateQueries({ queryKey: ['pantry-items'] });
      queryClient.invalidateQueries({ queryKey: ['shopping-items'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    });
  }, []);

  const expiringItems = useMemo(
    () =>
      pantryItems
        .filter((item) => getDaysUntilExpiry(item.expiresAt) <= 7)
        .sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime()),
    [pantryItems],
  );

  function toggleShoppingItem(id: string) {
    ShoppingService.toggle(id).then(() => {
      queryClient.invalidateQueries({ queryKey: ['shopping-items'] });
    });
  }

  return (
    <AppDataContext.Provider
      value={{
        pantryItems,
        recipes,
        shoppingItems,
        expiringItems,
        toggleShoppingItem,
        getExpiryStatus,
        getDaysUntilExpiry,
        formatExpiryLabel,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) { throw new Error('useAppData must be used inside AppDataProvider'); }
  return ctx;
}
