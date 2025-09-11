import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeftIcon, MapPinIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, cartTotal, checkout, loading } = useCart();
    const { user } = useAuth();

    const [shippingAddress, setShippingAddress] = useState({
        firstName: user?.firstName || user?.name?.split(' ')[0] || '',
        lastName: user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
    });

    const [billingAddress, setBillingAddress] = useState({
        ...shippingAddress,
        useShippingAddress: true
    });

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Validate shipping address
        if (!shippingAddress.firstName) newErrors.firstName = 'First name is required';
        if (!shippingAddress.lastName) newErrors.lastName = 'Last name is required';
        if (!shippingAddress.email) newErrors.email = 'Email is required';
        if (!shippingAddress.phone) newErrors.phone = 'Phone is required';
        if (!shippingAddress.address) newErrors.address = 'Address is required';
        if (!shippingAddress.city) newErrors.city = 'City is required';
        if (!shippingAddress.state) newErrors.state = 'State is required';
        if (!shippingAddress.pincode) newErrors.pincode = 'Pincode is required';

        // Validate billing address if different
        if (!billingAddress.useShippingAddress) {
            if (!billingAddress.firstName) newErrors.billingFirstName = 'Billing first name is required';
            if (!billingAddress.lastName) newErrors.billingLastName = 'Billing last name is required';
            if (!billingAddress.email) newErrors.billingEmail = 'Billing email is required';
            if (!billingAddress.phone) newErrors.billingPhone = 'Billing phone is required';
            if (!billingAddress.address) newErrors.billingAddress = 'Billing address is required';
            if (!billingAddress.city) newErrors.billingCity = 'Billing city is required';
            if (!billingAddress.state) newErrors.billingState = 'Billing state is required';
            if (!billingAddress.pincode) newErrors.billingPincode = 'Billing pincode is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleShippingAddressChange = (field, value) => {
        setShippingAddress(prev => ({ ...prev, [field]: value }));

        // Update billing address if using same address
        if (billingAddress.useShippingAddress) {
            setBillingAddress(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleBillingAddressChange = (field, value) => {
        setBillingAddress(prev => ({ ...prev, [field]: value }));
    };

    const applyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        setCouponLoading(true);
        try {
            const response = await api.post('/coupons/validate', {
                code: couponCode,
                orderAmount: subtotal,
                items: items.map(item => ({ product: item.productId, category: item.category }))
            });

            if (response.data.success) {
                setAppliedCoupon(response.data.data.coupon);
                setDiscount(response.data.data.discount);
                toast.success('Coupon applied successfully!');
            }
        } catch (error) {
            toast.error(error.response?.data?.error?.message || 'Invalid coupon code');
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setDiscount(0);
        setCouponCode('');
        toast.success('Coupon removed');
    };

    const handleCheckout = async () => {
        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!items || items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        const finalBillingAddress = billingAddress.useShippingAddress ? null : billingAddress;

        try {
            // Prepare addresses
            const checkoutData = {
                shippingAddress: {
                    ...shippingAddress,
                    phone: shippingAddress.phone.toString()
                },
                billingAddress: finalBillingAddress ? {
                    ...finalBillingAddress,
                    phone: finalBillingAddress.phone.toString()
                } : null,
                couponCode: appliedCoupon?.code || null,
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    variants: item.variants || {}
                }))
            };

            // Call checkout with complete data
            const result = await checkout(
                checkoutData.shippingAddress,
                checkoutData.billingAddress,
                checkoutData.couponCode
            );

            if (!result) {
                throw new Error('Checkout failed');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.message || 'Failed to initiate checkout');
        }
    };

    if (!items || items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
                    <p className="text-gray-600 mb-6">Add some products to your cart before checkout</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-saffron-600 text-white px-6 py-3 rounded-lg hover:bg-saffron-700 transition-colors"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => navigate('/cart')}
                            className="block w-full text-saffron-600 hover:text-saffron-700"
                        >
                            View Cart
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const subtotal = cartTotal;
    const shippingCost = subtotal >= 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.18);
    const finalShipping = appliedCoupon?.type === 'shipping' ? 0 : shippingCost;
    const total = Math.max(0, subtotal + finalShipping + tax - discount);

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
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <MapPinIcon className="h-6 w-6 text-saffron-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingAddress.firstName}
                                        onChange={(e) => handleShippingAddressChange('firstName', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingAddress.lastName}
                                        onChange={(e) => handleShippingAddressChange('lastName', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={shippingAddress.email}
                                        onChange={(e) => handleShippingAddressChange('email', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        value={shippingAddress.phone}
                                        onChange={(e) => handleShippingAddressChange('phone', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingAddress.address}
                                        onChange={(e) => handleShippingAddressChange('address', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingAddress.city}
                                        onChange={(e) => handleShippingAddressChange('city', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500 ${errors.city ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingAddress.state}
                                        onChange={(e) => handleShippingAddressChange('state', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500 ${errors.state ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pincode *
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingAddress.pincode}
                                        onChange={(e) => handleShippingAddressChange('pincode', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500 ${errors.pincode ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingAddress.country}
                                        onChange={(e) => handleShippingAddressChange('country', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Billing Address */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <CreditCardIcon className="h-6 w-6 text-saffron-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Billing Address</h2>
                                </div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={billingAddress.useShippingAddress}
                                        onChange={(e) => setBillingAddress(prev => ({
                                            ...prev,
                                            useShippingAddress: e.target.checked
                                        }))}
                                        className="rounded border-gray-300 text-saffron-600 focus:ring-saffron-500"
                                    />
                                    <span className="text-sm text-gray-600">Same as shipping address</span>
                                </label>
                            </div>

                            {!billingAddress.useShippingAddress && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={billingAddress.firstName}
                                            onChange={(e) => handleBillingAddressChange('firstName', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500 ${errors.billingFirstName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.billingFirstName && <p className="text-red-500 text-sm mt-1">{errors.billingFirstName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={billingAddress.lastName}
                                            onChange={(e) => handleBillingAddressChange('lastName', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500 ${errors.billingLastName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.billingLastName && <p className="text-red-500 text-sm mt-1">{errors.billingLastName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={billingAddress.email}
                                            onChange={(e) => handleBillingAddressChange('email', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500 ${errors.billingEmail ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.billingEmail && <p className="text-red-500 text-sm mt-1">{errors.billingEmail}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            value={billingAddress.phone}
                                            onChange={(e) => handleBillingAddressChange('phone', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500 ${errors.billingPhone ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.billingPhone && <p className="text-red-500 text-sm mt-1">{errors.billingPhone}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address *
                                        </label>
                                        <input
                                            type="text"
                                            value={billingAddress.address}
                                            onChange={(e) => handleBillingAddressChange('address', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500 ${errors.billingAddress ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.billingAddress && <p className="text-red-500 text-sm mt-1">{errors.billingAddress}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            value={billingAddress.city}
                                            onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500 ${errors.billingCity ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.billingCity && <p className="text-red-500 text-sm mt-1">{errors.billingCity}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            value={billingAddress.state}
                                            onChange={(e) => handleBillingAddressChange('state', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500 ${errors.billingState ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.billingState && <p className="text-red-500 text-sm mt-1">{errors.billingState}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Pincode *
                                        </label>
                                        <input
                                            type="text"
                                            value={billingAddress.pincode}
                                            onChange={(e) => handleBillingAddressChange('pincode', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500 ${errors.billingPincode ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.billingPincode && <p className="text-red-500 text-sm mt-1">{errors.billingPincode}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            value={billingAddress.country}
                                            onChange={(e) => handleBillingAddressChange('country', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3">
                                {items.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Section */}
                            <div className="border-t pt-4 mt-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Apply Coupon</h3>
                                {!appliedCoupon ? (
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="Enter coupon code"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-saffron-500 focus:border-saffron-500"
                                        />
                                        <button
                                            onClick={applyCoupon}
                                            disabled={couponLoading}
                                            className="px-4 py-2 bg-saffron-600 text-white rounded-md text-sm hover:bg-saffron-700 disabled:opacity-50"
                                        >
                                            {couponLoading ? 'Applying...' : 'Apply'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-md">
                                        <div>
                                            <p className="text-sm font-medium text-green-800">{appliedCoupon.code}</p>
                                            <p className="text-xs text-green-600">{appliedCoupon.description}</p>
                                        </div>
                                        <button
                                            onClick={removeCoupon}
                                            className="text-red-600 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-4 mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span className={finalShipping === 0 ? 'text-green-600' : ''}>
                                        {finalShipping === 0 ? 'Free' : `₹${finalShipping}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax (18% GST)</span>
                                    <span>₹{tax.toLocaleString()}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount ({appliedCoupon?.code})</span>
                                        <span>-₹{discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="border-t pt-2">
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total</span>
                                        <span>₹{total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full bg-saffron-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-saffron-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 mt-6 flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <CreditCardIcon className="h-5 w-5" />
                                        <span>Proceed to Payment</span>
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-3">
                                You will be redirected to GoKwik for secure payment processing
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
