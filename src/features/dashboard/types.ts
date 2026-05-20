export type DashboardStats = {
  total: number;
  active: number;
  completed: number;
  failed: number;
};

export type ChartPoint = {
  label: string;
  total: number;
};

export type RecentActivity = {
  id: number;
  trackingNumber: string;
  receiverName: string;
  status: string;
  updatedAt: string;
};
