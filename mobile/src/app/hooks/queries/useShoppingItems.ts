import { useQuery } from '@tanstack/react-query';
import { ShoppingService } from '@app/services/ShoppingService';

export function useShoppingItems() {
  return useQuery({ queryKey: ['shopping-items'], queryFn: ShoppingService.list });
}
