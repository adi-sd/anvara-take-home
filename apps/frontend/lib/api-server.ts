import { cookies } from 'next/headers';
import { Campaign } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

export async function getCampaignsServer(sponsorId?: string): Promise<Campaign[]> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const url = sponsorId
    ? `${API_URL}/api/campaigns?sponsorId=${sponsorId}`
    : `${API_URL}/api/campaigns`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({
      message: 'API request failed',
    }));
    throw error;
  }

  return res.json();
}
