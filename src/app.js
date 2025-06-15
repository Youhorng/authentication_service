const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const auth_routes = require('./routes/auth_routes');

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Allow cross-origin requests
app.use(morgan('dev')); // Log HTTP requests

// Routes   
app.use('/auth', auth_routes); // All auth routes will be prefixed with /api/auth

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'Authentication service is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;