const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updatePassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/password', protect, updatePassword);

module.exports = router; 