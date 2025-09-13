import React from 'react';

const CareersPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Careers at VCX Mart</h1>

                    <div className="space-y-6 text-gray-600">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Join Our Team</h2>
                            <p>
                                At VCX Mart, we're building the future of e-commerce. We're always looking for talented
                                individuals who share our passion for innovation and customer service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Why VCX Mart?</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Competitive compensation packages</li>
                                <li>Health insurance and wellness benefits</li>
                                <li>Flexible work arrangements</li>
                                <li>Professional development opportunities</li>
                                <li>Stock options</li>
                                <li>Inclusive and diverse workplace</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Open Positions</h2>
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">Engineering</h3>
                                    <ul className="mt-2 space-y-2 text-sm">
                                        <li>Senior Full Stack Developer</li>
                                        <li>Mobile App Developer (React Native)</li>
                                        <li>DevOps Engineer</li>
                                        <li>Data Engineer</li>
                                    </ul>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">Product & Design</h3>
                                    <ul className="mt-2 space-y-2 text-sm">
                                        <li>Product Manager</li>
                                        <li>UX/UI Designer</li>
                                        <li>Product Designer</li>
                                    </ul>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">Operations</h3>
                                    <ul className="mt-2 space-y-2 text-sm">
                                        <li>Operations Manager</li>
                                        <li>Supply Chain Specialist</li>
                                        <li>Customer Success Manager</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Apply</h2>
                            <p>
                                Send your resume and cover letter to careers@vcxmart.com. Please include the position
                                you're applying for in the subject line.
                            </p>
                            <p className="mt-2">
                                For more information about our hiring process and current openings, visit our
                                careers portal at careers.vcxmart.com
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact HR</h2>
                            <ul className="mt-2 space-y-1">
                                <li>Email: hr@vcxmart.com</li>
                                <li>Phone: 1-800-VCXMART (HR Department)</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareersPage;