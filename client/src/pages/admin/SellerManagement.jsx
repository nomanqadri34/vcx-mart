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
} from "@heroicons/react/24/outline";
import api from "../../services/api";
import toast from "react-hot-toast";

const SellerManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/sellers?status=${selectedStatus}`);
      setApplications(response.data.data.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const viewApplication = async (applicationId) => {
    try {
      const response = await api.get(`/admin/sellers/${applicationId}`);
      setSelectedApplication(response.data.data.application);
      setShowModal(true);
    } catch (error) {
      toast.error("Failed to fetch application details");
    }
  };

  const approveApplication = async (applicationId) => {
    try {
      setActionLoading(true);
      await api.put(`/admin/sellers/${applicationId}/approve`);
      toast.success("Application approved successfully");
      setShowModal(false);
      fetchApplications();
    } catch (error) {
      toast.error("Failed to approve application");
    } finally {
      setActionLoading(false);
    }
  };

  const rejectApplication = async (applicationId) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setActionLoading(true);
      await api.put(`/admin/sellers/${applicationId}/reject`, {
        reason: rejectionReason,
      });
      toast.success("Application rejected");
      setShowModal(false);
      setRejectionReason("");
      fetchApplications();
    } catch (error) {
      toast.error("Failed to reject application");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Seller Management
              </h1>
              <p className="text-gray-600 mt-2">
                Review and manage seller applications
              </p>
            </div>
            <Link
              to="/admin/categories"
              className="inline-flex items-center px-4 py-2 bg-saffron-600 text-white rounded-lg hover:bg-saffron-700 transition-colors"
            >
              <BuildingStorefrontIcon className="h-5 w-5 mr-2" />
              Manage Categories
            </Link>
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex space-x-4">
            {["pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  selectedStatus === status
                    ? "bg-saffron-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {status} Applications
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
              {applications.map((application) => {
                const StatusIcon = getStatusIcon(
                  application.sellerApplication?.status || "pending"
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
                          <p className="text-sm text-gray-600">
                            {application.sellerApplication?.businessName ||
                              "N/A"}
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
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              application.sellerApplication?.status || "pending"
                            )}`}
                          >
                            <StatusIcon className="h-4 w-4 mr-1" />
                            {application.sellerApplication?.status || "pending"}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {application.sellerApplication?.submittedAt
                              ? new Date(
                                  application.sellerApplication.submittedAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <button
                          onClick={() => viewApplication(application._id)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
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
        {showModal && selectedApplication && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Seller Application Details
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Personal Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Personal Information
                    </h4>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {selectedApplication.firstName}{" "}
                        {selectedApplication.lastName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedApplication.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedApplication.phone}
                      </p>
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Business Information
                    </h4>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Business Name:</span>{" "}
                        {selectedApplication.sellerApplication.businessName}
                      </p>
                      <p>
                        <span className="font-medium">Business Type:</span>{" "}
                        {selectedApplication.sellerApplication.businessType}
                      </p>
                      <p>
                        <span className="font-medium">Contact Person:</span>{" "}
                        {selectedApplication.sellerApplication.contactPerson}
                      </p>
                      <p>
                        <span className="font-medium">Business Phone:</span>{" "}
                        {selectedApplication.sellerApplication.businessPhone}
                      </p>
                    </div>
                  </div>

                  {/* Business Address */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Business Address
                    </h4>
                    <p>
                      {selectedApplication.sellerApplication.businessAddress}
                    </p>
                  </div>

                  {/* Categories */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Product Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.sellerApplication.categories?.map(
                        (category, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-saffron-100 text-saffron-800 text-sm rounded"
                          >
                            {category}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Bank Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <p>
                        <span className="font-medium">Bank Name:</span>{" "}
                        {
                          selectedApplication.sellerApplication.bankDetails
                            ?.bankName
                        }
                      </p>
                      <p>
                        <span className="font-medium">Account Holder:</span>{" "}
                        {
                          selectedApplication.sellerApplication.bankDetails
                            ?.accountHolderName
                        }
                      </p>
                      <p>
                        <span className="font-medium">Account Number:</span>{" "}
                        {
                          selectedApplication.sellerApplication.bankDetails
                            ?.accountNumber
                        }
                      </p>
                      <p>
                        <span className="font-medium">IFSC Code:</span>{" "}
                        {
                          selectedApplication.sellerApplication.bankDetails
                            ?.ifscCode
                        }
                      </p>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedApplication.sellerApplication.documents?.map(
                        (doc, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                            <span className="text-sm capitalize">
                              {doc.type.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {selectedApplication.sellerApplication.status === "pending" && (
                  <div className="border-t pt-6">
                    <div className="flex flex-col space-y-4">
                      {/* Rejection Reason */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rejection Reason (if rejecting)
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                          placeholder="Provide a detailed reason for rejection..."
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() =>
                            rejectApplication(selectedApplication._id)
                          }
                          disabled={actionLoading}
                          className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-50"
                        >
                          {actionLoading ? "Processing..." : "Reject"}
                        </button>
                        <button
                          onClick={() =>
                            approveApplication(selectedApplication._id)
                          }
                          disabled={actionLoading}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionLoading ? "Processing..." : "Approve"}
                        </button>
                      </div>
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

export default SellerManagement;
