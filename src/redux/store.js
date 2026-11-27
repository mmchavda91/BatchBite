import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import batchReducer from './slices/batchSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    batches: batchReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
