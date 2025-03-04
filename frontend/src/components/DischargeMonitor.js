import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import cycleService from '../services/cycleService';

const DischargeMonitor = () => {
  const theme = useTheme();
  const [patterns, setPatterns] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [patternsData, alertsData] = await Promise.all([
        cycleService.getDischargePatterns(),
        cycleService.getDischargeAlerts()
      ]);
      setPatterns(patternsData);
      setAlerts(alertsData);
    } catch (err) {
      setError('Failed to fetch discharge monitoring data');
      console.error('Error fetching discharge data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      default:
        return <NotificationsIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Discharge Pattern Monitor
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={fetchData} size="small">
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Start Tracking Your Discharge
          </Typography>
          <Typography color="text.secondary" paragraph>
            Monitor your discharge patterns and get personalized insights
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.href = '/discharge-tracking'}
            sx={{ mt: 2 }}
          >
            Track Discharge
          </Button>
        </Box>
      )}

      {!error && patterns && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Current Pattern
              </Typography>
              <Typography variant="body2">
                {patterns.currentPattern}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last updated: {new Date(patterns.lastUpdated).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 2, 
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`
              }}
            >
              <Typography variant="subtitle2" color="secondary" gutterBottom>
                Pattern History
              </Typography>
              <Typography variant="body2">
                {patterns.history}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {!error && alerts.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Recent Alerts
          </Typography>
          <List>
            {alerts.map((alert, index) => (
              <ListItem 
                key={index}
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  mb: 1,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.background.paper, 0.9)
                  }
                }}
              >
                <ListItemIcon>
                  {getAlertIcon(alert.severity)}
                </ListItemIcon>
                <ListItemText
                  primary={alert.title}
                  secondary={alert.message}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};

export default DischargeMonitor; 