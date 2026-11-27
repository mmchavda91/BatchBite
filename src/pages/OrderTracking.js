import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrder, cancelOrder } from '../services/api';
import {
  formatCurrency,
  formatDateTime,
  getImageUrl,
  ORDER_STEPS,
  getStepIndex,
  getErrorMessage,
} from '../utils/helpers';
import OrderStatusBadge from '../components/OrderStatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await getOrder(id);
      const data = res.data.data?.order || res.data.order || res.data;
      setOrder(data);
    } catch (err) {
      toast.error('Unable to load order details');
      navigate('/my-orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      await cancelOrder(id, cancelReason);
      toast.success('Order cancelled successfully. Stock has been restored.');
      setShowCancelModal(false);
      fetchOrder();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage text="Fetching real-time tracking..." />;
  if (!order) return null;

  const currentStep = getStepIndex(order.status);
  const isCancelled = ['cancelled', 'rejected'].includes(order.status);
  const canCancel = ['pending', 'confirmed'].includes(order.status);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="container py-4 flex-grow-1">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" style={{ color: 'var(--primary)' }}>Home</Link></li>
            <li className="breadcrumb-item"><Link to="/my-orders" style={{ color: 'var(--primary)' }}>My Orders</Link></li>
            <li className="breadcrumb-item active">Order #{order._id.substring(order._id.length - 8)}</li>
          </ol>
        </nav>

        {/* Tracking Header */}
        <div className="card-custom p-4 mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <span className="badge bg-light text-dark border mb-1">
                ORDER ID: {order._id}
              </span>
              <h2 className="fw-bold mb-1" style={{ color: 'var(--secondary)' }}>
                Order Tracking
              </h2>
              <small className="text-muted">
                Placed on: {formatDateTime(order.createdAt)}
              </small>
            </div>
            <div className="text-end">
              <div className="mb-2">
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="fs-4 fw-bold" style={{ color: 'var(--primary)' }}>
                {formatCurrency(order.totalAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="card-custom p-4 p-md-5 mb-4">
          <h5 className="fw-bold mb-4" style={{ color: 'var(--secondary)' }}>
            Live Preparation Progress
          </h5>

          {isCancelled ? (
            <div className="alert alert-danger rounded-3 py-3">
              <div className="d-flex align-items-center gap-2 mb-1">
                <strong className="fs-5">⚠️ Order {order.status === 'cancelled' ? 'Cancelled' : 'Rejected'}</strong>
              </div>
              <p className="mb-0 text-muted small">
                {order.cancelReason || 'This order was not fulfilled.'}
              </p>
            </div>
          ) : (
            <div className="timeline-container py-3">
              <div className="row g-2 text-center position-relative">
                {ORDER_STEPS.map((step, idx) => {
                  const isDone = currentStep >= idx;
                  const isCurrent = currentStep === idx;
                  return (
                    <div key={step.key} className="col">
                      <div
                        className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: isCurrent
                            ? 'var(--primary)'
                            : isDone
                            ? 'var(--secondary)'
                            : '#f0f0f0',
                          color: isDone || isCurrent ? 'white' : '#999',
                          fontSize: '1.2rem',
                          boxShadow: isCurrent ? '0 0 0 5px rgba(232, 160, 32, 0.25)' : 'none',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {step.icon}
                      </div>
                      <div
                        className="fw-bold small"
                        style={{
                          color: isCurrent
                            ? 'var(--primary)'
                            : isDone
                            ? 'var(--secondary)'
                            : '#999',
                        }}
                      >
                        {step.label}
                      </div>
                      {isCurrent && (
                        <span className="badge bg-warning text-dark mt-1" style={{ fontSize: '0.7rem' }}>
                          Current Stage
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Order Details & Items */}
        <div className="row g-4">
          {/* Items List */}
          <div className="col-lg-7">
            <div className="card-custom p-4">
              <h5 className="fw-bold mb-3" style={{ color: 'var(--secondary)' }}>
                Items in This Order
              </h5>

              <div className="d-flex flex-column gap-3">
                {order.items?.map((item, idx) => {
                  const img = getImageUrl(item.product?.image, item.product?.category);
                  return (
                    <div
                      key={idx}
                      className="d-flex align-items-center justify-content-between p-3 rounded-3 border bg-white"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            background: 'var(--cream-dark)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={img}
                            alt={item.product?.name || 'Dish'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold text-dark">{item.product?.name}</h6>
                          <small className="text-muted d-block">
                            Batch: {item.batch?.batchName || 'Home Batch'}
                          </small>
                          <small className="text-muted">
                            Qty: <strong>{item.quantity}</strong> × {formatCurrency(item.pricePerUnit)}
                          </small>
                        </div>
                      </div>
                      <strong className="fs-6" style={{ color: 'var(--primary)' }}>
                        {formatCurrency(item.subtotal || item.pricePerUnit * item.quantity)}
                      </strong>
                    </div>
                  );
                })}
              </div>

              <div className="border-top pt-3 mt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fs-5 fw-bold text-dark">Total Amount:</span>
                  <span className="fs-4 fw-bold" style={{ color: 'var(--primary)' }}>
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>

              {canCancel && (
                <div className="mt-4 pt-3 border-top">
                  <button
                    className="btn btn-outline-danger w-100 py-2 fw-semibold"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel This Order
                  </button>
                  <small className="text-muted d-block text-center mt-1">
                    Orders can be cancelled before kitchen preparation starts.
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Pickup & Kitchen Details */}
          <div className="col-lg-5">
            <div className="card-custom p-4 mb-4">
              <h5 className="fw-bold mb-3" style={{ color: 'var(--secondary)' }}>
                📍 Kitchen & Pickup Information
              </h5>

              <div className="mb-3">
                <span className="text-muted small d-block">Home Food Business:</span>
                <strong className="text-dark fs-6">{order.business?.businessName || 'Home Chef'}</strong>
              </div>

              {order.business?.phone && (
                <div className="mb-3">
                  <span className="text-muted small d-block">Chef Contact:</span>
                  <strong className="text-dark">{order.business.phone}</strong>
                </div>
              )}

              <div className="mb-3">
                <span className="text-muted small d-block">Pickup Location:</span>
                <strong className="text-dark">
                  {order.items?.[0]?.batch?.pickupLocation || order.business?.address || 'Chef Kitchen Address'}
                </strong>
              </div>

              {order.pickupDetails && (
                <div className="p-3 rounded-3 bg-light mb-3">
                  <span className="text-muted small d-block">Your Pickup Note:</span>
                  <span className="text-dark small">{order.pickupDetails}</span>
                </div>
              )}

              {order.specialInstructions && (
                <div className="p-3 rounded-3 bg-light">
                  <span className="text-muted small d-block">Special Cooking Instructions:</span>
                  <span className="text-dark small">{order.specialInstructions}</span>
                </div>
              )}
            </div>

            {/* Status History Timeline */}
            {order.statusHistory?.length > 0 && (
              <div className="card-custom p-4">
                <h6 className="fw-bold mb-3 text-secondary">Activity History</h6>
                <div className="small">
                  {order.statusHistory.map((h, i) => (
                    <div key={i} className="mb-2 pb-2 border-bottom">
                      <div className="d-flex justify-content-between">
                        <strong className="text-capitalize text-dark">{h.status}</strong>
                        <span className="text-muted">{formatDateTime(h.changedAt)}</span>
                      </div>
                      {h.note && <div className="text-muted">{h.note}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: 700, color: 'var(--secondary)' }}>
            Cancel Pre-Order
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">
            Are you sure you want to cancel this order? The reserved food quantity will be returned to the chef's batch.
          </p>
          <label className="form-label-custom">Cancellation Reason (Optional)</label>
          <textarea
            className="form-control form-control-custom"
            rows={2}
            placeholder="e.g. Schedule changed, unable to pickup"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowCancelModal(false)} disabled={cancelling}>
            Keep Order
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelOrder}
            disabled={cancelling}
          >
            {cancelling ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" /> Cancelling...
              </>
            ) : (
              'Confirm Cancellation'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
};

export default OrderTracking;
