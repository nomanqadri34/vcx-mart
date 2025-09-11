import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleIcon, ArrowRightIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CheckoutSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [orderDetails, setOrderDetails] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(true);

    const orderId = searchParams.get('order_id') || location.state?.orderId;
    const paymentId = searchParams.get('payment_id') || location.state?.paymentId;
    const status = searchParams.get('status');

    useEffect(() => {
        // Emit checkout complete event to clear cart
        window.dispatchEvent(new CustomEvent('checkout-complete'));
        
        const fetchOrderDetails = async () => {
            // Check for invoice data from localStorage or location state
            const storedInvoiceData = localStorage.getItem('invoiceData');
            if (storedInvoiceData) {
                try {
                    const parsedData = JSON.parse(storedInvoiceData);
                    setInvoiceData(parsedData);
                    localStorage.removeItem('invoiceData'); // Clean up
                } catch (error) {
                    console.error('Failed to parse invoice data:', error);
                }
            } else if (location.state?.invoiceData) {
                setInvoiceData(location.state.invoiceData);
            }

            if (!orderId) {
                setLoading(false);
                return;
            }

            try {
                // Try to get order details
                const response = await api.get(`/orders/${orderId}`);
                if (response.data.success) {
                    setOrderDetails(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch order details:', error);
                // Don't show error toast if we have invoice data
                if (!invoiceData) {
                    toast.error('Failed to load order details');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, location.state]);

    const handleContinueShopping = () => {
        navigate('/products');
    };

    const handleViewOrders = () => {
        navigate('/user/orders');
    };

    const generateInvoice = () => {
        const data = invoiceData || orderDetails;
        if (!data) {
            toast.error('No order data available for invoice');
            return;
        }

        const invoiceContent = `
            <html>
            <head>
                <title>Invoice - ${data.orderNumber || 'N/A'}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .invoice-details { margin-bottom: 20px; }
                    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .items-table th { background-color: #f2f2f2; }
                    .total-section { margin-top: 20px; text-align: right; }
                    .total-row { font-weight: bold; font-size: 18px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>CRYPTOMART</h1>
                    <h2>INVOICE</h2>
                </div>
                
                <div class="invoice-details">
                    <p><strong>Order Number:</strong> ${data.orderNumber || 'N/A'}</p>
                    <p><strong>Payment ID:</strong> ${paymentId || 'N/A'}</p>
                    <p><strong>Date:</strong> ${new Date(data.paymentDate || Date.now()).toLocaleDateString()}</p>
                    <p><strong>Customer:</strong> ${data.customerInfo?.firstName || ''} ${data.customerInfo?.lastName || ''}</p>
                    <p><strong>Email:</strong> ${data.customerInfo?.email || ''}</p>
                </div>

                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(data.items || []).map(item => `
                            <tr>
                                <td>${item.name || 'Product'}</td>
                                <td>${item.quantity || 1}</td>
                                <td>₹${(item.price || 0).toLocaleString()}</td>
                                <td>₹${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="total-section">
                    <p>Subtotal: ₹${(data.subtotal || 0).toLocaleString()}</p>
                    ${data.discount > 0 ? `<p>Discount: -₹${data.discount.toLocaleString()}</p>` : ''}
                    <p>Tax (GST): ₹${(data.tax || 0).toLocaleString()}</p>
                    <p class="total-row">Total: ₹${(data.amount || data.pricing?.total || 0).toLocaleString()}</p>
                </div>

                <div style="margin-top: 40px; text-align: center; color: #666;">
                    <p>Thank you for shopping with Cryptomart!</p>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(invoiceContent);
        printWindow.document.close();
        printWindow.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-6" />

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Successful!
                </h1>

                <p className="text-gray-600 mb-6">
                    Thank you for your order. Your payment has been processed successfully.
                </p>

                {(orderDetails || invoiceData) && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Order Number:</span> {orderDetails?.orderNumber || invoiceData?.orderNumber || 'N/A'}</p>
                            <p><span className="font-medium">Total Amount:</span> ₹{(orderDetails?.pricing?.total || invoiceData?.amount || 0).toLocaleString()}</p>
                            <p><span className="font-medium">Items:</span> {(orderDetails?.items?.length || invoiceData?.items?.length || 0)} item(s)</p>
                            <p><span className="font-medium">Status:</span>
                                <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                    {orderDetails?.status || 'Completed'}
                                </span>
                            </p>
                        </div>
                    </div>
                )}

                {paymentId && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            <span className="font-medium">Payment ID:</span> {paymentId}
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/invoice', { state: { invoiceData: invoiceData || orderDetails } })}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                        <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                        View Invoice
                    </button>

                    <button
                        onClick={handleViewOrders}
                        className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center"
                    >
                        View My Orders
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </button>

                    <button
                        onClick={handleContinueShopping}
                        className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        You will receive an email confirmation shortly.
                        <br />
                        For any issues, please contact our support team.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccessPage;
