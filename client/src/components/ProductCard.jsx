import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/outline';
import WishlistButton from './WishlistButton';

const ProductCard = ({ product, showDiscount = false, variant = 'default' }) => {
  const originalPrice = product.price || product.basePrice;
  const discountPercentage = product.discountedPrice && product.discountedPrice < originalPrice
    ? Math.round(((originalPrice - product.discountedPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-100">
      <div className="relative">
        <Link to={`/product/${product._id}`}>
          <img
            src={
              product.images?.[0]?.url ||
              (typeof product.images?.[0] === 'string' ? product.images[0] : null) ||
              "/placeholder-product.jpg"
            }
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <div className="absolute top-3 right-3">
          <WishlistButton 
            product={product} 
            className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white"
          />
        </div>

        {showDiscount && discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPercentage}%
          </div>
        )}

        {product.status === "active" && variant === 'homepage' && (
          <div className="absolute bottom-3 left-3 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Available
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-saffron-600 font-medium uppercase tracking-wide">
            {product.category?.name}
          </span>
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600 ml-1">4.5</span>
          </div>
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-semibold text-gray-900 hover:text-saffron-600 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{(product.discountedPrice || originalPrice).toLocaleString()}
            </span>
            {product.discountedPrice && product.discountedPrice < originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;