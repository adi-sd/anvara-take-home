import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { ApiError, AdSlot, Campaign, Placement, UserInfo } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291/api';

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
  return fetchFromApi<UserInfo>(`/auth/role/${userId}`);
}

// Campaigns
export const getCampaigns = (sponsorId?: string) => {
  return fetchFromApi<Campaign[]>(sponsorId ? `/campaigns?sponsorId=${sponsorId}` : '/campaigns');
};
export const getCampaign = (id: string) => fetchFromApi<Campaign>(`/campaigns/${id}`);
export const createCampaign = (data: Campaign) =>
  fetchFromApi('/campaigns', { method: 'POST', data });
export const updateCampaign = (id: string, data: Partial<Campaign>) =>
  fetchFromApi(`/campaigns/${id}`, { method: 'PUT', data });
export const deleteCampaign = (id: string) =>
  fetchFromApi(`/campaigns/${id}`, { method: 'DELETE' });

// Ad Slots
export const getAdSlots = (publisherId?: string) =>
  fetchFromApi<AdSlot[]>(publisherId ? `/ad-slots?publisherId=${publisherId}` : '/ad-slots');
export const getAdSlot = (id: string) => fetchFromApi<AdSlot>(`/ad-slots/${id}`);
export const createAdSlot = (data: AdSlot) => fetchFromApi('/ad-slots', { method: 'POST', data });
export const updateAdSlot = (id: string, data: Partial<AdSlot>) =>
  fetchFromApi(`/ad-slots/${id}`, { method: 'PUT', data });
export const deleteAdSlot = (id: string) => fetchFromApi(`/ad-slots/${id}`, { method: 'DELETE' });

// Placements
export const getPlacements = () => fetchFromApi<Placement[]>('/placements');
export const createPlacement = (data: Placement) =>
  fetchFromApi('/placements', { method: 'POST', data });

// Dashboard
export const getStats = () => fetchFromApi<Placement>('/dashboard/stats');
