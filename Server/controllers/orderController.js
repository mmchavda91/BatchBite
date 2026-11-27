const Order = require('../models/Order');
const Batch = require('../models/Batch');
const Business = require('../models/Business');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private (customer)
const placeOrder = async (req, res, next) => {
  try {
    const { items, specialInstructions, pickupDetails } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    // Validate each item and calculate totals
    const processedItems = [];
    let totalAmount = 0;
    let businessId = null;

    for (const item of items) {
      const batch = await Batch.findById(item.batchId).populate('product');

      if (!batch) {
        return res.status(404).json({
          success: false,
          message: `Batch ${item.batchId} not found`,
        });
      }

      // Validate batch is active and ordering is allowed
      if (batch.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: `Batch "${batch.batchName}" is not active`,
        });
      }

      if (new Date() > new Date(batch.orderDeadline)) {
        return res.status(400).json({
          success: false,
          message: `Order deadline has passed for batch "${batch.batchName}"`,
        });
      }

      if (batch.availableQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for batch "${batch.batchName}". Available: ${batch.availableQuantity}`,
        });
      }

      // Ensure all items from same business
      if (businessId && batch.business.toString() !== businessId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'All items must be from the same business',
        });
      }
      businessId = batch.business;

      const subtotal = batch.pricePerUnit * item.quantity;
      totalAmount += subtotal;

      processedItems.push({
        batch: batch._id,
        product: batch.product._id,
        quantity: item.quantity,
        pricePerUnit: batch.pricePerUnit,
        subtotal,
      });
    }

    // Atomically update batch quantities
    for (let i = 0; i < items.length; i++) {
      await Batch.findByIdAndUpdate(items[i].batchId, {
        $inc: {
          availableQuantity: -processedItems[i].quantity,
          reservedQuantity: processedItems[i].quantity,
        },
      });
    }

    // Create order
    const order = await Order.create({
      customer: req.user._id,
      business: businessId,
      items: processedItems,
      totalAmount,
      status: 'pending',
      statusHistory: [{ status: 'pending', changedAt: new Date(), note: 'Order placed' }],
      specialInstructions,
      pickupDetails,
    });

    // Update business totalOrders
    await Business.findByIdAndUpdate(businessId, {
      $inc: { totalOrders: 1 },
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email phone')
      .populate('business', 'businessName')
      .populate('items.product', 'name image')
      .populate('items.batch', 'batchName pickupStartTime pickupEndTime pickupLocation');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { order: populatedOrder },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's orders
// @route   GET /api/orders/my
// @access  Private (customer)
const getCustomerOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { customer: req.user._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('business', 'businessName logo')
      .populate('items.product', 'name image')
      .populate('items.batch', 'batchName pickupStartTime pickupEndTime pickupLocation');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (customer or owner)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('business', 'businessName logo phone email')
      .populate('items.product', 'name image description')
      .populate('items.batch', 'batchName pickupStartTime pickupEndTime pickupLocation');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Authorization: customer can see their own order, owner can see orders for their business
    if (req.user.role === 'customer') {
      if (order.customer._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this order',
        });
      }
    } else if (req.user.role === 'owner') {
      const business = await Business.findOne({ owner: req.user._id });
      if (!business || order.business._id.toString() !== business._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this order',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (customer)
// @route   PUT /api/orders/:id/cancel
// @access  Private (customer)
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status '${order.status}'`,
      });
    }

    // Restore batch quantities
    for (const item of order.items) {
      await Batch.findByIdAndUpdate(item.batch, {
        $inc: {
          availableQuantity: item.quantity,
          reservedQuantity: -item.quantity,
        },
      });
    }

    const { reason } = req.body;

    order.status = 'cancelled';
    order.cancelReason = reason || 'Cancelled by customer';
    order.statusHistory.push({
      status: 'cancelled',
      changedAt: new Date(),
      note: reason || 'Cancelled by customer',
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for the owner's business
// @route   GET /api/business/orders
// @access  Private (owner)
const getBusinessOrders = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    const { status } = req.query;
    const filter = { business: business._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('customer', 'name email phone')
      .populate('items.product', 'name image')
      .populate('items.batch', 'batchName pickupStartTime pickupEndTime');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (owner)
// @route   PUT /api/business/orders/:id/status
// @access  Private (owner)
const updateOrderStatus = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.business.toString() !== business._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order',
      });
    }

    const { status, note } = req.body;

    // Valid transitions
    const validTransitions = {
      pending: ['confirmed', 'rejected', 'cancelled'],
      confirmed: ['preparing', 'rejected', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
      rejected: [],
    };

    const allowedNext = validTransitions[order.status];
    if (!allowedNext || !allowedNext.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from '${order.status}' to '${status}'`,
      });
    }

    // If rejecting/cancelling from an active state, restore stock
    if (
      (status === 'rejected' || status === 'cancelled') &&
      !['completed', 'cancelled', 'rejected'].includes(order.status)
    ) {
      for (const item of order.items) {
        await Batch.findByIdAndUpdate(item.batch, {
          $inc: {
            availableQuantity: item.quantity,
            reservedQuantity: -item.quantity,
          },
        });
      }
    }

    order.status = status;
    order.statusHistory.push({
      status,
      changedAt: new Date(),
      note: note || '',
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to '${status}'`,
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getCustomerOrders,
  getOrderById,
  cancelOrder,
  getBusinessOrders,
  updateOrderStatus,
};
