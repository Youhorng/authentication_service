const express = require('express');
const { register, login, getUserProfile } = require('../controllers/auth_controller');
const { protect, authorize } = require('../middleware/auth_middleware');
const router = express.Router();

// Public routes
router.post('/login', login);

// Admin-only routes - requires auth token and admin role
router.post('/register', protect, authorize('admin'), register);

// Protected routes - requires auth token
router.get('/me', protect, getUserProfile);

module.exports = router;