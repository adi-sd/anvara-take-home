import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { UserType } from '@/lib/types';
import { getUserRole } from '@/lib/auth-helpers';
import { ItemLoading } from '@/app/components/dashboard/item-loading';
import { ItemList } from '@/app/components/dashboard/item-list';
import { getCampaignsAction } from '@/lib/actions/campaigns';
import { CampaignCard } from './components/campaign-card';

export default async function SponsorDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Verify user has 'sponsor' role
  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== UserType.SPONSOR) {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        {/* TODO: Add CreateCampaignButton here */}
      </div>
      <Suspense fallback={<ItemLoading message={'Loading campaigns...'} />}>
        {/* User already verified as sponsor, so roleData.sponsorId must be defined */}
        <ItemList
          id={roleData.sponsorId!}
          fetchItems={getCampaignsAction}
          ItemCard={CampaignCard}
          emptyMessage="No campaigns found"
          errorMessage="Failed to load campaigns"
        />
      </Suspense>
    </div>
  );
}
