'use server';

import { revalidatePath } from 'next/cache';
import { authenticatedRequest } from './helpers';
import { AdSlot } from '../types';

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
export async function createAdSlotAction(data: {
  name: string;
  description?: string;
  publisherId: string;
}) {
  const adSlot = await authenticatedRequest<AdSlot>('POST', '/api/ad-slots', data);

  revalidatePath('/ad-slots');
  return adSlot;
}

// UPDATE Ad Slot
export async function updateAdSlotAction(id: string, data: Partial<AdSlot>) {
  const adSlot = await authenticatedRequest<AdSlot>('PUT', `/api/ad-slots/${id}`, data);

  revalidatePath('/ad-slots');
  revalidatePath(`/ad-slots/${id}`);
  return adSlot;
}

// DELETE Ad Slot
export async function deleteAdSlotAction(id: string) {
  await authenticatedRequest('DELETE', `/api/ad-slots/${id}`);

  revalidatePath('/ad-slots');
  return { success: true };
}

// POST book ad slot
export async function bookAdSlotAction(adSlotId: string, campaignId: string) {
  await authenticatedRequest('POST', `/api/ad-slots/${adSlotId}/book`, { campaignId });

  revalidatePath('/ad-slots');
  return { success: true };
}

// POST unbook ad slot
export async function unbookAdSlotAction(adSlotId: string) {
  await authenticatedRequest('POST', `/api/ad-slots/${adSlotId}/unbook`);

  revalidatePath('/ad-slots');
  return { success: true };
}
