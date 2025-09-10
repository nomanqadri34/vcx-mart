import React from 'react'

const GrievancePolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Grievance Policy</h1>
                    <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <div className="prose max-w-none">
                        <h2 className="text-xl font-semibold mb-4">Filing a Complaint</h2>
                        <p className="mb-4">Customers can file grievances through our support portal or email.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Response Time</h2>
                        <p className="mb-4">We acknowledge complaints within 24 hours and resolve within 7 business days.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Escalation Process</h2>
                        <p className="mb-4">Unresolved issues can be escalated to our senior management team.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Grievance Officer</h2>
                        <p className="mb-4">Contact our Grievance Officer for serious complaints requiring immediate attention.</p>
                        
                        <h2 className="text-xl font-semibold mb-4">Contact</h2>
                        <p>Grievances: grievance@vcxmart.com | Phone: +91-XXXX-XXXXXX</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GrievancePolicy