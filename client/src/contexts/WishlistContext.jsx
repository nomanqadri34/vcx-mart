import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

export const useWishlist = () => {
    const context = useContext(WishlistContext)
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider')
    }
    return context
}

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([])
    const [loading, setLoading] = useState(false)
    const { user, isAuthenticated } = useAuth()

    // Load wishlist from localStorage on mount
    useEffect(() => {
        if (isAuthenticated && user) {
            const savedWishlist = localStorage.getItem(`wishlist_${user._id}`)
            if (savedWishlist) {
                setWishlistItems(JSON.parse(savedWishlist))
            }
        }
    }, [isAuthenticated, user])

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        if (isAuthenticated && user) {
            localStorage.setItem(`wishlist_${user._id}`, JSON.stringify(wishlistItems))
        }
    }, [wishlistItems, isAuthenticated, user])

    const addToWishlist = (product) => {
        if (!isAuthenticated) {
            toast.error('Please login to add items to wishlist')
            return
        }

        const isAlreadyInWishlist = wishlistItems.some(item => item._id === product._id)
        if (isAlreadyInWishlist) {
            toast.error('Item already in wishlist')
            return
        }

        setWishlistItems(prev => [...prev, product])
        toast.success('Added to wishlist')
    }

    const removeFromWishlist = (productId) => {
        setWishlistItems(prev => prev.filter(item => item._id !== productId))
        toast.success('Removed from wishlist')
    }

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item._id === productId)
    }

    const clearWishlist = () => {
        setWishlistItems([])
        toast.success('Wishlist cleared')
    }

    const value = {
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlistItems.length
    }

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    )
}