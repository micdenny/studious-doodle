import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Visibility,
} from '@mui/icons-material';
import { generateMockMatches } from '../../../shared/lib/mockData';

const PrematchMatches: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('');
  const [matches] = useState(() => generateMockMatches(40));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const prematchMatches = useMemo(() => {
    return matches
      .filter(match => match.status === 'prematch')
      .filter(match => 
        searchTerm === '' || 
        match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(match => leagueFilter === '' || match.league === leagueFilter)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [matches, searchTerm, leagueFilter]);

  const leagues = useMemo(() => {
    return Array.from(new Set(matches.map(match => match.league)));
  }, [matches]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'primary';
    }
  };

  // Mobile card component for match display
  const MatchCard: React.FC<{ match: any }> = ({ match }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', lineHeight: 1.2 }}>
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
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            {formatDateTime(match.startTime)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'center' }}>
          <Chip 
            label={match.odds.home} 
            size="small" 
            variant="outlined"
            sx={{ minWidth: 45 }}
          />
          {match.odds.draw && (
            <Chip 
              label={match.odds.draw} 
              size="small" 
              variant="outlined"
              sx={{ minWidth: 45 }}
            />
          )}
          <Chip 
            label={match.odds.away} 
            size="small" 
            variant="outlined"
            sx={{ minWidth: 45 }}
          />
        </Box>

        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid size={6}>
            <Typography variant="caption" color="text.secondary">Bets</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {match.totalBets}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="caption" color="text.secondary">Stake</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {formatCurrency(match.totalStake)}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button size="small" startIcon={<Visibility />} sx={{ minWidth: 44 }}>
            View
          </Button>
          <Button size="small" startIcon={<Edit />} sx={{ minWidth: 44 }}>
            Edit
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Prematch Matches
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
          Add Match
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search matches by team..."
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
        </Grid>
  <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>League</InputLabel>
            <Select
              value={leagueFilter}
              label="League"
              onChange={(e) => setLeagueFilter(e.target.value)}
            >
              <MenuItem value="">All Leagues</MenuItem>
              {leagues.map((league) => (
                <MenuItem key={league} value={league}>
                  {league}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <Card>
            {isMobile ? (
              // Mobile card layout
              <Box sx={{ p: 2 }}>
                {prematchMatches.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No prematch matches found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Try adjusting your search criteria
                    </Typography>
                  </Box>
                ) : (
                  prematchMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))
                )}
              </Box>
            ) : (
              // Desktop table layout
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 200 }}>Match</TableCell>
                      <TableCell sx={{ minWidth: 120 }}>League</TableCell>
                      <TableCell sx={{ minWidth: 140 }}>Start Time</TableCell>
                      <TableCell align="center" sx={{ minWidth: 120 }}>Odds</TableCell>
                      <TableCell align="center" sx={{ minWidth: 80 }}>Bets</TableCell>
                      <TableCell align="center" sx={{ minWidth: 100 }}>Stake</TableCell>
                      <TableCell align="center" sx={{ minWidth: 80 }}>Risk</TableCell>
                      <TableCell align="center" sx={{ minWidth: 120 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prematchMatches.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography variant="h6" color="text.secondary">
                            No prematch matches found
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Try adjusting your search criteria
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      prematchMatches.map((match) => (
                        <TableRow key={match.id} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                                {match.homeTeam} vs {match.awayTeam}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {match.league}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDateTime(match.startTime)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Chip 
                                label={match.odds.home} 
                                size="small" 
                                variant="outlined"
                                sx={{ minWidth: 45 }}
                              />
                              {match.odds.draw && (
                                <Chip 
                                  label={match.odds.draw} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ minWidth: 45 }}
                                />
                              )}
                              <Chip 
                                label={match.odds.away} 
                                size="small" 
                                variant="outlined"
                                sx={{ minWidth: 45 }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {match.totalBets}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {formatCurrency(match.totalStake)}
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
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Button size="small" startIcon={<Visibility />}>
                                View
                              </Button>
                              <Button size="small" startIcon={<Edit />}>
                                Edit
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Grid>

  <Grid size={{ xs: 12, lg: 3 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Prematch Summary
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Total Matches</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {prematchMatches.length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Total Bets</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {prematchMatches.reduce((sum, match) => sum + match.totalBets, 0).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Total Stake</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(prematchMatches.reduce((sum, match) => sum + match.totalStake, 0))}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Matches
              </Typography>
              <Box sx={{ mt: 2 }}>
                {prematchMatches.slice(0, 5).map((match) => (
                  <Box 
                    key={match.id}
                    sx={{ 
                      py: 1.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                      {match.homeTeam} vs {match.awayTeam}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(match.startTime)} • {match.league}
                    </Typography>
                  </Box>
                ))}
                {prematchMatches.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No upcoming matches
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PrematchMatches;