'use server';

import { revalidatePath } from 'next/cache';
import { Campaign } from '../types';
import { authenticatedRequest } from './helpers';

// GET campaigns
export async function getCampaignsAction(sponsorId?: string) {
  const campaigns = await authenticatedRequest<Campaign[]>(
    'GET',
    sponsorId ? `/api/campaigns?sponsorId=${sponsorId}` : '/api/campaigns'
  );
  return campaigns;
}

// GET single campaign
export async function getCampaignAction(id: string) {
  const campaign = await authenticatedRequest<Campaign>('GET', `/api/campaigns/${id}`);
  return campaign;
}

// CREATE campaign
export async function createCampaignAction(data: {
  name: string;
  description?: string;
  budget: number;
  cpmRate?: number;
  cpcRate?: number;
  startDate: Date | string;
  endDate: Date | string;
  targetCategories?: string[];
  targetRegions?: string[];
  sponsorId: string;
}) {
  const campaign = await authenticatedRequest<Campaign>('POST', '/api/campaigns', data);

  revalidatePath('/campaigns');
  return campaign;
}

// UPDATE campaign
export async function updateCampaignAction(id: string, data: Partial<Campaign>) {
  const campaign = await authenticatedRequest<Campaign>('PUT', `/api/campaigns/${id}`, data);

  revalidatePath('/campaigns');
  revalidatePath(`/campaigns/${id}`);
  return campaign;
}

// DELETE campaign
export async function deleteCampaignAction(id: string) {
  await authenticatedRequest('DELETE', `/api/campaigns/${id}`);

  revalidatePath('/campaigns');
  return { success: true };
}
