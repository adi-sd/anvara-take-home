import { AdSlotType, CreativeType, PaymentType, PricingModel } from '@/lib/types/enums';

export interface CreateSponsorInput {
  name: string;
  email: string;
  website?: string;
  logo?: string;
  description?: string;
  industry?: string;
  userId?: string;
}

export interface CreatePublisherInput {
  name: string;
  email: string;
  website?: string;
  avatar?: string;
  bio?: string;
  category?: string;
  userId?: string;
}

export interface CreateCampaignInput {
  name: string;
  description?: string;
  budget: number;
  cpmRate?: number;
  cpcRate?: number;
  startDate: string | Date;
  endDate: string | Date;
  targetCategories?: string[];
  targetRegions?: string[];
  sponsorId: string;
}

export interface CreateCreativeInput {
  name: string;
  type: CreativeType;
  assetUrl: string;
  clickUrl: string;
  altText?: string;
  width?: number;
  height?: number;
  campaignId: string;
}

export interface CreateAdSlotInput {
  name: string;
  description?: string;
  type: AdSlotType;
  position?: string;
  width?: number;
  height?: number;
  basePrice: number;
  cpmFloor?: number;
  publisherId: string;
}

export interface CreatePlacementInput {
  agreedPrice: number;
  pricingModel: PricingModel;
  startDate: string | Date;
  endDate: string | Date;
  campaignId: string;
  creativeId: string;
  adSlotId: string;
  publisherId: string;
}

export interface CreatePaymentInput {
  amount: number;
  currency?: string;
  type: PaymentType;
  stripePaymentId?: string;
  description?: string;
  sponsorId: string;
}
