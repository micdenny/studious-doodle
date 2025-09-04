import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  Sports,
  Receipt,
  AccountBalance,
  Warning,
} from '@mui/icons-material';
import { generateMockMatches, generateMockBets, generateDashboardStats } from '../../../shared/lib/mockData';

const Dashboard: React.FC = () => {
  const { matches, stats } = useMemo(() => {
    const mockMatches = generateMockMatches(25);
    const mockBets = generateMockBets(mockMatches, 150);
    const dashboardStats = generateDashboardStats(mockMatches, mockBets);
    
    return {
      matches: mockMatches,
      stats: dashboardStats,
    };
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color = 'primary',
    subtitle,
    trend
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    subtitle?: string;
    trend?: number;
  }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: 1, 
            backgroundColor: `${color}.light`,
            color: `${color}.main`,
            mr: 2 
          }}>
            {icon}
          </Box>
          <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="p" sx={{ mb: 1, fontWeight: 'bold' }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        {trend !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TrendingUp 
              sx={{ 
                fontSize: 16, 
                mr: 0.5, 
                color: trend > 0 ? 'success.main' : 'error.main' 
              }} 
            />
            <Typography 
              variant="caption" 
              color={trend > 0 ? 'success.main' : 'error.main'}
            >
              {trend > 0 ? '+' : ''}{trend}% from last week
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'primary';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Matches"
            value={stats.totalMatches}
            icon={<Sports />}
            color="primary"
            subtitle={`${stats.liveMatches} currently live`}
            trend={12}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Bets"
            value={stats.totalBets.toLocaleString()}
            icon={<Receipt />}
            color="secondary"
            subtitle="Active bets placed"
            trend={8}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Stake"
            value={formatCurrency(stats.totalStake)}
            icon={<AccountBalance />}
            color="success"
            subtitle="Total wagered amount"
            trend={15}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Profit"
            value={formatCurrency(stats.totalProfit)}
            icon={<TrendingUp />}
            color={stats.totalProfit > 0 ? 'success' : 'error'}
            subtitle="Net profit/loss"
            trend={stats.totalProfit > 0 ? 5 : -3}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Live Matches
              </Typography>
              <Box sx={{ mt: 2 }}>
                {matches
                  .filter(match => match.status === 'live')
                  .slice(0, 5)
                  .map((match) => (
                    <Box 
                      key={match.id} 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:last-child': { borderBottom: 'none' }
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          {match.homeTeam} vs {match.awayTeam}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {match.league}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        {match.score && (
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {match.score.home} - {match.score.away}
                          </Typography>
                        )}
                        <Chip 
                          label="LIVE" 
                          color="error" 
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                  ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

  <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning sx={{ mr: 1, color: getRiskColor(stats.riskLevel) + '.main' }} />
                <Typography variant="h6">
                  Risk Level
                </Typography>
              </Box>
              <Chip 
                label={stats.riskLevel.toUpperCase()}
                color={getRiskColor(stats.riskLevel) as any}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Current overall risk assessment based on exposure and betting patterns
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={stats.riskLevel === 'low' ? 30 : stats.riskLevel === 'medium' ? 60 : 85}
                color={getRiskColor(stats.riskLevel) as any}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Profit Margin</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {((stats.totalProfit / stats.totalStake) * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Active Markets</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {matches.filter(m => m.status === 'live' || m.status === 'prematch').length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Avg Bet Size</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {formatCurrency(stats.totalStake / stats.totalBets)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;