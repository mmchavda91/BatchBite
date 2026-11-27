import React, { useState, useEffect } from 'react';
import { getBusinessOrders, updateOrderStatus } from '../../services/api';
import {
  formatCurrency,
  formatDateTime,
  getErrorMessage,
} from '../../utils/helpers';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const VALID_TRANSITIONS = {
  pending: [
    { value: 'confirmed', label: 'Confirm Order' },
    { value: 'rejected', label: 'Reject Order (Restore Stock)' },
    { value: 'cancelled', label: 'Cancel Order' },
  ],
  confirmed: [
    { value: 'preparing', label: 'Mark as Preparing 👨‍🍳' },
    { value: 'rejected', label: 'Reject Order' },
    { value: 'cancelled', label: 'Cancel Order' },
  ],
  preparing: [
    { value: 'ready', label: 'Mark Ready for Pickup 🍱' },
    { value: 'cancelled', label: 'Cancel Order' },
  ],
  ready: [
    { value: 'completed', label: 'Mark as Completed / Picked Up ✔️' },
    { value: 'cancelled', label: 'Cancel Order' },
  ],
  completed: [],
  cancelled: [],
  rejected: [],
};

const OwnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getBusinessOrders();
      const list = res.data.data?.orders || res.data.orders || [];
      setOrders(list);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (ord) => {
    setSelectedOrder(ord);
    const options = VALID_TRANSITIONS[ord.status] || [];
    setNewStatus(options.length > 0 ? options[0].value : '');
    setStatusNote('');
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    setUpdating(true);
    try {
      await updateOrderStatus(selectedOrder._id, {
        status: newStatus,
        note: statusNote,
      });
      toast.success(`Order status updated to '${newStatus}'!`);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  const filtered = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--secondary)' }}>
            Customer Orders Pipeline
          </h2>
          <p className="text-muted mb-0">Manage incoming pre-orders, kitchen preparation, and pickups</p>
        </div>

        <button
          className="btn btn-outline-secondary"
          onClick={fetchOrders}
          style={{ borderRadius: '8px' }}
        >
          🔄 Refresh Orders
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="card-custom p-3 mb-4">
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <span className="text-muted small fw-bold me-2">Filter:</span>
          {[
            'all',
            'pending',
            'confirmed',
            'preparing',
            'ready',
            'completed',
            'cancelled',
            'rejected',
          ].map((st) => (
            <button
              key={st}
              className={`btn btn-sm text-capitalize ${
                filterStatus === st ? 'btn-primary-custom text-white' : 'btn-outline-secondary'
              }`}
              style={{ borderRadius: '20px', padding: '5px 14px', fontSize: '0.85rem' }}
              onClick={() => setFilterStatus(st)}
            >
              {st}
            </button>
          ))}
          <span className="ms-auto text-muted small">
            Showing {filtered.length} of {orders.length} orders
          </span>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <LoadingSpinner text="Loading customer orders..." />
      ) : filtered.length === 0 ? (
        <div className="card-custom p-5 text-center">
          <div style={{ fontSize: '3rem' }}>📋</div>
          <h4 className="fw-bold mt-2">No Orders Found</h4>
          <p className="text-muted">
            {filterStatus === 'all'
              ? 'No customer orders have been received yet.'
              : `No orders currently in '${filterStatus}' status.`}
          </p>
        </div>
      ) : (
        <div className="card-custom overflow-hidden">
          <div className="table-responsive">
            <table className="table table-custom table-hover mb-0">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer Info</th>
                  <th>Ordered Items & Batches</th>
                  <th>Total Amount</th>
                  <th>Special Instructions</th>
                  <th>Status</th>
                  <th>Order Date</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ord) => {
                  const allowed = VALID_TRANSITIONS[ord.status] || [];
                  return (
                    <tr key={ord._id}>
                      <td>
                        <span className="badge bg-light text-dark border">
                          #{ord._id.substring(ord._id.length - 6).toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{ord.customer?.name || 'Customer'}</div>
                        <small className="text-muted d-block">{ord.customer?.phone || 'No phone'}</small>
                        <small className="text-muted">{ord.customer?.email}</small>
                      </td>
                      <td>
                        <div className="small">
                          {ord.items?.map((it, idx) => (
                            <div key={idx} className="mb-1">
                              <strong>{it.quantity}x</strong> {it.product?.name || 'Dish'}
                              <span className="text-muted"> ({it.batch?.batchName || 'Batch'})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong className="fs-6" style={{ color: 'var(--primary)' }}>
                          {formatCurrency(ord.totalAmount)}
                        </strong>
                      </td>
                      <td>
                        <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '160px' }}>
                          {ord.specialInstructions || ord.pickupDetails || '—'}
                        </small>
                      </td>
                      <td>
                        <OrderStatusBadge status={ord.status} />
                      </td>
                      <td>
                        <small className="text-muted">{formatDateTime(ord.createdAt)}</small>
                      </td>
                      <td className="text-end">
                        {allowed.length > 0 ? (
                          <button
                            className="btn btn-sm btn-primary-custom"
                            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                            onClick={() => handleOpenModal(ord)}
                          >
                            Update Status ⚡
                          </button>
                        ) : (
                          <span className="badge bg-light text-muted border">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Order Status Modal */}
      <Modal show={!!selectedOrder} onHide={() => setSelectedOrder(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: 700, color: 'var(--secondary)' }}>
            Update Order #{selectedOrder?._id.substring(selectedOrder._id.length - 6).toUpperCase()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <span className="text-muted small d-block">Current Status:</span>
            <OrderStatusBadge status={selectedOrder?.status} />
          </div>

          <div className="mb-3">
            <label className="form-label-custom">New Operational Status *</label>
            <select
              className="form-select form-control-custom"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {(VALID_TRANSITIONS[selectedOrder?.status] || []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label-custom">Status Note / Kitchen Update (Optional)</label>
            <textarea
              className="form-control form-control-custom"
              rows={2}
              placeholder="e.g. Biryani is in dum; ready for collection in 20 minutes."
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setSelectedOrder(null)}>
            Cancel
          </Button>
          <Button
            className="btn-primary-custom"
            onClick={handleUpdateStatus}
            disabled={updating}
          >
            {updating ? 'Saving...' : 'Apply Status Update'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OwnerOrders;
