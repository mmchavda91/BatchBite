import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBatch, updateBatch } from '../../services/api';
import { getErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const EditBatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    batchName: '',
    pricePerUnit: '',
    preparationDate: '',
    pickupStartTime: '',
    pickupEndTime: '',
    orderDeadline: '',
    pickupLocation: '',
    notes: '',
    status: 'active',
  });

  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchBatch = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getBatch(id);
      const b = res.data.data?.batch || res.data.batch || res.data;

      setProductName(b.product?.name || 'Dish');

      // Format preparation date
      const prepDate = b.preparationDate
        ? new Date(b.preparationDate).toISOString().split('T')[0]
        : '';

      // Format order deadline
      const deadline = b.orderDeadline
        ? new Date(b.orderDeadline).toISOString().slice(0, 16)
        : '';

      setFormData({
        batchName: b.batchName || '',
        pricePerUnit: b.pricePerUnit || '',
        preparationDate: prepDate,
        pickupStartTime: b.pickupStartTime || '',
        pickupEndTime: b.pickupEndTime || '',
        orderDeadline: deadline,
        pickupLocation: b.pickupLocation || '',
        notes: b.notes || '',
        status: b.status || 'active',
      });
    } catch (err) {
      toast.error('Failed to load batch details');
      navigate('/owner/batches');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchBatch();
  }, [fetchBatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.batchName.trim()) errs.batchName = 'Batch name is required';
    if (!formData.pricePerUnit || Number(formData.pricePerUnit) <= 0) {
      errs.pricePerUnit = 'Price per unit is required';
    }
    if (!formData.preparationDate) errs.preparationDate = 'Preparation date is required';
    if (!formData.orderDeadline) errs.orderDeadline = 'Order deadline is required';
    if (!formData.pickupLocation.trim()) errs.pickupLocation = 'Pickup location is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        batchName: formData.batchName,
        pricePerUnit: Number(formData.pricePerUnit),
        preparationDate: formData.preparationDate,
        pickupStartTime: formData.pickupStartTime,
        pickupEndTime: formData.pickupEndTime,
        orderDeadline: formData.orderDeadline,
        pickupLocation: formData.pickupLocation,
        notes: formData.notes,
        status: formData.status,
      };

      await updateBatch(id, payload);
      toast.success('Food batch updated successfully! 📦');
      navigate('/owner/batches');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage text="Loading batch details..." />;

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/owner/batches" className="btn btn-sm btn-outline-secondary" style={{ borderRadius: '8px' }}>
          ← Back to Batches
        </Link>
        <div>
          <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary)' }}>
            Edit Food Batch
          </h2>
          <small className="text-muted">Dish: {productName}</small>
        </div>
      </div>

      <div className="card-custom p-4 p-md-5" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label-custom">Batch Title / Name *</label>
              <input
                type="text"
                name="batchName"
                className="form-control form-control-custom"
                value={formData.batchName}
                onChange={handleChange}
              />
              {errors.batchName && <div className="form-error">{errors.batchName}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Price Per Serving (₹) *</label>
              <input
                type="number"
                name="pricePerUnit"
                className="form-control form-control-custom"
                value={formData.pricePerUnit}
                onChange={handleChange}
                min="1"
              />
              {errors.pricePerUnit && <div className="form-error">{errors.pricePerUnit}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Preparation Date *</label>
              <input
                type="date"
                name="preparationDate"
                className="form-control form-control-custom"
                value={formData.preparationDate}
                onChange={handleChange}
              />
              {errors.preparationDate && <div className="form-error">{errors.preparationDate}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Order Closing Deadline *</label>
              <input
                type="datetime-local"
                name="orderDeadline"
                className="form-control form-control-custom"
                value={formData.orderDeadline}
                onChange={handleChange}
              />
              {errors.orderDeadline && <div className="form-error">{errors.orderDeadline}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Pickup Start Time</label>
              <input
                type="text"
                name="pickupStartTime"
                className="form-control form-control-custom"
                value={formData.pickupStartTime}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Pickup End Time</label>
              <input
                type="text"
                name="pickupEndTime"
                className="form-control form-control-custom"
                value={formData.pickupEndTime}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Batch Operational Status</label>
              <select
                name="status"
                className="form-select form-control-custom"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active (Open for pre-orders)</option>
                <option value="closed">Closed (Stop taking orders)</option>
                <option value="completed">Completed (Cooked & Picked up)</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Pickup Location *</label>
              <input
                type="text"
                name="pickupLocation"
                className="form-control form-control-custom"
                value={formData.pickupLocation}
                onChange={handleChange}
              />
              {errors.pickupLocation && <div className="form-error">{errors.pickupLocation}</div>}
            </div>

            <div className="col-12">
              <label className="form-label-custom">Notes for Customers</label>
              <textarea
                name="notes"
                rows={2}
                className="form-control form-control-custom"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 pt-3 border-top d-flex gap-3">
              <button
                type="submit"
                className="btn-primary-custom"
                disabled={saving}
                style={{ padding: '12px 32px' }}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              <Link to="/owner/batches" className="btn btn-outline-secondary py-2 px-4" style={{ borderRadius: '8px' }}>
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBatch;
