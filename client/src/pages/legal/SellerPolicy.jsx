import React from 'react'

const SellerPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Seller Policy</h1>
                    <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <div className="prose max-w-none">
                        <h2 className="text-xl font-semibold mb-4">Seller Requirements</h2>
                        <p className="mb-4">Sellers must provide valid business documentation and maintain quality standards.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Commission Structure</h2>
                        <p className="mb-4">VCX MART charges a competitive commission on each sale, varying by category.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Product Guidelines</h2>
                        <p className="mb-4">All products must comply with Indian laws and our quality standards.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Payment Terms</h2>
                        <p className="mb-4">Seller payments are processed weekly after order completion and return window.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Contact</h2>
                        <p>Seller support: sellers@vcxmart.com</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SellerPolicy