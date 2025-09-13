import React from 'react';
import {
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  ShieldCheckIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const ShippingInfo = () => {
  const shippingOptions = [
    {
      type: 'Standard Delivery',
      time: '3-7 Business Days',
      cost: 'Free on orders ₹499+',
      description: 'Regular delivery for most locations across India'
    },
    {
      type: 'Express Delivery',
      time: '1-2 Business Days',
      cost: '₹99 - ₹199',
      description: 'Fast delivery available in major cities'
    },
    {
      type: 'Same Day Delivery',
      time: 'Within 24 Hours',
      cost: '₹299 - ₹499',
      description: 'Available in select metro cities'
    }
  ];

  const deliveryZones = [
    {
      zone: 'Zone A - Metro Cities',
      cities: 'Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad',
      time: '1-3 Days',
      cost: 'Free above ₹499'
    },
    {
      zone: 'Zone B - Major Cities',
      cities: 'Pune, Ahmedabad, Jaipur, Lucknow, Kanpur, Nagpur',
      time: '2-4 Days',
      cost: 'Free above ₹499'
    },
    {
      zone: 'Zone C - Other Cities',
      cities: 'All other cities and towns',
      time: '3-7 Days',
      cost: 'Free above ₹499'
    },
    {
      zone: 'Zone D - Remote Areas',
      cities: 'Rural and remote locations',
      time: '5-10 Days',
      cost: '₹99 shipping charge'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TruckIcon className="h-12 w-12 text-saffron-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Shipping Information</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fast, reliable, and secure delivery across India with multiple shipping options
          </p>
        </div>

        {/* Shipping Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingOptions.map((option, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <ClockIcon className="h-6 w-6 text-saffron-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">{option.type}</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-saffron-600 font-medium">{option.time}</p>
                  <p className="text-green-600 font-medium">{option.cost}</p>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Zones */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Zones</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-saffron-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Zone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Coverage</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Delivery Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Shipping Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {deliveryZones.map((zone, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{zone.zone}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{zone.cities}</td>
                      <td className="px-6 py-4 text-sm text-saffron-600 font-medium">{zone.time}</td>
                      <td className="px-6 py-4 text-sm text-green-600 font-medium">{zone.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Shipping Policies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl p-8 shadow-md">
            <div className="flex items-center mb-6">
              <ShieldCheckIcon className="h-8 w-8 text-saffron-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Shipping Policies</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Order Processing</h4>
                <p className="text-gray-600 text-sm">Orders are processed within 1-2 business days. You'll receive a confirmation email with tracking details.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Packaging</h4>
                <p className="text-gray-600 text-sm">All items are carefully packaged to ensure safe delivery. Fragile items receive extra protection.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Tracking</h4>
                <p className="text-gray-600 text-sm">Track your order in real-time using the tracking number provided via SMS and email.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Delivery Attempts</h4>
                <p className="text-gray-600 text-sm">We make up to 3 delivery attempts. If unsuccessful, the package will be returned to our warehouse.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-md">
            <div className="flex items-center mb-6">
              <InformationCircleIcon className="h-8 w-8 text-saffron-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Important Notes</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Address Accuracy</h4>
                <p className="text-gray-600 text-sm">Please ensure your delivery address is complete and accurate to avoid delays.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                <p className="text-gray-600 text-sm">Provide a valid phone number for delivery coordination and updates.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Holidays & Weekends</h4>
                <p className="text-gray-600 text-sm">Deliveries are not made on Sundays and national holidays. Processing times may be extended during festivals.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Cash on Delivery</h4>
                <p className="text-gray-600 text-sm">COD available for orders up to ₹50,000. Additional charges may apply.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Shipping FAQ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Can I change my delivery address?</h4>
                <p className="text-gray-600 text-sm">Address changes are possible before the order is shipped. Contact our support team immediately.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What if I'm not available for delivery?</h4>
                <p className="text-gray-600 text-sm">Our delivery partner will attempt delivery 3 times and leave a delivery note with contact information.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Do you deliver to PO Box addresses?</h4>
                <p className="text-gray-600 text-sm">Currently, we don't deliver to PO Box addresses. Please provide a physical address.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Are there any restricted items?</h4>
                <p className="text-gray-600 text-sm">Certain items like liquids, batteries, and fragile goods may have shipping restrictions.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What about international shipping?</h4>
                <p className="text-gray-600 text-sm">Currently, we only ship within India. International shipping will be available soon.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How can I track my order?</h4>
                <p className="text-gray-600 text-sm">Use the tracking number sent via SMS/email or check your order status in the 'My Orders' section.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-saffron-500 to-green-500 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Need Help with Shipping?</h3>
          <p className="mb-6 opacity-90">Our customer support team is here to assist you with any shipping-related queries.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:teamvtcx@gmail.com"
              className="inline-flex items-center bg-white text-saffron-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Email Support
            </a>
            <a
              href="/contact"
              className="inline-flex items-center border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-saffron-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;