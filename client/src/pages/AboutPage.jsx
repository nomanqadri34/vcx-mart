import React from 'react';
import { ShieldCheckIcon, TruckIcon, HeartIcon, UsersIcon, GlobeAltIcon, StarIcon } from '@heroicons/react/24/outline';

const AboutPage = () => {
    const features = [
        { icon: ShieldCheckIcon, title: 'Verified Sellers', desc: 'All sellers are thoroughly verified for quality assurance' },
        { icon: TruckIcon, title: 'Fast Delivery', desc: 'Quick and reliable shipping across India' },
        { icon: HeartIcon, title: '24/7 Support', desc: 'Round-the-clock customer service' },
        { icon: UsersIcon, title: 'Trusted Community', desc: 'Join millions of satisfied customers' }
    ];

    const stats = [
        { number: '10K+', label: 'Products' },
        { number: '500+', label: 'Sellers' },
        { number: '50K+', label: 'Customers' },
        { number: '99%', label: 'Satisfaction' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                            About <span className="text-yellow-400">Cryptomart</span>
                        </h1>
                        <p className="text-xl sm:text-2xl max-w-3xl mx-auto opacity-90">
                            India's premier multi-vendor marketplace connecting buyers with trusted sellers nationwide
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                                Our Mission
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                To democratize e-commerce by providing a platform where small and medium businesses can reach customers nationwide while offering buyers access to quality products at competitive prices.
                            </p>
                            <p className="text-lg text-gray-600">
                                We believe in empowering entrepreneurs and creating opportunities for businesses of all sizes to thrive in the digital marketplace.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 sm:p-12">
                            <GlobeAltIcon className="h-16 w-16 text-blue-600 mb-6" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Nationwide Reach</h3>
                            <p className="text-gray-600">
                                Connecting sellers and buyers across all states and territories of India with seamless logistics and support.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Cryptomart?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Experience the best of online shopping with our commitment to quality, security, and customer satisfaction.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 sm:p-12 lg:p-16 text-white">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                                    Our Values
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <StarIcon className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold mb-1">Quality First</h3>
                                            <p className="opacity-90">Every product and seller is carefully vetted for quality assurance</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <StarIcon className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold mb-1">Customer Centric</h3>
                                            <p className="opacity-90">Your satisfaction is our top priority with easy returns and support</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <StarIcon className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold mb-1">Innovation</h3>
                                            <p className="opacity-90">Continuously improving our platform with latest technology</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center lg:text-right">
                                <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                                    <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
                                    <p className="mb-6 opacity-90">Be part of India's fastest growing marketplace</p>
                                    <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                        Get Started
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
                        Get in Touch
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                            <p className="text-blue-600">support@cryptomart.com</p>
                        </div>
                        <div className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                            <p className="text-blue-600">+91-XXXX-XXXXXX</p>
                        </div>
                        <div className="p-6 sm:col-span-2 lg:col-span-1">
                            <h3 className="font-semibold text-gray-900 mb-2">Support Hours</h3>
                            <p className="text-gray-600">24/7 Available</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;