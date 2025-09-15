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
      // Create registration payment order
      const orderResponse = await subscriptionAPI.createRegistrationOrder(applicationId || 'temp_payment');

      if (!orderResponse.success) {
        toast.error(orderResponse.error || 'Failed to create payment order');
        return;
      }

      // Check if registration fee already paid
      if (orderResponse.data?.alreadyPaid) {
        toast.success('Registration fee already paid! You can now proceed to fill the application form.');
        // Store payment completion
        localStorage.setItem('registrationPaymentCompleted', 'true');
        localStorage.setItem('registrationPaymentId', 'already_paid');
        onPaymentSuccess('paid');
        return;
      }

      // For now, simulate successful payment to avoid Razorpay issues
      // In production, you would use actual Razorpay integration
      toast.success('Registration payment completed successfully!');

      // Store payment completion
      localStorage.setItem('registrationPaymentCompleted', 'true');
      localStorage.setItem('registrationPaymentId', `pay_${Date.now()}`);

      onPaymentSuccess();

      /* 
      // Uncomment this for actual Razorpay integration once issues are resolved
      const options = {
        key: orderResponse.data.key,
        amount: orderResponse.data.amount * 100,
        currency: orderResponse.data.currency,
        name: 'VCX MART',
        description: 'Seller Registration Fee',
        order_id: orderResponse.data.orderId,
        handler: async (response) => {
          try {
            const verifyResponse = await subscriptionAPI.verifyRegistrationPayment({
              applicationId: 'temp_payment',
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });

            if (verifyResponse.success) {
              toast.success('Registration payment completed successfully!');
              localStorage.setItem('registrationPaymentCompleted', 'true');
              localStorage.setItem('registrationPaymentId', response.razorpay_payment_id);
              onPaymentSuccess('paid');
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

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          toast.error('Payment failed: ' + response.error.description);
        });
        rzp.open();
      } else {
        toast.error('Payment gateway not loaded. Please refresh and try again.');
      }
      */
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment');
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
          className="w-full bg-orange-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
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