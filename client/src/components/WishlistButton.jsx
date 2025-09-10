import React from 'react'
import { HeartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'
import { useWishlist } from '../contexts/WishlistContext'

const WishlistButton = ({ product, className = '', size = 'md' }) => {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
    const inWishlist = isInWishlist(product._id)

    const handleClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (inWishlist) {
            removeFromWishlist(product._id)
        } else {
            addToWishlist(product)
        }
    }

    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
    }

    return (
        <button
            onClick={handleClick}
            className={`p-2 rounded-full transition-colors hover:bg-gray-100 ${className}`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {inWishlist ? (
                <HeartIcon className={`${sizeClasses[size]} text-red-500`} />
            ) : (
                <HeartOutlineIcon className={`${sizeClasses[size]} text-gray-400 hover:text-red-500`} />
            )}
        </button>
    )
}

export default WishlistButton