import React, { useState } from 'react'
import { StarIcon, HeartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'

const FeaturedProducts = () => {
    const [wishlist, setWishlist] = useState(new Set())

    const products = [
        {
            id: 1,
            name: 'Wireless Bluetooth Headphones',
            price: 89.99,
            originalPrice: 129.99,
            rating: 4.5,
            reviews: 128,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
            category: 'Electronics'
        },
        {
            id: 2,
            name: 'Premium Cotton T-Shirt',
            price: 24.99,
            originalPrice: 34.99,
            rating: 4.3,
            reviews: 89,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
            category: 'Fashion'
        },
        {
            id: 3,
            name: 'Smart Fitness Watch',
            price: 199.99,
            originalPrice: 249.99,
            rating: 4.7,
            reviews: 256,
            image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop',
            category: 'Electronics'
        },
        {
            id: 4,
            name: 'Organic Coffee Beans',
            price: 15.99,
            originalPrice: 19.99,
            rating: 4.6,
            reviews: 67,
            image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
            category: 'Food & Beverages'
        },
        {
            id: 5,
            name: 'Designer Handbag',
            price: 89.99,
            originalPrice: 120.00,
            rating: 4.4,
            reviews: 142,
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
            category: 'Fashion'
        },
        {
            id: 6,
            name: 'Gaming Mouse',
            price: 59.99,
            originalPrice: 79.99,
            rating: 4.8,
            reviews: 203,
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
            category: 'Electronics'
        }
    ]

    const toggleWishlist = (productId) => {
        const newWishlist = new Set(wishlist)
        if (newWishlist.has(productId)) {
            newWishlist.delete(productId)
        } else {
            newWishlist.add(productId)
        }
        setWishlist(newWishlist)
    }

    const formatPrice = (price) => {
        return `$${price.toFixed(2)}`
    }

    const getCategoryColor = (category) => {
        if (category === 'Electronics') return 'text-saffron-600'
        if (category === 'Fashion') return 'text-green-600'
        if (category === 'Food & Beverages') return 'text-saffron-500'
        return 'text-gray-600'
    }

    return (
        <section className="py-16 bg-gradient-to-br from-saffron-50 to-green-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover our most popular and trending products
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-saffron-100">
                            {/* Product Image */}
                            <div className="relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-64 object-cover"
                                />
                                <button
                                    onClick={() => toggleWishlist(product.id)}
                                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                                >
                                    {wishlist.has(product.id) ? (
                                        <HeartIcon className="h-5 w-5 text-saffron-500" />
                                    ) : (
                                        <HeartOutlineIcon className="h-5 w-5 text-gray-600" />
                                    )}
                                </button>
                                {product.originalPrice > product.price && (
                                    <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                        SALE
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium ${getCategoryColor(product.category)}`}>{product.category}</span>
                                    <div className="flex items-center">
                                        <StarIcon className="h-4 w-4 text-saffron-400" />
                                        <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                                        <span className="text-sm text-gray-400 ml-1">({product.reviews})</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                                        {product.originalPrice > product.price && (
                                            <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                                        )}
                                    </div>
                                </div>

                                
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button className="bg-white text-saffron-600 border-2 border-saffron-600 px-8 py-3 rounded-lg font-semibold hover:bg-saffron-600 hover:text-white transition-colors duration-200 shadow-md">
                        View All Products
                    </button>
                </div>
            </div>
        </section>
    )
}

export default FeaturedProducts
