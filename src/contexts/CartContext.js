import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

const CART_KEY = 'batchbite_cart';

const loadCart = () => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCart);

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((batch, product, quantity) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.batch._id === batch._id);
      if (existing) {
        return prev.map((item) =>
          item.batch._id === batch._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, batch.availableQuantity) }
            : item
        );
      }
      return [
        ...prev,
        {
          batch,
          product,
          quantity,
          pricePerUnit: batch.pricePerUnit,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((batchId) => {
    setCartItems((prev) => prev.filter((item) => item.batch._id !== batchId));
  }, []);

  const updateQuantity = useCallback((batchId, qty) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.batch._id !== batchId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.batch._id === batchId ? { ...item, quantity: qty } : item
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.pricePerUnit * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export default CartContext;
