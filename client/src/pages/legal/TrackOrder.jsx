import React, { useState } from 'react';
import { MagnifyingGlassIcon, TruckIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const TrackOrder = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTrackingData({
        orderNumber: 'VCX' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        status: 'In Transit',
        estimatedDelivery: '2024-01-25',
        currentLocation: 'Mumbai Distribution Center',
        timeline: [
          { status: 'Order Placed', date: '2024-01-20', time: '10:30 AM', completed: true },
          { status: 'Order Confirmed', date: '2024-01-20', time: '11:15 AM', completed: true },
          { status: 'Packed', date: '2024-01-21', time: '02:30 PM', completed: true },
          { status: 'Shipped', date: '2024-01-22', time: '09:00 AM', completed: true },
          { status: 'In Transit', date: '2024-01-23', time: '06:45 PM', completed: true, current: true },
          { status: 'Out for Delivery', date: '2024-01-25', time: 'Expected', completed: false },
          { status: 'Delivered', date: '2024-01-25', time: 'Expected', completed: false }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-xl text-gray-600">Enter your tracking number to get real-time updates</p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <form onSubmit={handleTrack} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter tracking number or order ID"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-saffron-500 focus:border-saffron-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-saffron-600 text-white p-2 rounded-md hover:bg-saffron-700 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <MagnifyingGlassIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Order Summary */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order #{trackingData.orderNumber}</h2>
                  <p className="text-gray-600 mt-1">Current Status: <span className="font-semibold text-saffron-600">{trackingData.status}</span></p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p className="text-lg font-semibold text-gray-900">{new Date(trackingData.estimatedDelivery).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-gray-600">
                <TruckIcon className="h-5 w-5 mr-2" />
                <span>Currently at: {trackingData.currentLocation}</span>
              </div>
            </div>

            {/* Progress Timeline */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Tracking Timeline</h3>
              <div className="space-y-4">
                {trackingData.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {event.completed ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          event.current ? 'bg-saffron-600' : 'bg-green-600'
                        }`}>
                          <CheckCircleIcon className="h-5 w-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <ClockIcon className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className={`font-medium ${
                            event.completed ? (event.current ? 'text-saffron-600' : 'text-green-600') : 'text-gray-400'
                          }`}>
                            {event.status}
                          </p>
                          {event.current && (
                            <p className="text-sm text-saffron-600 font-medium">Current Status</p>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 sm:mt-0">
                          {event.date} {event.time && `at ${event.time}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Delivery Information</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Delivery between 9 AM - 7 PM</li>
                    <li>• Signature required on delivery</li>
                    <li>• SMS/Email updates on status changes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
                  <div className="space-y-2">
                    <a href="/contact" className="block text-sm text-saffron-600 hover:text-saffron-700">
                      Contact Customer Support
                    </a>
                    <a href="/help" className="block text-sm text-saffron-600 hover:text-saffron-700">
                      Visit Help Center
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-saffron-500 to-green-500 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Can't find your tracking number?</h2>
          <p className="mb-6">Check your email or SMS for tracking information, or log in to your account to view order details.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/user/orders"
              className="inline-block bg-white text-saffron-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              View My Orders
            </a>
            <a
              href="/contact"
              className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-saffron-600 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;