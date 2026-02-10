import {
  AdSlot,
  Campaign,
  Creative,
  Placement,
  Publisher,
  Sponsor,
  Payment,
} from '@/lib/types/core';

export interface CampaignWithRelations extends Campaign {
  sponsor: Sponsor;
  creatives?: Creative[];
  placements?: Placement[];
  _count?: {
    creatives: number;
    placements: number;
  };
}

export interface CreativeWithRelations extends Creative {
  campaign: Campaign;
  placements?: Placement[];
}

export interface AdSlotWithRelations extends AdSlot {
  publisher: Publisher;
  placements?: Placement[];
  _count?: {
    placements: number;
  };
}

export interface PlacementWithRelations extends Placement {
  campaign: Campaign;
  creative: Creative;
  adSlot: AdSlot;
  publisher: Publisher;
}

export interface SponsorWithRelations extends Sponsor {
  campaigns?: Campaign[];
  payments?: Payment[];
  _count?: {
    campaigns: number;
    payments: number;
  };
}

export interface PublisherWithRelations extends Publisher {
  adSlots?: AdSlot[];
  placements?: Placement[];
  _count?: {
    adSlots: number;
    placements: number;
  };
}
