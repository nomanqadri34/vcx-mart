import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TagIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon,
  StarIcon,
  HeartIcon,

} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import api from "../services/api";
import toast from "react-hot-toast";

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [featuredDeals, setFeaturedDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      // Fetch products with discounts
      const response = await api.get(
        "/products?sort=discountPercentage&order=desc"
      );
      const products = response.data.data.products;

      // Filter products with discounts
      const discountedProducts = products.filter(
        (product) =>
          product.discountedPrice &&
          product.discountedPrice < (product.price || product.basePrice)
      );

      setDeals(discountedProducts);
      setFeaturedDeals(discountedProducts.slice(0, 3));
    } catch (error) {
      console.error("Failed to fetch deals:", error);
      toast.error("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (originalPrice, discountedPrice) => {
    if (!discountedPrice || discountedPrice >= originalPrice) return 0;
    return Math.round(
      ((originalPrice - discountedPrice) / originalPrice) * 100
    );
  };

  const DealCard = ({ product, featured = false }) => {
    const originalPrice = product.price || product.basePrice;
    const discountPercentage = calculateDiscount(
      originalPrice,
      product.discountedPrice
    );

    return (
      <div
        className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group ${
          featured ? "border-2 border-red-200" : ""
        }`}
      >
        <div className="relative">
          <Link to={`/product/${product._id}`}>
            <img
              src={product.images?.[0]?.url || "/placeholder-product.jpg"}
              alt={product.name}
              className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                featured ? "h-64" : "h-48"
              }`}
            />
          </Link>

          {/* Deal Badge */}
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
            <FireIcon className="h-4 w-4 mr-1" />
            {discountPercentage}% OFF
          </div>

          {/* Wishlist Button */}
          <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
            <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
          </button>

          {featured && (
            <div className="absolute top-2 right-12 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
              <SparklesIcon className="h-3 w-3 mr-1" />
              FEATURED
            </div>
          )}
        </div>

        <div className={`p-4 ${featured ? "p-6" : ""}`}>
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
            <h3
              className={`font-medium text-gray-900 hover:text-saffron-600 transition-colors line-clamp-2 ${
                featured ? "text-lg mb-3" : "text-sm mb-2"
              }`}
            >
              {product.name}
            </h3>
          </Link>

          {featured && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span
                className={`font-bold text-red-600 ${
                  featured ? "text-xl" : "text-lg"
                }`}
              >
                ₹{product.discountedPrice?.toLocaleString()}
              </span>
              <span
                className={`text-gray-500 line-through ${
                  featured ? "text-base" : "text-sm"
                }`}
              >
                ₹{originalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>Limited time offer</span>
            </div>

          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: "all", name: "All Deals", icon: TagIcon },
    { id: "electronics", name: "Electronics", icon: SparklesIcon },
    { id: "fashion", name: "Fashion", icon: HeartIcon },
    { id: "home", name: "Home & Garden", icon: FireIcon },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Background */}
        <div className="relative bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-3xl p-12 mb-12 text-center text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
              alt="Deals Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <FireIcon className="h-16 w-16 text-white mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">
                Hot Deals & Offers
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto mb-8">
              Discover incredible savings on premium products. Limited time offers you can't afford to miss!
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm font-medium">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                <span>Live Deals</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deal Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FireIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{deals.length}</h3>
            <p className="text-gray-600 font-medium">Active Deals</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TagIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">Up to 70%</h3>
            <p className="text-gray-600 font-medium">Maximum Savings</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">24 Hours</h3>
            <p className="text-gray-600 font-medium">Time Left</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">Premium</h3>
            <p className="text-gray-600 font-medium">Quality Products</p>
          </div>
        </div>

        {/* Featured Deals */}
        {featuredDeals.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <SparklesIcon className="h-6 w-6 text-yellow-500 mr-2" />
              Featured Deals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDeals.map((product) => (
                <DealCard key={product._id} product={product} featured={true} />
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-red-500 text-red-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* All Deals */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <TagIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No deals available
            </h3>
            <p className="text-gray-600 mb-6">
              Check back later for amazing deals and offers!
            </p>
            <Link
              to="/products"
              className="bg-saffron-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-saffron-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {deals.map((product) => (
              <DealCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-20 relative">
          <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-3xl p-12 text-center text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
                alt="Newsletter Background"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Never Miss a Deal!
              </h2>
              <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                Join thousands of smart shoppers and be the first to know about exclusive deals, flash sales, and special offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600 text-gray-900 text-lg"
                />
                <button className="bg-white text-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg whitespace-nowrap">
                  Get Deals
                </button>
              </div>
              <p className="text-sm text-red-200 mt-4">
                ✨ Exclusive deals • 📧 Weekly updates • 🚫 No spam, unsubscribe anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
