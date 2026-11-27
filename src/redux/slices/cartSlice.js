import { createSlice } from '@reduxjs/toolkit';

const CART_KEY = 'batchbite_cart';

const loadSavedCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: loadSavedCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { batch, product, quantity } = action.payload;
      const existing = state.items.find((it) => it.batch?._id === batch._id);
      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + quantity,
          batch.availableQuantity || 99
        );
      } else {
        state.items.push({
          batch,
          product,
          quantity,
          pricePerUnit: batch.pricePerUnit,
        });
      }
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const batchId = action.payload;
      state.items = state.items.filter((it) => it.batch?._id !== batchId);
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { batchId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((it) => it.batch?._id !== batchId);
      } else {
        const item = state.items.find((it) => it.batch?._id === batchId);
        if (item) {
          item.quantity = quantity;
        }
      }
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem(CART_KEY);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, it) => sum + it.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, it) => sum + it.pricePerUnit * it.quantity, 0);

export default cartSlice.reducer;
