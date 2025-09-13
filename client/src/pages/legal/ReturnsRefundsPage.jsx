import React from 'react';

const ReturnsRefundsPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Returns & Refunds Policy</h1>

                    <div className="space-y-6 text-gray-600">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Return Policy</h2>
                            <p>We accept returns within 7 days of delivery for most items, subject to the following conditions:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>Item must be unused and in original condition</li>
                                <li>Original packaging must be intact</li>
                                <li>All tags and labels must be attached</li>
                                <li>Must have proof of purchase (order number)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Refund Process</h2>
                            <p>Once we receive your returned item:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>We will inspect the item within 48 hours</li>
                                <li>If approved, refund will be initiated within 3-5 business days</li>
                                <li>Original payment method will be used for refund</li>
                                <li>You will receive an email confirmation once refund is processed</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Non-Returnable Items</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Personal care items</li>
                                <li>Perishable goods</li>
                                <li>Customized products</li>
                                <li>Downloadable software products</li>
                                <li>Gift cards</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Initiate a Return</h2>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>Log into your account</li>
                                <li>Go to Order History</li>
                                <li>Select the order containing the item</li>
                                <li>Click on "Return Item" button</li>
                                <li>Follow the instructions to print return label</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
                            <p>If you have any questions about our Returns & Refunds Policy, please contact us:</p>
                            <ul className="mt-2 space-y-1">
                                <li>Email: support@vcxmart.com</li>
                                <li>Phone: 1-800-VCXMART</li>
                                <li>Hours: Monday to Friday, 9:00 AM - 6:00 PM IST</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnsRefundsPage;