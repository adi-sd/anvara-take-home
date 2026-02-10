// frontend/lib/auth-helpers.ts
import { headers } from 'next/headers';
import { UserType } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

export interface RoleData {
  role: UserType | null;
  sponsorId?: string;
  publisherId?: string;
  name?: string;
}

/**
 * Fetch user role from backend API (forwards cookies from request)
 */
export async function getUserRole(userId: string): Promise<RoleData> {
  try {
    // Get cookies from the incoming request
    const headersList = await headers();
    const cookie = headersList.get('cookie') || '';

    const res = await fetch(`${API_URL}/api/auth/role/${userId}`, {
      cache: 'no-store',
      headers: {
        Cookie: cookie, // Forward the cookie from the incoming request
      },
    });

    if (!res.ok) {
      return { role: null };
    }

    const data = await res.json();

    return {
      ...data,
      role: data.role as UserType, // Ensure role is typed correctly
    };
  } catch (error) {
    return { role: null };
  }
}
