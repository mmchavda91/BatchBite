// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Format date + time
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Time remaining until deadline
export const getTimeRemaining = (deadline) => {
  if (!deadline) return null;
  const diff = new Date(deadline) - new Date();
  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
};

// Default fallback high-quality food images by category
const CATEGORY_IMAGES = {
  'Indian': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
  'South Indian': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80',
  'Chinese': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80',
  'Desserts': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
  'Snacks': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
  'Biryani & Rice': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
  'Continental': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  'Main Course': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
  'default': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
};

// Get image URL (handles local upload path, external URL, or category fallback)
export const getImageUrl = (filename, category = '') => {
  if (filename) {
    if (filename.startsWith('http://') || filename.startsWith('https://')) return filename;
    return `http://localhost:5000${filename.startsWith('/') ? '' : '/'}${filename}`;
  }
  return CATEGORY_IMAGES[category] || CATEGORY_IMAGES['default'];
};

// Truncate text
export const truncate = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Get status display label
export const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready for Pickup',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
    active: 'Active',
    closed: 'Closed',
  };
  return labels[status] || status;
};

// Get status CSS class
export const getStatusClass = (status) => {
  return `status-badge status-${status}`;
};

// Food categories
export const FOOD_CATEGORIES = [
  'Indian',
  'South Indian',
  'Chinese',
  'Continental',
  'Desserts',
  'Beverages',
  'Snacks',
  'Biryani & Rice',
  'Breads',
  'Salads',
  'Soups',
  'Other',
];

// Order status steps for timeline
export const ORDER_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '📋' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
  { key: 'ready', label: 'Ready for Pickup', icon: '🎉' },
  { key: 'completed', label: 'Completed', icon: '✔️' },
];

export const getStepIndex = (status) => {
  return ORDER_STEPS.findIndex((s) => s.key === status);
};

// Extract API error message
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.errors) {
    const errs = error.response.data.errors;
    if (Array.isArray(errs)) return errs.map((e) => e.msg).join(', ');
    return JSON.stringify(errs);
  }
  if (error?.message) return error.message;
  return 'An unexpected error occurred.';
};
