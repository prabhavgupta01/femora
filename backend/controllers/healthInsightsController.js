const Cycle = require('../models/Cycle');
const Discharge = require('../models/Discharge');
const axios = require('axios');

// @desc    Get AI-powered health insights
// @route   GET /api/health-insights
// @access  Private
const getHealthInsights = async (req, res) => {
  try {
    console.log('Fetching health insights for user:', req.user._id);
    
    // Get user's data
    const [cycles, discharges] = await Promise.all([
      Cycle.find({ user: req.user._id }).sort({ startDate: -1 }).limit(6),
      Discharge.find({ user: req.user._id }).sort({ date: -1 }).limit(5)
    ]);

    console.log('Found cycles:', cycles.length);
    console.log('Found discharges:', discharges.length);

    const insights = [];

    // Cycle Pattern Analysis
    if (cycles.length > 0) {
      const avgLength = cycles.reduce((sum, cycle) => sum + cycle.cycleLength, 0) / cycles.length;
      const lastCycle = cycles[0];
      const prevCycle = cycles[1];

      // Cycle length analysis
      if (avgLength < 21 || avgLength > 35) {
        insights.push({
          type: 'warning',
          title: avgLength < 21 ? 'Short Cycle Length' : 'Long Cycle Length',
          description: `Your average cycle length is ${Math.round(avgLength)} days, which is ${avgLength < 21 ? 'shorter' : 'longer'} than typical (21-35 days). Consider consulting a healthcare provider if this persists.`,
          category: 'cycle'
        });
      }

      // Cycle regularity analysis
      if (prevCycle && Math.abs(lastCycle.cycleLength - prevCycle.cycleLength) > 7) {
        insights.push({
          type: 'warning',
          title: 'Irregular Cycle Length',
          description: `Your cycle length has changed significantly from ${prevCycle.cycleLength} to ${lastCycle.cycleLength} days. Track a few more cycles to establish a pattern.`,
          category: 'cycle'
        });
      }

      // Flow intensity analysis
      const flowIntensities = cycles.reduce((acc, cycle) => {
        acc[cycle.flowIntensity] = (acc[cycle.flowIntensity] || 0) + 1;
        return acc;
      }, {});

      const mostCommonFlow = Object.entries(flowIntensities)
        .sort(([,a], [,b]) => b - a)[0][0];

      if (mostCommonFlow === 'heavy') {
        insights.push({
          type: 'warning',
          title: 'Heavy Flow Pattern',
          description: 'You frequently experience heavy flow. Consider tracking iron levels and consulting a healthcare provider if this affects your daily activities.',
          category: 'cycle'
        });
      }

      // Symptoms analysis
      const commonSymptoms = cycles.reduce((acc, cycle) => {
        cycle.symptoms.forEach(symptom => {
          acc[symptom] = (acc[symptom] || 0) + 1;
        });
        return acc;
      }, {});

      const frequentSymptoms = Object.entries(commonSymptoms)
        .filter(([,count]) => count >= 3)
        .map(([symptom]) => symptom);

      if (frequentSymptoms.length > 0) {
        insights.push({
          type: 'warning',
          title: 'Frequent Symptoms',
          description: `You frequently experience ${frequentSymptoms.join(', ')}. Consider discussing these symptoms with a healthcare provider.`,
          category: 'cycle'
        });
      }
    }

    // Discharge Pattern Analysis
    if (discharges.length > 0) {
      const latest = discharges[0];
      const recentDischarges = discharges.slice(0, 3);

      // Color analysis
      if (['brown', 'green', 'yellow'].includes(latest.color.toLowerCase())) {
        insights.push({
          type: 'warning',
          title: 'Unusual Discharge Color',
          description: 'Recent discharge observations show unusual colors. Monitor for any other symptoms and consult a healthcare provider if concerned.',
          category: 'discharge'
        });
      }

      // Consistency analysis
      if (latest.consistency === 'egg-white') {
        insights.push({
          type: 'info',
          title: 'Fertile Window Indicator',
          description: 'Egg white consistency discharge indicates you may be in your fertile window.',
          category: 'discharge'
        });
      }

      // Pattern changes
      const hasConsistencyChange = recentDischarges.some((d, i, arr) => 
        i > 0 && d.consistency !== arr[i-1].consistency
      );

      if (hasConsistencyChange) {
        insights.push({
          type: 'info',
          title: 'Discharge Pattern Change',
          description: 'Your discharge consistency has changed recently. This is normal throughout your cycle.',
          category: 'discharge'
        });
      }

      // Odor analysis
      if (latest.odor === 'unusual' || latest.odor === 'strong') {
        insights.push({
          type: 'warning',
          title: 'Unusual Odor',
          description: 'You have reported an unusual or strong odor. Please consult a healthcare provider if this persists.',
          category: 'discharge'
        });
      }
    }

    // Personalized Health Tips based on user data
    if (cycles.length > 0) {
      const avgLength = cycles.reduce((sum, cycle) => sum + cycle.cycleLength, 0) / cycles.length;
      
      if (avgLength > 35) {
        insights.push({
          type: 'tip',
          title: 'Track Ovulation',
          description: 'With longer cycles, tracking ovulation signs can help predict your fertile window more accurately.',
          category: 'general'
        });
      }

      if (cycles.some(cycle => cycle.symptoms.includes('cramps'))) {
        insights.push({
          type: 'tip',
          title: 'Pain Management',
          description: 'Consider using a heating pad or gentle exercise to manage cramps during your cycle.',
          category: 'general'
        });
      }
    }

    // Add general tips only if we don't have enough personalized insights
    if (insights.length < 3) {
      insights.push({
        type: 'tip',
        title: 'Stay Hydrated',
        description: 'Drink plenty of water throughout your cycle to maintain healthy discharge patterns.',
        category: 'general'
      });

      insights.push({
        type: 'tip',
        title: 'Track Patterns',
        description: 'Continue tracking both cycle and discharge patterns to better understand your body\'s signals.',
        category: 'general'
      });
    }

    console.log('Generated insights:', JSON.stringify(insights, null, 2));
    res.json(insights);
  } catch (error) {
    console.error('Error generating health insights:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    res.status(400).json({ 
      message: 'Failed to generate health insights',
      error: error.message,
      details: error.response?.data
    });
  }
};

module.exports = {
  getHealthInsights
}; 