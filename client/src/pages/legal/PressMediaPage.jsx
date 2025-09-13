import React from 'react';

const PressMediaPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Press & Media</h1>

                    <div className="space-y-6 text-gray-600">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Press Releases</h2>
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">VCX Mart Launches New Marketplace Features</h3>
                                    <p className="text-sm text-gray-500 mt-1">September 1, 2025</p>
                                    <p className="mt-2 text-sm">
                                        Enhanced seller tools and customer experience improvements...
                                    </p>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">Q2 2025 Growth Report</h3>
                                    <p className="text-sm text-gray-500 mt-1">July 15, 2025</p>
                                    <p className="mt-2 text-sm">
                                        Record-breaking quarter with 200% YoY growth...
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Media Kit</h2>
                            <p>Download our media resources:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>Company Logos</li>
                                <li>Brand Guidelines</li>
                                <li>Executive Photos</li>
                                <li>Product Screenshots</li>
                                <li>Company Fact Sheet</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Company Overview</h2>
                            <p>
                                VCX Mart is India's leading e-commerce marketplace, connecting millions of sellers with
                                customers nationwide. Founded in 2023, we've grown to serve over 100 cities across India.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Media Coverage</h2>
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">Featured Stories</h3>
                                    <ul className="mt-2 space-y-2 text-sm">
                                        <li>"The Rise of VCX Mart" - TechCrunch</li>
                                        <li>"Revolutionizing Indian E-commerce" - Economic Times</li>
                                        <li>"VCX Mart's Innovation Journey" - YourStory</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Press Team</h2>
                            <p>For press inquiries:</p>
                            <ul className="mt-2 space-y-1">
                                <li>Email: press@vcxmart.com</li>
                                <li>Phone: 1-800-VCXMART (Press Office)</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PressMediaPage;