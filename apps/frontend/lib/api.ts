// Simple API client
// FIXME: This client has no error response parsing - when API returns { error: "..." },
// we should extract and throw that message instead of generic "API request failed"

import { RequestInit } from 'next/dist/server/web/spec-extension/request';

import { ApiError, AdSlot, Campaign, Placement, UserInfo } from './types';

// TODO: Add authentication token to requests
// Hint: Include credentials: 'include' for cookie-based auth, or
// add Authorization header for token-based auth

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

export async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({ message: 'API request failed' }));
    throw error; // Now throws structured ApiError
  }
  return res.json();
}

// Auth
export async function getCurrentUserRole(userId: string): Promise<UserInfo> {
  return api<UserInfo>(`/api/auth/role/${userId}`);
}

// Campaigns
export const getCampaigns = (sponsorId?: string) => {
  console.log('Fetching campaigns with sponsorId:', sponsorId);
  return api<Campaign[]>(sponsorId ? `/api/campaigns?sponsorId=${sponsorId}` : '/api/campaigns');
};
export const getCampaign = (id: string) => api<Campaign>(`/api/campaigns/${id}`);
export const createCampaign = (data: Campaign) =>
  api('/api/campaigns', { method: 'POST', body: JSON.stringify(data) });
// TODO: Add updateCampaign and deleteCampaign functions

// Ad Slots
export const getAdSlots = (publisherId?: string) =>
  api<AdSlot[]>(publisherId ? `/api/ad-slots?publisherId=${publisherId}` : '/api/ad-slots');
export const getAdSlot = (id: string) => api<AdSlot>(`/api/ad-slots/${id}`);
export const createAdSlot = (data: AdSlot) =>
  api('/api/ad-slots', { method: 'POST', body: JSON.stringify(data) });
// TODO: Add updateAdSlot, deleteAdSlot functions

// Placements
export const getPlacements = () => api<Placement[]>('/api/placements');
export const createPlacement = (data: Placement) =>
  api('/api/placements', { method: 'POST', body: JSON.stringify(data) });

// Dashboard
export const getStats = () => api<Placement>('/api/dashboard/stats');
