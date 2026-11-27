import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { placeOrder } from '../services/api';
import { formatCurrency, getImageUrl, getErrorMessage } from '../utils/helpers';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [specialInstructions, setSpecialInstructions] = useState('');
  const [pickupDetails, setPickupDetails] = useState('');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [submitting, setSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>No items to checkout</h3>
        <Link to="/products" className="btn-primary-custom mt-3">
          Explore Batches
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        items: cartItems.map((item) => ({
          batchId: item.batch._id,
          quantity: item.quantity,
        })),
        specialInstructions,
        pickupDetails: pickupDetails || `Customer: ${user?.name}, Contact: ${contactPhone || user?.phone}`,
      };

      const res = await placeOrder(payload);
      const createdOrder = res.data.data?.order || res.data.order || res.data;

      clearCart();
      toast.success('Pre-order placed successfully! 🎉');
      navigate(`/order-confirmation/${createdOrder._id}`, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <div className="container">
          <h1>Confirm Pre-Order</h1>
          <p>Complete your pre-order and reserve your batch with the home chef</p>
        </div>
      </div>

      <div className="container mb-5 flex-grow-1">
        <form onSubmit={handleSubmitOrder}>
          <div className="row g-4">
            {/* Left: Customer Info & Instructions */}
            <div className="col-lg-7">
              <div className="card-custom p-4 mb-4">
                <h5 className="fw-bold mb-3" style={{ color: 'var(--secondary)' }}>
                  👤 Customer Contact Information
                </h5>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Name</label>
                    <input
                      type="text"
                      className="form-control form-control-custom bg-light"
                      value={user?.name || ''}
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Email</label>
                    <input
                      type="email"
                      className="form-control form-control-custom bg-light"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label-custom">Contact Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control form-control-custom"
                      placeholder="e.g. +91 98765 43210"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      required
                    />
                    <small className="text-muted">The chef will coordinate pickup updates to this number.</small>
                  </div>
                </div>
              </div>

              <div className="card-custom p-4 mb-4">
                <h5 className="fw-bold mb-3" style={{ color: 'var(--secondary)' }}>
                  📝 Pickup & Preparation Notes
                </h5>

                <div className="mb-3">
                  <label className="form-label-custom">Preferred Pickup Details / Time</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    placeholder="e.g. Will arrive around 1:30 PM by bike"
                    value={pickupDetails}
                    onChange={(e) => setPickupDetails(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label-custom">Special Food Instructions (Optional)</label>
                  <textarea
                    className="form-control form-control-custom"
                    rows={3}
                    placeholder="e.g. Mild spice preference, extra mint chutney if possible"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                  />
                </div>
              </div>

              <div className="card-custom p-4">
                <h5 className="fw-bold mb-2" style={{ color: 'var(--secondary)' }}>
                  💵 Payment Mode
                </h5>
                <div className="p-3 rounded-3" style={{ background: 'var(--cream)', border: '1px solid #e8dacb' }}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMode"
                      id="cod"
                      defaultChecked
                    />
                    <label className="form-check-label fw-bold text-dark" htmlFor="cod">
                      Pay on Pickup / Direct UPI to Home Chef
                    </label>
                  </div>
                  <p className="text-muted small mb-0 mt-2 ps-4">
                    BatchBite connects you directly with neighborhood home kitchens. Pay cash or scan the chef's personal UPI QR code when collecting your freshly made batch.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Items Review & Place Order Button */}
            <div className="col-lg-5">
              <div className="card-custom p-4 sticky-top" style={{ top: '90px' }}>
                <h5 className="fw-bold mb-3" style={{ color: 'var(--secondary)' }}>
                  Order Summary ({cartItems.length} {cartItems.length === 1 ? 'batch' : 'batches'})
                </h5>

                <div className="mb-3" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {cartItems.map((item) => (
                    <div
                      key={item.batch._id}
                      className="d-flex align-items-center justify-content-between py-2 border-bottom"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            background: 'var(--cream-dark)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <img
                            src={getImageUrl(item.product?.image, item.product?.category)}
                            alt={item.product?.name || 'Dish'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>
                        <div>
                          <div className="fw-bold text-dark small">{item.product?.name}</div>
                          <small className="text-muted">
                            {item.quantity} x {formatCurrency(item.pricePerUnit)}
                          </small>
                        </div>
                      </div>
                      <span className="fw-bold small" style={{ color: 'var(--primary)' }}>
                        {formatCurrency(item.pricePerUnit * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between mb-2 small text-muted">
                  <span>Subtotal:</span>
                  <span className="fw-semibold text-dark">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 small text-muted">
                  <span>Convenience Fee:</span>
                  <span className="text-success fw-semibold">FREE</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fs-5 fw-bold text-dark">Total Payable:</span>
                  <span className="fs-4 fw-bold" style={{ color: 'var(--primary)' }}>
                    {formatCurrency(cartTotal)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn-primary-custom w-100 justify-content-center py-3 fs-6"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Placing Pre-Order...
                    </>
                  ) : (
                    'Confirm & Place Pre-Order 🍱'
                  )}
                </button>

                <p className="text-center text-muted small mt-3 mb-0">
                  By confirming, your quantity is reserved in the chef's batch.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
