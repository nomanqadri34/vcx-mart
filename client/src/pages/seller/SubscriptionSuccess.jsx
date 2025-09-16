import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const SubscriptionSuccess = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [isVerifying, setIsVerifying] = useState(true)
    
    const planType = location.state?.planType || 'early-bird'
    const subscriptionAmount = location.state?.subscriptionAmount || 500

    useEffect(() => {
        const verifySubscription = async () => {
            try {
                // Check if user is still authenticated
                const token = localStorage.getItem('accessToken')
                if (!token) {
                    toast.error('Session expired. Please login again to continue your application.')
                    navigate('/login')
                    return
                }

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

                    // Redirect back to application form to continue
                    setTimeout(() => {
                        navigate('/seller/apply', { 
                            state: { 
                                planType,
                                subscriptionCompleted: true,
                                step: 3 // Continue to business info step
                            }
                        })
                    }, 2000)
                } else if (paymentId) {
                    // Payment successful but no link ID
                    toast.success('Subscription payment completed!')

                    localStorage.setItem('subscriptionCompleted', 'true')
                    localStorage.setItem('subscriptionPaymentId', paymentId)

                    // Redirect back to application form
                    setTimeout(() => {
                        navigate('/seller/apply', { 
                            state: { 
                                planType,
                                subscriptionCompleted: true,
                                step: 3
                            }
                        })
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
    }, [searchParams, navigate, planType])

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
                            Your {planType === 'early-bird' ? 'Early Bird' : 'Regular'} subscription (₹{subscriptionAmount}/month) has been activated successfully.
                            You can now start selling on VCX MART.
                        </p>
                        <div className="bg-green-50 p-4 rounded-lg mb-4">
                            <p className="text-sm text-green-700">
                                ✓ {planType === 'early-bird' ? 'Early Bird' : 'Regular'} Plan Active (₹{subscriptionAmount}/month)<br />
                                ✓ Registration fee paid (₹50)<br />
                                ✓ 0% commission on sales<br />
                                ✓ Direct payments to your account<br />
                                ✓ Ready to start selling
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/seller/dashboard')}
                            className="w-full bg-saffron-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-saffron-700 transition-colors"
                        >
                            Go to Seller Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SubscriptionSuccess