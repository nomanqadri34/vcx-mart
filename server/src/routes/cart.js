const express = require('express');
const { auth } = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const razorpayService = require('../services/razorpayService');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/v1/cart/test
// @desc    Test session functionality
// @access  Private
router.get('/test', auth, (req, res) => {
    try {
        console.log('Session test - User ID:', req.user._id);
        console.log('Session ID:', req.sessionID);
        console.log('Session cart:', req.session.cart);
        console.log('Session data:', req.session);

        res.json({
            success: true,
            data: {
                sessionId: req.sessionID,
                userId: req.user._id,
                cart: req.session.cart || [],
                sessionData: req.session
            }
        });
    } catch (error) {
        console.error('Session test error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Session test failed' }
        });
    }
});

// @route   POST /api/v1/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', auth, async (req, res) => {
    try {
        const { productId, quantity, variants } = req.body;
        const userId = req.user._id;

        console.log('=== ADD TO CART DEBUG ===');
        console.log('Request:', { productId, quantity, variants, userId });
        console.log('Session ID:', req.sessionID);
        console.log('Session before:', JSON.stringify(req.session, null, 2));
        console.log('Session cookie:', req.get('Cookie'));
        console.log('========================');

        // Validate product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: { message: 'Product not found' }
            });
        }

        // Check stock availability
        if (product.totalInventory < quantity) {
            return res.status(400).json({
                success: false,
                error: { message: 'Insufficient stock' }
            });
        }

        // For now, we'll store cart in session/memory
        // In production, you might want to use Redis or database
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Check if item already exists in cart
        const existingItemIndex = req.session.cart.findIndex(item =>
            item.productId === productId &&
            JSON.stringify(item.variants) === JSON.stringify(variants)
        );

        if (existingItemIndex !== -1) {
            // Update quantity
            req.session.cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            const cartItem = {
                productId,
                quantity,
                variants: variants || {},
                price: product.discountedPrice || product.price,
                name: product.name,
                image: product.images?.[0]?.url || '/placeholder-product.jpg',
                seller: product.seller
            };

            console.log('Adding cart item:', cartItem);
            req.session.cart.push(cartItem);
        }

        // Save session explicitly with better error handling
        try {
            await new Promise((resolve, reject) => {
                req.session.save((err) => {
                    if (err) {
                        console.error('Session save error:', err);
                        reject(err);
                    } else {
                        console.log('Session saved successfully');
                        resolve();
                    }
                });
            });
        } catch (saveError) {
            console.error('Failed to save session:', saveError);
            throw saveError;
        }

        console.log('Session saved. Cart now contains:', req.session.cart);
        console.log('Session data after save:', req.session);

        const responseData = {
            success: true,
            data: {
                cart: req.session.cart,
                cartCount: req.session.cart.reduce((total, item) => total + item.quantity, 0),
                cartTotal: req.session.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
            }
        };

        console.log('Sending add to cart response:', responseData);
        res.json(responseData);

    } catch (error) {
        logger.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to add item to cart' }
        });
    }
});

// @route   GET /api/v1/cart
// @desc    Get cart items
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        console.log('=== GET CART DEBUG ===');
        console.log('User ID:', req.user._id);
        console.log('Session ID:', req.sessionID);
        console.log('Full Session:', JSON.stringify(req.session, null, 2));
        console.log('Session cart:', req.session.cart);
        console.log('Session cookie:', req.get('Cookie'));
        console.log('=====================');

        const cart = req.session.cart || [];
        console.log('Cart array from session:', cart);

        // Populate product details
        const populatedCart = await Promise.all(cart.map(async (item) => {
            const product = await Product.findById(item.productId)
                .select('name images price discountedPrice totalInventory sizes colors variants');

            if (!product) {
                return null; // Product no longer exists
            }

            return {
                ...item,
                product: {
                    _id: product._id,
                    name: product.name,
                    images: product.images,
                    price: product.discountedPrice || product.price,
                    totalInventory: product.totalInventory,
                    sizes: product.sizes,
                    colors: product.colors,
                    variants: product.variants
                }
            };
        }));

        // Filter out null items (deleted products)
        const validCart = populatedCart.filter(item => item !== null);
        console.log('Valid cart items after population:', validCart.length);

        // Update session cart with valid items only
        req.session.cart = validCart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            variants: item.variants,
            price: item.price,
            name: item.name,
            image: item.image,
            seller: item.seller
        }));

        // Save updated session
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error in GET cart:', err);
                    reject(err);
                } else {
                    console.log('Session updated and saved in GET cart');
                    resolve();
                }
            });
        });

        const cartTotal = validCart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const cartCount = validCart.reduce((total, item) => total + item.quantity, 0);

        const responseData = {
            success: true,
            data: {
                cart: validCart,
                cartTotal,
                cartCount
            }
        };

        console.log('Sending cart response with', validCart.length, 'items');
        console.log('Cart items in response:', JSON.stringify(validCart, null, 2));
        res.json(responseData);

    } catch (error) {
        console.error('Get cart error:', error);
        logger.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to get cart' }
        });
    }
});

// @route   PUT /api/v1/cart/update
// @desc    Update cart item quantity
// @access  Private
router.put('/update', auth, async (req, res) => {
    try {
        const { productId, quantity, variants } = req.body;
        const userId = req.user._id;

        if (!req.session.cart) {
            return res.status(404).json({
                success: false,
                error: { message: 'Cart is empty' }
            });
        }

        const itemIndex = req.session.cart.findIndex(item =>
            item.productId === productId &&
            JSON.stringify(item.variants) === JSON.stringify(variants)
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                error: { message: 'Item not found in cart' }
            });
        }

        if (quantity <= 0) {
            // Remove item
            req.session.cart.splice(itemIndex, 1);
        } else {
            // Update quantity
            req.session.cart[itemIndex].quantity = quantity;
        }

        await req.session.save();

        res.json({
            success: true,
            data: {
                cart: req.session.cart,
                cartCount: req.session.cart.reduce((total, item) => total + item.quantity, 0)
            }
        });

    } catch (error) {
        logger.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to update cart' }
        });
    }
});

// @route   DELETE /api/v1/cart/remove
// @desc    Remove item from cart
// @access  Private
router.delete('/remove', auth, async (req, res) => {
    try {
        const { productId, variants } = req.body;
        const userId = req.user._id;

        if (!req.session.cart) {
            return res.status(404).json({
                success: false,
                error: { message: 'Cart is empty' }
            });
        }

        const itemIndex = req.session.cart.findIndex(item =>
            item.productId === productId &&
            JSON.stringify(item.variants) === JSON.stringify(variants)
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                error: { message: 'Item not found in cart' }
            });
        }

        req.session.cart.splice(itemIndex, 1);
        await req.session.save();

        res.json({
            success: true,
            data: {
                cart: req.session.cart,
                cartCount: req.session.cart.reduce((total, item) => total + item.quantity, 0)
            }
        });

    } catch (error) {
        logger.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to remove item from cart' }
        });
    }
});

// @route   GET /api/v1/cart/checkout
// @desc    Redirect improper GET requests
// @access  Public
router.get('/checkout', (req, res) => {
    res.status(405).json({
        success: false,
        error: {
            message: 'Method Not Allowed. Use POST to initiate checkout.',
            method: req.method,
            expectedMethod: 'POST'
        }
    });
});

// @route   POST /api/v1/cart/checkout
// @desc    Initiate checkout with Razorpay
// @access  Private
router.post('/checkout', auth, async (req, res) => {
    try {
        const { shippingAddress, billingAddress, order: orderData } = req.body;
        const userId = req.user._id;

        // Get cart items from session or request body
        console.log('=== CHECKOUT DEBUG ===');
        console.log('Session cart:', req.session.cart);
        console.log('Request orderData:', orderData);
        console.log('Request body:', req.body);
        
        let cartItems = req.session.cart || [];
        if (orderData && orderData.items && orderData.items.length > 0) {
            cartItems = orderData.items;
            console.log('Using cart items from request body:', cartItems);
        } else {
            console.log('Using cart items from session:', cartItems);
        }

        if (!cartItems || cartItems.length === 0) {
            console.log('ERROR: Cart is empty - cartItems:', cartItems);
            return res.status(400).json({
                success: false,
                error: { message: 'Cart is empty' }
            });
        }
        
        console.log('Cart items found:', cartItems.length, 'items');
        console.log('=====================');

        // Validate cart items and calculate totals
        let subtotal = 0;
        const orderItems = [];
        const sellers = new Set();

        for (const item of cartItems) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({
                    success: false,
                    error: { message: `Product ${item.productId} not found` }
                });
            }

            if (product.totalInventory < item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: { message: `Insufficient stock for ${product.name}` }
                });
            }

            const itemPrice = product.discountedPrice || product.price;
            const itemSubtotal = itemPrice * item.quantity;
            subtotal += itemSubtotal;
            sellers.add(product.seller.toString());

            orderItems.push({
                product: product._id,
                seller: product.seller,
                name: product.name,
                image: product.images?.[0]?.url || '/placeholder-product.jpg',
                price: itemPrice,
                quantity: item.quantity,
                variants: item.variants,
                subtotal: itemSubtotal
            });
        }

        // Calculate tax
        const tax = Math.round(subtotal * 0.18); // 18% GST
        const total = subtotal + tax;

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create order
        const order = new Order({
            orderNumber,
            customer: userId,
            items: orderItems,
            subtotal,
            shippingCost: 0,
            tax,
            discount: 0,
            total,
            shippingAddress: {
                name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                phone: shippingAddress.phone,
                email: shippingAddress.email,
                addressLine1: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                pincode: shippingAddress.pincode,
                country: shippingAddress.country || 'India'
            },
            billingAddress: billingAddress ? {
                name: `${billingAddress.firstName} ${billingAddress.lastName}`,
                phone: billingAddress.phone,
                email: billingAddress.email,
                addressLine1: billingAddress.address,
                city: billingAddress.city,
                state: billingAddress.state,
                pincode: billingAddress.pincode,
                country: billingAddress.country || 'India'
            } : undefined,
            paymentMethod: 'razorpay',
            paymentStatus: 'pending',
            status: 'pending'
        });

        await order.save();

        // Prepare data for Razorpay
        const razorpayOrderData = {
            orderNumber: order.orderNumber,
            total: total,
            userId: userId.toString(),
            customer: {
                firstName: req.user.firstName || req.user.name?.split(' ')[0] || 'Customer',
                lastName: req.user.lastName || req.user.name?.split(' ').slice(1).join(' ') || '',
                email: req.user.email,
                phone: shippingAddress.phone
            },
            billingAddress: {
                firstName: billingAddress?.firstName || shippingAddress.firstName,
                lastName: billingAddress?.lastName || shippingAddress.lastName,
                email: billingAddress?.email || shippingAddress.email,
                phone: billingAddress?.phone || shippingAddress.phone,
                address: billingAddress?.address || shippingAddress.address,
                city: billingAddress?.city || shippingAddress.city,
                state: billingAddress?.state || shippingAddress.state,
                pincode: billingAddress?.pincode || shippingAddress.pincode,
                country: billingAddress?.country || shippingAddress.country || 'IN'
            },
            shippingAddress: {
                firstName: shippingAddress.firstName,
                lastName: shippingAddress.lastName,
                email: shippingAddress.email,
                phone: shippingAddress.phone,
                address: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                pincode: shippingAddress.pincode,
                country: shippingAddress.country || 'IN'
            },
            items: orderItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                sku: item.product.toString()
            }))
        };

        // Create Razorpay order
        const razorpayResponse = await razorpayService.createOrder(razorpayOrderData);

        if (!razorpayResponse.success) {
            // If Razorpay fails, update order status
            await order.updatePaymentStatus('failed', {
                failureReason: razorpayResponse.error
            });

            return res.status(400).json({
                success: false,
                error: { message: razorpayResponse.error }
            });
        }

        // Update order with Razorpay details
        order.paymentDetails = {
            transactionId: razorpayResponse.data.orderId,
            paymentId: razorpayResponse.data.orderId,
            gatewayResponse: razorpayResponse.data
        };
        await order.save();

        // Clear cart after successful order creation
        req.session.cart = [];
        await req.session.save();

        res.json({
            success: true,
            data: {
                order: order.toObject(),
                razorpayOrder: razorpayResponse.data,
                // Return data needed for Razorpay frontend integration
                razorpayKeyId: razorpayResponse.data.keyId,
                razorpayOrderId: razorpayResponse.data.orderId,
                amount: razorpayResponse.data.amount,
                currency: razorpayResponse.data.currency,
                customerInfo: razorpayResponse.data.customerInfo,
                testMode: razorpayResponse.data.testMode
            }
        });

    } catch (error) {
        logger.error('Checkout error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to process checkout' }
        });
    }
});

// @route   POST /api/v1/cart/clear
// @desc    Clear cart
// @access  Private
router.post('/clear', auth, async (req, res) => {
    try {
        req.session.cart = [];
        await req.session.save();

        res.json({
            success: true,
            data: { message: 'Cart cleared successfully' }
        });

    } catch (error) {
        logger.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to clear cart' }
        });
    }
});

module.exports = router;
