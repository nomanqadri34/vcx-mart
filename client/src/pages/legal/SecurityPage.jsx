import React from 'react';

const SecurityPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Security</h1>

                    <div className="space-y-6 text-gray-600">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Security Commitment</h2>
                            <p>
                                At VCX Mart, we take security seriously. We implement industry-leading security measures
                                to protect our customers, sellers, and platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Security Features</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>End-to-end encryption for all transactions</li>
                                <li>Two-factor authentication (2FA)</li>
                                <li>Regular security audits</li>
                                <li>PCI DSS compliance</li>
                                <li>24/7 fraud monitoring</li>
                                <li>Secure payment processing</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Protection</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Encrypted data storage</li>
                                <li>Regular data backups</li>
                                <li>Strict access controls</li>
                                <li>Privacy by design</li>
                                <li>GDPR compliance</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Safe Shopping Tips</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Always use strong, unique passwords</li>
                                <li>Enable two-factor authentication</li>
                                <li>Verify seller ratings and reviews</li>
                                <li>Check for secure connection (HTTPS)</li>
                                <li>Keep your account information private</li>
                                <li>Report suspicious activities</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Security Certifications</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>ISO 27001 certified</li>
                                <li>PCI DSS Level 1 compliant</li>
                                <li>SOC 2 Type II certified</li>
                                <li>GDPR compliant</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Report Security Issues</h2>
                            <p>
                                If you discover a security vulnerability or have concerns about the security of your
                                account, please contact us immediately:
                            </p>
                            <ul className="mt-2 space-y-1">
                                <li>Email: security@vcxmart.com</li>
                                <li>Security Hotline: 1-800-VCXMART (Security Team)</li>
                            </ul>
                        </section>

                        <section className="border-t pt-6">
                            <p className="text-sm text-gray-500">
                                For our bug bounty program and responsible disclosure policy, please visit our
                                <a href="/bug-bounty" className="text-saffron-600 hover:text-saffron-700"> Bug Bounty page</a>.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityPage;