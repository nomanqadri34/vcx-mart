import React from 'react';

const BugBountyPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Bug Bounty Program</h1>

                    <div className="space-y-6 text-gray-600">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Program Overview</h2>
                            <p>
                                VCX Mart values the input of security researchers and the broader community in helping
                                to maintain high security standards. We welcome responsible disclosure of security
                                vulnerabilities.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Scope</h2>
                            <p>The following are in scope for our bug bounty program:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>vcxmart.com and all subdomains</li>
                                <li>VCX Mart mobile applications</li>
                                <li>API endpoints (api.vcxmart.com)</li>
                                <li>Third-party integrations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Rewards</h2>
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">Critical</h3>
                                    <p className="text-sm mt-1">₹50,000 - ₹200,000</p>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">High</h3>
                                    <p className="text-sm mt-1">₹20,000 - ₹50,000</p>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">Medium</h3>
                                    <p className="text-sm mt-1">₹5,000 - ₹20,000</p>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">Low</h3>
                                    <p className="text-sm mt-1">₹1,000 - ₹5,000</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Reporting Guidelines</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Provide detailed reports with reproducible steps</li>
                                <li>Include impact assessment of the vulnerability</li>
                                <li>Submit one vulnerability per report</li>
                                <li>Do not perform DoS attacks or automated scanning</li>
                                <li>Respect user privacy and data</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact</h2>
                            <p>Submit vulnerabilities to:</p>
                            <ul className="mt-2 space-y-1">
                                <li>Email: security@vcxmart.com</li>
                                <li>HackerOne: hackerone.com/vcxmart</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BugBountyPage;