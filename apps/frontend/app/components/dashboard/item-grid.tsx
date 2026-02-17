import { ComponentType } from 'react';
import { Campaign, AdSlot } from '@/lib/types';

interface ItemsGridProps<T extends Campaign | AdSlot> {
  items: T[];
  ItemCard: ComponentType<{ item: T }>;
}

export function ItemsGrid<T extends Campaign | AdSlot>({ items, ItemCard }: ItemsGridProps<T>) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
