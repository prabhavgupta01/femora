const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createDischarge,
  getDischargeHistory,
  getDischargePatterns,
  getDischargeAlerts
} = require('../controllers/dischargeController');

router.use(protect);

router.route('/')
  .post(createDischarge)
  .get(getDischargeHistory);

router.get('/patterns', getDischargePatterns);
router.get('/alerts', getDischargeAlerts);

module.exports = router; 