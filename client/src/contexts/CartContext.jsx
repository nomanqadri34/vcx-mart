import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      console.log('CartReducer: SET_CART action payload:', action.payload);
      if (!action.payload) {
        console.error('CartReducer: Invalid payload received');
        return state;
      }

      const cartItems = Array.isArray(action.payload.cart) ? action.payload.cart : [];
      const cartCount = typeof action.payload.cartCount === 'number' ? action.payload.cartCount : cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const cartTotal = typeof action.payload.cartTotal === 'number' ? action.payload.cartTotal : cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      console.log('CartReducer: Setting items:', cartItems.length, 'count:', cartCount, 'total:', cartTotal);

      // Only update if we have valid data
      if (cartItems.length > 0 || (action.payload.cart && action.payload.cart.length === 0)) {
        return {
          ...state,
          items: cartItems,
          cartCount: cartCount,
          cartTotal: cartTotal,
          loading: false,
          error: null
        };
      }
      return state;

    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(item =>
        item.productId === action.payload.productId &&
        JSON.stringify(item.variants) === JSON.stringify(action.payload.variants)
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          items: updatedItems,
          cartCount: state.cartCount + action.payload.quantity,
          cartTotal: state.cartTotal + (action.payload.price * action.payload.quantity),
          error: null
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
          cartCount: state.cartCount + action.payload.quantity,
          cartTotal: state.cartTotal + (action.payload.price * action.payload.quantity),
          error: null
        };
      }

    case 'UPDATE_ITEM':
      const updatedItems = state.items.map(item => {
        if (item.productId === action.payload.productId &&
          JSON.stringify(item.variants) === JSON.stringify(action.payload.variants)) {
          const quantityDiff = action.payload.quantity - item.quantity;
          return {
            ...item,
            quantity: action.payload.quantity
          };
        }
        return item;
      });

      const newCartCount = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const newCartTotal = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);

      return {
        ...state,
        items: updatedItems,
        cartCount: newCartCount,
        cartTotal: newCartTotal,
        error: null
      };

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item =>
        !(item.productId === action.payload.productId &&
          JSON.stringify(item.variants) === JSON.stringify(action.payload.variants))
      );

      const removedItem = state.items.find(item =>
        item.productId === action.payload.productId &&
        JSON.stringify(item.variants) === JSON.stringify(action.payload.variants)
      );

      const newCount = state.cartCount - (removedItem?.quantity || 0);
      const newTotal = state.cartTotal - (removedItem ? removedItem.price * removedItem.quantity : 0);

      return {
        ...state,
        items: filteredItems,
        cartCount: newCount,
        cartTotal: newTotal,
        error: null
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        cartCount: 0,
        cartTotal: 0,
        error: null
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'RESET_ERROR':
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Helper functions for localStorage
const saveCartToLocalStorage = (cartData) => {
  try {
    localStorage.setItem('cart', JSON.stringify({
      items: cartData.items || [],
      cartCount: cartData.cartCount || 0,
      cartTotal: cartData.cartTotal || 0,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const loadCartFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if cart is less than 7 days old
      if (Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
        return {
          items: parsed.items || [],
          cartCount: parsed.cartCount || 0,
          cartTotal: parsed.cartTotal || 0
        };
      }
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return { items: [], cartCount: 0, cartTotal: 0 };
};

export const CartProvider = ({ children }) => {
  const savedCart = loadCartFromLocalStorage();
  const [state, dispatch] = useReducer(cartReducer, {
    items: savedCart.items,
    cartCount: savedCart.cartCount,
    cartTotal: savedCart.cartTotal,
    loading: false,
    error: null
  });

  const { user, isAuthenticated } = useAuth();

  // Memoize loadCart function to prevent infinite loops
  const loadCart = useCallback(async (force = false) => {
    try {
      if (!isAuthenticated) {
        // Reset cart for unauthenticated users
        dispatch({ type: 'CLEAR_CART' });
        localStorage.removeItem('cart');
        return;
      }

      console.log('CartContext: Starting loadCart...');
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'RESET_ERROR' });

      const response = await cartAPI.getCart();
      console.log('CartContext: loadCart response:', response);

      if (!response) {
        throw new Error('No response received from server');
      }

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.success || !response.data) {
        throw new Error('Invalid response format from server');
      }

      console.log('CartContext: Response data:', response.data);

      if (response.success) {
        console.log('CartContext: Setting cart data:', response.data);
        console.log('CartContext: Cart items in response:', response.data?.cart);
        console.log('CartContext: Cart count in response:', response.data?.cartCount);
        console.log('CartContext: Cart total in response:', response.data?.cartTotal);
        dispatch({ type: 'SET_CART', payload: response.data });
        // Save to localStorage
        saveCartToLocalStorage(response.data);
      } else {
        console.error('CartContext: loadCart failed:', response.error);
        dispatch({ type: 'SET_ERROR', payload: response.error });
        toast.error('Failed to load cart: ' + response.error);
      }
    } catch (error) {
      console.error('CartContext: Load cart error:', error);
      const errorMessage = error.message || 'Failed to load cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [isAuthenticated]); // Depend on isAuthenticated to reload when auth state changes

  // Sync localStorage cart with server when user logs in
  const syncCartWithServer = async () => {
    const localCart = loadCartFromLocalStorage();
    if (localCart.items.length > 0) {
      // Add local items to server cart
      for (const item of localCart.items) {
        try {
          await cartAPI.addToCart(item.productId, item.quantity, item.variants);
        } catch (error) {
          console.error('Failed to sync item to server:', error);
        }
      }
      // Clear local storage after sync
      localStorage.removeItem('cart');
    }
    // Load updated cart from server
    await loadCart(true);
  };

  // Load cart from server when user is authenticated
  useEffect(() => {
    let isSubscribed = true;

    const initializeCart = async () => {
      if (!isSubscribed) return;

      if (isAuthenticated && user) {
        console.log('CartContext: Loading cart for authenticated user');
        await syncCartWithServer();
      } else if (!isAuthenticated) {
        console.log('CartContext: Using localStorage cart for unauthenticated user');
        // Keep localStorage cart for unauthenticated users
      }
    };

    initializeCart();

    return () => {
      isSubscribed = false;
    };
  }, [isAuthenticated, user]);

  const addToCart = async (productId, quantity, variants = {}) => {
    try {
      if (!isAuthenticated) {
        // Add to localStorage for unauthenticated users
        const newItem = { productId, quantity, variants, price: 0, name: 'Product' };
        const updatedItems = [...state.items];
        const existingIndex = updatedItems.findIndex(item =>
          item.productId === productId &&
          JSON.stringify(item.variants) === JSON.stringify(variants)
        );

        if (existingIndex !== -1) {
          updatedItems[existingIndex].quantity += quantity;
        } else {
          updatedItems.push(newItem);
        }

        const cartData = {
          items: updatedItems,
          cartCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          cartTotal: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };

        dispatch({ type: 'SET_CART', payload: cartData });
        saveCartToLocalStorage(cartData);
        toast.success('Product added to cart! Login to sync across devices.');
        return true;
      }

      if (!user) {
        toast.error('User session expired. Please login again');
        return false;
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'RESET_ERROR' });

      console.log('CartContext: Making add to cart request...', { productId, quantity, variants });
      const response = await cartAPI.addToCart(productId, quantity, variants);
      console.log('CartContext: Add to cart response:', response);

      if (response.success && response.data) {
        // Update the cart state with the new data and ensure we have items
        const cartData = {
          ...response.data,
          cart: response.data.cart || [],
          cartCount: response.data.cartCount || 0,
          cartTotal: response.data.cartTotal || 0
        };
        dispatch({ type: 'SET_CART', payload: cartData });
        // Save to localStorage
        saveCartToLocalStorage(cartData);
        // Dispatch cart update event
        window.dispatchEvent(new CustomEvent('cart-updated'));
        console.log('CartContext: Cart updated successfully with items:', cartData.cart.length);
        toast.success('Product added to cart!');
        return true;
      } else {
        console.error('CartContext: Add to cart failed:', response.error);
        dispatch({ type: 'SET_ERROR', payload: response.error });
        toast.error(response.error || 'Failed to add to cart');
        return false;
      }
    } catch (error) {
      console.error('CartContext: Add to cart error:', error);
      const errorMessage = error.message || 'Failed to add to cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateCartItem = async (productId, quantity, variants = {}) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please login to update cart');
        return false;
      }

      if (quantity <= 0) {
        return removeFromCart(productId, variants);
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'RESET_ERROR' });

      const response = await cartAPI.updateCartItem(productId, quantity, variants);

      if (response.success) {
        dispatch({ type: 'SET_CART', payload: response.data });
        saveCartToLocalStorage(response.data);
        toast.success('Cart updated successfully!');
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error });
        toast.error(response.error || 'Failed to update cart');
        return false;
      }
    } catch (error) {
      console.error('CartContext: Update cart error:', error);
      const errorMessage = error.message || 'Failed to update cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeFromCart = async (productId, variants = {}) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please login to remove items from cart');
        return false;
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'RESET_ERROR' });

      const response = await cartAPI.removeFromCart(productId, variants);

      if (response.success) {
        dispatch({ type: 'SET_CART', payload: response.data });
        saveCartToLocalStorage(response.data);
        toast.success('Item removed from cart');
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error });
        toast.error(response.error || 'Failed to remove item');
        return false;
      }
    } catch (error) {
      console.error('CartContext: Remove from cart error:', error);
      const errorMessage = error.message || 'Failed to remove item from cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearCart = async () => {
    try {
      if (!isAuthenticated) {
        // Clear localStorage cart for unauthenticated users
        dispatch({ type: 'CLEAR_CART' });
        localStorage.removeItem('cart');
        return true;
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'RESET_ERROR' });

      const response = await cartAPI.clearCart();

      if (response.success) {
        dispatch({ type: 'CLEAR_CART' });
        localStorage.removeItem('cart');
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error });
        return false;
      }
    } catch (error) {
      console.error('CartContext: Clear cart error:', error);
      const errorMessage = error.message || 'Failed to clear cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const checkout = async (shippingAddress, billingAddress = null) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please login to checkout');
        return false;
      }

      // Force reload cart before checkout to ensure we have latest state
      await loadCart(true);

      if (!state.items || state.items.length === 0) {
        toast.error('Cart is empty');
        return false;
      }

      // Validate cart items
      if (!state.items.every(item => item.productId && item.quantity > 0)) {
        toast.error('Invalid cart items');
        return false;
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'RESET_ERROR' });

      const response = await cartAPI.checkout(shippingAddress, billingAddress);

      if (response.success) {
        // Redirect to GoKwik checkout
        const checkoutUrl = response.data.checkoutUrl;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          toast.error('Checkout URL not received');
        }
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error });
        toast.error(response.error || 'Failed to initiate checkout');
        return false;
      }
    } catch (error) {
      console.error('CartContext: Checkout error:', error);
      const errorMessage = error.message || 'Failed to initiate checkout';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };



  const retryLoadCart = useCallback(() => {
    loadCart();
  }, [loadCart]);

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkout,
    loadCart,
    retryLoadCart,
    isAuthenticated
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
