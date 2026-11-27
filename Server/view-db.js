const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');

// Models
const User = require('./models/User');
const Business = require('./models/Business');
const Product = require('./models/Product');
const Batch = require('./models/Batch');
const Order = require('./models/Order');

const viewDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/batchbite';
    await mongoose.connect(mongoUri);
    console.log('\n============================================================');
    console.log('🍃 BATCHBITE MONGODB DATABASE EXPLORER');
    console.log(`📡 Connected to: ${mongoUri}`);
    console.log('============================================================\n');

    // 1. Collections summary
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 AVAILABLE COLLECTIONS (TABLES):');
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`   • ${col.name.padEnd(16)} ──► ${count} records (documents)`);
    }

    // 2. Users Table
    console.log('\n------------------------------------------------------------');
    console.log('👥 1. USERS TABLE (Collection: users)');
    console.log('------------------------------------------------------------');
    const users = await User.find().select('-password');
    if (users.length === 0) {
      console.log('   (Empty)');
    } else {
      users.forEach((u, i) => {
        console.log(`   [${i + 1}] Name: ${u.name.padEnd(20)} | Email: ${u.email.padEnd(25)} | Role: ${u.role}`);
      });
    }

    // 3. Businesses Table
    console.log('\n------------------------------------------------------------');
    console.log('🏪 2. BUSINESS TABLE (Collection: businesses)');
    console.log('------------------------------------------------------------');
    const businesses = await Business.find();
    if (businesses.length === 0) {
      console.log('   (Empty)');
    } else {
      businesses.forEach((b, i) => {
        console.log(`   [${i + 1}] Kitchen: ${b.businessName} | Phone: ${b.phone} | Cuisines: ${b.cuisineTypes?.join(', ')}`);
        console.log(`       Address: ${b.address}`);
      });
    }

    // 4. Products Table
    console.log('\n------------------------------------------------------------');
    console.log('🍱 3. PRODUCTS TABLE (Collection: products)');
    console.log('------------------------------------------------------------');
    const products = await Product.find();
    if (products.length === 0) {
      console.log('   (Empty)');
    } else {
      products.forEach((p, i) => {
        console.log(`   [${i + 1}] Dish: ${p.name.padEnd(30)} | Price: ₹${p.price} | Category: ${p.category}`);
      });
    }

    // 5. Batches Table
    console.log('\n------------------------------------------------------------');
    console.log('📦 4. BATCHES TABLE (Collection: batches)');
    console.log('------------------------------------------------------------');
    const batches = await Batch.find().populate('product', 'name');
    if (batches.length === 0) {
      console.log('   (Empty)');
    } else {
      batches.forEach((b, i) => {
        const dish = b.product?.name || 'N/A';
        console.log(`   [${i + 1}] Batch: ${b.batchName}`);
        console.log(`       Dish: ${dish} | Price: ₹${b.pricePerUnit} | Stock: ${b.availableQuantity}/${b.totalQuantity} available`);
        console.log(`       Deadline: ${new Date(b.orderDeadline).toLocaleString('en-IN')} | Status: ${b.status}`);
      });
    }

    // 6. Orders Table
    console.log('\n------------------------------------------------------------');
    console.log('📋 5. ORDERS TABLE (Collection: orders)');
    console.log('------------------------------------------------------------');
    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('items.product', 'name');
    if (orders.length === 0) {
      console.log('   (No orders placed yet. Place an order from the website!)');
    } else {
      orders.forEach((o, i) => {
        const custName = o.customer?.name || 'Unknown';
        const itemsList = o.items?.map(it => `${it.product?.name} x${it.quantity}`).join(', ');
        console.log(`   [${i + 1}] Order ID: #${o._id} | Customer: ${custName} | Status: ${o.status.toUpperCase()}`);
        console.log(`       Items: ${itemsList} | Total: ₹${o.totalAmount}`);
      });
    }

    console.log('\n============================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Error viewing database:', err.message);
    process.exit(1);
  }
};

viewDatabase();
