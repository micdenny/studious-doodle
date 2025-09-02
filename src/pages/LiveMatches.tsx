import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Pause,
  Stop,
  Warning,
} from '@mui/icons-material';
import { generateMockMatches } from '../utils/mockData';
import { Match } from '../types';

const LiveMatches: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [matches] = useState(() => generateMockMatches(30));

  const liveMatches = useMemo(() => {
    return matches
      .filter(match => match.status === 'live')
      .filter(match => 
        searchTerm === '' || 
        match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.league.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [matches, searchTerm]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'primary';
    }
  };

  const LiveMatchCard = ({ match }: { match: Match }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {match.homeTeam} vs {match.awayTeam}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {match.league}
            </Typography>
            <Chip label="LIVE" color="error" size="small" />
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            {match.score && (
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {match.score.home} - {match.score.away}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Pause betting">
                <IconButton size="small" color="warning">
                  <Pause />
                </IconButton>
              </Tooltip>
              <Tooltip title="Stop match">
                <IconButton size="small" color="error">
                  <Stop />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">Home Win</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {match.odds.home}
              </Typography>
            </Box>
          </Grid>
          {match.odds.draw && (
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">Draw</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {match.odds.draw}
                </Typography>
              </Box>
            </Grid>
          )}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">Away Win</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {match.odds.away}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Bets: {match.totalBets} | Stake: {formatCurrency(match.totalStake)}
            </Typography>
          </Box>
          <Chip 
            label={`${match.riskLevel.toUpperCase()} RISK`}
            color={getRiskColor(match.riskLevel) as any}
            size="small"
            icon={<Warning />}
          />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Live Matches
        </Typography>
        <Typography variant="h6" color="error">
          {liveMatches.length} Live
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search matches by team or league..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Box>
            {liveMatches.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No live matches found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {searchTerm ? 'Try adjusting your search criteria' : 'No matches are currently live'}
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              liveMatches.map((match) => (
                <LiveMatchCard key={match.id} match={match} />
              ))
            )}
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Live Match Summary
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Total Live Matches</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {liveMatches.length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Total Live Bets</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {liveMatches.reduce((sum, match) => sum + match.totalBets, 0).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Total Live Stake</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(liveMatches.reduce((sum, match) => sum + match.totalStake, 0))}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Distribution
              </Typography>
              <Box sx={{ mt: 2 }}>
                {['low', 'medium', 'high'].map((risk) => {
                  const count = liveMatches.filter(m => m.riskLevel === risk).length;
                  const percentage = liveMatches.length > 0 ? (count / liveMatches.length) * 100 : 0;
                  
                  return (
                    <Box key={risk} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {risk} Risk
                        </Typography>
                        <Typography variant="body2">
                          {count} ({percentage.toFixed(0)}%)
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        height: 8, 
                        backgroundColor: 'grey.200', 
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          height: '100%', 
                          width: `${percentage}%`,
                          backgroundColor: `${getRiskColor(risk)}.main`,
                          transition: 'width 0.3s ease'
                        }} />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LiveMatches;