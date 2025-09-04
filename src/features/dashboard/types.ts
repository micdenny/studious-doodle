export interface DashboardStats {
  totalMatches: number;
  liveMatches: number;
  totalBets: number;
  totalStake: number;
  totalProfit: number;
  riskLevel: 'low' | 'medium' | 'high';
}