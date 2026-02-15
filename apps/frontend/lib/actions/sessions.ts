import { auth } from '@/auth'; // Your Better Auth instance
import { headers } from 'next/headers';
import { cache } from 'react';

// Cache the session to avoid multiple fetches in the same request
export const getServerSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
});
