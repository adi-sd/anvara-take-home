import { ItemCardContainer } from '@/app/components/dashboard/item-card-container';
import { statusColors } from '@/lib/constants/ui-constants';
import { Campaign } from '@/lib/types';

interface CampaignCardProps {
  item: Campaign;
}

export function CampaignCard({ item: campaign }: CampaignCardProps) {
  const progress =
    campaign.budget > 0 ? (Number(campaign.spent) / Number(campaign.budget)) * 100 : 0;

  const campaignStatusBadge = (
    <span
      className={`rounded px-2 py-0.5 text-xs ${statusColors[campaign.status] || 'bg-gray-100'}`}
    >
      {campaign.status}
    </span>
  );

  return (
    <ItemCardContainer
      name={campaign.name}
      description={campaign.description}
      badge={campaignStatusBadge}
    >
      <div className="mb-2">
        <div className="flex justify-between text-sm">
          <span className="text-[--color-muted]">Budget</span>
          <span>
            ${Number(campaign.spent).toLocaleString()} / ${Number(campaign.budget).toLocaleString()}
          </span>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-gray-200">
          <div
            className="h-1.5 rounded-full bg-[--color-primary]"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
      <div className="text-xs text-[--color-muted]">
        {new Date(campaign.startDate).toLocaleDateString()} -{' '}
        {new Date(campaign.endDate).toLocaleDateString()}
      </div>
    </ItemCardContainer>
  );
}
