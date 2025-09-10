import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DocumentArrowDownIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const InvoicePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [invoiceData, setInvoiceData] = useState(null);

    useEffect(() => {
        const data = location.state?.invoiceData || JSON.parse(localStorage.getItem('invoiceData') || 'null');
        if (data) {
            setInvoiceData(data);
        } else {
            navigate('/');
        }
    }, [location.state, navigate]);

    const handlePrint = () => {
        window.print();
    };

    if (!invoiceData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Hidden in print */}
            <div className="bg-white shadow-sm border-b print:hidden">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Back
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                        Print Invoice
                    </button>
                </div>
            </div>

            {/* Invoice Content */}
            <div className="max-w-4xl mx-auto p-4 print:p-0">
                <div className="bg-white shadow-lg rounded-lg print:shadow-none print:rounded-none print:border-0">
                    <style jsx>{`
                        @media print {
                            body { margin: 0; }
                            .print\:hidden { display: none !important; }
                            .print\:p-0 { padding: 0 !important; }
                            .print\:p-6 { padding: 1.5rem !important; }
                            .print\:shadow-none { box-shadow: none !important; }
                            .print\:rounded-none { border-radius: 0 !important; }
                            .print\:border-0 { border: 0 !important; }
                        }
                    `}</style>
                    {/* Invoice Header */}
                    <div className="border-b border-gray-200 p-8 print:p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-blue-600 mb-2">CRYPTOMART</h1>
                                <p className="text-gray-600">Your Trusted Marketplace</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
                                <p className="text-gray-600">#{invoiceData.orderNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="p-8 print:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill To:</h3>
                                <div className="text-gray-600">
                                    <p className="font-medium">{invoiceData.customerInfo?.firstName} {invoiceData.customerInfo?.lastName}</p>
                                    <p>{invoiceData.customerInfo?.email}</p>
                                    <p>{invoiceData.customerInfo?.phone}</p>
                                    <p>{invoiceData.customerInfo?.address}</p>
                                    <p>{invoiceData.customerInfo?.city}, {invoiceData.customerInfo?.state} {invoiceData.customerInfo?.pincode}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details:</h3>
                                <div className="text-gray-600 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Order Number:</span>
                                        <span className="font-medium">{invoiceData.orderNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Payment ID:</span>
                                        <span className="font-medium">{invoiceData.paymentId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Date:</span>
                                        <span className="font-medium">{new Date(invoiceData.paymentDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Status:</span>
                                        <span className="font-medium text-green-600">Paid</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items:</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Item</th>
                                            <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Qty</th>
                                            <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Price</th>
                                            <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoiceData.items?.map((item, index) => (
                                            <tr key={index}>
                                                <td className="border border-gray-300 px-4 py-3">
                                                    <div className="font-medium">{item.name}</div>
                                                    {item.variants && (
                                                        <div className="text-sm text-gray-500">
                                                            {item.variants.size && `Size: ${item.variants.size}`}
                                                            {item.variants.size && item.variants.color && ', '}
                                                            {item.variants.color && `Color: ${item.variants.color}`}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                                                <td className="border border-gray-300 px-4 py-3 text-right">₹{item.price?.toLocaleString()}</td>
                                                <td className="border border-gray-300 px-4 py-3 text-right font-medium">₹{(item.price * item.quantity)?.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end">
                            <div className="w-full max-w-sm">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>₹{invoiceData.subtotal?.toLocaleString()}</span>
                                    </div>
                                    {invoiceData.discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount:</span>
                                            <span>-₹{invoiceData.discount?.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Shipping:</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax (GST):</span>
                                        <span>₹{invoiceData.tax?.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total:</span>
                                            <span>₹{invoiceData.amount?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
                            <p className="mb-2">Thank you for shopping with Cryptomart!</p>
                            <p className="text-sm">For any queries, contact us at support@cryptomart.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePage;