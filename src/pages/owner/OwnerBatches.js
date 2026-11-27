import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBusinessBatches, deleteBatch } from '../../services/api';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getImageUrl,
  getErrorMessage,
} from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import { toast } from 'react-toastify';

const OwnerBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [cancelId, setCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await getBusinessBatches();
      const list = res.data.data?.batches || res.data.batches || [];
      setBatches(list);
    } catch (err) {
      console.error('Failed to load batches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBatch = async () => {
    if (!cancelId) return;
    setCancelling(true);
    try {
      await deleteBatch(cancelId);
      toast.success('Batch cancelled successfully');
      setCancelId(null);
      fetchBatches();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  };

  const filtered = batches.filter((b) => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    const map = {
      active: { bg: 'bg-success', label: 'Active' },
      closed: { bg: 'bg-secondary', label: 'Closed' },
      completed: { bg: 'bg-primary', label: 'Completed' },
      cancelled: { bg: 'bg-danger', label: 'Cancelled' },
    };
    const current = map[status] || { bg: 'bg-light text-dark', label: status };
    return <span className={`badge ${current.bg}`}>{current.label}</span>;
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--secondary)' }}>
            Food Batches Management
          </h2>
          <p className="text-muted mb-0">Schedule preparation dates, stock limits, and pickup windows</p>
        </div>

        <Link to="/owner/batches/add" className="btn-primary-custom" style={{ padding: '10px 22px' }}>
          + Create New Batch 📦
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="card-custom p-3 mb-4">
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <span className="text-muted small fw-bold me-2">Status:</span>
          {['all', 'active', 'closed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              className={`btn btn-sm text-capitalize ${
                filterStatus === st ? 'btn-primary-custom text-white' : 'btn-outline-secondary'
              }`}
              style={{ borderRadius: '20px', padding: '5px 16px' }}
              onClick={() => setFilterStatus(st)}
            >
              {st}
            </button>
          ))}
          <span className="ms-auto text-muted small">
            {filtered.length} batch{filtered.length === 1 ? '' : 'es'}
          </span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Loading your kitchen batches..." />
      ) : filtered.length === 0 ? (
        <div className="card-custom p-5 text-center">
          <div style={{ fontSize: '3rem' }}>📦</div>
          <h4 className="fw-bold mt-2">No Batches Found</h4>
          <p className="text-muted">
            {filterStatus === 'all'
              ? 'You have not scheduled any food batches yet.'
              : `No batches found with status '${filterStatus}'.`}
          </p>
          <Link to="/owner/batches/add" className="btn-primary-custom d-inline-flex mt-2">
            Schedule a Fresh Batch
          </Link>
        </div>
      ) : (
        <div className="card-custom overflow-hidden">
          <div className="table-responsive">
            <table className="table table-custom table-hover mb-0">
              <thead>
                <tr>
                  <th>Batch / Dish</th>
                  <th>Prep Date</th>
                  <th>Stock & Reserved</th>
                  <th>Price</th>
                  <th>Order Deadline</th>
                  <th>Pickup Info</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const img = getImageUrl(b.product?.image);
                  const isDeadlinePassed = new Date(b.orderDeadline) < new Date();

                  return (
                    <tr key={b._id}>
                      <td>
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
                              fontSize: '1.4rem',
                              flexShrink: 0,
                            }}
                          >
                            {img ? (
                              <img
                                src={img}
                                alt={b.batchName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              '🍱'
                            )}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{b.batchName}</div>
                            <small className="text-muted">{b.product?.name}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong className="text-dark">{formatDate(b.preparationDate)}</strong>
                      </td>
                      <td>
                        <div>
                          <strong className={b.availableQuantity < 5 ? 'text-danger' : 'text-success'}>
                            {b.availableQuantity}
                          </strong>
                          <span className="text-muted"> / {b.totalQuantity} avail</span>
                        </div>
                        {b.reservedQuantity > 0 && (
                          <small className="text-muted d-block">
                            ({b.reservedQuantity} reserved)
                          </small>
                        )}
                      </td>
                      <td>
                        <strong style={{ color: 'var(--primary)' }}>
                          {formatCurrency(b.pricePerUnit)}
                        </strong>
                      </td>
                      <td>
                        <small className={isDeadlinePassed ? 'text-danger fw-semibold' : 'text-muted'}>
                          {formatDateTime(b.orderDeadline)}
                        </small>
                      </td>
                      <td>
                        <small className="text-dark d-block">
                          {b.pickupStartTime} - {b.pickupEndTime}
                        </small>
                        <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '140px' }}>
                          {b.pickupLocation}
                        </small>
                      </td>
                      <td>{getStatusBadge(b.status)}</td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Link
                            to={`/owner/batches/edit/${b._id}`}
                            className="btn btn-sm btn-outline-secondary"
                            style={{ borderRadius: '6px' }}
                          >
                            Edit ✏️
                          </Link>
                          {b.status === 'active' && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              style={{ borderRadius: '6px' }}
                              onClick={() => setCancelId(b._id)}
                            >
                              Cancel ✕
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      <ConfirmModal
        show={!!cancelId}
        onHide={() => setCancelId(null)}
        onConfirm={handleCancelBatch}
        title="Cancel Food Batch"
        message="Are you sure you want to cancel this batch? Customers will not be able to place new pre-orders for this batch."
        confirmText="Yes, Cancel Batch"
        confirmVariant="danger"
        loading={cancelling}
      />
    </div>
  );
};

export default OwnerBatches;
