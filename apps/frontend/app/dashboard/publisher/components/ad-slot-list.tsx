import { AdSlot } from '@/lib/types';
import { AdSlotGrid } from './ad-slot-grid';
import { AdSlotError } from './ad-slot-error';
import { getAdSlotsAction } from '@/lib/actions/ad-slots';

interface AdSlotListProps {
  publisherId: string;
}

export async function AdSlotList({ publisherId }: AdSlotListProps) {
  let adSlots: AdSlot[] = [];
  let error: Error | null = null;

  try {
    adSlots = await getAdSlotsAction(publisherId);
  } catch (err) {
    error = err instanceof Error ? err : new Error('Failed to load ad slots');
  }

  if (error) {
    return <AdSlotError error={error}></AdSlotError>;
  }

  if (adSlots.length === 0) {
    return (
      <AdSlotError
        error={new Error('No ad slots yet. Create your first ad slot to start earning.')}
      ></AdSlotError>
    );
  }

  return <AdSlotGrid adSlots={adSlots} />;
}
