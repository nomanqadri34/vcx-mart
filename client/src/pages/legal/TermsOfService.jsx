import React from 'react'

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
                    <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <div className="prose max-w-none">
                        <h2 className="text-xl font-semibold mb-4">Acceptance of Terms</h2>
                        <p className="mb-4">By using VCX MART, you agree to these terms and conditions.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">User Accounts</h2>
                        <p className="mb-4">You are responsible for maintaining account security and all activities under your account.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Prohibited Uses</h2>
                        <p className="mb-4">You may not use our platform for illegal activities or to violate any applicable laws.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Limitation of Liability</h2>
                        <p className="mb-4">VCX MART is not liable for indirect, incidental, or consequential damages.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Contact</h2>
                        <p>Questions about terms? Contact legal@vcxmart.com</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TermsOfService