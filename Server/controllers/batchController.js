const Batch = require('../models/Batch');
const Product = require('../models/Product');
const Business = require('../models/Business');

// @desc    Get all batches (public)
// @route   GET /api/batches
// @access  Public
const getBatches = async (req, res, next) => {
  try {
    const { product, business, status } = req.query;

    const filter = {};

    if (product) filter.product = product;
    if (business) filter.business = business;
    // Default to active if not specified
    filter.status = status || 'active';

    const batches = await Batch.find(filter)
      .populate('product', 'name description category image allergens')
      .populate('business', 'businessName logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: batches.length,
      data: { batches },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single batch (public)
// @route   GET /api/batches/:id
// @access  Public
const getBatch = async (req, res, next) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('product', 'name description price category image allergens preparationTime')
      .populate('business', 'businessName logo phone email address');

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { batch },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create batch
// @route   POST /api/batches
// @access  Private (owner)
const createBatch = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business profile not found',
      });
    }

    const {
      product: productId,
      batchName,
      totalQuantity,
      pricePerUnit,
      preparationDate,
      pickupStartTime,
      pickupEndTime,
      orderDeadline,
      pickupLocation,
      notes,
    } = req.body;

    // Validate product belongs to this business
    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.business.toString() !== business._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Product does not belong to your business',
      });
    }

    const batch = await Batch.create({
      product: productId,
      business: business._id,
      batchName,
      totalQuantity,
      availableQuantity: totalQuantity,
      reservedQuantity: 0,
      pricePerUnit,
      preparationDate,
      pickupStartTime,
      pickupEndTime,
      orderDeadline,
      pickupLocation,
      notes,
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Batch created successfully',
      data: { batch },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update batch
// @route   PUT /api/batches/:id
// @access  Private (owner)
const updateBatch = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business profile not found',
      });
    }

    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    if (batch.business.toString() !== business._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this batch',
      });
    }

    const {
      batchName,
      pricePerUnit,
      preparationDate,
      pickupStartTime,
      pickupEndTime,
      orderDeadline,
      pickupLocation,
      notes,
      status,
    } = req.body;

    const updatedBatch = await Batch.findByIdAndUpdate(
      req.params.id,
      {
        batchName,
        pricePerUnit,
        preparationDate,
        pickupStartTime,
        pickupEndTime,
        orderDeadline,
        pickupLocation,
        notes,
        status,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Batch updated successfully',
      data: { batch: updatedBatch },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete batch (set status to cancelled)
// @route   DELETE /api/batches/:id
// @access  Private (owner)
const deleteBatch = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business profile not found',
      });
    }

    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    if (batch.business.toString() !== business._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this batch',
      });
    }

    await Batch.findByIdAndUpdate(req.params.id, { status: 'cancelled' });

    res.status(200).json({
      success: true,
      message: 'Batch cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all batches for the owner's business
// @route   GET /api/business/batches
// @access  Private (owner)
const getBusinessBatches = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business profile not found',
      });
    }

    const { status } = req.query;
    const filter = { business: business._id };
    if (status) filter.status = status;

    const batches = await Batch.find(filter)
      .populate('product', 'name category image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: batches.length,
      data: { batches },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBatches,
  getBatch,
  createBatch,
  updateBatch,
  deleteBatch,
  getBusinessBatches,
};
