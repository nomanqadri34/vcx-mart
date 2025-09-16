import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  UsersIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  CurrencyRupeeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  TagIcon
} from "@heroicons/react/24/outline";
import {
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis
} from "recharts";

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAdminStats(),
        fetchSalesData(),
        fetchCategoryData(),
        fetchPendingActions(),
        fetchRecentActivities(),
      ]);
    } catch (error) {
      console.error("Failed to fetch admin dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const response = await api.get(
        `/admin/dashboard/stats?period=${selectedPeriod}`
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
          value: (data.totalOrders || 0).toLocaleString(),
          change: data.ordersChange || "+0%",
          changeType: data.ordersChange?.startsWith("+")
            ? "increase"
            : "decrease",
          icon: ShoppingBagIcon,
          color: "bg-blue-500",
        },
        {
          name: "Active Sellers",
          value: (data.activeSellers || 0).toLocaleString(),
          change: data.sellersChange || "+0%",
          changeType: data.sellersChange?.startsWith("+")
            ? "increase"
            : "decrease",
          icon: BuildingStorefrontIcon,
          color: "bg-saffron-500",
        },
        {
          name: "Total Users",
          value: (data.totalUsers || 0).toLocaleString(),
          change: data.usersChange || "+0%",
          changeType: data.usersChange?.startsWith("+")
            ? "increase"
            : "decrease",
          icon: UsersIcon,
          color: "bg-purple-500",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      // Set default stats on error
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
          name: "Active Sellers",
          value: "0",
          change: "+0%",
          changeType: "increase",
          icon: BuildingStorefrontIcon,
          color: "bg-saffron-500",
        },
        {
          name: "Total Users",
          value: "0",
          change: "+0%",
          changeType: "increase",
          icon: UsersIcon,
          color: "bg-purple-500",
        },
      ]);
    }
  };

  const fetchSalesData = async () => {
    try {
      const response = await api.get(
        `/admin/dashboard/sales?period=${selectedPeriod}`
      );
      setSalesData(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch sales data:", error);
      setSalesData([]);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const response = await api.get("/admin/dashboard/categories");
      const data = response.data.data || [];
      const colors = [
        "#f59332",
        "#22c55e",
        "#3b82f6",
        "#8b5cf6",
        "#ef4444",
        "#06b6d4",
        "#f97316",
      ];

      setCategoryData(
        data.map((item, index) => ({
          name: item.name,
          value: item.percentage,
          color: colors[index % colors.length],
        }))
      );
    } catch (error) {
      console.error("Failed to fetch category data:", error);
      setCategoryData([]);
    }
  };

  const fetchPendingActions = async () => {
    try {
      const response = await api.get("/admin/dashboard/pending-actions");
      setPendingActions(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch pending actions:", error);
      setPendingActions([]);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await api.get("/admin/dashboard/activities?limit=5");
      setRecentActivities(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch recent activities:", error);
      setRecentActivities([]);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-saffron-600 bg-saffron-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-saffron-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your marketplace, monitor performance, and handle operations
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/seller-management"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-saffron-500"
          >
            <div className="flex items-center">
              <BuildingStorefrontIcon className="h-8 w-8 text-saffron-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Seller Management
                </h3>
                <p className="text-gray-600 text-sm">
                  Review applications & manage sellers
                </p>
              </div>
            </div>
          </Link>



          <Link
            to="/admin/orders"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500"
          >
            <div className="flex items-center">
              <ShoppingBagIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Management
                </h3>
                <p className="text-gray-600 text-sm">
                  Handle disputes & refunds
                </p>
              </div>
            </div>
          </Link>



          <Link
            to="/admin/user-management"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-indigo-500"
          >
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-indigo-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  User Management
                </h3>
                <p className="text-gray-600 text-sm">
                  Manage accounts & roles
                </p>
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

          {/* Category Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sales by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-600"></div>
                </div>
              ) : categoryData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No category data available
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Actions & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Actions */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Pending Actions
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="px-6 py-4 animate-pulse">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 rounded"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="h-4 bg-gray-300 rounded w-32"></div>
                          <div className="h-5 bg-gray-300 rounded-full w-16"></div>
                        </div>
                        <div className="h-3 bg-gray-300 rounded w-48 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : pendingActions.length > 0 ? (
                pendingActions.map((action) => {
                  const IconComponent = action.icon || ExclamationTriangleIcon;
                  return (
                    <div
                      key={action._id || action.id}
                      className="px-6 py-4 hover:bg-gray-50"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <IconComponent className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {action.title}
                            </p>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                                action.priority
                              )}`}
                            >
                              {action.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {action.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {action.time ||
                              new Date(action.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-8 text-center">
                  <CheckCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pending actions</p>
                  <p className="text-sm text-gray-400 mt-1">All caught up!</p>
                </div>
              )}
            </div>
            <div className="px-6 py-3 border-t border-gray-200">
              <Link
                to="/admin/pending"
                className="text-sm font-medium text-saffron-600 hover:text-saffron-700"
              >
                View all pending actions →
              </Link>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activities
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="px-6 py-4 animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-64 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={activity._id || index} className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.status === "success"
                            ? "bg-green-500"
                            : activity.status === "warning"
                            ? "bg-saffron-500"
                            : activity.status === "info"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span
                            className={`font-medium ${getStatusColor(
                              activity.status
                            )}`}
                          >
                            {activity.action}
                          </span>{" "}
                          for {activity.user || activity.target}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time ||
                            new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center">
                  <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activities</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Activities will appear here
                  </p>
                </div>
              )}
            </div>
            <div className="px-6 py-3 border-t border-gray-200">
              <Link
                to="/admin/activities"
                className="text-sm font-medium text-saffron-600 hover:text-saffron-700"
              >
                View all activities →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
