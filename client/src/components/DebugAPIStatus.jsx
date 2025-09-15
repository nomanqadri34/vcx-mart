import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DebugAPIStatus = () => {
    const [status, setStatus] = useState({
        server: 'checking...',
        auth: 'checking...',
        subscription: 'checking...',
        registration: 'checking...',
        user: null
    });

    useEffect(() => {
        checkAPIStatus();
    }, []);

    const testAuthenticatedCall = async () => {
        try {
            const response = await api.post('/subscription/registration/create', { applicationId: 'test' });
            console.log('Auth test response:', response);
            alert('Authentication test successful!');
        } catch (error) {
            console.log('Auth test error:', error);
            alert(`Authentication test failed: ${error.response?.status} - ${error.response?.data?.error?.message || error.message}`);
        }
    };

    const checkAPIStatus = async () => {
        // Check server health
        try {
            const healthResponse = await fetch('http://localhost:5000/health');
            if (healthResponse.ok) {
                setStatus(prev => ({ ...prev, server: '✅ Online' }));
            } else {
                setStatus(prev => ({ ...prev, server: `❌ Offline (${healthResponse.status})` }));
            }
        } catch (error) {
            setStatus(prev => ({ ...prev, server: `❌ Offline (${error.message})` }));
        }

        // Check authentication
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setStatus(prev => ({ ...prev, auth: '❌ No token' }));
                return;
            }

            const response = await api.get('/seller/test-auth');
            if (response.data.success) {
                setStatus(prev => ({
                    ...prev,
                    auth: '✅ Authenticated',
                    user: response.data.user
                }));
            }
        } catch (error) {
            setStatus(prev => ({ ...prev, auth: `❌ Auth failed (${error.response?.status})` }));
        }

        // Check subscription endpoint
        try {
            // Test without authentication first
            const response = await fetch('http://localhost:5000/api/v1/subscription/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId: 'test' })
            });

            if (response.status === 401) {
                setStatus(prev => ({ ...prev, subscription: '✅ Endpoint exists (401 expected)' }));
            } else if (response.status === 404) {
                setStatus(prev => ({ ...prev, subscription: '❌ Endpoint not found (404)' }));
            } else {
                setStatus(prev => ({ ...prev, subscription: `❓ Status: ${response.status}` }));
            }
        } catch (error) {
            setStatus(prev => ({ ...prev, subscription: `❌ Network error: ${error.message}` }));
        }

        // Check registration endpoint
        try {
            const response = await fetch('http://localhost:5000/api/v1/subscription/registration/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId: 'test' })
            });

            if (response.status === 401) {
                setStatus(prev => ({ ...prev, registration: '✅ Endpoint exists (401 expected)' }));
            } else if (response.status === 404) {
                setStatus(prev => ({ ...prev, registration: '❌ Endpoint not found (404)' }));
            } else {
                setStatus(prev => ({ ...prev, registration: `❓ Status: ${response.status}` }));
            }
        } catch (error) {
            setStatus(prev => ({ ...prev, registration: `❌ Network error: ${error.message}` }));
        }
    };

    if (!import.meta.env.DEV) {
        return null; // Only show in development
    }

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg text-xs max-w-sm">
            <h4 className="font-bold mb-2">🔍 API Debug Status</h4>
            <div className="space-y-1">
                <div><strong>Server:</strong> {status.server}</div>
                <div><strong>Auth:</strong> {status.auth}</div>
                <div><strong>Subscription:</strong> {status.subscription}</div>
                <div><strong>Registration:</strong> {status.registration}</div>
                {status.user && (
                    <div><strong>User:</strong> {status.user.email} ({status.user.role})</div>
                )}
            </div>
            <div className="mt-2 space-x-2">
                <button
                    onClick={checkAPIStatus}
                    className="text-blue-600 hover:text-blue-800 underline text-xs"
                >
                    Refresh
                </button>
                <button
                    onClick={testAuthenticatedCall}
                    className="text-green-600 hover:text-green-800 underline text-xs"
                >
                    Test Auth
                </button>
            </div>
        </div>
    );
};

export default DebugAPIStatus;