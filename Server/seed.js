require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('./models/User');
const Business = require('./models/Business');
const Product = require('./models/Product');
const Batch = require('./models/Batch');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Business.deleteMany({});
    await Product.deleteMany({});
    await Batch.deleteMany({});
    console.log('Cleared existing data.');

    // 1. Create owner user
    const owner = await User.create({
      name: 'BatchBite Owner',
      email: 'owner@batchbite.com',
      password: 'owner123',
      phone: '+91 98765 43210',
      role: 'owner',
    });
    console.log('Owner created:', owner.email);

    // 2. Create business for owner
    const business = await Business.create({
      owner: owner._id,
      businessName: 'BatchBite Home Kitchen',
      description: 'Authentic homestyle dishes prepared in clean kitchen environments with local organic ingredients.',
      phone: '+91 98765 43210',
      email: 'kitchen@batchbite.com',
      address: 'Flat 402, Sunrise Towers, Indiranagar, Bangalore',
      cuisineTypes: ['Indian', 'Biryani & Rice', 'Desserts', 'South Indian'],
      totalProducts: 4,
      totalOrders: 0,
    });
    console.log('Business created:', business.businessName);

    // 3. Create customer user
    const customer = await User.create({
      name: 'Mamta',
      email: 'customer@batchbite.com',
      password: 'customer123',
      phone: '+91 91234 56789',
      address: 'Apartment 12B, Green Woods, Indiranagar',
      role: 'customer',
    });
    console.log('Customer created:', customer.email);

    // 4. Create sample products with high-quality food image URLs
    const product1 = await Product.create({
      business: business._id,
      name: 'Homemade Butter Chicken & Naan',
      description: 'Rich, creamy tomato gravy with tender marinated chicken served alongside warm butter garlic naans.',
      price: 280,
      category: 'Indian',
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
      isAvailable: true,
      preparationTime: '45 mins',
      allergens: ['Dairy', 'Cashew'],
    });

    const product2 = await Product.create({
      business: business._id,
      name: 'Special Hyderabadi Dum Biryani',
      description: 'Slow-cooked aromatic basmati rice layered with spiced tender chicken, saffron, and fresh mint. Served with cooling raita.',
      price: 320,
      category: 'Biryani & Rice',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      isAvailable: true,
      preparationTime: '60 mins',
      allergens: ['Dairy'],
    });

    const product3 = await Product.create({
      business: business._id,
      name: 'Fudgy Dark Chocolate Brownie Box',
      description: 'Pack of 4 decadent artisan brownies made with 70% dark Belgian cocoa and crushed roasted walnuts.',
      price: 220,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
      isAvailable: true,
      preparationTime: '30 mins',
      allergens: ['Gluten', 'Eggs', 'Dairy', 'Walnuts'],
    });

    const product4 = await Product.create({
      business: business._id,
      name: 'Crispy Samosa & Mint Chutney (6 pcs)',
      description: 'Flaky pastry pockets stuffed with spiced potatoes, green peas, and fragrant herbs. Served with tangy tamarind & spicy mint dips.',
      price: 150,
      category: 'Snacks',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      isAvailable: true,
      preparationTime: '25 mins',
      allergens: ['Gluten'],
    });

    console.log('Products created with images!');

    // 5. Create sample batches with 30-day active deadlines
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
    const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const deadline1 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days active
    const deadline2 = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000); // 21 days active
    const deadline3 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days active

    const batch1 = await Batch.create({
      product: product1._id,
      business: business._id,
      batchName: 'Weekend Butter Chicken Feast Batch',
      totalQuantity: 25,
      availableQuantity: 25,
      reservedQuantity: 0,
      pricePerUnit: 280,
      preparationDate: tomorrow,
      pickupStartTime: '12:30 PM',
      pickupEndTime: '03:30 PM',
      orderDeadline: deadline1,
      pickupLocation: 'Flat 402, Sunrise Towers, Indiranagar',
      notes: 'Packaged in food-grade microwaveable bowls. Extra gravy pouch included.',
      status: 'active',
    });

    const batch2 = await Batch.create({
      product: product2._id,
      business: business._id,
      batchName: 'Sunday Dum Biryani Pot Batch',
      totalQuantity: 30,
      availableQuantity: 30,
      reservedQuantity: 0,
      pricePerUnit: 320,
      preparationDate: inTwoDays,
      pickupStartTime: '01:00 PM',
      pickupEndTime: '04:00 PM',
      orderDeadline: deadline2,
      pickupLocation: 'Flat 402, Sunrise Towers, Indiranagar',
      notes: 'Slow dum cooked. Comes with mirchi ka salan and cucumber raita.',
      status: 'active',
    });

    const batch3 = await Batch.create({
      product: product3._id,
      business: business._id,
      batchName: 'Fresh Baked Brownie Box Batch',
      totalQuantity: 40,
      availableQuantity: 40,
      reservedQuantity: 0,
      pricePerUnit: 220,
      preparationDate: tomorrow,
      pickupStartTime: '03:00 PM',
      pickupEndTime: '07:00 PM',
      orderDeadline: deadline3,
      pickupLocation: 'Flat 402, Sunrise Towers, Indiranagar',
      notes: 'Box of 4 pieces. Best enjoyed warm with vanilla ice cream.',
      status: 'active',
    });

    const batch4 = await Batch.create({
      product: product4._id,
      business: business._id,
      batchName: 'Evening Tea-Time Samosa Batch',
      totalQuantity: 35,
      availableQuantity: 35,
      reservedQuantity: 0,
      pricePerUnit: 150,
      preparationDate: tomorrow,
      pickupStartTime: '04:30 PM',
      pickupEndTime: '07:30 PM',
      orderDeadline: deadline1,
      pickupLocation: 'Flat 402, Sunrise Towers, Indiranagar',
      notes: 'Fried fresh right before your pickup slot.',
      status: 'active',
    });

    console.log('4 Active Batches created successfully with long active deadlines!');

    console.log('\n✅ Seed completed successfully!');
    console.log('--------------------------------------------------');
    console.log('Owner Login:    owner@batchbite.com    / password: owner123');
    console.log('Customer Login: customer@batchbite.com / password: customer123');
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
