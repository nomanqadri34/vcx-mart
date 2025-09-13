import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BuildingStorefrontIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import api, { adminAPI } from "../../services/api";
import toast from "react-hot-toast";

const AdminSellerManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [selectedStatus]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSellers({ status: selectedStatus });
      console.log('Sellers response:', response.data);
      const applications = response.data?.applications || response.data?.data?.applications || response.data || [];
      console.log('Applications array:', applications);
      // Filter out applications without sellerApplication data
      const validApplications = applications.filter(
        (app) => app && app.sellerApplication
      );
      console.log('Valid applications:', validApplications);
      setApplications(validApplications);
    } catch (error) {
      toast.error("Failed to fetch applications");
      console.error("Error fetching applications:", error);
      setApplications([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getSellerStats();
      const stats = response.data?.data || response.data || {};

      setStats({
        pending: stats.pending || 0,
        approved: stats.approved || 0,
        rejected: stats.rejected || 0,
        total: stats.total || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0,
      });
    }
  };

  const viewApplication = async (applicationId) => {
    try {
      const response = await adminAPI.getSeller(applicationId);
      console.log('Application details response:', response.data);
      const application = response.data?.application || response.data?.data?.application || response.data;
      console.log('Application data:', application);
      setSelectedApplication(application);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching application details:', error);
      toast.error("Failed to fetch application details");
    }
  };

  const approveApplication = async (applicationId) => {
    if (
      !window.confirm(
        "Are you sure you want to approve this seller application?"
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      await adminAPI.approveSeller(applicationId);
      toast.success(
        "Application approved successfully! The user is now a seller."
      );
      setShowModal(false);
      fetchApplications();
      fetchStats();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to approve application";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const rejectApplication = async (applicationId) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to reject this seller application?"
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      await adminAPI.rejectSeller(applicationId, { reason: rejectionReason });
      toast.success("Application rejected successfully");
      setShowModal(false);
      setRejectionReason("");
      fetchApplications();
      fetchStats();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to reject application";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "approved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return ClockIcon;
      case "approved":
        return CheckCircleIcon;
      case "rejected":
        return XCircleIcon;
      default:
        return ClockIcon;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/admin/dashboard"
              className="flex items-center text-saffron-600 hover:text-saffron-700"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Seller Application Management
          </h1>
          <p className="text-gray-600 mt-2">
            Review and manage seller applications for your marketplace
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 p-3 rounded-md">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 p-3 rounded-md">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.approved}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 p-3 rounded-md">
                <XCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.rejected}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-saffron-500 p-3 rounded-md">
                <BuildingStorefrontIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Applications
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex space-x-4">
            {[
              { key: "pending", label: "Pending Review", count: stats.pending },
              { key: "approved", label: "Approved", count: stats.approved },
              { key: "rejected", label: "Rejected", count: stats.rejected },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedStatus(filter.key)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  selectedStatus === filter.key
                    ? "bg-saffron-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading applications...</p>
            </div>
          ) : !applications || applications.length === 0 ? (
            <div className="p-8 text-center">
              <BuildingStorefrontIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No {selectedStatus} applications found
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {applications &&
                applications.map((application) => {
                  const StatusIcon = getStatusIcon(
                    application.sellerApplication?.status
                  );
                  return (
                    <div key={application._id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-saffron-100 rounded-full flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-saffron-600" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {application.firstName} {application.lastName}
                            </h3>
                            <p className="text-sm font-medium text-saffron-600">
                              {application.sellerApplication?.businessName || 'Business name not provided'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {application.sellerApplication?.businessType || 'Business type not specified'}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="flex items-center text-sm text-gray-500">
                                <EnvelopeIcon className="h-4 w-4 mr-1" />
                                {application.email}
                              </span>
                              <span className="flex items-center text-sm text-gray-500">
                                <PhoneIcon className="h-4 w-4 mr-1" />
                                {application.phone}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Applied:{" "}
                              {formatDate(
                                application.sellerApplication?.submittedAt
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div
                              className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                application.sellerApplication?.status
                              )}`}
                            >
                              <StatusIcon className="h-4 w-4 mr-1" />
                              {application.sellerApplication?.status}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {application.sellerApplication?.businessCategory || 'Category not specified'}
                            </p>
                          </div>
                          <button
                            onClick={() => viewApplication(application._id)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Review
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Application Detail Modal */}
        {showModal &&
          selectedApplication &&
          selectedApplication.sellerApplication && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Seller Application Review
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircleIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Application Summary Card */}
                  <div className="bg-gradient-to-r from-saffron-50 to-green-50 border border-saffron-200 rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-saffron-900">
                        {selectedApplication.sellerApplication?.businessName || 'Business Name Not Provided'}
                      </h3>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          selectedApplication.sellerApplication?.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : selectedApplication.sellerApplication?.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedApplication.sellerApplication?.status?.toUpperCase()}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          ID: {selectedApplication.sellerApplication?.applicationId}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Business Type:</span>
                        <p className="text-saffron-700">{selectedApplication.sellerApplication?.businessType}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Category:</span>
                        <p className="text-saffron-700">{selectedApplication.sellerApplication?.businessCategory}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Submitted:</span>
                        <p className="text-saffron-700">{formatDate(selectedApplication.sellerApplication?.submittedAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Personal Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-semibold text-lg">
                            {selectedApplication.firstName?.[0]}{selectedApplication.lastName?.[0]}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          Personal Information
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium text-gray-900">
                            {selectedApplication.firstName} {selectedApplication.lastName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-blue-600 text-sm">
                            {selectedApplication.email}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium text-gray-900">
                            {selectedApplication.phone || 'Not provided'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Member Since:</span>
                          <span className="font-medium text-gray-900 text-sm">
                            {formatDate(selectedApplication.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Business Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-saffron-100 rounded-full flex items-center justify-center mr-3">
                          <BuildingOfficeIcon className="h-5 w-5 text-saffron-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          Business Information
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Business Name:</span>
                          <span className="font-medium text-gray-900">
                            {selectedApplication.sellerApplication?.businessName || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Business Type:</span>
                          <span className="font-medium text-gray-900">
                            {selectedApplication.sellerApplication?.businessType || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium text-saffron-600">
                            {selectedApplication.sellerApplication?.businessCategory || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Business Email:</span>
                          <span className="font-medium text-blue-600 text-sm">
                            {selectedApplication.sellerApplication?.businessEmail || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Business Phone:</span>
                          <span className="font-medium text-gray-900">
                            {selectedApplication.sellerApplication?.businessPhone || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Established:</span>
                          <span className="font-medium text-gray-900">
                            {selectedApplication.sellerApplication?.establishedYear || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Business Address */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <MapPinIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          Business Address
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600 text-sm">Full Address:</span>
                          <p className="font-medium text-gray-900 mt-1">
                            {selectedApplication.sellerApplication?.businessAddress || 'N/A'}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-600 text-sm">City:</span>
                            <p className="font-medium text-gray-900">
                              {selectedApplication.sellerApplication?.city || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 text-sm">State:</span>
                            <p className="font-medium text-gray-900">
                              {selectedApplication.sellerApplication?.state || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Pincode:</span>
                          <p className="font-medium text-gray-900">
                            {selectedApplication.sellerApplication?.pincode || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                    {/* Legal Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          Legal Information
                        </h4>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="text-gray-600 text-sm">PAN Number:</span>
                          <p className="font-mono font-medium text-gray-900 text-lg">
                            {selectedApplication.sellerApplication?.panNumber || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="text-gray-600 text-sm">GST Number:</span>
                          <p className="font-mono font-medium text-gray-900">
                            {selectedApplication.sellerApplication?.gstNumber || 'Not Provided'}
                          </p>
                        </div>
                        <div className="bg-saffron-50 p-3 rounded-lg border border-saffron-200">
                          <span className="text-saffron-700 text-sm font-medium">Application ID:</span>
                          <p className="font-mono font-bold text-saffron-900">
                            {selectedApplication.sellerApplication?.applicationId || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <CreditCardIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          Bank Details
                        </h4>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-600 text-sm">Bank Name:</span>
                            <p className="font-medium text-gray-900 capitalize">
                              {selectedApplication.sellerApplication?.bankName || 'N/A'}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-600 text-sm">Account Holder:</span>
                            <p className="font-medium text-gray-900">
                              {selectedApplication.sellerApplication?.accountHolderName || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-600 text-sm">Account Number:</span>
                            <p className="font-mono font-medium text-gray-900">
                              {selectedApplication.sellerApplication?.bankAccountNumber ? 
                                `****${selectedApplication.sellerApplication.bankAccountNumber.slice(-4)}` : 'N/A'
                              }
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-600 text-sm">IFSC Code:</span>
                            <p className="font-mono font-medium text-gray-900">
                              {selectedApplication.sellerApplication?.bankIFSC || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Third Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Product Categories */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-saffron-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-saffron-600 font-bold text-lg">📦</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          Product Categories
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplication.sellerApplication?.productCategories?.length > 0 ? (
                          selectedApplication.sellerApplication.productCategories.map(
                            (category, index) => (
                              <span
                                key={index}
                                className="px-3 py-2 bg-gradient-to-r from-saffron-100 to-green-100 text-saffron-800 text-sm rounded-full border border-saffron-200 font-medium"
                              >
                                {category}
                              </span>
                            )
                          )
                        ) : (
                          <span className="text-gray-500 text-sm italic">No categories specified</span>
                        )}
                      </div>
                    </div>

                    {/* Business Description */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <DocumentTextIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          Business Description
                        </h4>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-700 leading-relaxed">
                          {selectedApplication.sellerApplication?.businessDescription || 'No description provided'}
                        </p>
                      </div>
                      
                      {/* Additional Information */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <span className="text-blue-700 text-sm font-medium">Expected Monthly Revenue:</span>
                          <p className="text-blue-900 font-semibold">
                            {selectedApplication.sellerApplication?.expectedRevenue || 'Not specified'}
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <span className="text-green-700 text-sm font-medium">Has Physical Store:</span>
                          <p className="text-green-900 font-semibold">
                            {selectedApplication.sellerApplication?.hasPhysicalStore ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <DocumentTextIcon className="h-5 w-5 text-red-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        Submitted Documents
                      </h4>
                    </div>
                    
                    {selectedApplication.sellerApplication?.documents?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedApplication.sellerApplication.documents.map((doc, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900 text-sm">{doc.type}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                doc.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {doc.verified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                            {doc.url ? (
                              <div className="space-y-2">
                                <img 
                                  src={doc.url} 
                                  alt={doc.type}
                                  className="w-full h-32 object-cover rounded border"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <div className="hidden w-full h-32 bg-gray-100 rounded border items-center justify-center">
                                  <span className="text-gray-500 text-sm">Preview not available</span>
                                </div>
                                <a 
                                  href={doc.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-block w-full text-center bg-saffron-600 text-white px-3 py-2 rounded text-sm hover:bg-saffron-700 transition-colors"
                                >
                                  View Document
                                </a>
                              </div>
                            ) : (
                              <div className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center">
                                <span className="text-gray-500 text-sm">No document uploaded</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
                        <DocumentTextIcon className="h-12 w-12 text-red-400 mx-auto mb-3" />
                        <p className="text-red-600 font-medium">No documents uploaded</p>
                        <p className="text-red-500 text-sm mt-1">This application is missing required documentation</p>
                      </div>
                    )}
                  </div>

                  {/* Review Actions */}
                  {selectedApplication.sellerApplication?.status === "pending" && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 text-lg mb-4">
                        Application Review
                      </h4>
                      
                      {/* Rejection Reason Input */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rejection Reason (required if rejecting)
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                          placeholder="Provide a detailed reason for rejection..."
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => approveApplication(selectedApplication._id)}
                          disabled={actionLoading}
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium shadow-md flex items-center justify-center disabled:opacity-50"
                        >
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                          {actionLoading ? "Processing..." : "Approve Application"}
                        </button>
                        <button
                          onClick={() => rejectApplication(selectedApplication._id)}
                          disabled={actionLoading || !rejectionReason.trim()}
                          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          <XCircleIcon className="h-5 w-5 mr-2" />
                          {actionLoading ? "Processing..." : "Reject Application"}
                        </button>
                        <button
                          onClick={() => {
                            setShowModal(false);
                            setRejectionReason('');
                          }}
                          className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all font-medium shadow-md flex items-center justify-center"
                        >
                          <ArrowLeftIcon className="h-5 w-5 mr-2" />
                          Close Review
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Show status for non-pending applications */}
                  {selectedApplication.sellerApplication?.status !==
                    "pending" && (
                    <div className="border-t pt-6">
                      <div
                        className={`p-4 rounded-lg ${
                          selectedApplication.sellerApplication?.status ===
                          "approved"
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <div className="flex items-center">
                          {selectedApplication.sellerApplication?.status ===
                          "approved" ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                          )}
                          <span className="font-medium">
                            Application{" "}
                            {selectedApplication.sellerApplication?.status}
                          </span>
                        </div>
                        {selectedApplication.sellerApplication?.reviewedAt && (
                          <p className="text-sm text-gray-600 mt-1">
                            Reviewed on:{" "}
                            {formatDate(
                              selectedApplication.sellerApplication?.reviewedAt
                            )}
                          </p>
                        )}
                        {selectedApplication.sellerApplication
                          ?.rejectionReason && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-900">
                              Rejection Reason:
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {
                                selectedApplication.sellerApplication
                                  ?.rejectionReason
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default AdminSellerManagement;
