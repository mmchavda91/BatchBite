import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { FiPrinter, FiDollarSign, FiShoppingBag, FiCheckCircle, FiActivity } from 'react-icons/fi';

const SalesReport = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getDashboardStats();
      setStats(res.data.data || res.data);
    } catch (err) {
      console.error('Failed to load sales stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage text="Generating your kitchen sales report..." />;

  const {
    totalRevenue = 0,
    completedOrders = 0,
    totalOrders = 0,
    pendingOrders = 0,
    dailySales = [],
  } = stats || {};

  const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

  const chartData = dailySales.map((d) => ({
    date: formatDate(d._id),
    revenue: d.revenue,
    orders: d.orders,
  }));

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--secondary)' }}>
            Sales & Revenue Analytics
          </h2>
          <p className="text-muted mb-0">Track order fulfillment, average ticket size, and 7-day revenue performance</p>
        </div>

        <button
          className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
          onClick={() => window.print()}
          style={{ borderRadius: '8px' }}
        >
          <FiPrinter /> Print / Save Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="card-custom p-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-bold text-uppercase">Total Sales</span>
              <FiDollarSign size={20} color="var(--primary)" />
            </div>
            <h3 className="fw-bold mb-1" style={{ color: 'var(--primary)' }}>
              {formatCurrency(totalRevenue)}
            </h3>
            <small className="text-muted">From {completedOrders} fulfilled orders</small>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card-custom p-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-bold text-uppercase">Average Value</span>
              <FiActivity size={20} color="var(--secondary)" />
            </div>
            <h3 className="fw-bold mb-1" style={{ color: 'var(--secondary)' }}>
              {formatCurrency(avgOrderValue)}
            </h3>
            <small className="text-muted">Per completed customer order</small>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card-custom p-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-bold text-uppercase">Total Orders</span>
              <FiShoppingBag size={20} />
            </div>
            <h3 className="fw-bold mb-1 text-dark">
              {totalOrders}
            </h3>
            <small className="text-muted">{completedOrders} completed, {pendingOrders} pending</small>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card-custom p-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-bold text-uppercase">Fulfillment Rate</span>
              <FiCheckCircle size={20} className="text-success" />
            </div>
            <h3 className="fw-bold mb-1 text-success">
              {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}%
            </h3>
            <small className="text-muted">Successfully delivered</small>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Charts */}
      <div className="row g-4 mb-4">
        {/* Revenue Bar Chart */}
        <div className="col-lg-7">
          <div className="card-custom p-4 h-100">
            <h5 className="fw-bold mb-3" style={{ color: 'var(--secondary)' }}>
              Daily Revenue Performance (₹)
            </h5>
            {chartData.length > 0 ? (
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#666', fontSize: 12 }} />
                    <Tooltip
                      formatter={(val) => [formatCurrency(val), 'Revenue']}
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Daily Sales (₹)" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <p>No completed sales records in the last 7 days.</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Volume Line Chart */}
        <div className="col-lg-5">
          <div className="card-custom p-4 h-100">
            <h5 className="fw-bold mb-3" style={{ color: 'var(--secondary)' }}>
              Order Volume Trend
            </h5>
            {chartData.length > 0 ? (
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: '#666', fontSize: 12 }} />
                    <Tooltip
                      formatter={(val) => [val, 'Orders']}
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      name="Order Count"
                      stroke="var(--secondary)"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <p>No order transactions recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daily Breakdown Table */}
      <div className="card-custom p-4">
        <h5 className="fw-bold mb-3" style={{ color: 'var(--secondary)' }}>
          Daily Sales Breakdown
        </h5>

        {dailySales.length === 0 ? (
          <p className="text-muted mb-0">No daily transaction records found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-custom table-hover mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Fulfilled Orders</th>
                  <th>Total Daily Revenue</th>
                  <th>Average Value</th>
                </tr>
              </thead>
              <tbody>
                {dailySales.map((d) => (
                  <tr key={d._id}>
                    <td>
                      <strong className="text-dark">{formatDate(d._id)}</strong>
                    </td>
                    <td>{d.orders} orders</td>
                    <td>
                      <strong style={{ color: 'var(--primary)' }}>
                        {formatCurrency(d.revenue)}
                      </strong>
                    </td>
                    <td>{formatCurrency(d.orders > 0 ? d.revenue / d.orders : 0)}</td>
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

export default SalesReport;
