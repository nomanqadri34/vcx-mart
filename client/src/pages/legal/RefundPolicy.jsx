import React from 'react'

const RefundPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Refund Policy</h1>
                    <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <div className="prose max-w-none">
                        <h2 className="text-xl font-semibold mb-4">Return Window</h2>
                        <p className="mb-4">Items can be returned within 30 days of delivery for a full refund.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Refund Process</h2>
                        <p className="mb-4">Refunds are processed within 5-7 business days after we receive the returned item.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Non-Refundable Items</h2>
                        <p className="mb-4">Perishable goods, personalized items, and digital products are non-refundable.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Return Shipping</h2>
                        <p className="mb-4">Return shipping costs are covered by VCX MART for defective or incorrect items.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Contact</h2>
                        <p>For refund requests, contact returns@vcxmart.com</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RefundPolicy