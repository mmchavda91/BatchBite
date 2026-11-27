import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../services/api';
import { formatCurrency, formatDateTime } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import OrderStatusBadge from '../components/OrderStatusBadge';
import Footer from '../components/Footer';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrder(id);
        const data = res.data.data?.order || res.data.order || res.data;
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order confirmation:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <LoadingSpinner fullPage text="Retrieving your order confirmation..." />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="container py-5 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card-custom p-4 p-md-5 text-center mb-4">
              <div className="success-icon">
                🎉
              </div>
              <h1 className="fw-bold mb-2" style={{ color: 'var(--secondary)' }}>
                Pre-Order Confirmed!
              </h1>
              <p className="text-muted fs-6 mb-4">
                Thank you! Your batch reservation has been submitted to the home chef.
              </p>

              <div className="p-3 rounded-3 mb-4 d-inline-block text-start w-100" style={{ background: 'var(--cream)', border: '1px solid #ebddcd' }}>
                <div className="row g-2 align-items-center">
                  <div className="col-sm-6">
                    <span className="text-muted small d-block">Order Reference:</span>
                    <strong className="text-dark">#{order?._id}</strong>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <span className="text-muted small d-block mb-1">Current Status:</span>
                    <OrderStatusBadge status={order?.status || 'pending'} />
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="text-start mb-4">
                <h5 className="fw-bold mb-3" style={{ color: 'var(--secondary)' }}>
                  Ordered Items
                </h5>
                <div className="border rounded-3 p-3 bg-white">
                  {order?.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="d-flex justify-content-between align-items-center py-2 border-bottom"
                    >
                      <div>
                        <strong className="text-dark">{item.product?.name || 'Dish'}</strong>
                        <div className="small text-muted">
                          Batch: {item.batch?.batchName || 'Fresh Batch'} | Qty: {item.quantity}
                        </div>
                      </div>
                      <span className="fw-bold" style={{ color: 'var(--primary)' }}>
                        {formatCurrency(item.subtotal || item.pricePerUnit * item.quantity)}
                      </span>
                    </div>
                  ))}

                  <div className="d-flex justify-content-between pt-3">
                    <strong className="fs-5 text-dark">Total Amount:</strong>
                    <strong className="fs-5" style={{ color: 'var(--primary)' }}>
                      {formatCurrency(order?.totalAmount)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Pickup & Chef Details */}
              <div className="text-start mb-4 p-3 rounded-3 bg-light">
                <h6 className="fw-bold text-dark mb-2">📍 Pickup & Contact Info:</h6>
                <div className="small text-muted mb-1">
                  <strong>Kitchen:</strong> {order?.business?.businessName || 'Local Home Kitchen'}
                </div>
                {order?.pickupDetails && (
                  <div className="small text-muted mb-1">
                    <strong>Your Notes:</strong> {order.pickupDetails}
                  </div>
                )}
                <div className="small text-muted">
                  <strong>Order Placed:</strong> {formatDateTime(order?.createdAt)}
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link
                  to={`/my-orders/${order?._id}`}
                  className="btn-primary-custom"
                  style={{ padding: '12px 30px' }}
                >
                  Track Order Status 🚚
                </Link>
                <Link
                  to="/products"
                  className="btn-outline-primary-custom"
                  style={{ padding: '10px 24px' }}
                >
                  Browse More Batches 🍱
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
