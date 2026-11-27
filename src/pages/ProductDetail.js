import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBatch } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getTimeRemaining,
  getImageUrl,
} from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isOwner } = useAuth();

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchBatchDetail();
  }, [id]);

  const fetchBatchDetail = async () => {
    setLoading(true);
    try {
      const res = await getBatch(id);
      const data = res.data.data?.batch || res.data.batch || res.data;
      setBatch(data);
    } catch (err) {
      toast.error('Unable to load batch details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage text="Loading delicious details..." />;
  if (!batch) return null;

  const product = batch.product || {};
  const business = batch.business || {};
  const imageUrl = getImageUrl(product.image, product.category);
  const isDeadlinePassed = new Date(batch.orderDeadline) < new Date();
  const isAvailable = batch.availableQuantity > 0 && !isDeadlinePassed && batch.status === 'active';
  const timeLeft = getTimeRemaining(batch.orderDeadline);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > batch.availableQuantity) return batch.availableQuantity;
      return next;
    });
  };

  const handleAddToCart = (redirectAfter = false) => {
    if (isOwner) {
      toast.warning('You are currently logged in as an Owner. To place customer orders, please log in with a customer account (e.g. customer@batchbite.com).');
      return;
    }
    if (!isAvailable) {
      toast.error('This batch is no longer available for ordering');
      return;
    }

    setAdding(true);
    addToCart(batch, product, quantity);
    toast.success(`Added ${quantity} x ${product.name} to cart! 🍱`);
    setAdding(false);

    if (redirectAfter) {
      navigate('/cart');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="container py-4 flex-grow-1">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none" style={{ color: 'var(--primary)' }}>Home</Link></li>
            <li className="breadcrumb-item"><Link to="/products" className="text-decoration-none" style={{ color: 'var(--primary)' }}>Browse Food</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{product.name || 'Batch Detail'}</li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* Left Column: Food Image */}
          <div className="col-lg-6">
            <div className="card-custom overflow-hidden sticky-top" style={{ top: '90px' }}>
              <img
                src={imageUrl}
                alt={product.name}
                className="img-fluid w-100"
                style={{ maxHeight: '420px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80';
                }}
              />

              {/* Kitchen / Business Info Card */}
              <div className="p-4 bg-white border-top">
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'var(--cream-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}
                  >
                    👩‍🍳
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold" style={{ color: 'var(--secondary)' }}>
                      {business.businessName || 'Home Kitchen'}
                    </h6>
                    <small className="text-muted">{business.address || 'Local Home Chef'}</small>
                  </div>
                </div>
                {business.description && (
                  <p className="mt-3 text-muted small mb-0">{business.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Batch Details & Order Controls */}
          <div className="col-lg-6">
            <div className="d-flex align-items-center gap-2 mb-2">
              {product.category && (
                <span className="badge rounded-pill" style={{ background: 'var(--primary)', color: 'white', padding: '6px 14px', fontSize: '0.85rem' }}>
                  {product.category}
                </span>
              )}
              <span className={`badge rounded-pill ${batch.availableQuantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                {batch.availableQuantity > 0 ? `${batch.availableQuantity} Left In Batch` : 'Sold Out'}
              </span>
            </div>

            <h1 className="fw-bold mb-2" style={{ color: 'var(--secondary)', fontSize: '2.4rem' }}>
              {product.name}
            </h1>
            <p className="text-muted fs-6 mb-3">
              Batch: <span className="fw-semibold text-dark">{batch.batchName}</span>
            </p>

            <div className="d-flex align-items-baseline gap-3 mb-4">
              <span className="fw-bold" style={{ fontSize: '2.2rem', color: 'var(--primary)' }}>
                {formatCurrency(batch.pricePerUnit)}
              </span>
              <span className="text-muted">/ serving</span>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h6 className="fw-bold text-dark">About this dish</h6>
              <p style={{ color: 'var(--text-medium)', lineHeight: '1.7' }}>
                {product.description || 'Prepared fresh using handpicked local ingredients with zero preservatives.'}
              </p>
            </div>

            {/* Preparation Details Grid */}
            <div className="card-custom p-4 mb-4" style={{ background: 'var(--cream)', border: '1px solid #ebd9c5' }}>
              <h6 className="fw-bold mb-3" style={{ color: 'var(--secondary)' }}>
                🗓️ Batch & Pickup Schedule
              </h6>
              <div className="row g-3 small">
                <div className="col-sm-6">
                  <span className="text-muted d-block">Preparation Date:</span>
                  <strong className="text-dark">{formatDate(batch.preparationDate)}</strong>
                </div>
                <div className="col-sm-6">
                  <span className="text-muted d-block">Order Closes By:</span>
                  <strong className={isDeadlinePassed ? 'text-danger' : 'text-success'}>
                    {formatDateTime(batch.orderDeadline)}
                  </strong>
                </div>
                <div className="col-sm-6">
                  <span className="text-muted d-block">Pickup Window:</span>
                  <strong className="text-dark">
                    {batch.pickupStartTime || '12:00 PM'} - {batch.pickupEndTime || '3:00 PM'}
                  </strong>
                </div>
                <div className="col-sm-6">
                  <span className="text-muted d-block">Pickup Location:</span>
                  <strong className="text-dark">{batch.pickupLocation || business.address || 'Chef Kitchen Address'}</strong>
                </div>
                {timeLeft && !isDeadlinePassed && (
                  <div className="col-12 mt-2">
                    <div className="deadline-countdown p-2 text-center" style={{ fontSize: '0.9rem' }}>
                      ⏳ Pre-ordering closes in: <strong>{timeLeft}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Allergens & Prep Time */}
            {(product.allergens?.length > 0 || product.preparationTime) && (
              <div className="mb-4 small">
                {product.preparationTime && (
                  <div className="mb-2">
                    <span className="text-muted">⏱️ Kitchen Prep Time: </span>
                    <strong className="text-dark">{product.preparationTime}</strong>
                  </div>
                )}
                {product.allergens?.length > 0 && (
                  <div>
                    <span className="text-muted">⚠️ Contains Allergens: </span>
                    <span className="text-danger fw-semibold">{product.allergens.join(', ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector and Action Buttons */}
            {isAvailable ? (
              <div className="pt-2">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="fw-semibold text-dark">Quantity:</span>
                  <div className="d-flex align-items-center" style={{ border: '2px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      className="btn btn-light px-3 py-2 border-0"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      style={{ fontWeight: 700 }}
                    >
                      -
                    </button>
                    <span className="px-3 fw-bold fs-6" style={{ minWidth: '40px', textAlign: 'center' }}>
                      {quantity}
                    </span>
                    <button
                      className="btn btn-light px-3 py-2 border-0"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= batch.availableQuantity}
                      style={{ fontWeight: 700 }}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-muted small">
                    Total: <strong className="text-dark">{formatCurrency(batch.pricePerUnit * quantity)}</strong>
                  </span>
                </div>

                <div className="d-flex gap-3 flex-wrap">
                  <button
                    className="btn-primary-custom flex-grow-1 justify-content-center"
                    onClick={() => handleAddToCart(false)}
                    disabled={adding}
                    style={{ padding: '14px 28px', fontSize: '1.05rem' }}
                  >
                    🛒 Add To Cart
                  </button>
                  <button
                    className="btn-secondary-custom flex-grow-1 justify-content-center"
                    onClick={() => handleAddToCart(true)}
                    disabled={adding}
                    style={{ padding: '14px 28px', fontSize: '1.05rem' }}
                  >
                    ⚡ Pre-Order Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning mt-3 rounded-3 py-3 text-center">
                <strong>🚫 Ordering Currently Closed</strong>
                <p className="mb-0 mt-1 small">
                  {batch.availableQuantity <= 0
                    ? 'All units in this batch have been pre-ordered.'
                    : 'The pre-order deadline for this batch has passed.'}
                </p>
                <Link to="/products" className="btn btn-sm btn-outline-dark mt-2">
                  Browse other active batches
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
