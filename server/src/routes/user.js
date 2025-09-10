const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');

const router = express.Router();

// Get user dashboard stats
router.get('/dashboard/stats', auth, async (req, res) => {
    try {
        const userId = req.user._id;

        // Get order statistics
        const orders = await Order.find({ customer: userId });
        const totalOrders = orders.length;
        const activeOrders = orders.filter(order =>
            ['pending', 'processing', 'shipped'].includes(order.status)
        ).length;
        const completedOrders = orders.filter(order =>
            order.status === 'delivered'
        ).length;

        // Get reviews count
        const reviewsGiven = await Review.countDocuments({ user: userId });

        res.json({
            success: true,
            data: {
                totalOrders,
                activeOrders,
                completedOrders,
                reviewsGiven
            }
        });
    } catch (error) {
        console.error('Error fetching user dashboard stats:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch dashboard statistics' }
        });
    }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -refreshTokens');
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch user profile' }
        });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const updates = req.body;
        const allowedUpdates = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'gender'];
        const filteredUpdates = {};

        // Filter allowed updates
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                filteredUpdates[key] = updates[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            filteredUpdates,
            { new: true, runValidators: true }
        ).select('-password -refreshTokens');

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to update profile' }
        });
    }
});

module.exports = router;