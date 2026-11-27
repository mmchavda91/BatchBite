const express = require('express');
const router = express.Router();
const {
  getBatches,
  getBatch,
  createBatch,
  updateBatch,
  deleteBatch,
} = require('../controllers/batchController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getBatches);
router.get('/:id', getBatch);

// Protected owner routes
router.post('/', protect, authorize('owner'), createBatch);
router.put('/:id', protect, authorize('owner'), updateBatch);
router.delete('/:id', protect, authorize('owner'), deleteBatch);

module.exports = router;
