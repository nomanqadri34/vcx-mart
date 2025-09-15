import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import RegistrationPayment from '../../components/RegistrationPayment';
import SubscriptionPayment from '../../components/SubscriptionPayment';
import { CheckCircleIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SellerPaymentFlow = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentData, setPaymentData] = useState({
    registrationPaid: false,
    subscriptionSetup: false,
    applicationId: null
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please login to continue");
      navigate("/login");
    } else if (user?.role === "seller") {
      toast.info("You are already a seller");
      navigate("/seller/dashboard");
    }
  }, [loading, isAuthenticated, user, navigate]);

  const handleRegistrationSuccess = (applicationId) => {
    setPaymentData(prev => ({
      ...prev,
      registrationPaid: true,
      applicationId: applicationId
    }));
    setCurrentStep(2);
    toast.success('Registration fee paid successfully!');
  };

  const handleSubscriptionSuccess = () => {
    setPaymentData(prev => ({
      ...prev,
      subscriptionSetup: true
    }));
    setCurrentStep(3);
    toast.success('Subscription setup completed!');
  };

  const handleProceedToApplication = () => {
    if (paymentData.registrationPaid && paymentData.subscriptionSetup) {
      navigate('/seller/apply', {
        state: {
          paymentCompleted: true,
          applicationId: paymentData.applicationId
        }
      });
    } else {
      toast.error('Please complete all payment steps first');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 px-2">
            Complete Your Seller Setup
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 px-2">
            Complete payment setup before submitting your application
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile Progress - Vertical Layout */}
          <div className="block sm:hidden">
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${paymentData.registrationPaid
                  ? 'bg-green-500 text-white'
                  : currentStep === 1
                    ? 'bg-saffron-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                  }`}>
                  {paymentData.registrationPaid ? <CheckCircleIcon className="w-4 h-4" /> : '1'}
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-gray-900">Registration Fee</div>
                  <div className="text-xs text-gray-500">₹50 one-time payment</div>
                </div>
                {paymentData.registrationPaid && (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                )}
              </div>

              {/* Connector */}
              <div className="ml-4 w-0.5 h-4 bg-gray-300"></div>

              {/* Step 2 */}
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${paymentData.subscriptionSetup
                  ? 'bg-green-500 text-white'
                  : currentStep === 2
                    ? 'bg-saffron-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                  }`}>
                  {paymentData.subscriptionSetup ? <CheckCircleIcon className="w-4 h-4" /> : '2'}
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-gray-900">Monthly Autopay</div>
                  <div className="text-xs text-gray-500">
                    ₹{new Date() <= new Date('2025-10-01') ? '500' : '800'}/month
                  </div>
                </div>
                {paymentData.subscriptionSetup && (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                )}
              </div>

              {/* Connector */}
              <div className="ml-4 w-0.5 h-4 bg-gray-300"></div>

              {/* Step 3 */}
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 3
                  ? 'bg-saffron-500 text-white'
                  : 'bg-gray-300 text-gray-600'
                  }`}>
                  3
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-gray-900">Submit Application</div>
                  <div className="text-xs text-gray-500">Complete seller profile</div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Progress - Horizontal Layout */}
          <div className="hidden sm:block">
            <div className="flex items-center justify-center">
              {/* Step 1: Registration Fee */}
              <div className="flex items-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium ${paymentData.registrationPaid
                  ? 'bg-green-500 text-white'
                  : currentStep === 1
                    ? 'bg-saffron-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                  }`}>
                  {paymentData.registrationPaid ? <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : '1'}
                </div>
                <div className="ml-2 sm:ml-3">
                  <div className="text-xs sm:text-sm font-medium text-gray-900">Registration Fee</div>
                  <div className="text-xs text-gray-500 hidden sm:block">₹50 one-time</div>
                </div>
              </div>

              <div className="w-8 sm:w-16 h-0.5 bg-gray-300 mx-2 sm:mx-4"></div>

              {/* Step 2: Subscription */}
              <div className="flex items-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium ${paymentData.subscriptionSetup
                  ? 'bg-green-500 text-white'
                  : currentStep === 2
                    ? 'bg-saffron-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                  }`}>
                  {paymentData.subscriptionSetup ? <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : '2'}
                </div>
                <div className="ml-2 sm:ml-3">
                  <div className="text-xs sm:text-sm font-medium text-gray-900">Monthly Autopay</div>
                  <div className="text-xs text-gray-500 hidden sm:block">
                    ₹{new Date() <= new Date('2025-10-01') ? '500' : '800'}/month
                  </div>
                </div>
              </div>

              <div className="w-8 sm:w-16 h-0.5 bg-gray-300 mx-2 sm:mx-4"></div>

              {/* Step 3: Application */}
              <div className="flex items-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 3
                  ? 'bg-saffron-500 text-white'
                  : 'bg-gray-300 text-gray-600'
                  }`}>
                  3
                </div>
                <div className="ml-2 sm:ml-3">
                  <div className="text-xs sm:text-sm font-medium text-gray-900">Submit Application</div>
                  <div className="text-xs text-gray-500 hidden sm:block">Complete profile</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Steps */}
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
          {currentStep === 1 && (
            <div>
              <div className="text-center mb-4 sm:mb-6">
                <CurrencyRupeeIcon className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500 mx-auto mb-3 sm:mb-4" />
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  Step 1: Registration Fee
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-2 px-2">
                  Pay ₹50 one-time registration fee to activate your seller account
                </p>
              </div>
              <RegistrationPayment
                onPaymentSuccess={handleRegistrationSuccess}
                showApplicationForm={false}
              />
            </div>
          )}

          {currentStep === 2 && paymentData.applicationId && (
            <div>
              <div className="text-center mb-4 sm:mb-6">
                <CurrencyRupeeIcon className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" />
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  Step 2: Monthly Autopay Setup
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-2 px-2">
                  Setup monthly autopay subscription for platform access
                </p>
              </div>
              <SubscriptionPayment
                applicationId={paymentData.applicationId}
                onPaymentSuccess={handleSubscriptionSuccess}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center px-2">
              <CheckCircleIcon className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Payment Setup Complete!
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2 mb-4 sm:mb-6">
                You can now proceed to submit your seller application
              </p>
              <button
                onClick={handleProceedToApplication}
                className="w-full sm:w-auto bg-gradient-to-r from-saffron-500 to-green-500 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:from-saffron-600 hover:to-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:ring-offset-2"
              >
                Proceed to Application Form
              </button>
            </div>
          )}
        </div>

        {/* Pricing Summary */}
        <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Pricing Summary
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-600">
                Registration Fee (One-time)
              </span>
              <span className="text-sm sm:text-base font-semibold">₹50</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-600">
                Monthly Platform Fee
              </span>
              <span className="text-sm sm:text-base font-semibold">
                ₹{new Date() <= new Date('2025-10-01') ? '500' : '800'}
              </span>
            </div>
            <div className="border-t pt-2 sm:pt-3">
              <div className="flex justify-between items-center font-bold">
                <span className="text-sm sm:text-base">Total First Payment</span>
                <span className="text-base sm:text-lg text-saffron-600">
                  ₹{50 + (new Date() <= new Date('2025-10-01') ? 500 : 800)}
                </span>
              </div>
            </div>
          </div>

          {/* Early Bird Notice */}
          {new Date() <= new Date('2025-10-01') && (
            <div className="mt-3 sm:mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-green-800">
                    Early Bird Pricing Active!
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Save ₹300/month until October 1st, 2025
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerPaymentFlow;