import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      console.log('CartReducer: SET_CART action payload:', action.payload);
      const cartItems = action.payload.cart || [];
      const cartCount = action.payload.cartCount || 0;
      const cartTotal = action.payload.cartTotal || 0;
      console.log('CartReducer: Setting items:', cartItems.length, 'count:', cartCount, 'total:', cartTotal);
      return {
        ...state,
        items: cartItems,
        cartCount: cartCount,
        cartTotal: cartTotal,
        loading: false,
        error: null
      };

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

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    cartCount: 0,
    cartTotal: 0,
    loading: false,
    error: null
  });

  const { user, isAuthenticated } = useAuth();

  // Memoize loadCart function to prevent infinite loops
  const loadCart = useCallback(async () => {
    try {
      console.log('CartContext: Starting loadCart...');
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'RESET_ERROR' });

      const response = await cartAPI.getCart();
      console.log('CartContext: loadCart response:', response);
      console.log('CartContext: Response type:', typeof response);
      console.log('CartContext: Response success:', response?.success);
      console.log('CartContext: Response data:', response?.data);

      if (response && response.success) {
        console.log('CartContext: Setting cart data:', response.data);
        console.log('CartContext: Cart items in response:', response.data?.cart);
        console.log('CartContext: Cart count in response:', response.data?.cartCount);
        console.log('CartContext: Cart total in response:', response.data?.cartTotal);
        dispatch({ type: 'SET_CART', payload: response.data });
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
  }, []); // Empty dependency array since this function doesn't depend on any props or state

  // Load cart from server when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('CartContext: Loading cart for authenticated user');
      loadCart();
    } else if (!isAuthenticated) {
      console.log('CartContext: Clearing cart for unauthenticated user');
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated, user, loadCart]);

  const addToCart = async (productId, quantity, variants = {}) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please login to add items to cart');
        return false;
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

      if (response.success) {
        // Update the cart state with the new data
        dispatch({ type: 'SET_CART', payload: response.data });
        console.log('CartContext: Cart updated successfully');

        // Reload the cart to ensure we have the latest data
        setTimeout(() => {
          loadCart();
        }, 500);

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
        toast.error('Please login to clear cart');
        return false;
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'RESET_ERROR' });

      const response = await cartAPI.clearCart();

      if (response.success) {
        dispatch({ type: 'CLEAR_CART' });
        toast.success('Cart cleared successfully');
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error });
        toast.error(response.error || 'Failed to clear cart');
        return false;
      }
    } catch (error) {
      console.error('CartContext: Clear cart error:', error);
      const errorMessage = error.message || 'Failed to clear cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
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

      if (state.items.length === 0) {
        toast.error('Cart is empty');
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
