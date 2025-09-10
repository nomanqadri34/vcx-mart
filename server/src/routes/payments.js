const express = require('express');
const router = express.Router();
const razorpayService = require('../services/razorpayService');
const Order = require('../models/Order');
const logger = require('../utils/logger');
const { auth } = require('../middleware/auth');

// @route   POST /api/v1/payments/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify', auth, async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                error: 'Missing payment verification data'
            });
        }

        // Verify payment signature
        const isValid = razorpayService.verifyPayment(
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        );

        if (!isValid) {
            return res.status(400).json({
                success: false,
                error: 'Invalid payment signature'
            });
        }

        // Find the order by Razorpay order ID
        const order = await Order.findOne({ 'paymentDetails.transactionId': razorpay_order_id });

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Update order with payment details
        order.paymentStatus = 'paid';
        order.paymentDetails = {
            ...order.paymentDetails,
            paymentId: razorpay_payment_id,
            gatewayResponse: {
                ...order.paymentDetails.gatewayResponse,
                razorpay_payment_id,
                razorpay_signature,
                paidAt: new Date()
            }
        };
        order.status = 'confirmed';
        await order.save();

        logger.info(`Payment verified and completed for order ${order.orderNumber}`);

        res.json({
            success: true,
            message: 'Payment verified successfully',
            data: {
                orderId: order._id,
                orderNumber: order.orderNumber,
                paymentStatus: 'completed'
            }
        });

    } catch (error) {
        logger.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify payment'
        });
    }
});

// @route   POST /api/v1/payments/webhook/razorpay
// @desc    Handle Razorpay payment webhooks
// @access  Public
router.post('/webhook/razorpay', async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        const body = JSON.stringify(req.body);

        // Verify webhook signature
        const isValid = razorpayService.verifyWebhookSignature(body, signature);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                error: 'Invalid webhook signature'
            });
        }

        const event = req.body.event;
        const payload = req.body.payload;

        logger.info('Razorpay webhook received:', { event, payload });

        if (event === 'payment.captured') {
            const payment = payload.payment.entity;

            // Find order by Razorpay order ID
            const order = await Order.findOne({ 'paymentDetails.transactionId': payment.order_id });

            if (order && order.paymentStatus !== 'paid') {
                order.paymentStatus = 'paid';
                order.paymentDetails = {
                    ...order.paymentDetails,
                    paymentId: payment.id,
                    gatewayResponse: {
                        ...order.paymentDetails.gatewayResponse,
                        paidAt: new Date()
                    }
                };
                order.status = 'confirmed';
                await order.save();

                logger.info(`Payment captured for order ${order.orderNumber}`);
            }
        } else if (event === 'payment.failed') {
            const payment = payload.payment.entity;

            const order = await Order.findOne({ 'paymentDetails.transactionId': payment.order_id });

            if (order) {
                order.paymentStatus = 'failed';
                order.paymentDetails = {
                    ...order.paymentDetails,
                    gatewayResponse: {
                        ...order.paymentDetails.gatewayResponse,
                        failureReason: payment.error_description || 'Payment failed',
                        failedAt: new Date()
                    }
                };
                await order.save();

                logger.info(`Payment failed for order ${order.orderNumber}`);
            }
        }

        res.json({
            success: true,
            message: 'Webhook processed successfully'
        });

    } catch (error) {
        logger.error('Razorpay webhook error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process webhook'
        });
    }
});

// @route   GET /api/v1/payments/status/:orderId
// @desc    Get payment status for an order
// @access  Private
router.get('/status/:orderId', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Check if user owns this order (unless admin)
        if (req.user.role !== 'admin' && order.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }

        res.json({
            success: true,
            data: {
                orderId: order._id,
                orderNumber: order.orderNumber,
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod,
                amount: order.total,
                currency: 'INR',
                razorpayOrderId: order.paymentDetails?.transactionId,
                paidAt: order.paymentDetails?.gatewayResponse?.paidAt,
                createdAt: order.createdAt
            }
        });

    } catch (error) {
        logger.error('Get payment status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get payment status'
        });
    }
});

module.exports = router;
