import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import ErrorBoundary from "./components/ErrorBoundary";

if (import.meta.env.MODE === "development") {
  import("./utils/googleAuthTest.js");
}

// Layout Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import MobileBottomNav from "./components/MobileBottomNav";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardRouter from "./components/DashboardRouter";
import LaunchCountdown from "./components/LaunchCountdown";

// Public Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import DealsPage from "./pages/DealsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HelpPage from "./pages/HelpPage";
import ShippingInfo from "./pages/ShippingInfo";
import CheckoutPage from "./pages/CheckoutPage";

// Legal Pages
import PrivacyPolicyPage from "./pages/legal/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/legal/TermsOfServicePage";
import RefundPolicyPage from "./pages/legal/RefundPolicyPage";
import SellerPolicyPage from "./pages/legal/SellerPolicyPage";
import GrievancePolicyPage from "./pages/legal/GrievancePolicyPage";
import SecurityPolicyPage from "./pages/legal/SecurityPolicyPage";
import CookiePolicyPage from "./pages/legal/CookiePolicyPage";
import IPPolicyPage from "./pages/legal/IPPolicyPage";
import ReturnsRefundsPage from "./pages/legal/ReturnsRefundsPage";
import ShippingInfoPage from "./pages/legal/ShippingInfoPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import AccessibilityPage from "./pages/legal/AccessibilityPage";
import BugBountyPage from "./pages/legal/BugBountyPage";
import CareersPage from "./pages/legal/CareersPage";
import PressMediaPage from "./pages/legal/PressMediaPage";
import SecurityPage from "./pages/legal/SecurityPage";
import GoKwikCheckoutPage from "./pages/GoKwikCheckoutPage";
import RazorpayCheckoutPage from "./pages/RazorpayCheckoutPage";
import CartPage from "./pages/CartPage";
import MockPaymentPage from "./pages/MockPaymentPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";
import CheckoutCancelPage from "./pages/CheckoutCancelPage";
import InvoicePage from "./pages/InvoicePage";

import {
  CategoryPage,
  SearchPage,
  OrderSuccessPage,
  UserAddresses,
  UserReviews,
  SellerDashboard,
  SellerProducts,
  SellerAnalytics,
  AdminUsers,
  AdminSellers,
  AdminProducts,
} from "./pages/PlaceholderPages";

// User Pages
import UserProfile from "./pages/user/UserProfile";
import UserAddressesReal from "./pages/user/UserAddresses";
import UserPayments from "./pages/user/UserPayments";
import UserNotifications from "./pages/user/UserNotifications";
import UserSecurity from "./pages/user/UserSecurity";
import Wishlist from "./pages/user/Wishlist";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import EmailVerificationPage from "./pages/auth/EmailVerificationPage";

// User Dashboard
import UserDashboard from "./pages/user/UserDashboard";
import MyOrders from "./pages/user/MyOrders";
import OrderDetail from "./pages/user/OrderDetail";

// Seller Dashboard
import BecomeSeller from "./pages/seller/BecomeSeller";
import SellerApplication from "./pages/seller/SellerApplication";
import SellerApplicationNew from "./pages/seller/SellerApplicationNew";
import PaymentSuccess from "./pages/seller/PaymentSuccess";
import SubscriptionSuccess from "./pages/seller/SubscriptionSuccess";
import SellerPaymentFlow from "./pages/seller/SellerPaymentFlow";
import SellerDashboardReal from "./pages/seller/SellerDashboard";
import ProductManagement from "./pages/seller/ProductManagement";
import AddProduct from "./pages/seller/AddProduct";
import EditProduct from "./pages/seller/EditProduct";
import SellerCategoryManagement from "./pages/seller/SellerCategoryManagement";
import SellerOrdersReal from "./pages/seller/SellerOrders";

// Debug
import DebugUser from "./pages/DebugUser";

// Admin Dashboard
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSellerManagement from "./pages/admin/AdminSellerManagement";
import AdminProductManagement from "./pages/admin/AdminProductManagement";
import AdminCategoryManagement from "./pages/admin/AdminCategoryManagement";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminOrders from "./pages/admin/AdminOrders";
import SellerApplications from "./pages/admin/SellerApplications";
import SellerApplicationDetail from "./pages/admin/SellerApplicationDetail";
import AffiliateApplication from "./pages/seller/AffiliateApplication";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ErrorBoundary>
                <Router>
                  <div className="min-h-screen bg-white">
                    <Header />
                    <LaunchCountdown />
                    <main className="min-h-[calc(100vh-64px)] pb-16 md:pb-0">
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/category/:categoryId/products" element={<CategoryProductsPage />} />
                        <Route path="/deals" element={<DealsPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/help" element={<HelpPage />} />

                        {/* Legal Pages */}
                        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                        <Route path="/refund-policy" element={<RefundPolicyPage />} />
                        <Route path="/seller-policy" element={<SellerPolicyPage />} />
                        <Route path="/grievance-policy" element={<GrievancePolicyPage />} />
                        <Route path="/security-policy" element={<SecurityPolicyPage />} />
                        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                        <Route path="/ip-policy" element={<IPPolicyPage />} />
                        <Route path="/returns-refunds" element={<ReturnsRefundsPage />} />
                        <Route path="/shipping-info" element={<ShippingInfo />} />
                        <Route path="/orders/:orderId/track" element={<OrderTrackingPage />} />
                        <Route path="/accessibility" element={<AccessibilityPage />} />
                        <Route path="/bug-bounty" element={<BugBountyPage />} />
                        <Route path="/careers" element={<CareersPage />} />
                        <Route path="/press" element={<PressMediaPage />} />
                        <Route path="/security" element={<SecurityPage />} />
                        <Route path="/intellectual-property" element={<IPPolicyPage />} />
                        <Route
                          path="/product/:id"
                          element={<ProductDetailPage />}
                        />
                        <Route
                          path="/category/:slug"
                          element={<CategoryPage />}
                        />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route
                          path="/checkout"
                          element={<RazorpayCheckoutPage />}
                        />
                        <Route
                          path="/checkout/gokwik"
                          element={<GoKwikCheckoutPage />}
                        />
                        <Route path="/checkout/old" element={<CheckoutPage />} />
                        <Route
                          path="/checkout/mock-payment"
                          element={<MockPaymentPage />}
                        />
                        <Route
                          path="/checkout/success"
                          element={<CheckoutSuccessPage />}
                        />
                        <Route
                          path="/checkout/cancel"
                          element={<CheckoutCancelPage />}
                        />

                        <Route path="/become-seller" element={<BecomeSeller />} />
                        <Route path="/debug-user" element={<DebugUser />} />
                        {/* Auth Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route
                          path="/forgot-password"
                          element={<ForgotPasswordPage />}
                        />
                        <Route
                          path="/verify-email"
                          element={<EmailVerificationPage />}
                        />
                        {/* Dashboard Router */}
                        <Route path="/dashboard" element={<DashboardRouter />} />
                        {/* User Routes */}
                        <Route
                          path="/user/*"
                          element={
                            <ProtectedRoute
                              allowedRoles={["user", "seller", "admin"]}
                            >
                              <Routes>
                                <Route
                                  path="dashboard"
                                  element={<UserDashboard />}
                                />
                                <Route path="orders" element={<MyOrders />} />
                                <Route path="orders/:id" element={<OrderDetail />} />
                                <Route path="profile" element={<UserProfile />} />
                                <Route path="wishlist" element={<Wishlist />} />
                                <Route
                                  path="addresses"
                                  element={<UserAddressesReal />}
                                />
                                <Route
                                  path="payments"
                                  element={<UserPayments />}
                                />
                                <Route
                                  path="notifications"
                                  element={<UserNotifications />}
                                />
                                <Route
                                  path="security"
                                  element={<UserSecurity />}
                                />
                                <Route path="reviews" element={<UserReviews />} />
                              </Routes>
                            </ProtectedRoute>
                          }
                        />
                        {/* Seller Routes */}
                        <Route
                          path="/seller/payment"
                          element={
                            <ProtectedRoute allowedRoles={["user"]}>
                              <SellerPaymentFlow />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/seller/apply"
                          element={
                            <ProtectedRoute allowedRoles={["user", "seller", "admin"]}>
                              <SellerApplication />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/seller/apply-new"
                          element={
                            <ProtectedRoute allowedRoles={["user", "seller", "admin"]}>
                              <SellerApplicationNew />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/seller/payment-success"
                          element={
                            <ProtectedRoute allowedRoles={["user", "seller", "admin"]}>
                              <PaymentSuccess />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/seller/subscription-success"
                          element={
                            <ProtectedRoute allowedRoles={["user", "seller", "admin"]}>
                              <SubscriptionSuccess />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/seller/*"
                          element={
                            <ProtectedRoute allowedRoles={["seller", "admin"]}>
                              <Routes>
                                <Route
                                  path="dashboard"
                                  element={<SellerDashboardReal />}
                                />
                                <Route
                                  path="products"
                                  element={<ProductManagement />}
                                />
                                <Route
                                  path="products/add"
                                  element={<AddProduct />}
                                />
                                <Route
                                  path="products/:productId/edit"
                                  element={<EditProduct />}
                                />
                                <Route
                                  path="categories"
                                  element={<SellerCategoryManagement />}
                                />
                                <Route path="orders" element={<SellerOrdersReal />} />
                                <Route
                                  path="analytics"
                                  element={<SellerAnalytics />}
                                />
                                <Route
                                  path="affiliate/apply"
                                  element={<AffiliateApplication />}
                                />
                              </Routes>
                            </ProtectedRoute>
                          }
                        />
                        {/* Admin Routes */}
                        <Route
                          path="/admin/*"
                          element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                              <Routes>
                                <Route
                                  path="dashboard"
                                  element={<AdminDashboard />}
                                />
                                <Route
                                  path="seller-management"
                                  element={<AdminSellerManagement />}
                                />
                                <Route
                                  path="product-management"
                                  element={<AdminProductManagement />}
                                />
                                <Route
                                  path="category-management"
                                  element={<AdminCategoryManagement />}
                                />
                                <Route
                                  path="user-management"
                                  element={<AdminUserManagement />}
                                />
                                <Route path="orders" element={<AdminOrders />} />
                                <Route
                                  path="seller-applications"
                                  element={<SellerApplications />}
                                />
                                <Route
                                  path="seller-applications/:id"
                                  element={<SellerApplicationDetail />}
                                />
                              </Routes>
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/order-success"
                          element={
                            <ProtectedRoute
                              allowedRoles={["user", "seller", "admin"]}
                            >
                              <OrderSuccessPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/invoice"
                          element={
                            <ProtectedRoute
                              allowedRoles={["user", "seller", "admin"]}
                            >
                              <InvoicePage />
                            </ProtectedRoute>
                          }
                        />
                      </Routes>
                    </main>
                    <Footer />
                    <MobileBottomNav />
                    <ScrollToTop />

                    <Toaster position="top-right" />
                  </div>
                </Router>
              </ErrorBoundary>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
