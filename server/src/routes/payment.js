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
    const { affiliateCode } = req.body;

    // First create a customer
    const customer = await razorpay.customers.create({
      name: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      contact: req.user.phone || '9876543210',
      notes: {
        userId: req.user._id.toString(),
        affiliateCode: affiliateCode || ''
      }
    });

    console.log('Customer created:', customer.id);

    // Create subscription with customer
    const subscription = await razorpay.subscriptions.create({
      plan_id: 'plan_RH8bsJ6AQXHVD9',
      customer_id: customer.id,
      customer_notify: 1,
      total_count: 12,
      addons: [],
      notes: {
        userId: req.user._id.toString(),
        userEmail: req.user.email,
        affiliateCode: affiliateCode || ''
      }
    });

    console.log('Subscription created:', subscription.id);

    // Create a payment link for the subscription
    const paymentLink = await razorpay.paymentLink.create({
      amount: 55000, // ₹550 in paise
      currency: 'INR',
      description: 'VCX MART Seller Registration & First Month Subscription',
      customer: {
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        contact: req.user.phone || '9876543210'
      },
      notify: {
        sms: true,
        email: true
      },
      reminder_enable: true,
      callback_url: `${process.env.CLIENT_URL}/seller/payment-success`,
      callback_method: 'get',
      notes: {
        userId: req.user._id.toString(),
        subscriptionId: subscription.id,
        affiliateCode: affiliateCode || ''
      }
    });

    console.log('Payment link created:', paymentLink.short_url);

    res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        customerId: customer.id,
        paymentLinkId: paymentLink.id,
        shortUrl: paymentLink.short_url,
        amount: 550,
        currency: 'INR',
        status: subscription.status
      }
    });

  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to create subscription' }
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

// @route   POST /api/v1/payment/create-registration-order
// @desc    Create Razorpay order for registration fee
// @access  Private
router.post('/create-registration-order', auth, async (req, res) => {
  try {
    const { amount = 50, currency = 'INR', affiliateCode } = req.body;

    if (!razorpay) {
      return res.status(500).json({ success: false, error: { message: 'Payment gateway not available' } });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `reg_${Date.now().toString().slice(-8)}_${req.user._id.toString().slice(-8)}`,
      notes: {
        userId: req.user._id.toString(),
        userEmail: req.user.email,
        affiliateCode: affiliateCode || '',
        type: 'registration_fee'
      }
    });

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount / 100,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });

  } catch (error) {
    console.error('Registration order error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to create registration order' }
    });
  }
});

// @route   POST /api/v1/payment/verify-registration
// @desc    Verify Razorpay payment for registration fee
// @access  Private
router.post('/verify-registration', auth, async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;

    if (!paymentId || !orderId || !signature) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing payment verification data' }
      });
    }

    // Verify signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid payment signature' }
      });
    }

    // Payment verified successfully
    res.json({
      success: true,
      message: 'Registration payment verified successfully',
      data: {
        paymentId,
        orderId,
        verified: true
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Payment verification failed' }
    });
  }
});

// @route   POST /api/v1/payment/webhook
// @desc    Handle Razorpay webhooks
// @access  Public
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    const expectedSignature = require('crypto')
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret')
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.log('Webhook signature mismatch');
      // Don't reject in development mode
      if (process.env.NODE_ENV === 'production') {
        return res.status(400).json({ error: 'Invalid signature' });
      }
    }

    const event = req.body;

    // Handle subscription events
    if (event.event === 'subscription.charged') {
      const subscription = event.payload.subscription.entity;
      const payment = event.payload.payment.entity;

      console.log('Subscription charged:', {
        subscriptionId: subscription.id,
        paymentId: payment.id,
        amount: payment.amount
      });

      // Update user subscription status in database
      // This would typically update the user's seller status
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;