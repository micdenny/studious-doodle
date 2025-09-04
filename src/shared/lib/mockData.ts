import { Match } from '../../features/matches/types';
import { Bet } from '../../features/bets/types';
import { RiskMetrics } from '../../features/risk-management/types';
import { DashboardStats } from '../../features/dashboard/types';
import { User, Permission } from '../../features/users/types';

const teams = [
  'Manchester United', 'Chelsea', 'Arsenal', 'Liverpool', 'Manchester City',
  'Tottenham', 'Leicester City', 'West Ham', 'Newcastle', 'Brighton',
  'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla', 'Valencia',
  'Bayern Munich', 'Dortmund', 'RB Leipzig', 'Bayer Leverkusen', 'Frankfurt'
];

const leagues = [
  'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1'
];

export const generateMockMatches = (count: number = 20): Match[] => {
  const matches: Match[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const homeTeam = teams[Math.floor(Math.random() * teams.length)];
    let awayTeam = teams[Math.floor(Math.random() * teams.length)];
    while (awayTeam === homeTeam) {
      awayTeam = teams[Math.floor(Math.random() * teams.length)];
    }

    const isLive = Math.random() < 0.3;
    const isPrematch = Math.random() < 0.6;
    
    let status: Match['status'];
    if (isLive) {
      status = 'live';
    } else if (isPrematch) {
      status = 'prematch';
    } else {
      status = Math.random() < 0.8 ? 'finished' : 'postponed';
    }

    const startTime = new Date(now.getTime() + (Math.random() - 0.5) * 24 * 60 * 60 * 1000);
    
    const match: Match = {
      id: `match_${i + 1}`,
      homeTeam,
      awayTeam,
      league: leagues[Math.floor(Math.random() * leagues.length)],
      startTime,
      status,
      score: status === 'live' || status === 'finished' ? {
        home: Math.floor(Math.random() * 4),
        away: Math.floor(Math.random() * 4),
      } : undefined,
      odds: {
        home: +(1.5 + Math.random() * 3).toFixed(2),
        draw: +(2.8 + Math.random() * 1.5).toFixed(2),
        away: +(1.5 + Math.random() * 3).toFixed(2),
      },
      totalBets: Math.floor(Math.random() * 500) + 50,
      totalStake: Math.floor(Math.random() * 50000) + 5000,
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as Match['riskLevel'],
    };

    matches.push(match);
  }

  return matches;
};

export const generateMockBets = (matches: Match[], count: number = 100): Bet[] => {
  const bets: Bet[] = [];
  const betTypes = ['1X2', 'Over/Under', 'Both Teams Score', 'Asian Handicap'];
  const selections = ['Home Win', 'Draw', 'Away Win', 'Over 2.5', 'Under 2.5', 'Yes', 'No'];

  for (let i = 0; i < count; i++) {
    const match = matches[Math.floor(Math.random() * matches.length)];
    const stake = Math.floor(Math.random() * 1000) + 10;
    const odds = +(1.5 + Math.random() * 4).toFixed(2);
    
    const bet: Bet = {
      id: `bet_${i + 1}`,
      userId: `user_${Math.floor(Math.random() * 1000) + 1}`,
      matchId: match.id,
      betType: betTypes[Math.floor(Math.random() * betTypes.length)],
      selection: selections[Math.floor(Math.random() * selections.length)],
      odds,
      stake,
      potentialWin: +(stake * odds).toFixed(2),
      status: ['pending', 'won', 'lost', 'void'][Math.floor(Math.random() * 4)] as Bet['status'],
      placedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      settledAt: Math.random() < 0.7 ? new Date() : undefined,
    };

    bets.push(bet);
  }

  return bets;
};

export const generateRiskMetrics = (matches: Match[], bets: Bet[]): RiskMetrics => {
  const totalStake = bets.reduce((sum, bet) => sum + bet.stake, 0);
  const totalPotentialPayout = bets.reduce((sum, bet) => sum + bet.potentialWin, 0);
  
  return {
    totalExposure: totalPotentialPayout - totalStake,
    largestPayout: Math.max(...bets.map(bet => bet.potentialWin)),
    riskByMatch: matches.reduce((acc, match) => {
      const matchBets = bets.filter(bet => bet.matchId === match.id);
      acc[match.id] = matchBets.reduce((sum, bet) => sum + bet.potentialWin, 0);
      return acc;
    }, {} as { [matchId: string]: number }),
    profitMargin: +((totalStake - totalPotentialPayout * 0.85) / totalStake * 100).toFixed(2),
    activeMatches: matches.filter(m => m.status === 'live' || m.status === 'prematch').length,
  };
};

export const generateDashboardStats = (matches: Match[], bets: Bet[]): DashboardStats => {
  const totalStake = bets.reduce((sum, bet) => sum + bet.stake, 0);
  const wonBets = bets.filter(bet => bet.status === 'won');
  const totalPayout = wonBets.reduce((sum, bet) => sum + bet.potentialWin, 0);
  const totalProfit = totalStake - totalPayout;

  return {
    totalMatches: matches.length,
    liveMatches: matches.filter(m => m.status === 'live').length,
    totalBets: bets.length,
    totalStake,
    totalProfit,
    riskLevel: totalProfit > totalStake * 0.1 ? 'low' : totalProfit > 0 ? 'medium' : 'high',
  };
};

export const availablePermissions: Permission[] = [
  { id: 'dashboard_view', name: 'View Dashboard', description: 'Access to dashboard and analytics' },
  { id: 'matches_view', name: 'View Matches', description: 'Access to live and prematch matches' },
  { id: 'matches_manage', name: 'Manage Matches', description: 'Create, edit, and delete matches' },
  { id: 'bets_view', name: 'View Bets', description: 'Access to bets management' },
  { id: 'bets_manage', name: 'Manage Bets', description: 'Approve, reject, and modify bets' },
  { id: 'risk_view', name: 'View Risk Management', description: 'Access to risk management tools' },
  { id: 'risk_manage', name: 'Manage Risk', description: 'Configure risk settings and limits' },
  { id: 'users_view', name: 'View Users', description: 'Access to user management' },
  { id: 'users_manage', name: 'Manage Users', description: 'Create, edit, and delete users' },
  { id: 'system_admin', name: 'System Administration', description: 'Full system administration access' },
];

export const generateMockUsers = (count: number = 15): User[] => {
  const users: User[] = [];
  const roles: User['role'][] = ['admin', 'user', 'guest'];
  const firstNames = ['Marco', 'Giuseppe', 'Francesco', 'Antonio', 'Alessandro', 'Andrea', 'Matteo', 'Lorenzo', 'Gabriele', 'Stefano', 'Luca', 'Federico', 'Davide', 'Riccardo', 'Michele'];
  const lastNames = ['Rossi', 'Bianchi', 'Verdi', 'Russo', 'Ferrari', 'Esposito', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'Mancini', 'Costa', 'Giordano'];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    
    let permissions: string[] = [];
    switch (role) {
      case 'admin':
        permissions = availablePermissions.map(p => p.id);
        break;
      case 'user':
        permissions = ['dashboard_view', 'matches_view', 'bets_view', 'risk_view'];
        break;
      case 'guest':
        permissions = ['dashboard_view', 'matches_view'];
        break;
    }

    const user: User = {
      id: `user_${i + 1}`,
      username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@sportsbet.com`,
      firstName,
      lastName,
      role,
      permissions,
      isActive: Math.random() > 0.1, // 90% active users
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      lastLogin: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
    };

    users.push(user);
  }

  return users;
};