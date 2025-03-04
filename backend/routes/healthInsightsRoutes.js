const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getHealthInsights } = require('../controllers/healthInsightsController');

router.use(protect);
router.get('/', getHealthInsights);

module.exports = router; 