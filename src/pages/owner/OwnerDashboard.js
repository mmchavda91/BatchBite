import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getBusinessBatches } from '../../services/api';
import { formatCurrency, formatDateTime, formatDate } from '../../utils/helpers';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  FiDollarSign,
  FiShoppingBag,
  FiClock,
  FiLayers,
  FiAlertTriangle,
  FiPlus,
  FiArrowRight,
} from 'react-icons/fi';

const OwnerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [lowStockBatches, setLowStockBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, batchesRes] = await Promise.all([
        getDashboardStats(),
        getBusinessBatches(),
      ]);

      setStats(statsRes.data.data || statsRes.data);
      const allBatches = batchesRes.data.data?.batches || batchesRes.data.batches || [];
      const lowStock = allBatches.filter(
        (b) => b.status === 'active' && b.availableQuantity > 0 && b.availableQuantity < 5
      );
      setLowStockBatches(lowStock);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage text="Loading your kitchen dashboard..." />;

  const {
    totalOrders = 0,
    pendingOrders = 0,
    completedOrders = 0,
    totalRevenue = 0,
    totalProducts = 0,
    totalBatches = 0,
    recentOrders = [],
    dailySales = [],
  } = stats || {};

  // Format daily sales for Recharts
  const chartData = dailySales.map((d) => ({
    date: formatDate(d._id),
    revenue: d.revenue,
    orders: d.orders,
  }));

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--secondary)' }}>
            Kitchen Dashboard
          </h2>
          <p className="text-muted mb-0">Overview of your food business orders, batches, and revenue</p>
        </div>

        <div className="d-flex gap-2">
          <Link to="/owner/products/add" className="btn-outline-primary-custom d-inline-flex align-items-center gap-1" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
            <FiPlus /> Add Product
          </Link>
          <Link to="/owner/batches/add" className="btn-primary-custom d-inline-flex align-items-center gap-1" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
            <FiPlus /> Create Batch
          </Link>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockBatches.length > 0 && (
        <div className="low-stock-alert mb-4">
          <FiAlertTriangle size={24} className="text-warning flex-shrink-0" />
          <div>
            <strong>Low Batch Availability Alert:</strong>{' '}
            {lowStockBatches.map((b) => (
              <span key={b._id} className="me-2">
                "{b.batchName}" has only <strong>{b.availableQuantity}</strong> units remaining.
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="card-custom p-4">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small fw-bold text-uppercase">Total Sales</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(232, 160, 32, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiDollarSign size={22} color="var(--primary)" />
              </div>
            </div>
            <h3 className="fw-bold mb-1" style={{ color: 'var(--primary)' }}>
              {formatCurrency(totalRevenue)}
            </h3>
            <small className="text-muted">From {completedOrders} completed orders</small>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card-custom p-4">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small fw-bold text-uppercase">Total Orders</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(45, 80, 22, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiShoppingBag size={22} color="var(--secondary)" />
              </div>
            </div>
            <h3 className="fw-bold mb-1" style={{ color: 'var(--secondary)' }}>
              {totalOrders}
            </h3>
            <small className="text-muted">All-time received pre-orders</small>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card-custom p-4">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small fw-bold text-uppercase">Pending Orders</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 193, 7, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiClock size={22} className="text-warning" />
              </div>
            </div>
            <h3 className="fw-bold mb-1 text-warning">
              {pendingOrders}
            </h3>
            <small className="text-muted">Awaiting confirmation</small>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card-custom p-4">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small fw-bold text-uppercase">Active Catalog</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(13, 110, 253, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiLayers size={22} className="text-primary" />
              </div>
            </div>
            <h3 className="fw-bold mb-1" style={{ color: 'var(--secondary)' }}>
              {totalProducts} <small className="fs-6 fw-normal text-muted">items</small>
            </h3>
            <small className="text-muted">{totalBatches} total scheduled batches</small>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="card-custom p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-bold mb-0" style={{ color: 'var(--secondary)' }}>
              7-Day Sales Revenue (Recharts)
            </h5>
            <small className="text-muted">Visual daily sales breakdown</small>
          </div>
          <Link to="/owner/reports" className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1">
            Full Reports <FiArrowRight />
          </Link>
        </div>

        {chartData.length > 0 ? (
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fill: '#777', fontSize: 12 }} />
                <YAxis tick={{ fill: '#777', fontSize: 12 }} />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-4 text-muted">
            <p className="mb-0">No sales recorded yet. Once orders are completed, your revenue graph will appear here!</p>
          </div>
        )}
      </div>

      {/* Recent Orders Table */}
      <div className="card-custom p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-0" style={{ color: 'var(--secondary)' }}>
              Recent Customer Orders
            </h5>
            <small className="text-muted">Latest 10 pre-orders received</small>
          </div>
          <Link to="/owner/orders" className="btn btn-sm btn-outline-secondary" style={{ borderRadius: '8px' }}>
            View All Orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <div style={{ fontSize: '2.5rem' }}>📋</div>
            <p className="mt-2 mb-0">No customer orders placed yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-custom table-hover mb-0">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items Summary</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord._id}>
                    <td>
                      <span className="badge bg-light text-dark border">
                        #{ord._id.substring(ord._id.length - 6).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{ord.customer?.name || 'Customer'}</div>
                      <small className="text-muted">{ord.customer?.email}</small>
                    </td>
                    <td>
                      <small className="text-muted">
                        {ord.items?.map((it, idx) => (
                          <span key={idx}>
                            {it.product?.name || 'Item'} (x{it.quantity})
                            {idx < ord.items.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </small>
                    </td>
                    <td>
                      <strong className="text-dark">{formatCurrency(ord.totalAmount)}</strong>
                    </td>
                    <td>
                      <OrderStatusBadge status={ord.status} />
                    </td>
                    <td>
                      <small className="text-muted">{formatDateTime(ord.createdAt)}</small>
                    </td>
                    <td>
                      <Link
                        to="/owner/orders"
                        className="btn btn-sm btn-outline-primary"
                        style={{ borderRadius: '6px', fontSize: '0.8rem' }}
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
