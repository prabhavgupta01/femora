const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const cycleRoutes = require('./routes/cycleRoutes');
const chatRoutes = require('./routes/chatRoutes');
const dischargeRoutes = require('./routes/dischargeRoutes');
const healthInsightsRoutes = require('./routes/healthInsightsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/femora')
  .then(() => {
    console.log('MongoDB Connected Successfully');
    console.log('Database URL:', process.env.MONGODB_URI || 'mongodb://localhost:27017/femora');
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cycles', cycleRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/discharge', dischargeRoutes);
app.use('/api/health-insights', healthInsightsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: err.message 
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to Femora API');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
}); 