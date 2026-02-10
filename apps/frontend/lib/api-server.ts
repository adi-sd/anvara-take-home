import axios from 'axios';
import { cookies } from 'next/headers';
import { Campaign } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

// Create authenticated axios instance for server-side use
export async function createAuthenticatedAxios() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    validateStatus: () => true,
  });
}

export async function getCampaignsServer(sponsorId?: string): Promise<Campaign[]> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const axiosInstance = await createAuthenticatedAxios();

  const res = await axiosInstance.get(
    sponsorId ? `/api/campaigns?sponsorId=${sponsorId}` : '/api/campaigns',
    {
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
    }
  );

  if (res.status >= 400) {
    const errorData = res.data as { error?: string; message?: string };
    const errorMessage =
      errorData.message || errorData.error || `Request failed with status ${res.status}`;
    throw new Error(errorMessage);
  }

  return res.data as Campaign[];
}
