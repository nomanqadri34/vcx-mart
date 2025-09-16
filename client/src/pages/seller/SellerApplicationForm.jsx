import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
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
    const [applicationId, setApplicationId] = useState(null)
    const [planType, setPlanType] = useState('early-bird')
    const [hasShownWelcomeToast, setHasShownWelcomeToast] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    // Get plan type from navigation state and handle subscription completion
    useEffect(() => {
        if (location.state?.planType) {
            setPlanType(location.state.planType)
        }
        
        // Handle return from subscription success
        if (location.state?.subscriptionCompleted && !hasShownWelcomeToast) {
            setSubscriptionSetup(true)
            setRegistrationPaid(true)
            setApplicationId('temp_' + Date.now())
            
            if (location.state?.step) {
                setCurrentStep(location.state.step)
            } else {
                setCurrentStep(3) // Default to business info step
            }
            
            toast.success('Welcome back! Continue filling your application.')
            setHasShownWelcomeToast(true)
        }
        
        // Check localStorage for completed payments
        const regPaid = localStorage.getItem('registrationPaymentCompleted')
        const subCompleted = localStorage.getItem('subscriptionCompleted')
        
        if (regPaid === 'true') {
            setRegistrationPaid(true)
        }
        
        if (subCompleted === 'true') {
            setSubscriptionSetup(true)
            if (!applicationId) {
                setApplicationId('temp_' + Date.now())
            }
        }
    }, [location.state, applicationId])

    // Get subscription amount based on plan type
    const getSubscriptionAmount = () => {
        return planType === 'early-bird' ? 500 : 800
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm()

    const steps = [
        { id: 1, name: 'Registration Fee', icon: CurrencyRupeeIcon },
        { id: 2, name: 'Monthly Subscription', icon: CheckCircleIcon },
        { id: 3, name: 'Business Info', icon: BuildingOfficeIcon },
        { id: 4, name: 'Documents', icon: DocumentTextIcon },
        { id: 5, name: 'Payment Details', icon: CreditCardIcon }
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

        if (currentStep < 5) {
            setCurrentStep(currentStep + 1)
        } else if (currentStep === 5) {
            // Final step: Submit application to database
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
                upiId: data.upiId,
                contactPerson: data.contactPerson,

                // Document Information (optional fields)
                panNumber: data.panNumber || undefined,

                // Terms
                agreeToTerms: Boolean(data.termsAccepted)
            }

            // Always try to create/update application - server will handle existing applications
            const response = await api.post('/seller/apply', applicationPayload)

            if (response.data.success) {
                toast.success('Application submitted successfully!')
                handleFinalSuccess(response.data.data?.applicationId)
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

            // Handle existing application error
            if (error.response?.status === 400 && error.response?.data?.error?.applicationId) {
                const existingAppId = error.response.data.error.applicationId
                const status = error.response.data.error.status
                errorMessage = `You already have a ${status} application (ID: ${existingAppId}). Please check your dashboard.`

                // If in development, offer to reset
                if (import.meta.env.DEV) {
                    setTimeout(() => {
                        if (confirm('Development Mode: Would you like to reset your existing application to create a new one?')) {
                            resetExistingApplication()
                        }
                    }, 2000)
                }
            }

            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleRegistrationSuccess = async () => {
        setRegistrationPaid(true)
        toast.success('Registration payment completed! Now creating your application...')
        
        // Skip application creation, just proceed to subscription
        setApplicationId('temp_' + Date.now())
        toast.success('Registration payment completed! Now set up your monthly subscription.')
        setCurrentStep(2)
    }

    const handleSubscriptionSuccess = () => {
        setSubscriptionSetup(true)
        toast.success('Subscription setup completed! Now fill your business information.')
        
        // Ensure user is still authenticated after payment redirect
        const token = localStorage.getItem('accessToken')
        if (!token) {
            toast.error('Session expired. Please login again.')
            navigate('/login')
            return
        }
        
        setCurrentStep(3)
    }

    const handleFinalSuccess = (applicationId) => {
        toast.success('Seller application completed successfully!')
        // Clear subscription completion flags
        localStorage.removeItem('subscriptionCompleted')
        localStorage.removeItem('registrationPaymentCompleted')
        
        navigate('/seller/application-submitted', {
            state: {
                applicationId: applicationId || 'N/A',
                planType
            }
        })
    }

    const resetExistingApplication = async () => {
        try {
            const response = await api.delete('/seller/dev/reset-application')
            if (response.data.success) {
                toast.success('Existing application deleted. You can now submit a new application.')
                window.location.reload()
            }
        } catch (error) {
            toast.error('Failed to reset application')
            console.error('Reset error:', error)
        }
    }



    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Registration Payment</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                            <p className="text-xs sm:text-sm text-blue-800">
                                <strong>Step 1 of 5:</strong> Pay ₹50 registration fee to start your seller journey.
                            </p>
                        </div>
                        <RegistrationPayment
                            onPaymentSuccess={handleRegistrationSuccess}
                        />
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Monthly Subscription Setup</h3>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                            <p className="text-xs sm:text-sm text-green-800">
                                <strong>Step 2 of 5:</strong> Setup your ₹{getSubscriptionAmount()}/month subscription for platform access.
                            </p>
                            <p className="text-xs text-green-700 mt-1">
                                Plan: {planType === 'early-bird' ? 'Early Bird (₹500/month)' : 'Regular (₹800/month)'}
                            </p>
                        </div>
                        <SubscriptionPayment
                            applicationId={applicationId}
                            onPaymentSuccess={handleSubscriptionSuccess}
                            planType={planType}
                            amount={getSubscriptionAmount()}
                        />
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Business Information</h3>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                            <p className="text-xs sm:text-sm text-yellow-800">
                                <strong>Step 3 of 5:</strong> Payments completed! Now fill your business information.
                            </p>
                        </div>

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



            case 4:
                return (
                    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Document Information</h3>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                            <p className="text-xs sm:text-sm text-purple-800">
                                <strong>Step 4 of 5:</strong> Provide your document details for verification.
                            </p>
                        </div>

                        <div className="bg-blue-50 p-3 sm:p-4 rounded-md">
                            <p className="text-xs sm:text-sm text-blue-700">
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

            case 5:
                return (
                    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Payment Details & Submit</h3>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                            <p className="text-xs sm:text-sm text-green-800">
                                <strong>Final Step:</strong> Complete your payment details and submit your seller application.
                            </p>
                        </div>

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

            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50 py-4 sm:py-8">
            <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">Become a VCX MART Seller</h1>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 sm:mt-2">Pay registration → Setup subscription → Fill application</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                    <div className="flex items-center justify-between overflow-x-auto pb-2">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center min-w-0 flex-shrink-0">
                                <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full border-2 ${currentStep >= step.id
                                    ? 'bg-saffron-600 border-saffron-600 text-white'
                                    : 'border-gray-300 text-gray-500'
                                    }`}>
                                    <step.icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                </div>
                                <span className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium ${currentStep >= step.id ? 'text-saffron-600' : 'text-gray-500'
                                    } hidden sm:block`}>
                                    {step.name}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className={`w-4 sm:w-8 lg:w-16 h-0.5 mx-1 sm:mx-2 lg:mx-4 ${currentStep > step.id ? 'bg-saffron-600' : 'bg-gray-300'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Mobile step name */}
                    <div className="text-center mt-2 sm:hidden">
                        <span className="text-xs font-medium text-saffron-600">
                            Step {currentStep}: {steps.find(s => s.id === currentStep)?.name}
                        </span>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white shadow-lg rounded-lg p-3 sm:p-4 lg:p-6">
                    {currentStep <= 2 ? (
                        <div>
                            {renderStepContent()}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onStepSubmit)}>
                            {renderStepContent()}

                            {/* Navigation Buttons */}
                            <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 lg:mt-8 pt-3 sm:pt-4 lg:pt-6 border-t border-gray-200 gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                                    disabled={currentStep === 1}
                                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
                                >
                                    Previous
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-3 sm:px-4 lg:px-6 py-2 text-xs sm:text-sm font-medium text-white bg-saffron-600 rounded-md hover:bg-saffron-700 disabled:opacity-50 transition-colors"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
                                            <span className="text-xs sm:text-sm">{currentStep === 5 ? 'Submitting...' : 'Next'}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs sm:text-sm">{currentStep === 5 ? 'Submit Application' : 'Next'}</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SellerApplicationForm