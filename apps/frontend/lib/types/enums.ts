export enum UserType {
  SPONSOR = 'sponsor',
  PUBLISHER = 'publisher',
}

export enum SubscriptionTier {
  FREE = 'free',
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export enum CampaignStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum CreativeType {
  BANNER = 'banner',
  VIDEO = 'video',
  NATIVE = 'native',
  SPONSORED_POST = 'sponsored_post',
  PODCAST_READ = 'podcast_read',
}

export enum AdSlotType {
  DISPLAY = 'display',
  VIDEO = 'video',
  NATIVE = 'native',
  NEWSLETTER = 'newsletter',
  PODCAST = 'podcast',
}

export enum PricingModel {
  CPM = 'cpm',
  CPC = 'cpc',
  CPA = 'cpa',
  FLAT_RATE = 'flat_rate',
}

export enum PlacementStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export enum PaymentType {
  SUBSCRIPTION = 'subscription',
  CAMPAIGN_FUNDING = 'campaign_funding',
  REFUND = 'refund',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}
