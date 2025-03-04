import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Snackbar,
  useTheme,
  alpha,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import cycleService from '../services/cycleService';
import authService from '../services/authService';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const CycleTracking = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [cycleData, setCycleData] = useState({
    startDate: '',
    endDate: '',
    cycleLength: '',
    symptoms: [],
    flowIntensity: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    console.log('User authenticated:', user);
  }, [navigate]);

  useEffect(() => {
    if (cycleData.startDate && cycleData.endDate) {
      const start = new Date(cycleData.startDate);
      const end = new Date(cycleData.endDate);
      
      // Validate that end date is after start date
      if (end < start) {
        setError('End date must be after start date');
        return;
      }
      
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setCycleData(prev => ({
        ...prev,
        cycleLength: diffDays.toString()
      }));
    }
  }, [cycleData.startDate, cycleData.endDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name}:`, value);
    setCycleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', cycleData);
    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      // Validate required fields
      if (!cycleData.startDate || !cycleData.endDate || !cycleData.flowIntensity) {
        throw new Error('Please fill in all required fields');
      }

      // Validate dates
      const start = new Date(cycleData.startDate);
      const end = new Date(cycleData.endDate);
      if (end < start) {
        throw new Error('End date must be after start date');
      }

      console.log('Sending cycle data to backend:', cycleData);
      const response = await cycleService.createCycle(cycleData);
      console.log('Backend response:', response);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error saving cycle data:', err);
      setError(err.message || 'Failed to save cycle data. Please try again.');
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
            <CalendarTodayIcon 
              sx={{ 
                fontSize: 60,
                color: theme.palette.primary.main,
                mb: 2,
                filter: `drop-shadow(0 0 10px ${alpha(theme.palette.primary.main, 0.3)})`
              }}
            />
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
            Track Your Cycle
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ textAlign: 'center', maxWidth: '80%' }}
          >
            Log your menstrual cycle details to track patterns and receive personalized insights
          </Typography>
        </Box>

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

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                name="startDate"
                value={cycleData.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                disabled={loading}
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
                label="End Date"
                type="date"
                name="endDate"
                value={cycleData.endDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                disabled={loading}
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
                label="Cycle Length (days)"
                type="number"
                name="cycleLength"
                value={cycleData.cycleLength}
                InputProps={{
                  readOnly: true,
                }}
                disabled={loading}
                helperText="Automatically calculated from start and end dates"
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
              <FormControl fullWidth required disabled={loading}>
                <InputLabel>Flow Intensity</InputLabel>
                <Select
                  name="flowIntensity"
                  value={cycleData.flowIntensity}
                  onChange={handleChange}
                  label="Flow Intensity"
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="heavy">Heavy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Symptoms</InputLabel>
                <Select
                  multiple
                  name="symptoms"
                  value={cycleData.symptoms}
                  onChange={handleChange}
                  label="Symptoms"
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <MenuItem value="cramps">Cramps</MenuItem>
                  <MenuItem value="headache">Headache</MenuItem>
                  <MenuItem value="bloating">Bloating</MenuItem>
                  <MenuItem value="fatigue">Fatigue</MenuItem>
                  <MenuItem value="mood swings">Mood Swings</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes"
                name="notes"
                value={cycleData.notes}
                onChange={handleChange}
                disabled={loading}
                placeholder="Add any additional observations or symptoms..."
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
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  startIcon={<CloseIcon />}
                  sx={{
                    minWidth: 120,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.dark,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                  sx={{
                    minWidth: 120,
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
                  {loading ? 'Saving...' : 'Save Cycle Data'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
      >
        <Alert 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
          }}
        >
          Cycle data saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CycleTracking; 