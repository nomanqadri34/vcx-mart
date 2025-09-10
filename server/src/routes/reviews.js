const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   POST /api/v1/products/:productId/reviews
// @desc    Add review for a product
// @access  Private
router.post('/:productId/reviews', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
    }

    const { productId } = req.params;
    const { rating, comment } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { message: 'Product not found' }
      });
    }

    // Check if user has purchased and received this product
    const deliveredOrder = await Order.findOne({
      customer: req.user._id,
      'items.product': productId,
      status: 'delivered'
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only review products you have purchased and received' }
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: { message: 'You have already reviewed this product' }
      });
    }

    // Create review
    const review = new Review({
      user: req.user._id,
      product: productId,
      rating,
      comment,
      verified: true
    });

    await review.save();

    // Update product rating
    await updateProductRating(productId);

    // Populate user data for response
    await review.populate('user', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: { review }
    });

  } catch (error) {
    logger.error('Add review error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to add review' }
    });
  }
});

// @route   GET /api/v1/products/:productId/reviews
// @desc    Get reviews for a product
// @access  Public
router.get('/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'firstName lastName')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ product: productId });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get reviews' }
    });
  }
});

// Helper function to update product rating
async function updateProductRating(productId) {
  try {
    const reviews = await Review.find({ product: productId });
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      
      await Product.findByIdAndUpdate(productId, {
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length
      });
    }
  } catch (error) {
    logger.error('Update product rating error:', error);
  }
}

module.exports = router;