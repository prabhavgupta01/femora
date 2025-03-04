import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChatIcon from '@mui/icons-material/Chat';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import cycleService from '../services/cycleService';
import authService from '../services/authService';
import CycleChart from '../components/CycleChart';
import DischargeChart from '../components/DischargeChart';
import HealthInsights from '../components/HealthInsights';
import shadows from '@mui/material/styles/shadows';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await cycleService.getCycleStats();
      setStats(data);
    } catch (err) {
      if (err.message === 'Unauthorized') {
        navigate('/login');
      } else {
        setError('Failed to fetch cycle statistics. Please try again later.');
        console.error('Error fetching stats:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ 
      mt: 4, 
      mb: 4,
      '@keyframes float': {
        '0%': {
          transform: 'translateY(0px)'
        },
        '50%': {
          transform: 'translateY(-10px)'
        },
        '100%': {
          transform: 'translateY(0px)'
        }
      },
      '@keyframes glow': {
        '0%': {
          boxShadow: `0 0 20px ${alpha(theme.palette.secondary.main, 0.5)}`
        },
        '50%': {
          boxShadow: `0 0 30px ${alpha(theme.palette.secondary.main, 0.8)}, 0 0 50px ${alpha(theme.palette.primary.main, 0.3)}`
        },
        '100%': {
          boxShadow: `0 0 20px ${alpha(theme.palette.secondary.main, 0.5)}`
        }
      },
      '@keyframes pulse': {
        '0%': {
          transform: 'scale(1)',
          opacity: 1
        },
        '50%': {
          transform: 'scale(1.1)',
          opacity: 0.8
        },
        '100%': {
          transform: 'scale(1)',
          opacity: 1
        }
      },
      '@keyframes rotate': {
        '0%': {
          transform: 'rotate(0deg)'
        },
        '100%': {
          transform: 'rotate(360deg)'
        }
      }
    }}>
      <Grid container spacing={3}>
        {/* Welcome Section with Quick Actions */}
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
                pointerEvents: 'none',
              }
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                  Welcome to Femora
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 3, opacity: 0.9 }}>
                  Your personal menstrual health companion
                </Typography>
              </Box>
              <Tooltip title="Refresh Data">
                <IconButton 
                  onClick={fetchStats}
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="contained"
                  color="inherit"
                  fullWidth
                  onClick={() => navigate('/cycle-tracking')}
                  startIcon={<CalendarTodayIcon />}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  Log Cycle
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="contained"
                  color="inherit"
                  fullWidth
                  onClick={() => navigate('/discharge-tracking')}
                  startIcon={<AssessmentIcon />}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  Track Discharge
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="contained"
                  color="inherit"
                  fullWidth
                  onClick={() => navigate('/chat')}
                  startIcon={<ChatIcon />}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  Talk to Luna
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="contained"
                  color="inherit"
                  fullWidth
                  onClick={() => navigate('/profile')}
                  startIcon={<PersonIcon />}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  Profile
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Cycle Statistics Summary */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Cycle Statistics
            </Typography>
            {!stats?.hasData ? (
              <Box textAlign="center" py={2}>
                <Typography color="inherit" paragraph sx={{ opacity: 0.9 }}>
                  No cycle data available yet
                </Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate('/cycle-tracking')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Start Tracking
                </Button>
              </Box>
            ) : (
              <List>
                <ListItem>
                  <ListItemText
                    primary="Last Cycle"
                    secondary={`${stats.lastCycleLength} days`}
                    primaryTypographyProps={{ sx: { color: 'white' } }}
                    secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                  />
                </ListItem>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                <ListItem>
                  <ListItemText
                    primary="Average Length"
                    secondary={`${stats.averageLength} days`}
                    primaryTypographyProps={{ sx: { color: 'white' } }}
                    secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                  />
                </ListItem>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                <ListItem>
                  <ListItemText
                    primary="Total Cycles"
                    secondary={stats.totalCycles}
                    primaryTypographyProps={{ sx: { color: 'white' } }}
                    secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                  />
                </ListItem>
              </List>
            )}
          </Paper>
        </Grid>

        {/* Cycle Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Cycle History
              </Typography>
              <Tooltip title="Refresh Chart">
                <IconButton onClick={fetchStats}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ height: 300, mt: 2 }}>
              <CycleChart />
            </Box>
          </Paper>
        </Grid>

        {/* Health Insights */}
        <Grid item xs={12}>
          <HealthInsights />
        </Grid>

        {/* Discharge Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Discharge Pattern Analysis
              </Typography>
              <Tooltip title="Refresh Chart">
                <IconButton onClick={fetchStats}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ height: 300, mt: 2 }}>
              <DischargeChart />
            </Box>
          </Paper>
        </Grid>

        {/* Common Symptoms */}
        {stats?.hasData && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Common Symptoms
              </Typography>
              <Grid container spacing={2}>
                {stats.commonSymptoms.map((symptom, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper 
                      sx={{ 
                        p: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.2),
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[2]
                        }
                      }}
                    >
                      <Typography sx={{ fontWeight: 500 }}>{symptom}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Floating Luna Shortcut */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          borderRadius: '50%',
          overflow: 'hidden',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.5)}`,
            '& .MuiAvatar-root': {
              transform: 'scale(1.1)',
              boxShadow: `0 0 40px ${alpha(theme.palette.primary.main, 0.8)}`
            }
          }
        }}
        onClick={() => navigate('/chat')}
      >
        <Avatar 
          sx={{ 
            width: 64,
            height: 64,
            bgcolor: 'transparent',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.secondary.main, 0.6)})`,
              animation: 'rotate 8s linear infinite',
              boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.5)}`
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              background: `radial-gradient(circle at 70% 70%, ${alpha(theme.palette.secondary.main, 0.8)}, ${alpha(theme.palette.primary.main, 0.6)})`,
              animation: 'rotate 8s linear infinite reverse',
              opacity: 0.7
            }
          }}
        >
          <Box sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.secondary.main, 0.7)})`,
            animation: 'pulse 3s ease-in-out infinite',
            boxShadow: `0 0 40px ${alpha(theme.palette.primary.main, 0.6)}`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '20%',
              left: '20%',
              width: '20%',
              height: '20%',
              borderRadius: '50%',
              background: alpha(theme.palette.common.white, 0.8),
              filter: 'blur(2px)',
              animation: 'float 4s ease-in-out infinite'
            }
          }}>
            {/* Futuristic L */}
            <Typography
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '2rem',
                fontWeight: 700,
                color: theme.palette.common.white,
                textShadow: `0 0 15px ${alpha(theme.palette.common.white, 0.8)}`,
                fontFamily: '"Orbitron", "Roboto", sans-serif',
                letterSpacing: '2px',
                animation: 'glow 2s ease-in-out infinite'
              }}
            >
              L
            </Typography>
          </Box>
        </Avatar>
      </Box>
    </Container>
  );
};

export default Dashboard; 