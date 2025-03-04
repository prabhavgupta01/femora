const axios = require('axios');
require('dotenv').config();

// Helper function to format the response
const formatResponse = (text) => {
  // Split the text into sections based on common headings
  const sections = text.split(/(?=\n(?:[A-Z][a-z\s]+:))/);
  
  // Format each section
  const formattedSections = sections.map(section => {
    // Add bullet points for lists
    section = section.replace(/(?<=\n)(?=\s*[-•*]|\d+\.)/g, '• ');
    
    // Add line breaks after periods in lists
    section = section.replace(/(?<=\.)(?=\s*•)/g, '\n');
    
    // Add line breaks after headings
    section = section.replace(/(?<=:)(?=\n)/g, '\n');
    
    return section;
  });

  return formattedSections.join('\n\n');
};

// @desc    Send message to Luna AI
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Received message:', message);

    // Using Cohere AI
    console.log('Sending request to Cohere...');
    const response = await axios.post(
      'https://api.cohere.ai/v1/chat',
      {
        message: message,
        model: 'command',
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE',
        stream: false,
        conversation_id: '',
        prompt_truncation: 'AUTO',
        connectors: [],
        search_queries_only: false,
        documents: [],
        preamble: `You are Luna, a friendly and knowledgeable AI health assistant specializing in menstrual health and women's wellness. 
        When providing information, always structure your responses with:
        1. Clear headings for each section
        2. Bullet points for lists
        3. Short, easy-to-read paragraphs
        4. Emojis for visual appeal
        5. Proper spacing between sections
        
        Example format:
        🌟 Main Topic
        • First point
        • Second point
        
        💡 Additional Tips
        • Tip 1
        • Tip 2
        
        Remember to be empathetic and supportive while maintaining a professional tone.`
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Received response from Cohere:', response.data);

    // Process and format the response
    const aiResponse = response.data.text || 
      "I'm here to help you with your health and wellness questions. Could you please rephrase that?";
    
    const formattedResponse = formatResponse(aiResponse);

    res.json({
      message: formattedResponse
    });
  } catch (error) {
    console.error('Detailed error in chat:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    // Fallback response if API fails
    res.json({
      message: "I'm here to help you with your health and wellness questions. Could you please rephrase that?"
    });
  }
};

// @desc    Get chat history
// @route   GET /api/chat
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    // TODO: Implement chat history storage and retrieval
    res.json({ messages: [] });
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({ 
      message: 'Failed to get chat history. Please try again.' 
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory
}; 