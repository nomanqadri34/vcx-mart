import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const EmailVerificationPage = () => {
    const [searchParams] = useSearchParams();
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isResending, setIsResending] = useState(false);

    const { verifyEmail, resendVerification } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get email from URL params or navigation state
    const emailParam = searchParams.get('email');

    // Get email from navigation state if available
    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location.state]);

    useEffect(() => {
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [emailParam]);

    const handleVerification = async () => {
        if (!email || !otp) {
            setVerificationStatus('error');
            return;
        }

        try {
            setIsVerifying(true);
            setVerificationStatus(null);

            const result = await verifyEmail(email, otp);

            if (result.success) {
                setVerificationStatus('success');
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login', {
                        state: { message: 'Email verified successfully! Please log in to your account.' }
                    });
                }, 3000);
            } else {
                setVerificationStatus('error');
            }
        } catch (error) {
            setVerificationStatus('error');
            console.error('Verification error:', error);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendVerification = async () => {
        if (!email) return;

        try {
            setIsResending(true);
            const result = await resendVerification(email);

            if (result.success) {
                // Show success message
                setVerificationStatus('resent');
            }
        } catch (error) {
            console.error('Resend error:', error);
        } finally {
            setIsResending(false);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    if (isVerifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-saffron-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600 mx-auto"></div>
                    <h2 className="text-xl font-semibold text-gray-900">Verifying your email...</h2>
                    <p className="text-gray-600">Please wait while we verify your email address.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-saffron-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-12 w-12 bg-gradient-to-r from-saffron-500 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">C</span>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Verify your email
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We've sent a verification link to your email address
                    </p>
                </div>

                {/* Verification Status Messages */}
                {verificationStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <div className="flex">
                            <CheckCircleIcon className="h-5 w-5 text-green-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">Email verified successfully!</h3>
                                <p className="mt-1 text-sm text-green-700">
                                    Redirecting you to login page...
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {verificationStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Verification failed</h3>
                                <p className="mt-1 text-sm text-red-700">
                                    The verification link may be invalid or expired. Please try again.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {verificationStatus === 'resent' && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <div className="flex">
                            <CheckCircleIcon className="h-5 w-5 text-green-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">Verification email sent!</h3>
                                <p className="mt-1 text-sm text-green-700">
                                    Please check your inbox and click the verification link.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* OTP Verification Form */}
                <div className="bg-white py-8 px-6 shadow rounded-lg">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your email address"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                Verification Code (OTP)
                            </label>
                            <div className="mt-1">
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength={6}
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                                    placeholder="000000"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Enter the 6-digit code sent to your email
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={handleVerification}
                                disabled={!email || !otp || isVerifying}
                                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${!email || !otp || isVerifying
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-saffron-600 to-green-600 hover:from-saffron-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 transition-all duration-200'
                                    }`}
                            >
                                {isVerifying ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Verifying...
                                    </div>
                                ) : (
                                    'Verify Email'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleResendVerification}
                                disabled={!email || isResending}
                                className={`group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md ${!email || isResending
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 transition-colors'
                                    }`}
                            >
                                {isResending ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Sending...
                                    </div>
                                ) : (
                                    'Resend verification code'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">What to do next:</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Check your email inbox (and spam folder)</li>
                                    <li>Enter the 6-digit verification code from the email</li>
                                    <li>Click "Verify Email" to complete verification</li>
                                    <li>Once verified, you can log in to your account</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Link
                        to="/login"
                        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 transition-colors"
                    >
                        Back to Sign In
                    </Link>

                    <Link
                        to="/register"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-saffron-700 bg-saffron-100 hover:bg-saffron-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 transition-colors"
                    >
                        Create another account
                    </Link>
                </div>

                {/* Help Section */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Didn't receive the verification code?{' '}
                        <button
                            type="button"
                            onClick={handleResendVerification}
                            disabled={!email || isResending}
                            className="font-medium text-saffron-600 hover:text-saffron-500 transition-colors disabled:text-gray-400"
                        >
                            Resend verification code
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationPage;
