import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TruckIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { orderAPI as api } from "../services/api";
import toast from 'react-hot-toast';

const OrderTrackingPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const response = await api.trackOrder(orderId);
            if (response.success) {
                setOrder(response.data);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('Failed to fetch order tracking details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-20 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-900">Order not found</h2>
                        <p className="mt-2 text-gray-600">The order you're looking for doesn't exist or you don't have permission to view it.</p>
                    </div>
                </div>
            </div>
        );
    }

    const getStepStatus = (stepIndex) => {
        const currentStepIndex = [
            'pending',
            'confirmed',
            'processing',
            'shipped',
            'out_for_delivery',
            'delivered'
        ].indexOf(order.status);

        if (stepIndex < currentStepIndex) return 'complete';
        if (stepIndex === currentStepIndex) return 'current';
        return 'upcoming';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Order Tracking</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Order #{order.orderNumber} • Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Tracking Information */}
                    <div className="px-4 py-5 sm:p-6">
                        {/* Tracking Steps */}
                        <div className="space-y-8">
                            {[
                                {
                                    title: 'Order Placed',
                                    description: 'Your order has been placed successfully',
                                    icon: ClockIcon,
                                    step: 'pending'
                                },
                                {
                                    title: 'Order Confirmed',
                                    description: 'Your order has been confirmed',
                                    icon: CheckCircleIcon,
                                    step: 'confirmed'
                                },
                                {
                                    title: 'Processing',
                                    description: 'Your order is being processed',
                                    icon: ClockIcon,
                                    step: 'processing'
                                },
                                {
                                    title: 'Shipped',
                                    description: order.shipping?.trackingNumber
                                        ? `Tracking Number: ${order.shipping.trackingNumber}`
                                        : 'Your order has been shipped',
                                    icon: TruckIcon,
                                    step: 'shipped'
                                },
                                {
                                    title: 'Out for Delivery',
                                    description: 'Your order is out for delivery',
                                    icon: TruckIcon,
                                    step: 'out_for_delivery'
                                },
                                {
                                    title: 'Delivered',
                                    description: order.deliveredAt
                                        ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                                        : 'Pending delivery',
                                    icon: CheckCircleIcon,
                                    step: 'delivered'
                                }
                            ].map((step, index) => {
                                const status = getStepStatus(index);
                                return (
                                    <div key={step.step} className="relative">
                                        <div className="flex items-center">
                                            <div className={`
                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                        ${status === 'complete' ? 'bg-green-500' :
                                                    status === 'current' ? 'bg-blue-500' :
                                                        'bg-gray-300'
                                                }
                      `}>
                                                <step.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                                                <p className="mt-1 text-sm text-gray-500">{step.description}</p>
                                                {step.step === 'shipped' && order.shipping?.courier && (
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Courier: {order.shipping.courier}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {index < 5 && (
                                            <div className={`
                        absolute top-8 left-4 -ml-px mt-3 h-14 w-0.5
                        ${status === 'complete' ? 'bg-green-500' : 'bg-gray-300'}
                      `} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Shipping Address */}
                        {order.shipping?.address && (
                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Address</h3>
                                <div className="text-sm text-gray-500">
                                    <p>{order.shipping.address.name}</p>
                                    <p>{order.shipping.address.street}</p>
                                    <p>
                                        {order.shipping.address.city}, {order.shipping.address.state} {order.shipping.address.pincode}
                                    </p>
                                    <p>Phone: {order.shipping.address.phone}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTrackingPage;