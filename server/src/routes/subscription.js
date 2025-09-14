const express = require('express');
const router = express.Router();
const SellerApplication = require('../models/SellerApplication');
const razorpayService = require('../services/razorpayService');
const { protect, authorize } = require('../middleware/auth');

// Create registration payment order
router.post('/registration/create', protect, async (req, res) => {
  try {
    const { applicationId } = req.body;
    
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

    if (application.registrationPaid) {
      return res.status(400).json({
        success: false,
        error: { message: 'Registration fee already paid' }
      });
    }

    const order = await razorpayService.createRegistrationOrder({
      applicationId: application.applicationId,
      businessName: application.businessName
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
    console.error('Registration order creation error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to create registration order' }
    });
  }
});

// Verify registration payment
router.post('/registration/verify', protect, async (req, res) => {
  try {
    const { applicationId, paymentId, orderId, signature } = req.body;
    
    const isValid = razorpayService.verifyPaymentSignature(paymentId, orderId, signature);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid payment signature' }
      });
    }

    const application = await SellerApplication.findOne({ 
      applicationId,
      userId: req.user._id 
    });

    if (application) {
      application.registrationPaid = true;
      application.registrationPaymentId = paymentId;
      application.registrationPaidAt = new Date();
      await application.save();
    }

    res.json({
      success: true,
      message: 'Registration payment verified successfully'
    });

  } catch (error) {
    console.error('Registration payment verification error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to verify registration payment' }
    });
  }
});

// Create subscription for seller application
router.post('/create', protect, async (req, res) => {
  try {
    const { applicationId } = req.body;
    
    // Find seller application
    const application = await SellerApplication.findOne({ 
      applicationId,
      userId: req.user._id 
    }).populate('userId', 'firstName lastName email phone');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: { message: 'Application not found' }
      });
    }

    if (!application.registrationPaid) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please complete registration payment first' }
      });
    }

    if (application.subscriptionStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        error: { message: 'Subscription already created' }
      });
    }

    // Get current plan
    const pricing = razorpayService.getPricing();
    const currentPlan = pricing.subscription[application.subscriptionPlan || pricing.currentPlan];

    if (!currentPlan || !currentPlan.active) {
      return res.status(400).json({
        success: false,
        error: { message: 'Selected plan is no longer available' }
      });
    }

    // Create customer in Razorpay
    const customer = await razorpayService.createCustomer({
      name: `${application.userId.firstName} ${application.userId.lastName}`,
      email: application.businessEmail,
      phone: application.businessPhone,
      businessName: application.businessName,
      applicationId: application.applicationId
    });

    // Create subscription with predefined plan
    const subscription = await razorpayService.createSubscription({
      planType: application.subscriptionPlan,
      customerId: customer.id,
      applicationId: application.applicationId,
      businessName: application.businessName
    });

    // Generate subscription link
    const subscriptionLink = `https://rzp.io/i/${subscription.short_url || subscription.id}`;

    // Update application with subscription details
    await application.createSubscription(
      subscription.id,
      customer.id,
      subscriptionLink
    );

    res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        subscriptionLink,
        amount: currentPlan.amount,
        plan: currentPlan.name
      }
    });

  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to create subscription' }
    });
  }
});

// Webhook to handle subscription events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = req.body;
    
    if (event.event === 'subscription.authenticated') {
      const subscriptionId = event.payload.subscription.entity.id;
      
      const application = await SellerApplication.findOne({ 
        razorpaySubscriptionId: subscriptionId 
      });
      
      if (application) {
        await application.activateSubscription();
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
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

    let subscriptionDetails = null;
    if (application.razorpaySubscriptionId) {
      try {
        subscriptionDetails = await razorpayService.getSubscription(
          application.razorpaySubscriptionId
        );
      } catch (error) {
        console.error('Failed to fetch subscription details:', error);
      }
    }

    res.json({
      success: true,
      data: {
        subscriptionStatus: application.subscriptionStatus,
        paymentStatus: application.paymentStatus,
        subscriptionLink: application.subscriptionLink,
        subscriptionAmount: application.subscriptionAmount,
        subscriptionPlan: application.subscriptionPlan,
        subscriptionDetails
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

// Admin: Get all subscriptions
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    if (status) {
      query.subscriptionStatus = status;
    }

    const applications = await SellerApplication.paginate(query, {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: 'userId',
      sort: { submittedAt: -1 }
    });

    const totalRevenue = await SellerApplication.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$subscriptionAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        applications: applications.docs,
        pagination: {
          page: applications.page,
          pages: applications.totalPages,
          total: applications.totalDocs
        },
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Get all subscriptions error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get subscriptions' }
    });
  }
});

module.exports = router;