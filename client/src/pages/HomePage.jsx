import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  StarIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  FireIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import api from "../services/api";
import toast from "react-hot-toast";
import WishlistButton from "../components/WishlistButton";
import ProductCard from "../components/ProductCard";


const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(new Set());

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      // Fetch featured products
      const productsResponse = await api.get(
        "/products?limit=6&sort=createdAt&order=desc"
      );
      setFeaturedProducts(productsResponse.data.data.products);

      // Fetch latest categories created by admin only
      const categoriesResponse = await api.get("/categories/admin-main");
      setCategories(categoriesResponse.data.data.categories.slice(0, 8));

      // Fetch deals (products with discounts)
      const dealsResponse = await api.get(
        "/products?limit=4&sort=discountPercentage&order=desc"
      );
      const dealsData = dealsResponse.data.data.products.filter(
        (product) =>
          product.discountedPrice &&
          product.discountedPrice < (product.price || product.basePrice)
      );
      setDeals(dealsData);
    } catch (error) {
      console.error("Failed to fetch home data:", error);
      toast.error("Failed to load homepage data");
    } finally {
      setLoading(false);
    }
  };





  const defaultCategoryImages = {
    'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    'fashion': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    'home': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    'books': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    'sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    'beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
    'automotive': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop',
    'default': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop'
  };

  const getCategoryImage = (category) => {
    // First priority: Admin uploaded image
    if (category.image?.url) return category.image.url;
    
    // Fallback to default images only if no admin image
    const categoryKey = category.name.toLowerCase();
    return defaultCategoryImages[categoryKey] || defaultCategoryImages.default;
  };

  const CategoryCard = ({ category }) => (
    <Link to={`/category/${category._id}/products`} className="group cursor-pointer">
      <div className="bg-white rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
        <div className="relative h-24 sm:h-32 overflow-hidden">
          <img 
            src={getCategoryImage(category)}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = defaultCategoryImages.default;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-2 sm:p-4 text-center">
          <h3 className="font-semibold text-xs sm:text-sm text-gray-900 mb-1 group-hover:text-saffron-600 transition-colors">{category.name}</h3>
          <p className="text-xs text-gray-600 line-clamp-2 hidden sm:block">
            {category.description || "Explore our collection"}
          </p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-saffron-500 via-saffron-400 to-green-500 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
            alt="Shopping Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-saffron-500/80 via-saffron-400/80 to-green-500/80"></div>
        </div>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Welcome to{" "}
              <span className="text-white drop-shadow-lg">VCX MART</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-white/90 max-w-3xl mx-auto px-2">
              Your premier destination for quality products, exceptional service, and unbeatable prices. Experience the future of online shopping.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link
                to="/products"
                className="bg-white text-saffron-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg inline-flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <span>Shop Now</span>
                <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-white hover:text-saffron-600 transition-colors duration-200 inline-flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <span>Learn More</span>
                <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden hidden sm:block">
          <div className="absolute top-10 left-10 w-12 sm:w-20 h-12 sm:h-20 bg-white opacity-20 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-10 sm:w-16 h-10 sm:h-16 bg-green-300 opacity-30 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-8 sm:w-12 h-8 sm:h-12 bg-white opacity-20 rounded-full animate-pulse"></div>
        </div>
      </section>



      {/* Shop by Category Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <TagIcon className="h-6 w-6 sm:h-8 sm:w-8 text-saffron-500 mr-2" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Shop by Category</h2>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Explore our wide range of product categories
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl h-24 sm:h-32"></div>
                  <div className="p-2 sm:p-4">
                    <div className="bg-gray-200 h-3 sm:h-4 rounded mb-1 sm:mb-2"></div>
                    <div className="bg-gray-200 h-2 sm:h-3 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {categories.slice(0, 8).map((category, index) => (
                <div
                  key={category._id}
                  className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No categories available</p>
            </div>
          )}

          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/categories"
              className="bg-saffron-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-saffron-700 transition-colors duration-200 shadow-md inline-flex items-center space-x-2 text-sm sm:text-base"
            >
              <span>View All Categories</span>
              <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-saffron-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <TruckIcon className="h-6 w-6 sm:h-8 sm:w-8 text-saffron-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                Free Shipping
              </h3>
              <p className="text-sm sm:text-base text-gray-600">Free shipping on all orders</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <ShieldCheckIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                Secure Payment
              </h3>
              <p className="text-sm sm:text-base text-gray-600">100% secure payment processing</p>
            </div>
            <div className="text-center">
              <div className="bg-saffron-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CurrencyDollarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-saffron-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                Best Prices
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Competitive prices with great deals
              </p>
            </div>
          </div>
        </div>
      </section>





      {/* Hot Deals Section */}
      {deals.length > 0 && (
        <section className="py-8 sm:py-12 lg:py-16 bg-red-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <FireIcon className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mr-2" />
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Hot Deals</h2>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Don't miss out on these amazing limited-time offers
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {deals.map((product, index) => (
                <div
                  key={product._id}
                  className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    product={product}
                    showDiscount={true}
                    variant="homepage"
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <Link
                to="/deals"
                className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                <FireIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>View All Deals</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-saffron-50 to-green-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <SparklesIcon className="h-6 w-6 sm:h-8 sm:w-8 text-saffron-500 mr-2" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Featured Products
              </h2>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Discover our most popular and trending products
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-gray-200 h-32 sm:h-40 lg:h-48"></div>
                    <div className="p-2 sm:p-4">
                      <div className="bg-gray-200 h-3 sm:h-4 rounded mb-1 sm:mb-2"></div>
                      <div className="bg-gray-200 h-4 sm:h-6 rounded mb-1 sm:mb-2"></div>
                      <div className="bg-gray-200 h-3 sm:h-4 rounded mb-2 sm:mb-4"></div>
                      <div className="bg-gray-200 h-8 sm:h-10 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
              {featuredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} variant="homepage" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <SparklesIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No featured products available</p>
            </div>
          )}

          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/products"
              className="bg-white text-saffron-600 border-2 border-saffron-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-saffron-600 hover:text-white transition-colors duration-200 shadow-md inline-flex items-center space-x-2 text-sm sm:text-base"
            >
              <span>View All Products</span>
              <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-saffron-600 to-green-600">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
            Stay Updated with Our Latest Offers
          </h2>
          <p className="text-sm sm:text-lg lg:text-xl text-saffron-100 mb-6 sm:mb-8 px-4">
            Subscribe to our newsletter and never miss a deal
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto px-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-saffron-600 text-sm sm:text-base"
            />
            <button className="bg-white text-saffron-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
