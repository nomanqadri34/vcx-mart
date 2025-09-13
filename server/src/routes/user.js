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

        // Filter allowed updates and handle empty values
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                // Don't include empty gender or empty strings
                if (key === 'gender' && !updates[key]) {
                    return;
                }
                // Don't include empty strings for other fields
                if (updates[key] === '') {
                    return;
                }
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

// Get user addresses
router.get('/addresses', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            success: true,
            data: {
                addresses: user.addresses || []
            }
        });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch addresses' }
        });
    }
});

// Add new address
router.post('/addresses', auth, async (req, res) => {
    try {
        const { type, fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;
        const user = await User.findById(req.user._id);

        // Create new address object
        const newAddress = {
            type,
            fullName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            pincode,
            isDefault
        };

        // If this is the first address or isDefault is true, handle default address logic
        if (isDefault || user.addresses.length === 0) {
            // Remove default from other addresses
            user.addresses.forEach(addr => addr.isDefault = false);
            newAddress.isDefault = true;
        }

        // Add the new address
        user.addresses.push(newAddress);
        await user.save();

        res.json({
            success: true,
            data: {
                address: newAddress
            }
        });
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to add address' }
        });
    }
});

// Update address
router.put('/addresses/:addressId', auth, async (req, res) => {
    try {
        const { addressId } = req.params;
        const updateData = req.body;
        const user = await User.findById(req.user._id);

        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
        if (addressIndex === -1) {
            return res.status(404).json({
                success: false,
                error: { message: 'Address not found' }
            });
        }

        // If setting this address as default, remove default from others
        if (updateData.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        // Update the address
        Object.assign(user.addresses[addressIndex], updateData);
        await user.save();

        res.json({
            success: true,
            data: {
                address: user.addresses[addressIndex]
            }
        });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to update address' }
        });
    }
});

// Delete address
router.delete('/addresses/:addressId', auth, async (req, res) => {
    try {
        const { addressId } = req.params;
        const user = await User.findById(req.user._id);

        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
        if (addressIndex === -1) {
            return res.status(404).json({
                success: false,
                error: { message: 'Address not found' }
            });
        }

        // Remove the address
        user.addresses.splice(addressIndex, 1);

        // If deleted address was default and there are other addresses, make first one default
        if (user.addresses.length > 0 && !user.addresses.some(addr => addr.isDefault)) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Address deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to delete address' }
        });
    }
});

module.exports = router;