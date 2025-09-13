const mongoose = require('mongoose');

const sellerSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  subscriptionType: {
    type: String,
    enum: ['early_bird', 'regular'],
    default: 'early_bird'
  },
  monthlyFee: {
    type: Number,
    required: true
  },
  registrationFee: {
    type: Number,
    required: true
  },
  registrationPaid: {
    type: Boolean,
    default: false
  },
  registrationPaymentId: String,
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'cancelled'],
    default: 'pending'
  },
  nextPaymentDate: Date,
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Affiliate'
  },
  payments: [{
    type: {
      type: String,
      enum: ['registration', 'monthly'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    paidAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

sellerSubscriptionSchema.methods.activateSubscription = function() {
  this.status = 'active';
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  this.nextPaymentDate = nextMonth;
};

module.exports = mongoose.model('SellerSubscription', sellerSubscriptionSchema);