import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Box,
  Divider,
  Alert,
  Snackbar,
  useTheme,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    // Set initial profile data from user
    setProfile(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      dateOfBirth: user.dateOfBirth || ''
    }));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      console.log('Starting profile update...');
      
      // Validate passwords if trying to change them
      if (profile.newPassword || profile.currentPassword) {
        console.log('Validating password change...');
        
        // Check if any password field is filled
        if (profile.currentPassword || profile.newPassword || profile.confirmPassword) {
          // If any password field is filled, all must be filled
          if (!profile.currentPassword) {
            throw new Error('Current password is required to change password');
          }
          if (!profile.newPassword) {
            throw new Error('New password is required');
          }
          if (!profile.confirmPassword) {
            throw new Error('Please confirm your new password');
          }
          if (profile.newPassword !== profile.confirmPassword) {
            throw new Error('New passwords do not match. Please check and try again.');
          }
          if (profile.newPassword.length < 6) {
            throw new Error('New password must be at least 6 characters long');
          }
        }

        // Only attempt password update if all fields are filled
        if (profile.currentPassword && profile.newPassword && profile.confirmPassword) {
          console.log('Attempting to update password...');
          try {
            await authService.updatePassword(profile.currentPassword, profile.newPassword);
            console.log('Password updated successfully');
            // Clear password fields after successful update
            setProfile(prev => ({
              ...prev,
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            }));
          } catch (passwordError) {
            console.error('Password update failed:', passwordError);
            throw passwordError;
          }
        }
      }

      // Update user profile in localStorage
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User session expired. Please log in again.');
      }

      const updatedUser = {
        ...user,
        name: profile.name,
        dateOfBirth: profile.dateOfBirth
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('Profile updated in localStorage');

      setSuccess(true);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
      
      // If the error is about authentication, redirect to login
      if (err.message.includes('log in again')) {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mb: 4,
          position: 'relative'
        }}>
          <Box
            sx={{
              position: 'relative',
              mb: 2
            }}
          >
            <Avatar
              sx={{ 
                width: 120, 
                height: 120, 
                bgcolor: 'primary.main',
                fontSize: '3rem',
                border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'primary.main',
                borderRadius: '50%',
                p: 1,
                boxShadow: 2
              }}
            >
              <PersonIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          </Box>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
              textAlign: 'center'
            }}
          >
            Profile Settings
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ textAlign: 'center', maxWidth: '80%' }}
          >
            Manage your account settings and preferences
          </Typography>
        </Box>

        <Divider sx={{ mb: 4, borderColor: alpha(theme.palette.primary.main, 0.1) }} />

        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
              }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
              }}
            >
              Profile updated successfully!
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                disabled
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                }}
                helperText="Email cannot be changed"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                disabled
                InputProps={{
                  startAdornment: <CakeIcon sx={{ mr: 1, color: 'primary.main' }} />
                }}
                InputLabelProps={{ shrink: true }}
                helperText="Date of birth cannot be changed"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                color: 'primary.main'
              }}>
                <LockIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Change Password
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={profile.currentPassword}
                onChange={handleChange}
                disabled={loading}
                helperText="Required only if changing password"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={profile.newPassword}
                onChange={handleChange}
                disabled={loading}
                helperText="Leave empty to keep current password"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={profile.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                helperText="Leave empty to keep current password"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                  '&:hover': {
                    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`
                  }
                }}
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 