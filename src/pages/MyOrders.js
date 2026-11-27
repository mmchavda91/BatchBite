import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';
import { formatCurrency, formatDateTime } from '../utils/helpers';
import OrderStatusBadge from '../components/OrderStatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getMyOrders();
      const list = res.data.data?.orders || res.data.orders || [];
      setOrders(list);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status);
    if (filterStatus === 'completed') return o.status === 'completed';
    if (filterStatus === 'cancelled') return ['cancelled', 'rejected'].includes(o.status);
    return o.status === filterStatus;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <div className="container">
          <h1>My Order History</h1>
          <p>Track your active pre-orders, view preparation updates, and review past orders</p>
        </div>
      </div>

      <div className="container mb-5 flex-grow-1">
        {/* Status Filter Tabs */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'active', label: 'Active / In Progress' },
            { key: 'completed', label: 'Completed' },
            { key: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`btn ${filterStatus === tab.key ? 'btn-primary-custom' : 'btn-outline-secondary'}`}
              style={{
                borderRadius: '20px',
                padding: '6px 18px',
                fontSize: '0.9rem',
                border: filterStatus === tab.key ? 'none' : '1px solid #ccc',
              }}
              onClick={() => setFilterStatus(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner text="Loading your orders..." />
        ) : filteredOrders.length === 0 ? (
          <div className="card-custom p-5 text-center">
            <div className="empty-state-icon">📋</div>
            <h4 className="fw-bold text-dark">No Orders Found</h4>
            <p className="text-muted">
              {filterStatus === 'all'
                ? "You haven't placed any food pre-orders yet."
                : `No orders matching filter '${filterStatus}'.`}
            </p>
            <Link to="/products" className="btn-primary-custom mt-2 d-inline-flex">
              Browse Available Batches 🍱
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {filteredOrders.map((order) => {
              const itemCount = order.items?.reduce((sum, it) => sum + it.quantity, 0) || 0;
              return (
                <div key={order._id} className="card-custom p-4">
                  <div className="row align-items-center g-3">
                    {/* Header info */}
                    <div className="col-md-3">
                      <span className="badge bg-light text-dark border mb-1">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </span>
                      <small className="text-muted d-block">{formatDateTime(order.createdAt)}</small>
                      <span className="fw-semibold text-secondary small">
                        {order.business?.businessName || 'Home Kitchen'}
                      </span>
                    </div>

                    {/* Items preview */}
                    <div className="col-md-4">
                      <div className="fw-semibold text-dark mb-1">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </div>
                      <div className="small text-muted" style={{ lineHeight: '1.4' }}>
                        {order.items?.map((it, idx) => (
                          <span key={idx}>
                            {it.product?.name || 'Dish'} x{it.quantity}
                            {idx < order.items.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Status & Total */}
                    <div className="col-md-3 text-md-center">
                      <div className="mb-2">
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <div className="fw-bold fs-5" style={{ color: 'var(--primary)' }}>
                        {formatCurrency(order.totalAmount)}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="col-md-2 text-md-end">
                      <Link
                        to={`/my-orders/${order._id}`}
                        className="btn-outline-primary-custom w-100 text-center text-decoration-none d-inline-block py-2"
                        style={{ fontSize: '0.9rem' }}
                      >
                        Track Order →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyOrders;
