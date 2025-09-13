import React from 'react';

const AccessibilityPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Accessibility Statement</h1>

                    <div className="space-y-6 text-gray-600">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Commitment</h2>
                            <p>
                                VCX Mart is committed to ensuring digital accessibility for people with disabilities.
                                We are continually improving the user experience for everyone, and applying the relevant
                                accessibility standards.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Measures Taken</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>WCAG 2.1 Level AA compliance</li>
                                <li>Screen reader compatibility</li>
                                <li>Keyboard navigation support</li>
                                <li>Color contrast optimization</li>
                                <li>Clear and consistent navigation</li>
                                <li>Alternative text for images</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Accessibility Features</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Responsive design for various devices</li>
                                <li>Adjustable text sizes</li>
                                <li>Compatible with screen readers</li>
                                <li>Focus indicators for keyboard navigation</li>
                                <li>Descriptive link texts</li>
                                <li>Proper heading hierarchy</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
                            <p>
                                We welcome your feedback on the accessibility of VCX Mart. Please let us know if you
                                encounter accessibility barriers:
                            </p>
                            <ul className="mt-2 space-y-1">
                                <li>Email: accessibility@vcxmart.com</li>
                                <li>Phone: 1-800-VCXMART</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessibilityPage;