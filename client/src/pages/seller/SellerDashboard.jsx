import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import {
  ShoppingBagIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  EyeIcon,
  PlusIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const SellerDashboard = () => {
  const { user, refreshUserData } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [hasSellerAccess, setHasSellerAccess] = useState(false);
  const [accessError, setAccessError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setAccessError(null);

      await Promise.all([
        fetchSellerStats(),
        fetchSalesData(),
        fetchRecentOrders(),
        fetchLowStockProducts(),
      ]);

      setHasSellerAccess(true);
    } catch (error) {
      console.error("Failed to fetch seller dashboard data:", error);

      if (error.response?.status === 403) {
        setHasSellerAccess(false);
        setAccessError(error.response.data.error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickApprove = async () => {
    try {
      const response = await api.post("/seller/dev/quick-approve");
      if (response.data.success) {
        // Refresh user data and retry fetching dashboard data
        await refreshUserData();
        await fetchDashboardData();
      }
    } catch (error) {
      console.error("Failed to quick approve seller:", error);
    }
  };

  const fetchSellerStats = async () => {
    try {
      const response = await api.get(
        `/seller/dashboard/stats?period=${selectedPeriod}`
      );
      const data = response.data.data;

      setStats([
        {
          name: "Total Revenue",
          value: `₹${(data.totalRevenue || 0).toLocaleString()}`,
          change: data.revenueChange || "+0%",
          changeType: data.revenueChange?.startsWith("+")
            ? "increase"
            : "decrease",
          icon: CurrencyRupeeIcon,
          color: "bg-green-500",
        },
        {
          name: "Total Orders",
          value: (data.totalOrders || 0).toString(),
          change: data.ordersChange || "+0%",
          changeType: data.ordersChange?.startsWith("+")
            ? "increase"
            : "decrease",
          icon: ShoppingBagIcon,
          color: "bg-blue-500",
        },
        {
          name: "Products Listed",
          value: (data.productsListed || 0).toString(),
          change: data.productsChange || "+0",
          changeType: data.productsChange?.startsWith("+")
            ? "increase"
            : "decrease",
          icon: EyeIcon,
          color: "bg-saffron-500",
        },
        {
          name: "Avg. Rating",
          value: (data.averageRating || 0).toFixed(1),
          change: data.ratingChange || "+0",
          changeType: data.ratingChange?.startsWith("+")
            ? "increase"
            : "decrease",
          icon: ChartBarIcon,
          color: "bg-purple-500",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch seller stats:", error);

      // Check if it's a 403 error (access denied)
      if (error.response?.status === 403) {
        // User doesn't have seller access
        throw error;
      }

      // Set default stats on other errors
      setStats([
        {
          name: "Total Revenue",
          value: "₹0",
          change: "+0%",
          changeType: "increase",
          icon: CurrencyRupeeIcon,
          color: "bg-green-500",
        },
        {
          name: "Total Orders",
          value: "0",
          change: "+0%",
          changeType: "increase",
          icon: ShoppingBagIcon,
          color: "bg-blue-500",
        },
        {
          name: "Products Listed",
          value: "0",
          change: "+0",
          changeType: "increase",
          icon: EyeIcon,
          color: "bg-saffron-500",
        },
        {
          name: "Avg. Rating",
          value: "0.0",
          change: "+0",
          changeType: "increase",
          icon: ChartBarIcon,
          color: "bg-purple-500",
        },
      ]);
    }
  };

  const fetchSalesData = async () => {
    try {
      const response = await api.get(
        `/seller/dashboard/sales?period=${selectedPeriod}`
      );
      setSalesData(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch sales data:", error);
      setSalesData([]);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await api.get("/seller/orders/recent?limit=5");
      setRecentOrders(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch recent orders:", error);
      setRecentOrders([]);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const response = await api.get("/seller/products/low-stock?threshold=5");
      setLowStockProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch low stock products:", error);
      setLowStockProducts([]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-600 bg-green-100";
      case "Shipped":
        return "text-blue-600 bg-blue-100";
      case "Processing":
        return "text-saffron-600 bg-saffron-100";
      case "Cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Show access denied message if user doesn't have seller access
  if (!loading && !hasSellerAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-16 w-16 text-saffron-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Seller Access Required
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {accessError ||
                "You need to become a seller to access this dashboard."}
            </p>

            <div className="space-y-4">
              <Link
                to="/seller/apply"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-saffron-500 to-green-500 text-white font-semibold rounded-lg hover:from-saffron-600 hover:to-green-600 transition-all duration-200"
              >
                Apply to Become a Seller
              </Link>

              {/* Development quick approve button */}
              {import.meta.env.DEV && (
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700 mb-2">
                    Development Mode: Quick approve for testing
                  </p>
                  <button
                    onClick={handleQuickApprove}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
                  >
                    Quick Approve as Seller
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your store, track sales, and grow your business
          </p>
        </div>

        {/* Getting Started Guide */}
        <div className="bg-gradient-to-r from-saffron-500 to-orange-500 rounded-lg p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-4">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <span className="text-lg font-bold">1</span>
              </div>
              <div>
                <p className="font-semibold">Create Categories</p>
                <p className="text-sm opacity-90">Organize your products</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <span className="text-lg font-bold">2</span>
              </div>
              <div>
                <p className="font-semibold">Add Products</p>
                <p className="text-sm opacity-90">List items for sale</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <span className="text-lg font-bold">3</span>
              </div>
              <div>
                <p className="font-semibold">Manage Orders</p>
                <p className="text-sm opacity-90">Process customer orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/seller/categories"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-indigo-500"
          >
            <div className="flex items-center">
              <TruckIcon className="h-8 w-8 text-indigo-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Categories
                </h3>
                <p className="text-gray-600 text-sm">
                  Create & organize categories
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/seller/products/add"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-saffron-500"
          >
            <div className="flex items-center">
              <PlusIcon className="h-8 w-8 text-saffron-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Product
                </h3>
                <p className="text-gray-600 text-sm">List new products</p>
              </div>
            </div>
          </Link>

          <Link
            to="/seller/products"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500"
          >
            <div className="flex items-center">
              <EyeIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  My Products
                </h3>
                <p className="text-gray-600 text-sm">View & edit listings</p>
              </div>
            </div>
          </Link>

          <Link
            to="/seller/orders"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
          >
            <div className="flex items-center">
              <ShoppingBagIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Orders
                </h3>
                <p className="text-gray-600 text-sm">Process & track orders</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading
            ? // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white overflow-hidden shadow-md rounded-lg animate-pulse"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-gray-300 p-3 rounded-md w-12 h-12"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="flex items-baseline">
                          <div className="h-8 bg-gray-300 rounded w-20"></div>
                          <div className="h-4 bg-gray-300 rounded w-12 ml-2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : stats.map((stat) => (
                <div
                  key={stat.name}
                  className="bg-white overflow-hidden shadow-md rounded-lg"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 ${stat.color} p-3 rounded-md`}
                      >
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">
                          {stat.name}
                        </p>
                        <div className="flex items-baseline">
                          <p className="text-2xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                          <span
                            className={`ml-2 text-sm font-medium ${
                              stat.changeType === "increase"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {stat.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Sales Overview
              </h3>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-saffron-500 focus:border-saffron-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-600"></div>
                </div>
              ) : salesData.length > 0 ? (
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#f59332"
                    strokeWidth={2}
                  />
                </LineChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No sales data available
                </div>
              )}
            </ResponsiveContainer>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Low Stock Alert
            </h3>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse"
                  >
                    <div>
                      <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-6 bg-gray-300 rounded w-8 mb-1"></div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                ))
              ) : lowStockProducts.length > 0 ? (
                <>
                  {lowStockProducts.map((product, index) => (
                    <div
                      key={product._id || index}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          SKU: {product.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">
                          {product.stock || product.quantity}
                        </p>
                        <p className="text-xs text-gray-500">units left</p>
                      </div>
                    </div>
                  ))}
                  <Link
                    to="/seller/products"
                    className="block text-center text-sm font-medium text-saffron-600 hover:text-saffron-700 mt-4"
                  >
                    Manage Inventory →
                  </Link>
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-500">All products well stocked!</p>
                  <p className="text-sm text-gray-400 mt-1">
                    No low stock alerts
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
              <Link
                to="/seller/orders"
                className="text-saffron-600 hover:text-saffron-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="px-6 py-4 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-24"></div>
                      </div>
                      <div>
                        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order._id || order.id}
                  className="px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          #{order.orderNumber || order._id?.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customer?.firstName && order.customer?.lastName
                            ? `${order.customer.firstName} ${order.customer.lastName}`
                            : order.customerName || "Customer"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">
                          {order.items?.[0]?.product?.name ||
                            order.productName ||
                            "Product"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            order.createdAt || order.date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <p className="text-lg font-semibold text-gray-900">
                        ₹
                        {(
                          order.totalAmount ||
                          order.amount ||
                          0
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No orders yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Orders will appear here once customers start buying
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
