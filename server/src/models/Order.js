const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: String,
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  variants: {
    size: String,
    color: String,
    material: String
  },
  subtotal: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  tracking: {
    trackingNumber: String,
    carrier: String,
    nimbusOrderId: String,
    estimatedDelivery: Date,
    trackingUrl: String
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },

  // Addresses
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    landmark: String
  },
  billingAddress: {
    name: String,
    phone: String,
    email: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    landmark: String
  },

  // Payment
  paymentMethod: {
    type: String,
    enum: ['cod', 'razorpay', 'gokwik', 'crypto'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paymentId: String,
    gatewayResponse: mongoose.Schema.Types.Mixed
  },

  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  
  // Shipping
  shipping: {
    method: {
      type: String,
      enum: ['standard', 'express', 'overnight'],
      default: 'standard'
    },
    provider: {
      type: String,
      default: 'NimbusPost'
    },
    trackingNumber: String,
    nimbusOrderId: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    trackingUrl: String,
    pickupScheduled: Date,
    pickupCompleted: Date
  },

  // Timestamps
  placedAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,

  // Notes and Communication
  customerNotes: String,
  adminNotes: String,
  sellerNotes: String,
  
  // Cancellation/Return
  cancellationReason: String,
  returnReason: String,
  refundAmount: Number,
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'processed', 'failed'],
    default: 'none'
  },

  // Multi-vendor support
  sellers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Notifications
  notifications: [{
    type: {
      type: String,
      enum: ['order_placed', 'order_confirmed', 'order_shipped', 'order_delivered', 'order_cancelled']
    },
    sentAt: Date,
    method: {
      type: String,
      enum: ['email', 'sms', 'push']
    },
    status: {
      type: String,
      enum: ['sent', 'failed'],
      default: 'sent'
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ 'items.seller': 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ 'shipping.trackingNumber': 1 });
orderSchema.index({ placedAt: -1 });

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.placedAt) / (1000 * 60 * 60 * 24));
});

// Virtual for total items
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  
  // Update sellers array
  if (this.isModified('items')) {
    this.sellers = [...new Set(this.items.map(item => item.seller.toString()))];
  }
  
  next();
});

// Instance methods
orderSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  
  switch (newStatus) {
    case 'confirmed':
      this.confirmedAt = new Date();
      break;
    case 'shipped':
      this.shippedAt = new Date();
      break;
    case 'delivered':
      this.deliveredAt = new Date();
      break;
    case 'cancelled':
      this.cancelledAt = new Date();
      break;
  }
  
  if (notes) {
    this.adminNotes = notes;
  }
  
  return this.save();
};

orderSchema.methods.updateItemStatus = function(itemId, newStatus) {
  const item = this.items.id(itemId);
  if (item) {
    item.status = newStatus;
    return this.save();
  }
  throw new Error('Item not found');
};

orderSchema.methods.addTracking = function(trackingData) {
  this.shipping = {
    ...this.shipping,
    ...trackingData
  };
  
  if (trackingData.trackingNumber && this.status === 'processing') {
    this.status = 'shipped';
    this.shippedAt = new Date();
  }
  
  return this.save();
};

orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

orderSchema.methods.canBeReturned = function() {
  return this.status === 'delivered' && 
         this.deliveredAt && 
         (Date.now() - this.deliveredAt.getTime()) <= (7 * 24 * 60 * 60 * 1000); // 7 days
};

// Static methods
orderSchema.statics.getOrdersByCustomer = function(customerId, options = {}) {
  const query = { customer: customerId };
  return this.paginate(query, {
    ...options,
    sort: { createdAt: -1 },
    populate: [
      { path: 'items.product', select: 'name images category' },
      { path: 'items.seller', select: 'name email' }
    ]
  });
};

orderSchema.statics.getOrdersBySeller = function(sellerId, options = {}) {
  const query = { 'items.seller': sellerId };
  return this.paginate(query, {
    ...options,
    sort: { createdAt: -1 },
    populate: [
      { path: 'customer', select: 'name email phone' },
      { path: 'items.product', select: 'name images category' }
    ]
  });
};

orderSchema.statics.getOrderStats = function(sellerId = null) {
  const matchStage = sellerId ? { 'items.seller': new mongoose.Types.ObjectId(sellerId) } : {};
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$total' }
      }
    }
  ]);
};

orderSchema.statics.getRevenueStats = function(sellerId = null, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const matchStage = {
    placedAt: { $gte: startDate },
    status: { $in: ['delivered', 'shipped'] }
  };
  
  if (sellerId) {
    matchStage['items.seller'] = new mongoose.Types.ObjectId(sellerId);
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: '$placedAt' },
          month: { $month: '$placedAt' },
          day: { $dayOfMonth: '$placedAt' }
        },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);
};

// Add pagination plugin
orderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Order', orderSchema);