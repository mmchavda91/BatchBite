const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Business = require('../models/Business');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register customer
// @route   POST /api/auth/register
// @access  Public
const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      role: 'customer',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    // If owner, include business info
    let businessData = null;
    if (user.role === 'owner') {
      businessData = await Business.findOne({ owner: user._id }).select(
        'businessName logo isActive'
      );
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
        },
        business: businessData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register owner + create business
// @route   POST /api/auth/register-owner
// @access  Public
const registerOwner = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      businessName,
      businessDescription,
      businessPhone,
      businessEmail,
      cuisineTypes,
    } = req.body;

    if (!name || !email || !password || !businessName) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and businessName are required',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      role: 'owner',
    });

    const business = await Business.create({
      owner: user._id,
      businessName,
      description: businessDescription,
      phone: businessPhone || phone,
      email: businessEmail || email,
      cuisineTypes: cuisineTypes || [],
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Owner registered successfully',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
        business: {
          _id: business._id,
          businessName: business.businessName,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    let businessData = null;
    if (user.role === 'owner') {
      businessData = await Business.findOne({ owner: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        business: businessData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerCustomer,
  loginUser,
  registerOwner,
  getMe,
  updateProfile,
};
