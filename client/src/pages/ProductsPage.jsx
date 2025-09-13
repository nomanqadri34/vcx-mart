import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import api from "../services/api";
import toast from "react-hot-toast";
import WishlistButton from "../components/WishlistButton";
import ProductCard from "../components/ProductCard";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "createdAt",
    order: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Set initial category filter from URL params
    const categoryFromUrl = searchParams.get('category');
    console.log('Category from URL:', categoryFromUrl);
    if (categoryFromUrl && categoryFromUrl !== filters.category) {
      console.log('Setting category filter to:', categoryFromUrl);
      setFilters(prev => ({ ...prev, category: categoryFromUrl }));
    } else {
      fetchProducts();
    }
    fetchCategories();
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.category) params.append("category", filters.category);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      params.append("sort", filters.sort);
      params.append("order", filters.order);

      console.log('Fetching products with params:', params.toString());
      console.log('Current filters:', filters);
      
      const response = await api.get(`/products?${params.toString()}`);
      console.log('Products response:', response.data.data.products.length, 'products');
      setProducts(response.data.data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "createdAt",
      order: "desc",
    });
  };



  const ProductListItem = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="flex">
        <div className="relative w-48 h-32">
          <Link to={`/product/${product._id}`}>
            <img
              src={
                product.images?.[0]?.url ||
                (typeof product.images?.[0] === 'string' ? product.images[0] : null) ||
                "/placeholder-product.jpg"
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </Link>
          {product.discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              -{product.discountPercentage}%
            </div>
          )}
        </div>

        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  {product.category?.name}
                </span>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600 ml-1">4.5</span>
                </div>
              </div>

              <Link to={`/product/${product._id}`}>
                <h3 className="text-lg font-medium text-gray-900 hover:text-saffron-600 transition-colors mb-2">
                  {product.name}
                </h3>
              </Link>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{(product.price || product.basePrice).toLocaleString()}
                  </span>
                  {product.discountedPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.discountedPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <WishlistButton 
                    product={product} 
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                  />

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-gray-600">
            Discover amazing products from our marketplace
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Mobile Filters Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
            >
              <span className="font-medium text-gray-900">Filters</span>
              <FunnelIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 lg:sticky lg:top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base lg:text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-saffron-600 hover:text-saffron-700"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-4 lg:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4 lg:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-4 lg:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={`${filters.sort}-${filters.order}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split("-");
                    handleFilterChange("sort", sort);
                    handleFilterChange("order", order);
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-3">
              <p className="text-sm lg:text-base text-gray-600">
                {loading ? "Loading..." : `${products.length} products found`}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md ${viewMode === "grid"
                    ? "bg-saffron-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Squares2X2Icon className="h-4 w-4 lg:h-5 lg:w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md ${viewMode === "list"
                    ? "bg-saffron-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <ListBulletIcon className="h-4 w-4 lg:h-5 lg:w-5" />
                </button>
              </div>
            </div>

            {/* Products Display */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Squares2X2Icon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6"
                    : "space-y-3 lg:space-y-4"
                }
              >
                {products.map((product, index) =>
                  viewMode === "grid" ? (
                    <div
                      key={product._id}
                      className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} showDiscount={true} />
                    </div>
                  ) : (
                    <div
                      key={product._id}
                      className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductListItem product={product} />
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
