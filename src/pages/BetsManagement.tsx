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
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Download,
  Visibility,
  Block,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { generateMockMatches, generateMockBets } from '../utils/mockData';

const BetsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [bets] = useState(() => generateMockBets(generateMockMatches(30), 200));

  const filteredBets = useMemo(() => {
    return bets
      .filter(bet => 
        searchTerm === '' || 
        bet.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bet.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bet.selection.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(bet => statusFilter === '' || bet.status === statusFilter)
      .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
  }, [bets, searchTerm, statusFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'success';
      case 'lost': return 'error';
      case 'pending': return 'warning';
      case 'void': return 'default';
      default: return 'primary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won': return <CheckCircle />;
      case 'lost': return <Cancel />;
      case 'pending': return <Block />;
      case 'void': return <Block />;
      default: return null;
    }
  };

  const betStats = useMemo(() => {
    const totalStake = bets.reduce((sum, bet) => sum + bet.stake, 0);
    const wonBets = bets.filter(bet => bet.status === 'won');
    const totalPayout = wonBets.reduce((sum, bet) => sum + bet.potentialWin, 0);
    
    return {
      totalBets: bets.length,
      totalStake,
      totalPayout,
      profit: totalStake - totalPayout,
      pendingBets: bets.filter(bet => bet.status === 'pending').length,
      wonBets: wonBets.length,
      lostBets: bets.filter(bet => bet.status === 'lost').length,
    };
  }, [bets]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Bets Management
        </Typography>
        <Button variant="contained" startIcon={<Download />}>
          Export Data
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {betStats.totalBets.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Bets
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {formatCurrency(betStats.totalStake)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Stake
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {betStats.pendingBets.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Bets
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: betStats.profit > 0 ? 'success.main' : 'error.main' 
                }}
              >
                {formatCurrency(betStats.profit)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Net Profit
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by bet ID, user ID, or selection..."
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
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="won">Won</MenuItem>
              <MenuItem value="lost">Lost</MenuItem>
              <MenuItem value="void">Void</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bet ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Selection</TableCell>
                <TableCell align="center">Odds</TableCell>
                <TableCell align="center">Stake</TableCell>
                <TableCell align="center">Potential Win</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Placed</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No bets found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Try adjusting your search criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBets.slice(0, 50).map((bet) => (
                  <TableRow key={bet.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {bet.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {bet.userId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                          {bet.selection}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {bet.betType}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {bet.odds.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {formatCurrency(bet.stake)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {formatCurrency(bet.potentialWin)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={bet.status.toUpperCase()}
                        color={getStatusColor(bet.status) as any}
                        size="small"
                        icon={getStatusIcon(bet.status)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {formatDateTime(bet.placedAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {filteredBets.length > 50 && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing first 50 results of {filteredBets.length} total bets
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default BetsManagement;