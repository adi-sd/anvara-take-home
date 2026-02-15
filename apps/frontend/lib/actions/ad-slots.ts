'use server';

import { revalidatePath } from 'next/cache';
import { authenticatedRequest } from '@/lib/actions/helpers';
import { AdSlot } from '@/lib/types';
import {
  CreateAdSlotInput,
  UpdateAdSlotInput,
  updateAdSlotSchema,
  createAdSlotSchema,
} from '@/lib/schemas/ad-slot';

// GET Ad Slots
export async function getAdSlotsAction(publisherId?: string) {
  const adSlots = await authenticatedRequest<AdSlot[]>(
    'GET',
    publisherId ? `/api/ad-slots?publisherId=${publisherId}` : '/api/ad-slots'
  );
  return adSlots;
}

// GET single Ad Slot
export async function getAdSlotAction(id: string) {
  const adSlot = await authenticatedRequest<AdSlot>('GET', `/api/ad-slots/${id}`);
  return adSlot;
}

// CREATE Ad Slot
export async function createAdSlotAction(data: CreateAdSlotInput) {
  const validation = createAdSlotSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      error: 'Invalid input',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const adSlot = await authenticatedRequest<AdSlot>('POST', '/api/ad-slots', validation.data);

  revalidatePath('/ad-slots');
  return adSlot;
}

// UPDATE Ad Slot
export async function updateAdSlotAction(id: string, data: UpdateAdSlotInput) {
  const validation = updateAdSlotSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      error: 'Invalid input',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const adSlot = await authenticatedRequest<AdSlot>('PUT', `/api/ad-slots/${id}`, validation.data);

  revalidatePath('/ad-slots');
  revalidatePath(`/ad-slots/${id}`);
  return adSlot;
}

// DELETE Ad Slot
export async function deleteAdSlotAction(id: string) {
  await authenticatedRequest('DELETE', `/ad-slots/${id}`);

  revalidatePath('/ad-slots');
  return { success: true };
}

// POST book ad slot
export async function bookAdSlotAction(adSlotId: string, campaignId: string) {
  await authenticatedRequest('POST', `/ad-slots/${adSlotId}/book`, { campaignId });

  revalidatePath('/ad-slots');
  return { success: true };
}

// POST unbook ad slot
export async function unbookAdSlotAction(adSlotId: string) {
  await authenticatedRequest('POST', `/ad-slots/${adSlotId}/unbook`);

  revalidatePath('/ad-slots');
  return { success: true };
}
