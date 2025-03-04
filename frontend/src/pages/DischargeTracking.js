import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  useTheme,
  alpha,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import cycleService from '../services/cycleService';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const DischargeTracking = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    consistency: '',
    color: '',
    amount: '',
    odor: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      await cycleService.updateDischargePattern(formData);
      setSuccess('Discharge pattern updated successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update discharge pattern');
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
            <AssessmentIcon 
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
            Track Your Discharge
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ textAlign: 'center', maxWidth: '80%' }}
          >
            Log your discharge patterns to monitor changes and get personalized insights
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

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
            }}
          >
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
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
              <FormControl fullWidth>
                <InputLabel>Consistency</InputLabel>
                <Select
                  name="consistency"
                  value={formData.consistency}
                  onChange={handleChange}
                  label="Consistency"
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <MenuItem value="watery">Watery</MenuItem>
                  <MenuItem value="sticky">Sticky</MenuItem>
                  <MenuItem value="creamy">Creamy</MenuItem>
                  <MenuItem value="egg-white">Egg White</MenuItem>
                  <MenuItem value="thick">Thick</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Color</InputLabel>
                <Select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  label="Color"
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <MenuItem value="clear">Clear</MenuItem>
                  <MenuItem value="white">White</MenuItem>
                  <MenuItem value="yellow">Yellow</MenuItem>
                  <MenuItem value="green">Green</MenuItem>
                  <MenuItem value="brown">Brown</MenuItem>
                  <MenuItem value="pink">Pink</MenuItem>
                  <MenuItem value="red">Red</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Amount</InputLabel>
                <Select
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  label="Amount"
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="heavy">Heavy</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Odor</InputLabel>
                <Select
                  name="odor"
                  value={formData.odor}
                  onChange={handleChange}
                  label="Odor"
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="mild">Mild</MenuItem>
                  <MenuItem value="strong">Strong</MenuItem>
                  <MenuItem value="unusual">Unusual</MenuItem>
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
                value={formData.notes}
                onChange={handleChange}
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
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default DischargeTracking; 