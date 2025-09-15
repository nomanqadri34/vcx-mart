import React, { useState, useEffect } from 'react';
import { subscriptionAPI } from '../services/api';
import toast from 'react-hot-toast';

const SubscriptionPayment = ({ applicationId, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (applicationId) {
      checkSubscriptionStatus();
    }
  }, [applicationId]);

  const checkSubscriptionStatus = async () => {
    try {
      if (!applicationId) return;
      const response = await subscriptionAPI.getSubscriptionStatus(applicationId);
      if (response.success) {
        setSubscriptionData(response.data);
        setStatus(response.data.subscriptionStatus);

        // Check if the subscription link looks malformed
        if (response.data.subscriptionLink &&
          (response.data.subscriptionLink.includes('rzp.io/l/') ||
            response.data.subscriptionLink.includes('https://rzp.io/rzp/'))) {
          console.log('Detected malformed subscription link, will refresh');
          // The server should have already reset this to pending
        }
      }
    } catch (error) {
      console.error('Failed to check subscription status:', error);
    }
  };

  const createSubscription = async () => {
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

      // Check if applicationId is provided
      if (!applicationId) {
        toast.error('Application ID is required for subscription');
        return;
      }



      const response = await subscriptionAPI.createSubscription(applicationId);

      if (response.success) {
        setSubscriptionData(response.data);
        setStatus('created');
        toast.success('Subscription created successfully!');

        // Open payment link directly
        if (response.data.subscriptionLink) {
          window.location.href = response.data.subscriptionLink;
        }
      } else {
        toast.error(response.error || 'Failed to create subscription');
      }
    } catch (error) {
      console.error('Subscription creation failed:', error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
        // Clear invalid token and redirect to login
        localStorage.removeItem('accessToken');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.response?.status === 404) {
        toast.error('Subscription service not available. Please try again later.');
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.error?.message || 'Invalid request');
      } else {
        toast.error('Failed to create subscription. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPlanDetails = () => {
    const currentDate = new Date();
    const launchDate = new Date('2025-10-01');

    if (currentDate < launchDate) {
      return {
        name: 'Early Bird Monthly',
        amount: 500,
        description: 'Monthly platform fee before October 1st, 2025',
        color: 'text-green-600'
      };
    } else {
      return {
        name: 'Regular Monthly',
        amount: 800,
        description: 'Monthly platform fee from October 1st, 2025',
        color: 'text-orange-600'
      };
    }
  };

  const planDetails = getPlanDetails();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mx-2 sm:mx-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
          Subscription Payment
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto ${status === 'created' ? 'bg-blue-100 text-blue-800' :
          status === 'active' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
          {status === 'created' ? 'Created' :
            status === 'active' ? 'Active' : 'Pending'}
        </span>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <h4 className={`text-base sm:text-lg font-medium ${planDetails.color} mb-2`}>
          {planDetails.name}
        </h4>
        <p className="text-gray-600 text-xs sm:text-sm mb-3">{planDetails.description}</p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            ₹{planDetails.amount}/month
          </span>
          {planDetails.name === 'Early Bird Monthly' && (
            <span className="text-xs sm:text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full self-start sm:self-auto">
              Save ₹300/month
            </span>
          )}
        </div>
      </div>

      {status === 'pending' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4">
            <h5 className="font-medium text-green-900 mb-2 text-sm sm:text-base">Final Step:</h5>
            <p className="text-xs sm:text-sm text-green-800 mb-3">
              After setting up your subscription, your complete application will be submitted for review.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <h5 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">What's Included:</h5>
            <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Unlimited product listings</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Direct payments to your account</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>No commission on sales</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Seller dashboard & analytics</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Customer support</span>
              </li>
            </ul>
          </div>

          <button
            onClick={createSubscription}
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Subscription...
              </div>
            ) : (
              `Subscribe for ₹${planDetails.amount}/month`
            )}
          </button>
        </div>
      )}

      {status === 'created' && subscriptionData?.subscriptionLink && (
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <p className="text-yellow-800 text-xs sm:text-sm">
              Your subscription has been created. Complete the payment to activate your seller account.
            </p>
          </div>

          <div className="space-y-2">
            <a
              href={subscriptionData.subscriptionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base text-center hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Complete Payment
            </a>

            <div className="space-y-1 sm:space-y-2">
              <button
                onClick={async () => {
                  try {
                    await subscriptionAPI.refreshSubscription(applicationId);
                    toast.success('Subscription refreshed. Please create a new subscription.');
                    setStatus('pending');
                    setSubscriptionData(null);
                  } catch (error) {
                    toast.error('Failed to refresh subscription');
                  }
                }}
                className="w-full text-gray-600 py-2 px-4 text-xs sm:text-sm hover:text-gray-800 transition-colors"
              >
                Having payment issues? Refresh subscription
              </button>

              <button
                onClick={async () => {
                  try {
                    const response = await subscriptionAPI.testPaymentLink();
                    if (response.success) {
                      toast.success('Test payment link created!');
                      window.open(response.data.paymentLink, '_blank');
                    }
                  } catch (error) {
                    toast.error('Failed to create test payment link');
                  }
                }}
                className="w-full text-blue-600 py-2 px-4 text-xs sm:text-sm hover:text-blue-800 transition-colors"
              >
                🧪 Test Payment Link (Debug)
              </button>

              <button
                onClick={async () => {
                  try {
                    const response = await subscriptionAPI.getDebugInfo(applicationId);
                    if (response.success) {
                      console.log('Debug info:', response.data);
                      toast.success('Debug info logged to console');
                    }
                  } catch (error) {
                    toast.error('Failed to get debug info');
                  }
                }}
                className="w-full text-purple-600 py-2 px-4 text-xs sm:text-sm hover:text-purple-800 transition-colors"
              >
                🔍 Show Debug Info
              </button>

              <button
                onClick={async () => {
                  if (confirm('This will reset ALL subscription data for your account. Continue?')) {
                    try {
                      const response = await subscriptionAPI.resetUserSubscription();
                      if (response.success) {
                        toast.success('All subscription data reset! Please refresh the page.');
                        setTimeout(() => window.location.reload(), 2000);
                      }
                    } catch (error) {
                      toast.error('Failed to reset subscription data');
                    }
                  }
                }}
                className="w-full text-red-600 py-2 px-4 text-xs sm:text-sm hover:text-red-800 transition-colors"
              >
                🔄 Reset All Subscription Data
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'active' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-start sm:items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 font-medium text-xs sm:text-sm">
              Subscription Active - You can now start selling!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPayment;