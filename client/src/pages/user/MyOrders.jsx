import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  EyeIcon,
  ArrowPathIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchOrders();
  }, [filter, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/my-orders', {
        params: {
          page: currentPage,
          limit: 10,
          status: filter
        }
      });

      if (response.data.success) {
        setOrders(response.data.data.docs);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
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

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    try {
      const response = await api.put(`/orders/${orderId}/cancel`, { reason });

      if (response.data.success) {
        toast.success('Order cancelled successfully');
        fetchOrders();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to cancel order');
    }
  };

  const canCancelOrder = (order) => {
    return ['pending', 'confirmed'].includes(order.status);
  };

  const canReviewProduct = (order) => {
    return order.status === 'delivered';
  };

  const handleReviewSubmit = async () => {
    if (!reviewData.comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    try {
      await api.post(`/products/${selectedProduct.productId}/reviews`, {
        rating: reviewData.rating,
        comment: reviewData.comment
      });

      toast.success('Review submitted successfully!');
      setShowReviewModal(false);
      setSelectedProduct(null);
      setReviewData({ rating: 5, comment: '' });
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const openReviewModal = (item) => {
    setSelectedProduct({
      productId: item.product._id || item.product,
      name: item.name,
      image: item.image
    });
    setShowReviewModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow mb-4 p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap gap-2 sm:space-x-8 sm:gap-0">
              {[
                { key: 'all', label: 'All Orders' },
                { key: 'pending', label: 'Pending' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'shipped', label: 'Shipped' },
                { key: 'delivered', label: 'Delivered' },
                { key: 'cancelled', label: 'Cancelled' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setFilter(tab.key);
                    setCurrentPage(1);
                  }}
                  className={`py-2 px-3 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${filter === tab.key
                      ? 'border-saffron-500 text-saffron-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ClockIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-saffron-600 hover:bg-saffron-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                      <div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'Not available'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-base sm:text-lg font-semibold text-gray-900">₹{order.total}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{order.items.length} item(s)</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-4 sm:px-6 py-4">
                  <div className="space-y-4">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.product._id || item.product}`}
                            className="text-xs sm:text-sm font-medium text-gray-900 hover:text-saffron-600 line-clamp-2 block"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Qty: {item.quantity} × ₹{item.price}
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
                        <div className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">
                          ₹{item.subtotal}
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs sm:text-sm text-gray-500 text-center">
                        +{order.items.length - 2} more item(s)
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex flex-wrap gap-2 sm:space-x-3">
                      <Link
                        to={`/user/orders/${order._id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">Details</span>
                      </Link>
                      {order.shipping?.trackingNumber && (
                        <Link
                          to={`/orders/${order._id}/track`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <TruckIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Track Order</span>
                          <span className="sm:hidden">Track</span>
                        </Link>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 sm:space-x-3">
                      {canCancelOrder(order) && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                        >
                          <XCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Cancel Order</span>
                          <span className="sm:hidden">Cancel</span>
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <>
                          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            <span className="hidden sm:inline">Return/Exchange</span>
                            <span className="sm:hidden">Return</span>
                          </button>
                          {order.items.slice(0, 1).map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => openReviewModal(item)}
                              className="inline-flex items-center px-3 py-2 border border-saffron-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-saffron-700 bg-white hover:bg-saffron-50"
                            >
                              <StarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">Review</span>
                              <span className="sm:hidden">★</span>
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                            ? 'z-10 bg-saffron-50 border-saffron-500 text-saffron-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Write a Review</h3>

              {selectedProduct && (
                <div className="mb-4">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">Product: {selectedProduct.name}</p>

                  {/* Rating */}
                  <div className="mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewData({ ...reviewData, rating: star })}
                          className="focus:outline-none"
                        >
                          {star <= reviewData.rating ? (
                            <StarSolidIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
                          ) : (
                            <StarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Review</label>
                    <textarea
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Write your review here..."
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:space-x-3">
                    <button
                      onClick={handleReviewSubmit}
                      className="w-full sm:flex-1 bg-saffron-600 text-white py-2 px-4 rounded-md hover:bg-saffron-700 transition-colors text-sm"
                    >
                      Submit Review
                    </button>
                    <button
                      onClick={() => {
                        setShowReviewModal(false);
                        setSelectedProduct(null);
                        setReviewData({ rating: 5, comment: '' });
                      }}
                      className="w-full sm:flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;