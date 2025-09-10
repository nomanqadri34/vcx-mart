import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const BecomeSeller = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    trigger,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      // Business Information
      businessName: "",
      businessType: "",
      businessCategory: "",
      businessDescription: "",
      establishedYear: "",
      
      // Contact Information
      businessEmail: "",
      businessPhone: "",
      businessAddress: "",
      city: "",
      state: "",
      pincode: "",
      
      // Legal Information
      gstNumber: "",
      panNumber: "",
      bankAccountNumber: "",
      bankIFSC: "",
      bankName: "",
      accountHolderName: "",
      
      // Additional Information
      expectedMonthlyRevenue: "",
      productCategories: [],
      hasPhysicalStore: false,
      storeAddress: "",
      agreeToTerms: false,
    },
  });

  const businessTypes = [
    "Individual/Proprietorship",
    "Partnership",
    "Private Limited Company",
    "Public Limited Company",
    "LLP",
    "Others"
  ];

  const businessCategories = [
    "Electronics & Gadgets",
    "Fashion & Apparel",
    "Home & Kitchen",
    "Books & Stationery",
    "Sports & Fitness",
    "Beauty & Personal Care",
    "Automotive",
    "Others"
  ];

  const revenueRanges = [
    "Less than ₹1 Lakh",
    "₹1-5 Lakhs",
    "₹5-10 Lakhs",
    "₹10-25 Lakhs",
    "₹25-50 Lakhs",
    "More than ₹50 Lakhs"
  ];

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 1:
        return ["businessName", "businessType", "businessCategory", "businessDescription", "establishedYear"];
      case 2:
        return ["businessEmail", "businessPhone", "businessAddress", "city", "state", "pincode"];
      case 3:
        return ["gstNumber", "panNumber", "bankAccountNumber", "bankIFSC", "bankName", "accountHolderName"];
      default:
        return [];
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/v1/seller/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          ...data,
          userId: user._id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        navigate("/user/dashboard", {
          state: {
            message: "Seller application submitted successfully! We'll review your application within 2-3 business days.",
          },
        });
      } else {
        setError(result.error?.message || "Application submission failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Seller application error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Name *
          </label>
          <input
            type="text"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.businessName ? "border-red-300" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
            {...register("businessName", {
              required: "Business name is required",
              minLength: { value: 2, message: "Business name must be at least 2 characters" },
            })}
          />
          {errors.businessName && (
            <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Type *
          </label>
          <select
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.businessType ? "border-red-300" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
            {...register("businessType", { required: "Business type is required" })}
          >
            <option value="">Select business type</option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.businessType && (
            <p className="mt-1 text-sm text-red-600">{errors.businessType.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Category *
          </label>
          <select
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.businessCategory ? "border-red-300" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
            {...register("businessCategory", { required: "Business category is required" })}
          >
            <option value="">Select category</option>
            {businessCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.businessCategory && (
            <p className="mt-1 text-sm text-red-600">{errors.businessCategory.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Established Year *
          </label>
          <input
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.establishedYear ? "border-red-300" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
            {...register("establishedYear", {
              required: "Established year is required",
              min: { value: 1900, message: "Invalid year" },
              max: { value: new Date().getFullYear(), message: "Year cannot be in future" },
            })}
          />
          {errors.establishedYear && (
            <p className="mt-1 text-sm text-red-600">{errors.establishedYear.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Business Description *
        </label>
        <textarea
          rows={4}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.businessDescription ? "border-red-300" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
          placeholder="Describe your business, products, and services..."
          {...register("businessDescription", {
            required: "Business description is required",
            minLength: { value: 50, message: "Description must be at least 50 characters" },
          })}
        />
        {errors.businessDescription && (
          <p className="mt-1 text-sm text-red-600">{errors.businessDescription.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Email *
          </label>
          <input
            type="email"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.businessEmail ? "border-red-300" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
            {...register("businessEmail", {
              required: "Business email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.businessEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.businessEmail.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Phone *
          </label>
          <input
            type="tel"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.businessPhone ? "border-red-300" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
            {...register("businessPhone", {
              required: "Business phone is required",
              pattern: {
                value: /^[+]?[\d\s\-\(\)]+$/,
                message: "Invalid phone number",
              },
            })}
          />
          {errors.businessPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.businessPhone.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Business Address *
        </label>
        <textarea
          rows={3}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.businessAddress ? "border-red-300" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
          {...register("businessAddress", { required: "Business address is required" })}
        />
        {errors.businessAddress && (
          <p className="mt-1 text-sm text-red-600">{errors.businessAddress.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City *
          </label>
          <input
            type="text"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.city ? "border-red-300" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
            {...register("city", { required: "City is required" })}
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            State *
          </label>
          <input
            type="text"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.state ? "border-red-300" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
            {...register("state", { required: "State is required" })}
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pincode *
          </label>
          <input
            type="text"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.pincode ? "border-red-300" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
            {...register("pincode", {
              required: "Pincode is required",
              pattern: {
                value: /^\d{6}$/,
                message: "Invalid pincode",
              },
            })}
          />
          {errors.pincode && (
            <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="hasPhysicalStore"
            type="checkbox"
            className="h-4 w-4 text-saffron-600 focus:ring-saffron-500 border-gray-300 rounded"
            {...register("hasPhysicalStore")}
          />
          <label htmlFor="hasPhysicalStore" className="ml-2 block text-sm text-gray-900">
            I have a physical store
          </label>
        </div>

        {watch("hasPhysicalStore") && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Store Address
            </label>
            <textarea
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500"
              {...register("storeAddress")}
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Legal & Financial Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            GST Number
          </label>
          <input
            type="text"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.gstNumber ? "border-red-300" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
            placeholder="22AAAAA0000A1Z5"
            {...register("gstNumber", {
              pattern: {
                value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                message: "Invalid GST number format",
              },
            })}
          />
          {errors.gstNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.gstNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            PAN Number *
          </label>
          <input
            type="text"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.panNumber ? "border-red-300" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
            placeholder="ABCDE1234F"
            {...register("panNumber", {
              required: "PAN number is required",
              pattern: {
                value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                message: "Invalid PAN number format",
              },
            })}
          />
          {errors.panNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.panNumber.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Bank Account Details</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Holder Name *
            </label>
            <input
              type="text"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.accountHolderName ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
              {...register("accountHolderName", { required: "Account holder name is required" })}
            />
            {errors.accountHolderName && (
              <p className="mt-1 text-sm text-red-600">{errors.accountHolderName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bank Name *
            </label>
            <input
              type="text"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.bankName ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
              {...register("bankName", { required: "Bank name is required" })}
            />
            {errors.bankName && (
              <p className="mt-1 text-sm text-red-600">{errors.bankName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Number *
            </label>
            <input
              type="text"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.bankAccountNumber ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
              {...register("bankAccountNumber", {
                required: "Account number is required",
                minLength: { value: 9, message: "Account number must be at least 9 digits" },
              })}
            />
            {errors.bankAccountNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.bankAccountNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              IFSC Code *
            </label>
            <input
              type="text"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.bankIFSC ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500`}
              placeholder="SBIN0001234"
              {...register("bankIFSC", {
                required: "IFSC code is required",
                pattern: {
                  value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                  message: "Invalid IFSC code format",
                },
              })}
            />
            {errors.bankIFSC && (
              <p className="mt-1 text-sm text-red-600">{errors.bankIFSC.message}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Expected Monthly Revenue
        </label>
        <select
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500"
          {...register("expectedMonthlyRevenue")}
        >
          <option value="">Select revenue range</option>
          {revenueRanges.map((range) => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="agreeToTerms"
            type="checkbox"
            className="h-4 w-4 text-saffron-600 focus:ring-saffron-500 border-gray-300 rounded"
            {...register("agreeToTerms", { required: "You must agree to the terms" })}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="agreeToTerms" className="text-gray-700">
            I agree to the{" "}
            <a href="/seller-terms" className="text-saffron-600 hover:text-saffron-500">
              Seller Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="/seller-policy" className="text-saffron-600 hover:text-saffron-500">
              Seller Policy
            </a>
          </label>
          {errors.agreeToTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Become a Seller</h1>
            <p className="mt-1 text-sm text-gray-600">
              Join our marketplace and start selling your products
            </p>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step <= currentStep
                        ? "bg-saffron-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        step < currentStep ? "bg-saffron-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Business Info</span>
              <span>Contact Details</span>
              <span>Legal & Financial</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${
                  currentStep === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 bg-saffron-600 text-white rounded-md text-sm font-medium hover:bg-saffron-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !isValid}
                  className={`px-6 py-2 rounded-md text-sm font-medium ${
                    isLoading || !isValid
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-saffron-600 text-white hover:bg-saffron-700"
                  }`}
                >
                  {isLoading ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller;