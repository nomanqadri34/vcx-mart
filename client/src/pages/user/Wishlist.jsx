import React from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../../contexts/WishlistContext'
import { useCart } from '../../contexts/CartContext'
import { HeartIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
    const { addToCart } = useCart()

    const handleAddToCart = (product) => {
        addToCart(product._id, 1)
    }

    const handleRemoveFromWishlist = (productId) => {
        removeFromWishlist(productId)
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-16">
                        <HeartOutlineIcon className="mx-auto h-24 w-24 text-gray-300 mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-8">Save items you love to your wishlist and shop them later</p>
                        <Link
                            to="/products"
                            className="bg-saffron-500 text-white px-6 py-3 rounded-lg hover:bg-saffron-600 transition-colors inline-flex items-center"
                        >
                            <ShoppingCartIcon className="h-5 w-5 mr-2" />
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
                        <p className="text-gray-600">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved</p>
                    </div>
                    {wishlistItems.length > 0 && (
                        <button
                            onClick={clearWishlist}
                            className="mt-4 sm:mt-0 text-red-600 hover:text-red-700 font-medium flex items-center"
                        >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Clear All
                        </button>
                    )}
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map((product) => (
                        <div key={product._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                            {/* Product Image */}
                            <div className="relative aspect-square overflow-hidden rounded-t-lg">
                                <img
                                    src={
                                        product.images?.[0]?.url ||
                                        (typeof product.images?.[0] === 'string' ? product.images[0] : null) ||
                                        '/placeholder-product.jpg'
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => handleRemoveFromWishlist(product._id)}
                                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                                >
                                    <HeartIcon className="h-5 w-5 text-red-500" />
                                </button>
                                {product.discount && (
                                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                                        {product.discount}% OFF
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <Link to={`/product/${product._id}`} className="block">
                                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-saffron-600 transition-colors">
                                        {product.name}
                                    </h3>
                                </Link>
                                
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg font-bold text-gray-900">
                                            ₹{product.salePrice || product.price}
                                        </span>
                                        {product.salePrice && product.price !== product.salePrice && (
                                            <span className="text-sm text-gray-500 line-through">
                                                ₹{product.price}
                                            </span>
                                        )}
                                    </div>
                                    {product.rating && (
                                        <div className="flex items-center">
                                            <span className="text-yellow-400">★</span>
                                            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Stock Status */}
                                <div className="mb-3">
                                    {product.stock > 0 ? (
                                        <span className="text-green-600 text-sm font-medium">In Stock</span>
                                    ) : (
                                        <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock === 0}
                                        className="flex-1 bg-saffron-500 text-white px-4 py-2 rounded-lg hover:bg-saffron-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-sm font-medium"
                                    >
                                        <ShoppingCartIcon className="h-4 w-4 mr-2" />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => handleRemoveFromWishlist(product._id)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <TrashIcon className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Continue Shopping */}
                <div className="text-center mt-12">
                    <Link
                        to="/products"
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Wishlist