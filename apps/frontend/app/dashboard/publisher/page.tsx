import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { AdSlotList } from './components/ad-slot-list';
import { UserType } from '@/lib/types';
import { AdSlotLoading } from './components/ad-slot-loading';

export default async function PublisherDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Verify user has 'publisher' role
  const roleData = await getUserRole(session.user.id);
  console.log('User role data:', roleData); // Debug log to check role data
  if (roleData.role !== UserType.PUBLISHER) {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Ad Slots</h1>
        {/* TODO: Add CreateAdSlotButton here */}
      </div>
      <Suspense fallback={<AdSlotLoading />}>
        {/* User already verified as publisher, so roleData.publisherId must be defined */}
        <AdSlotList publisherId={roleData.publisherId!} />
      </Suspense>
    </div>
  );
}
