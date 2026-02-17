import { ComponentType } from 'react';
import { AdSlot, Campaign } from '@/lib/types';
import { ItemError } from '@/app/components/dashboard/item-error';
import { ItemsGrid } from '@/app/components/dashboard/item-grid';

interface ItemListProps<T extends Campaign | AdSlot> {
  id: string;
  fetchItems: (id: string) => Promise<T[]>;
  ItemCard: ComponentType<{ item: T }>;
  errorMessage?: string;
  emptyMessage: string;
}

export async function ItemList<T extends Campaign | AdSlot>({
  id,
  fetchItems,
  ItemCard,
  errorMessage,
  emptyMessage,
}: ItemListProps<T>) {
  // TODO: Add refetch on tab focus for better UX
  // TODO: Add optimistic updates when creating/editing items
  let items: T[] = [];
  let error: Error | null = null;

  try {
    items = await fetchItems(id);
  } catch (err) {
    error = err instanceof Error ? err : new Error(errorMessage || 'Failed to load items');
  }

  if (error) {
    return <ItemError error={error.message} />;
  }

  if (items.length === 0) {
    return <ItemError error={emptyMessage} />;
  }

  // TODO: Add sorting options (by date, budget, status)
  // TODO: Add pagination if items list gets large
  return <ItemsGrid items={items} ItemCard={ItemCard} />;
}
