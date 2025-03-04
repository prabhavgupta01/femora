const mongoose = require('mongoose');

const dischargeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  consistency: {
    type: String,
    required: true,
    enum: ['watery', 'sticky', 'creamy', 'egg-white', 'thick']
  },
  color: {
    type: String,
    required: true,
    enum: ['clear', 'white', 'yellow', 'green', 'brown', 'pink', 'red']
  },
  amount: {
    type: String,
    required: true,
    enum: ['light', 'moderate', 'heavy']
  },
  odor: {
    type: String,
    required: true,
    enum: ['none', 'mild', 'strong', 'unusual']
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Add index for faster queries
dischargeSchema.index({ user: 1, date: -1 });

const Discharge = mongoose.model('Discharge', dischargeSchema);

module.exports = Discharge; 