const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  }
});

const customFieldSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false }); // _id: false means Mongoose won't add an _id to subdocuments

const dynamicProductDetailSchema = new mongoose.Schema({
  fieldName: {
    type: String,
    required: true,
    trim: true
  },
  fieldType: {
    type: String,
    required: true,
    enum: ['text', 'number', 'select', 'textarea', 'checkbox'],
    default: 'text'
  },
  fieldValue: {
    type: String,
    trim: true
  },
  fieldOptions: {
    type: String,
    trim: true
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // Keep basePrice for backward compatibility
  basePrice: {
    type: Number,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  // Add seller field for multi-vendor support
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  sizes: [sizeSchema],
  isAccessory: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'out_of_stock', 'archived'],
    default: 'active'
  },
  // Add approval fields for admin moderation
  isApproved: {
    type: Boolean,
    default: true
  },
  approvedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  featured: {
    type: Boolean,
    default: false
  },
  colors: [{
    type: String
  }],
  gender: {
    type: String
  },
  productType: {
    type: String
  },
  fit: {
    type: String
  },
  closure: {
    type: String
  },
  length: {
    type: String
  },
  manufactureCareFit: {
    type: String
  },
  material: {
    type: String
  },
  neckType: {
    type: String
  },
  fitType: {
    type: String
  },
  pattern: {
    type: String
  },
  sleeveType: {
    type: String
  },
  careInstruction: {
    type: String
  },
  sku: {
    type: String,
    unique: true,
    sparse: true, // This allows multiple null/undefined values
    required: false,
    uppercase: true
  },
  countryOfOrigin: {
    type: String
  },
  customSizeGuide: {
    type: String
  },
  discountedPrice: {
    type: Number,
    min: 0
  },
  keyHighlightsCustomFields: [customFieldSchema],
  productInformationCustomFields: [customFieldSchema],
  dynamicProductDetails: [dynamicProductDetailSchema],
  // Add additional fields for compatibility
  brand: {
    type: String,
    trim: true
  },
  shortDescription: {
    type: String
  },
  weight: {
    type: Number,
    min: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: 0
  },

  metaTitle: {
    type: String,
    maxlength: 60
  },
  metaDescription: {
    type: String,
    maxlength: 160
  },
  // Performance metrics
  views: {
    type: Number,
    default: 0
  },
  sales: {
    type: Number,
    default: 0
  },
  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total inventory based on sizes
productSchema.virtual('totalInventory').get(function () {
  if (!this.sizes || this.sizes.length === 0) {
    return 0;
  }
  return this.sizes.reduce((total, size) => total + size.stock, 0);
});

// Virtual for in stock status
productSchema.virtual('inStock').get(function () {
  return this.totalInventory > 0;
});

// Virtual for low stock status
productSchema.virtual('lowStock').get(function () {
  return this.totalInventory <= this.lowStockThreshold && this.totalInventory > 0;
});

// Virtual for out of stock status
productSchema.virtual('outOfStock').get(function () {
  return this.totalInventory <= 0;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (!this.discountedPrice || this.discountedPrice >= this.price) {
    return 0;
  }
  return Math.round(((this.price - this.discountedPrice) / this.price) * 100);
});

// Indexes
productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isApproved: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ createdAt: -1 });
productSchema.index({ featured: -1 });

// Pre-save middleware
productSchema.pre('save', async function (next) {
  // Auto-generate SKU if not provided or empty
  if ((!this.sku || this.sku.trim() === '') && this.name) {
    let attempts = 0;
    const maxAttempts = 50; // Increased attempts

    while (attempts < maxAttempts) {
      const cleanName = this.name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .split(' ')
        .filter(word => word.length > 0) // Remove empty strings
        .slice(0, 2) // Use only first 2 words for shorter SKU
        .join('')
        .toUpperCase()
        .substring(0, 8); // Limit to 8 characters

      // Generate more unique identifier
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
      const attemptSuffix = attempts > 0 ? `-${attempts}` : '';

      // Multiple SKU generation strategies for better uniqueness
      let generatedSku;
      if (attempts < 10) {
        // Strategy 1: Name + full timestamp + random
        generatedSku = `${cleanName}-${timestamp.slice(-6)}${random}${attemptSuffix}`;
      } else if (attempts < 20) {
        // Strategy 2: Name + seller ID + timestamp
        const sellerId = this.seller ? this.seller.toString().slice(-4) : '0000';
        generatedSku = `${cleanName}-${sellerId}-${timestamp.slice(-4)}${random.slice(-3)}`;
      } else if (attempts < 30) {
        // Strategy 3: Completely random with prefix
        const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
        generatedSku = `${cleanName}-${randomStr}-${random.slice(-3)}`;
      } else {
        // Strategy 4: UUID-like generation
        const uuid = `${Math.random().toString(36).substring(2, 6)}${Date.now().toString(36)}`.toUpperCase();
        generatedSku = `PROD-${uuid}-${random.slice(-3)}`;
      }

      // Ensure SKU is not too long
      if (generatedSku.length > 50) {
        generatedSku = generatedSku.substring(0, 50);
      }

      // Check if this SKU already exists
      const existingSku = await this.constructor.findOne({
        sku: generatedSku,
        _id: { $ne: this._id } // Exclude current document for updates
      });

      if (!existingSku) {
        this.sku = generatedSku;
        break;
      }

      attempts++;

      // Add progressive delay to avoid race conditions
      if (attempts % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, attempts));
      }
    }

    // Final fallback with guaranteed uniqueness using ObjectId
    if (!this.sku) {
      const objectId = new mongoose.Types.ObjectId().toString().toUpperCase();
      const timestamp = Date.now().toString(36).toUpperCase();
      this.sku = `PROD-${timestamp}-${objectId.slice(-8)}`;
    }
  }

  // Sync basePrice with price for backward compatibility
  if (this.isModified('price') && !this.basePrice) {
    this.basePrice = this.price;
  }

  // Auto-approve new products and set approval date
  if (this.isNew && this.isApproved && !this.approvedAt) {
    this.approvedAt = new Date();
  }

  // Ensure only one primary image
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length > 1) {
      // Keep only the first primary image
      this.images.forEach((img, index) => {
        if (index > 0) img.isPrimary = false;
      });
    } else if (primaryImages.length === 0) {
      // Set first image as primary if none is set
      this.images[0].isPrimary = true;
    }
  }

  next();
});

// Instance methods
productSchema.methods.updateStock = function (size, quantity, type = 'decrease') {
  const sizeObj = this.sizes.find(s => s.size === size);
  if (!sizeObj) {
    throw new Error('Size not found');
  }

  if (type === 'decrease') {
    if (sizeObj.stock < quantity) {
      throw new Error('Insufficient stock');
    }
    sizeObj.stock -= quantity;
  } else if (type === 'increase') {
    sizeObj.stock += quantity;
  }

  return this.save();
};

productSchema.methods.addView = function () {
  this.views += 1;
  return this.save();
};

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
