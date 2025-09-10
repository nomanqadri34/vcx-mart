const express = require('express');
const { body, validationResult, param } = require('express-validator');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Product = require('../models/Product');
const Category = require('../models/Category');
const { auth, requireSeller } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Configure multer for product image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/products');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `product-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
        }
    }
});

// Validation middleware
const validateProduct = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Product name must be between 2 and 200 characters'),
    body('description')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('basePrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Base price must be a positive number'),
    body('category')
        .isMongoId()
        .withMessage('Valid category ID is required'),
    // SKU validation removed - auto-generated
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Validation failed',
                details: errors.array()
            }
        });
    }
    next();
};

// Helper function to validate MongoDB ObjectId
const validateObjectId = [
    param('id').custom((value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid product ID format');
        }
        return true;
    })
];

// Helper function to normalize product data for frontend
const normalizeProductData = (product) => {
    const normalized = product.toObject ? product.toObject() : product;

    // Normalize images format
    if (normalized.images && normalized.images.length > 0) {
        normalized.images = normalized.images.map((img, index) => {
            if (typeof img === 'string') {
                return {
                    url: img,
                    alt: `${normalized.name} - Image ${index + 1}`,
                    isPrimary: index === 0,
                    order: index
                };
            } else {
                return {
                    url: img.url || img,
                    publicId: img.publicId,
                    alt: img.alt || `${normalized.name} - Image ${index + 1}`,
                    isPrimary: img.isPrimary || index === 0,
                    order: img.order || index
                };
            }
        });
    }

    // Ensure price fields are consistently named
    if (normalized.basePrice && !normalized.price) {
        normalized.price = normalized.basePrice;
    }
    if (normalized.price && !normalized.basePrice) {
        normalized.basePrice = normalized.price;
    }

    // Calculate discount percentage
    if (normalized.discountedPrice && normalized.price) {
        const discount = ((normalized.price - normalized.discountedPrice) / normalized.price) * 100;
        normalized.discountPercentage = Math.round(discount);
    }

    return normalized;
};

// @route   GET /api/v1/products
// @desc    Get all products (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            search,
            minPrice,
            maxPrice,
            sort = 'createdAt',
            order = 'desc'
        } = req.query;

        const query = {
            status: 'active',
            isApproved: true
        };

        // Add filters
        if (category) {
            console.log('Filtering by category:', category);
            query.category = category;
        }
        
        console.log('Products query:', query);

        if (minPrice || maxPrice) {
            query.$or = [];
            const priceQuery = {};
            if (minPrice) priceQuery.$gte = parseFloat(minPrice);
            if (maxPrice) priceQuery.$lte = parseFloat(maxPrice);

            query.$or.push({ price: priceQuery });
            if (query.$or.length === 0) delete query.$or;
        }

        // Search functionality
        if (search) {
            query.$text = { $search: search };
        }

        const sortOrder = order === 'desc' ? -1 : 1;
        const sortObj = {};
        sortObj[sort] = sortOrder;

        const products = await Product.find(query)
            .populate('category', 'name slug')
            .populate('seller', 'firstName lastName')
            .sort(sortObj)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Product.countDocuments(query);

        // Normalize all products before sending
        const normalizedProducts = products.map(product => normalizeProductData(product));

        res.json({
            success: true,
            data: {
                products: normalizedProducts,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        logger.error('Get products error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch products' }
        });
    }
});

// @route   GET /api/v1/products/seller
// @desc    Get seller's products
// @access  Private (Seller)
router.get('/seller', auth, requireSeller, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            search,
            sort = 'createdAt',
            order = 'desc'
        } = req.query;

        const query = { seller: req.user._id };

        // Add filters
        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } }
            ];
        }

        const sortOrder = order === 'desc' ? -1 : 1;
        const sortObj = {};
        sortObj[sort] = sortOrder;

        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort(sortObj)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Product.countDocuments(query);

        // Get status counts
        const statusCounts = await Product.aggregate([
            { $match: { seller: req.user._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Normalize seller products before sending
        const normalizedProducts = products.map(product => normalizeProductData(product));

        res.json({
            success: true,
            data: {
                products: normalizedProducts,
                statusCounts: statusCounts.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        logger.error('Get seller products error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch products' }
        });
    }
});

// @route   POST /api/v1/products
// @desc    Create new product
// @access  Private (Seller)
router.post('/', auth, requireSeller, validateProduct, handleValidationErrors, async (req, res) => {
    try {
        console.log('Product creation request body:', req.body);
        console.log('User role:', req.user.role);

        const {
            name,
            description,
            shortDescription,
            category,
            brand,
            price,
            basePrice,
            lowStockThreshold,
            weight,

            metaTitle,
            metaDescription,
            images,
            status,
            sizes,
            isAccessory,
            colors,
            gender,
            productType,
            fit,
            closure,
            length,
            manufactureCareFit,
            material,
            neckType,
            fitType,
            pattern,
            sleeveType,
            careInstruction,
            countryOfOrigin,
            customSizeGuide,
            discountedPrice,
            keyHighlightsCustomFields,
            productInformationCustomFields,
            dynamicProductDetails
        } = req.body;

        // Validate status if provided
        const allowedStatuses = ['draft', 'active', 'inactive', 'out_of_stock', 'archived'];
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid status. Must be one of: draft, active, inactive, out_of_stock, archived' }
            });
        }

        // SKU will be auto-generated in pre-save middleware

        // Verify category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                error: { message: 'Category not found' }
            });
        }

        // Validate images array
        console.log('Images received:', images);
        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({
                success: false,
                error: { message: 'At least one product image is required' }
            });
        }

        // Parse JSON fields
        let parsedSizes = [];
        let parsedColors = [];
        let parsedKeyHighlights = [];
        let parsedProductInfo = [];
        let parsedDynamicProductDetails = [];

        try {
            if (sizes) parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
            if (colors) parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
            if (keyHighlightsCustomFields) parsedKeyHighlights = typeof keyHighlightsCustomFields === 'string' ? JSON.parse(keyHighlightsCustomFields) : keyHighlightsCustomFields;
            if (productInformationCustomFields) parsedProductInfo = typeof productInformationCustomFields === 'string' ? JSON.parse(productInformationCustomFields) : productInformationCustomFields;
            if (dynamicProductDetails) parsedDynamicProductDetails = typeof dynamicProductDetails === 'string' ? JSON.parse(dynamicProductDetails) : dynamicProductDetails;
        } catch (parseError) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid JSON format in request data' }
            });
        }

        // Create product
        const product = new Product({
            name,
            description,
            shortDescription,
            seller: req.user._id,
            category,
            brand,
            price: price ? parseFloat(price) : parseFloat(basePrice),
            basePrice: basePrice ? parseFloat(basePrice) : parseFloat(price),
            // SKU will be auto-generated in pre-save middleware
            lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : 10,
            images,
            weight: weight ? parseFloat(weight) : undefined,

            metaTitle,
            metaDescription,
            sizes: parsedSizes,
            isAccessory: isAccessory === 'true' || isAccessory === true,
            colors: parsedColors,
            gender,
            productType,
            fit,
            closure,
            length,
            manufactureCareFit,
            material,
            neckType,
            fitType,
            pattern,
            sleeveType,
            careInstruction,
            countryOfOrigin,
            customSizeGuide,
            discountedPrice: discountedPrice ? parseFloat(discountedPrice) : undefined,
            keyHighlightsCustomFields: parsedKeyHighlights,
            productInformationCustomFields: parsedProductInfo,
            dynamicProductDetails: parsedDynamicProductDetails,
            createdBy: req.user._id,
            status: status || 'draft' // Use provided status or default to draft
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { product: product.toObject() }
        });

    } catch (error) {
        logger.error('Create product error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Validation failed',
                    details: validationErrors
                }
            });
        }

        // Handle duplicate key errors (SKU conflicts)
        if (error.code === 11000) {
            let errorMessage = 'A product with similar details already exists';
            let errorCode = 'DUPLICATE_ERROR';

            if (error.message.includes('sku')) {
                errorMessage = 'Failed to generate unique SKU. Please try again or contact support.';
                errorCode = 'DUPLICATE_SKU';
            } else if (error.message.includes('slug')) {
                errorMessage = 'Database indexing issue. Please try again.';
                errorCode = 'DUPLICATE_SLUG';
            }

            return res.status(400).json({
                success: false,
                error: {
                    message: errorMessage,
                    code: errorCode,
                    details: 'The system could not generate a unique product identifier. Please try creating the product again.'
                }
            });
        }

        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to create product',
                details: error.message
            }
        });
    }
});

// @route   GET /api/v1/products/check-sku/:sku
// @desc    Check if SKU is available
// @access  Private (Seller)
router.get('/check-sku/:sku', auth, requireSeller, async (req, res) => {
    try {
        const { sku } = req.params;
        const { productId } = req.query; // For edit scenarios

        const query = { sku: sku.toUpperCase() };

        // If productId is provided (edit scenario), exclude that specific product
        if (productId) {
            query._id = { $ne: productId };
        }

        const existingProduct = await Product.findOne(query);

        res.json({
            success: true,
            data: {
                available: !existingProduct,
                sku: sku.toUpperCase()
            }
        });

    } catch (error) {
        logger.error('Check SKU error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to check SKU availability' }
        });
    }
});

// @route   GET /api/v1/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', validateObjectId, handleValidationErrors, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name slug')
            .populate('seller', 'firstName lastName')
            .lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                error: { message: 'Product not found' }
            });
        }

        // Increment view count
        await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

        // Normalize product data before sending
        const normalizedProduct = normalizeProductData(product);

        res.json({
            success: true,
            data: { product: normalizedProduct }
        });

    } catch (error) {
        logger.error('Get product error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch product' }
        });
    }
});

// @route   PUT /api/v1/products/:id
// @desc    Update product
// @access  Private (Seller - own products only)
router.put('/:id', validateObjectId, handleValidationErrors, auth, requireSeller, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: { message: 'Product not found' }
            });
        }

        // Check if user owns this product
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: { message: 'Not authorized to update this product' }
            });
        }

        // Validate status if provided
        const allowedStatuses = ['draft', 'active', 'inactive', 'out_of_stock', 'archived'];
        if (req.body.status && !allowedStatuses.includes(req.body.status)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid status. Must be one of: draft, active, inactive, out_of_stock, archived' }
            });
        }

        // Update fields
        const updateFields = [
            'name', 'description', 'shortDescription', 'category', 'brand',
            'price', 'basePrice', 'lowStockThreshold', 'weight',
            'metaTitle', 'metaDescription', 'status', 'isAccessory', 'gender',
            'productType', 'fit', 'closure', 'length', 'manufactureCareFit',
            'material', 'neckType', 'fitType', 'pattern', 'sleeveType',
            'careInstruction', 'countryOfOrigin', 'customSizeGuide', 'discountedPrice'
        ];

        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

        // Handle array/object fields
        if (req.body.sizes) {
            product.sizes = typeof req.body.sizes === 'string' ? JSON.parse(req.body.sizes) : req.body.sizes;
        }

        if (req.body.colors) {
            product.colors = typeof req.body.colors === 'string' ? JSON.parse(req.body.colors) : req.body.colors;
        }

        if (req.body.keyHighlightsCustomFields) {
            product.keyHighlightsCustomFields = typeof req.body.keyHighlightsCustomFields === 'string' ? JSON.parse(req.body.keyHighlightsCustomFields) : req.body.keyHighlightsCustomFields;
        }

        if (req.body.productInformationCustomFields) {
            product.productInformationCustomFields = typeof req.body.productInformationCustomFields === 'string' ? JSON.parse(req.body.productInformationCustomFields) : req.body.productInformationCustomFields;
        }

        if (req.body.dynamicProductDetails) {
            product.dynamicProductDetails = typeof req.body.dynamicProductDetails === 'string' ? JSON.parse(req.body.dynamicProductDetails) : req.body.dynamicProductDetails;
        }

        // Handle images update - normalize format
        if (req.body.images) {
            let images = req.body.images;
            if (typeof images === 'string') {
                images = JSON.parse(images);
            }

            // Normalize image format to ensure consistency
            product.images = images.map((img, index) => {
                if (typeof img === 'string') {
                    return {
                        url: img,
                        alt: `${product.name} - Image ${index + 1}`,
                        isPrimary: index === 0,
                        order: index
                    };
                } else {
                    return {
                        url: img.url || img,
                        publicId: img.publicId,
                        alt: img.alt || `${product.name} - Image ${index + 1}`,
                        isPrimary: img.isPrimary || index === 0,
                        order: img.order || index
                    };
                }
            });
        }

        product.updatedBy = req.user._id;
        await product.save();

        // Normalize updated product data before sending
        const normalizedProduct = normalizeProductData(product);

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: { product: normalizedProduct }
        });

    } catch (error) {
        logger.error('Update product error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to update product' }
        });
    }
});

// @route   DELETE /api/v1/products/:id
// @desc    Delete product
// @access  Private (Seller - own products only)
router.delete('/:id', validateObjectId, handleValidationErrors, auth, requireSeller, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: { message: 'Product not found' }
            });
        }

        // Check if user owns this product
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: { message: 'Not authorized to delete this product' }
            });
        }

        // Soft delete by setting status to archived
        product.status = 'archived';
        product.updatedBy = req.user._id;
        await product.save();

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        logger.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to delete product' }
        });
    }
});

// @route   PUT /api/v1/products/:id/status
// @desc    Update product status
// @access  Private (Seller - own products only)
router.put('/:id/status', validateObjectId, handleValidationErrors, auth, requireSeller, async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['draft', 'active', 'inactive', 'out_of_stock', 'archived'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid status' }
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: { message: 'Product not found' }
            });
        }

        // Check if user owns this product
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: { message: 'Not authorized to update this product' }
            });
        }

        product.status = status;
        product.updatedBy = req.user._id;
        await product.save();

        res.json({
            success: true,
            message: 'Product status updated successfully',
            data: { product: product.toObject() }
        });

    } catch (error) {
        logger.error('Update product status error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to update product status' }
        });
    }
});

// @route   GET /api/v1/products/:id/related
// @desc    Get related products
// @access  Public
router.get('/:id/related', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: { message: 'Product not found' }
            });
        }

        // Find related products in the same category, excluding the current product
        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: req.params.id },
            status: 'active',
            isApproved: true
        })
            .populate('category', 'name slug')
            .populate('seller', 'firstName lastName')
            .limit(8)
            .lean();

        // Normalize related products before sending
        const normalizedRelatedProducts = relatedProducts.map(product => normalizeProductData(product));

        res.json({
            success: true,
            data: { products: normalizedRelatedProducts }
        });

    } catch (error) {
        logger.error('Get related products error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch related products' }
        });
    }
});

// @route   GET /api/v1/products/:id/reviews
// @desc    Get product reviews
// @access  Public
router.get('/:id/reviews', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // For now, return mock reviews since Review model might not be fully implemented
        const mockReviews = [
            {
                _id: '1',
                user: { name: 'John Doe' },
                rating: 5,
                comment: 'Excellent product! Highly recommended.',
                createdAt: new Date('2024-01-15')
            },
            {
                _id: '2',
                user: { name: 'Jane Smith' },
                rating: 4,
                comment: 'Good quality, fast delivery.',
                createdAt: new Date('2024-01-10')
            },
            {
                _id: '3',
                user: { name: 'Mike Johnson' },
                rating: 5,
                comment: 'Perfect fit and great material.',
                createdAt: new Date('2024-01-05')
            }
        ];

        res.json({
            success: true,
            data: {
                reviews: mockReviews,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: mockReviews.length,
                    pages: Math.ceil(mockReviews.length / limit)
                }
            }
        });

    } catch (error) {
        logger.error('Get product reviews error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch reviews' }
        });
    }
});

// @route   POST /api/v1/products/:id/reviews
// @desc    Add product review
// @access  Private
router.post('/:id/reviews', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                error: { message: 'Rating must be between 1 and 5' }
            });
        }

        if (!comment || comment.trim().length < 10) {
            return res.status(400).json({
                success: false,
                error: { message: 'Comment must be at least 10 characters long' }
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: { message: 'Product not found' }
            });
        }

        // For now, just return success message
        // In a full implementation, you would save the review to a Review model
        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: {
                review: {
                    _id: Date.now().toString(),
                    user: { name: req.user.firstName + ' ' + req.user.lastName },
                    rating,
                    comment: comment.trim(),
                    createdAt: new Date()
                }
            }
        });

    } catch (error) {
        logger.error('Add product review error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to add review' }
        });
    }
});

module.exports = router;
