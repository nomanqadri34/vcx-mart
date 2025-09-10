import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  StarIcon,
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
} from "@heroicons/react/24/solid";
import { productAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import toast from "react-hot-toast";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchRelatedProducts();
      fetchReviews();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProduct(id);
      const productData = response.data.data.product;
      setProduct(productData);

      // Initialize variants if they exist
      const initialVariants = {};

      // Handle sizes
      if (
        productData.sizes &&
        productData.sizes.length > 0
      ) {
        const availableSize = productData.sizes.find(
          (s) => s.stock > 0
        );
        if (availableSize) {
          initialVariants.size = availableSize.size;
        }
      }

      // Handle colors
      if (
        productData.colors &&
        productData.colors.length > 0
      ) {
        initialVariants.color = productData.colors[0];
      }

      // Handle legacy variants
      if (productData.variants) {
        Object.keys(productData.variants).forEach((key) => {
          const options = productData.variants[key];
          if (options.length > 0) {
            initialVariants[key] = options[0];
          }
        });
      }

      setSelectedVariants(initialVariants);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      toast.error("Failed to load product details");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await productAPI.getRelatedProducts(id);
      setRelatedProducts(response.data.data.products || []);
    } catch (error) {
      console.error("Failed to fetch related products:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await productAPI.getProductReviews(id, { limit: 10 });
      setReviews(response.data.data.reviews || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleImageNavigation = (direction) => {
    if (!product?.images?.length) return;

    if (direction === "next") {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleVariantChange = (variantType, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantType]: value,
    }));
  };

  const calculateDiscount = () => {
    const originalPrice = product?.originalPrice || product?.price;
    const currentPrice = product?.discountedPrice || product?.price;

    if (!originalPrice || !currentPrice || originalPrice <= currentPrice)
      return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const getMaxQuantity = () => {
    if (!product) return 0;

    // Check if size variant is selected and has stock
    if (selectedVariants.size && product.sizes && Array.isArray(product.sizes)) {
      const selectedSizeObj = product.sizes.find(
        (s) => s.size === selectedVariants.size
      );
      if (selectedSizeObj && typeof selectedSizeObj.stock === 'number') {
        return Math.max(0, selectedSizeObj.stock);
      }
    }

    // Fallback to general stock - check multiple possible field names
    const stock = product.stockQuantity || product.totalInventory || product.inStock || product.stock || 999;
    if (typeof stock === 'number') {
      return Math.max(0, stock);
    }

    // Default fallback
    return 999;
  };

  // Helper function to get product inventory
  const getProductInventory = () => {
    if (!product) return 0;

    // Check size-specific inventory first
    if (selectedVariants.size && product.sizes && Array.isArray(product.sizes)) {
      const selectedSizeObj = product.sizes.find(
        (s) => s.size === selectedVariants.size
      );
      if (selectedSizeObj && typeof selectedSizeObj.stock === 'number') {
        return selectedSizeObj.stock;
      }
    }

    // Check general inventory fields
    return product.stockQuantity || product.totalInventory || product.inStock || product.stock || 999;
  };

  const toggleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (!selectedVariants.size && product.sizes && product.sizes.length > 0) {
      toast.error("Please select a size");
      return;
    }

    try {
      const success = await addToCart(id, quantity, selectedVariants);
      if (success) {
        // Show success toast with action to view cart
        toast.success(
          (t) => (
            <div className="flex items-center space-x-3">
              <span>Added to cart successfully!</span>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate('/cart');
                }}
                className="bg-saffron-600 text-white px-3 py-1 rounded text-sm hover:bg-saffron-700"
              >
                View Cart
              </button>
            </div>
          ),
          { duration: 4000 }
        );
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error('Error in handleAddToCart:', error);
      toast.error("Failed to add to cart: " + error.message);
    }
  };

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded-lg h-96"></div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded"></div>
                <div className="bg-gray-200 h-6 rounded w-3/4"></div>
                <div className="bg-gray-200 h-10 rounded w-1/2"></div>
                <div className="bg-gray-200 h-32 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <Link
            to="/products"
            className="text-saffron-600 hover:text-saffron-700 font-medium"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice =
    product.discountedPrice || product.price || product.basePrice;
  const originalPrice =
    product.originalPrice || product.price || product.basePrice;
  const discountPercentage = calculateDiscount();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm overflow-x-auto scrollbar-hide">
            <Link to="/" className="text-gray-500 hover:text-gray-700 whitespace-nowrap">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="text-gray-500 hover:text-gray-700 whitespace-nowrap">
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              to={`/category/${product.category?.slug}`}
              className="text-gray-500 hover:text-gray-700 whitespace-nowrap"
            >
              {product.category?.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-3 lg:space-y-4">
            <div className="relative bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src={
                  product.images?.[currentImageIndex]?.url ||
                  (typeof product.images?.[currentImageIndex] === 'string' ? product.images[currentImageIndex] : null) ||
                  product.images?.[0]?.url ||
                  (typeof product.images?.[0] === 'string' ? product.images[0] : null) ||
                  "/placeholder-product.jpg"
                }
                alt={product.name}
                className="w-full h-80 sm:h-96 lg:h-[500px] object-cover cursor-pointer"
                onClick={() => setShowImageModal(true)}
              />

              {/* Image Navigation */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation("prev")}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md"
                  >
                    <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleImageNavigation("next")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md"
                  >
                    <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </>
              )}

              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discountPercentage}% OFF
                </div>
              )}

              {/* Wishlist & Share */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={toggleWishlist}
                  className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md"
                >
                  {isInWishlist(product._id) ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={shareProduct}
                  className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md"
                >
                  <ShareIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images?.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentImageIndex === index
                      ? "border-saffron-500 ring-2 ring-saffron-200"
                      : "border-gray-200 hover:border-saffron-300"
                      }`}
                  >
                    <img
                      src={
                        image.url ||
                        (typeof image === 'string' ? image : null) ||
                        "/placeholder-product.jpg"
                      }
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4 lg:space-y-6">
            {/* Product Title & Rating */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <span className="text-sm text-saffron-600 font-medium uppercase tracking-wide">
                  {product.category?.name}
                </span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.averageRating || 4.5)
                        ? "text-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                ₹{currentPrice.toLocaleString()}
              </span>
              {originalPrice > currentPrice && (
                <span className="text-base sm:text-lg text-gray-500 line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Save ₹{(originalPrice - currentPrice).toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {getProductInventory() > 0 ? (
                <>
                  <CheckIcon className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 font-medium">In Stock</span>
                  <span className="text-gray-500">
                    ({getProductInventory()} available)
                  </span>
                </>
              ) : (
                <>
                  <XMarkIcon className="h-5 w-5 text-red-500" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Product Variants - Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                    {product.sizes.map((sizeObj) => (
                      <button
                        key={sizeObj.size}
                        onClick={() =>
                          handleVariantChange("size", sizeObj.size)
                        }
                        disabled={sizeObj.stock === 0}
                        className={`px-3 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${selectedVariants.size === sizeObj.size
                          ? "border-saffron-500 bg-saffron-50 text-saffron-700 ring-2 ring-saffron-200"
                          : sizeObj.stock === 0
                            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                            : "border-gray-300 bg-white text-gray-700 hover:border-saffron-300 hover:bg-saffron-50"
                          }`}
                      >
                        <div className="text-center">
                          <div>{sizeObj.size}</div>
                          {sizeObj.stock === 0 && (
                            <div className="text-xs text-red-400 mt-1">Out</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Product Variants - Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleVariantChange("color", color)}
                        className={`px-3 py-2 border rounded-lg text-sm font-medium transition-all duration-200 text-center ${selectedVariants.color === color
                          ? "border-saffron-500 bg-saffron-50 text-saffron-700 ring-2 ring-saffron-200"
                          : "border-gray-300 bg-white text-gray-700 hover:border-saffron-300 hover:bg-saffron-50"
                          }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= getMaxQuantity()}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Max: {getMaxQuantity()}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || getProductInventory() <= 0}
                className="w-full bg-saffron-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-saffron-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {cartLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Adding to Cart...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {getProductInventory() <= 0 ? (
                <p className="text-red-600 text-sm text-center">Out of Stock</p>
              ) : (
                <p className="text-green-600 text-sm text-center">
                  {getProductInventory()} items available
                </p>
              )}
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <TruckIcon className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Free Delivery
                  </p>
                  <p className="text-xs text-gray-600">On all orders</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Secure Payment
                  </p>
                  <p className="text-xs text-gray-600">
                    100% secure payment processing
                  </p>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            {product.seller && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Sold by
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-saffron-100 rounded-full flex items-center justify-center">
                    <span className="text-saffron-600 font-medium">
                      {product.seller.businessName?.[0] ||
                        product.seller.firstName?.[0] ||
                        product.seller.name?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {product.seller.businessName ||
                        `${product.seller.firstName} ${product.seller.lastName}` ||
                        product.seller.name}
                    </p>
                    <div className="flex items-center space-x-1">
                      <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {product.seller.rating || 4.5} (
                        {product.seller.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 border-b-0">
            <nav className="flex space-x-0 overflow-x-auto">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-0 py-4 px-6 text-center font-semibold text-sm capitalize transition-all duration-200 border-b-3 ${activeTab === tab
                    ? "border-saffron-500 text-saffron-600 bg-gradient-to-t from-saffron-50 to-white"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>{tab}</span>
                    {tab === "reviews" && (
                      <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                        {reviews.length}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="py-0">
            {activeTab === "description" && (
              <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 border-t-0 overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="prose prose-lg max-w-none">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="w-1 h-8 bg-gradient-to-b from-saffron-500 to-green-500 rounded-full mr-3"></span>
                        Product Description
                      </h3>
                      <div className="bg-gradient-to-r from-gray-50 to-saffron-50 p-6 rounded-xl border-l-4 border-saffron-500">
                        <p className="text-gray-800 leading-relaxed text-sm">
                          {product.description || "No description available."}
                        </p>
                        {product.shortDescription && (
                          <p className="text-gray-600 italic mt-3 text-xs border-t border-gray-200 pt-3">
                            {product.shortDescription}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Key Features */}
                    {product.dynamicProductDetails && product.dynamicProductDetails.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                          <span className="w-1 h-6 bg-gradient-to-b from-saffron-500 to-green-500 rounded-full mr-3"></span>
                          Key Features
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {product.dynamicProductDetails
                            .filter(detail => detail.fieldValue && detail.fieldValue.trim() !== '')
                            .map((detail, index) => (
                              <div key={index} className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-saffron-50 p-5 rounded-xl border border-saffron-200">
                                <div className="flex flex-col space-y-3">
                                  <h5 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                                    {detail.fieldName}
                                  </h5>
                                  <div className="flex-1">
                                    {detail.fieldType === 'checkbox' ? (
                                      <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${detail.fieldValue ? 'bg-green-100 text-green-800 border-2 border-green-300' : 'bg-red-100 text-red-800 border-2 border-red-300'}`}>
                                        {detail.fieldValue ? '✓ Yes' : '✗ No'}
                                      </span>
                                    ) : (
                                      <p className="text-saffron-700 font-semibold text-sm">
                                        {detail.fieldValue}
                                        {detail.fieldType === 'number' && detail.fieldValue ? (
                                          detail.fieldName.toLowerCase().includes('weight') ? ' kg' :
                                            detail.fieldName.toLowerCase().includes('length') ||
                                              detail.fieldName.toLowerCase().includes('width') ||
                                              detail.fieldName.toLowerCase().includes('height') ? ' cm' : ''
                                        ) : ''}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    )}

                    {/* Highlights */}
                    {product.keyHighlightsCustomFields && product.keyHighlightsCustomFields.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                          <span className="w-1 h-6 bg-gradient-to-b from-saffron-500 to-green-500 rounded-full mr-3"></span>
                          Product Highlights
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {product.keyHighlightsCustomFields.map((highlight, index) => (
                            <div key={index} className="bg-gradient-to-r from-saffron-50 to-orange-50 p-6 rounded-xl border-2 border-saffron-200 hover:shadow-lg transition-all duration-300">
                              <div className="flex items-start space-x-4">
                                <div className="w-3 h-3 bg-saffron-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <h5 className="font-bold text-saffron-900 mb-3 text-lg">
                                    {highlight.heading}
                                  </h5>
                                  <p className="text-gray-700 leading-relaxed text-sm">
                                    {highlight.value}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Product Information */}
                    {product.productInformationCustomFields && product.productInformationCustomFields.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                          <span className="w-1 h-6 bg-gradient-to-b from-saffron-500 to-green-500 rounded-full mr-3"></span>
                          Detailed Information
                        </h4>
                        <div className="space-y-4">
                          {product.productInformationCustomFields.map((info, index) => (
                            <div key={index} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                              <div className="bg-gradient-to-r from-gray-50 to-saffron-50 px-6 py-4 border-b border-gray-200">
                                <h5 className="font-bold text-gray-900 text-lg">
                                  {info.heading}
                                </h5>
                              </div>
                              <div className="p-6">
                                <p className="text-gray-700 leading-relaxed text-xs">
                                  {info.value}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Details */}
                    {product.productDetailsCustomFields && product.productDetailsCustomFields.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                          <span className="w-1 h-6 bg-gradient-to-b from-saffron-500 to-green-500 rounded-full mr-3"></span>
                          Additional Details
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {product.productDetailsCustomFields.map((field, index) => (
                            <div key={index} className="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl border border-gray-200 transition-colors duration-200">
                              <h5 className="font-semibold text-gray-900 mb-2">
                                {field.fieldName}
                              </h5>
                              <p className="text-gray-700 text-xs">
                                {field.fieldValue}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Legacy Features */}
                    {product.features && product.features.length > 0 && (
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                          <span className="w-1 h-6 bg-gradient-to-b from-saffron-500 to-green-500 rounded-full mr-3"></span>
                          Key Features
                        </h4>
                        <div className="bg-gradient-to-r from-green-50 to-saffron-50 p-6 rounded-xl border-2 border-green-200">
                          <ul className="space-y-3">
                            {product.features.map((feature, index) => (
                              <li key={index} className="flex items-start space-x-3">
                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span className="text-gray-700 leading-relaxed text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 border-t-0 overflow-hidden">
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Technical Specifications */}
                  {product.dynamicProductDetails && product.dynamicProductDetails.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-1 h-8 bg-gradient-to-b from-saffron-500 to-green-500 rounded-full mr-3"></span>
                        Technical Specifications
                      </h3>
                      <div className="bg-gradient-to-r from-gray-50 to-saffron-50 rounded-xl p-6 border-2 border-saffron-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {product.dynamicProductDetails.map((detail, index) => (
                            <div key={index} className="bg-white p-5 rounded-xl shadow-sm border-2 border-gray-200 hover:shadow-lg transition-all duration-300">
                              <div className="space-y-3">
                                <h5 className="font-bold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                                  {detail.fieldName}
                                </h5>
                                <div className="flex items-center justify-center">
                                  {detail.fieldType === 'checkbox' ? (
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${detail.fieldValue ? 'bg-green-100 text-green-800 border-2 border-green-300' : 'bg-red-100 text-red-800 border-2 border-red-300'}`}>
                                      {detail.fieldValue ? '✓ Yes' : '✗ No'}
                                    </span>
                                  ) : (
                                    <span className="text-saffron-700 font-bold text-xl text-center">
                                      {detail.fieldValue || 'Not specified'}
                                      {detail.fieldType === 'number' && detail.fieldValue ? (
                                        detail.fieldName.toLowerCase().includes('weight') ? ' kg' :
                                          detail.fieldName.toLowerCase().includes('length') ||
                                            detail.fieldName.toLowerCase().includes('width') ||
                                            detail.fieldName.toLowerCase().includes('height') ? ' cm' : ''
                                      ) : ''}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Product Information Table */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="w-1 h-8 bg-gradient-to-b from-saffron-500 to-green-500 rounded-full mr-3"></span>
                      Product Information
                    </h3>
                    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gradient-to-r from-saffron-50 to-green-50 border-b-2 border-gray-200">
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Specification</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Details</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {product.brand && (
                              <tr className="hover:bg-saffron-50 transition-colors duration-200">
                                <td className="px-4 py-2 text-xs font-semibold text-gray-900">Brand</td>
                                <td className="px-4 py-2 text-xs text-gray-700 font-medium">{product.brand}</td>
                              </tr>
                            )}
                            {product.material && (
                              <tr className="hover:bg-saffron-50 transition-colors duration-200">
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">Material</td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{product.material}</td>
                              </tr>
                            )}
                            {product.pattern && (
                              <tr className="hover:bg-saffron-50 transition-colors duration-200">
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">Pattern</td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{product.pattern}</td>
                              </tr>
                            )}
                            {product.fitType && (
                              <tr className="hover:bg-saffron-50 transition-colors duration-200">
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">Fit Type</td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{product.fitType}</td>
                              </tr>
                            )}
                            {product.sleeveType && (
                              <tr className="hover:bg-saffron-50 transition-colors duration-200">
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">Sleeve Type</td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{product.sleeveType}</td>
                              </tr>
                            )}
                            {product.neckType && (
                              <tr className="hover:bg-saffron-50 transition-colors duration-200">
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">Neck Type</td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{product.neckType}</td>
                              </tr>
                            )}
                            {product.gender && (
                              <tr className="hover:bg-saffron-50 transition-colors duration-200">
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">Gender</td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{product.gender}</td>
                              </tr>
                            )}
                            {product.productType && (
                              <tr className="hover:bg-saffron-50 transition-colors duration-200">
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">Product Type</td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{product.productType}</td>
                              </tr>
                            )}
                            {product.countryOfOrigin && (
                              <tr className="hover:bg-saffron-50 transition-colors duration-200">
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">Country of Origin</td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{product.countryOfOrigin}</td>
                              </tr>
                            )}
                            {product.careInstruction && (
                              <tr className="hover:bg-saffron-50 transition-colors duration-200">
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">Care Instructions</td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{product.careInstruction}</td>
                              </tr>
                            )}
                            {product.weight && (
                              <tr className="hover:bg-saffron-50 transition-colors duration-200">
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">Weight</td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{product.weight} kg</td>
                              </tr>
                            )}
                            {product.sku && (
                              <tr className="hover:bg-saffron-50 transition-colors duration-200">
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">SKU</td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-medium font-mono">{product.sku}</td>
                              </tr>
                            )}
                            {product.specifications && Object.keys(product.specifications).length > 0 &&
                              Object.entries(product.specifications).map(([key, value]) => (
                                <tr key={key} className="hover:bg-saffron-50 transition-colors duration-200">
                                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">{value}</td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Available Colors */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="w-1 h-6 bg-gradient-to-b from-saffron-500 to-green-500 rounded-full mr-3"></span>
                        Available Colors
                      </h4>
                      <div className="bg-gradient-to-r from-gray-50 to-saffron-50 p-6 rounded-xl border-2 border-saffron-100">
                        <div className="flex flex-wrap gap-3">
                          {product.colors.map((color) => (
                            <span
                              key={color}
                              className="inline-flex items-center px-4 py-2 bg-white border-2 border-saffron-200 text-gray-800 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                              <span className="w-3 h-3 rounded-full mr-2 bg-gradient-to-r from-saffron-400 to-green-400"></span>
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {reviewsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-600"></div>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border-b border-gray-200 pb-6"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {review.user?.name?.[0] || "U"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                {review.user?.name || "Anonymous"}
                              </h4>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <StarSolidIcon
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                      }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-2">
                              {review.comment}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 lg:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/product/${relatedProduct._id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative">
                    <img
                      src={
                        relatedProduct.images?.[0]?.url ||
                        (typeof relatedProduct.images?.[0] === 'string' ? relatedProduct.images[0] : null) ||
                        "/placeholder-product.jpg"
                      }
                      alt={relatedProduct.name}
                      className="w-full h-32 sm:h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {relatedProduct.discountPercentage > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                        -{relatedProduct.discountPercentage}%
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem] sm:min-h-[3rem]">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                      <span className="text-sm sm:text-lg font-bold text-gray-900">
                        ₹{(relatedProduct.price || relatedProduct.basePrice).toLocaleString()}
                      </span>
                      <div className="flex items-center">
                        <StarSolidIcon className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                        <span className="text-xs text-gray-600 ml-1">
                          {relatedProduct.averageRating || 4.5}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            <img
              src={
                product.images?.[currentImageIndex]?.url ||
                (typeof product.images?.[currentImageIndex] === 'string' ? product.images[currentImageIndex] : null) ||
                "/placeholder-product.jpg"
              }
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
            {product.images?.length > 1 && (
              <>
                <button
                  onClick={() => handleImageNavigation("prev")}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <ChevronLeftIcon className="h-8 w-8" />
                </button>
                <button
                  onClick={() => handleImageNavigation("next")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <ChevronRightIcon className="h-8 w-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;