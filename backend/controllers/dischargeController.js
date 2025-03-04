const Discharge = require('../models/Discharge');

// @desc    Create new discharge entry
// @route   POST /api/discharge
// @access  Private
const createDischarge = async (req, res) => {
  try {
    console.log('Received discharge data:', req.body);
    console.log('User ID:', req.user._id);

    // Validate required fields
    if (!req.body.date || !req.body.consistency || !req.body.color || !req.body.amount || !req.body.odor) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: req.body 
      });
    }

    // Create new discharge entry with user ID
    const discharge = new Discharge({
      ...req.body,
      user: req.user._id
    });

    console.log('Attempting to save discharge:', discharge);

    const savedDischarge = await discharge.save();
    console.log('Discharge saved successfully:', savedDischarge);

    res.status(201).json(savedDischarge);
  } catch (error) {
    console.error('Error creating discharge entry:', error);
    res.status(400).json({ 
      message: error.message,
      details: error.errors || 'No additional details'
    });
  }
};

// @desc    Get user's discharge history
// @route   GET /api/discharge
// @access  Private
const getDischargeHistory = async (req, res) => {
  try {
    console.log('Fetching discharge history for user:', req.user._id);
    const discharges = await Discharge.find({ user: req.user._id })
      .sort({ date: -1 });
    console.log('Found discharge entries:', discharges.length);
    res.json(discharges);
  } catch (error) {
    console.error('Error fetching discharge history:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get discharge patterns and alerts
// @route   GET /api/discharge/patterns
// @access  Private
const getDischargePatterns = async (req, res) => {
  try {
    console.log('Fetching discharge patterns for user:', req.user._id);
    const discharges = await Discharge.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(30); // Get last 30 days of data

    if (discharges.length === 0) {
      return res.json({
        currentPattern: 'No data available',
        history: 'No discharge patterns recorded yet',
        lastUpdated: new Date()
      });
    }

    // Get the most recent entry
    const latest = discharges[0];
    
    // Analyze patterns
    const patterns = {
      currentPattern: `${latest.consistency} ${latest.color} discharge`,
      history: `Last ${discharges.length} entries show ${discharges.length} different patterns`,
      lastUpdated: latest.date
    };

    res.json(patterns);
  } catch (error) {
    console.error('Error analyzing discharge patterns:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get discharge alerts
// @route   GET /api/discharge/alerts
// @access  Private
const getDischargeAlerts = async (req, res) => {
  try {
    console.log('Fetching discharge alerts for user:', req.user._id);
    const discharges = await Discharge.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(2); // Get last 2 entries for comparison

    const alerts = [];

    if (discharges.length >= 2) {
      const [latest, previous] = discharges;
      
      // Check for significant changes
      if (latest.color !== previous.color) {
        alerts.push({
          severity: 'warning',
          title: 'Color Change Detected',
          message: `Your discharge color has changed from ${previous.color} to ${latest.color}`
        });
      }

      if (latest.consistency !== previous.consistency) {
        alerts.push({
          severity: 'info',
          title: 'Consistency Change',
          message: `Your discharge consistency has changed from ${previous.consistency} to ${latest.consistency}`
        });
      }

      if (latest.amount !== previous.amount) {
        alerts.push({
          severity: 'info',
          title: 'Amount Change',
          message: `Your discharge amount has changed from ${previous.amount} to ${latest.amount}`
        });
      }

      if (latest.odor === 'unusual' || latest.odor === 'strong') {
        alerts.push({
          severity: 'warning',
          title: 'Unusual Odor',
          message: 'You have reported an unusual or strong odor. Please consult a healthcare provider if this persists.'
        });
      }
    }

    res.json(alerts);
  } catch (error) {
    console.error('Error generating discharge alerts:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createDischarge,
  getDischargeHistory,
  getDischargePatterns,
  getDischargeAlerts
}; 