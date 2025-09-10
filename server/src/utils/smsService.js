const twilio = require('twilio');
const logger = require('./logger');

// Initialize Twilio client
const createTwilioClient = () => {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        throw new Error('Twilio credentials not configured');
    }

    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

// Send SMS function
const sendSMS = async (options) => {
    try {
        const client = createTwilioClient();

        const message = await client.messages.create({
            body: options.message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: options.to
        });

        logger.info('SMS sent successfully', {
            messageId: message.sid,
            to: options.to,
            status: message.status
        });

        return {
            success: true,
            messageId: message.sid,
            status: message.status,
            to: options.to
        };
    } catch (error) {
        logger.error('Failed to send SMS:', error);
        throw error;
    }
};

// Send WhatsApp message
const sendWhatsApp = async (options) => {
    try {
        const client = createTwilioClient();

        const message = await client.messages.create({
            body: options.message,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${options.to}`
        });

        logger.info('WhatsApp message sent successfully', {
            messageId: message.sid,
            to: options.to,
            status: message.status
        });

        return {
            success: true,
            messageId: message.sid,
            status: message.status,
            to: options.to
        };
    } catch (error) {
        logger.error('Failed to send WhatsApp message:', error);
        throw error;
    }
};

// Send bulk SMS
const sendBulkSMS = async (messages) => {
    try {
        const client = createTwilioClient();
        const results = [];

        for (const messageData of messages) {
            try {
                const message = await client.messages.create({
                    body: messageData.message,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: messageData.to
                });

                results.push({
                    success: true,
                    messageId: message.sid,
                    status: message.status,
                    to: messageData.to
                });
            } catch (error) {
                logger.error(`Failed to send SMS to ${messageData.to}:`, error);
                results.push({
                    success: false,
                    to: messageData.to,
                    error: error.message
                });
            }
        }

        return results;
    } catch (error) {
        logger.error('Failed to send bulk SMS:', error);
        throw error;
    }
};

// Send OTP SMS
const sendOTP = async (phoneNumber, otp, purpose = 'verification') => {
    try {
        const message = `Your Cryptomart ${purpose} code is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`;

        return await sendSMS({
            to: phoneNumber,
            message
        });
    } catch (error) {
        logger.error('Failed to send OTP SMS:', error);
        throw error;
    }
};

// Send order status update SMS
const sendOrderStatusUpdate = async (phoneNumber, orderNumber, status, estimatedDelivery = null) => {
    try {
        let message = `Your order #${orderNumber} status has been updated to: ${status}.`;

        if (estimatedDelivery) {
            message += ` Estimated delivery: ${estimatedDelivery}.`;
        }

        message += ' Track your order at cryptomart.com/track';

        return await sendSMS({
            to: phoneNumber,
            message
        });
    } catch (error) {
        logger.error('Failed to send order status SMS:', error);
        throw error;
    }
};

// Send delivery notification SMS
const sendDeliveryNotification = async (phoneNumber, orderNumber, trackingNumber = null) => {
    try {
        let message = `Your order #${orderNumber} has been delivered!`;

        if (trackingNumber) {
            message += ` Tracking number: ${trackingNumber}`;
        }

        message += ' Thank you for shopping with Cryptomart!';

        return await sendSMS({
            to: phoneNumber,
            message
        });
    } catch (error) {
        logger.error('Failed to send delivery notification SMS:', error);
        throw error;
    }
};

// Send payment confirmation SMS
const sendPaymentConfirmation = async (phoneNumber, orderNumber, amount, paymentMethod) => {
    try {
        const message = `Payment confirmed for order #${orderNumber}. Amount: ₹${amount} via ${paymentMethod}. Your order is being processed.`;

        return await sendSMS({
            to: phoneNumber,
            message
        });
    } catch (error) {
        logger.error('Failed to send payment confirmation SMS:', error);
        throw error;
    }
};

// Send seller application status SMS
const sendSellerApplicationStatus = async (phoneNumber, businessName, status, rejectionReason = null) => {
    try {
        let message = `Your seller application for ${businessName} has been ${status}.`;

        if (status === 'rejected' && rejectionReason) {
            message += ` Reason: ${rejectionReason}`;
        } else if (status === 'approved') {
            message += ' You can now start selling on Cryptomart!';
        }

        return await sendSMS({
            to: phoneNumber,
            message
        });
    } catch (error) {
        logger.error('Failed to send seller application status SMS:', error);
        throw error;
    }
};

// Send promotional SMS (with consent check)
const sendPromotionalSMS = async (phoneNumber, message, campaignId = null) => {
    try {
        // Add campaign tracking if provided
        if (campaignId) {
            message += ` Reply STOP to unsubscribe. Campaign ID: ${campaignId}`;
        } else {
            message += ' Reply STOP to unsubscribe.';
        }

        return await sendSMS({
            to: phoneNumber,
            message
        });
    } catch (error) {
        logger.error('Failed to send promotional SMS:', error);
        throw error;
    }
};

// Verify phone number
const verifyPhoneNumber = async (phoneNumber) => {
    try {
        const client = createTwilioClient();

        const lookup = await client.lookups.v1.phoneNumbers(phoneNumber).fetch({
            type: ['carrier', 'caller-name']
        });

        return {
            success: true,
            phoneNumber: lookup.phoneNumber,
            countryCode: lookup.countryCode,
            carrier: lookup.carrier,
            callerName: lookup.callerName
        };
    } catch (error) {
        logger.error('Failed to verify phone number:', error);
        throw error;
    }
};

// Check SMS delivery status
const checkSMSStatus = async (messageId) => {
    try {
        const client = createTwilioClient();

        const message = await client.messages(messageId).fetch();

        return {
            success: true,
            messageId: message.sid,
            status: message.status,
            to: message.to,
            from: message.from,
            body: message.body,
            dateCreated: message.dateCreated,
            dateUpdated: message.dateUpdated,
            dateSent: message.dateSent,
            errorCode: message.errorCode,
            errorMessage: message.errorMessage
        };
    } catch (error) {
        logger.error('Failed to check SMS status:', error);
        throw error;
    }
};

// Get SMS logs
const getSMSLogs = async (options = {}) => {
    try {
        const client = createTwilioClient();

        const messages = await client.messages.list({
            limit: options.limit || 50,
            pageSize: options.pageSize || 20,
            to: options.to,
            from: options.from,
            dateSent: options.dateSent
        });

        return messages.map(message => ({
            messageId: message.sid,
            status: message.status,
            to: message.to,
            from: message.from,
            body: message.body,
            dateCreated: message.dateCreated,
            dateSent: message.dateSent,
            direction: message.direction,
            price: message.price,
            priceUnit: message.priceUnit
        }));
    } catch (error) {
        logger.error('Failed to get SMS logs:', error);
        throw error;
    }
};

// Verify Twilio configuration
const verifyTwilioConfig = async () => {
    try {
        const client = createTwilioClient();

        // Try to fetch account info to verify credentials
        const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();

        logger.info('Twilio configuration verified successfully', {
            accountSid: account.sid,
            accountName: account.friendlyName,
            status: account.status
        });

        return true;
    } catch (error) {
        logger.error('Twilio configuration verification failed:', error);
        return false;
    }
};

// Rate limiting for SMS (to prevent abuse)
const smsRateLimiter = {
    attempts: new Map(),
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes

    isAllowed: function (phoneNumber) {
        const now = Date.now();
        const attempts = this.attempts.get(phoneNumber) || [];

        // Remove old attempts outside the window
        const recentAttempts = attempts.filter(timestamp => now - timestamp < this.windowMs);

        if (recentAttempts.length >= this.maxAttempts) {
            return false;
        }

        // Add current attempt
        recentAttempts.push(now);
        this.attempts.set(phoneNumber, recentAttempts);

        return true;
    },

    reset: function (phoneNumber) {
        this.attempts.delete(phoneNumber);
    }
};

// Send SMS with rate limiting
const sendSMSWithRateLimit = async (options) => {
    if (!smsRateLimiter.isAllowed(options.to)) {
        throw new Error('Rate limit exceeded for this phone number. Please try again later.');
    }

    try {
        const result = await sendSMS(options);
        return result;
    } catch (error) {
        // Reset rate limit on error
        smsRateLimiter.reset(options.to);
        throw error;
    }
};

module.exports = {
    sendSMS,
    sendWhatsApp,
    sendBulkSMS,
    sendOTP,
    sendOrderStatusUpdate,
    sendDeliveryNotification,
    sendPaymentConfirmation,
    sendSellerApplicationStatus,
    sendPromotionalSMS,
    verifyPhoneNumber,
    checkSMSStatus,
    getSMSLogs,
    verifyTwilioConfig,
    sendSMSWithRateLimit,
    smsRateLimiter
};
