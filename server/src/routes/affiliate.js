const express = require('express');
const { body, validationResult } = require('express-validator');
const Affiliate = require('../models/Affiliate');
const { auth } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   POST /api/v1/affiliate/apply
// @desc    Apply for affiliate program
// @access  Public
router.post('/apply', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('platform').trim().isLength({ min: 2 }).withMessage('Platform is required'),
  body('profileUrl').isURL().withMessage('Please provide a valid profile URL')
], async (req, res) => {
  try {
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

    const { name, email, platform, profileUrl } = req.body;

    // Check if affiliate already exists with this email
    const existingAffiliate = await Affiliate.findOne({ email });
    if (existingAffiliate) {
      return res.status(400).json({
        success: false,
        error: { message: 'Affiliate application already exists with this email' }
      });
    }

    // Create affiliate application
    const affiliate = new Affiliate({
      name,
      email,
      platform,
      profileUrl,
      status: 'pending'
    });

    // Generate unique affiliate code
    affiliate.generateAffiliateCode();
    await affiliate.save();

    res.status(201).json({
      success: true,
      message: 'Affiliate application submitted successfully',
      data: {
        affiliateId: affiliate._id,
        affiliateCode: affiliate.affiliateCode,
        status: affiliate.status
      }
    });

  } catch (error) {
    logger.error('Affiliate application error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error during affiliate application' }
    });
  }
});

// @route   GET /api/v1/affiliate/:code
// @desc    Get affiliate details by code
// @access  Public
router.get('/:code', async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ 
      affiliateCode: req.params.code,
      status: 'approved'
    }).select('name affiliateCode commissionRate');

    if (!affiliate) {
      return res.status(404).json({
        success: false,
        error: { message: 'Affiliate not found or not approved' }
      });
    }

    res.json({
      success: true,
      data: affiliate
    });

  } catch (error) {
    logger.error('Get affiliate error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error' }
    });
  }
});

// @route   GET /api/v1/affiliate/dashboard
// @desc    Get affiliate dashboard data
// @access  Private (Affiliate)
router.get('/dashboard', auth, async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ userId: req.user._id })
      .populate('referrals.sellerId', 'name email');

    if (!affiliate) {
      return res.status(404).json({
        success: false,
        error: { message: 'Affiliate not found' }
      });
    }

    res.json({
      success: true,
      data: {
        affiliate,
        stats: {
          totalReferrals: affiliate.totalReferrals,
          totalEarnings: affiliate.totalEarnings,
          pendingEarnings: affiliate.pendingEarnings,
          paidEarnings: affiliate.paidEarnings
        }
      }
    });

  } catch (error) {
    logger.error('Affiliate dashboard error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error' }
    });
  }
});

// @route   POST /api/v1/affiliate/payout-request
// @desc    Request payout
// @access  Private (Affiliate)
router.post('/payout-request', auth, [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('paymentMethod').isIn(['upi', 'bank_transfer']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
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

    const { amount, paymentMethod } = req.body;
    
    const affiliate = await Affiliate.findOne({ userId: req.user._id });
    if (!affiliate) {
      return res.status(404).json({
        success: false,
        error: { message: 'Affiliate not found' }
      });
    }

    if (amount > affiliate.pendingEarnings) {
      return res.status(400).json({
        success: false,
        error: { message: 'Insufficient pending earnings' }
      });
    }

    if (amount < 100) {
      return res.status(400).json({
        success: false,
        error: { message: 'Minimum payout amount is ₹100' }
      });
    }

    // Add payout request
    affiliate.payouts.push({
      amount,
      paymentMethod,
      status: 'pending'
    });

    await affiliate.save();

    res.json({
      success: true,
      message: 'Payout request submitted successfully'
    });

  } catch (error) {
    logger.error('Payout request error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error' }
    });
  }
});

module.exports = router;