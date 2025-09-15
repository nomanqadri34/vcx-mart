import React, { useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { TrashIcon, PlusIcon, MinusIcon, ArrowLeftIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CartPage = () => {
    const navigate = useNavigate();
    const { items, cartTotal, updateCartItem, removeFromCart, clearCart, loading, error, retryLoadCart, loadCart } = useCart();
    const { isAuthenticated } = useAuth();

    // Debug logging
    console.log('CartPage: Current state:', {
        itemsLength: items?.length || 0,
        cartTotal,
        loading,
        error,
        isAuthenticated,
        itemsArray: items
    });
    console.log('CartPage: Raw items data:', items);
    console.log('CartPage: Items is array?', Array.isArray(items));
    console.log('CartPage: Type of items:', typeof items);

    // Load cart on mount and auth changes (disabled to prevent vanishing items)
    // useEffect(() => {
    //     if (isAuthenticated) {
    //         console.log('CartPage: Loading cart...');
    //         loadCart();
    //     }
    // }, [isAuthenticated, loadCart]);

    // Listen for cart updates (removed automatic reload to prevent vanishing items)
    // useEffect(() => {
    //     const handleCartUpdate = () => {
    //         console.log('CartPage: Cart updated, reloading...');
    //         loadCart();
    //     };

    //     window.addEventListener('cart-updated', handleCartUpdate);
    //     return () => window.removeEventListener('cart-updated', handleCartUpdate);
    // }, [loadCart]);

    // Listen for checkout completion and clear cart
    useEffect(() => {
        const handleCheckoutComplete = () => {
            console.log('Checkout completed, clearing and reloading cart...');
            clearCart();
            setTimeout(() => loadCart(true), 500);
        };

        window.addEventListener('checkout-complete', handleCheckoutComplete);

        return () => {
            window.removeEventListener('checkout-complete', handleCheckoutComplete);
        };
    }, [loadCart, clearCart]);

    const handleQuantityChange = async (productId, variants, newQuantity) => {
        if (newQuantity <= 0) {
            await removeFromCart(productId, variants);
        } else {
            await updateCartItem(productId, newQuantity, variants);
        }
    };

    const handleRemoveItem = async (productId, variants) => {
        await removeFromCart(productId, variants);
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            await clearCart();
        }
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            toast.error('Please login to checkout');
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    // Show loading state
    if (loading && items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Cart...</h1>
                    <p className="text-gray-600">Please wait while we load your cart items</p>
                </div>
            </div>
        );
    }

    // Show error state with retry option
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ExclamationTriangleIcon className="w-12 h-12 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Cart Error</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={retryLoadCart}
                            disabled={loading}
                            className="w-full bg-saffron-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-saffron-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? 'Retrying...' : 'Retry Loading Cart'}
                        </button>
                        <Link
                            to="/products"
                            className="block w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Show empty cart state
    if (!items || !Array.isArray(items) || items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2 2H9a2 2 0 00-2 2v4.01" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
                    <p className="text-gray-600 mb-6">Add some products to your cart to get started</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center px-6 py-3 bg-saffron-600 text-white font-medium rounded-lg hover:bg-saffron-700 transition-colors"
                    >
                        Continue Shopping
                    </Link>


                </div>
            </div>
        );
    }

    const tax = Math.round(cartTotal * 0.18);
    const total = cartTotal + tax;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>Back</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <span className="text-gray-500">({items?.length || 0} items)</span>
                    {loading && (
                        <div className="flex items-center space-x-2 text-saffron-600">
                            <ArrowPathIcon className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Updating...</span>
                        </div>
                    )}

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {(items || []).map((item, index) => (
                            <div key={`${item.productId}-${JSON.stringify(item.variants)}`} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={item.image || '/placeholder-product.jpg'}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-product.jpg';
                                        }}
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            {item.name}
                                        </h3>
                                        {item.variants && Object.keys(item.variants).length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {Object.entries(item.variants).map(([key, value]) => (
                                                    <span
                                                        key={key}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                                                    >
                                                        {key}: {value}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item.productId, item.variants, item.quantity - 1)}
                                                    disabled={loading}
                                                    className="p-1 text-gray-600 hover:text-saffron-600 disabled:opacity-50"
                                                >
                                                    <MinusIcon className="h-4 w-4" />
                                                </button>
                                                <span className="w-12 text-center font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.productId, item.variants, item.quantity + 1)}
                                                    disabled={loading}
                                                    className="p-1 text-gray-600 hover:text-saffron-600 disabled:opacity-50"
                                                >
                                                    <PlusIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    ₹{item.price.toLocaleString()} each
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item.productId, item.variants)}
                                        disabled={loading}
                                        className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Cart Actions */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={handleClearCart}
                                    disabled={loading}
                                    className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                                >
                                    Clear Cart
                                </button>
                                <Link
                                    to="/products"
                                    className="text-saffron-600 hover:text-saffron-700 font-medium"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal ({items?.length || 0} items)</span>
                                    <span>₹{(cartTotal || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax (18% GST)</span>
                                    <span>₹{tax.toLocaleString()}</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total</span>
                                        <span>₹{total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading || !items || items.length === 0}
                                className="w-full bg-saffron-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-saffron-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 mt-6"
                            >
                                {loading ? 'Processing...' : 'Proceed to Checkout'}
                            </button>

                            {cartTotal < 500 && (
                                <p className="text-sm text-gray-600 text-center mt-3">
                                    Add ₹{(500 - cartTotal).toLocaleString()} more for free shipping!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
