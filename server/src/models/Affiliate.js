const mongoose = require('mongoose');

const affiliateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  affiliateCode: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  commissionRate: {
    type: Number,
    default: 50
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  referrals: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    commission: Number,
    paidAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

affiliateSchema.methods.addReferral = function(userId) {
  this.referrals.push({
    userId,
    commission: this.commissionRate,
    paidAt: new Date()
  });
  this.totalEarnings += this.commissionRate;
};

module.exports = mongoose.model('Affiliate', affiliateSchema);