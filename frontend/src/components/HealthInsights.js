import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Button
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import cycleService from '../services/cycleService';

const HealthInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await cycleService.getHealthInsights();
      console.log('Received insights:', data);
      setInsights(data);
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch health insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const getInsightColor = (type) => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'tip':
        return 'primary';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={fetchInsights}>
              <RefreshIcon sx={{ mr: 1 }} />
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          AI-Powered Health Insights
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchInsights}
          size="small"
        >
          Refresh
        </Button>
      </Box>
      <List>
        {insights.map((insight, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemIcon>
                {insight.type === 'warning' && <WarningIcon color="warning" />}
                {insight.type === 'info' && <InfoIcon color="info" />}
                {insight.type === 'tip' && <LightbulbIcon color="primary" />}
                {insight.type === 'success' && <CheckCircleIcon color="success" />}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle1">
                      {insight.title}
                    </Typography>
                    <Chip
                      label={insight.category}
                      size="small"
                      color={getInsightColor(insight.type)}
                    />
                  </Box>
                }
                secondary={insight.description}
              />
            </ListItem>
            {index < insights.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default HealthInsights; 