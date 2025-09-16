const express = require('express');
const { auth, requireAdmin } = require('../middleware/auth');
const usersRouter = require('./admin/users');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const SellerApplication = require('../models/SellerApplication');
const { toRelativeTimeString } = require('../utils/dateUtils');

const router = express.Router();

// Mount the users router with auth and admin middleware
router.use('/users', auth, requireAdmin, usersRouter);

// Get admin dashboard stats
router.get('/dashboard/stats', auth, requireAdmin, async (req, res) => {
    try {
        const { period = '7d' } = req.query;

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
            default:
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        // Get total revenue from orders
        const orders = await Order.find({ status: 'delivered' });
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Get total orders
        const totalOrders = await Order.countDocuments();

        // Get active sellers
        const activeSellers = await User.countDocuments({ role: 'seller' });

        // Get total users
        const totalUsers = await User.countDocuments();

        // Calculate changes (mock data for now)
        const revenueChange = '+12.5%';
        const ordersChange = '+8.2%';
        const sellersChange = '+15.3%';
        const usersChange = '+22.1%';

        res.json({
            success: true,
            data: {
                totalRevenue,
                totalOrders,
                activeSellers,
                totalUsers,
                revenueChange,
                ordersChange,
                sellersChange,
                usersChange
            }
        });
    } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch dashboard statistics' }
        });
    }
});

// Get sales data for charts
router.get('/dashboard/sales', auth, requireAdmin, async (req, res) => {
    try {
        const { period = '7d' } = req.query;

        // Mock sales data - replace with actual aggregation
        const salesData = [
            { date: '2024-01-15', sales: 125000, orders: 45 },
            { date: '2024-01-16', sales: 135000, orders: 52 },
            { date: '2024-01-17', sales: 145000, orders: 48 },
            { date: '2024-01-18', sales: 155000, orders: 61 },
            { date: '2024-01-19', sales: 165000, orders: 58 },
            { date: '2024-01-20', sales: 175000, orders: 65 },
            { date: '2024-01-21', sales: 185000, orders: 72 },
        ];

        res.json({
            success: true,
            data: salesData
        });
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch sales data' }
        });
    }
});

// Get category distribution data
router.get('/dashboard/categories', auth, requireAdmin, async (req, res) => {
    try {
        // Get product count by category
        const categories = await Category.find();
        const categoryData = [];

        for (const category of categories) {
            const productCount = await Product.countDocuments({ category: category._id });
            if (productCount > 0) {
                categoryData.push({
                    name: category.name,
                    count: productCount,
                    percentage: 0 // Will calculate after getting all data
                });
            }
        }

        // Calculate percentages
        const totalProducts = categoryData.reduce((sum, cat) => sum + cat.count, 0);
        categoryData.forEach(cat => {
            cat.percentage = totalProducts > 0 ? Math.round((cat.count / totalProducts) * 100) : 0;
        });

        res.json({
            success: true,
            data: categoryData
        });
    } catch (error) {
        console.error('Error fetching category data:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch category data' }
        });
    }
});

// Get pending actions
router.get('/dashboard/pending-actions', auth, requireAdmin, async (req, res) => {
    try {
        const pendingActions = [];

        // Get pending seller applications
        const pendingApplications = await SellerApplication.find({
            status: 'pending'
        }).populate('user', 'firstName lastName').limit(5);

        pendingApplications.forEach(application => {
            pendingActions.push({
                id: application._id,
                type: 'seller_application',
                title: 'New Seller Application',
                description: `${application.businessName} - Business verification required`,
                priority: 'high',
                time: toRelativeTimeString(application.submittedAt),
                createdAt: application.submittedAt
            });
        });

        res.json({
            success: true,
            data: pendingActions
        });
    } catch (error) {
        console.error('Error fetching pending actions:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch pending actions' }
        });
    }
});

// Get recent activities
router.get('/dashboard/activities', auth, requireAdmin, async (req, res) => {
    try {
        const { limit = 5 } = req.query;

        // Mock activities data - replace with actual activity log
        const activities = [
            {
                action: 'Approved seller application',
                user: 'FashionHub Store',
                time: '1 hour ago',
                status: 'success',
                createdAt: new Date(Date.now() - 60 * 60 * 1000)
            },
            {
                action: 'Product removed for policy violation',
                user: 'GadgetWorld',
                time: toRelativeTimeString(new Date(Date.now() - 3 * 60 * 60 * 1000)),
                status: 'warning',
                createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
            },
            {
                action: 'Refund processed',
                user: 'Order #ORD-156',
                time: toRelativeTimeString(new Date(Date.now() - 5 * 60 * 60 * 1000)),
                status: 'info',
                createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
            },
            {
                action: 'New seller registered',
                user: 'BookMart',
                time: toRelativeTimeString(new Date(Date.now() - 8 * 60 * 60 * 1000)),
                status: 'success',
                createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
            }
        ];

        res.json({
            success: true,
            data: activities.slice(0, parseInt(limit))
        });
    } catch (error) {
        console.error('Error fetching recent activities:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch recent activities' }
        });
    }
});

// Product Management Routes

// Get all products for admin
router.get('/products', auth, requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search, category } = req.query;

        const query = {};

        // Filter by status
        if (status && status !== 'all') {
            query.status = status;
        }

        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        const products = await Product.find(query)
            .populate('seller', 'firstName lastName businessName')
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get admin products error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch products',
                details: error.message
            }
        });
    }
});

// Update product status
router.put('/products/:id/status', auth, requireAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: { message: 'Product not found' }
            });
        }

        product.status = status;
        await product.save();

        res.json({
            success: true,
            message: 'Product status updated successfully',
            data: { product }
        });
    } catch (error) {
        console.error('Update product status error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to update product status' }
        });
    }
});

// Seller Management Routes

// Get seller application stats
router.get('/sellers/stats', auth, requireAdmin, async (req, res) => {
    try {
        const stats = {
            total: await SellerApplication.countDocuments(),
            pending: await SellerApplication.countDocuments({ status: 'pending' }),
            under_review: await SellerApplication.countDocuments({ status: 'under_review' }),
            approved: await SellerApplication.countDocuments({ status: 'approved' }),
            rejected: await SellerApplication.countDocuments({ status: 'rejected' }),
            requires_changes: await SellerApplication.countDocuments({ status: 'requires_changes' })
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Get seller stats error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch seller stats',
                details: error.message
            }
        });
    }
});

// Get all sellers/applications
router.get('/sellers', auth, requireAdmin, async (req, res) => {
    try {
        const { status = 'all', search = '', page = 1, limit = 10 } = req.query;

        const query = {};

        // Filter by status
        if (status !== 'all') {
            query.status = status;
        }

        // Search functionality
        if (search) {
            query.$or = [
                { businessName: { $regex: search, $options: 'i' } },
                { businessEmail: { $regex: search, $options: 'i' } },
                { applicationId: { $regex: search, $options: 'i' } }
            ];
        }

        const applications = await SellerApplication.find(query)
            .populate('user', 'firstName lastName email phone createdAt')
            .sort({ submittedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await SellerApplication.countDocuments(query);

        // Transform data to match frontend expectations
        const transformedApplications = applications.map(app => ({
            _id: app.user._id,
            firstName: app.user.firstName,
            lastName: app.user.lastName,
            email: app.user.email,
            phone: app.user.phone,
            createdAt: app.user.createdAt,
            sellerApplication: {
                _id: app._id,
                applicationId: app.applicationId,
                businessName: app.businessName,
                businessType: app.businessType,
                businessCategory: app.businessCategory,
                status: app.status,
                submittedAt: app.submittedAt,
                reviewedAt: app.reviewedAt,
                reviewNotes: app.reviewNotes,
                rejectionReason: app.rejectionReason
            }
        }));

        res.json({
            success: true,
            data: {
                applications: transformedApplications,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get sellers error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch sellers',
                details: error.message
            }
        });
    }
});

// Get single seller/application
router.get('/sellers/:id', auth, requireAdmin, async (req, res) => {
    try {
        // Try to find by user ID first, then by application ID
        let application = await SellerApplication.findOne({ userId: req.params.id })
            .populate('user', 'firstName lastName email phone createdAt')
            .populate('reviewer', 'firstName lastName email');

        if (!application) {
            // Try finding by application ID
            application = await SellerApplication.findById(req.params.id)
                .populate('user', 'firstName lastName email phone createdAt')
                .populate('reviewer', 'firstName lastName email');
        }

        if (!application) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Seller application not found'
                }
            });
        }

        res.json({
            success: true,
            data: {
                application: {
                    _id: application.user._id,
                    firstName: application.user.firstName,
                    lastName: application.user.lastName,
                    email: application.user.email,
                    phone: application.user.phone,
                    createdAt: application.user.createdAt,
                    sellerApplication: application
                }
            }
        });
    } catch (error) {
        console.error('Get seller error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch seller',
                details: error.message
            }
        });
    }
});

// Approve seller application
router.put('/sellers/:id/approve', auth, requireAdmin, async (req, res) => {
    try {
        const { notes } = req.body;

        // Find the application by user ID
        const application = await SellerApplication.findOne({ userId: req.params.id })
            .populate('user', 'firstName lastName email');

        if (!application) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Seller application not found'
                }
            });
        }

        // Update application status
        await application.approve(req.user._id, notes);

        // Update user role to seller
        const user = await User.findById(req.params.id);
        user.role = 'seller';
        await user.save();

        res.json({
            success: true,
            message: 'Seller application approved successfully',
            data: {
                seller: {
                    id: user._id,
                    name: `${user.firstName} ${user.lastName}`,
                    businessName: application.businessName,
                    status: application.status
                }
            }
        });
    } catch (error) {
        console.error('Approve seller error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to approve seller',
                details: error.message
            }
        });
    }
});

// Reject seller application
router.put('/sellers/:id/reject', auth, requireAdmin, async (req, res) => {
    try {
        const { reason, notes } = req.body;

        if (!reason) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Rejection reason is required'
                }
            });
        }

        // Find the application by user ID
        const application = await SellerApplication.findOne({ userId: req.params.id })
            .populate('user', 'firstName lastName email');

        if (!application) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Seller application not found'
                }
            });
        }

        // Update application status
        await application.reject(req.user._id, reason, notes);

        res.json({
            success: true,
            message: 'Seller application rejected',
            data: {
                seller: {
                    id: application.user._id,
                    name: `${application.user.firstName} ${application.user.lastName}`,
                    businessName: application.businessName,
                    status: application.status,
                    rejectionReason: reason
                }
            }
        });
    } catch (error) {
        console.error('Reject seller error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to reject seller',
                details: error.message
            }
        });
    }
});

module.exports = router;