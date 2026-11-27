const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    batchName: {
      type: String,
      required: [true, 'Batch name is required'],
      trim: true,
    },
    totalQuantity: {
      type: Number,
      required: [true, 'Total quantity is required'],
      min: [1, 'Total quantity must be at least 1'],
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: [0, 'Available quantity cannot be negative'],
    },
    reservedQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Reserved quantity cannot be negative'],
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Price per unit is required'],
      min: [0, 'Price cannot be negative'],
    },
    preparationDate: {
      type: Date,
    },
    pickupStartTime: {
      type: mongoose.Schema.Types.Mixed,
    },
    pickupEndTime: {
      type: mongoose.Schema.Types.Mixed,
    },
    orderDeadline: {
      type: Date,
      required: [true, 'Order deadline is required'],
    },
    pickupLocation: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Method to check if ordering is allowed
batchSchema.methods.canOrder = function (requestedQty) {
  if (this.status !== 'active') return false;
  if (new Date() > new Date(this.orderDeadline)) return false;
  if (this.availableQuantity < requestedQty) return false;
  return true;
};

module.exports = mongoose.model('Batch', batchSchema);
