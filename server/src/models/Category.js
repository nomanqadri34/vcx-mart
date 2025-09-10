const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  // Hierarchy
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  ancestors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  level: {
    type: Number,
    default: 0,
    min: [0, 'Level cannot be negative']
  },

  // Display and organization
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },

  // Images
  image: {
    url: String,
    alt: String
  },
  icon: String,

  // SEO
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  metaKeywords: [String],

  // Commission structure for sellers
  commission: {
    rate: {
      type: Number,
      min: [0, 'Commission rate cannot be negative'],
      max: [100, 'Commission rate cannot exceed 100%'],
      default: 10
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    fixedAmount: {
      type: Number,
      min: [0, 'Fixed amount cannot be negative']
    }
  },

  // Attributes that products in this category can have
  allowedAttributes: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['text', 'number', 'boolean', 'select', 'multiselect'],
      default: 'text'
    },
    options: [String], // For select/multiselect types
    isRequired: {
      type: Boolean,
      default: false
    },
    defaultValue: mongoose.Schema.Types.Mixed
  }],

  // Tax and compliance
  taxClass: {
    type: String,
    enum: ['standard', 'reduced', 'zero', 'exempt'],
    default: 'standard'
  },
  gstRate: {
    type: Number,
    min: [0, 'GST rate cannot be negative'],
    max: [100, 'GST rate cannot exceed 100%']
  },

  // Performance metrics
  productCount: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },

  // Audit
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Virtual for full path
categorySchema.virtual('fullPath').get(function () {
  if (!this.ancestors || this.ancestors.length === 0) {
    return this.name;
  }
  return this.ancestors.map(ancestor => ancestor.name).join(' > ') + ' > ' + this.name;
});

// Virtual for children count
categorySchema.virtual('childrenCount').get(function () {
  return this.model('Category').countDocuments({ parent: this._id });
});

// Virtual for is leaf (no children)
categorySchema.virtual('isLeaf').get(function () {
  return this.childrenCount === 0;
});

// Virtual for is root (no parent)
categorySchema.virtual('isRoot').get(function () {
  return !this.parent;
});

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ ancestors: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ order: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ isFeatured: 1 });
categorySchema.index({ name: 'text', description: 'text' });
categorySchema.index({ createdAt: -1 });

// Pre-save middleware
categorySchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }

  // Update level and ancestors if parent changes
  if (this.isModified('parent')) {
    if (this.parent) {
      const parentCategory = await this.model('Category').findById(this.parent);
      if (parentCategory) {
        this.level = parentCategory.level + 1;
        this.ancestors = [...parentCategory.ancestors, parentCategory._id];
      }
    } else {
      this.level = 0;
      this.ancestors = [];
    }
  }

  next();
});

// Pre-save middleware to update product count
categorySchema.pre('save', async function (next) {
  if (this.isNew) {
    next();
    return;
  }

  // Update product count
  const Product = mongoose.model('Product');
  this.productCount = await Product.countDocuments({
    category: this._id,
    status: 'active',
    isApproved: true
  });

  next();
});

// Instance methods
categorySchema.methods.getChildren = function () {
  return this.model('Category').find({ parent: this._id, isActive: true }).sort({ order: 1 });
};

categorySchema.methods.getSiblings = function () {
  return this.model('Category').find({
    parent: this.parent,
    _id: { $ne: this._id },
    isActive: true
  }).sort({ order: 1 });
};

categorySchema.methods.getAncestors = function () {
  if (!this.ancestors || this.ancestors.length === 0) {
    return [];
  }
  return this.model('Category').find({ _id: { $in: this.ancestors } });
};

categorySchema.methods.getDescendants = function () {
  return this.model('Category').find({
    ancestors: this._id,
    isActive: true
  }).sort({ level: 1, order: 1 });
};

categorySchema.methods.moveTo = async function (newParentId) {
  const oldParent = this.parent;
  this.parent = newParentId;

  if (newParentId) {
    const newParent = await this.model('Category').findById(newParentId);
    if (newParent) {
      this.level = newParent.level + 1;
      this.ancestors = [...newParent.ancestors, newParent._id];
    }
  } else {
    this.level = 0;
    this.ancestors = [];
  }

  await this.save();

  // Update descendants
  const descendants = await this.getDescendants();
  for (const descendant of descendants) {
    if (newParentId) {
      const newParent = await this.model('Category').findById(newParentId);
      if (newParent) {
        descendant.level = newParent.level + 1;
        descendant.ancestors = [...newParent.ancestors, newParent._id];
        await descendant.save();
      }
    } else {
      descendant.level = 0;
      descendant.ancestors = [];
      await descendant.save();
    }
  }

  return this;
};

// Static methods
categorySchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug, isActive: true });
};

categorySchema.statics.findRoots = function () {
  return this.find({ parent: null, isActive: true }).sort({ order: 1 });
};

categorySchema.statics.findByLevel = function (level) {
  return this.find({ level, isActive: true }).sort({ order: 1 });
};

categorySchema.statics.findFeatured = function () {
  return this.find({ isFeatured: true, isActive: true }).sort({ order: 1 });
};

categorySchema.statics.getTree = function () {
  return this.aggregate([
    { $match: { isActive: true } },
    { $sort: { level: 1, order: 1 } },
    {
      $graphLookup: {
        from: 'categories',
        startWith: '$_id',
        connectFromField: '_id',
        connectToField: 'parent',
        as: 'children',
        restrictSearchWithMatch: { isActive: true }
      }
    }
  ]);
};

// Update product count for all categories
categorySchema.statics.updateProductCounts = async function () {
  const Product = mongoose.model('Product');
  const categories = await this.find();

  for (const category of categories) {
    const count = await Product.countDocuments({
      category: category._id,
      status: 'active',
      isApproved: true
    });
    category.productCount = count;
    await category.save();
  }
};

module.exports = mongoose.model('Category', categorySchema);
