import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { UserType } from '@/lib/types';
import { ItemLoading } from '@/app/components/dashboard/item-loading';
import { ItemList } from '@/app/components/dashboard/item-list';
import { getAdSlotsAction } from '@/lib/actions/ad-slots';
import { AdSlotCard } from './components/ad-slot-card';

export default async function PublisherDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Verify user has 'publisher' role
  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== UserType.PUBLISHER) {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Ad Slots</h1>
        {/* TODO: Add CreateAdSlotButton here */}
      </div>
      <Suspense fallback={<ItemLoading message={'Loading ad slots...'} />}>
        {/* User already verified as publisher, so roleData.publisherId must be defined */}
        <ItemList
          id={roleData.publisherId!}
          fetchItems={getAdSlotsAction}
          ItemCard={AdSlotCard}
          emptyMessage="No ad slots found"
          errorMessage="Failed to load ad slots"
        />
      </Suspense>
    </div>
  );
}
