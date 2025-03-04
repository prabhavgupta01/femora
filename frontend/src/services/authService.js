import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const authService = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  getToken: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token;
  },

  updatePassword: function(currentPassword, newPassword) {
    try {
      console.log('Attempting to update password...');
      const token = this.getToken();
      if (!token) {
        console.error('No authentication token found');
        throw new Error('Not authenticated');
      }

      console.log('Sending password update request...');
      return axios.put(
        `${API_URL}/users/password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ).then(response => {
        console.log('Password update response:', response.data);
        return response.data;
      }).catch(error => {
        console.error('Password update error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
        
        // Handle specific error cases
        if (!error.response) {
          console.error('Network error - no response received');
          throw new Error('Unable to connect to server. Please check your internet connection.');
        }

        if (error.response.status === 401) {
          throw new Error('Current password is incorrect');
        }
        if (error.response.status === 400) {
          throw new Error(error.response.data.message || 'Invalid password format');
        }
        if (error.response.status === 404) {
          throw new Error('User not found. Please log in again.');
        }
        if (error.response.status === 500) {
          throw new Error('Server error. Please try again later.');
        }

        // Handle any other errors
        throw new Error(error.response.data?.message || 'Failed to update password');
      });
    } catch (error) {
      console.error('Unexpected error in updatePassword:', error);
      throw error;
    }
  }
};

export default authService; 