const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const Coupon = require('../models/Coupon');
const Product = require('../models/Product');
const logger = require('../utils/logger');

const router = express.Router();

// @desc    Create coupon (Admin/Seller)
// @route   POST /api/v1/coupons
// @access  Private (Admin/Seller)
router.post('/', auth, authorize('admin', 'seller'), [
    body('code').isLength({ min: 3, max: 20 }).withMessage('Code must be 3-20 characters'),
    body('description').notEmpty().withMessage('Description is required'),
    body('type').isIn(['percentage', 'fixed', 'shipping']).withMessage('Invalid coupon type'),
    body('value').isNumeric().withMessage('Value must be a number'),
    body('validFrom').isISO8601().withMessage('Valid from date is required'),
    body('validUntil').isISO8601().withMessage('Valid until date is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: { message: 'Validation failed', details: errors.array() }
            });
        }

        const couponData = {
            ...req.body,
            code: req.body.code.toUpperCase(),
            createdBy: req.user.id,
            createdByRole: req.user.role
        };

        const coupon = new Coupon(couponData);
        await coupon.save();

        res.status(201).json({
            success: true,
            data: { coupon }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: { message: 'Coupon code already exists' }
            });
        }
        logger.error('Create coupon error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to create coupon' }
        });
    }
});

// @desc    Get all coupons
// @route   GET /api/v1/coupons
// @access  Private (Admin/Seller)
router.get('/', auth, authorize('admin', 'seller'), async (req, res) => {
    try {
        const filter = req.user.role === 'seller' ? { createdBy: req.user.id } : {};
        const coupons = await Coupon.find(filter)
            .populate('applicableProducts', 'name')
            .populate('applicableCategories', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { coupons }
        });
    } catch (error) {
        logger.error('Get coupons error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch coupons' }
        });
    }
});

// @desc    Validate coupon
// @route   POST /api/v1/coupons/validate
// @access  Private
router.post('/validate', auth, [
    body('code').notEmpty().withMessage('Coupon code is required'),
    body('orderAmount').isNumeric().withMessage('Order amount is required'),
    body('items').isArray().withMessage('Order items are required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: { message: 'Validation failed', details: errors.array() }
            });
        }

        const { code, orderAmount, items } = req.body;
        
        const coupon = await Coupon.findOne({ 
            code: code.toUpperCase(),
            isActive: true 
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                error: { message: 'Invalid coupon code' }
            });
        }

        if (!coupon.isValid()) {
            return res.status(400).json({
                success: false,
                error: { message: 'Coupon has expired or reached usage limit' }
            });
        }

        if (orderAmount < coupon.minimumOrderAmount) {
            return res.status(400).json({
                success: false,
                error: { 
                    message: `Minimum order amount of ₹${coupon.minimumOrderAmount} required` 
                }
            });
        }

        if (!coupon.canApplyToOrder(items)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Coupon not applicable to selected items' }
            });
        }

        let discount = 0;
        if (coupon.type === 'percentage') {
            discount = Math.round(orderAmount * (coupon.value / 100));
            if (coupon.maximumDiscount) {
                discount = Math.min(discount, coupon.maximumDiscount);
            }
        } else if (coupon.type === 'fixed') {
            discount = Math.min(coupon.value, orderAmount);
        }

        res.json({
            success: true,
            data: {
                coupon: {
                    code: coupon.code,
                    description: coupon.description,
                    type: coupon.type,
                    value: coupon.value
                },
                discount,
                finalAmount: Math.max(0, orderAmount - discount)
            }
        });
    } catch (error) {
        logger.error('Validate coupon error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to validate coupon' }
        });
    }
});

// @desc    Update coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private (Admin/Seller)
router.put('/:id', auth, authorize('admin', 'seller'), async (req, res) => {
    try {
        const filter = req.user.role === 'seller' 
            ? { _id: req.params.id, createdBy: req.user.id }
            : { _id: req.params.id };

        const coupon = await Coupon.findOneAndUpdate(
            filter,
            { ...req.body, code: req.body.code?.toUpperCase() },
            { new: true, runValidators: true }
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                error: { message: 'Coupon not found' }
            });
        }

        res.json({
            success: true,
            data: { coupon }
        });
    } catch (error) {
        logger.error('Update coupon error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to update coupon' }
        });
    }
});

// @desc    Delete coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private (Admin/Seller)
router.delete('/:id', auth, authorize('admin', 'seller'), async (req, res) => {
    try {
        const filter = req.user.role === 'seller' 
            ? { _id: req.params.id, createdBy: req.user.id }
            : { _id: req.params.id };

        const coupon = await Coupon.findOneAndDelete(filter);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                error: { message: 'Coupon not found' }
            });
        }

        res.json({
            success: true,
            data: { message: 'Coupon deleted successfully' }
        });
    } catch (error) {
        logger.error('Delete coupon error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to delete coupon' }
        });
    }
});

module.exports = router;