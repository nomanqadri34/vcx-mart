import React from 'react';
import { Link } from 'react-router-dom';
import {
  QuestionMarkCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

const HelpPage = () => {
  const helpCategories = [
    {
      title: 'Orders & Shipping',
      icon: TruckIcon,
      items: [
        'Track your order',
        'Shipping information',
        'Delivery issues',
        'Order cancellation',
      ],
    },
    {
      title: 'Payments & Refunds',
      icon: CreditCardIcon,
      items: [
        'Payment methods',
        'Refund policy',
        'Payment issues',
        'Billing questions',
      ],
    },
    {
      title: 'Account & Security',
      icon: ShieldCheckIcon,
      items: [
        'Account settings',
        'Password reset',
        'Privacy settings',
        'Security tips',
      ],
    },
    {
      title: 'Products & Returns',
      icon: DocumentTextIcon,
      items: [
        'Product information',
        'Return policy',
        'Exchange process',
        'Quality issues',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <QuestionMarkCircleIcon className="h-12 w-12 text-saffron-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Help Center</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to your questions or get in touch with our support team
          </p>
        </div>

        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <PhoneIcon className="h-8 w-8 text-saffron-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 text-sm mb-3">Mon-Fri 9AM-6PM</p>
            <a href="tel:+919390817001" className="text-saffron-600 font-medium">
              +91 9390817001
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <EnvelopeIcon className="h-8 w-8 text-saffron-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 text-sm mb-3">We'll respond within 24hrs</p>
            <a href="mailto:teamvtcx@gmail.com" className="text-saffron-600 font-medium">
              teamvtcx@gmail.com
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-saffron-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-3">Available 24/7</p>
            <button className="text-saffron-600 font-medium">
              Start Chat
            </button>
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {helpCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <Icon className="h-6 w-6 text-saffron-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        to="#"
                        className="text-gray-600 hover:text-saffron-600 transition-colors text-sm"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How can I track my order?
              </h3>
              <p className="text-gray-600 text-sm">
                You can track your order by logging into your account and visiting the "My Orders" section, or by using the tracking number sent to your email.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What is your return policy?
              </h3>
              <p className="text-gray-600 text-sm">
                We offer a 30-day return policy for most items. Products must be in original condition with tags attached.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How long does shipping take?
              </h3>
              <p className="text-gray-600 text-sm">
                Standard shipping takes 3-7 business days. Express shipping is available for 1-2 business days delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;