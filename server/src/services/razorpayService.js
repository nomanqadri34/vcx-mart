const Razorpay = require('razorpay');
const PRICING = require('../config/razorpayPlans');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

class RazorpayService {
  // Create subscription plan
  async createPlan(planData) {
    try {
      const plan = await razorpay.plans.create({
        period: 'monthly',
        interval: 1,
        item: {
          name: planData.name,
          amount: planData.amount * 100, // Convert to paise
          currency: 'INR',
          description: planData.description
        }
      });
      return plan;
    } catch (error) {
      throw new Error(`Failed to create plan: ${error.message}`);
    }
  }

  // Create customer
  async createCustomer(customerData) {
    try {
      const customer = await razorpay.customers.create({
        name: customerData.name,
        email: customerData.email,
        contact: customerData.phone,
        notes: {
          business_name: customerData.businessName,
          application_id: customerData.applicationId
        }
      });
      return customer;
    } catch (error) {
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  // Create registration payment order
  async createRegistrationOrder(orderData) {
    try {
      const order = await razorpay.orders.create({
        amount: PRICING.registration.amount * 100,
        currency: 'INR',
        receipt: `reg_${orderData.applicationId}`,
        notes: {
          type: 'registration',
          application_id: orderData.applicationId,
          business_name: orderData.businessName
        }
      });
      return order;
    } catch (error) {
      throw new Error(`Failed to create registration order: ${error.message}`);
    }
  }

  // Create subscription
  async createSubscription(subscriptionData) {
    try {
      const planConfig = PRICING.subscription[subscriptionData.planType];
      if (!planConfig) {
        throw new Error('Invalid plan type');
      }

      const subscription = await razorpay.subscriptions.create({
        plan_id: planConfig.id,
        customer_id: subscriptionData.customerId,
        quantity: 1,
        total_count: 12,
        notes: {
          application_id: subscriptionData.applicationId,
          business_name: subscriptionData.businessName
        }
      });
      return subscription;
    } catch (error) {
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId) {
    try {
      const subscription = await razorpay.subscriptions.fetch(subscriptionId);
      return subscription;
    } catch (error) {
      throw new Error(`Failed to fetch subscription: ${error.message}`);
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await razorpay.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  // Create order for product sales with route transfer
  async createOrderWithTransfer(orderData) {
    try {
      const order = await razorpay.orders.create({
        amount: orderData.amount * 100, // Convert to paise
        currency: 'INR',
        receipt: orderData.receipt,
        transfers: [{
          account: orderData.sellerAccountId,
          amount: orderData.amount * 100, // Full amount to seller
          currency: 'INR',
          on_hold: 0 // Immediate transfer
        }],
        notes: {
          order_id: orderData.orderId,
          seller_id: orderData.sellerId,
          buyer_id: orderData.buyerId
        }
      });
      return order;
    } catch (error) {
      throw new Error(`Failed to create order with transfer: ${error.message}`);
    }
  }

  // Verify payment signature
  verifyPaymentSignature(paymentId, orderId, signature) {
    const crypto = require('crypto');
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    return expectedSignature === signature;
  }

  // Get pricing information
  getPricing() {
    const currentDate = new Date();
    const launchDate = new Date('2025-10-01');
    
    return {
      registration: PRICING.registration,
      subscription: {
        early_bird: {
          ...PRICING.subscription.early_bird,
          active: currentDate < launchDate
        },
        regular: {
          ...PRICING.subscription.regular,
          active: true
        }
      },
      currentPlan: currentDate < launchDate ? 'early_bird' : 'regular'
    };
  }

  // Get plans (alias for getPricing)
  getPlans() {
    return this.getPricing().subscription;
  }
}

module.exports = new RazorpayService();