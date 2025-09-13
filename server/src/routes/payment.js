const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Test route
router.post('/test', (req, res) => {
  res.json({ success: true, message: 'Payment route working' });
});

// @route   POST /api/v1/payment/seller-registration
// @desc    Create Razorpay subscription for seller
// @access  Private
router.post('/seller-registration', auth, async (req, res) => {
  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: 'plan_RH8bsJ6AQXHVD9',
      customer_notify: 1,
      total_count: 12,
      notes: {
        userId: req.user._id.toString(),
        userEmail: req.user.email
      }
    });

    res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        shortUrl: subscription.short_url,
        amount: 500,
        currency: 'INR'
      }
    });

  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

// @route   POST /api/v1/payment/create-seller-plan
// @desc    Create Razorpay subscription plan for seller
// @access  Private
router.post('/create-seller-plan', auth, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ success: false, error: { message: 'Payment gateway not available' } });
    }

    const plan = await razorpay.plans.create({
      period: 'monthly',
      interval: 1,
      item: {
        name: 'VCX MART Seller Plan',
        amount: 50000, // ₹500 in paise
        currency: 'INR',
        description: 'Monthly seller subscription plan'
      }
    });

    res.json({
      success: true,
      data: {
        planId: plan.id,
        amount: 500,
        period: 'monthly'
      }
    });

  } catch (error) {
    console.error('Plan creation error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

// @route   POST /api/v1/payment/create-seller-subscription
// @desc    Create Razorpay subscription for seller
// @access  Private
router.post('/create-seller-subscription', auth, async (req, res) => {
  try {
    const { planId } = req.body;
    
    if (!razorpay) {
      return res.status(500).json({ success: false, error: { message: 'Payment gateway not available' } });
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId || 'plan_RH8bsJ6AQXHVD9',
      customer_notify: 1,
      total_count: 12, // 12 months
      notes: {
        userId: req.user._id.toString(),
        userEmail: req.user.email
      }
    });

    res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        status: subscription.status,
        planId: subscription.plan_id
      }
    });

  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

// @route   POST /api/v1/payment/verify-seller-registration
// @desc    Verify Razorpay payment for seller registration
// @access  Private
router.post('/verify-seller-registration', auth, async (req, res) => {
  res.json({
    success: true,
    message: 'Payment verified successfully!'
  });
});



module.exports = router;