import React from 'react';
import { TruckIcon, ClockIcon, MapPinIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';

const ShippingInfo = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shipping Information</h1>

          {/* Shipping Options */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <TruckIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Standard Delivery</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• 5-7 business days</li>
                  <li>• Free on orders above ₹499</li>
                  <li>• ₹49 for orders below ₹499</li>
                  <li>• Available across India</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ClockIcon className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Express Delivery</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• 1-3 business days</li>
                  <li>• ₹99 shipping charge</li>
                  <li>• Available in major cities</li>
                  <li>• Priority handling</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Delivery Areas */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Delivery Coverage</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <MapPinIcon className="h-6 w-6 text-green-600 mr-2" />
                <span className="font-semibold text-green-800">Pan-India Delivery</span>
              </div>
              <p className="text-green-700 mb-4">We deliver to all serviceable pin codes across India, including:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-green-700">
                <div>• Metro Cities</div>
                <div>• Tier 2 Cities</div>
                <div>• Rural Areas</div>
                <div>• Remote Locations</div>
              </div>
            </div>
          </div>

          {/* Shipping Charges */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Charges</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left">Order Value</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">Standard Delivery</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">Express Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">Below ₹499</td>
                    <td className="border border-gray-300 px-4 py-3">₹49</td>
                    <td className="border border-gray-300 px-4 py-3">₹99</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">₹499 - ₹999</td>
                    <td className="border border-gray-300 px-4 py-3 text-green-600 font-semibold">FREE</td>
                    <td className="border border-gray-300 px-4 py-3">₹99</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">Above ₹999</td>
                    <td className="border border-gray-300 px-4 py-3 text-green-600 font-semibold">FREE</td>
                    <td className="border border-gray-300 px-4 py-3">₹49</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Processing Time */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Processing</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900">Order Confirmation</h4>
                  <p className="text-blue-700 text-sm">Within 2 hours</p>
                </div>
                <div className="text-center">
                  <TruckIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900">Processing</h4>
                  <p className="text-blue-700 text-sm">1-2 business days</p>
                </div>
                <div className="text-center">
                  <MapPinIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900">Dispatch</h4>
                  <p className="text-blue-700 text-sm">Same/Next day</p>
                </div>
              </div>
            </div>
          </div>

          {/* Special Categories */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Special Shipping Categories</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-saffron-500 bg-saffron-50 p-4">
                <h4 className="font-semibold text-saffron-900">Electronics</h4>
                <p className="text-saffron-700 text-sm">Extra care packaging, signature required on delivery</p>
              </div>
              <div className="border-l-4 border-green-500 bg-green-50 p-4">
                <h4 className="font-semibold text-green-900">Fragile Items</h4>
                <p className="text-green-700 text-sm">Bubble wrap protection, careful handling throughout transit</p>
              </div>
              <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                <h4 className="font-semibold text-blue-900">Large Items</h4>
                <p className="text-blue-700 text-sm">White glove delivery service, installation support available</p>
              </div>
            </div>
          </div>

          {/* Tracking Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Tracking</h3>
            <p className="text-gray-600 mb-4">
              Once your order is shipped, you'll receive a tracking number via SMS and email. You can track your order:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>In your account under "My Orders"</li>
              <li>Using the tracking link in your email</li>
              <li>On our website's track order page</li>
              <li>Through our mobile app</li>
            </ul>
            <a
              href="/track-order"
              className="inline-block bg-saffron-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-saffron-700 transition-colors"
            >
              Track Your Order
            </a>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Support</h3>
            <p className="text-gray-600 mb-4">
              Have questions about shipping? Our customer service team is available to help.
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

export default ShippingInfo;