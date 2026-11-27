const Product = require('../models/Product');
const Business = require('../models/Business');

// @desc    Get all products (public)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { business, category, search, isAvailable } = req.query;

    const filter = { isActive: true };

    if (business) filter.business = business;
    if (category) filter.category = category;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter)
      .populate('business', 'businessName logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product (public)
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'business',
      'businessName logo phone email address'
    );

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (owner)
const createProduct = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business profile not found',
      });
    }

    const { name, description, price, category, preparationTime, allergens, isAvailable } =
      req.body;

    const product = await Product.create({
      business: business._id,
      name,
      description,
      price,
      category,
      preparationTime,
      allergens: allergens || [],
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    // Increment business totalProducts
    await Business.findByIdAndUpdate(business._id, {
      $inc: { totalProducts: 1 },
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (owner)
const updateProduct = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business profile not found',
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.business.toString() !== business._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    const { name, description, price, category, preparationTime, allergens, isAvailable } =
      req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, preparationTime, allergens, isAvailable },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (soft delete)
// @route   DELETE /api/products/:id
// @access  Private (owner)
const deleteProduct = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business profile not found',
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.business.toString() !== business._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    await Product.findByIdAndUpdate(req.params.id, { isActive: false });

    // Decrement totalProducts
    await Business.findByIdAndUpdate(business._id, {
      $inc: { totalProducts: -1 },
    });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product image
// @route   PUT /api/products/:id/image
// @access  Private (owner)
const uploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    const business = await Business.findOne({ owner: req.user._id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.business.toString() !== business._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { image: imagePath },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product image uploaded successfully',
      data: { image: imagePath, product: updatedProduct },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};
