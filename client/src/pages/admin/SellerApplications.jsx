import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CreditCardIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { subscriptionAPI } from '../../services/api';
import toast from 'react-hot-toast';

const SellerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscriptionStats, setSubscriptionStats] = useState({});
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    fetchApplications();
    fetchStats();
    fetchSubscriptionStats();
  }, [filters]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        status: filters.status,
        search: filters.search,
        page: filters.page,
        limit: filters.limit,
      });

      const baseURL = process.env.REACT_APP_API_URL || 'https://vcx-mart.onrender.com/api/v1';
      const response = await fetch(`${baseURL}/seller/applications?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setApplications(result.data.docs || []);
      } else {
        setError(result.error?.message || "Failed to fetch applications");
      }
    } catch (err) {
      setError("Failed to fetch applications");
      console.error("Fetch applications error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const baseURL = process.env.REACT_APP_API_URL || 'https://vcx-mart.onrender.com/api/v1';
      const response = await fetch(`${baseURL}/seller/applications/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error("Fetch stats error:", err);
    }
  };

  const fetchSubscriptionStats = async () => {
    try {
      const response = await subscriptionAPI.getPlans();
      if (response.success) {
        setSubscriptionStats(response.data);
      }
    } catch (err) {
      console.error("Fetch subscription stats error:", err);
    }
  };

  const handleApproveWithSubscription = async (applicationId) => {
    try {
      const baseURL = process.env.REACT_APP_API_URL || 'https://vcx-mart.onrender.com/api/v1';
      const response = await fetch(`${baseURL}/seller/applications/${applicationId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ requiresSubscription: true })
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Application approved! Seller will be notified to complete subscription.');
        fetchApplications();
      } else {
        toast.error(result.error?.message || 'Failed to approve application');
      }
    } catch (err) {
      toast.error('Failed to approve application');
    }
  };

  const handleStatusChange = (status) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      under_review: {
        color: "bg-blue-100 text-blue-800",
        text: "Under Review",
      },
      approved: { color: "bg-green-100 text-green-800", text: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", text: "Rejected" },
      requires_changes: {
        color: "bg-orange-100 text-orange-800",
        text: "Requires Changes",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Seller Applications
          </h1>
          <p className="mt-2 text-gray-600">
            Manage and review seller applications
          </p>
        </div>

        {/* Payment Flow */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Seller Onboarding Payment Flow</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Registration */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Registration Fee</h3>
                <div className="mb-3">
                  <p className="text-2xl font-bold">₹50</p>
                  <p className="text-xs opacity-90">One-time payment</p>
                </div>
                <div className="text-xs">
                  <p className="opacity-90">• Account activation</p>
                  <p className="opacity-90">• Platform access</p>
                </div>
              </div>
            </div>

            {/* Step 2: Subscription */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Monthly Autopay</h3>
                <div className="mb-3">
                  <p className="text-2xl font-bold">
                    {new Date() <= new Date('2025-10-01') ? '₹500' : '₹800'}
                  </p>
                  <p className="text-xs opacity-90">
                    {new Date() <= new Date('2025-10-01') ? 'Early Bird' : 'Regular'} Plan
                  </p>
                </div>
                <div className="text-xs">
                  <p className="opacity-90">• 0% commission</p>
                  <p className="opacity-90">• Direct payments</p>
                </div>
              </div>
            </div>

            {/* Step 3: Application */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Submit Application</h3>
                <div className="mb-3">
                  <p className="text-2xl font-bold">✓</p>
                  <p className="text-xs opacity-90">Complete setup</p>
                </div>
                <div className="text-xs">
                  <p className="opacity-90">• Business details</p>
                  <p className="opacity-90">• Document upload</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Total First Payment: ₹{50 + (new Date() <= new Date('2025-10-01') ? 500 : 800)} 
              (₹50 registration + ₹{new Date() <= new Date('2025-10-01') ? 500 : 800} first month)
            </p>
          </div>
        </div>

        {/* Subscription Revenue Card */}
        <div className="bg-gradient-to-r from-saffron-500 to-orange-600 rounded-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Subscription Revenue</h3>
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-2xl font-bold">₹{(subscriptionStats.totalRevenue || 0).toLocaleString()}</p>
                  <p className="text-sm opacity-90">Total Revenue</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">{subscriptionStats.activeSubscriptions || 0}</p>
                  <p className="text-sm opacity-90">Active Subscriptions</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 mb-1">
                <span className="block">Early Bird: ₹{((subscriptionStats.planARevenue || 0)).toLocaleString()}</span>
                <span className="block">Regular: ₹{((subscriptionStats.planBRevenue || 0)).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.total || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.pending || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Under Review
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.under_review || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Approved
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.approved || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Rejected
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.rejected || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <form onSubmit={handleSearch} className="flex">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Search by business name, application ID, or email..."
                      value={filters.search}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-saffron-500 focus:border-saffron-500"
                  >
                    Search
                  </button>
                </form>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={filters.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="requires_changes">Requires Changes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No applications found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {applications.map((application) => (
                <li key={application._id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-saffron-100 flex items-center justify-center">
                            <span className="text-saffron-600 font-medium text-sm">
                              {application.businessName?.charAt(0).toUpperCase() || "S"}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {application.businessName}
                            </p>
                            <div className="ml-2">
                              {getStatusBadge(application.status)}
                            </div>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-gray-500">
                              {application.user?.firstName} {application.user?.lastName} •{" "}
                              {application.user?.email}
                            </p>
                            <p className="text-sm text-gray-500">
                              {application.businessCategory} • Submitted{" "}
                              {formatDate(application.submittedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/seller-applications/${application._id}`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </Link>
                        {application.status === 'pending' && (
                          <button
                            onClick={() => handleApproveWithSubscription(application._id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <StarIcon className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                        )}
                        {application.subscriptionStatus && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            application.subscriptionStatus === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {application.subscriptionStatus === 'active' ? 'Subscribed' : 'Pending Payment'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {applications.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={filters.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page{" "}
                  <span className="font-medium">{filters.page}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: Math.max(1, prev.page - 1),
                      }))
                    }
                    disabled={filters.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                    }
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerApplications;
