import {
  AdSlotType,
  CampaignStatus,
  CreativeType,
  PaymentStatus,
  PlacementStatus,
  PricingModel,
  SubscriptionTier,
} from '@/lib/types/enums';

export interface UpdateSponsorInput {
  name?: string;
  email?: string;
  website?: string | null;
  logo?: string | null;
  description?: string | null;
  industry?: string | null;
  subscriptionTier?: SubscriptionTier;
  isActive?: boolean;
}

export interface UpdatePublisherInput {
  name?: string;
  email?: string;
  website?: string | null;
  avatar?: string | null;
  bio?: string | null;
  monthlyViews?: number;
  subscriberCount?: number;
  category?: string | null;
  isActive?: boolean;
}

export interface UpdateCampaignInput {
  name?: string;
  description?: string | null;
  budget?: number;
  cpmRate?: number | null;
  cpcRate?: number | null;
  startDate?: string | Date;
  endDate?: string | Date;
  targetCategories?: string[];
  targetRegions?: string[];
  status?: CampaignStatus;
}

export interface UpdateCreativeInput {
  name?: string;
  type?: CreativeType;
  assetUrl?: string;
  clickUrl?: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
  isApproved?: boolean;
  isActive?: boolean;
}

export interface UpdateAdSlotInput {
  name?: string;
  description?: string | null;
  type?: AdSlotType;
  position?: string | null;
  width?: number | null;
  height?: number | null;
  basePrice?: number;
  cpmFloor?: number | null;
  isAvailable?: boolean;
}

export interface UpdatePlacementInput {
  agreedPrice?: number;
  pricingModel?: PricingModel;
  startDate?: string | Date;
  endDate?: string | Date;
  status?: PlacementStatus;
}

export interface UpdatePaymentInput {
  status?: PaymentStatus;
  stripePaymentId?: string;
  invoiceUrl?: string;
  description?: string | null;
}
