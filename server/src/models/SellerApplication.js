const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const sellerApplicationSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Application Status
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'requires_changes'],
    default: 'pending'
  },

  // Business Information
  businessName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  businessType: {
    type: String,
    required: true,
    enum: [
      'Individual/Proprietorship',
      'Partnership',
      'Private Limited Company',
      'Public Limited Company',
      'LLP',
      'Others'
    ]
  },
  businessCategory: {
    type: String,
    required: true,
    enum: [
      'Electronics & Gadgets',
      'Fashion & Apparel',
      'Home & Kitchen',
      'Books & Stationery',
      'Sports & Fitness',
      'Beauty & Personal Care',
      'Automotive',
      'Others'
    ]
  },
  businessDescription: {
    type: String,
    required: true,
    trim: true,
    minlength: 50,
    maxlength: 1000
  },
  establishedYear: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear()
  },

  // Contact Information
  businessEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid email format']
  },
  businessPhone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number format']
  },
  businessAddress: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  city: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  state: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  pincode: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{6}$/, 'Invalid pincode format']
  },

  // Physical Store Information
  hasPhysicalStore: {
    type: Boolean,
    default: false
  },
  storeAddress: {
    type: String,
    trim: true,
    maxlength: 500
  },

  // Legal Information
  gstNumber: {
    type: String,
    trim: true,
    uppercase: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format']
  },
  panNumber: {
    type: String,
    trim: true,
    uppercase: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format']
  },

  // Bank Account Details
  bankAccountNumber: {
    type: String,
    required: true,
    trim: true,
    minlength: 9,
    maxlength: 18
  },
  bankIFSC: {
    type: String,
    trim: true,
    uppercase: true,
    match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format']
  },
  bankName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  accountHolderName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },

  // Additional Information
  expectedMonthlyRevenue: {
    type: String,
    enum: [
      'Less than ₹1 Lakh',
      '₹1-5 Lakhs',
      '₹5-10 Lakhs',
      '₹10-25 Lakhs',
      '₹25-50 Lakhs',
      'More than ₹50 Lakhs'
    ]
  },
  productCategories: [{
    type: String,
    trim: true
  }],

  // Terms Agreement
  agreeToTerms: {
    type: Boolean,
    required: true,
    validate: {
      validator: function (v) {
        return v === true;
      },
      message: 'You must agree to the terms and conditions'
    }
  },

  // Review Information
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  reviewNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: 500
  },

  // Application Tracking
  applicationId: {
    type: String,
    unique: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },

  // Registration Fee (One-time)
  registrationFee: {
    type: Number,
    default: 50
  },
  registrationPaid: {
    type: Boolean,
    default: false
  },
  registrationPaymentId: String,
  registrationPaidAt: Date,

  // Monthly Subscription
  subscriptionPlan: {
    type: String,
    enum: ['early_bird', 'regular'],
    default: function () {
      return new Date() < new Date('2025-10-01') ? 'early_bird' : 'regular';
    }
  },
  monthlyAmount: {
    type: Number,
    default: function () {
      return new Date() < new Date('2025-10-01') ? 500 : 800;
    }
  },
  razorpaySubscriptionId: String,
  razorpayCustomerId: String,
  razorpayPaymentLinkId: String,
  subscriptionStatus: {
    type: String,
    enum: ['pending', 'created', 'authenticated', 'active', 'paused', 'cancelled', 'completed'],
    default: 'pending'
  },
  subscriptionLink: String,
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },

  // Documents
  documents: [{
    type: {
      type: String,
      enum: ['pan_card', 'aadhaar_card', 'gst_certificate', 'business_certificate', 'bank_statement', 'other'],
      required: true
    },
    filename: String,
    originalName: String,
    url: {
      type: String,
      required: true
    },
    cloudinaryId: String,
    verified: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add pagination plugin
sellerApplicationSchema.plugin(mongoosePaginate);

// Indexes
sellerApplicationSchema.index({ userId: 1 });
sellerApplicationSchema.index({ status: 1 });
sellerApplicationSchema.index({ applicationId: 1 });
sellerApplicationSchema.index({ submittedAt: -1 });
sellerApplicationSchema.index({ businessEmail: 1 });

// Virtual for user details
sellerApplicationSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Virtual for reviewer details
sellerApplicationSchema.virtual('reviewer', {
  ref: 'User',
  localField: 'reviewedBy',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware to generate application ID
sellerApplicationSchema.pre('save', function (next) {
  if (this.isNew && !this.applicationId) {
    // Generate application ID: SA + timestamp + random
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.applicationId = `SA${timestamp}${random}`;
  }

  this.lastUpdated = new Date();
  next();
});

// Instance methods
sellerApplicationSchema.methods.approve = function (reviewerId, notes) {
  this.status = 'approved';
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  this.reviewNotes = notes;
  return this.save();
};

sellerApplicationSchema.methods.reject = function (reviewerId, reason, notes) {
  this.status = 'rejected';
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  this.rejectionReason = reason;
  this.reviewNotes = notes;
  return this.save();
};

sellerApplicationSchema.methods.requestChanges = function (reviewerId, reason, notes) {
  this.status = 'requires_changes';
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  this.rejectionReason = reason;
  this.reviewNotes = notes;
  return this.save();
};

sellerApplicationSchema.methods.createSubscription = function (subscriptionId, customerId, subscriptionLink) {
  this.razorpaySubscriptionId = subscriptionId;
  this.razorpayCustomerId = customerId;
  this.subscriptionLink = subscriptionLink;
  this.subscriptionStatus = 'created';
  return this.save();
};

sellerApplicationSchema.methods.activateSubscription = function () {
  this.subscriptionStatus = 'active';
  this.paymentStatus = 'paid';
  this.subscriptionStartDate = new Date();
  this.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  return this.save();
};

// Static methods
sellerApplicationSchema.statics.findByApplicationId = function (applicationId) {
  return this.findOne({ applicationId }).populate('user', 'firstName lastName email');
};

sellerApplicationSchema.statics.findPendingApplications = function () {
  return this.find({ status: 'pending' })
    .populate('user', 'firstName lastName email')
    .sort({ submittedAt: -1 });
};

sellerApplicationSchema.statics.getApplicationStats = function () {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('SellerApplication', sellerApplicationSchema);