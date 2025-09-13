import React from 'react';

const ShippingInfoPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Shipping Information</h1>

                    <div className="space-y-6 text-gray-600">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Shipping Methods</h2>
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">Standard Delivery</h3>
                                    <p className="text-sm mt-1">4-7 business days</p>
                                    <p className="text-sm text-gray-500">Free for orders above ₹499</p>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">Express Delivery</h3>
                                    <p className="text-sm mt-1">2-3 business days</p>
                                    <p className="text-sm text-gray-500">₹99 for all orders</p>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">Same Day Delivery</h3>
                                    <p className="text-sm mt-1">Available in select cities</p>
                                    <p className="text-sm text-gray-500">₹199 for all orders</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Order Tracking</h2>
                            <p>Track your order status easily:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>Login to your account</li>
                                <li>Visit My Orders section</li>
                                <li>Click on "Track Order" button</li>
                                <li>Real-time updates via email and SMS</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Shipping Coverage</h2>
                            <p>We currently ship to most locations in India:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>All major cities with express delivery</li>
                                <li>Tier 2 & 3 cities with standard delivery</li>
                                <li>Remote locations may have extended delivery times</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Delivery Guidelines</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Signature required for items above ₹5000</li>
                                <li>Someone must be available to receive the package</li>
                                <li>Valid ID may be required for high-value items</li>
                                <li>Three delivery attempts will be made</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Shipping Support</h2>
                            <p>For any shipping related queries:</p>
                            <ul className="mt-2 space-y-1">
                                <li>Email: shipping@vcxmart.com</li>
                                <li>Phone: 1-800-VCXMART</li>
                                <li>Hours: Monday to Saturday, 9:00 AM - 8:00 PM IST</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingInfoPage;