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