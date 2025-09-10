import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircleIcon, ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';

const CheckoutCancelPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const orderId = searchParams.get('order_id');
    const reason = searchParams.get('reason') || 'Payment was cancelled';

    const handleBackToCart = () => {
        navigate('/cart');
    };

    const handleContinueShopping = () => {
        navigate('/products');
    };

    const handleRetryPayment = () => {
        // If we have an order ID, try to redirect back to checkout
        if (orderId) {
            navigate(`/checkout?retry=${orderId}`);
        } else {
            navigate('/cart');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-6" />

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Cancelled
                </h1>

                <p className="text-gray-600 mb-2">
                    Your payment was cancelled and no charges were made.
                </p>

                <p className="text-sm text-gray-500 mb-6">
                    {reason}
                </p>

                {orderId && (
                    <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                            <span className="font-medium">Order ID:</span> {orderId}
                            <br />
                            <span className="text-xs">Your order is still saved. You can retry payment anytime.</span>
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    {orderId && (
                        <button
                            onClick={handleRetryPayment}
                            className="w-full bg-saffron-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-saffron-700 transition-colors"
                        >
                            Retry Payment
                        </button>
                    )}

                    <button
                        onClick={handleBackToCart}
                        className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Cart
                    </button>

                    <button
                        onClick={handleContinueShopping}
                        className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
                    >
                        <ShoppingCartIcon className="h-4 w-4 mr-2" />
                        Continue Shopping
                    </button>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Need help? Contact our support team.
                        <br />
                        We're here to assist you with your purchase.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CheckoutCancelPage;
