'use server';

import { revalidatePath } from 'next/cache';
import { Campaign } from '@/lib/types';
import { authenticatedRequest } from '@/lib/actions/helpers';
import {
  CreateCampaignInput,
  createCampaignSchema,
  UpdateCampaignInput,
  updateCampaignSchema,
} from '@/lib/schemas/campaigns';

// GET campaigns
export async function getCampaignsAction(sponsorId?: string) {
  const campaigns = await authenticatedRequest<Campaign[]>(
    'GET',
    sponsorId ? `/campaigns?sponsorId=${sponsorId}` : '/campaigns'
  );
  return campaigns;
}

// GET single campaign
export async function getCampaignAction(id: string) {
  const campaign = await authenticatedRequest<Campaign>('GET', `/campaigns/${id}`);
  return campaign;
}

// CREATE campaign
export async function createCampaignAction(data: CreateCampaignInput) {
  const validation = createCampaignSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      error: 'Invalid input',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const campaign = await authenticatedRequest<Campaign>('POST', '/campaigns', validation.data);

  revalidatePath('/campaigns');
  return campaign;
}

// UPDATE campaign
export async function updateCampaignAction(id: string, data: UpdateCampaignInput) {
  const validation = updateCampaignSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      error: 'Invalid input',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const campaign = await authenticatedRequest<Campaign>(
    'PUT',
    `/campaigns/${id}`,
    validation.data
  );

  revalidatePath('/campaigns');
  revalidatePath(`/campaigns/${id}`);
  return campaign;
}

// DELETE campaign
export async function deleteCampaignAction(id: string) {
  await authenticatedRequest('DELETE', `/campaigns/${id}`);

  revalidatePath('/campaigns');
  return { success: true };
}
