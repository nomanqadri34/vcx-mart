import React from 'react'

// Placeholder component factory
const createPlaceholder = (title, description) => {
    return () => (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-saffron-50 to-green-50">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600 mt-2">{description}</p>
            </div>
        </div>
    )
}

// Export all placeholder pages
export const ProductPage = createPlaceholder('Product Details', 'Product page functionality coming soon...')
export const CategoryPage = createPlaceholder('Category Products', 'Category page functionality coming soon...')
export const SearchPage = createPlaceholder('Search Results', 'Search functionality coming soon...')


export const OrderSuccessPage = createPlaceholder('Order Success', 'Order success page coming soon...')

// User pages
export const UserOrders = createPlaceholder('My Orders', 'Order history functionality coming soon...')
export const UserProfile = createPlaceholder('My Profile', 'Profile management functionality coming soon...')
export const UserAddresses = createPlaceholder('My Addresses', 'Address management functionality coming soon...')
export const UserReviews = createPlaceholder('My Reviews', 'Review management functionality coming soon...')

// Seller pages
export const SellerDashboard = createPlaceholder('Seller Dashboard', 'Seller dashboard functionality coming soon...')
export const SellerProducts = createPlaceholder('My Products', 'Product management functionality coming soon...')
export const SellerOrders = createPlaceholder('Seller Orders', 'Order management functionality coming soon...')
export const SellerAnalytics = createPlaceholder('Analytics', 'Analytics functionality coming soon...')

// Admin pages
export const AdminUsers = createPlaceholder('User Management', 'User management functionality coming soon...')
export const AdminSellers = createPlaceholder('Seller Management', 'Seller management functionality coming soon...')
export const AdminProducts = createPlaceholder('Product Management', 'Product management functionality coming soon...')
export const AdminOrders = createPlaceholder('Order Management', 'Order management functionality coming soon...')
