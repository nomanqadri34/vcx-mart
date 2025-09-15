import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const SubscriptionSuccess = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [isVerifying, setIsVerifying] = useState(true)

    useEffect(() => {
        const verifySubscription = async () => {
            try {
                const paymentId = searchParams.get('razorpay_payment_id')
                const paymentLinkId = searchParams.get('razorpay_payment_link_id')
                const paymentLinkReferenceId = searchParams.get('razorpay_payment_link_reference_id')
                const signature = searchParams.get('razorpay_signature')

                if (paymentId && paymentLinkId) {
                    // Subscription payment successful
                    toast.success('Subscription activated successfully!')

                    // Store subscription completion
                    localStorage.setItem('subscriptionCompleted', 'true')
                    localStorage.setItem('subscriptionPaymentId', paymentId)

                    setTimeout(() => {
                        navigate('/seller/dashboard')
                    }, 2000)
                } else if (paymentId) {
                    // Payment successful but no link ID
                    toast.success('Subscription payment completed!')

                    localStorage.setItem('subscriptionCompleted', 'true')
                    localStorage.setItem('subscriptionPaymentId', paymentId)

                    setTimeout(() => {
                        navigate('/seller/dashboard')
                    }, 2000)
                } else {
                    toast.error('Subscription verification failed')
                    navigate('/seller/apply')
                }
            } catch (error) {
                console.error('Subscription verification error:', error)
                toast.error('Subscription verification failed')
                navigate('/seller/apply')
            } finally {
                setIsVerifying(false)
            }
        }

        verifySubscription()
    }, [searchParams, navigate])

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-saffron-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {isVerifying ? (
                    <div>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Verifying Subscription...
                        </h2>
                        <p className="text-gray-600">
                            Please wait while we confirm your subscription payment
                        </p>
                    </div>
                ) : (
                    <div>
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Subscription Activated!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Your monthly subscription has been activated successfully.
                            You can now start selling on VCX MART.
                        </p>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-green-700">
                                ✓ Monthly subscription active<br />
                                ✓ 0% commission on sales<br />
                                ✓ Direct payments to your account<br />
                                ✓ Ready to start selling
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SubscriptionSuccess