import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('batchbite_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally without interfering with auth forms
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAuthRequest =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/register-owner') ||
      url.includes('/auth/me');

    if (error.response && error.response.status === 401 && !isAuthRequest) {
      localStorage.removeItem('batchbite_token');
      localStorage.removeItem('batchbite_user');
      // Only redirect if not already on login pages
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/owner/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ========== AUTH ==========
export const registerCustomer = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const registerOwner = (data) => api.post('/auth/register-owner', data);
export const getMe = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);

// ========== PRODUCTS ==========
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const uploadProductImage = (id, formData) =>
  api.put(`/products/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ========== BATCHES ==========
export const getBatches = (params) => api.get('/batches', { params });
export const getBatch = (id) => api.get(`/batches/${id}`);
export const createBatch = (data) => api.post('/batches', data);
export const updateBatch = (id, data) => api.put(`/batches/${id}`, data);
export const deleteBatch = (id) => api.delete(`/batches/${id}`);
export const getBusinessBatches = () => api.get('/business/batches');

// ========== ORDERS ==========
export const placeOrder = (data) => api.post('/orders', data);
export const getMyOrders = () => api.get('/orders/my');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const cancelOrder = (id, reason) => api.put(`/orders/${id}/cancel`, { reason });
export const getBusinessOrders = (params) => api.get('/business/orders', { params });
export const updateOrderStatus = (id, data) => api.put(`/business/orders/${id}/status`, data);

// ========== BUSINESS ==========
export const getBusinessProfile = () => api.get('/business/profile');
export const updateBusinessProfile = (data) => api.put('/business/profile', data);
export const getDashboardStats = () => api.get('/business/dashboard');
export const uploadBusinessLogo = (formData) =>
  api.put('/business/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export default api;
