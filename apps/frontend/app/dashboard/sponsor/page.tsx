import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { UserRole } from '@/lib/types';
import { getUserRole } from '@/lib/auth-helpers';
import { CampaignList } from './components/campaign-list';
import { CampaignLoading } from './components/campaign-loading';

export default async function SponsorDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Verify user has 'sponsor' role
  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== UserRole.SPONSOR) {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        {/* TODO: Add CreateCampaignButton here */}
      </div>
      <Suspense fallback={<CampaignLoading />}>
        {/* User already verified as sponsor, so roleData.sponsorId must be defined */}
        <CampaignList sponsorId={roleData.sponsorId!} />
      </Suspense>
    </div>
  );
}
