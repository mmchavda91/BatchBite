const express = require('express');
const router = express.Router();
const {
  registerCustomer,
  loginUser,
  registerOwner,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerCustomer);
router.post('/login', loginUser);
router.post('/register-owner', registerOwner);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
