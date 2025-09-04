export interface RiskMetrics {
  totalExposure: number;
  largestPayout: number;
  riskByMatch: { [matchId: string]: number };
  profitMargin: number;
  activeMatches: number;
}