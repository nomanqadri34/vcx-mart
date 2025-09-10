const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password not required for Google OAuth users
    },
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    match: [/^[+]?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  emailVerificationOTP: String,
  emailVerificationOTPExpires: Date,
  phoneVerificationOTP: String,
  phoneVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  refreshTokens: [{
    token: String,
    expiresAt: Date,
    deviceInfo: String
  }],

  // Seller application fields
  sellerApplication: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    submittedAt: Date,
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: String,
    businessName: String,
    businessDescription: String,
    businessAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    },
    businessPhone: String,
    businessEmail: String,
    taxId: String,
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      accountHolderName: String
    },
    documents: [{
      type: String,
      url: String,
      verified: { type: Boolean, default: false }
    }]
  },

  // Profile fields
  avatar: String,
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    isDefault: { type: Boolean, default: false },
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    landmark: String
  }],

  // Preferences
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'INR' },
    timezone: { type: String, default: 'Asia/Kolkata' }
  },

  // OAuth providers
  googleId: String,
  googleEmail: String,

  // Security
  lastLogin: Date,
  lastPasswordChange: Date,
  failedLoginAttempts: { type: Number, default: 0 },
  accountLockedUntil: Date,
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: String,

  // GDPR compliance
  privacyConsent: {
    termsAccepted: { type: Boolean, default: false },
    termsAcceptedAt: Date,
    marketingConsent: { type: Boolean, default: false },
    marketingConsentAt: Date,
    dataProcessingConsent: { type: Boolean, default: false },
    dataProcessingConsentAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  if (this.name) {
    return this.name;
  }
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

// Virtual for seller status
userSchema.virtual('isSeller').get(function () {
  return this.role === 'seller' || this.role === 'admin';
});

// Virtual for admin status
userSchema.virtual('isAdmin').get(function () {
  return this.role === 'admin';
});

// Virtual for Google OAuth status
userSchema.virtual('hasGoogleAuth').get(function () {
  return !!this.googleId;
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'sellerApplication.status': 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    this.lastPasswordChange = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
  const payload = {
    userId: this._id,
    email: this.email,
    role: this.role
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  });
};

userSchema.methods.generateRefreshToken = function (deviceInfo = 'unknown') {
  const payload = {
    userId: this._id,
    tokenType: 'refresh'
  };

  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  this.refreshTokens.push({
    token,
    expiresAt,
    deviceInfo
  });

  return token;
};

userSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = token;
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return token;
};

userSchema.methods.generateEmailVerificationOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.emailVerificationOTP = otp;
  this.emailVerificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return otp;
};

userSchema.methods.generatePhoneVerificationOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.phoneVerificationOTP = otp;
  this.phoneVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return otp;
};

userSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = token;
  this.passwordResetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
  return token;
};

userSchema.methods.incrementFailedLoginAttempts = function () {
  this.failedLoginAttempts += 1;
  if (this.failedLoginAttempts >= 5) {
    this.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  }
};

userSchema.methods.resetFailedLoginAttempts = function () {
  this.failedLoginAttempts = 0;
  this.accountLockedUntil = undefined;
};

userSchema.methods.isAccountLocked = function () {
  return this.accountLockedUntil && this.accountLockedUntil > new Date();
};

// Static methods
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByPhone = function (phone) {
  return this.findOne({ phone });
};

userSchema.statics.findByGoogleId = function (googleId) {
  return this.findOne({ googleId });
};

userSchema.statics.findPendingSellerApplications = function () {
  return this.find({ 'sellerApplication.status': 'pending' });
};

module.exports = mongoose.model('User', userSchema);
