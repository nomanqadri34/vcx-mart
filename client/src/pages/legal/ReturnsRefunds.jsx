import React from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const ReturnsRefunds = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Returns & Refunds</h1>

          {/* Return Policy Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Policy</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                <span className="font-semibold text-green-800">30-Day Return Window</span>
              </div>
              <p className="text-green-700 mt-2">Most items can be returned within 30 days of delivery for a full refund.</p>
            </div>
          </div>

          {/* Eligible Items */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Eligible for Returns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-1" />
                <span className="text-gray-700">Electronics (unopened packaging)</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-1" />
                <span className="text-gray-700">Fashion & Apparel (with tags)</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-1" />
                <span className="text-gray-700">Home & Kitchen items</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-1" />
                <span className="text-gray-700">Books & Stationery</span>
              </div>
            </div>
          </div>

          {/* Non-Returnable Items */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Non-Returnable Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <XCircleIcon className="h-5 w-5 text-red-500 mt-1" />
                <span className="text-gray-700">Personal care items</span>
              </div>
              <div className="flex items-start space-x-3">
                <XCircleIcon className="h-5 w-5 text-red-500 mt-1" />
                <span className="text-gray-700">Perishable goods</span>
              </div>
              <div className="flex items-start space-x-3">
                <XCircleIcon className="h-5 w-5 text-red-500 mt-1" />
                <span className="text-gray-700">Customized products</span>
              </div>
              <div className="flex items-start space-x-3">
                <XCircleIcon className="h-5 w-5 text-red-500 mt-1" />
                <span className="text-gray-700">Digital downloads</span>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Return an Item</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-saffron-100 text-saffron-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Initiate Return</h4>
                  <p className="text-gray-600">Go to "My Orders" and click "Return Item" next to the product you want to return.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-saffron-100 text-saffron-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Select Reason</h4>
                  <p className="text-gray-600">Choose the reason for return and provide additional details if needed.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-saffron-100 text-saffron-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Schedule Pickup</h4>
                  <p className="text-gray-600">We'll arrange a free pickup from your address within 2-3 business days.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-saffron-100 text-saffron-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Get Refund</h4>
                  <p className="text-gray-600">Refund will be processed within 5-7 business days after we receive the item.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Timeline */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Refund Timeline</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900">Credit/Debit Cards</h4>
                  <p className="text-blue-700 text-sm">5-7 business days</p>
                </div>
                <div className="text-center">
                  <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900">Net Banking/UPI</h4>
                  <p className="text-blue-700 text-sm">3-5 business days</p>
                </div>
                <div className="text-center">
                  <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900">Wallet/COD</h4>
                  <p className="text-blue-700 text-sm">1-3 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Exchange Policy */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Exchange Policy</h3>
            <p className="text-gray-600 mb-4">
              We offer exchanges for size and color variations on fashion items within 15 days of delivery.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Item must be unused with original tags attached</li>
              <li>Exchange subject to availability</li>
              <li>Free pickup and delivery for exchanges</li>
              <li>Price difference (if any) will be adjusted</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about returns or refunds, our customer service team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="inline-block bg-saffron-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-saffron-700 transition-colors text-center"
              >
                Contact Support
              </a>
              <a
                href="/help"
                className="inline-block border border-saffron-600 text-saffron-600 px-6 py-3 rounded-lg font-medium hover:bg-saffron-50 transition-colors text-center"
              >
                Visit Help Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsRefunds;