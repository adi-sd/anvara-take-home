import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { ApiError, AdSlot, Campaign, Placement, UserInfo } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

// Create Client Side Axios instance
const createAxiosInstance = async () => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Ensure cookies are sent with requests
  });
};

export async function fetchFromApi<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
  const axiosInstance = await createAxiosInstance();
  const response: AxiosResponse<T | ApiError> = await axiosInstance.request({
    url: endpoint,
    ...config,
  });
  if (response.status >= 400) {
    const errorData = response.data as ApiError;
    const errorMessage =
      errorData.message || errorData.error || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.data as T;
}

// Auth
export async function getCurrentUserRole(userId: string): Promise<UserInfo> {
  return fetchFromApi<UserInfo>(`/api/auth/role/${userId}`);
}

// Campaigns
export const getCampaigns = (sponsorId?: string) => {
  return fetchFromApi<Campaign[]>(
    sponsorId ? `/api/campaigns?sponsorId=${sponsorId}` : '/api/campaigns'
  );
};
export const getCampaign = (id: string) => fetchFromApi<Campaign>(`/api/campaigns/${id}`);
export const createCampaign = (data: Campaign) =>
  fetchFromApi('/api/campaigns', { method: 'POST', data });
export const updateCampaign = (id: string, data: Partial<Campaign>) =>
  fetchFromApi(`/api/campaigns/${id}`, { method: 'PUT', data });
export const deleteCampaign = (id: string) =>
  fetchFromApi(`/api/campaigns/${id}`, { method: 'DELETE' });

// Ad Slots
export const getAdSlots = (publisherId?: string) =>
  fetchFromApi<AdSlot[]>(
    publisherId ? `/api/ad-slots?publisherId=${publisherId}` : '/api/ad-slots'
  );
export const getAdSlot = (id: string) => fetchFromApi<AdSlot>(`/api/ad-slots/${id}`);
export const createAdSlot = (data: AdSlot) =>
  fetchFromApi('/api/ad-slots', { method: 'POST', data });
export const updateAdSlot = (id: string, data: Partial<AdSlot>) =>
  fetchFromApi(`/api/ad-slots/${id}`, { method: 'PUT', data });
export const deleteAdSlot = (id: string) =>
  fetchFromApi(`/api/ad-slots/${id}`, { method: 'DELETE' });

// Placements
export const getPlacements = () => fetchFromApi<Placement[]>('/api/placements');
export const createPlacement = (data: Placement) =>
  fetchFromApi('/api/placements', { method: 'POST', data });

// Dashboard
export const getStats = () => fetchFromApi<Placement>('/api/dashboard/stats');
