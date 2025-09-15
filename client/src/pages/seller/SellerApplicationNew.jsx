import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import {
    BuildingOfficeIcon,
    DocumentTextIcon,
    CreditCardIcon,
    CheckCircleIcon,
    CurrencyRupeeIcon,
    UserIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const SellerApplicationNew = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const [applicationData, setApplicationData] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [paymentOrder, setPaymentOrder] = useState(null)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const steps = [
        { id: 1, name: 'Business Info', icon: BuildingOfficeIcon },
        { id: 2, name: 'Documents', icon: DocumentTextIcon },
        { id: 3, name: 'Payment Details', icon: CreditCardIcon },
        { id: 4, name: 'Registration Fee', icon: CurrencyRupeeIcon },
        { id: 5, name: 'Review & Submit', icon: CheckCircleIcon }
    ]

    const businessTypes = [
        { value: 'individual', label: 'Individual Seller' },
        { value: 'proprietorship', label: 'Sole Proprietorship' },
        { value: 'partnership', label: 'Partnership' },
        { value: 'private_limited', label: 'Private Limited Company' }
    ]

    const categories = [
        'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Beauty',
        'Automotive', 'Health', 'Toys', 'Jewelry', 'Food & Beverages'
    ]

    // Load Razorpay script and check for payment completion
    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)

        // Check URL parameters for payment success
        const urlParams = new URLSearchParams(window.location.search)
        const step = urlParams.get('step')
        const paymentStatus = urlParams.get('payment')

        // Check localStorage for payment completion
        const paymentCompleted = localStorage.getItem('sellerPaymentCompleted') || localStorage.getItem('registrationPaymentCompleted')
        const paymentId = localStorage.getItem('sellerPaymentId') || localStorage.getItem('registrationPaymentId')

        if (paymentCompleted === 'true' && paymentId) {
            setApplicationData(prev => ({ ...prev, paymentCompleted: true, paymentId }))
            if (step === '2' && paymentStatus === 'success') {
                setCurrentStep(2)
                toast.success('Payment completed! Please complete your application.')
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname)
            }
        }

        return () => document.body.removeChild(script)
    }, [])

    const createPaymentOrder = async (affiliateCode = '') => {
        try {
            setIsSubmitting(true)
            const response = await api.post('/payment/seller-registration', { affiliateCode })
            setPaymentOrder(response.data.data)
            return response.data.data
        } catch (error) {
            console.error('Payment order error:', error)
            toast.error('Failed to create payment order')
            return null
        } finally {
            setIsSubmitting(false)
        }
    }

    const handlePayment = async (affiliateCode = '') => {
        const subscription = await createPaymentOrder(affiliateCode)
        if (!subscription) return

        console.log('Opening subscription payment:', subscription)

        // Store affiliate code and subscription details in application data
        setApplicationData(prev => ({
            ...prev,
            affiliateCode,
            subscriptionId: subscription.subscriptionId,
            paymentLinkId: subscription.paymentLinkId
        }))

        // Open Razorpay payment page
        if (subscription.shortUrl) {
            // Store subscription details in localStorage for payment success page
            localStorage.setItem('sellerSubscriptionId', subscription.subscriptionId)
            localStorage.setItem('sellerPaymentLinkId', subscription.paymentLinkId || '')

            // Open payment in same tab for better UX
            window.location.href = subscription.shortUrl
        } else {
            toast.error('Failed to create payment link. Please try again.')
        }
    }

    const onStepSubmit = (data) => {
        const updatedData = { ...applicationData, ...data }
        setApplicationData(updatedData)

        if (currentStep < 5) {
            setCurrentStep(currentStep + 1)
        } else {
            submitApplication(updatedData)
        }
    }

    const submitApplication = async (data) => {
        try {
            setIsSubmitting(true)

            // Prepare complete application data
            const applicationData = {
                // Business Information
                businessName: data.businessName,
                businessType: data.businessType,
                businessCategory: 'Electronics & Gadgets', // Default category
                businessDescription: `Business application for ${data.businessName}. Contact person: ${data.contactPerson}. Phone: ${data.phone}.`,
                establishedYear: new Date().getFullYear(),

                // Contact Information
                businessEmail: data.contactPerson ? `${data.contactPerson.toLowerCase().replace(/\s+/g, '')}@${data.businessName.toLowerCase().replace(/\s+/g, '')}.com` : 'contact@business.com',
                businessPhone: data.phone,
                businessAddress: data.businessAddress,
                city: 'Mumbai', // Default city
                state: 'Maharashtra', // Default state
                pincode: '400001', // Default pincode

                // Bank Details
                bankAccountNumber: data.accountNumber,
                bankIFSC: data.ifscCode,
                bankName: data.bankName,
                accountHolderName: data.contactPerson,

                // Payment Information
                upiId: data.upiId,

                // Terms
                agreeToTerms: data.termsAccepted || true,

                // Payment Status
                paymentCompleted: applicationData.paymentCompleted || false,
                paymentId: applicationData.paymentId || null
            }

            const response = await api.post('/seller/apply', applicationData)

            if (response.data.success) {
                toast.success('Application submitted successfully!')
                // Clear payment data from localStorage
                localStorage.removeItem('sellerPaymentCompleted')
                localStorage.removeItem('sellerPaymentId')
                localStorage.removeItem('sellerSubscriptionId')
                localStorage.removeItem('sellerPaymentLinkId')
                localStorage.removeItem('registrationPaymentCompleted')
                localStorage.removeItem('registrationPaymentId')

                navigate('/user/dashboard', {
                    state: {
                        message: 'Your seller application has been submitted successfully! We will review it within 2-3 business days.'
                    }
                })
            } else {
                toast.error('Failed to submit application')
            }
        } catch (error) {
            console.error('Application error:', error)

            let errorMessage = 'Failed to submit application'
            if (error.response?.data?.error?.message) {
                errorMessage = error.response.data.error.message
            } else if (error.response?.status === 400) {
                errorMessage = 'Please check all required fields and try again'
            }

            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4 sm:space-y-6">
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
                        <div className="text-center">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                                Seller Registration Fee
                            </h3>
                            <div className="bg-saffron-50 p-4 sm:p-6 rounded-lg border border-saffron-200 mb-4 sm:mb-6">
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-saffron-600 mb-2">₹550</div>
                                <div className="text-xs sm:text-sm text-gray-600">
                                    ₹500 Platform Fee + ₹50 Affiliate Commission
                                </div>
                            </div>

                            <div className="bg-green-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                                <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Early Bird Benefits</h4>
                                <ul className="text-xs sm:text-sm text-green-700 space-y-1">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Lifetime ₹500/month store fee</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>No commission on sales</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Second month free if profit &lt; ₹5,000</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Direct payments to your account</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mb-4 sm:mb-6">
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Affiliate Code (Optional)
                                </label>
                                <input
                                    {...register('affiliateCode')}
                                    type="text"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                    placeholder="Enter affiliate code if you have one"
                                />
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        const affiliateCode = document.querySelector('input[name="affiliateCode"]')?.value || '';
                                        handlePayment(affiliateCode);
                                    }}
                                    disabled={isSubmitting}
                                    className="w-full bg-saffron-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base hover:bg-saffron-700 disabled:opacity-50 transition-colors"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Processing Payment...
                                        </div>
                                    ) : (
                                        'Pay ₹550 & Continue'
                                    )}
                                </button>
                                <p className="text-xs text-gray-500 text-center">
                                    Payment will be processed automatically
                                </p>
                            </div>
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-4 sm:space-y-6">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Business Type *
                            </label>
                            <select
                                {...register('businessType', { required: 'Business type is required' })}
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
                                <p className="mt-1 text-sm text-red-600">{errors.businessType.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Person *
                                </label>
                                <input
                                    {...register('contactPerson', { required: 'Contact person is required' })}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                    placeholder="Full name"
                                />
                                {errors.contactPerson && (
                                    <p className="mt-1 text-sm text-red-600">{errors.contactPerson.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number *
                                </label>
                                <input
                                    {...register('phone', { required: 'Phone number is required' })}
                                    type="tel"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                    placeholder="10-digit phone number"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Business Address *
                            </label>
                            <textarea
                                {...register('businessAddress', { required: 'Business address is required' })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                placeholder="Complete business address"
                            />
                            {errors.businessAddress && (
                                <p className="mt-1 text-sm text-red-600">{errors.businessAddress.message}</p>
                            )}
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-md">
                            <p className="text-sm text-blue-700">
                                Upload clear images of your documents (JPG, PNG, PDF - Max 5MB each)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                PAN Card *
                            </label>
                            <input
                                {...register('panCard', { required: 'PAN card is required' })}
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            {errors.panCard && (
                                <p className="mt-1 text-sm text-red-600">{errors.panCard.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Aadhaar Card *
                            </label>
                            <input
                                {...register('aadhaarCard', { required: 'Aadhaar card is required' })}
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            {errors.aadhaarCard && (
                                <p className="mt-1 text-sm text-red-600">{errors.aadhaarCard.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bank Statement *
                            </label>
                            <input
                                {...register('bankStatement', { required: 'Bank statement is required' })}
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            {errors.bankStatement && (
                                <p className="mt-1 text-sm text-red-600">{errors.bankStatement.message}</p>
                            )}
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="bg-green-50 p-4 rounded-md">
                            <p className="text-sm text-green-700">
                                Provide your payment details for receiving payments from buyers
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                UPI ID *
                            </label>
                            <input
                                {...register('upiId', { required: 'UPI ID is required' })}
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                placeholder="yourname@paytm / yourname@phonepe"
                            />
                            {errors.upiId && (
                                <p className="mt-1 text-sm text-red-600">{errors.upiId.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bank Name *
                                </label>
                                <input
                                    {...register('bankName', { required: 'Bank name is required' })}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                    placeholder="Enter bank name"
                                />
                                {errors.bankName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.bankName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Account Number *
                                </label>
                                <input
                                    {...register('accountNumber', { required: 'Account number is required' })}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                    placeholder="Bank account number"
                                />
                                {errors.accountNumber && (
                                    <p className="mt-1 text-sm text-red-600">{errors.accountNumber.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                IFSC Code *
                            </label>
                            <input
                                {...register('ifscCode', { required: 'IFSC code is required' })}
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                                placeholder="11-character IFSC code"
                            />
                            {errors.ifscCode && (
                                <p className="mt-1 text-sm text-red-600">{errors.ifscCode.message}</p>
                            )}
                        </div>
                    </div>
                )

            case 5:
                return (
                    <div className="space-y-6">
                        <div className="bg-saffron-50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Review Your Application</h3>
                            <div className="space-y-2 text-sm">
                                <p><strong>Payment:</strong> ✅ Completed (₹550)</p>
                                <p><strong>Business:</strong> {applicationData.businessName}</p>
                                <p><strong>Type:</strong> {applicationData.businessType}</p>
                                <p><strong>UPI ID:</strong> {applicationData.upiId}</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                {...register('termsAccepted', { required: 'You must accept the terms' })}
                                type="checkbox"
                                className="rounded border-gray-300 text-saffron-600 focus:ring-saffron-500"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                                I agree to the Terms and Conditions and Seller Policy
                            </label>
                        </div>
                        {errors.termsAccepted && (
                            <p className="text-sm text-red-600">{errors.termsAccepted.message}</p>
                        )}
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Become a VCX MART Seller</h1>
                    <p className="text-gray-600 mt-2">Complete your seller registration</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id
                                    ? 'bg-saffron-600 border-saffron-600 text-white'
                                    : 'border-gray-300 text-gray-500'
                                    }`}>
                                    <step.icon className="w-5 h-5" />
                                </div>
                                <span className={`ml-2 text-sm font-medium ${currentStep >= step.id ? 'text-saffron-600' : 'text-gray-500'
                                    }`}>
                                    {step.name}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className={`w-full h-0.5 mx-4 ${currentStep > step.id ? 'bg-saffron-600' : 'bg-gray-300'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <form onSubmit={handleSubmit(onStepSubmit)}>
                        {renderStepContent()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                                disabled={currentStep === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                            >
                                Previous
                            </button>

                            {currentStep < 5 && applicationData.paymentCompleted && (
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-sm font-medium text-white bg-saffron-600 rounded-md hover:bg-saffron-700"
                                >
                                    Next
                                </button>
                            )}

                            {currentStep === 5 && (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 text-sm font-medium text-white bg-saffron-600 rounded-md hover:bg-saffron-700 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SellerApplicationNew