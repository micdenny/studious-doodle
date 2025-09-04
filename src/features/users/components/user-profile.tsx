import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AdminPanelSettings as AdminIcon,
  VisibilityOff as GuestIcon,
  Security as SecurityIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { User, UserRole } from '../types';
import { availablePermissions } from '../../../shared/lib/mockData';

// Mock current user - in a real app this would come from authentication context
const mockCurrentUser: User = {
  id: 'current_user',
  username: 'marco.admin',
  email: 'marco.admin@sportsbet.com',
  firstName: 'Marco',
  lastName: 'Amministratore',
  role: 'admin',
  permissions: availablePermissions.map(p => p.id),
  isActive: true,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date(),
  lastLogin: new Date(),
};

const UserProfile: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
  });
  const [showSuccess, setShowSuccess] = useState(false);

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

  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'user': return 'User';
      case 'guest': return 'Guest';
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setFormData({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
    });
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
    });
  };

  const handleSave = () => {
    const updatedUser: User = {
      ...currentUser,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      updatedAt: new Date(),
    };
    
    setCurrentUser(updatedUser);
    setEditing(false);
    setShowSuccess(true);
  };

  const getPermissionByID = (permissionId: string) => {
    return availablePermissions.find(p => p.id === permissionId);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Information Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Typography variant="h6">
                  Personal Information
                </Typography>
                {!editing ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    size="small"
                  >
                    Edit
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      size="small"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      size="small"
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    mr: 3
                  }}
                >
                  {editing ? 
                    `${formData.firstName[0] || 'U'}${formData.lastName[0] || 'U'}` :
                    `${currentUser.firstName[0]}${currentUser.lastName[0]}`
                  }
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {editing ? 
                      `${formData.firstName} ${formData.lastName}` :
                      `${currentUser.firstName} ${currentUser.lastName}`
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    @{currentUser.username}
                  </Typography>
                  <Chip
                    icon={getRoleIcon(currentUser.role)}
                    label={getRoleLabel(currentUser.role)}
                    color={getRoleColor(currentUser.role)}
                    size="small"
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {editing ? (
                  <>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Full Name
                        </Typography>
                        <Typography variant="body1">
                          {currentUser.firstName} {currentUser.lastName}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">
                          {currentUser.email}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Member since
                </Typography>
                <Typography variant="body1">
                  {currentUser.createdAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>

              {currentUser.lastLogin && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Last access
                  </Typography>
                  <Typography variant="body1">
                    {currentUser.lastLogin.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Permissions Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">
                  My Permissions
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                Your permissions determine which application features you can use.
              </Alert>

              <List>
                {currentUser.permissions.map((permissionId, index) => {
                  const permission = getPermissionByID(permissionId);
                  if (!permission) return null;

                  return (
                    <React.Fragment key={permissionId}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={permission.name}
                          secondary={permission.description}
                        />
                      </ListItem>
                      {index < currentUser.permissions.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;