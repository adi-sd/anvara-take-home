'use server';

import { authenticatedRequest } from '@/lib/actions/helpers';
import { UserInfo } from '@/lib/types';

// GET Current user Info
export async function getUserInfo() {
  const userInfo = await authenticatedRequest<UserInfo>('GET', '/auth/me');
  return userInfo;
}

// GET User role based on Sponsor/Publisher records
export async function getUserRole(userId: string) {
  const roleData = await authenticatedRequest<{
    role: string;
    sponsorId?: string;
    publisherId?: string;
  }>('GET', `/auth/role/${userId}`);
  return roleData;
}
