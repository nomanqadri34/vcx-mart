import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";

import api from "../../services/api";
import DocumentUpload from "../../components/DocumentUpload";
import SubscriptionPayment from "../../components/SubscriptionPayment";
import RegistrationPayment from "../../components/RegistrationPayment";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { useAuth } from "../../contexts/AuthContext";
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const SellerApplication = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState({});
  const [applicationId, setApplicationId] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading } = useAuth();
  const paymentCompleted = location.state?.paymentCompleted || false;

  // Check authentication, seller status, and payment completion
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please login to access seller application");
      navigate("/login");
    } else if (user?.role === "seller") {
      toast.info("You are already a seller");
      navigate("/seller/dashboard");
    } else if (!paymentCompleted) {
      toast.error("Please complete payment setup first");
      navigate("/seller/apply");
    }
  }, [loading, isAuthenticated, user, navigate, paymentCompleted]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const businessTypes = [
    { value: "Individual/Proprietorship", label: "Individual/Proprietorship" },
    { value: "Partnership", label: "Partnership" },
    { value: "Private Limited Company", label: "Private Limited Company" },
    { value: "Public Limited Company", label: "Public Limited Company" },
    { value: "LLP", label: "Limited Liability Partnership" },
    { value: "Others", label: "Others" },
  ];

  const categories = [
    "Electronics & Gadgets",
    "Fashion & Apparel",
    "Home & Kitchen",
    "Books & Stationery",
    "Sports & Fitness",
    "Beauty & Personal Care",
    "Automotive",
    "Others",
  ];

  const validateFile = (file) => {
    if (!file) return true;
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and PDF files are allowed");
      return false;
    }

    return true;
  };

  const handleDocumentUpload = async (docType, file) => {
    if (!file) {
      setDocuments(prev => ({ ...prev, [docType]: null }));
      return;
    }

    try {
      const result = await uploadToCloudinary(file, 'seller-documents');
      setDocuments(prev => ({
        ...prev,
        [docType]: {
          url: result.url,
          cloudinaryId: result.publicId,
          originalName: file.name
        }
      }));
      toast.success(`${docType.replace('_', ' ')} uploaded successfully`);
    } catch (error) {
      toast.error(`Failed to upload ${docType.replace('_', ' ')}`);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Collect selected categories
      const selectedCategories = categories.filter((cat) => data[cat]);

      if (selectedCategories.length === 0) {
        toast.error("Please select at least one product category");
        setIsSubmitting(false);
        return;
      }

      // Prepare documents array
      const documentsArray = Object.entries(documents)
        .filter(([_, doc]) => doc !== null)
        .map(([type, doc]) => ({
          type: type,
          url: doc.url,
          cloudinaryId: doc.cloudinaryId,
          originalName: doc.originalName,
        }));

      // Map client fields to server expected fields
      const applicationData = {
        // Business Information
        businessName: data.businessName,
        businessType: data.businessType,
        businessCategory: selectedCategories[0],
        businessDescription: data.businessDescription,
        establishedYear: parseInt(data.establishedYear),

        // Contact Information
        businessEmail: data.businessEmail,
        businessPhone: data.businessPhone,
        businessAddress: data.businessAddress,
        city: data.city,
        state: data.state,
        pincode: data.pincode,

        // Legal Information
        panNumber: data.panNumber ? data.panNumber.toUpperCase() : undefined,
        gstNumber: data.gstNumber ? data.gstNumber.toUpperCase() : undefined,

        // Bank Details
        bankAccountNumber: data.accountNumber,
        bankIFSC: data.ifscCode ? data.ifscCode.toUpperCase() : undefined,
        bankName: data.bankName,
        accountHolderName: data.accountHolderName,

        // Additional Information
        productCategories: selectedCategories,
        documents: documentsArray,

        // Terms
        agreeToTerms: data.termsAccepted,
      };

      const response = await api.post("/seller/apply", applicationData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data?.data?.applicationId) {
        setApplicationId(response.data.data.applicationId);
        setShowRegistration(true);
        toast.success(
          "Application submitted successfully! Please complete the registration payment."
        );
      } else {
        toast.success(
          "Application submitted successfully! We will review it within 2-3 business days."
        );
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error("Application submission error:", error);
      let errorMessage = "Failed to submit application. Please try again.";

      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.response?.data?.error?.details) {
        const validationErrors = error.response.data.error.details;
        errorMessage = `Validation failed: ${validationErrors
          .map((err) => err.msg)
          .join(", ")}`;
      } else if (error.response?.status === 401) {
        errorMessage = "Please log in to submit an application";
        navigate("/login");
      } else if (error.response?.status === 403) {
        errorMessage = "Access denied. Please ensure you are logged in with proper permissions.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid application data. Please check all fields.";
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Become a Seller</h1>
          <p className="text-gray-600 mt-2">
            Fill out the form below to apply as a seller on our platform
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Registration Fee Card */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Registration Fee</h3>
              <div className="mb-4">
                <p className="text-4xl font-bold">₹50</p>
                <p className="text-sm opacity-90">One-time payment</p>
              </div>
              <div className="text-sm">
                <p className="opacity-90">• Account activation</p>
                <p className="opacity-90">• Platform access</p>
                <p className="opacity-90">• Seller verification</p>
              </div>
            </div>
          </div>

          {/* Monthly Platform Fee Card */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Monthly Platform Fee</h3>
              <div className="mb-4">
                <p className="text-4xl font-bold">
                  {new Date() <= new Date('2025-10-01') ? '₹500' : '₹800'}
                </p>
                <p className="text-sm opacity-90">
                  {new Date() <= new Date('2025-10-01')
                    ? 'Early Bird (Before Oct 1st)'
                    : 'Regular (From Oct 1st)'
                  }
                </p>
              </div>
              <div className="text-sm">
                <p className="opacity-90">• 0% commission on sales</p>
                <p className="opacity-90">• Direct payments to you</p>
                <p className="opacity-90">• Full seller dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Show registration payment first */}
        {showRegistration && applicationId ? (
          <RegistrationPayment
            applicationId={applicationId}
            onPaymentSuccess={() => {
              setShowRegistration(false);
              setShowSubscription(true);
            }}
          />
        ) : showSubscription && applicationId ? (
          <SubscriptionPayment
            applicationId={applicationId}
            onPaymentSuccess={() => {
              toast.success('Setup completed! Your seller account will be activated shortly.');
              navigate('/user/dashboard');
            }}
          />
        ) : (
          /* Form */
          <div className="bg-white shadow-lg rounded-lg p-6">
            <form
              id="seller-application-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* Business Information Section */}
              <div>
                <div className="flex items-center mb-4">
                  <BuildingOfficeIcon className="h-6 w-6 text-saffron-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Business Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name *
                    </label>
                    <input
                      {...register("businessName", {
                        required: "Business name is required",
                      })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Enter your business name"
                    />
                    {errors.businessName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.businessName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Type *
                    </label>
                    <select
                      {...register("businessType", {
                        required: "Business type is required",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                    >
                      <option value="">Select business type</option>
                      {businessTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.businessType && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.businessType.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Email *
                    </label>
                    <input
                      {...register("businessEmail", {
                        required: "Business email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email format"
                        }
                      })}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Enter business email"
                    />
                    {errors.businessEmail && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.businessEmail.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Phone *
                    </label>
                    <input
                      {...register("businessPhone", {
                        required: "Business phone is required",
                      })}
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Enter business phone number"
                    />
                    {errors.businessPhone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.businessPhone.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Description *
                    </label>
                    <textarea
                      {...register("businessDescription", {
                        required: "Business description is required",
                        minLength: {
                          value: 50,
                          message: "Description must be at least 50 characters"
                        }
                      })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Describe your business..."
                    />
                    {errors.businessDescription && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.businessDescription.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Established Year *
                    </label>
                    <input
                      {...register("establishedYear", {
                        required: "Established year is required",
                        min: {
                          value: 1900,
                          message: "Year must be after 1900"
                        },
                        max: {
                          value: new Date().getFullYear(),
                          message: "Year cannot be in the future"
                        }
                      })}
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="e.g., 2020"
                    />
                    {errors.establishedYear && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.establishedYear.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-saffron-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Address Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Address *
                    </label>
                    <textarea
                      {...register("businessAddress", {
                        required: "Business address is required",
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Enter complete business address"
                    />
                    {errors.businessAddress && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.businessAddress.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      {...register("city", {
                        required: "City is required",
                      })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      {...register("state", {
                        required: "State is required",
                      })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      {...register("pincode", {
                        required: "Pincode is required",
                        pattern: {
                          value: /^\d{6}$/,
                          message: "Pincode must be 6 digits"
                        }
                      })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Enter 6-digit pincode"
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.pincode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Legal Information */}
              <div>
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-saffron-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Legal Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PAN Number
                    </label>
                    <input
                      {...register("panNumber", {
                        pattern: {
                          value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                          message: "Invalid PAN format (e.g., ABCDE1234F)"
                        }
                      })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Enter PAN number"
                      style={{ textTransform: 'uppercase' }}
                    />
                    {errors.panNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.panNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GST Number (Optional)
                    </label>
                    <input
                      {...register("gstNumber", {
                        pattern: {
                          value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                          message: "Invalid GST format"
                        }
                      })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Enter GST number (if applicable)"
                      style={{ textTransform: 'uppercase' }}
                    />
                    {errors.gstNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.gstNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <div className="flex items-center mb-4">
                  <CreditCardIcon className="h-6 w-6 text-saffron-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Bank Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name *
                    </label>
                    <input
                      {...register("bankName", {
                        required: "Bank name is required",
                      })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Enter bank name"
                    />
                    {errors.bankName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.bankName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Holder Name *
                    </label>
                    <input
                      {...register("accountHolderName", {
                        required: "Account holder name is required",
                      })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Enter account holder name"
                    />
                    {errors.accountHolderName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.accountHolderName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number *
                    </label>
                    <input
                      {...register("accountNumber", {
                        required: "Account number is required",
                        minLength: {
                          value: 9,
                          message: "Account number must be at least 9 digits"
                        }
                      })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Enter account number"
                    />
                    {errors.accountNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.accountNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IFSC Code
                    </label>
                    <input
                      {...register("ifscCode", {
                        pattern: {
                          value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                          message: "Invalid IFSC format"
                        }
                      })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                      placeholder="Enter IFSC code"
                      style={{ textTransform: 'uppercase' }}
                    />
                    {errors.ifscCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.ifscCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Categories */}
              <div>
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-saffron-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Product Categories
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        {...register(category)}
                        type="checkbox"
                        className="rounded border-gray-300 text-saffron-600 focus:ring-saffron-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Document Upload Section */}
              <div>
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-saffron-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Document Upload
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DocumentUpload
                    label="PAN Card"
                    name="pan_card"
                    required
                    onFileSelect={(file) => handleDocumentUpload('pan_card', file)}
                  />

                  <DocumentUpload
                    label="Aadhaar Card"
                    name="aadhaar_card"
                    onFileSelect={(file) => handleDocumentUpload('aadhaar_card', file)}
                  />

                  <DocumentUpload
                    label="GST Certificate"
                    name="gst_certificate"
                    onFileSelect={(file) => handleDocumentUpload('gst_certificate', file)}
                  />

                  <DocumentUpload
                    label="Business Certificate"
                    name="business_certificate"
                    onFileSelect={(file) => handleDocumentUpload('business_certificate', file)}
                  />

                  <DocumentUpload
                    label="Bank Statement"
                    name="bank_statement"
                    required
                    onFileSelect={(file) => handleDocumentUpload('bank_statement', file)}
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    {...register("termsAccepted", {
                      required: "You must accept the terms and conditions",
                    })}
                    type="checkbox"
                    className="rounded border-gray-300 text-saffron-600 focus:ring-saffron-500"
                  />
                  <label className="text-sm text-gray-700">
                    I agree to the{" "}
                    <a href="/terms" className="text-saffron-600 hover:text-saffron-700">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-saffron-600 hover:text-saffron-700">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.termsAccepted && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.termsAccepted.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-saffron-600 to-green-600 text-white px-8 py-3 rounded-lg font-medium hover:from-saffron-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerApplication;
