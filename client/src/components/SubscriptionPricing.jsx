import React, { useState, useEffect } from 'react';
import { CheckIcon, StarIcon } from '@heroicons/react/24/outline';
import { subscriptionAPI } from '../services/api';
import toast from 'react-hot-toast';

const SubscriptionPricing = ({ onSubscribe }) => {
  const [loading, setLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(550);

  useEffect(() => {
    // Check if it's after October 1, 2024
    const oct1 = new Date('2024-10-01T00:00:00+05:30');
    const now = new Date();
    
    if (now >= oct1) {
      setCurrentPrice(850);
    }
  }, []);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const subscriptionData = {
        planType: 'seller',
        amount: currentPrice,
        currency: 'INR'
      };

      const response = await subscriptionAPI.createSubscription(subscriptionData);
      
      if (response.success) {
        // Handle Razorpay payment
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: response.data.amount,
          currency: response.data.currency,
          name: 'VCX MART',
          description: 'Seller Subscription',
          order_id: response.data.orderId,
          handler: function (paymentResponse) {
            toast.success('Subscription activated successfully!');
            if (onSubscribe) onSubscribe(paymentResponse);
          },
          prefill: {
            name: response.data.customerInfo?.name,
            email: response.data.customerInfo?.email,
            contact: response.data.customerInfo?.phone
          },
          theme: {
            color: '#f59e0b'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error(response.error || 'Failed to create subscription');
      }
    } catch (error) {
      toast.error('Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  const isEarlyBird = currentPrice === 550;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-saffron-200">
      {isEarlyBird && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-2">
          <div className="flex items-center justify-center space-x-1">
            <StarIcon className="h-4 w-4" />
            <span className="text-sm font-semibold">Early Bird Special - Limited Time!</span>
            <StarIcon className="h-4 w-4" />
          </div>
        </div>
      )}
      
      <div className="p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Seller Subscription</h3>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-4xl font-bold text-saffron-600">₹{currentPrice}</span>
            {isEarlyBird && (
              <span className="text-lg text-gray-500 line-through">₹850</span>
            )}
          </div>
          <p className="text-gray-600 mt-2">One-time payment</p>
          {isEarlyBird && (
            <p className="text-green-600 text-sm font-medium mt-1">
              Save ₹300 - Register before Oct 1st!
            </p>
          )}
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-3">
            <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">List unlimited products</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">Direct payment to your account via Razorpay</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">No commission fees - keep 100% of your earnings</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">Analytics dashboard</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">Affiliate program eligibility</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">Priority customer support</span>
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full bg-gradient-to-r from-saffron-500 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-saffron-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? 'Processing...' : 'Subscribe Now'}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          * Price increases to ₹850 from October 1st, 2024
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPricing;