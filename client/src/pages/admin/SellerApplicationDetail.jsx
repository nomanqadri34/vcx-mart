import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const SellerApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionNotes, setActionNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/admin/sellers/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        // Flatten the structure for easier access
        const app = result.data.application;
        const flattenedApp = {
          ...app.sellerApplication,
          user: {
            firstName: app.firstName,
            lastName: app.lastName,
            email: app.email,
            phone: app.phone,
            createdAt: app.createdAt,
          },
        };
        setApplication(flattenedApp);
      } else {
        setError(result.error?.message || "Failed to fetch application");
      }
    } catch (err) {
      setError("Failed to fetch application");
      console.error("Fetch application error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/v1/admin/sellers/${id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ notes: actionNotes }),
      });

      const result = await response.json();
      if (result.success) {
        setApplication(result.data.application);
        setShowApproveModal(false);
        setActionNotes("");
        // Refresh the applications list
        window.location.reload();
      } else {
        setError(result.error?.message || "Failed to approve application");
      }
    } catch (err) {
      setError("Failed to approve application");
      console.error("Approve application error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/v1/admin/sellers/${id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          reason: rejectionReason,
          notes: actionNotes,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setApplication(result.data.application);
        setShowRejectModal(false);
        setActionNotes("");
        setRejectionReason("");
      } else {
        setError(result.error?.message || "Failed to reject application");
      }
    } catch (err) {
      setError("Failed to reject application");
      console.error("Reject application error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        text: "Pending",
        icon: ExclamationTriangleIcon,
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
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <IconComponent className="h-4 w-4 mr-1" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-600"></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || "Application not found"}
          </p>
          <button
            onClick={() => navigate("/admin/seller-applications")}
            className="text-saffron-600 hover:text-saffron-500"
          >
            Back to Applications
          </button>
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
            onClick={() => navigate("/admin/seller-applications")}
            className="flex items-center text-saffron-600 hover:text-saffron-500 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Applications
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {application.businessName}
              </h1>
              <p className="mt-1 text-gray-600">
                Application ID: {application.applicationId}
              </p>
            </div>
            <div>{getStatusBadge(application.status)}</div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        {application.status === "pending" && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Review Actions
            </h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowApproveModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Approve Application
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <XCircleIcon className="h-4 w-4 mr-2" />
                Reject Application
              </button>
            </div>
          </div>
        )}

        {/* Application Details */}
        <div className="space-y-6">
          {/* Applicant Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Applicant Information
              </h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {application.user?.firstName} {application.user?.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {application.user?.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {application.user?.phone}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Member Since
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(application.user?.createdAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                Business Information
              </h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Business Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {application.businessName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Business Type
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {application.businessType}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Category
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {application.businessCategory}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Established Year
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {application.establishedYear}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Business Description
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {application.businessDescription}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Business Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {application.businessEmail}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Business Phone
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {application.businessPhone}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Business Address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {application.businessAddress}, {application.city},{" "}
                    {application.state} - {application.pincode}
                  </dd>
                </div>
                {application.hasPhysicalStore && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Physical Store Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {application.storeAddress}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Legal Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <CreditCardIcon className="h-5 w-5 mr-2" />
                Legal Information
              </h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                {application.panNumber && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      PAN Number
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">
                      {application.panNumber}
                    </dd>
                  </div>
                )}
                {application.gstNumber && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      GST Number
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">
                      {application.gstNumber}
                    </dd>
                  </div>
                )}
                {application.expectedMonthlyRevenue && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Expected Monthly Revenue
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {application.expectedMonthlyRevenue}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <BanknotesIcon className="h-5 w-5 mr-2" />
                Bank Account Details
              </h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Account Holder Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {application.accountHolderName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Bank Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {application.bankName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Account Number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">
                    ****{application.bankAccountNumber.slice(-4)}
                  </dd>
                </div>
                {application.bankIFSC && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      IFSC Code
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">
                      {application.bankIFSC}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Application Timeline */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Application Timeline
              </h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Submitted At
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(application.submittedAt)}
                  </dd>
                </div>
                {application.reviewedAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Reviewed At
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(application.reviewedAt)}
                    </dd>
                  </div>
                )}
                {application.reviewer && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Reviewed By
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {application.reviewer.firstName}{" "}
                      {application.reviewer.lastName}
                    </dd>
                  </div>
                )}
                {application.reviewNotes && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Review Notes
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {application.reviewNotes}
                    </dd>
                  </div>
                )}
                {application.rejectionReason && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Rejection Reason
                    </dt>
                    <dd className="mt-1 text-sm text-red-600">
                      {application.rejectionReason}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Approve Modal */}
        {showApproveModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Approve Application
                  </h3>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Are you sure you want to approve this seller application?
                    The user will be granted seller privileges.
                  </p>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500"
                    rows="3"
                    placeholder="Add approval notes (optional)..."
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setShowApproveModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading ? "Approving..." : "Approve"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center">
                  <XCircleIcon className="h-6 w-6 text-red-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Reject Application
                  </h3>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Please provide a reason for rejecting this application.
                  </p>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 mb-3"
                    rows="3"
                    placeholder="Rejection reason (required)..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    required
                  />
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500"
                    rows="2"
                    placeholder="Additional notes (optional)..."
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading || !rejectionReason.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerApplicationDetail;
