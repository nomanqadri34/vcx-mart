import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const DashboardRouter = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Redirect based on user role
    switch (user.role) {
        case 'admin':
            return <Navigate to="/admin/dashboard" replace />
        case 'seller':
            return <Navigate to="/seller/dashboard" replace />
        case 'user':
        default:
            return <Navigate to="/user/dashboard" replace />
    }
}

export default DashboardRouter