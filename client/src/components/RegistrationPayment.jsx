import React, { useState } from 'react';
import { subscriptionAPI } from '../services/api';
import api from '../services/api';
import toast from 'react-hot-toast';

const RegistrationPayment = ({ applicationId, onPaymentSuccess, showApplicationForm = true }) => {
  const [loading, setLoading] = useState(false);
  const [currentApplicationId, setCurrentApplicationId] = useState(applicationId);

  const handleRegistrationPayment = async () => {
    setLoading(true);
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Please login to continue');
        return;
      }

      // Check if token is expired
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        if (payload.exp < currentTime) {
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('accessToken');
          setTimeout(() => window.location.href = '/login', 2000);
          return;
        }
      } catch (error) {
        toast.error('Invalid session. Please login again.');
        localStorage.removeItem('accessToken');
        setTimeout(() => window.location.href = '/login', 2000);
        return;
      }



      // Create registration payment order
      const orderResponse = await subscriptionAPI.createRegistrationOrder(applicationId || 'temp_payment');

      if (!orderResponse.success) {
        toast.error(orderResponse.error || 'Failed to create payment order');
        return;
      }

      // Check if registration fee already paid
      if (orderResponse.data?.alreadyPaid) {
        toast.success('Registration fee already paid! You can now proceed to subscription setup.');
        // Store payment completion
        localStorage.setItem('registrationPaymentCompleted', 'true');
        localStorage.setItem('registrationPaymentId', 'already_paid');
        onPaymentSuccess();
        return;
      }

      // Create Razorpay payment
      const options = {
        key: orderResponse.data.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount * 100, // Convert to paise
        currency: orderResponse.data.currency || 'INR',
        name: 'VCX MART',
        description: 'Seller Registration Fee - ₹50',
        order_id: orderResponse.data.orderId,
        handler: async (response) => {
          try {
            const verifyResponse = await subscriptionAPI.verifyRegistrationPayment({
              applicationId: applicationId,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });

            if (verifyResponse.success) {
              toast.success('Registration payment completed successfully!');
              localStorage.setItem('registrationPaymentCompleted', 'true');
              localStorage.setItem('registrationPaymentId', response.razorpay_payment_id);
              onPaymentSuccess();
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
          }
        },
        prefill: {
          name: 'Seller',
          email: 'seller@example.com'
        },
        theme: {
          color: '#f59e0b'
        }
      };

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', (response) => {
            toast.error('Payment failed: ' + response.error.description);
          });
          rzp.open();
        };
        script.onerror = () => {
          toast.error('Failed to load payment gateway. Please check your internet connection.');
        };
        document.body.appendChild(script);
      } else {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          toast.error('Payment failed: ' + response.error.description);
        });
        rzp.open();
      }
    } catch (error) {
      console.error('Payment error:', error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
        // Clear invalid token and redirect to login
        localStorage.removeItem('accessToken');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.response?.status === 404) {
        toast.error('Payment service not available. Please try again later.');
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.error?.message || 'Invalid payment request');
      } else {
        toast.error('Failed to initiate payment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mx-2 sm:mx-0">
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Complete Registration
        </h3>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <h4 className="font-medium text-orange-900 mb-2 text-sm sm:text-base">Registration Fee</h4>
          <p className="text-xl sm:text-2xl font-bold text-orange-600 mb-2">₹50</p>
          <p className="text-xs sm:text-sm text-orange-700">One-time payment to activate your seller account</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <h5 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Payment Process:</h5>
          <ul className="text-xs sm:text-sm text-blue-800 space-y-1 text-left">
            <li className="flex items-start">
              <span className="mr-2 text-green-600">✓</span>
              <span>Application submitted to database</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-orange-600">→</span>
              <span>Pay ₹50 registration fee (current step)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Set up ₹500/month subscription (final step)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Account activated for selling</span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleRegistrationPayment}
          disabled={loading}
          className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold text-base hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            'Pay Registration Fee ₹50'
          )}
        </button>
      </div>
    </div>
  );
};

export default RegistrationPayment;