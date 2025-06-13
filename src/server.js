const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

// Get port from environment variables or use default
const PORT = process.env.PORT || 5001;

// Connect to MongoDB database
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Authentication service running on port ${PORT}`);
});