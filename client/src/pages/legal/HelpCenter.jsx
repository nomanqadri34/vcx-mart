import React, { useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      category: 'Orders & Payment',
      questions: [
        {
          q: 'How do I place an order?',
          a: 'Browse products, add to cart, proceed to checkout, fill shipping details, and complete payment.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept Credit/Debit Cards, Net Banking, UPI, Wallets, and Cash on Delivery.'
        },
        {
          q: 'Can I modify or cancel my order?',
          a: 'Orders can be modified or cancelled within 1 hour of placement if not yet processed.'
        }
      ]
    },
    {
      category: 'Shipping & Delivery',
      questions: [
        {
          q: 'How long does delivery take?',
          a: 'Standard delivery takes 3-7 business days. Express delivery available in select cities.'
        },
        {
          q: 'Do you deliver internationally?',
          a: 'Currently we only deliver within India. International shipping coming soon.'
        },
        {
          q: 'How can I track my order?',
          a: 'Use the tracking number sent via SMS/email or check order status in your account.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          q: 'What is your return policy?',
          a: '30-day return policy for most items. Items must be unused and in original packaging.'
        },
        {
          q: 'How do I initiate a return?',
          a: 'Go to My Orders, select the item, click Return, and follow the instructions.'
        },
        {
          q: 'When will I receive my refund?',
          a: 'Refunds are processed within 5-7 business days after we receive the returned item.'
        }
      ]
    },
    {
      category: 'Account & Security',
      questions: [
        {
          q: 'How do I reset my password?',
          a: 'Click "Forgot Password" on login page and follow the instructions sent to your email.'
        },
        {
          q: 'How do I update my profile information?',
          a: 'Go to Account Settings in your profile to update personal information and addresses.'
        },
        {
          q: 'Is my personal information secure?',
          a: 'Yes, we use industry-standard encryption and security measures to protect your data.'
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq => 
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600">Find answers to frequently asked questions</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-saffron-500 focus:border-saffron-500"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.category}</h2>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const faqId = `${categoryIndex}-${faqIndex}`;
                    return (
                      <div key={faqIndex} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => setOpenFaq(openFaq === faqId ? null : faqId)}
                          className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
                        >
                          <span className="font-medium text-gray-900">{faq.q}</span>
                          <ChevronDownIcon 
                            className={`h-5 w-5 text-gray-500 transform transition-transform ${
                              openFaq === faqId ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {openFaq === faqId && (
                          <div className="px-4 pb-3">
                            <p className="text-gray-600">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-saffron-500 to-green-500 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="mb-6">Can't find what you're looking for? Our support team is here to help.</p>
          <a
            href="/contact"
            className="inline-block bg-white text-saffron-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;