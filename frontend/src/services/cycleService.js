import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5000/api';

const cycleService = {
  createCycle: async (cycleData) => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Format dates to ISO string and ensure proper data types
      const formattedData = {
        ...cycleData,
        startDate: new Date(cycleData.startDate).toISOString(),
        endDate: new Date(cycleData.endDate).toISOString(),
        cycleLength: parseInt(cycleData.cycleLength) || calculateCycleLength(cycleData.startDate, cycleData.endDate),
        symptoms: Array.isArray(cycleData.symptoms) ? cycleData.symptoms : [],
        flowIntensity: cycleData.flowIntensity.toLowerCase(),
        notes: cycleData.notes || ''
      };

      console.log('Sending cycle data:', formattedData);

      const response = await axios.post(`${API_URL}/cycles`, formattedData, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Cycle creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in createCycle:', error);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.data?.details) {
        throw new Error(`${error.response.data.message}: ${error.response.data.details}`);
      }
      throw new Error('Failed to create cycle entry. Please try again.');
    }
  },

  getCycles: async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${API_URL}/cycles`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in getCycles:', error);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      }
      throw error.response?.data?.message || 'Failed to fetch cycles';
    }
  },

  getCycleStats: async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${API_URL}/cycles/stats`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in getCycleStats:', error);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      }
      throw error.response?.data?.message || 'Failed to fetch cycle statistics';
    }
  },

  getDischargePatterns: async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${API_URL}/cycles/discharge-patterns`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in getDischargePatterns:', error);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      }
      throw error.response?.data?.message || 'Failed to fetch discharge patterns';
    }
  },

  updateDischargePattern: async (patternData) => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post(`${API_URL}/discharge`, patternData, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in updateDischargePattern:', error);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      }
      throw error.response?.data?.message || 'Failed to update discharge pattern';
    }
  },

  getDischargeAlerts: async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${API_URL}/cycles/discharge-alerts`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in getDischargeAlerts:', error);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      }
      throw error.response?.data?.message || 'Failed to fetch discharge alerts';
    }
  },

  getDischargeHistory: async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${API_URL}/discharge`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in getDischargeHistory:', error);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      }
      throw error.response?.data?.message || 'Failed to fetch discharge history';
    }
  },

  getHealthInsights: async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${API_URL}/health-insights`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in getHealthInsights:', error);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      }
      throw error.response?.data?.message || 'Failed to fetch health insights';
    }
  }
};

// Helper function to calculate cycle length
const calculateCycleLength = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default cycleService; 