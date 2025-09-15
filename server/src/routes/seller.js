const express = require('express');
const { body, validationResult } = require('express-validator');
const SellerApplication = require('../models/SellerApplication');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { auth, requireAdmin } = require('../middleware/auth');
const { sendEmail } = require('../utils/emailService');
const logger = require('../utils/logger');

const router = express.Router();

// Validation middleware
const validateSellerApplication = [
  body('businessName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Business name must be between 2 and 100 characters'),
  body('businessType')
    .isIn(['Individual/Proprietorship', 'Partnership', 'Private Limited Company', 'Public Limited Company', 'LLP', 'Others', 'individual', 'proprietorship', 'partnership', 'private_limited'])
    .withMessage('Invalid business type'),
  body('businessCategory')
    .isIn(['Electronics & Gadgets', 'Fashion & Apparel', 'Home & Kitchen', 'Books & Stationery', 'Sports & Fitness', 'Beauty & Personal Care', 'Automotive', 'Others', 'General'])
    .withMessage('Invalid business category'),
  body('businessDescription')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Business description must be between 10 and 1000 characters'),
  body('establishedYear')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Invalid established year'),
  body('businessEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid business email'),
  body('businessPhone')
    .matches(/^[+]?[\d\s\-\(\)]+$/)
    .withMessage('Invalid business phone number'),
  body('businessAddress')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Business address must be between 10 and 500 characters'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  body('pincode')
    .matches(/^\d{6}$/)
    .withMessage('Invalid pincode'),
  body('panNumber')
    .optional()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .withMessage('Invalid PAN number format'),
  body('bankAccountNumber')
    .isLength({ min: 5, max: 25 })
    .withMessage('Bank account number must be between 5 and 25 characters'),
  body('bankIFSC')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (!value) return true; // Allow empty/null values
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) {
        throw new Error('Invalid IFSC code format');
      }
      return true;
    }),
  body('bankName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Bank name must be between 2 and 100 characters'),
  body('accountHolderName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Account holder name must be between 2 and 100 characters'),
  body('agreeToTerms')
    .isBoolean()
    .custom(value => {
      if (!value) {
        throw new Error('You must agree to the terms and conditions');
      }
      return true;
    })
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

// @route   POST /api/v1/seller/apply
// @desc    Submit seller application
// @access  Private
router.post('/apply', auth, validateSellerApplication, handleValidationErrors, async (req, res) => {
  try {
    console.log('Seller application request from user:', req.user._id);

    // Check if user already has an application
    const existingApplication = await SellerApplication.findOne({ userId: req.user._id });
    if (existingApplication) {
      console.log('User already has application:', existingApplication.applicationId);

      // If application is rejected, allow resubmission
      if (existingApplication.status === 'rejected') {
        console.log('Previous application was rejected, allowing resubmission');
        await SellerApplication.findByIdAndDelete(existingApplication._id);
      } else {
        return res.status(400).json({
          success: false,
          error: {
            message: 'You have already submitted a seller application',
            applicationId: existingApplication.applicationId,
            status: existingApplication.status
          }
        });
      }
    }

    // Check if user is already a seller
    if (req.user.role === 'seller') {
      return res.status(400).json({
        success: false,
        error: { message: 'You are already a seller' }
      });
    }

    // Create new seller application
    const applicationData = {
      userId: req.user._id,
      ...req.body
    };

    const application = new SellerApplication(applicationData);
    await application.save();

    console.log('New application created:', application.applicationId);

    // Send confirmation email to applicant
    try {
      await sendEmail({
        to: req.user.email,
        template: 'sellerApplicationReceived',
        data: {
          firstName: req.user.firstName,
          businessName: application.businessName,
          applicationId: application.applicationId
        }
      });
    } catch (emailError) {
      logger.error('Failed to send application confirmation email:', emailError);
    }

    // Send notification email to admin
    try {
      const adminUsers = await User.find({ role: 'admin' });
      for (const admin of adminUsers) {
        await sendEmail({
          to: admin.email,
          template: 'newSellerApplication',
          data: {
            adminName: admin.firstName,
            sellerName: `${req.user.firstName} ${req.user.lastName}`,
            businessName: application.businessName,
            applicationId: application.applicationId,
            reviewUrl: `${process.env.FRONTEND_URL}/admin/seller-applications/${application._id}`
          }
        });
      }
    } catch (emailError) {
      logger.error('Failed to send admin notification email:', emailError);
    }

    // Check if payment integration is enabled
    const requiresPayment = process.env.ENABLE_SELLER_PAYMENTS === 'true' || true; // Default to true

    if (requiresPayment) {
      res.status(201).json({
        success: true,
        message: 'Seller application submitted successfully. Please complete payment to proceed.',
        data: {
          applicationId: application.applicationId,
          status: application.status,
          requiresPayment: true
        }
      });
    } else {
      res.status(201).json({
        success: true,
        message: 'Seller application submitted successfully',
        data: {
          applicationId: application.applicationId,
          status: application.status,
          requiresPayment: false
        }
      });
    }

  } catch (error) {
    logger.error('Seller application submission error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to submit application. Please try again.' }
    });
  }
});

// @route   GET /api/v1/seller/application/status
// @desc    Get user's seller application status
// @access  Private
router.get('/application/status', auth, async (req, res) => {
  try {
    const application = await SellerApplication.findOne({ userId: req.user._id })
      .select('applicationId status submittedAt reviewedAt rejectionReason reviewNotes');

    if (!application) {
      return res.json({
        success: true,
        data: {
          hasApplication: false,
          canApply: req.user.role !== 'seller'
        }
      });
    }

    res.json({
      success: true,
      data: {
        hasApplication: true,
        application,
        canApply: false
      }
    });

  } catch (error) {
    logger.error('Get application status error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get application status' }
    });
  }
});

// @route   GET /api/v1/seller/applications
// @desc    Get all seller applications (Admin only)
// @access  Private/Admin
router.get('/applications', auth, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { submittedAt: -1 },
      populate: {
        path: 'user',
        select: 'firstName lastName email phone'
      }
    };

    let applications;
    if (search) {
      // Search in business name, application ID, or user email
      const searchRegex = new RegExp(search, 'i');
      const searchQuery = {
        ...query,
        $or: [
          { businessName: searchRegex },
          { applicationId: searchRegex },
          { businessEmail: searchRegex }
        ]
      };
      applications = await SellerApplication.paginate(searchQuery, options);
    } else {
      applications = await SellerApplication.paginate(query, options);
    }

    res.json({
      success: true,
      data: applications
    });

  } catch (error) {
    logger.error('Get seller applications error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get seller applications' }
    });
  }
});

// @route   GET /api/v1/seller/applications/stats
// @desc    Get seller application statistics (Admin only)
// @access  Private/Admin
router.get('/applications/stats', auth, requireAdmin, async (req, res) => {
  try {
    const stats = await SellerApplication.getApplicationStats();

    const formattedStats = {
      total: 0,
      pending: 0,
      under_review: 0,
      approved: 0,
      rejected: 0,
      requires_changes: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    res.json({
      success: true,
      data: formattedStats
    });

  } catch (error) {
    logger.error('Get application stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get application statistics' }
    });
  }
});

// @route   GET /api/v1/seller/applications/:id
// @desc    Get specific seller application (Admin only)
// @access  Private/Admin
router.get('/applications/:id', auth, requireAdmin, async (req, res) => {
  try {
    const application = await SellerApplication.findById(req.params.id)
      .populate('user', 'firstName lastName email phone createdAt')
      .populate('reviewer', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: { message: 'Application not found' }
      });
    }

    res.json({
      success: true,
      data: { application }
    });

  } catch (error) {
    logger.error('Get seller application error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get seller application' }
    });
  }
});

// @route   PUT /api/v1/seller/applications/:id/approve
// @desc    Approve seller application (Admin only)
// @access  Private/Admin
router.put('/applications/:id/approve', auth, requireAdmin, async (req, res) => {
  try {
    const { notes } = req.body;

    const application = await SellerApplication.findById(req.params.id)
      .populate('user', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: { message: 'Application not found' }
      });
    }

    if (application.status === 'approved') {
      return res.status(400).json({
        success: false,
        error: { message: 'Application is already approved' }
      });
    }

    // Approve the application
    await application.approve(req.user._id, notes);

    // Update user role to seller
    await User.findByIdAndUpdate(application.userId, { role: 'seller' });

    // Send approval email
    try {
      await sendEmail({
        to: application.user.email,
        template: 'sellerApplicationApproved',
        data: {
          firstName: application.user.firstName,
          businessName: application.businessName,
          dashboardUrl: `${process.env.FRONTEND_URL}/seller/dashboard`
        }
      });
    } catch (emailError) {
      logger.error('Failed to send approval email:', emailError);
    }

    res.json({
      success: true,
      message: 'Application approved successfully',
      data: { application }
    });

  } catch (error) {
    logger.error('Approve application error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to approve application' }
    });
  }
});

// @route   PUT /api/v1/seller/applications/:id/reject
// @desc    Reject seller application (Admin only)
// @access  Private/Admin
router.put('/applications/:id/reject', auth, requireAdmin, async (req, res) => {
  try {
    const { reason, notes } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: { message: 'Rejection reason is required' }
      });
    }

    const application = await SellerApplication.findById(req.params.id)
      .populate('user', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: { message: 'Application not found' }
      });
    }

    if (application.status === 'rejected') {
      return res.status(400).json({
        success: false,
        error: { message: 'Application is already rejected' }
      });
    }

    // Reject the application
    await application.reject(req.user._id, reason, notes);

    // Send rejection email
    try {
      await sendEmail({
        to: application.user.email,
        template: 'sellerApplicationRejected',
        data: {
          firstName: application.user.firstName,
          businessName: application.businessName,
          reason: reason,
          reapplyUrl: `${process.env.FRONTEND_URL}/become-seller`
        }
      });
    } catch (emailError) {
      logger.error('Failed to send rejection email:', emailError);
    }

    res.json({
      success: true,
      message: 'Application rejected successfully',
      data: { application }
    });

  } catch (error) {
    logger.error('Reject application error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to reject application' }
    });
  }
});

// @route   PUT /api/v1/seller/applications/:id/request-changes
// @desc    Request changes in seller application (Admin only)
// @access  Private/Admin
router.put('/applications/:id/request-changes', auth, requireAdmin, async (req, res) => {
  try {
    const { reason, notes } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: { message: 'Reason for changes is required' }
      });
    }

    const application = await SellerApplication.findById(req.params.id)
      .populate('user', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: { message: 'Application not found' }
      });
    }

    // Request changes
    await application.requestChanges(req.user._id, reason, notes);

    // Send email notification
    try {
      await sendEmail({
        to: application.user.email,
        subject: 'Changes Required - Seller Application',
        html: `
          <h2>Changes Required for Your Seller Application</h2>
          <p>Dear ${application.user.firstName},</p>
          <p>We have reviewed your seller application for <strong>${application.businessName}</strong> and require some changes before we can proceed.</p>
          <p><strong>Required Changes:</strong></p>
          <p>${reason}</p>
          ${notes ? `<p><strong>Additional Notes:</strong></p><p>${notes}</p>` : ''}
          <p>Please update your application and resubmit.</p>
          <p>Best regards,<br>Cryptomart Team</p>
        `
      });
    } catch (emailError) {
      logger.error('Failed to send changes request email:', emailError);
    }

    res.json({
      success: true,
      message: 'Changes requested successfully',
      data: { application }
    });

  } catch (error) {
    logger.error('Request changes error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to request changes' }
    });
  }
});

// Seller Dashboard Routes

// @route   GET /api/v1/seller/dashboard
// @desc    Get seller dashboard data
// @access  Private/Seller
router.get('/dashboard', auth, async (req, res) => {
  // Check if user is seller
  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: { message: 'Seller access required' }
    });
  }
  try {
    const sellerId = req.user._id;

    // Get basic stats
    const totalProducts = await Product.countDocuments({ seller: sellerId });
    const activeProducts = await Product.countDocuments({ seller: sellerId, status: 'active' });
    const pendingProducts = await Product.countDocuments({ seller: sellerId, status: 'pending' });

    // Get orders stats (mock data for now)
    const totalOrders = 0; // await Order.countDocuments({ 'items.seller': sellerId });
    const pendingOrders = 0; // await Order.countDocuments({ 'items.seller': sellerId, status: 'pending' });
    const completedOrders = 0; // await Order.countDocuments({ 'items.seller': sellerId, status: 'delivered' });

    // Calculate revenue (mock data for now)
    const totalRevenue = 0;
    const monthlyRevenue = 0;

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          activeProducts,
          pendingProducts,
          totalOrders,
          pendingOrders,
          completedOrders,
          totalRevenue,
          monthlyRevenue
        }
      }
    });

  } catch (error) {
    logger.error('Get seller dashboard error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get dashboard data' }
    });
  }
});

// @route   GET /api/v1/seller/dashboard/sales
// @desc    Get seller sales data for charts
// @access  Private/Seller
router.get('/dashboard/sales', auth, async (req, res) => {
  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: { message: 'Seller access required' }
    });
  }
  try {
    const { period = '7d' } = req.query;

    // Mock sales data - replace with actual aggregation when orders are implemented
    const salesData = [
      { date: '2024-01-15', sales: 12500, orders: 5 },
      { date: '2024-01-16', sales: 15000, orders: 7 },
      { date: '2024-01-17', sales: 18000, orders: 6 },
      { date: '2024-01-18', sales: 22000, orders: 8 },
      { date: '2024-01-19', sales: 16500, orders: 4 },
      { date: '2024-01-20', sales: 19000, orders: 9 },
      { date: '2024-01-21', sales: 25000, orders: 12 },
    ];

    res.json({
      success: true,
      data: salesData
    });

  } catch (error) {
    logger.error('Get seller sales data error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get sales data' }
    });
  }
});

// @route   GET /api/v1/seller/orders/recent
// @desc    Get recent orders for seller
// @access  Private/Seller
router.get('/orders/recent', auth, async (req, res) => {
  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: { message: 'Seller access required' }
    });
  }
  try {
    const { limit = 5 } = req.query;
    const sellerId = req.user._id;

    // Mock recent orders data - replace with actual orders when implemented
    const recentOrders = [
      {
        _id: '1',
        orderNumber: 'ORD-001',
        customer: 'John Doe',
        amount: 2500,
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        items: [{ productName: 'Sample Product', quantity: 1 }]
      },
      {
        _id: '2',
        orderNumber: 'ORD-002',
        customer: 'Jane Smith',
        amount: 1800,
        status: 'processing',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        items: [{ productName: 'Another Product', quantity: 2 }]
      },
      {
        _id: '3',
        orderNumber: 'ORD-003',
        customer: 'Bob Johnson',
        amount: 3200,
        status: 'shipped',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        items: [{ productName: 'Premium Product', quantity: 1 }]
      }
    ];

    res.json({
      success: true,
      data: recentOrders.slice(0, parseInt(limit))
    });

  } catch (error) {
    logger.error('Get recent orders error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get recent orders' }
    });
  }
});

// @route   GET /api/v1/seller/products/recent
// @desc    Get recent products for seller
// @access  Private/Seller
router.get('/products/recent', auth, async (req, res) => {
  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: { message: 'Seller access required' }
    });
  }
  try {
    const { limit = 5 } = req.query;
    const sellerId = req.user._id;

    const recentProducts = await Product.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('name price status images createdAt');

    res.json({
      success: true,
      data: recentProducts
    });

  } catch (error) {
    logger.error('Get recent products error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get recent products' }
    });
  }
});

// @route   GET /api/v1/seller/dashboard/stats
// @desc    Get seller dashboard statistics
// @access  Private/Seller
router.get('/dashboard/stats', auth, async (req, res) => {
  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: { message: 'Seller access required' }
    });
  }
  try {
    const { period = '7d' } = req.query;
    const sellerId = req.user._id;

    // Get basic product stats
    const totalProducts = await Product.countDocuments({ seller: sellerId });
    const activeProducts = await Product.countDocuments({ seller: sellerId, status: 'active' });
    const pendingProducts = await Product.countDocuments({ seller: sellerId, status: 'pending' });

    // Mock order and revenue data for now
    const stats = {
      totalRevenue: 0,
      revenueChange: '+0%',
      totalOrders: 0,
      ordersChange: '+0%',
      productsListed: totalProducts,
      productsChange: '+0',
      averageRating: 4.5,
      ratingChange: '+0.1'
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    logger.error('Get seller dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get dashboard statistics' }
    });
  }
});

// @route   GET /api/v1/seller/products/low-stock
// @desc    Get low stock products for seller
// @access  Private/Seller
router.get('/products/low-stock', auth, async (req, res) => {
  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: { message: 'Seller access required' }
    });
  }
  try {
    const { threshold = 5 } = req.query;
    const sellerId = req.user._id;

    // Get all products for the seller
    const products = await Product.find({
      seller: sellerId,
      status: 'active'
    })
      .select('name sku sizes price')
      .lean();

    // Filter products with low stock based on total inventory
    const lowStockProducts = products
      .map(product => {
        const totalStock = product.sizes?.reduce((total, size) => total + (size.stock || 0), 0) || 0;
        return {
          ...product,
          stock: totalStock
        };
      })
      .filter(product => product.stock <= parseInt(threshold) && product.stock >= 0)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 10);

    res.json({
      success: true,
      data: lowStockProducts
    });

  } catch (error) {
    logger.error('Get low stock products error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get low stock products' }
    });
  }
});

// @route   GET /api/v1/seller/test-auth
// @desc    Test authentication for seller routes
// @access  Private
router.get('/test-auth', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        isActive: req.user.isActive
      }
    });
  } catch (error) {
    logger.error('Test auth error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Authentication test failed' }
    });
  }
});

// Development routes
if (process.env.NODE_ENV === 'development') {
  // @route   POST /api/v1/seller/dev/quick-approve
  // @desc    Quick approve user as seller (Development only)
  // @access  Private
  router.post('/dev/quick-approve', auth, async (req, res) => {
    try {
      // Update user role to seller
      await User.findByIdAndUpdate(req.user._id, { role: 'seller' });

      res.json({
        success: true,
        message: 'User approved as seller successfully'
      });

    } catch (error) {
      logger.error('Quick approve seller error:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Failed to approve seller' }
      });
    }
  });

  // @route   DELETE /api/v1/seller/dev/reset-application
  // @desc    Delete user's seller application for testing (Development only)
  // @access  Private
  router.delete('/dev/reset-application', auth, async (req, res) => {
    try {
      const deletedApplication = await SellerApplication.findOneAndDelete({ userId: req.user._id });

      if (deletedApplication) {
        console.log('Deleted application:', deletedApplication.applicationId);
        res.json({
          success: true,
          message: 'Seller application deleted successfully',
          deletedApplicationId: deletedApplication.applicationId
        });
      } else {
        res.json({
          success: true,
          message: 'No existing application found to delete'
        });
      }

    } catch (error) {
      logger.error('Reset application error:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Failed to reset application' }
      });
    }
  });
}

module.exports = router;