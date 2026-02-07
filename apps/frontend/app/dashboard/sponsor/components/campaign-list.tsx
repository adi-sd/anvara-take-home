import { getCampaigns } from '@/lib/api';
import { Campaign } from '@/lib/types';
import { CampaignGrid } from './campaign-grid';
import { CampaignError } from './campaign-error';

interface CampaignListProps {
  sponsorId: string;
}

export async function CampaignList({ sponsorId }: CampaignListProps) {
  // TODO: Add refetch on tab focus for better UX
  // TODO: Add optimistic updates when creating/editing campaigns
  let campaigns: Campaign[] = [];
  let error: Error | null = null;

  try {
    campaigns = await getCampaigns(sponsorId);
  } catch (err) {
    error = err instanceof Error ? err : new Error('Failed to load campaigns');
  }

  if (error) {
    return <CampaignError error={error}></CampaignError>;
  }

  if (campaigns.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[--color-border] p-8 text-center text-[--color-muted]">
        No campaigns yet. Create your first campaign to get started.
      </div>
    );
  }

  // TODO: Add sorting options (by date, budget, status)
  // TODO: Add pagination if campaigns list gets large
  return <CampaignGrid campaigns={campaigns} />;
}
