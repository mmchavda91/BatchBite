import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatCurrency, getImageUrl } from '../utils/helpers';
import Footer from '../components/Footer';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="container py-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>You haven't added any fresh food batches to your pre-order cart yet.</p>
            <Link to="/products" className="btn-primary-custom mt-3" style={{ padding: '12px 30px' }}>
              Explore Available Batches 🍱
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <div className="container">
          <h1>Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h1>
          <p>Review your selected fresh homemade food batches before pre-ordering</p>
        </div>
      </div>

      <div className="container mb-5 flex-grow-1">
        <div className="row g-4">
          {/* Cart Items List */}
          <div className="col-lg-8">
            <div className="card-custom p-4">
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                <h5 className="mb-0 fw-bold" style={{ color: 'var(--secondary)' }}>
                  Selected Batches
                </h5>
                <button
                  className="btn btn-sm text-danger border-0 p-0 fw-semibold"
                  onClick={clearCart}
                >
                  Clear All
                </button>
              </div>

              {cartItems.map((item) => {
                const img = getImageUrl(item.product?.image, item.product?.category);
                const subtotal = item.pricePerUnit * item.quantity;
                const maxQty = item.batch?.availableQuantity || 99;

                return (
                  <div
                    key={item.batch?._id || Math.random()}
                    className="row align-items-center py-3 border-bottom g-3"
                  >
                    {/* Item Thumbnail */}
                    <div className="col-3 col-sm-2">
                      <img
                        src={img}
                        alt={item.product?.name || 'Dish'}
                        style={{
                          width: '100%',
                          height: '70px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>

                    {/* Product & Batch details */}
                    <div className="col-9 col-sm-4">
                      <Link
                        to={`/products/${item.batch._id}`}
                        className="text-decoration-none"
                      >
                        <h6 className="mb-1 fw-bold text-dark">{item.product?.name}</h6>
                      </Link>
                      <small className="text-muted d-block">
                        Batch: {item.batch?.batchName}
                      </small>
                      <span className="fw-semibold text-secondary small">
                        {formatCurrency(item.pricePerUnit)} each
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="col-6 col-sm-3 d-flex align-items-center">
                      <div
                        className="d-flex align-items-center"
                        style={{
                          border: '1px solid #ccc',
                          borderRadius: '6px',
                          overflow: 'hidden',
                        }}
                      >
                        <button
                          className="btn btn-sm btn-light px-2 py-1 border-0"
                          onClick={() => updateQuantity(item.batch._id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span
                          className="px-2 small fw-bold"
                          style={{ minWidth: '32px', textAlign: 'center' }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-sm btn-light px-2 py-1 border-0"
                          onClick={() => updateQuantity(item.batch._id, item.quantity + 1)}
                          disabled={item.quantity >= maxQty}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="col-6 col-sm-3 text-end d-flex align-items-center justify-content-end gap-3">
                      <strong className="fs-6" style={{ color: 'var(--primary)' }}>
                        {formatCurrency(subtotal)}
                      </strong>
                      <button
                        className="btn btn-sm btn-outline-danger border-0 p-1"
                        onClick={() => removeFromCart(item.batch._id)}
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="mt-4 pt-2">
                <Link
                  to="/products"
                  className="btn btn-link text-decoration-none p-0 fw-semibold"
                  style={{ color: 'var(--primary)' }}
                >
                  ← Continue Browsing Batches
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-lg-4">
            <div className="card-custom p-4 sticky-top" style={{ top: '90px' }}>
              <h5 className="fw-bold mb-3" style={{ color: 'var(--secondary)' }}>
                Order Summary
              </h5>

              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Items Subtotal:</span>
                <span className="fw-semibold text-dark">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Platform Convenience Fee:</span>
                <span className="text-success fw-semibold">FREE</span>
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between mb-4">
                <span className="fs-5 fw-bold text-dark">Total:</span>
                <span className="fs-4 fw-bold" style={{ color: 'var(--primary)' }}>
                  {formatCurrency(cartTotal)}
                </span>
              </div>

              <button
                className="btn-primary-custom w-100 justify-content-center py-3 fs-6"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout →
              </button>

              <div className="mt-4 pt-3 border-top small text-muted">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span>🔒</span>
                  <span>Direct Pre-Order guarantee with local chefs</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span>🍱</span>
                  <span>Fresh preparation on scheduled batch date</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
