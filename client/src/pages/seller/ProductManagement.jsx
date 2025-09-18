import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusCounts, setStatusCounts] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      toast.error("Please log in to access this page");
      navigate("/login");
      return;
    }

    // Check if user is a seller
    if (user && user.role !== "seller" && user.role !== "admin") {
      toast.error("You need to be a seller to access this page");
      navigate("/seller/become-seller");
      return;
    }

    fetchProducts();
  }, [statusFilter, searchTerm, isAuthenticated, user, navigate]);

  // Show loading state while checking authentication
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await api.get(`/products/seller?${params.toString()}`);
      console.log("Fetched products:", response.data.data.products);
      console.log("Status counts:", response.data.data.statusCounts);
      setProducts(response.data.data.products);
      setStatusCounts(response.data.data.statusCounts);
    } catch (error) {
      console.error("Failed to fetch products:", error);

      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        // The API interceptor should handle redirect to login
      } else {
        const errorMessage =
          error.response?.data?.error?.message || "Failed to fetch products";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatus = async (productId, newStatus) => {
    if (updatingStatus === productId) return; // Prevent multiple clicks

    try {
      setUpdatingStatus(productId);
      console.log("Updating product status:", { productId, newStatus });
      const response = await api.put(`/products/${productId}/status`, {
        status: newStatus,
      });
      console.log("Status update response:", response.data);
      toast.success("Product status updated successfully");
      fetchProducts();
    } catch (error) {
      console.error("Failed to update product status:", error);

      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to update this product.");
      } else {
        const errorMessage =
          error.response?.data?.error?.message ||
          "Failed to update product status";
        toast.error(errorMessage);
      }
    } finally {
      setUpdatingStatus(null);
    }
  };

  const deleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log("Deleting product:", productId);

      // Validate ObjectId format on frontend
      if (!productId || productId.length !== 24) {
        toast.error("Invalid product ID format");
        return;
      }

      const response = await api.delete(`/products/${productId}`);
      console.log("Delete response:", response.data);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);

      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.error?.message || "Invalid request";
        toast.error(errorMessage);
      } else if (error.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to delete this product.");
      } else if (error.response?.status === 404) {
        toast.error("Product not found. It may have already been deleted.");
        fetchProducts(); // Refresh the list
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
        console.error("Server error details:", error.response?.data);
      } else {
        const errorMessage = error.response?.data?.error?.message || "Failed to delete product";
        toast.error(errorMessage);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "draft":
        return "text-yellow-600 bg-yellow-100";
      case "inactive":
        return "text-gray-600 bg-gray-100";
      case "archived":
        return "text-red-600 bg-red-100";
      case "out_of_stock":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return CheckCircleIcon;
      case "draft":
        return ClockIcon;
      case "inactive":
        return XCircleIcon;
      case "archived":
        return TrashIcon;
      case "out_of_stock":
        return XCircleIcon;
      default:
        return ClockIcon;
    }
  };

  const getApprovalStatus = (isApproved) => {
    if (isApproved) {
      return <span className="text-green-600 text-sm">✓ Approved</span>;
    }
    return <span className="text-yellow-600 text-sm">⏳ Pending Review</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Product Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your product listings and inventory
              </p>
            </div>
            <Link
              to="/seller/products/add"
              className="inline-flex items-center px-4 py-2 bg-saffron-600 text-white font-medium rounded-lg hover:bg-saffron-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Status Filter */}
            <div className="flex space-x-2">
              {[
                {
                  key: "all",
                  label: "All Products",
                  count: Object.entries(statusCounts)
                    .filter(([status]) => status !== 'archived')
                    .reduce((sum, [, count]) => sum + count, 0),
                },
                {
                  key: "active",
                  label: "Active",
                  count: statusCounts.active || 0,
                },
                {
                  key: "draft",
                  label: "Draft",
                  count: statusCounts.draft || 0,
                },
                {
                  key: "inactive",
                  label: "Inactive",
                  count: statusCounts.inactive || 0,
                },
                {
                  key: "archived",
                  label: "Archived",
                  count: statusCounts.archived || 0,
                },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setStatusFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === filter.key
                    ? "bg-saffron-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-saffron-500 focus:border-saffron-500"
              />
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No products found</p>
              <Link
                to="/seller/products/add"
                className="inline-flex items-center px-4 py-2 bg-saffron-600 text-white font-medium rounded-lg hover:bg-saffron-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approval
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inventory
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => {
                    const StatusIcon = getStatusIcon(product.status);
                    return (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  className="h-12 w-12 rounded-lg object-cover"
                                  src={
                                    product.images[0]?.url ||
                                    (typeof product.images[0] === 'string' ? product.images[0] : null) ||
                                    "/placeholder-product.jpg"
                                  }
                                  alt={product.name}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className={`h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center ${product.images && product.images.length > 0 ? 'hidden' : ''}`}>
                                <PhotoIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.category?.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹
                          {(
                            product.price || product.basePrice
                          ).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <StatusIcon className="h-4 w-4 mr-2" />
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                product.status
                              )}`}
                            >
                              {product.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getApprovalStatus(product.isApproved)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(() => {
                            // Calculate total inventory from sizes if available
                            if (product.sizes && Array.isArray(product.sizes)) {
                              const totalStock = product.sizes.reduce((sum, size) => sum + (size.stock || 0), 0);
                              return `${totalStock} units`;
                            }
                            // Fallback to totalInventory or stockQuantity
                            return `${product.totalInventory || product.stockQuantity || 0} units`;
                          })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/product/${product._id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => navigate(`/seller/products/edit/${product._id}`)}
                              className="text-saffron-600 hover:text-saffron-900"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>

                            {/* Status Toggle - More prominent buttons */}
                            <div className="flex items-center space-x-1">
                              {product.status === "draft" && (
                                <button
                                  onClick={() =>
                                    updateProductStatus(product._id, "active")
                                  }
                                  disabled={updatingStatus === product._id}
                                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200 disabled:opacity-50"
                                  title="Activate Product"
                                >
                                  {updatingStatus === product._id ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-1"></div>
                                  ) : (
                                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                                  )}
                                  Activate
                                </button>
                              )}

                              {product.status === "active" && (
                                <button
                                  onClick={() =>
                                    updateProductStatus(product._id, "inactive")
                                  }
                                  disabled={updatingStatus === product._id}
                                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded hover:bg-yellow-200 disabled:opacity-50"
                                  title="Deactivate Product"
                                >
                                  {updatingStatus === product._id ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600 mr-1"></div>
                                  ) : (
                                    <XCircleIcon className="h-3 w-3 mr-1" />
                                  )}
                                  Deactivate
                                </button>
                              )}

                              {product.status === "inactive" && (
                                <button
                                  onClick={() =>
                                    updateProductStatus(product._id, "active")
                                  }
                                  disabled={updatingStatus === product._id}
                                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200 disabled:opacity-50"
                                  title="Activate Product"
                                >
                                  {updatingStatus === product._id ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-1"></div>
                                  ) : (
                                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                                  )}
                                  Activate
                                </button>
                              )}
                            </div>

                            <button
                              onClick={() => deleteProduct(product._id, product.name)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Product"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
