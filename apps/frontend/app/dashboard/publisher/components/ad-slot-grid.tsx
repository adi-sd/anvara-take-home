'use client';

import { AdSlot } from '@/lib/types';
import { AdSlotCard } from './ad-slot-card';

interface AdSlotGridProps {
  adSlots: AdSlot[];
}

export function AdSlotGrid({ adSlots }: AdSlotGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {adSlots.map((adSlot: AdSlot) => (
        <AdSlotCard key={adSlot.id} adSlot={adSlot} />
      ))}
    </div>
  );
}
