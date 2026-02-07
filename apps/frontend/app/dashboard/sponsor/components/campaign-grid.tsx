'use client';

import { Campaign } from '@/lib/types';
import { CampaignCard } from './campaign-card';

interface CampaignGridProps {
  campaigns: Campaign[];
}

export function CampaignGrid({ campaigns }: CampaignGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign: Campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
