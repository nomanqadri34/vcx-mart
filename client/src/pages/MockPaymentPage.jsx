import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const MockPaymentPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState('processing');
    const [countdown, setCountdown] = useState(3);

    const orderNumber = searchParams.get('order');

    useEffect(() => {
        // Simulate payment processing
        const timer = setTimeout(() => {
            setPaymentStatus('success');

            // Countdown before redirect
            const countdownInterval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        navigate('/user/orders');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdownInterval);
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    const handleManualRedirect = () => {
        navigate('/user/orders');
    };

    const handleFailPayment = () => {
        setPaymentStatus('failed');
    };

    const handleRetryPayment = () => {
        setPaymentStatus('processing');
        setCountdown(3);

        setTimeout(() => {
            setPaymentStatus('success');

            const countdownInterval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        navigate('/user/orders');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                {paymentStatus === 'processing' && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
                        <p className="text-gray-600 mb-4">Please wait while we process your payment...</p>
                        <p className="text-sm text-gray-500">Order: {orderNumber}</p>

                        {/* Dev controls */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-400 mb-2">Development Mode Controls:</p>
                            <button
                                onClick={handleFailPayment}
                                className="bg-red-500 text-white px-3 py-1 rounded text-xs mr-2 hover:bg-red-600"
                            >
                                Simulate Failure
                            </button>
                        </div>
                    </div>
                )}

                {paymentStatus === 'success' && (
                    <div className="text-center">
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
                        <p className="text-sm text-gray-500 mb-6">Order: {orderNumber}</p>

                        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                            <p className="text-green-800 text-sm">
                                Redirecting to your orders in {countdown} seconds...
                            </p>
                        </div>

                        <button
                            onClick={handleManualRedirect}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                        >
                            View My Orders Now
                        </button>
                    </div>
                )}

                {paymentStatus === 'failed' && (
                    <div className="text-center">
                        <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h2>
                        <p className="text-gray-600 mb-4">There was an issue processing your payment.</p>
                        <p className="text-sm text-gray-500 mb-6">Order: {orderNumber}</p>

                        <div className="space-y-3">
                            <button
                                onClick={handleRetryPayment}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                            >
                                Retry Payment
                            </button>
                            <button
                                onClick={() => navigate('/cart')}
                                className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
                            >
                                Back to Cart
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-400">
                        🧪 This is a mock payment page for development testing.
                        <br />
                        In production, this would be replaced with real payment gateway.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MockPaymentPage;
