const express = require('express');
const { auth, requireAdmin } = require('../../middleware/auth');
const User = require('../../models/User');
const { isValidObjectId } = require('mongoose');

const router = express.Router();

// Get all users with pagination and filters
router.get('/', auth, requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10, role, status, search } = req.query;
        const skip = (page - 1) * limit;

        // Build query
        const query = {};

        // Role filter
        if (role && role !== 'all') {
            query.role = role;
        }

        // Status filter
        if (status && status !== 'all') {
            query.status = status;
        }

        // Search filter
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        // Execute query with pagination
        const users = await User.find(query)
            .select('-password -refreshToken')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await User.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: {
                users,
                totalPages,
                currentPage: parseInt(page),
                total
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch users',
                details: error.message
            }
        });
    }
});

// Update user role
router.patch('/:userId/role', auth, requireAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid user ID' }
            });
        }

        if (!['user', 'seller', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid role' }
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' }
            });
        }

        // Update user role
        user.role = role;
        await user.save();

        res.json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to update user role',
                details: error.message
            }
        });
    }
});

// Update user status
router.patch('/:userId/status', auth, requireAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid user ID' }
            });
        }

        if (!['active', 'inactive', 'suspended'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid status' }
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' }
            });
        }

        // Update user status
        user.status = status;
        await user.save();

        res.json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    status: user.status
                }
            }
        });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to update user status',
                details: error.message
            }
        });
    }
});

// General user update route (PUT)
router.put('/:userId', auth, requireAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { role, status } = req.body;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid user ID' }
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' }
            });
        }

        // Update role if provided
        if (role && ['user', 'seller', 'admin'].includes(role)) {
            user.role = role;
        }

        // Update status if provided
        if (status && ['active', 'inactive', 'suspended'].includes(status)) {
            user.status = status;
        }

        await user.save();

        res.json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    role: user.role,
                    status: user.status
                }
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to update user',
                details: error.message
            }
        });
    }
});

module.exports = router;