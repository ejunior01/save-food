import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { PantryItem, Recipe, ShoppingItem, ExpiryStatus, StorageLocation } from '@app/types';
import { usePantryItems } from '@app/hooks/queries/usePantryItems';
import { useShoppingItems } from '@app/hooks/queries/useShoppingItems';
import { useRecipes } from '@app/hooks/queries/useRecipes';
import { useStorageLocations } from '@app/hooks/queries/useStorageLocations';
import { ShoppingService } from '@app/services/ShoppingService';
import { queryClient } from '@app/lib/queryClient';
import { seed } from '@app/storage/StorageSeed';
import {
  requestNotificationPermissions,
  scheduleItemNotifications,
} from '@app/services/NotificationService';

export type { PantryItem, RecipeIngredient, Recipe, ShoppingItem, ExpiryStatus, StorageLocation } from '@app/types';

export function getDaysUntilExpiry(expiresAt: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(expiresAt);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

// Thresholds: expired ≤0 · urgent 1-5 · soon 6-15 · planned 16-30 · safe >30
export function getExpiryStatus(expiresAt: Date): ExpiryStatus {
  const days = getDaysUntilExpiry(expiresAt);
  if (days <= 0) return 'expired';
  if (days <= 5) return 'urgent';
  if (days <= 15) return 'soon';
  if (days <= 30) return 'planned';
  return 'safe';
}

export function formatExpiryLabel(days: number): string {
  if (days < 0) return `Venceu há ${Math.abs(days)}d`;
  if (days === 0) return 'Vence hoje';
  if (days === 1) return 'Amanhã';
  if (days <= 30) return `${days} dias`;
  return `${Math.round(days / 30)} mês`;
}

type AppDataContextValue = {
  pantryItems: PantryItem[];
  recipes: Recipe[];
  shoppingItems: ShoppingItem[];
  expiringItems: PantryItem[];
  storageLocations: StorageLocation[];
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
  const { data: storageLocations = [] } = useStorageLocations();
  const notifScheduledRef = useRef(false);

  useEffect(() => {
    seed().then(() => {
      queryClient.invalidateQueries({ queryKey: ['pantry-items'] });
      queryClient.invalidateQueries({ queryKey: ['shopping-items'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['storage-locations'] });
    });
  }, []);

  useEffect(() => {
    if (notifScheduledRef.current || pantryItems.length === 0) return;
    notifScheduledRef.current = true;
    (async () => {
      const granted = await requestNotificationPermissions();
      if (!granted) return;
      for (const item of pantryItems) {
        await scheduleItemNotifications(item);
      }
    })();
  }, [pantryItems]);

  const expiringItems = useMemo(
    () =>
      pantryItems
        .filter((item) => getDaysUntilExpiry(item.expiresAt) <= 15)
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
        storageLocations,
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
  if (!ctx) throw new Error('useAppData must be used inside AppDataProvider');
  return ctx;
}
