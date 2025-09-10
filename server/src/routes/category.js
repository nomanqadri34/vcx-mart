const express = require('express');
const Category = require('../models/Category');
const { auth, requireSeller, authorize } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/v1/categories/main
// @desc    Get main categories (level 0) for sellers
// @access  Private (Seller)
router.get('/main', auth, async (req, res) => {
    try {
        if (req.user.role !== 'seller' && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: { message: 'Access denied' }
            });
        }

        const mainCategories = await Category.find({ 
            level: 0, 
            isActive: true 
        })
        .select('_id name description')
        .sort({ order: 1, name: 1 })
        .lean();

        res.json({
            success: true,
            data: { categories: mainCategories }
        });

    } catch (error) {
        logger.error('Get main categories error:', error.message);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch main categories' }
        });
    }
});

// @route   GET /api/v1/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { level, parent, featured } = req.query;

        const query = { isActive: true };

        if (level !== undefined) {
            query.level = parseInt(level);
        }

        if (parent) {
            query.parent = parent === 'null' ? null : parent;
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        const categories = await Category.find(query)
            .populate('parent', 'name slug')
            .sort({ order: 1, name: 1 })
            .lean();

        res.json({
            success: true,
            data: { categories }
        });

    } catch (error) {
        logger.error('Get categories error:', error.message);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch categories' }
        });
    }
});

// @route   GET /api/v1/categories/tree
// @desc    Get category tree (flat structure with parent relationships)
// @access  Public
router.get('/tree', async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .select('_id name description level parentCategory order image')
            .sort({ level: 1, order: 1, name: 1 })
            .lean();

        res.json({
            success: true,
            data: categories
        });

    } catch (error) {
        logger.error('Get category tree error:', error.message);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch category tree' }
        });
    }
});

// @route   GET /api/v1/categories/:id
// @desc    Get single category
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('parent', 'name slug')
            .lean();

        if (!category) {
            return res.status(404).json({
                success: false,
                error: { message: 'Category not found' }
            });
        }

        res.json({
            success: true,
            data: { category }
        });

    } catch (error) {
        logger.error('Get category error:', error.message);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch category' }
        });
    }
});

// @route   POST /api/v1/categories
// @desc    Create category
// @access  Private (Admin for main categories, Seller for subcategories)
router.post('/', auth, async (req, res) => {
    try {
        const {
            name,
            description,
            parent,
            order,
            isFeatured,
            metaTitle,
            metaDescription,
            commission,
            image
        } = req.body;

        // Check if user is admin or seller
        if (req.user.role !== 'admin' && req.user.role !== 'seller') {
            return res.status(403).json({
                success: false,
                error: { message: 'Access denied. Only admins and sellers can create categories.' }
            });
        }

        // Admin can create main categories (no parent) and subcategories
        // Sellers can only create subcategories (must have parent)
        if (req.user.role === 'seller' && !parent) {
            return res.status(403).json({
                success: false,
                error: { message: 'Sellers can only create subcategories. Please select a main category.' }
            });
        }

        // If parent is provided, verify it exists and is a main category for sellers
        if (parent) {
            const parentCategory = await Category.findById(parent);
            if (!parentCategory) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Parent category not found' }
                });
            }
            
            // Sellers can only create subcategories under main categories (level 0)
            if (req.user.role === 'seller' && parentCategory.level !== 0) {
                return res.status(403).json({
                    success: false,
                    error: { message: 'Sellers can only create subcategories under main categories.' }
                });
            }
        }

        const categoryData = {
            name,
            description,
            parent: parent || null,
            order: order || 0,
            isFeatured: req.user.role === 'admin' ? (isFeatured || false) : false, // Only admins can set featured
            metaTitle,
            metaDescription,
            image: image || null,
            createdBy: req.user._id || req.user.id
        };

        // Only add commission if user is admin and commission is provided
        if (req.user.role === 'admin' && commission) {
            categoryData.commission = commission;
        }

        const category = new Category(categoryData);

        await category.save();

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: { category: category.toObject() }
        });

    } catch (error) {
        logger.error('Create category error:', error.message);

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

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: { message: 'Category with this name already exists' }
            });
        }

        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to create category',
                details: error.message
            }
        });
    }
});

// @route   PUT /api/v1/categories/:id
// @desc    Update category (Admin only)
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const {
            name,
            description,
            parent,
            order,
            isFeatured,
            isActive,
            metaTitle,
            metaDescription,
            commission,
            image
        } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: { message: 'Category not found' }
            });
        }

        // Check permissions
        if (req.user.role !== 'admin' && category.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: { message: 'Access denied. You can only edit categories you created.' }
            });
        }

        // Update fields
        if (name !== undefined) category.name = name;
        if (description !== undefined) category.description = description;
        if (parent !== undefined) category.parent = parent || null;
        if (order !== undefined) category.order = order;
        if (isFeatured !== undefined && req.user.role === 'admin') category.isFeatured = isFeatured;
        if (isActive !== undefined && req.user.role === 'admin') category.isActive = isActive;
        if (metaTitle !== undefined) category.metaTitle = metaTitle;
        if (metaDescription !== undefined) category.metaDescription = metaDescription;
        if (commission !== undefined && req.user.role === 'admin') category.commission = commission;
        if (image !== undefined) category.image = image;

        category.updatedBy = req.user._id;

        await category.save();

        res.json({
            success: true,
            message: 'Category updated successfully',
            data: { category: category.toObject() }
        });

    } catch (error) {
        logger.error('Update category error:', error.message);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to update category' }
        });
    }
});

// @route   DELETE /api/v1/categories/:id
// @desc    Delete category (Admin only)
// @access  Private (Admin)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: { message: 'Category not found' }
            });
        }

        // Check if category has children
        const childrenCount = await Category.countDocuments({ parent: category._id });
        if (childrenCount > 0) {
            return res.status(400).json({
                success: false,
                error: { message: 'Cannot delete category with subcategories' }
            });
        }

        // Check if category has products
        const Product = require('../models/Product');
        const productCount = await Product.countDocuments({ category: category._id });
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                error: { message: 'Cannot delete category with products' }
            });
        }

        await Category.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });

    } catch (error) {
        logger.error('Delete category error:', error.message);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to delete category' }
        });
    }
});

// @route   GET /api/v1/categories/slug/:slug
// @desc    Get category by slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
    try {
        const category = await Category.findBySlug(req.params.slug)
            .populate('parent', 'name slug')
            .lean();

        if (!category) {
            return res.status(404).json({
                success: false,
                error: { message: 'Category not found' }
            });
        }

        res.json({
            success: true,
            data: { category }
        });

    } catch (error) {
        logger.error('Get category by slug error:', error.message);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch category' }
        });
    }
});

module.exports = router;