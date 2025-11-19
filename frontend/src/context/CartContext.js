import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const USER_ID = 'user-123'; // In production, get from auth

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cart/${USER_ID}`);
      setCartItems(response.data.items || []);
      setCartTotal(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/cart/${USER_ID}/items`, {
        productId,
        quantity
      });
      setCartItems(response.data.items || []);
      setCartTotal(response.data.total || 0);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/cart/${USER_ID}/items/${itemId}`, {
        quantity
      });
      setCartItems(response.data.items || []);
      setCartTotal(response.data.total || 0);
      return true;
    } catch (error) {
      console.error('Error updating cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${API_BASE_URL}/cart/${USER_ID}/items/${itemId}`);
      setCartItems(response.data.items || []);
      setCartTotal(response.data.total || 0);
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/cart/${USER_ID}`);
      setCartItems([]);
      setCartTotal(0);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
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

