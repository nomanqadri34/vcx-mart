const Razorpay = require('razorpay');
const crypto = require('crypto');
const logger = require('../utils/logger');

class RazorpayService {
    constructor() {
        this.keyId = process.env.RAZORPAY_KEY_ID;
        this.keySecret = process.env.RAZORPAY_KEY_SECRET;
        this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        this.testMode = process.env.RAZORPAY_TEST_MODE === 'true';

        // Initialize Razorpay instance
        if (this.keyId && this.keySecret) {
            this.razorpay = new Razorpay({
                key_id: this.keyId,
                key_secret: this.keySecret,
            });
            logger.info(`Razorpay Service initialized in ${this.testMode ? 'TEST' : 'LIVE'} mode`);
        } else {
            logger.warn('Razorpay credentials not configured, will use mock mode');
        }
    }

    // Create payment order
    async createOrder(orderData) {
        try {
            // Check if in mock mode (no credentials)
            if (!this.razorpay) {
                return this.createMockOrder(orderData);
            }

            const options = {
                amount: Math.round(orderData.total * 100), // Convert to paise
                currency: 'INR',
                receipt: orderData.orderNumber,
                notes: {
                    orderNumber: orderData.orderNumber,
                    userId: orderData.userId,
                    customerEmail: orderData.customer.email,
                    customerPhone: orderData.customer.phone
                }
            };

            const razorpayOrder = await this.razorpay.orders.create(options);

            logger.info('Razorpay order created:', {
                orderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency
            });

            return {
                success: true,
                data: {
                    orderId: razorpayOrder.id,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    keyId: this.keyId,
                    orderNumber: orderData.orderNumber,
                    customerInfo: {
                        name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
                        email: orderData.customer.email,
                        contact: orderData.customer.phone
                    },
                    testMode: this.testMode
                }
            };

        } catch (error) {
            logger.error('Razorpay create order error:', error);

            // In development, fall back to mock mode on any error
            if (process.env.NODE_ENV === 'development') {
                logger.info('Error occurred, falling back to mock mode for development');
                return this.createMockOrder(orderData);
            }

            return {
                success: false,
                error: error.message || 'Failed to create payment order'
            };
        }
    }

    // Verify payment signature
    verifyPayment(paymentId, orderId, signature) {
        try {
            const body = orderId + "|" + paymentId;
            const expectedSignature = crypto
                .createHmac('sha256', this.keySecret)
                .update(body.toString())
                .digest('hex');

            return expectedSignature === signature;
        } catch (error) {
            logger.error('Payment verification error:', error);
            return false;
        }
    }

    // Get payment details
    async getPayment(paymentId) {
        try {
            if (!this.razorpay) {
                return {
                    success: false,
                    error: 'Razorpay not configured'
                };
            }

            const payment = await this.razorpay.payments.fetch(paymentId);
            return {
                success: true,
                data: payment
            };
        } catch (error) {
            logger.error('Get payment error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Verify webhook signature
    verifyWebhookSignature(body, signature) {
        try {
            const expectedSignature = crypto
                .createHmac('sha256', this.webhookSecret)
                .update(body)
                .digest('hex');

            return expectedSignature === signature;
        } catch (error) {
            logger.error('Webhook signature verification error:', error);
            return false;
        }
    }

    // Create mock order for development
    createMockOrder(orderData) {
        logger.info('Creating mock Razorpay order for development');

        return {
            success: true,
            data: {
                orderId: `order_MOCK${Date.now()}`,
                amount: Math.round(orderData.total * 100),
                currency: 'INR',
                keyId: 'rzp_test_mock_key',
                orderNumber: orderData.orderNumber,
                customerInfo: {
                    name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
                    email: orderData.customer.email,
                    contact: orderData.customer.phone
                },
                testMode: true,
                mockMode: true
            }
        };
    }

    // Create refund
    async createRefund(paymentId, amount, reason) {
        try {
            if (!this.razorpay) {
                return {
                    success: false,
                    error: 'Razorpay not configured'
                };
            }

            const refund = await this.razorpay.payments.refund(paymentId, {
                amount: Math.round(amount * 100), // Convert to paise
                notes: {
                    reason: reason || 'Customer refund request'
                }
            });

            logger.info('Refund created:', refund);
            return {
                success: true,
                data: refund
            };
        } catch (error) {
            logger.error('Create refund error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new RazorpayService();
