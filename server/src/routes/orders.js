const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth, requireAdmin } = require('../middleware/auth');
const nimbusPostService = require('../services/nimbusPostService');
const { sendEmail } = require('../utils/emailService');
const logger = require('../utils/logger');

const router = express.Router();

// Validation middleware
const validateOrderCreation = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.name').trim().notEmpty().withMessage('Shipping name is required'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Shipping phone is required'),
  body('shippingAddress.addressLine1').trim().notEmpty().withMessage('Shipping address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('Shipping city is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('Shipping state is required'),
  body('shippingAddress.pincode').matches(/^\d{6}$/).withMessage('Valid pincode is required'),
  body('paymentMethod').isIn(['cod', 'razorpay', 'gokwik', 'crypto']).withMessage('Valid payment method is required')
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

// @route   POST /api/v1/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, validateOrderCreation, handleValidationErrors, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      customerNotes,
      shippingMethod = 'standard'
    } = req.body;

    // Validate and populate order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product).populate('seller', 'name email');
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: { message: `Product not found: ${item.product}` }
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: { message: `Insufficient stock for product: ${product.name}` }
        });
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        seller: product.seller._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        quantity: item.quantity,
        variants: item.variants || {},
        subtotal: itemSubtotal
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate shipping cost (mock calculation)
    const shippingCost = shippingMethod === 'express' ? 100 : 
                        shippingMethod === 'overnight' ? 200 : 50;
    
    // Calculate tax (18% GST)
    const tax = Math.round(subtotal * 0.18);
    
    const total = subtotal + shippingCost + tax;

    // Create order
    const order = new Order({
      customer: req.user._id,
      items: orderItems,
      subtotal,
      shippingCost,
      tax,
      total,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      customerNotes,
      shipping: {
        method: shippingMethod
      }
    });

    await order.save();

    // Populate order for response
    await order.populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'items.product', select: 'name images category' },
      { path: 'items.seller', select: 'name email' }
    ]);

    // Send order confirmation email
    try {
      await sendEmail({
        to: req.user.email,
        subject: 'Order Confirmation - VCX MART',
        template: 'orderConfirmation',
        data: {
          customerName: req.user.name,
          orderNumber: order.orderNumber,
          items: order.items,
          total: order.total,
          shippingAddress: order.shippingAddress
        }
      });
    } catch (emailError) {
      logger.error('Failed to send order confirmation email:', emailError);
    }

    // Notify sellers
    const sellers = [...new Set(orderItems.map(item => item.seller.toString()))];
    for (const sellerId of sellers) {
      try {
        const seller = await User.findById(sellerId);
        if (seller) {
          await sendEmail({
            to: seller.email,
            subject: 'New Order Received - VCX MART',
            template: 'newOrderSeller',
            data: {
              sellerName: seller.name,
              orderNumber: order.orderNumber,
              customerName: req.user.name,
              items: order.items.filter(item => item.seller.toString() === sellerId)
            }
          });
        }
      } catch (emailError) {
        logger.error(`Failed to send seller notification email to ${sellerId}:`, emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });

  } catch (error) {
    logger.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create order' }
    });
  }
});

// @route   GET /api/v1/orders/my-orders
// @desc    Get current user's orders
// @access  Private
router.get('/my-orders', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = { customer: req.user._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.orderNumber = { $regex: search, $options: 'i' };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'items.product', select: 'name images category' },
        { path: 'items.seller', select: 'name email' }
      ]
    };

    const orders = await Order.paginate(query, options);

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    logger.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get orders' }
    });
  }
});

// @route   GET /api/v1/orders/user
// @desc    Get current user's orders (alternative endpoint)
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = { customer: req.user._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.orderNumber = { $regex: search, $options: 'i' };
    }

    // Get orders without pagination first to handle empty database
    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('items.product', 'name images category')
      .populate('items.seller', 'name email')
      .lean();

    // Transform orders for frontend compatibility
    const transformedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt || order.placedAt,
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      discount: order.discount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      items: (order.items || []).map(item => ({
        _id: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
        image: item.image,
        product: {
          _id: item.product?._id || item.product,
          name: item.product?.name || item.name
        },
        variants: item.variants || {}
      })),
      shipping: order.shipping || {},
      shippingAddress: order.shippingAddress || {}
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
    logger.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get orders' }
    });
  }
});

// @route   GET /api/v1/orders/:id
// @desc    Get specific order details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid order ID format' }
      });
    }

    const order = await Order.findById(id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name images category description')
      .populate('items.seller', 'name email phone')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { message: 'Order not found' }
      });
    }

    // Check if user has access to this order
    const isCustomer = order.customer._id.toString() === req.user._id.toString();
    const isSeller = order.items.some(item => item.seller._id.toString() === req.user._id.toString());
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    // Transform order data for frontend
    const transformedOrder = {
      _id: order._id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt || order.placedAt,
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      discount: order.discount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      customer: order.customer,
      items: (order.items || []).map(item => ({
        _id: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
        image: item.image,
        product: {
          _id: item.product?._id || item.product,
          name: item.product?.name || item.name,
          images: item.product?.images,
          category: item.product?.category,
          description: item.product?.description
        },
        seller: item.seller,
        variants: item.variants || {}
      })),
      shipping: order.shipping || {},
      shippingAddress: order.shippingAddress || {},
      billingAddress: order.billingAddress || {},
      customerNotes: order.customerNotes
    };

    res.json({
      success: true,
      data: { order: transformedOrder }
    });

  } catch (error) {
    logger.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get order' }
    });
  }
});

// @route   GET /api/v1/orders/seller/my-orders
// @desc    Get seller's orders
// @access  Private/Seller
router.get('/seller/my-orders', auth, async (req, res) => {
  try {
    if (req.user.role !== 'seller' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Seller access required' }
      });
    }

    const { page = 1, limit = 10, status, search } = req.query;

    const query = { 'items.seller': req.user._id };
    
    if (status && status !== 'all') {
      query['items.status'] = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.name': { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'customer', select: 'name email phone' },
        { path: 'items.product', select: 'name images category' }
      ]
    };

    const orders = await Order.paginate(query, options);

    // Filter items to show only seller's items
    orders.docs = orders.docs.map(order => ({
      ...order.toObject(),
      items: order.items.filter(item => item.seller.toString() === req.user._id.toString())
    }));

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    logger.error('Get seller orders error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get seller orders' }
    });
  }
});

// @route   PUT /api/v1/orders/:id/status
// @desc    Update order status (Admin/Seller)
// @access  Private/Admin/Seller
router.put('/:id/status', auth, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Valid status is required'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], handleValidationErrors, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.seller', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { message: 'Order not found' }
      });
    }

    // Check permissions
    const isSeller = order.items.some(item => item.seller._id.toString() === req.user._id.toString());
    const isAdmin = req.user.role === 'admin';

    if (!isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    // Update order status
    await order.updateStatus(status, notes);

    // If order is confirmed and payment method is not COD, create shipping
    if (status === 'confirmed' && order.paymentMethod !== 'cod') {
      try {
        const shippingResult = await createNimbusShipping(order);
        if (shippingResult.success) {
          await order.addTracking(shippingResult);
        }
      } catch (shippingError) {
        logger.error('Failed to create shipping:', shippingError);
      }
    }

    // Send status update email to customer
    try {
      await sendEmail({
        to: order.customer.email,
        subject: `Order ${status.toUpperCase()} - ${order.orderNumber}`,
        template: 'orderStatusUpdate',
        data: {
          customerName: order.customer.name,
          orderNumber: order.orderNumber,
          status: status,
          notes: notes,
          trackingNumber: order.shipping?.trackingNumber
        }
      });
    } catch (emailError) {
      logger.error('Failed to send status update email:', emailError);
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });

  } catch (error) {
    logger.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update order status' }
    });
  }
});

// @route   POST /api/v1/orders/:id/ship
// @desc    Create shipping for order
// @access  Private/Admin/Seller
router.post('/:id/ship', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name weight dimensions')
      .populate('items.seller', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { message: 'Order not found' }
      });
    }

    // Check permissions
    const isSeller = order.items.some(item => item.seller._id.toString() === req.user._id.toString());
    const isAdmin = req.user.role === 'admin';

    if (!isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    if (order.status !== 'confirmed' && order.status !== 'processing') {
      return res.status(400).json({
        success: false,
        error: { message: 'Order must be confirmed or processing to create shipping' }
      });
    }

    const shippingResult = await createNimbusShipping(order);

    if (shippingResult.success) {
      await order.addTracking(shippingResult);
      
      res.json({
        success: true,
        message: 'Shipping created successfully',
        data: {
          trackingNumber: shippingResult.trackingNumber,
          nimbusOrderId: shippingResult.nimbusOrderId,
          estimatedDelivery: shippingResult.estimatedDelivery,
          trackingUrl: shippingResult.trackingUrl
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: { message: shippingResult.error }
      });
    }

  } catch (error) {
    logger.error('Create shipping error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create shipping' }
    });
  }
});

// @route   GET /api/v1/orders/:id/track
// @desc    Track order shipment
// @access  Private
router.get('/:id/track', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { message: 'Order not found' }
      });
    }

    // Check if user has access to this order
    const isCustomer = order.customer.toString() === req.user._id.toString();
    const isSeller = order.items.some(item => item.seller.toString() === req.user._id.toString());
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    if (!order.shipping?.trackingNumber) {
      return res.status(400).json({
        success: false,
        error: { message: 'No tracking information available' }
      });
    }

    const trackingResult = await nimbusPostService.trackShipment(order.shipping.trackingNumber);

    if (trackingResult.success) {
      res.json({
        success: true,
        data: {
          orderNumber: order.orderNumber,
          trackingNumber: trackingResult.trackingNumber,
          status: trackingResult.status,
          location: trackingResult.location,
          estimatedDelivery: trackingResult.estimatedDelivery,
          actualDelivery: trackingResult.actualDelivery,
          trackingHistory: trackingResult.trackingHistory,
          courierPartner: trackingResult.courierPartner
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: { message: trackingResult.error }
      });
    }

  } catch (error) {
    logger.error('Track order error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to track order' }
    });
  }
});

// @route   PUT /api/v1/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', auth, [
  body('reason').trim().notEmpty().withMessage('Cancellation reason is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.product', 'name')
      .populate('items.seller', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { message: 'Order not found' }
      });
    }

    // Check if user can cancel this order
    const isCustomer = order.customer._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Order cannot be cancelled at this stage' }
      });
    }

    // Cancel shipping if exists
    if (order.shipping?.nimbusOrderId) {
      try {
        await nimbusPostService.cancelShipment(order.shipping.nimbusOrderId, reason);
      } catch (shippingError) {
        logger.error('Failed to cancel shipping:', shippingError);
      }
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Update order
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason;
    await order.save();

    // Send cancellation email
    try {
      await sendEmail({
        to: order.customer.email,
        subject: `Order Cancelled - ${order.orderNumber}`,
        template: 'orderCancellation',
        data: {
          customerName: order.customer.name,
          orderNumber: order.orderNumber,
          reason: reason,
          refundInfo: order.paymentMethod !== 'cod' ? 'Refund will be processed within 5-7 business days' : 'No payment to refund'
        }
      });
    } catch (emailError) {
      logger.error('Failed to send cancellation email:', emailError);
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });

  } catch (error) {
    logger.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to cancel order' }
    });
  }
});

// @route   GET /api/v1/orders/admin/all
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/admin/all', auth, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, seller, customer, dateFrom, dateTo } = req.query;

    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }

    if (seller) {
      query['items.seller'] = seller;
    }

    if (customer) {
      query.customer = customer;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.name': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
      ];
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'customer', select: 'name email phone' },
        { path: 'items.product', select: 'name images category' },
        { path: 'items.seller', select: 'name email' }
      ]
    };

    const orders = await Order.paginate(query, options);

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    logger.error('Get admin orders error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get orders' }
    });
  }
});

// @route   GET /api/v1/orders/admin/stats
// @desc    Get order statistics (Admin only)
// @access  Private/Admin
router.get('/admin/stats', auth, requireAdmin, async (req, res) => {
  try {
    const { sellerId, days = 30 } = req.query;

    const orderStats = await Order.getOrderStats(sellerId);
    const revenueStats = await Order.getRevenueStats(sellerId, parseInt(days));

    const stats = {
      ordersByStatus: {},
      revenueByStatus: {},
      dailyRevenue: revenueStats,
      totalOrders: 0,
      totalRevenue: 0
    };

    orderStats.forEach(stat => {
      stats.ordersByStatus[stat._id] = stat.count;
      stats.revenueByStatus[stat._id] = stat.totalAmount;
      stats.totalOrders += stat.count;
      stats.totalRevenue += stat.totalAmount;
    });

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    logger.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get order statistics' }
    });
  }
});

// @route   POST /api/v1/orders/webhook/nimbus
// @desc    Handle NimbusPost webhook
// @access  Public (with verification)
router.post('/webhook/nimbus', async (req, res) => {
  try {
    const webhookData = nimbusPostService.handleWebhook(req.body);
    
    // Find order by tracking number
    const order = await Order.findOne({ 'shipping.trackingNumber': webhookData.trackingNumber });
    
    if (order) {
      // Update order status based on shipping status
      let newOrderStatus = order.status;
      
      switch (webhookData.statusCode) {
        case 'UD':
        case 'DEL':
          newOrderStatus = 'delivered';
          order.deliveredAt = webhookData.deliveredDate || new Date();
          break;
        case 'IT':
        case 'OT':
          newOrderStatus = 'shipped';
          break;
        case 'RTO':
        case 'RTS':
          newOrderStatus = 'returned';
          break;
      }
      
      if (newOrderStatus !== order.status) {
        await order.updateStatus(newOrderStatus);
      }
      
      // Update shipping info
      order.shipping = {
        ...order.shipping,
        trackingNumber: webhookData.trackingNumber,
        estimatedDelivery: webhookData.estimatedDelivery,
        actualDelivery: webhookData.deliveredDate
      };
      
      await order.save();
      
      logger.info(`Order ${order.orderNumber} updated via NimbusPost webhook`);
    }
    
    res.json({ success: true });
    
  } catch (error) {
    logger.error('NimbusPost webhook error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function to create NimbusPost shipping
async function createNimbusShipping(order) {
  try {
    const orderData = {
      orderNumber: order.orderNumber,
      orderAmount: order.total,
      paymentType: order.paymentMethod === 'cod' ? 'cod' : 'prepaid',
      codCharges: order.paymentMethod === 'cod' ? order.total : 0,
      shippingCharges: order.shippingCost,
      discount: order.discount || 0,
      weight: order.items.reduce((total, item) => total + (item.weight || 0.5) * item.quantity, 0),
      length: 20,
      breadth: 15,
      height: 10,
      consignee: {
        name: order.shippingAddress.name,
        address: order.shippingAddress.addressLine1,
        address2: order.shippingAddress.addressLine2 || '',
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pincode: order.shippingAddress.pincode,
        phone: order.shippingAddress.phone,
        email: order.shippingAddress.email || ''
      },
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        productId: item.product.toString()
      }))
    };

    return await nimbusPostService.createShippingOrder(orderData);
  } catch (error) {
    logger.error('Create NimbusPost shipping error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = router;