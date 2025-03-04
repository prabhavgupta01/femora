import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5000/api';

const chatService = {
  sendMessage: async (message) => {
    try {
      const token = authService.getToken();
      if (!token) {
        console.error('No authentication token found');
        throw new Error('Please log in to use the chat feature');
      }
      
      console.log('Sending message to Luna:', message);
      const response = await axios.post(
        `${API_URL}/chat`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('Received response from Luna:', response.data);
      return response.data;
    } catch (error) {
      console.error('Chat error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(error.response?.data?.message || 'Failed to send message to Luna');
    }
  },

  getChatHistory: async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        console.error('No authentication token found');
        throw new Error('Please log in to use the chat feature');
      }
      
      const response = await axios.get(`${API_URL}/chat`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Chat history error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get chat history from Luna');
    }
  }
};

export default chatService; 