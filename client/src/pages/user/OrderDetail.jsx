import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);

      if (response.data.success) {
        const orderData = response.data.data.order || response.data.data;
        if (!orderData) {
          throw new Error('Order data not found');
        }

        // Ensure all the required fields have default values
        const processedOrder = {
          ...orderData,
          items: (orderData.items || []).map(item => ({
            ...item,
            name: item.name || item.product?.name || 'Product Name Not Available',
            image: item.image || item.product?.images?.[0] || '/placeholder-product.jpg',
            price: item.price || 0,
            quantity: item.quantity || 0,
            subtotal: item.subtotal || (item.price * item.quantity) || 0,
            product: item.product || { _id: null }
          })),
          status: orderData.status || 'pending',
          subtotal: orderData.subtotal || 0,
          shippingCost: orderData.shippingCost || 0,
          tax: orderData.tax || 0,
          discount: orderData.discount || 0,
          total: orderData.total || 0,
          paymentMethod: orderData.paymentMethod || 'N/A',
          paymentStatus: orderData.paymentStatus || 'pending',
          shippingAddress: orderData.shippingAddress || {},
          createdAt: orderData.createdAt || new Date().toISOString()
        };

        setOrder(processedOrder);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to fetch order details');
      navigate('/user/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <ArrowPathIcon className="h-5 w-5 text-blue-600" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <Link
              to="/user/orders"
              className="text-saffron-600 hover:text-saffron-700"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600 mt-1">
                Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Date not available'}
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              {getStatusIcon(order.status || 'pending')}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status || 'pending')}`}>
                {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {(order.items || []).map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product._id || item.product}`}
                        className="text-sm sm:text-base font-medium text-gray-900 hover:text-saffron-600 block"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: ₹{item.price.toLocaleString()}
                      </p>
                      {item.variants && Object.keys(item.variants).length > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                          {Object.entries(item.variants)
                            .filter(([_, value]) => value)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm sm:text-base font-semibold text-gray-900">
                        ₹{item.subtotal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{(order.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>₹{(order.shippingCost || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>₹{(order.tax || 0).toLocaleString()}</span>
                </div>
                {(order.discount || 0) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{(order.discount || 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{(order.total || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{order.shippingAddress?.name || 'N/A'}</p>
                <p>{order.shippingAddress?.addressLine1 || 'N/A'}</p>
                <p>{order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'}</p>
                <p>{order.shippingAddress?.pincode || 'N/A'}</p>
                <p>{order.shippingAddress?.phone || 'N/A'}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="capitalize">{order.paymentMethod || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status</span>
                  <span className={`capitalize ${(order.paymentStatus || 'pending') === 'completed' ? 'text-green-600' :
                      (order.paymentStatus || 'pending') === 'failed' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                    {order.paymentStatus || 'pending'}
                  </span>
                </div>
                {order.paymentDetails?.transactionId && (
                  <div className="flex justify-between">
                    <span>Transaction ID</span>
                    <span className="font-mono text-xs">{order.paymentDetails.transactionId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;