import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [isVerifying, setIsVerifying] = useState(true)

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const paymentId = searchParams.get('razorpay_payment_id')
                const paymentLinkId = searchParams.get('razorpay_payment_link_id')
                const paymentLinkReferenceId = searchParams.get('razorpay_payment_link_reference_id')
                const signature = searchParams.get('razorpay_signature')

                if (paymentId && paymentLinkId) {
                    // Payment successful
                    toast.success('Payment completed successfully!')
                    
                    // Store payment completion in localStorage for the application form
                    localStorage.setItem('sellerPaymentCompleted', 'true')
                    localStorage.setItem('sellerPaymentId', paymentId)
                    localStorage.setItem('sellerPaymentLinkId', paymentLinkId)
                    
                    setTimeout(() => {
                        navigate('/seller/apply-new?step=2&payment=success')
                    }, 2000)
                } else if (paymentId) {
                    // Payment successful but no link ID
                    toast.success('Payment completed successfully!')
                    
                    localStorage.setItem('sellerPaymentCompleted', 'true')
                    localStorage.setItem('sellerPaymentId', paymentId)
                    
                    setTimeout(() => {
                        navigate('/seller/apply-new?step=2&payment=success')
                    }, 2000)
                } else {
                    toast.error('Payment verification failed')
                    navigate('/seller/apply-new')
                }
            } catch (error) {
                console.error('Payment verification error:', error)
                toast.error('Payment verification failed')
                navigate('/seller/apply-new')
            } finally {
                setIsVerifying(false)
            }
        }

        verifyPayment()
    }, [searchParams, navigate])

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-saffron-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {isVerifying ? (
                    <div>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Verifying Payment...
                        </h2>
                        <p className="text-gray-600">
                            Please wait while we confirm your payment
                        </p>
                    </div>
                ) : (
                    <div>
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Payment Successful!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Your seller registration payment has been completed successfully.
                            You will be redirected to complete your application.
                        </p>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-green-700">
                                ✓ Registration fee paid<br />
                                ✓ First month subscription activated<br />
                                ✓ Ready to complete application
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PaymentSuccess