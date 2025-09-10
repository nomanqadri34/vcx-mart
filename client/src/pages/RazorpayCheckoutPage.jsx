import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import {
    ArrowLeftIcon,
    TagIcon,
    PhoneIcon,
    MapPinIcon,
    XMarkIcon,
    CheckIcon,
    ShieldCheckIcon,
    LockClosedIcon,
    CreditCardIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon as ChevronDownSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { cartAPI } from '../services/api';

const RazorpayCheckoutPage = () => {
    const navigate = useNavigate();
    const { items, loading } = useCart();
    const { user } = useAuth();

    const [step, setStep] = useState('details'); // 'details' or 'payment'
    const [orderSummaryOpen, setOrderSummaryOpen] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [processingPayment, setProcessingPayment] = useState(false);

    const [customerInfo, setCustomerInfo] = useState({
        phone: user?.phone || '',
        firstName: user?.firstName || user?.name?.split(' ')[0] || '',
        lastName: user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        address: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
    });

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax - discount;

    const availableCoupons = [
        { code: 'SAVE10', discount: 10, minOrder: 500, type: 'percentage' },
        { code: 'FLAT50', discount: 50, minOrder: 300, type: 'fixed' },
        { code: 'WELCOME20', discount: 20, minOrder: 200, type: 'percentage' }
    ];

    // Load Razorpay script
    useEffect(() => {
        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

        loadRazorpayScript();
    }, []);

    const handleApplyCoupon = () => {
        const coupon = availableCoupons.find(c => c.code === couponCode.toUpperCase());

        if (!coupon) {
            toast.error('Invalid coupon code');
            return;
        }

        if (subtotal < coupon.minOrder) {
            toast.error(`Minimum order amount ₹${coupon.minOrder} required for this coupon`);
            return;
        }

        const discountAmount = coupon.type === 'percentage'
            ? Math.round(subtotal * coupon.discount / 100)
            : coupon.discount;

        setAppliedCoupon(coupon);
        setDiscount(discountAmount);
        setCouponCode('');
        toast.success(`Coupon applied! You saved ₹${discountAmount}`);
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setDiscount(0);
        toast.success('Coupon removed');
    };

    const handleInputChange = (field, value) => {
        setCustomerInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateAndProceed = () => {
        const required = ['phone', 'firstName', 'lastName', 'email', 'address', 'city', 'state', 'pincode'];
        const missing = required.filter(field => !customerInfo[field]);

        if (missing.length > 0) {
            toast.error('Please fill all required fields');
            return;
        }

        if (customerInfo.phone.length !== 10) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        setStep('payment');
    };

    const handleRazorpayPayment = async () => {
        setProcessingPayment(true);

        try {
            const shippingAddress = {
                firstName: customerInfo.firstName,
                lastName: customerInfo.lastName,
                email: customerInfo.email,
                phone: customerInfo.phone,
                address: `${customerInfo.address}, ${customerInfo.landmark}`.trim().replace(/,$/, ''),
                city: customerInfo.city,
                state: customerInfo.state,
                pincode: customerInfo.pincode,
                country: customerInfo.country
            };

            // Create order on backend
            const checkoutResponse = await cartAPI.checkout(shippingAddress, null);

            if (!checkoutResponse.success) {
                throw new Error(checkoutResponse.error || 'Failed to create order');
            }

            const {
                razorpayKeyId,
                razorpayOrderId,
                amount,
                currency,
                customerInfo: rzpCustomerInfo,
                testMode,
                order
            } = checkoutResponse.data;

            // Check if mock mode
            if (checkoutResponse.data.razorpayOrder?.mockMode) {
                toast.success('Mock payment completed! Redirecting...');
                setTimeout(() => {
                    navigate('/checkout/success', {
                        state: {
                            orderId: order._id,
                            orderNumber: order.orderNumber,
                            mockMode: true
                        }
                    });
                }, 1500);
                return;
            }

            // Razorpay options
            const options = {
                key: razorpayKeyId,
                amount: amount,
                currency: currency,
                name: 'Cryptomart',
                description: `Order #${order.orderNumber}`,
                order_id: razorpayOrderId,
                prefill: {
                    name: rzpCustomerInfo.name,
                    email: rzpCustomerInfo.email,
                    contact: rzpCustomerInfo.contact,
                },
                notes: {
                    orderNumber: order.orderNumber,
                },
                theme: {
                    color: '#3B82F6'
                },
                modal: {
                    ondismiss: () => {
                        setProcessingPayment(false);
                        toast.error('Payment cancelled');
                    }
                },
                handler: async (response) => {
                    try {
                        // For now, skip verification and go directly to success
                        // TODO: Implement proper payment verification
                        toast.success('Payment successful!');
                        
                        // Generate invoice data
                        const invoiceData = {
                            orderId: order._id,
                            orderNumber: order.orderNumber,
                            paymentId: response.razorpay_payment_id,
                            amount: total,
                            items: items,
                            customerInfo: customerInfo,
                            paymentDate: new Date().toISOString(),
                            discount: discount,
                            tax: tax,
                            subtotal: subtotal
                        };
                        
                        // Store invoice data in localStorage for success page
                        localStorage.setItem('invoiceData', JSON.stringify(invoiceData));
                        
                        navigate('/checkout/success', {
                            state: {
                                orderId: order._id,
                                orderNumber: order.orderNumber,
                                paymentId: response.razorpay_payment_id,
                                invoiceData: invoiceData
                            }
                        });
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        toast.error('Payment verification failed');
                    }
                },
            };

            if (testMode) {
                toast.success('Opening Razorpay in TEST MODE', { duration: 2000 });
            }

            // Open Razorpay checkout
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.message || 'Failed to initiate payment');
        } finally {
            setProcessingPayment(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
                    <p className="text-gray-600 mb-6">Add some products to your cart before checkout</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/cart')}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <ShieldCheckIcon className="h-4 w-4" />
                            <span>Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Progress Steps */}
                        <div className="flex items-center space-x-4 mb-8">
                            <div className={`flex items-center space-x-2 ${step === 'details' ? 'text-blue-600' : 'text-green-600'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                                    }`}>
                                    {step === 'payment' ? <CheckIcon className="h-5 w-5" /> : '1'}
                                </div>
                                <span className="font-medium">Details</span>
                            </div>
                            <div className="flex-1 border-t border-gray-300"></div>
                            <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                                    }`}>
                                    2
                                </div>
                                <span className="font-medium">Payment</span>
                            </div>
                        </div>

                        {/* Step Content */}
                        {step === 'details' ? (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-xl font-semibold mb-6">Contact & Shipping</h2>

                                {/* Phone Number */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mobile Number *
                                    </label>
                                    <div className="relative">
                                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={customerInfo.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            placeholder="Enter 10 digit mobile number"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            maxLength="10"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        We'll send order updates to this number
                                    </p>
                                </div>

                                {/* Name Fields */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={customerInfo.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={customerInfo.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={customerInfo.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Address */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={customerInfo.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        placeholder="House/Flat/Block No., Street"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Landmark */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Landmark (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={customerInfo.landmark}
                                        onChange={(e) => handleInputChange('landmark', e.target.value)}
                                        placeholder="Near"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* City, State, Pincode */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            value={customerInfo.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            value={customerInfo.state}
                                            onChange={(e) => handleInputChange('state', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pincode *
                                        </label>
                                        <input
                                            type="text"
                                            value={customerInfo.pincode}
                                            onChange={(e) => handleInputChange('pincode', e.target.value)}
                                            maxLength="6"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={validateAndProceed}
                                    className="w-full bg-gray-800 text-white py-4 rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center"
                                >
                                    Continue
                                    <ArrowLeftIcon className="h-5 w-5 ml-2 transform rotate-180" />
                                </button>
                            </div>
                        ) : (
                            /* Payment Step */
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold">Payment</h2>
                                    <button
                                        onClick={() => setStep('details')}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Edit Details
                                    </button>
                                </div>

                                <div className="text-center">
                                    <CreditCardIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Secure Payment with Razorpay</h3>
                                    <p className="text-gray-600 mb-6">
                                        Pay safely using UPI, Cards, Net Banking, or Wallets
                                    </p>

                                    <button
                                        onClick={handleRazorpayPayment}
                                        disabled={processingPayment}
                                        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                                    >
                                        {processingPayment ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <LockClosedIcon className="h-5 w-5 mr-2" />
                                                Pay ₹{total.toLocaleString()}
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
                                        <ShieldCheckIcon className="h-4 w-4 mr-1" />
                                        256-bit SSL encrypted. Your payment information is secure.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border sticky top-4">
                            {/* Order Summary Header */}
                            <div
                                className="flex items-center justify-between p-4 border-b cursor-pointer lg:cursor-default"
                                onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
                            >
                                <h3 className="font-semibold text-lg">Order Summary</h3>
                                <div className="flex items-center space-x-2">
                                    <span className="font-bold text-lg">₹{total.toLocaleString()}</span>
                                    <ChevronDownSolid
                                        className={`h-5 w-5 transition-transform lg:hidden ${orderSummaryOpen ? 'transform rotate-180' : ''
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Order Summary Content */}
                            <div className={`${orderSummaryOpen ? 'block' : 'hidden lg:block'}`}>
                                {/* Coupon Section */}
                                <div className="p-4 border-b">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <TagIcon className="h-5 w-5 text-gray-400" />
                                        <span className="font-medium">Coupon Code</span>
                                    </div>

                                    {appliedCoupon ? (
                                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-green-600 font-medium">{appliedCoupon.code}</span>
                                                <span className="text-sm text-green-600">
                                                    -{appliedCoupon.type === 'percentage' ? `${appliedCoupon.discount}%` : `₹${appliedCoupon.discount}`}
                                                </span>
                                            </div>
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="text-green-600 hover:text-green-700"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                placeholder="Enter coupon code"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={!couponCode}
                                                className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    )}

                                    {availableCoupons.length > 0 && !appliedCoupon && (
                                        <div className="mt-3">
                                            <p className="text-sm text-gray-600 mb-2">{availableCoupons.length} coupons available</p>
                                            <div className="space-y-1">
                                                {availableCoupons.slice(0, 2).map((coupon) => (
                                                    <button
                                                        key={coupon.code}
                                                        onClick={() => setCouponCode(coupon.code)}
                                                        className="block w-full text-left text-xs text-blue-600 hover:text-blue-700"
                                                    >
                                                        {coupon.code}: {coupon.type === 'percentage' ? `${coupon.discount}% off` : `₹${coupon.discount} off`}
                                                        (Min ₹{coupon.minOrder})
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Items */}
                                <div className="p-4 border-b max-h-60 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={`${item.productId}-${item.variants?.size}-${item.variants?.color}`} className="flex items-center space-x-3 mb-4 last:mb-0">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{item.name}</p>
                                                {item.variants && (
                                                    <p className="text-xs text-gray-500">
                                                        {item.variants.size && `Size: ${item.variants.size}`}
                                                        {item.variants.size && item.variants.color && ', '}
                                                        {item.variants.color && `Color: ${item.variants.color}`}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-sm font-medium">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Breakdown */}
                                <div className="p-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({items.length} items)</span>
                                        <span>₹{subtotal.toLocaleString()}</span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount ({appliedCoupon?.code})</span>
                                            <span>-₹{discount.toLocaleString()}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Tax (GST)</span>
                                        <span>₹{tax.toLocaleString()}</span>
                                    </div>

                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span>₹{total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Security & Powered by Razorpay */}
                                <div className="px-4 pb-4">
                                    <div className="flex items-center justify-center space-x-4 py-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                                            <ShieldCheckIcon className="h-4 w-4" />
                                            <span>Secured</span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                                            <LockClosedIcon className="h-4 w-4" />
                                            <span>Encrypted</span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                                            <CheckIcon className="h-4 w-4" />
                                            <span>Verified</span>
                                        </div>
                                    </div>

                                    <div className="text-center mt-3">
                                        <p className="text-xs text-gray-500">Powered by</p>
                                        <div className="flex items-center justify-center mt-1">
                                            <span className="font-bold text-blue-600 text-sm">Razorpay</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RazorpayCheckoutPage;
