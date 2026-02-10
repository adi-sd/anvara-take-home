import {
  CampaignStatus,
  CreativeType,
  AdSlotType,
  PricingModel,
  PlacementStatus,
  PaymentType,
  PaymentStatus,
  SubscriptionTier,
  UserType,
} from '@/lib/types/enums';

// User Types
export interface UserInfo {
  id: string;
  email: string;
  name?: string;
  role: UserType;
  sponsorId?: string;
  publisherId?: string;
}

export interface AuthSession {
  user: UserInfo;
  expiresAt: string;
}

export interface Sponsor {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  website: string | null;
  logo: string | null;
  description: string | null;
  industry: string | null;
  subscriptionTier: SubscriptionTier;
  subscriptionEndsAt: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Publisher {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  website: string | null;
  avatar: string | null;
  bio: string | null;
  monthlyViews: number;
  subscriberCount: number;
  category: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// CAMPAIGNS & ADS

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  budget: number;
  spent: number;
  cpmRate: number | null;
  cpcRate: number | null;
  startDate: string;
  endDate: string;
  targetCategories: string[];
  targetRegions: string[];
  status: CampaignStatus;
  sponsorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Creative {
  id: string;
  name: string;
  type: CreativeType;
  assetUrl: string;
  clickUrl: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  isApproved: boolean;
  isActive: boolean;
  campaignId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdSlot {
  id: string;
  name: string;
  description: string | null;
  type: AdSlotType;
  position: string | null;
  width: number | null;
  height: number | null;
  basePrice: number;
  cpmFloor: number | null;
  isAvailable: boolean;
  publisherId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Placement {
  id: string;
  impressions: number;
  clicks: number;
  conversions: number;
  agreedPrice: number;
  pricingModel: PricingModel;
  startDate: string;
  endDate: string;
  status: PlacementStatus;
  campaignId: string;
  creativeId: string;
  adSlotId: string;
  publisherId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  type: PaymentType;
  status: PaymentStatus;
  stripePaymentId: string | null;
  invoiceUrl: string | null;
  description: string | null;
  sponsorId: string;
  createdAt: string;
  updatedAt: string;
}
