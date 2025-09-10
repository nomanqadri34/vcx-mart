import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { sellerAPI } from "../../services/api";
import {
  UserIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  MapPinIcon,
  BellIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const UserDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [sellerApplicationStatus, setSellerApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear the message from navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchSellerApplicationStatus();
  }, []);

  const fetchSellerApplicationStatus = async () => {
    try {
      const response = await sellerAPI.getApplicationStatus();
      if (response.data.success) {
        setSellerApplicationStatus(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch seller application status:", error);
    } finally {
      setLoading(false);
    }
  };

  const getApplicationStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        color: "bg-yellow-100 text-yellow-800", 
        text: "Pending Review", 
        icon: ClockIcon 
      },
      under_review: { 
        color: "bg-blue-100 text-blue-800", 
        text: "Under Review", 
        icon: ExclamationTriangleIcon 
      },
      approved: { 
        color: "bg-green-100 text-green-800", 
        text: "Approved", 
        icon: CheckCircleIcon 
      },
      rejected: { 
        color: "bg-red-100 text-red-800", 
        text: "Rejected", 
        icon: XCircleIcon 
      },
      requires_changes: { 
        color: "bg-orange-100 text-orange-800", 
        text: "Requires Changes", 
        icon: ExclamationTriangleIcon 
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-4 w-4 mr-1" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const dashboardItems = [
    {
      title: "Profile",
      description: "Manage your personal information",
      icon: UserIcon,
      href: "/user/profile",
      color: "bg-blue-500"
    },
    {
      title: "Orders",
      description: "Track your orders and purchase history",
      icon: ShoppingBagIcon,
      href: "/user/orders",
      color: "bg-green-500"
    },
    {
      title: "Addresses",
      description: "Manage your shipping addresses",
      icon: MapPinIcon,
      href: "/user/addresses",
      color: "bg-purple-500"
    },
    {
      title: "Payment Methods",
      description: "Manage your payment options",
      icon: CreditCardIcon,
      href: "/user/payments",
      color: "bg-indigo-500"
    },
    {
      title: "Notifications",
      description: "View and manage notifications",
      icon: BellIcon,
      href: "/user/notifications",
      color: "bg-yellow-500"
    },
    {
      title: "Security",
      description: "Password and security settings",
      icon: ShieldCheckIcon,
      href: "/user/security",
      color: "bg-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your account and track your activities
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {message}
          </div>
        )}

        {/* Seller Application Status */}
        {!loading && (
          <div className="mb-8">
            {user?.role === 'seller' ? (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <BuildingStorefrontIcon className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Seller Account</h3>
                    <p className="text-gray-600">You are a verified seller on our platform</p>
                  </div>
                  <div className="ml-auto">
                    <Link
                      to="/seller/dashboard"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-saffron-600 hover:bg-saffron-700"
                    >
                      Go to Seller Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            ) : sellerApplicationStatus?.hasApplication ? (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BuildingStorefrontIcon className="h-8 w-8 text-saffron-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Seller Application</h3>
                      <p className="text-gray-600">
                        Application ID: {sellerApplicationStatus.application.applicationId}
                      </p>
                      <p className="text-sm text-gray-500">
                        Submitted on {formatDate(sellerApplicationStatus.application.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getApplicationStatusBadge(sellerApplicationStatus.application.status)}
                    {sellerApplicationStatus.application.rejectionReason && (
                      <p className="mt-2 text-sm text-red-600">
                        {sellerApplicationStatus.application.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-saffron-500 to-green-500 shadow rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BuildingStorefrontIcon className="h-8 w-8 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium">Become a Seller</h3>
                      <p className="text-saffron-100">
                        Start selling your products on our marketplace
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/become-seller"
                    className="inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md text-saffron-600 bg-white hover:bg-gray-50"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.title}
                to={item.href}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 p-3 rounded-md ${item.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Account Overview</h3>
          </div>
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(user?.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user?.isEmailVerified ? (
                    <span className="text-green-600">Verified</span>
                  ) : (
                    <span className="text-red-600">Not Verified</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user?.isPhoneVerified ? (
                    <span className="text-green-600">Verified</span>
                  ) : (
                    <span className="text-red-600">Not Verified</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">
                  {user?.role || 'User'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;