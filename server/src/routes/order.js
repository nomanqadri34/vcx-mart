const express = require('express');
const { auth, requireSeller, requireAdmin } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');

const router = express.Router();

// Get user's recent orders
router.get('/user/recent', auth, async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const userId = req.user._id;

        const orders = await Order.find({ customer: userId })
            .populate('seller', 'businessName firstName lastName')
            .populate('items.product', 'name images')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        // Transform data for frontend
        const transformedOrders = orders.map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber,
            createdAt: order.createdAt,
            status: order.status,
            totalAmount: order.totalAmount,
            items: order.items,
            itemCount: order.items?.length || 0,
            seller: {
                businessName: order.seller?.businessName || `${order.seller?.firstName} ${order.seller?.lastName}` || 'Unknown Seller'
            }
        }));

        res.json({
            success: true,
            data: transformedOrders
        });
    } catch (error) {
        console.error('Error fetching user recent orders:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch recent orders' }
        });
    }
});

// Get all user orders with pagination
router.get('/user', auth, async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const userId = req.user._id;

        const query = { customer: userId };
        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .populate('seller', 'businessName firstName lastName')
            .populate('items.product', 'name images price')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const totalOrders = await Order.countDocuments(query);

        // Transform orders for frontend
        const transformedOrders = orders.map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber,
            createdAt: order.createdAt,
            status: order.status,
            total: order.total,
            items: order.items.map(item => ({
                _id: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.subtotal,
                image: item.image || item.product?.images?.[0]?.url || item.product?.images?.[0],
                product: {
                    _id: item.product?._id,
                    name: item.product?.name
                },
                variants: item.variants
            })),
            shipping: order.shipping,
            shippingAddress: order.shippingAddress
        }));

        res.json({
            success: true,
            data: {
                orders: transformedOrders,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalOrders / parseInt(limit)),
                    totalOrders,
                    hasNext: page * limit < totalOrders,
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch orders' }
        });
    }
});

// Get single order details
router.get('/:orderId', auth, async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        const order = await Order.findOne({
            _id: orderId,
            customer: userId
        })
            .populate({
                path: 'customer',
                select: 'firstName lastName email phone'
            })
            .populate({
                path: 'items.product',
                select: 'name images price description'
            })
            .populate({
                path: 'items.seller',
                select: 'businessName firstName lastName email phone'
            })
            .populate('shippingAddress')
            .populate('billingAddress');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: { message: 'Order not found' }
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch order details' }
        });
    }
});

// Create new order
router.post('/', auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const { items, shippingAddress, billingAddress, paymentMethod } = req.body;

        // Validate items and calculate total
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({
                    success: false,
                    error: { message: `Product ${item.productId} not found` }
                });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: { message: `Insufficient stock for ${product.name}` }
                });
            }

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
                total: itemTotal
            });

            // Update product quantity
            product.quantity -= item.quantity;
            await product.save();
        }

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const order = new Order({
            orderNumber,
            customer: userId,
            seller: orderItems[0].product.seller, // Assuming single seller for now
            items: orderItems,
            totalAmount,
            shippingAddress,
            billingAddress,
            paymentMethod,
            status: 'pending'
        });

        await order.save();

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to create order' }
        });
    }
});

// Cancel order
router.put('/:orderId/cancel', auth, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body;
        const userId = req.user._id;

        const order = await Order.findOne({
            _id: orderId,
            customer: userId
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                error: { message: 'Order not found' }
            });
        }

        if (!['pending', 'processing'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Order cannot be cancelled at this stage' }
            });
        }

        order.status = 'cancelled';
        order.cancellationReason = reason;
        order.cancelledAt = new Date();

        // Restore product quantities
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { quantity: item.quantity } }
            );
        }

        await order.save();

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to cancel order' }
        });
    }
});

// ============= SELLER ORDER ROUTES =============

// Get seller's orders with pagination and filters
router.get('/seller', auth, requireSeller, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            search,
            startDate,
            endDate,
            sort = 'createdAt',
            order = 'desc'
        } = req.query;

        const sellerId = req.user._id;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build query
        const query = { seller: sellerId };

        // Add status filter
        if (status && status !== 'all') {
            query.status = status;
        }

        // Add date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Add search filter (by order number or customer info)
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'customer.firstName': { $regex: search, $options: 'i' } },
                { 'customer.lastName': { $regex: search, $options: 'i' } },
                { 'customer.email': { $regex: search, $options: 'i' } }
            ];
        }

        // Sort configuration
        const sortOrder = order === 'desc' ? -1 : 1;
        const sortObj = { [sort]: sortOrder };

        // Get orders with pagination
        const [orders, total] = await Promise.all([
            Order.find(query)
                .populate('customer', 'firstName lastName email phone')
                .populate('items.product', 'name images price')
                .sort(sortObj)
                .skip(skip)
                .limit(parseInt(limit)),
            Order.countDocuments(query)
        ]);

        // Calculate status counts for filters
        const statusCounts = await Order.aggregate([
            { $match: { seller: sellerId } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const statusCountsObj = statusCounts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        // Transform orders for frontend
        const transformedOrders = orders.map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber,
            customer: {
                name: `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim(),
                email: order.customer?.email,
                phone: order.customer?.phone
            },
            items: order.items?.map(item => ({
                _id: item._id,
                product: {
                    _id: item.product?._id,
                    name: item.product?.name,
                    image: item.product?.images?.[0]?.url || item.product?.images?.[0] || null
                },
                quantity: item.quantity,
                price: item.price,
                subtotal: item.quantity * item.price
            })) || [],
            status: order.status,
            payment: order.payment,
            pricing: order.pricing,
            shippingAddress: order.shippingAddress,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        }));

        res.json({
            success: true,
            data: {
                orders: transformedOrders,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                },
                statusCounts: statusCountsObj
            }
        });

    } catch (error) {
        console.error('Error fetching seller orders:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch seller orders' }
        });
    }
});

// Get seller's order statistics
router.get('/seller/stats', auth, requireSeller, async (req, res) => {
    try {
        const sellerId = req.user._id;
        const { period = '30d' } = req.query;

        // Calculate date range based on period
        const now = new Date();
        let startDate;

        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        const dateQuery = { seller: sellerId, createdAt: { $gte: startDate } };

        // Get statistics
        const [
            totalOrders,
            totalRevenue,
            statusCounts,
            recentOrders
        ] = await Promise.all([
            Order.countDocuments(dateQuery),
            Order.aggregate([
                { $match: { ...dateQuery, status: { $nin: ['cancelled', 'refunded'] } } },
                { $group: { _id: null, total: { $sum: '$pricing.total' } } }
            ]),
            Order.aggregate([
                { $match: { seller: sellerId } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            Order.find({ seller: sellerId })
                .populate('customer', 'firstName lastName')
                .populate('items.product', 'name')
                .sort({ createdAt: -1 })
                .limit(5)
        ]);

        const revenue = totalRevenue[0]?.total || 0;
        const statusCountsObj = statusCounts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        res.json({
            success: true,
            data: {
                period,
                totalOrders,
                totalRevenue: revenue,
                averageOrderValue: totalOrders > 0 ? revenue / totalOrders : 0,
                statusCounts: statusCountsObj,
                recentOrders: recentOrders.map(order => ({
                    _id: order._id,
                    orderNumber: order.orderNumber,
                    customer: `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim(),
                    total: order.pricing?.total || 0,
                    status: order.status,
                    createdAt: order.createdAt
                }))
            }
        });

    } catch (error) {
        console.error('Error fetching seller stats:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch seller statistics' }
        });
    }
});

// Update order status (seller only)
router.put('/seller/:orderId/status', auth, requireSeller, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, notes } = req.body;
        const sellerId = req.user._id;

        // Validate status
        const allowedStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid status' }
            });
        }

        // Find order and verify seller ownership
        const order = await Order.findOne({ _id: orderId, seller: sellerId });
        if (!order) {
            return res.status(404).json({
                success: false,
                error: { message: 'Order not found or not authorized' }
            });
        }

        // Update order status
        order.status = status;
        if (notes) {
            order.notes = notes;
        }

        // Add status history
        if (!order.statusHistory) {
            order.statusHistory = [];
        }
        order.statusHistory.push({
            status,
            timestamp: new Date(),
            updatedBy: sellerId,
            notes
        });

        await order.save();

        res.json({
            success: true,
            data: {
                order: {
                    _id: order._id,
                    orderNumber: order.orderNumber,
                    status: order.status,
                    updatedAt: order.updatedAt
                }
            },
            message: `Order status updated to ${status}`
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to update order status' }
        });
    }
});

// ============= ADMIN ORDER ROUTES =============

// Get all orders (admin only)
router.get('/admin', auth, requireAdmin, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            search,
            sellerId,
            startDate,
            endDate,
            sort = 'createdAt',
            order = 'desc'
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build query
        const query = {};

        // Add status filter
        if (status && status !== 'all') {
            query.status = status;
        }

        // Add seller filter
        if (sellerId) {
            query.seller = sellerId;
        }

        // Add date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Add search filter
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'customer.firstName': { $regex: search, $options: 'i' } },
                { 'customer.lastName': { $regex: search, $options: 'i' } },
                { 'customer.email': { $regex: search, $options: 'i' } }
            ];
        }

        // Sort configuration
        const sortOrder = order === 'desc' ? -1 : 1;
        const sortObj = { [sort]: sortOrder };

        // Get orders with pagination
        const [orders, total] = await Promise.all([
            Order.find(query)
                .populate('customer', 'firstName lastName email phone')
                .populate('seller', 'businessName firstName lastName email')
                .populate('items.product', 'name images price')
                .sort(sortObj)
                .skip(skip)
                .limit(parseInt(limit)),
            Order.countDocuments(query)
        ]);

        // Calculate global statistics
        const [
            statusCounts,
            totalRevenue,
            topSellers
        ] = await Promise.all([
            Order.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            Order.aggregate([
                { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
                { $group: { _id: null, total: { $sum: '$pricing.total' } } }
            ]),
            Order.aggregate([
                { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
                {
                    $group: {
                        _id: '$seller',
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: '$pricing.total' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'sellerInfo'
                    }
                },
                { $sort: { totalRevenue: -1 } },
                { $limit: 5 }
            ])
        ]);

        const statusCountsObj = statusCounts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        const revenue = totalRevenue[0]?.total || 0;

        // Transform orders for frontend
        const transformedOrders = orders.map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber,
            customer: {
                name: `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim(),
                email: order.customer?.email,
                phone: order.customer?.phone
            },
            seller: {
                name: order.seller?.businessName || `${order.seller?.firstName || ''} ${order.seller?.lastName || ''}`.trim(),
                email: order.seller?.email
            },
            items: order.items?.map(item => ({
                product: {
                    name: item.product?.name,
                    image: item.product?.images?.[0]?.url || item.product?.images?.[0] || null
                },
                quantity: item.quantity,
                price: item.price
            })) || [],
            status: order.status,
            payment: order.payment,
            pricing: order.pricing,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        }));

        res.json({
            success: true,
            data: {
                orders: transformedOrders,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                },
                statistics: {
                    statusCounts: statusCountsObj,
                    totalRevenue: revenue,
                    totalOrders: total,
                    topSellers: topSellers.map(seller => ({
                        _id: seller._id,
                        name: seller.sellerInfo[0]?.businessName || `${seller.sellerInfo[0]?.firstName || ''} ${seller.sellerInfo[0]?.lastName || ''}`.trim(),
                        totalOrders: seller.totalOrders,
                        totalRevenue: seller.totalRevenue
                    }))
                }
            }
        });

    } catch (error) {
        console.error('Error fetching admin orders:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch orders' }
        });
    }
});

// Get admin dashboard statistics
router.get('/admin/stats', auth, requireAdmin, async (req, res) => {
    try {
        const { period = '30d' } = req.query;

        // Calculate date range
        const now = new Date();
        let startDate;

        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        const dateQuery = { createdAt: { $gte: startDate } };

        // Get comprehensive statistics
        const [
            totalOrders,
            totalRevenue,
            statusCounts,
            dailyStats,
            topProducts,
            topSellers
        ] = await Promise.all([
            Order.countDocuments(dateQuery),
            Order.aggregate([
                { $match: { ...dateQuery, status: { $nin: ['cancelled', 'refunded'] } } },
                { $group: { _id: null, total: { $sum: '$pricing.total' } } }
            ]),
            Order.aggregate([
                { $match: dateQuery },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            Order.aggregate([
                { $match: dateQuery },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        orders: { $sum: 1 },
                        revenue: { $sum: '$pricing.total' }
                    }
                },
                { $sort: { _id: 1 } },
                { $limit: 30 }
            ]),
            Order.aggregate([
                { $match: { ...dateQuery, status: { $nin: ['cancelled', 'refunded'] } } },
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.product',
                        totalSold: { $sum: '$items.quantity' },
                        totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'productInfo'
                    }
                },
                { $sort: { totalRevenue: -1 } },
                { $limit: 5 }
            ]),
            Order.aggregate([
                { $match: { ...dateQuery, status: { $nin: ['cancelled', 'refunded'] } } },
                {
                    $group: {
                        _id: '$seller',
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: '$pricing.total' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'sellerInfo'
                    }
                },
                { $sort: { totalRevenue: -1 } },
                { $limit: 5 }
            ])
        ]);

        const revenue = totalRevenue[0]?.total || 0;
        const statusCountsObj = statusCounts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        res.json({
            success: true,
            data: {
                period,
                overview: {
                    totalOrders,
                    totalRevenue: revenue,
                    averageOrderValue: totalOrders > 0 ? revenue / totalOrders : 0,
                    statusCounts: statusCountsObj
                },
                charts: {
                    dailyStats: dailyStats,
                    topProducts: topProducts.map(item => ({
                        name: item.productInfo[0]?.name || 'Unknown Product',
                        totalSold: item.totalSold,
                        revenue: item.totalRevenue
                    })),
                    topSellers: topSellers.map(seller => ({
                        name: seller.sellerInfo[0]?.businessName || `${seller.sellerInfo[0]?.firstName || ''} ${seller.sellerInfo[0]?.lastName || ''}`.trim(),
                        totalOrders: seller.totalOrders,
                        totalRevenue: seller.totalRevenue
                    }))
                }
            }
        });

    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch admin statistics' }
        });
    }
});

module.exports = router;