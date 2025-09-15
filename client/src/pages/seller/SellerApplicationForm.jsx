import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import RegistrationPayment from '../../components/RegistrationPayment'
import SubscriptionPayment from '../../components/SubscriptionPayment'
import {
    BuildingOfficeIcon,
    DocumentTextIcon,
    CreditCardIcon,
    CheckCircleIcon,
    CurrencyRupeeIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const SellerApplicationForm = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const [applicationData, setApplicationData] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [registrationPaid, setRegistrationPaid] = useState(false)
    const [subscriptionSetup, setSubscriptionSetup] = useState(false)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm()

    const steps = [
        { id: 1, name: 'Business Info', icon: BuildingOfficeIcon },
        { id: 2, name: 'Documents', icon: DocumentTextIcon },
        { id: 3, name: 'Payment Details', icon: CreditCardIcon },
        { id: 4, name: 'Registration Fee', icon: CurrencyRupeeIcon },
        { id: 5, name: 'Monthly Subscription', icon: CheckCircleIcon }
    ]

    const businessTypes = [
        { value: 'individual', label: 'Individual Seller' },
        { value: 'proprietorship', label: 'Sole Proprietorship' },
        { value: 'partnership', label: 'Partnership' },
        { value: 'private_limited', label: 'Private Limited Company' }
    ]

    const onStepSubmit = (data) => {
        const updatedData = { ...applicationData, ...data }
        setApplicationData(updatedData)

        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
        } else if (currentStep === 3) {
            // Submit application first, then proceed to payments
            submitApplication(updatedData)
        }
    }

    const submitApplication = async (data) => {
        try {
            setIsSubmitting(true)

            // Map client form values to server expected values
            const businessTypeMap = {
                'individual': 'Individual/Proprietorship',
                'proprietorship': 'Individual/Proprietorship',
                'partnership': 'Partnership',
                'private_limited': 'Private Limited Company'
            }

            const applicationPayload = {
                // Business Information
                businessName: data.businessName,
                businessType: businessTypeMap[data.businessType] || 'Individual/Proprietorship',
                businessCategory: 'Others', // Use 'Others' as it's accepted by server
                businessDescription: `Business Name: ${data.businessName}. Business Type: ${data.businessType}. Contact Person: ${data.contactPerson}. Phone: ${data.phone}. Address: ${data.businessAddress}. We are committed to providing quality products and excellent customer service to our customers.`,
                establishedYear: new Date().getFullYear(),

                // Contact Information  
                businessEmail: `${data.contactPerson?.toLowerCase().replace(/\s+/g, '') || 'contact'}@${data.businessName?.toLowerCase().replace(/\s+/g, '') || 'business'}.com`,
                businessPhone: data.phone,
                businessAddress: data.businessAddress,
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001',

                // Bank Details
                bankAccountNumber: data.accountNumber,
                bankIFSC: data.ifscCode?.toUpperCase() || '', // Make IFSC uppercase and optional
                bankName: data.bankName,
                accountHolderName: data.contactPerson,

                // Document Information (optional fields)
                panNumber: data.panNumber || undefined,

                // Terms
                agreeToTerms: Boolean(data.termsAccepted)
            }

            const response = await api.post('/seller/apply', applicationPayload)

            if (response.data.success) {
                const appId = response.data.data.applicationId
                setApplicationId(appId)
                toast.success('Application submitted successfully! Now proceed with registration payment.')
                setCurrentStep(4)
            } else {
                toast.error('Failed to submit application')
            }
        } catch (error) {
            console.error('Application error:', error)

            let errorMessage = 'Failed to submit application'
            if (error.response?.data?.error?.message) {
                errorMessage = error.response.data.error.message
            }

            // Show validation errors if available
            if (error.response?.data?.error?.details) {
                const validationErrors = error.response.data.error.details
                const errorMessages = validationErrors.map(err => err.msg).join(', ')
                errorMessage = `Validation Error: ${errorMessages}`
            }

            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleRegistrationSuccess = () => {
        setRegistrationPaid(true)
        toast.success('Registration payment completed! Now set up your monthly subscription.')
        setCurrentStep(5)
    }

    const handleSubscriptionSuccess = () => {
        setSubscriptionSetup(true)
        toast.success('All payments completed! Your seller account is being set up.')
        navigate('/user/dashboard', {
            state: {
                message: 'Congratulations! Your seller application and payments are complete. We will review your application within 2-3 business days.'
            }
        })
    }



    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4 sm:space-y-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Business Information</h3>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Business Name *
                            </label>
                            <input
                                {...register('businessName', { required: 'Business name is required' })}
                                type="text"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                placeholder="Enter your business name"
                            />
                            {errors.businessName && (
                                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.businessName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Business Type *
                            </label>
                            <select
                                {...register('businessType', { required: 'Business type is required' })}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                            >
                                <option value="">Select business type</option>
                                {businessTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            {errors.businessType && (
                                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.businessType.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Contact Person *
                                </label>
                                <input
                                    {...register('contactPerson', { required: 'Contact person is required' })}
                                    type="text"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                    placeholder="Full name"
                                />
                                {errors.contactPerson && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.contactPerson.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Phone Number *
                                </label>
                                <input
                                    {...register('phone', { required: 'Phone number is required' })}
                                    type="tel"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                    placeholder="10-digit phone number"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.phone.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Business Address *
                            </label>
                            <textarea
                                {...register('businessAddress', { required: 'Business address is required' })}
                                rows={3}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500 resize-none"
                                placeholder="Complete business address"
                            />
                            {errors.businessAddress && (
                                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.businessAddress.message}</p>
                            )}
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-4 sm:space-y-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Document Information</h3>

                        <div className="bg-blue-50 p-4 rounded-md">
                            <p className="text-sm text-blue-700">
                                Document upload will be available after application approval. For now, please provide document details.
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                PAN Number
                            </label>
                            <input
                                {...register('panNumber')}
                                type="text"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                placeholder="Enter PAN number (optional)"
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Aadhaar Number
                            </label>
                            <input
                                {...register('aadhaarNumber')}
                                type="text"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                placeholder="Enter Aadhaar number (optional)"
                            />
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-4 sm:space-y-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Payment Details</h3>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                UPI ID *
                            </label>
                            <input
                                {...register('upiId', { required: 'UPI ID is required' })}
                                type="text"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                placeholder="yourname@paytm / yourname@phonepe"
                            />
                            {errors.upiId && (
                                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.upiId.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Bank Name *
                                </label>
                                <input
                                    {...register('bankName', { required: 'Bank name is required' })}
                                    type="text"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                    placeholder="Enter bank name"
                                />
                                {errors.bankName && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.bankName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Account Number *
                                </label>
                                <input
                                    {...register('accountNumber', { required: 'Account number is required' })}
                                    type="text"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                    placeholder="Bank account number"
                                />
                                {errors.accountNumber && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.accountNumber.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                IFSC Code (Optional)
                            </label>
                            <input
                                {...register('ifscCode', {
                                    pattern: {
                                        value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                                        message: 'IFSC code must be 11 characters (e.g., SBIN0001234)'
                                    }
                                })}
                                type="text"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                placeholder="SBIN0001234 (Optional)"
                                style={{ textTransform: 'uppercase' }}
                            />
                            {errors.ifscCode && (
                                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.ifscCode.message}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">Format: 4 letters + 0 + 6 characters (e.g., SBIN0001234)</p>
                        </div>

                        <div className="flex items-center">
                            <input
                                {...register('termsAccepted', { required: 'You must accept the terms' })}
                                type="checkbox"
                                className="rounded border-gray-300 text-saffron-600 focus:ring-saffron-500"
                            />
                            <label className="ml-2 text-xs sm:text-sm text-gray-700">
                                I agree to the Terms and Conditions and Seller Policy
                            </label>
                        </div>
                        {errors.termsAccepted && (
                            <p className="text-xs sm:text-sm text-red-600">{errors.termsAccepted.message}</p>
                        )}
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-4 sm:space-y-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Registration Payment</h3>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-green-800">
                                <strong>Step 2 of 3:</strong> Your application has been submitted. Now complete the registration payment.
                            </p>
                        </div>
                        <RegistrationPayment
                            applicationId={applicationId}
                            onPaymentSuccess={handleRegistrationSuccess}
                        />
                    </div>
                )

            case 5:
                return (
                    <div className="space-y-4 sm:space-y-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Monthly Subscription Setup</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-blue-800">
                                <strong>Final Step:</strong> Complete your subscription setup to activate your seller account.
                            </p>
                        </div>
                        {isSubmitting ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-600 mx-auto mb-4"></div>
                                <p className="text-sm text-gray-600">Submitting your application...</p>
                            </div>
                        ) : (
                            <SubscriptionPayment
                                onPaymentSuccess={handleSubscriptionSuccess}
                            />
                        )}
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50 py-4 sm:py-8">
            <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Become a VCX MART Seller</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-2">Fill application → Pay registration → Setup subscription</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-between overflow-x-auto">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center min-w-0">
                                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${currentStep >= step.id
                                    ? 'bg-saffron-600 border-saffron-600 text-white'
                                    : 'border-gray-300 text-gray-500'
                                    }`}>
                                    <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <span className={`ml-2 text-xs sm:text-sm font-medium ${currentStep >= step.id ? 'text-saffron-600' : 'text-gray-500'
                                    }`}>
                                    {step.name}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${currentStep > step.id ? 'bg-saffron-600' : 'bg-gray-300'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
                    {currentStep <= 3 ? (
                        <form onSubmit={handleSubmit(onStepSubmit)}>
                            {renderStepContent()}

                            {/* Navigation Buttons */}
                            <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 gap-3 sm:gap-0">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                                    disabled={currentStep === 1}
                                    className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
                                >
                                    Previous
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium text-white bg-saffron-600 rounded-md hover:bg-saffron-700 transition-colors"
                                >
                                    {currentStep === 3 ? 'Proceed to Payment' : 'Next'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            {renderStepContent()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SellerApplicationForm