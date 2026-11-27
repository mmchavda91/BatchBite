const Business = require('../models/Business');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Batch = require('../models/Batch');
const path = require('path');

// @desc    Get owner's business profile
// @route   GET /api/business/profile
// @access  Private (owner)
const getBusinessProfile = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id }).populate(
      'owner',
      'name email phone'
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { business },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update business profile
// @route   PUT /api/business/profile
// @access  Private (owner)
const updateBusinessProfile = async (req, res, next) => {
  try {
    const {
      businessName,
      description,
      phone,
      address,
      email,
      cuisineTypes,
    } = req.body;

    const business = await Business.findOneAndUpdate(
      { owner: req.user._id },
      { businessName, description, phone, address, email, cuisineTypes },
      { new: true, runValidators: true }
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business profile not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Business profile updated successfully',
      data: { business },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload business logo
// @route   PUT /api/business/logo
// @access  Private (owner)
const uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    const logoPath = `/uploads/${req.file.filename}`;

    const business = await Business.findOneAndUpdate(
      { owner: req.user._id },
      { logo: logoPath },
      { new: true }
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business profile not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logo uploaded successfully',
      data: { logo: logoPath, business },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get business dashboard statistics
// @route   GET /api/business/dashboard
// @access  Private (owner)
const getDashboardStats = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    const businessId = business._id;

    // Order counts by status
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      completedOrders,
      totalProducts,
      totalBatches,
    ] = await Promise.all([
      Order.countDocuments({ business: businessId }),
      Order.countDocuments({ business: businessId, status: 'pending' }),
      Order.countDocuments({ business: businessId, status: 'confirmed' }),
      Order.countDocuments({ business: businessId, status: 'completed' }),
      Product.countDocuments({ business: businessId, isActive: true }),
      Batch.countDocuments({ business: businessId }),
    ]);

    // Total revenue from completed orders
    const revenueResult = await Order.aggregate([
      {
        $match: {
          business: businessId,
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ]);
    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Recent orders (last 10)
    const recentOrders = await Order.find({ business: businessId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('customer', 'name email')
      .populate('items.product', 'name');

    // Daily sales for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailySales = await Order.aggregate([
      {
        $match: {
          business: businessId,
          status: 'completed',
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        completedOrders,
        totalRevenue,
        totalProducts,
        totalBatches,
        recentOrders,
        dailySales,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBusinessProfile,
  updateBusinessProfile,
  uploadLogo,
  getDashboardStats,
};
