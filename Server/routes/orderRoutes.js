const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getCustomerOrders,
  getOrderById,
  cancelOrder,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// All order routes require authentication
router.use(protect);

// Customer routes
router.post('/', authorize('customer'), placeOrder);
router.get('/my', authorize('customer'), getCustomerOrders);
router.put('/:id/cancel', authorize('customer'), cancelOrder);

// Shared route (customer sees own, owner sees business orders)
router.get('/:id', getOrderById);

module.exports = router;
