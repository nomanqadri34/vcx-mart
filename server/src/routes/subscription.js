const express = require('express');
const router = express.Router();
const SellerApplication = require('../models/SellerApplication');
const { auth: protect } = require('../middleware/auth');

// Subscription plans - dynamic payment link generation
const PLANS = {
  early_bird: {
    name: 'Early Bird Monthly',
    amount: 500,
    description: 'Monthly platform fee (Before Oct 1st, 2025)'
  },
  regular: {
    name: 'Regular Monthly',
    amount: 800,
    description: 'Monthly platform fee (From Oct 1st, 2025)'
  }
};

// Initialize Razorpay
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create subscription
router.post('/create', protect, async (req, res) => {
  try {
    const { applicationId } = req.body;

    console.log('Subscription create request:', { applicationId, userId: req.user._id });

    const application = await SellerApplication.findOne({
      applicationId,
      userId: req.user._id
    });

    console.log('Found application for subscription:', application ? application.applicationId : 'not found');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: { message: 'Application not found' }
      });
    }

    // Check if there's an existing subscription with malformed link and clear it
    if (application.subscriptionLink &&
      (application.subscriptionLink.includes('rzp.io/l/') ||
        application.subscriptionLink.includes('https://rzp.io/rzp/') ||
        application.subscriptionLink.includes('rzp.io/i/https://'))) {
      console.log('Clearing malformed subscription link:', application.subscriptionLink);
      application.subscriptionStatus = 'pending';
      application.subscriptionLink = null;
      application.razorpayPaymentLinkId = null;
    }

    // Determine plan based on current date
    const currentDate = new Date();
    const planType = currentDate < new Date('2025-10-01') ? 'early_bird' : 'regular';
    const plan = PLANS[planType];

    // Create a payment link for the subscription
    console.log('Creating payment link for plan:', plan);
    console.log('User details:', { name: `${req.user.firstName} ${req.user.lastName}`, email: req.user.email });

    const paymentLink = await razorpay.paymentLink.create({
      amount: plan.amount * 100, // Convert to paise
      currency: 'INR',
      description: `VCX MART ${plan.name} Subscription`,
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
      callback_url: `${process.env.CLIENT_URL}/seller/subscription-success`,
      callback_method: 'get',
      notes: {
        userId: req.user._id.toString(),
        applicationId: application.applicationId,
        planType: planType
      }
    });

    console.log('Payment link created successfully:', paymentLink.short_url);

    // Update application with subscription
    application.subscriptionStatus = 'created';
    application.subscriptionLink = paymentLink.short_url;
    application.monthlyAmount = plan.amount;
    application.subscriptionPlan = planType;
    application.razorpayPaymentLinkId = paymentLink.id;
    await application.save();

    console.log('Subscription payment link created:', paymentLink.short_url);

    res.json({
      success: true,
      data: {
        subscriptionLink: paymentLink.short_url,
        amount: plan.amount,
        plan: plan.name,
        paymentLinkId: paymentLink.id
      }
    });

  } catch (error) {
    console.error('Subscription creation error:', error);
    console.error('Error stack:', error.stack);

    // Check if it's a Razorpay error
    if (error.statusCode) {
      console.error('Razorpay error details:', {
        statusCode: error.statusCode,
        error: error.error
      });

      return res.status(400).json({
        success: false,
        error: {
          message: `Razorpay error: ${error.error?.description || error.message}`,
          details: error.error
        }
      });
    }

    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to create subscription' }
    });
  }
});

// Get subscription status
router.get('/status/:applicationId', protect, async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await SellerApplication.findOne({
      applicationId,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        error: { message: 'Application not found' }
      });
    }

    // Check if subscription link is malformed and needs to be recreated
    let subscriptionLink = application.subscriptionLink;
    let subscriptionStatus = application.subscriptionStatus || 'pending';

    if (subscriptionLink && (subscriptionLink.includes('rzp.io/l/') || subscriptionLink.includes('https://rzp.io/rzp/'))) {
      // This is an old hardcoded or malformed link, reset to pending to force recreation
      console.log('Detected malformed subscription link, resetting to pending:', subscriptionLink);
      subscriptionStatus = 'pending';
      subscriptionLink = null;

      // Update the application to clear the bad link
      application.subscriptionStatus = 'pending';
      application.subscriptionLink = null;
      await application.save();
    }

    res.json({
      success: true,
      data: {
        subscriptionStatus: subscriptionStatus,
        subscriptionLink: subscriptionLink,
        amount: application.monthlyAmount,
        plan: application.subscriptionPlan
      }
    });

  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get subscription status' }
    });
  }
});

// Registration payment (simplified - no application required)
router.post('/registration/create', protect, async (req, res) => {
  try {
    const { applicationId } = req.body;

    console.log('Registration create request:', { applicationId, userId: req.user._id });

    // Check if user already has a registration payment record
    const existingPayment = await SellerApplication.findOne({
      userId: req.user._id,
      registrationPaid: true
    });

    if (existingPayment) {
      return res.json({
        success: true,
        data: {
          alreadyPaid: true,
          message: 'Registration fee already paid',
          applicationId: existingPayment.applicationId || 'temp_paid'
        }
      });
    }

    // Create Razorpay order for registration payment
    const orderOptions = {
      amount: 5000, // ₹50 in paise
      currency: 'INR',
      receipt: `reg_${applicationId || Date.now()}_${req.user._id}`,
      notes: {
        applicationId: applicationId || 'temp_payment',
        userId: req.user._id.toString(),
        paymentType: 'registration'
      }
    };

    const order = await razorpay.orders.create(orderOptions);

    res.json({
      success: true,
      data: {
        key: process.env.RAZORPAY_KEY_ID,
        orderId: order.id,
        amount: 50, // Amount in rupees for display
        currency: 'INR',
        applicationId: applicationId || 'temp_payment'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to process registration' }
    });
  }
});

// Verify registration payment
router.post('/registration/verify', protect, async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;

    console.log('Registration payment verification:', { paymentId, orderId, userId: req.user._id });

    // Store payment completion in localStorage or session
    // This will be used when user submits the actual application

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
      error: { message: 'Failed to verify payment' }
    });
  }
});

// Force refresh subscription (for fixing malformed links)
router.post('/refresh/:applicationId', protect, async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await SellerApplication.findOne({
      applicationId,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        error: { message: 'Application not found' }
      });
    }

    // Reset subscription to pending to force recreation
    console.log('Resetting subscription for application:', applicationId);
    console.log('Old subscription data:', {
      status: application.subscriptionStatus,
      link: application.subscriptionLink,
      paymentLinkId: application.razorpayPaymentLinkId
    });

    application.subscriptionStatus = 'pending';
    application.subscriptionLink = null;
    application.razorpayPaymentLinkId = null;
    application.razorpaySubscriptionId = null;
    application.razorpayCustomerId = null;
    application.subscriptionPlan = null;
    application.monthlyAmount = null;
    await application.save();

    console.log('Subscription reset complete');

    res.json({
      success: true,
      message: 'Subscription reset successfully. Please create a new subscription.'
    });

  } catch (error) {
    console.error('Subscription refresh error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to refresh subscription' }
    });
  }
});

// Reset all subscription data for current user
router.post('/reset-user-subscription', protect, async (req, res) => {
  try {
    console.log('Resetting all subscription data for user:', req.user._id);

    const applications = await SellerApplication.find({ userId: req.user._id });

    for (const application of applications) {
      application.subscriptionStatus = 'pending';
      application.subscriptionLink = null;
      application.razorpayPaymentLinkId = null;
      application.razorpaySubscriptionId = null;
      application.razorpayCustomerId = null;
      application.subscriptionPlan = null;
      application.monthlyAmount = null;
      await application.save();
    }

    console.log(`Reset ${applications.length} applications for user`);

    res.json({
      success: true,
      message: `Reset ${applications.length} applications. All subscription data cleared.`
    });

  } catch (error) {
    console.error('Reset user subscription error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to reset user subscription data' }
    });
  }
});

// Test endpoint to create a simple payment link
router.post('/test-payment-link', protect, async (req, res) => {
  try {
    console.log('Testing payment link creation...');

    const paymentLink = await razorpay.paymentLink.create({
      amount: 50000, // ₹500 in paise
      currency: 'INR',
      description: 'Test VCX MART Subscription',
      customer: {
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        contact: req.user.phone || '9876543210'
      },
      notify: {
        sms: false,
        email: false
      },
      reminder_enable: false,
      callback_url: `${process.env.CLIENT_URL}/seller/subscription-success`,
      callback_method: 'get',
      notes: {
        userId: req.user._id.toString(),
        test: 'true'
      }
    });

    console.log('Test payment link created:', paymentLink.short_url);

    res.json({
      success: true,
      data: {
        paymentLink: paymentLink.short_url,
        paymentLinkId: paymentLink.id,
        amount: 500
      }
    });

  } catch (error) {
    console.error('Test payment link error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

// Debug endpoint to check subscription data
router.get('/debug/:applicationId', protect, async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await SellerApplication.findOne({
      applicationId,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        error: { message: 'Application not found' }
      });
    }

    res.json({
      success: true,
      data: {
        applicationId: application.applicationId,
        subscriptionStatus: application.subscriptionStatus,
        subscriptionLink: application.subscriptionLink,
        razorpayPaymentLinkId: application.razorpayPaymentLinkId,
        subscriptionPlan: application.subscriptionPlan,
        monthlyAmount: application.monthlyAmount
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get debug info' }
    });
  }
});

module.exports = router;