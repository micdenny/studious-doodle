import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  Security,
  MonetizationOn,
  Block,
} from '@mui/icons-material';
import { generateMockMatches, generateMockBets, generateRiskMetrics } from '../../../shared/lib/mockData';

const RiskManagement: React.FC = () => {
  const [matches] = useState(() => generateMockMatches(30));
  const [bets] = useState(() => generateMockBets(generateMockMatches(30), 200));
  const riskMetrics = useMemo(() => generateRiskMetrics(matches, bets), [matches, bets]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskLevel = (exposure: number, threshold: number) => {
    const ratio = exposure / threshold;
    if (ratio < 0.5) return 'low';
    if (ratio < 0.8) return 'medium';
    return 'high';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'primary';
    }
  };

  const highRiskMatches = matches
    .filter(match => match.riskLevel === 'high')
    .sort((a, b) => b.totalStake - a.totalStake)
    .slice(0, 10);

  const riskAlerts = [
    {
      id: 1,
      type: 'high_exposure',
      message: 'Match Real Madrid vs Barcelona has exceeded 80% risk threshold',
      severity: 'error' as const,
      timestamp: new Date(),
    },
    {
      id: 2,
      type: 'unusual_betting',
      message: 'Unusual betting pattern detected on Manchester United vs Chelsea',
      severity: 'warning' as const,
      timestamp: new Date(),
    },
    {
      id: 3,
      type: 'large_bet',
      message: 'Large bet ($50,000) placed on Bayern Munich vs Dortmund',
      severity: 'info' as const,
      timestamp: new Date(),
    },
  ];

  const RiskCard = ({ 
    title, 
    value, 
    icon, 
    color = 'primary',
    subtitle,
    riskLevel
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    subtitle?: string;
    riskLevel?: string;
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
          {riskLevel && (
            <Chip 
              label={riskLevel.toUpperCase()}
              color={getRiskColor(riskLevel) as any}
              size="small"
            />
          )}
        </Box>
        <Typography variant="h4" component="p" sx={{ mb: 1, fontWeight: 'bold' }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  // Mobile card component for high risk matches
  const HighRiskMatchCard: React.FC<{ match: any }> = ({ match }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'medium', lineHeight: 1.2 }}>
              {match.homeTeam} vs {match.awayTeam}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {match.league}
            </Typography>
          </Box>
          <Chip 
            label={match.riskLevel.toUpperCase()}
            color={getRiskColor(match.riskLevel) as any}
            size="small"
          />
        </Box>
        
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid size={6}>
            <Typography variant="caption" color="text.secondary">Exposure</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {formatCurrency(riskMetrics.riskByMatch[match.id] || 0)}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="caption" color="text.secondary">Bets</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {match.totalBets}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title="Suspend betting">
            <IconButton size="small" color="error">
              <Block />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Risk Management
      </Typography>

      {/* Risk Alerts */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Risk Alerts
        </Typography>
        {riskAlerts.map((alert) => (
          <Alert 
            key={alert.id}
            severity={alert.severity}
            sx={{ mb: 1 }}
            action={
              <IconButton size="small" color="inherit">
                <Block />
              </IconButton>
            }
          >
            {alert.message}
          </Alert>
        ))}
      </Box>

      {/* Risk Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <RiskCard
            title="Total Exposure"
            value={formatCurrency(riskMetrics.totalExposure)}
            icon={<Warning />}
            color="error"
            subtitle="Total potential liability"
            riskLevel={getRiskLevel(riskMetrics.totalExposure, 500000)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <RiskCard
            title="Largest Payout"
            value={formatCurrency(riskMetrics.largestPayout)}
            icon={<MonetizationOn />}
            color="warning"
            subtitle="Single largest potential payout"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <RiskCard
            title="Profit Margin"
            value={`${riskMetrics.profitMargin}%`}
            icon={<TrendingUp />}
            color={riskMetrics.profitMargin > 10 ? 'success' : 'error'}
            subtitle="Current profit margin"
            riskLevel={riskMetrics.profitMargin > 15 ? 'low' : riskMetrics.profitMargin > 5 ? 'medium' : 'high'}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <RiskCard
            title="Active Matches"
            value={riskMetrics.activeMatches}
            icon={<Security />}
            color="primary"
            subtitle="Live and prematch matches"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* High Risk Matches */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Warning sx={{ mr: 1, color: 'error.main' }} />
                High Risk Matches
              </Typography>
              {isMobile ? (
                // Mobile card layout
                <Box sx={{ mt: 2 }}>
                  {highRiskMatches.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        No high risk matches currently
                      </Typography>
                    </Box>
                  ) : (
                    highRiskMatches.map((match) => (
                      <HighRiskMatchCard key={match.id} match={match} />
                    ))
                  )}
                </Box>
              ) : (
                // Desktop table layout
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table size="small" sx={{ minWidth: 600 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ minWidth: 200 }}>Match</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>League</TableCell>
                        <TableCell align="center" sx={{ minWidth: 100 }}>Exposure</TableCell>
                        <TableCell align="center" sx={{ minWidth: 80 }}>Bets</TableCell>
                        <TableCell align="center" sx={{ minWidth: 100 }}>Risk Level</TableCell>
                        <TableCell align="center" sx={{ minWidth: 100 }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {highRiskMatches.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              No high risk matches currently
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        highRiskMatches.map((match) => (
                          <TableRow key={match.id} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {match.homeTeam} vs {match.awayTeam}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {match.league}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {formatCurrency(riskMetrics.riskByMatch[match.id] || 0)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2">
                                {match.totalBets}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={match.riskLevel.toUpperCase()}
                                color={getRiskColor(match.riskLevel) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Suspend betting">
                                <IconButton size="small" color="error">
                                  <Block />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Distribution */}
  <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Distribution
              </Typography>
              <Box sx={{ mt: 2 }}>
                {['low', 'medium', 'high'].map((risk) => {
                  const count = matches.filter(m => m.riskLevel === risk).length;
                  const percentage = matches.length > 0 ? (count / matches.length) * 100 : 0;
                  
                  return (
                    <Box key={risk} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 'medium' }}>
                          {risk} Risk
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {count} ({percentage.toFixed(0)}%)
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={percentage}
                        color={getRiskColor(risk) as any}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Limits
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Single Match Limit</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      $100,000
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={65}
                    color="warning"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    65% of limit used
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Daily Exposure Limit</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      $500,000
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={45}
                    color="success"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    45% of limit used
                  </Typography>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Player Win Limit</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      $25,000
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={80}
                    color="error"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    80% of limit used
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

export default RiskManagement;