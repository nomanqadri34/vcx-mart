import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircleIcon, ClockIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'

const ApplicationSubmitted = () => {
    const navigate = useNavigate()
    const location = useLocation()
    
    const applicationId = location.state?.applicationId || 'N/A'
    const planType = location.state?.planType || 'early-bird'
    const subscriptionAmount = planType === 'early-bird' ? 500 : 800

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Application Submitted Successfully!
                </h2>
                
                <p className="text-gray-600 mb-6">
                    Your seller application has been submitted for review.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center mb-3">
                        <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-900">Review Process</span>
                    </div>
                    <p className="text-sm text-blue-800 mb-3">
                        Our admin team will review your application within <strong>24 hours</strong>.
                    </p>
                    <p className="text-sm text-blue-700">
                        You will receive an email notification once your application is approved.
                    </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-green-900 mb-2">What's Next?</h3>
                    <div className="text-sm text-green-800 space-y-1">
                        <div className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            <span>✓ Registration fee paid (₹50)</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            <span>✓ Subscription active (₹{subscriptionAmount}/month)</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            <span>✓ Application submitted</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                            <span>⏳ Admin approval pending</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600">
                        <strong>Application ID:</strong> {applicationId}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Keep this ID for reference
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/user/dashboard')}
                        className="w-full bg-saffron-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-saffron-700 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                    
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-gray-100 text-gray-700 py-2 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Need help? Contact us at{' '}
                        <a href="mailto:teamvtcx@gmail.com" className="text-saffron-600 hover:underline">
                            teamvtcx@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ApplicationSubmitted