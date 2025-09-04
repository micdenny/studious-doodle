import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Avatar,
  Tooltip,
  Grid,
  FormGroup,
  Switch,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  VisibilityOff as GuestIcon,
  Email as EmailIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { User, UserRole } from '../types';
import { availablePermissions, generateMockUsers } from '../utils/mockData';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(generateMockUsers());
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    role: 'user',
    permissions: [],
    isActive: true,
  });

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return <AdminIcon color="error" />;
      case 'user': return <PersonIcon color="primary" />;
      case 'guest': return <GuestIcon color="action" />;
    }
  };

  const getRoleColor = (role: UserRole): 'error' | 'primary' | 'default' => {
    switch (role) {
      case 'admin': return 'error';
      case 'user': return 'primary';
      case 'guest': return 'default';
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role,
        permissions: user.permissions,
        isActive: user.isActive,
      });
    } else {
      setEditingUser(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        role: 'user',
        permissions: [],
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({});
  };

  const handleSaveUser = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.username) {
      return;
    }

    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              ...formData,
              updatedAt: new Date(),
              permissions: formData.permissions || [],
            } as User
          : user
      ));
    } else {
      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        email: formData.email!,
        username: formData.username!,
        role: formData.role || 'user',
        permissions: formData.permissions || [],
        isActive: formData.isActive ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUsers([...users, newUser]);
    }
    handleCloseDialog();
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    setDeleteConfirm(null);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const currentPermissions = formData.permissions || [];
    if (checked) {
      setFormData({
        ...formData,
        permissions: [...currentPermissions, permissionId],
      });
    } else {
      setFormData({
        ...formData,
        permissions: currentPermissions.filter(p => p !== permissionId),
      });
    }
  };

  const handleRoleChange = (role: UserRole) => {
    let defaultPermissions: string[] = [];
    switch (role) {
      case 'admin':
        defaultPermissions = availablePermissions.map(p => p.id);
        break;
      case 'user':
        defaultPermissions = ['dashboard_view', 'matches_view', 'bets_view', 'risk_view'];
        break;
      case 'guest':
        defaultPermissions = ['dashboard_view', 'matches_view'];
        break;
    }
    
    setFormData({
      ...formData,
      role,
      permissions: defaultPermissions,
    });
  };

  const userStats = useMemo(() => {
    const activeUsers = users.filter(u => u.isActive).length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const userUsers = users.filter(u => u.role === 'user').length;
    const guestUsers = users.filter(u => u.role === 'guest').length;

    return {
      total: users.length,
      active: activeUsers,
      inactive: users.length - activeUsers,
      admins: adminUsers,
      users: userUsers,
      guests: guestUsers,
    };
  }, [users]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Gestione Utenti
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuovo Utente
        </Button>
      </Box>

      {/* User Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {userStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Totale Utenti
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {userStats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attivi
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {userStats.admins}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Amministratori
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {userStats.users}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Utenti
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'grey.500' }}>
                {userStats.guests}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ospiti
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {userStats.inactive}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inattivi
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lista Utenti
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Utente</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Ruolo</TableCell>
                  <TableCell>Stato</TableCell>
                  <TableCell>Ultimo Accesso</TableCell>
                  <TableCell align="center">Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {user.firstName[0]}{user.lastName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            @{user.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                        {user.email}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getRoleIcon(user.role)}
                        label={user.role.toUpperCase()}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? 'Attivo' : 'Inattivo'}
                        color={user.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LoginIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {user.lastLogin.toLocaleDateString('it-IT')}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Mai
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifica">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Elimina">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteConfirm(user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* User Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingUser ? 'Modifica Utente' : 'Nuovo Utente'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Cognome"
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username || ''}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Ruolo</InputLabel>
                  <Select
                    value={formData.role || 'user'}
                    label="Ruolo"
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  >
                    <MenuItem value="admin">Amministratore</MenuItem>
                    <MenuItem value="user">Utente</MenuItem>
                    <MenuItem value="guest">Ospite</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive ?? true}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                  }
                  label="Utente Attivo"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Permessi
                </Typography>
                <FormGroup>
                  {availablePermissions.map((permission) => (
                    <FormControlLabel
                      key={permission.id}
                      control={
                        <Checkbox
                          checked={(formData.permissions || []).includes(permission.id)}
                          onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2">{permission.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {permission.description}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </FormGroup>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button onClick={handleSaveUser} variant="contained">
            {editingUser ? 'Aggiorna' : 'Crea'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
      >
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Sei sicuro di voler eliminare questo utente? Questa azione non può essere annullata.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Annulla</Button>
          <Button
            onClick={() => deleteConfirm && handleDeleteUser(deleteConfirm)}
            color="error"
            variant="contained"
          >
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;