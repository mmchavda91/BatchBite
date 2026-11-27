import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import OwnerRoute from './components/OwnerRoute';

// Customer & Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerLogin from './pages/OwnerLogin';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Owner Admin Pages
import OwnerLayout from './pages/owner/OwnerLayout';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerProducts from './pages/owner/OwnerProducts';
import AddProduct from './pages/owner/AddProduct';
import EditProduct from './pages/owner/EditProduct';
import OwnerBatches from './pages/owner/OwnerBatches';
import AddBatch from './pages/owner/AddBatch';
import EditBatch from './pages/owner/EditBatch';
import OwnerOrders from './pages/owner/OwnerOrders';
import BusinessProfile from './pages/owner/BusinessProfile';
import SalesReport from './pages/owner/SalesReport';

// Wrapper for customer routes to include Navbar
const CustomerLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public & Customer Routes (with Customer Navbar) */}
        <Route
          path="/"
          element={
            <CustomerLayout>
              <Home />
            </CustomerLayout>
          }
        />
        <Route
          path="/login"
          element={
            <CustomerLayout>
              <Login />
            </CustomerLayout>
          }
        />
        <Route
          path="/register"
          element={
            <CustomerLayout>
              <Register />
            </CustomerLayout>
          }
        />
        <Route
          path="/owner/login"
          element={
            <CustomerLayout>
              <OwnerLogin />
            </CustomerLayout>
          }
        />
        <Route
          path="/products"
          element={
            <CustomerLayout>
              <Products />
            </CustomerLayout>
          }
        />
        <Route
          path="/products/:id"
          element={
            <CustomerLayout>
              <ProductDetail />
            </CustomerLayout>
          }
        />

        {/* Customer Protected Routes */}
        <Route
          path="/cart"
          element={
            <CustomerLayout>
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            </CustomerLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <CustomerLayout>
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            </CustomerLayout>
          }
        />
        <Route
          path="/order-confirmation/:id"
          element={
            <CustomerLayout>
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            </CustomerLayout>
          }
        />
        <Route
          path="/my-orders"
          element={
            <CustomerLayout>
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            </CustomerLayout>
          }
        />
        <Route
          path="/my-orders/:id"
          element={
            <CustomerLayout>
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            </CustomerLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <CustomerLayout>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </CustomerLayout>
          }
        />

        {/* Business Owner Admin Panel (Dedicated OwnerLayout) */}
        <Route
          path="/owner"
          element={
            <OwnerRoute>
              <OwnerLayout />
            </OwnerRoute>
          }
        >
          <Route index element={<Navigate to="/owner/dashboard" replace />} />
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="products" element={<OwnerProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="batches" element={<OwnerBatches />} />
          <Route path="batches/add" element={<AddBatch />} />
          <Route path="batches/edit/:id" element={<EditBatch />} />
          <Route path="orders" element={<OwnerOrders />} />
          <Route path="profile" element={<BusinessProfile />} />
          <Route path="reports" element={<SalesReport />} />
        </Route>

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <CustomerLayout>
              <NotFound />
            </CustomerLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
