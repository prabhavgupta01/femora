const mongoose = require('mongoose');

const cycleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  cycleLength: {
    type: Number,
    required: true,
    min: 1
  },
  flowIntensity: {
    type: String,
    required: true,
    enum: ['light', 'medium', 'heavy']
  },
  symptoms: [{
    type: String,
    enum: ['cramps', 'headache', 'bloating', 'fatigue', 'mood swings']
  }],
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Add index for faster queries
cycleSchema.index({ user: 1, startDate: -1 });

// Add validation for endDate to be after startDate
cycleSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

const Cycle = mongoose.model('Cycle', cycleSchema);

module.exports = Cycle; 