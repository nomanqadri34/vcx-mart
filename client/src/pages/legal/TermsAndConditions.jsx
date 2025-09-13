import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>

                    <div className="prose prose-saffron max-w-none">
                        <p className="text-gray-600 mb-4">Last updated: September 14, 2025</p>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                            <p className="text-gray-600 mb-4">
                                Welcome to VCX Mart. By accessing or using our website, you agree to be bound by these terms and conditions.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Account Registration</h2>
                            <p className="text-gray-600 mb-4">
                                To use certain features of our website, you must register for an account. You agree to provide accurate information and keep it updated.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
                            <ul className="list-disc list-inside text-gray-600 mb-4">
                                <li className="mb-2">Maintain the security of your account</li>
                                <li className="mb-2">Provide accurate product information (for sellers)</li>
                                <li className="mb-2">Comply with all applicable laws and regulations</li>
                                <li className="mb-2">Respect intellectual property rights</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Prohibited Activities</h2>
                            <p className="text-gray-600 mb-4">
                                Users are prohibited from:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-4">
                                <li className="mb-2">Violating any laws or regulations</li>
                                <li className="mb-2">Posting false or misleading information</li>
                                <li className="mb-2">Interfering with the proper working of the website</li>
                                <li className="mb-2">Attempting to gain unauthorized access</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
                            <p className="text-gray-600 mb-4">
                                All content on VCX Mart, including text, graphics, logos, and software, is protected by intellectual property laws.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Changes to Terms</h2>
                            <p className="text-gray-600 mb-4">
                                We reserve the right to modify these terms at any time. Users will be notified of significant changes.
                            </p>
                        </section>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="text-gray-600">
                                For questions about these terms, please contact us at{' '}
                                <a href="mailto:support@vcxmart.com" className="text-saffron-600 hover:text-saffron-500">
                                    support@vcxmart.com
                                </a>
                            </p>
                            <div className="mt-4">
                                <Link
                                    to="/"
                                    className="text-saffron-600 hover:text-saffron-500 font-medium"
                                >
                                    ← Back to home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;