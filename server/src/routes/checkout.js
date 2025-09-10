const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const logger = require('../utils/logger');

const router = express.Router();

// @desc    Validate checkout data
// @route   POST /api/v1/checkout/validate
// @access  Private
router.post('/validate', auth, [
    body('items').isArray().withMessage('Items must be an array'),
    body('items.*.product').isMongoId().withMessage('Invalid product ID'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingAddress.firstName').notEmpty().withMessage('First name is required'),
    body('shippingAddress.lastName').notEmpty().withMessage('Last name is required'),
    body('shippingAddress.email').isEmail().withMessage('Valid email is required'),
    body('shippingAddress.phone').notEmpty().withMessage('Phone is required'),
    body('shippingAddress.address').notEmpty().withMessage('Address is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.state').notEmpty().withMessage('State is required'),
    body('shippingAddress.pincode').notEmpty().withMessage('Pincode is required'),
], async (req, res) => {
    try {
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

        const { items, shippingAddress, couponCode } = req.body;

        // Validate products and calculate pricing
        const validatedItems = [];
        let subtotal = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: `Product not found: ${item.product}`
                    }
                });
            }

            if (!product.isApproved || product.status !== 'active') {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: `Product not available: ${product.name}`
                    }
                });
            }

            // Check stock availability
            const totalStock = product.sizes?.reduce((sum, size) => sum + size.stock, 0) || 0;
            if (totalStock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: `Insufficient stock for ${product.name}. Available: ${totalStock}, Requested: ${item.quantity}`
                    }
                });
            }

            const price = product.discountedPrice || product.price;
            const itemSubtotal = price * item.quantity;
            subtotal += itemSubtotal;

            validatedItems.push({
                product: product._id,
                name: product.name,
                price,
                quantity: item.quantity,
                variants: item.variants || {},
                subtotal: itemSubtotal,
                image: product.images?.[0]?.url || null
            });
        }

        // Calculate shipping
        const shippingCost = subtotal >= 500 ? 0 : 50;

        // Calculate tax (18% GST)
        const tax = Math.round(subtotal * 0.18);

        // Apply coupon discount
        let discount = 0;
        let appliedCoupon = null;

        if (couponCode) {
            const validCoupons = {
                'WELCOME10': { discount: 10, type: 'percentage', description: '10% off on first order' },
                'SAVE50': { discount: 50, type: 'fixed', description: '₹50 off on orders above ₹500' },
                'FREESHIP': { discount: 0, type: 'shipping', description: 'Free shipping' }
            };

            const coupon = validCoupons[couponCode.toUpperCase()];
            if (coupon) {
                appliedCoupon = { code: couponCode.toUpperCase(), ...coupon };

                if (coupon.type === 'percentage') {
                    discount = Math.round(subtotal * (coupon.discount / 100));
                } else if (coupon.type === 'fixed') {
                    discount = Math.min(coupon.discount, subtotal);
                }
            }
        }

        // Calculate final shipping cost
        const finalShipping = appliedCoupon?.type === 'shipping' ? 0 : shippingCost;

        // Calculate total
        const total = Math.max(0, subtotal + finalShipping + tax - discount);

        const orderData = {
            items: validatedItems,
            pricing: {
                subtotal,
                shippingCost: finalShipping,
                tax,
                discount,
                total
            },
            shippingAddress,
            appliedCoupon
        };

        res.json({
            success: true,
            data: orderData
        });

    } catch (error) {
        logger.error('Checkout validation error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to validate checkout data',
                details: error.message
            }
        });
    }
});

// @desc    Create order
// @route   POST /api/v1/checkout/create-order
// @access  Private
router.post('/create-order', auth, [
    body('items').isArray().withMessage('Items must be an array'),
    body('paymentMethod').isIn(['cod', 'gokwik']).withMessage('Invalid payment method'),
    body('shippingAddress.firstName').notEmpty().withMessage('First name is required'),
    body('shippingAddress.lastName').notEmpty().withMessage('Last name is required'),
    body('shippingAddress.email').isEmail().withMessage('Valid email is required'),
], async (req, res) => {
    try {
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

        const { items, shippingAddress, billingAddress, paymentMethod, couponCode } = req.body;

        // Re-validate items and calculate pricing
        const validatedItems = [];
        let subtotal = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: `Product not found: ${item.product}`
                    }
                });
            }

            const price = product.discountedPrice || product.price;
            const itemSubtotal = price * item.quantity;
            subtotal += itemSubtotal;

            validatedItems.push({
                product: product._id,
                name: product.name,
                price,
                quantity: item.quantity,
                variants: item.variants || {},
                subtotal: itemSubtotal
            });
        }

        // Calculate final pricing
        const shippingCost = subtotal >= 500 ? 0 : 50;
        const tax = Math.round(subtotal * 0.18);
        let discount = 0;

        if (couponCode) {
            const validCoupons = {
                'WELCOME10': { discount: 10, type: 'percentage' },
                'SAVE50': { discount: 50, type: 'fixed' },
                'FREESHIP': { discount: 0, type: 'shipping' }
            };

            const coupon = validCoupons[couponCode.toUpperCase()];
            if (coupon) {
                if (coupon.type === 'percentage') {
                    discount = Math.round(subtotal * (coupon.discount / 100));
                } else if (coupon.type === 'fixed') {
                    discount = Math.min(coupon.discount, subtotal);
                }
            }
        }

        const finalShipping = couponCode?.toUpperCase() === 'FREESHIP' ? 0 : shippingCost;
        const total = Math.max(0, subtotal + finalShipping + tax - discount);

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create order
        const order = new Order({
            orderNumber,
            user: req.user.id,
            items: validatedItems,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            paymentMethod,
            pricing: {
                subtotal,
                shippingCost: finalShipping,
                tax,
                discount,
                total
            },
            couponCode,
            status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
        });

        await order.save();

        let paymentUrl = null;
        let paymentRequired = false;

        if (paymentMethod === 'gokwik') {
            // TODO: Integrate with GoKwik payment gateway
            paymentRequired = true;
            paymentUrl = `/payment/gokwik/${order._id}`;
        }

        res.json({
            success: true,
            data: {
                order: {
                    _id: order._id,
                    orderNumber: order.orderNumber,
                    total: order.pricing.total
                },
                paymentRequired,
                paymentUrl
            }
        });

    } catch (error) {
        logger.error('Create order error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to create order',
                details: error.message
            }
        });
    }
});

module.exports = router;