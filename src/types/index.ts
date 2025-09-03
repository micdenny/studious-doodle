export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: Date;
  status: 'live' | 'prematch' | 'finished' | 'postponed';
  score?: {
    home: number;
    away: number;
  };
  odds: {
    home: number;
    draw?: number;
    away: number;
  };
  totalBets: number;
  totalStake: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Bet {
  id: string;
  userId: string;
  matchId: string;
  betType: string;
  selection: string;
  odds: number;
  stake: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost' | 'void';
  placedAt: Date;
  settledAt?: Date;
}

export interface RiskMetrics {
  totalExposure: number;
  largestPayout: number;
  riskByMatch: { [matchId: string]: number };
  profitMargin: number;
  activeMatches: number;
}

export interface DashboardStats {
  totalMatches: number;
  liveMatches: number;
  totalBets: number;
  totalStake: number;
  totalProfit: number;
  riskLevel: 'low' | 'medium' | 'high';
}