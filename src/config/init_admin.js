require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const connectDB = require('./db');

const createAdminUser = async () => {
  try {
    await connectDB();
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }
    
    // Create admin user
    await User.create({
      email: 'admin@example.com',
      password: 'admin123', 
      role: 'admin'
    });
    
    console.log('Admin user created successfully');
    process.exit();
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();