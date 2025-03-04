const Cycle = require('../models/Cycle');

// @desc    Create new cycle entry
// @route   POST /api/cycles
// @access  Private
const createCycle = async (req, res) => {
  try {
    console.log('Received cycle data:', req.body);
    console.log('User ID:', req.user._id);

    // Validate required fields
    if (!req.body.startDate || !req.body.endDate || !req.body.flowIntensity) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: req.body 
      });
    }

    // Create new cycle with user ID
    const cycle = new Cycle({
      ...req.body,
      user: req.user._id,
      cycleLength: req.body.cycleLength || calculateCycleLength(req.body.startDate, req.body.endDate)
    });

    console.log('Attempting to save cycle:', cycle);

    const savedCycle = await cycle.save();
    console.log('Cycle saved successfully:', savedCycle);

    res.status(201).json(savedCycle);
  } catch (error) {
    console.error('Error creating cycle:', error);
    res.status(400).json({ 
      message: error.message,
      details: error.errors || 'No additional details'
    });
  }
};

// Helper function to calculate cycle length
const calculateCycleLength = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function to add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// @desc    Get user's cycle history
// @route   GET /api/cycles
// @access  Private
const getCycles = async (req, res) => {
  try {
    console.log('Fetching cycles for user:', req.user._id);
    const cycles = await Cycle.find({ user: req.user._id })
      .sort({ startDate: -1 });
    console.log('Found cycles:', cycles.length);
    res.json(cycles);
  } catch (error) {
    console.error('Error fetching cycles:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get cycle statistics
// @route   GET /api/cycles/stats
// @access  Private
const getCycleStats = async (req, res) => {
  try {
    console.log('Fetching stats for user:', req.user._id);
    const cycles = await Cycle.find({ user: req.user._id })
      .sort({ startDate: -1 });
    console.log('Found cycles for stats:', cycles.length);
    
    // If no cycles exist, return empty stats
    if (cycles.length === 0) {
      return res.json({
        averageCycleLength: 0,
        commonSymptoms: [],
        flowIntensities: {},
        totalCycles: 0,
        hasData: false
      });
    }

    // Calculate average cycle length
    const totalLength = cycles.reduce((sum, cycle) => sum + cycle.cycleLength, 0);
    const avgLength = cycles.length > 0 ? totalLength / cycles.length : 0;

    // Get most common symptoms
    const symptoms = cycles.reduce((acc, cycle) => {
      cycle.symptoms.forEach(symptom => {
        acc[symptom] = (acc[symptom] || 0) + 1;
      });
      return acc;
    }, {});

    // Get most common flow intensity
    const flowIntensities = cycles.reduce((acc, cycle) => {
      acc[cycle.flowIntensity] = (acc[cycle.flowIntensity] || 0) + 1;
      return acc;
    }, {});

    const lastCycle = cycles[0];

    const stats = {
      averageCycleLength: Math.round(avgLength),
      commonSymptoms: Object.entries(symptoms)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([symptom]) => symptom),
      flowIntensities,
      totalCycles: cycles.length,
      hasData: true,
      lastCycleEnd: lastCycle.endDate,
      averageLength: Math.round(avgLength),
      lastCycleStart: lastCycle.startDate,
      lastCycleEnd: lastCycle.endDate,
      lastCycleLength: lastCycle.cycleLength
    };

    console.log('Calculated stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCycle,
  getCycles,
  getCycleStats
}; 