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
      let appId = currentApplicationId;
      
      // Get existing application or create a minimal one
      if (!appId) {
        try {
          // First try to get existing application
          const statusResponse = await api.get('/seller/application/status');
          if (statusResponse.data?.data?.hasApplication && statusResponse.data?.data?.application?.applicationId) {
            appId = statusResponse.data.data.application.applicationId;
            setCurrentApplicationId(appId);
            console.log('Using existing application:', appId);
          } else {
            // No existing application, create a minimal one
            const timestamp = Date.now();
            const minimalApplication = {
              businessName: `Seller Business ${timestamp}${Math.random().toString(36).substr(2, 3)}`,
              businessType: 'Individual/Proprietorship',
              businessCategory: 'Electronics & Gadgets',
              businessDescription: 'This is a temporary application created during payment setup process. The seller will complete their full application details after payment confirmation. This description meets the minimum 50 character requirement for validation purposes.',
              establishedYear: new Date().getFullYear(),
              businessEmail: `seller${timestamp}${Math.random().toString(36).substr(2, 5)}@vcxmart.temp`,
              businessPhone: '9876543210',
              businessAddress: 'Temporary address pending completion after payment',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400001',
              bankAccountNumber: '123456789012345',
              bankName: 'State Bank of India',
              accountHolderName: 'Pending Setup',
              agreeToTerms: true
            };
            
            try {
              const appResponse = await api.post('/seller/apply', minimalApplication);
              if (appResponse.data?.data?.applicationId) {
                appId = appResponse.data.data.applicationId;
                setCurrentApplicationId(appId);
                console.log('Created new application:', appId);
              } else {
                console.error('Application creation failed:', appResponse.data);
                toast.error('Failed to create application');
                return;
              }
            } catch (createError) {
              console.error('Application creation error:', createError);
              // If it fails due to existing application, try to get it again
              if (createError.response?.status === 400 && createError.response?.data?.error?.message?.includes('already submitted')) {
                try {
                  const retryStatusResponse = await api.get('/seller/application/status');
                  if (retryStatusResponse.data?.data?.hasApplication && retryStatusResponse.data?.data?.application?.applicationId) {
                    appId = retryStatusResponse.data.data.application.applicationId;
                    setCurrentApplicationId(appId);
                    console.log('Using existing application after retry:', appId);
                  } else {
                    toast.error('Unable to find or create seller application');
                    return;
                  }
                } catch (retryError) {
                  toast.error('Failed to get application status');
                  return;
                }
              } else {
                toast.error('Failed to create application: ' + (createError.response?.data?.error?.message || 'Unknown error'));
                return;
              }
            }
          }
        } catch (statusError) {
          console.error('Status error:', statusError);
          toast.error('Failed to check application status');
          return;
        }
      }
      
      const orderResponse = await subscriptionAPI.createRegistrationOrder(appId);
      
      if (!orderResponse.success) {
        toast.error(orderResponse.error || 'Failed to create payment order');
        return;
      }

      // Check if registration fee already paid
      if (orderResponse.data?.alreadyPaid) {
        toast.success('Registration fee already paid! Proceeding to subscription...');
        onPaymentSuccess(appId);
        return;
      }

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
              applicationId: appId,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });

            if (verifyResponse.success) {
              toast.success('Registration payment completed successfully!');
              onPaymentSuccess(appId);
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
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: 'Pay using UPI/Cards',
                instruments: [
                  {
                    method: 'upi'
                  },
                  {
                    method: 'card'
                  }
                ]
              }
            },
            sequence: ['block.banks'],
            preferences: {
              show_default_blocks: true
            }
          }
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
    } catch (error) {
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
          <h5 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">What's Next:</h5>
          <ul className="text-xs sm:text-sm text-blue-800 space-y-1 text-left">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Pay ₹50 registration fee</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Set up monthly subscription (₹500 before Oct 1st, ₹800 after)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Start selling with 0% commission</span>
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