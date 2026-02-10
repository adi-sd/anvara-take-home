import {
  AdSlotType,
  CampaignStatus,
  PaymentStatus,
  PaymentType,
  PlacementStatus,
  PricingModel,
} from '@/lib/types/enums';

export interface CampaignFilters {
  status?: CampaignStatus;
  sponsorId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface AdSlotFilters {
  type?: AdSlotType;
  publisherId?: string;
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface PlacementFilters {
  status?: PlacementStatus;
  campaignId?: string;
  adSlotId?: string;
  publisherId?: string;
  pricingModel?: PricingModel;
  startDate?: string;
  endDate?: string;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  type?: PaymentType;
  sponsorId?: string;
  startDate?: string;
  endDate?: string;
}
