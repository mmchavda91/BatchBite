const express = require('express');
const router = express.Router();
const {
  getBusinessProfile,
  updateBusinessProfile,
  uploadLogo,
  getDashboardStats,
} = require('../controllers/businessController');
const { getBusinessBatches } = require('../controllers/batchController');
const { getBusinessOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All business routes require authentication + owner role
router.use(protect, authorize('owner'));

router.get('/profile', getBusinessProfile);
router.put('/profile', updateBusinessProfile);
router.put('/logo', upload.single('image'), uploadLogo);
router.get('/dashboard', getDashboardStats);

// Business batches
router.get('/batches', getBusinessBatches);

// Business orders
router.get('/orders', getBusinessOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
