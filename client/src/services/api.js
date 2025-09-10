import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable cookies for session management
    // Removed timeout: 30000 to prevent timeout errors
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh and errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await api.post('/auth/refresh', { refreshToken });
                    const { accessToken } = response.data.data;

                    localStorage.setItem('accessToken', accessToken);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh token failed, redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');

                // Only redirect if not already on login page
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }

        // Handle other errors
        if (error.response?.status >= 500) {
            toast.error('Server error. Please try again later.');
        } else if (error.response?.status === 404) {
            toast.error('Resource not found.');
        } else if (error.response?.status === 403) {
            toast.error('Access denied. Insufficient permissions.');
        } else if (!error.response) {
            toast.error('Network error. Please check your connection.');
        }

        return Promise.reject(error);
    }
);

// API response wrapper
const apiResponse = async (apiCall) => {
    try {
        const response = await apiCall();
        console.log('apiResponse: Raw response:', response);
        console.log('apiResponse: Response data:', response.data);
        return response.data; // Return the server response directly
    } catch (error) {
        console.error('API Error:', error);
        const errorMessage = error.response?.data?.error?.message || 'An error occurred';
        return { success: false, error: errorMessage };
    }
};

// Auth API functions
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
    refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
    changePassword: (currentPassword, newPassword) => api.post('/auth/change-password', { currentPassword, newPassword }),
    verifyEmail: (email, otp) => api.post('/auth/verify-email', { email, otp }),
    resendVerification: (email) => api.post('/auth/resend-verification', { email }),
    sendOTP: (phone) => api.post('/auth/send-otp', { phone }),
    verifyOTP: (otp) => api.post('/auth/verify-otp', { otp }),
    googleAuth: (idToken, deviceInfo) => api.post('/auth/google', { idToken, deviceInfo }),
    linkGoogleAccount: (idToken) => api.post('/auth/google/link', { idToken }),
    unlinkGoogleAccount: () => api.post('/auth/google/unlink'),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// User API functions
export const userAPI = {
    updateProfile: (profileData) => api.put('/users/profile', profileData),
    applyAsSeller: (sellerData) => api.post('/users/seller/apply', sellerData),
    getAddresses: () => api.get('/users/addresses'),
    addAddress: (addressData) => api.post('/users/addresses', addressData),
    updateAddress: (addressId, addressData) => api.put(`/users/addresses/${addressId}`, addressData),
    deleteAddress: (addressId) => api.delete(`/users/addresses/${addressId}`),
    getOrders: (params) => api.get('/users/orders', { params }),
    getOrder: (orderId) => api.get(`/users/orders/${orderId}`),
    getReviews: () => api.get('/users/reviews'),
    addReview: (reviewData) => api.post('/users/reviews', reviewData),
    updateReview: (reviewId, reviewData) => api.put(`/users/reviews/${reviewId}`, reviewData),
    deleteReview: (reviewId) => api.delete(`/users/reviews/${reviewId}`),
};

// Seller API functions
export const sellerAPI = {
    // Application management
    applyAsSeller: (applicationData) => api.post('/seller/apply', applicationData),
    getApplicationStatus: () => api.get('/seller/application/status'),

    // Dashboard and products
    getDashboard: () => api.get('/seller/dashboard'),
    getProducts: (params) => api.get('/seller/products', { params }),
    createProduct: (productData) => api.post('/seller/products', productData),
    updateProduct: (productId, productData) => api.put(`/seller/products/${productId}`, productData),
    deleteProduct: (productId) => api.delete(`/seller/products/${productId}`),
    getOrders: (params) => api.get('/seller/orders', { params }),
    updateOrderStatus: (orderId, statusData) => api.put(`/seller/orders/${orderId}/status`, statusData),
    getAnalytics: (params) => api.get('/seller/analytics', { params }),
    getEarnings: (params) => api.get('/seller/earnings', { params }),

    // Admin functions for seller applications
    getApplications: (params) => api.get('/seller/applications', { params }),
    getApplicationStats: () => api.get('/seller/applications/stats'),
    getApplication: (applicationId) => api.get(`/seller/applications/${applicationId}`),
    approveApplication: (applicationId, notes) => api.put(`/seller/applications/${applicationId}/approve`, { notes }),
    rejectApplication: (applicationId, reason, notes) => api.put(`/seller/applications/${applicationId}/reject`, { reason, notes }),
    requestChanges: (applicationId, reason, notes) => api.put(`/seller/applications/${applicationId}/request-changes`, { reason, notes }),
};

// Admin API functions
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getUsers: (params) => api.get('/admin/users', { params }),
    updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
    getSellers: (params) => api.get('/admin/sellers', { params }),
    getSellerStats: () => api.get('/admin/sellers/stats'),
    getSeller: (userId) => api.get(`/admin/sellers/${userId}`),
    approveSeller: (userId, approvalData) => api.put(`/admin/sellers/${userId}/approve`, approvalData),
    rejectSeller: (userId, rejectionData) => api.put(`/admin/sellers/${userId}/reject`, rejectionData),
    getProducts: (params) => api.get('/admin/products', { params }),
    updateProduct: (productId, productData) => api.put(`/admin/products/${productId}`, productData),
    deleteProduct: (productId) => api.delete(`/admin/products/${productId}`),
    getOrders: (params) => api.get('/admin/orders', { params }),
    updateOrder: (orderId, orderData) => api.put(`/admin/orders/${orderId}`, orderData),
    getAnalytics: (params) => api.get('/admin/analytics', { params }),
};

// Product API functions
export const productAPI = {
    getProducts: (params) => api.get('/products', { params }),
    getProduct: (productId) => api.get(`/products/${productId}`),
    getCategories: () => api.get('/categories'),
    getCategory: (categorySlug) => api.get(`/categories/${categorySlug}`),
    searchProducts: (query, params) => api.get('/products/search', { params: { q: query, ...params } }),
    getFeaturedProducts: () => api.get('/products/featured'),
    getDeals: () => api.get('/products/deals'),
    getRelatedProducts: (productId) => api.get(`/products/${productId}/related`),
    getProductReviews: (productId, params) => api.get(`/reviews/${productId}/reviews`, { params }),
    addProductReview: (productId, reviewData) => api.post(`/reviews/${productId}/reviews`, reviewData),
};



// Cart API functions
export const cartAPI = {
    testSession: () => apiResponse(() => api.get('/cart/test')),
    getCart: async () => {
        console.log('cartAPI.getCart: Making request...');
        const response = await apiResponse(() => api.get('/cart'));
        console.log('cartAPI.getCart: Response received:', response);
        return response;
    },
    addToCart: (productId, quantity, variants) => apiResponse(() => api.post('/cart/add', { productId, quantity, variants })),
    updateCartItem: (productId, quantity, variants) => apiResponse(() => api.put('/cart/update', { productId, quantity, variants })),
    removeFromCart: (productId, variants) => apiResponse(() => api.delete('/cart/remove', { data: { productId, variants } })),
    clearCart: () => apiResponse(() => api.post('/cart/clear')),
    checkout: (shippingAddress, billingAddress) => apiResponse(() => api.post('/cart/checkout', { shippingAddress, billingAddress })),
};

// Order API functions
export const orderAPI = {
    // Customer order functions
    createOrder: (orderData) => api.post('/orders', orderData),
    getMyOrders: (params) => api.get('/orders/my-orders', { params }),
    getOrder: (orderId) => api.get(`/orders/${orderId}`),
    cancelOrder: (orderId, reason) => api.put(`/orders/${orderId}/cancel`, { reason }),
    trackOrder: (orderId) => api.get(`/orders/${orderId}/track`),
    
    // Seller order functions
    getSellerOrders: (params) => api.get('/orders/seller/my-orders', { params }),
    updateOrderStatus: (orderId, status, notes) => api.put(`/orders/${orderId}/status`, { status, notes }),
    createShipping: (orderId) => api.post(`/orders/${orderId}/ship`),
    
    // Admin order functions
    getAllOrders: (params) => api.get('/orders/admin/all', { params }),
    getOrderStats: (params) => api.get('/orders/admin/stats', { params }),
};

// Payment API functions
export const paymentAPI = {
    createPaymentIntent: (paymentData) => api.post('/payments/create-intent', paymentData),
    confirmPayment: (paymentId, confirmationData) => api.post(`/payments/${paymentId}/confirm`, confirmationData),
    getPaymentMethods: () => api.get('/payments/methods'),
    addPaymentMethod: (paymentMethodData) => api.post('/payments/methods', paymentMethodData),
    removePaymentMethod: (methodId) => api.delete(`/payments/methods/${methodId}`),
    getPaymentHistory: (params) => api.get('/payments/history', { params }),
};

// Notification API functions
export const notificationAPI = {
    getNotifications: (params) => api.get('/notifications', { params }),
    markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
    markAllAsRead: () => api.put('/notifications/mark-all-read'),
    updatePreferences: (preferences) => api.put('/notifications/preferences', preferences),
};



// Checkout API functions
export const checkoutAPI = {
    validate: (checkoutData) => api.post('/checkout/validate', checkoutData),
    createOrder: (orderData) => api.post('/checkout/create-order', orderData),
};

// Export the main api instance and wrapper
export { api, apiResponse };
export default api;
