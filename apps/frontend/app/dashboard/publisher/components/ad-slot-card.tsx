'use client';

import { ItemCardContainer } from '@/app/components/dashboard/item-card-container';
import { typeColors } from '@/lib/constants/ui-constants';
import { AdSlot } from '@/lib/types';

interface AdSlotCardProps {
  item: AdSlot;
}

export function AdSlotCard({ item: adSlot }: AdSlotCardProps) {
  const adTypeBadge = (
    <span className={`rounded px-2 py-0.5 text-xs ${typeColors[adSlot.type] || 'bg-gray-100'}`}>
      {adSlot.type}
    </span>
  );

  return (
    <ItemCardContainer name={adSlot.name} description={adSlot.description} badge={adTypeBadge}>
      <div className="flex items-center justify-between">
        <span
          className={`text-sm ${adSlot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
        >
          {adSlot.isAvailable ? 'Available' : 'Booked'}
        </span>
        <span className="font-semibold text-[--color-primary]">
          ${Number(adSlot.basePrice).toLocaleString()}/mo
        </span>
      </div>
    </ItemCardContainer>
  );
}
