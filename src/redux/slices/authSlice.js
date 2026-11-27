import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser as apiLoginUser, getMe as apiGetMe } from '../../services/api';

const TOKEN_KEY = 'batchbite_token';
const USER_KEY = 'batchbite_user';

// Async thunk to restore user session
export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  try {
    const res = await apiGetMe();
    const user = res.data.data?.user || res.data.user;
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { user, token };
    }
    return null;
  } catch (err) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return rejectWithValue(err.response?.data?.message || 'Session expired');
  }
});

// Async thunk to login
export const loginAsync = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await apiLoginUser(credentials);
    const resData = res.data.data || res.data;
    const { token, user } = resData;
    if (!token || !user) throw new Error('Invalid login response');
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { user, token };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Login failed');
  }
});

const loadInitialUser = () => {
  try {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: loadInitialUser(),
  token: localStorage.getItem(TOKEN_KEY) || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.error = null;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('batchbite_cart');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      });
  },
});

export const { setUserCredentials, logout, clearAuthError } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.token && !!state.auth.user;
export const selectIsOwner = (state) => !!state.auth.token && state.auth.user?.role === 'owner';
export const selectIsCustomer = (state) => !!state.auth.token && state.auth.user?.role === 'customer';

export default authSlice.reducer;
