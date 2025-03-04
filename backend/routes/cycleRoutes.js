const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createCycle,
  getCycles,
  getCycleStats
} = require('../controllers/cycleController');

router.use(protect); // Protect all cycle routes

router.route('/')
  .post(createCycle)
  .get(getCycles);

router.get('/stats', getCycleStats);

module.exports = router; 