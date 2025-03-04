const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Protect all chat routes
router.use(protect);

router.route('/')
  .post(sendMessage)
  .get(getChatHistory);

module.exports = router; 