import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { sellerAPI } from "../../services/api";
import {
  UserIcon,
  ShoppingBagIcon,
  MapPinIcon,
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
  const [timeLeft, setTimeLeft] = useState({});
  const [isShopOpen, setIsShopOpen] = useState(false);

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

  useEffect(() => {
    const shopOpenDate = new Date("2025-10-01T00:00:00+05:30");

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = shopOpenDate.getTime() - now;

      if (distance < 0) {
        setIsShopOpen(true);
        clearInterval(timer);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
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
        icon: ClockIcon,
      },
      under_review: {
        color: "bg-blue-100 text-blue-800",
        text: "Under Review",
        icon: ExclamationTriangleIcon,
      },
      approved: {
        color: "bg-green-100 text-green-800",
        text: "Approved",
        icon: CheckCircleIcon,
      },
      rejected: {
        color: "bg-red-100 text-red-800",
        text: "Rejected",
        icon: XCircleIcon,
      },
      requires_changes: {
        color: "bg-orange-100 text-orange-800",
        text: "Requires Changes",
        icon: ExclamationTriangleIcon,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="h-4 w-4 mr-1" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const dashboardItems = [
    {
      title: "Profile",
      description: "Manage your personal information",
      icon: UserIcon,
      href: "/user/profile",
      color: "bg-blue-500",
    },
    {
      title: "Orders",
      description: "Track your orders and purchase history",
      icon: ShoppingBagIcon,
      href: "/user/orders",
      color: "bg-green-500",
    },
    {
      title: "Addresses",
      description: "Manage your shipping addresses",
      icon: MapPinIcon,
      href: "/user/addresses",
      color: "bg-purple-500",
    },
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

        {/* Shop Opening Countdown */}
        {!isShopOpen ? (
          <div className="mb-6 sm:mb-8 bg-gradient-to-r from-saffron-500 to-orange-600 text-white rounded-lg p-3 sm:p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <ClockIcon className="h-4 w-4 sm:h-6 sm:w-6 mr-1 sm:mr-2" />
                <h2 className="text-sm sm:text-xl font-bold">
                  Shop opens on Oct 1st, 2025
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 max-w-xs sm:max-w-md mx-auto mb-3 sm:mb-4">
                <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                  <div className="text-lg sm:text-2xl font-bold">
                    {timeLeft.days || 0}
                  </div>
                  <div className="text-xs sm:text-sm opacity-90">Days</div>
                </div>
                <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                  <div className="text-lg sm:text-2xl font-bold">
                    {timeLeft.hours || 0}
                  </div>
                  <div className="text-xs sm:text-sm opacity-90">Hours</div>
                </div>
                <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                  <div className="text-lg sm:text-2xl font-bold">
                    {timeLeft.minutes || 0}
                  </div>
                  <div className="text-xs sm:text-sm opacity-90">Minutes</div>
                </div>
                <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                  <div className="text-lg sm:text-2xl font-bold">
                    {timeLeft.seconds || 0}
                  </div>
                  <div className="text-xs sm:text-sm opacity-90">Seconds</div>
                </div>
              </div>

              <p className="text-xs sm:text-base text-saffron-100">
                Get ready for amazing deals and products!
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-1 px-2">
            <div className="text-center">
              <span className="text-xs font-semibold">
                🎉 VCX MART is now LIVE! Start shopping now!
              </span>
            </div>
          </div>
        )}

        {/* Seller Application Status */}
        {!loading && (
          <div className="mb-8">
            {user?.role === "seller" ? (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <BuildingStorefrontIcon className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Seller Account
                    </h3>
                    <p className="text-gray-600">
                      You are a verified seller on our platform
                    </p>
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
                      <h3 className="text-lg font-medium text-gray-900">
                        Seller Application
                      </h3>
                      <p className="text-gray-600">
                        Application ID:{" "}
                        {sellerApplicationStatus.application.applicationId}
                      </p>
                      <p className="text-sm text-gray-500">
                        Submitted on{" "}
                        {formatDate(
                          sellerApplicationStatus.application.submittedAt
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getApplicationStatusBadge(
                      sellerApplicationStatus.application.status
                    )}
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
                      <p className="text-saffron-100">To sell your products</p>
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
                    <div
                      className={`flex-shrink-0 p-3 rounded-md ${item.color}`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
