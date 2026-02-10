export interface CampaignStats {
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalSpent: number;
  averageCTR: number;
  averageCPC: number;
  averageCPM: number;
  roi: number;
}

export interface PublisherStats {
  totalEarnings: number;
  activePlacements: number;
  totalImpressions: number;
  totalClicks: number;
  averageCPM: number;
  fillRate: number;
}

export interface DashboardStats {
  campaigns: {
    total: number;
    active: number;
    draft: number;
    completed: number;
  };
  placements: {
    total: number;
    active: number;
    pending: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  performance: {
    totalImpressions: number;
    totalClicks: number;
    averageCTR: number;
  };
}
