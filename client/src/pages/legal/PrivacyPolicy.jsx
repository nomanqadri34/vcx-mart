import React from 'react'

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
                    <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <div className="prose max-w-none">
                        <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
                        <p className="mb-4">We collect information you provide directly, such as account details, purchase history, and communication preferences.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
                        <p className="mb-4">We use your information to process orders, provide customer support, and improve our services.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Information Sharing</h2>
                        <p className="mb-4">We do not sell your personal information. We may share information with trusted partners for order fulfillment.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
                        <p>For privacy concerns, contact us at privacy@vcxmart.com</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy