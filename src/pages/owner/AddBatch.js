import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createBatch, getProducts, getBusinessProfile } from '../../services/api';
import { getErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const AddBatch = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Tomorrow date as default prep date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Tomorrow 10 AM deadline
  const deadlineDefault = new Date(tomorrow);
  deadlineDefault.setHours(10, 0, 0, 0);
  const deadlineStr = deadlineDefault.toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    product: '',
    batchName: '',
    totalQuantity: '20',
    pricePerUnit: '',
    preparationDate: tomorrowStr,
    pickupStartTime: '12:30 PM',
    pickupEndTime: '03:00 PM',
    orderDeadline: deadlineStr,
    pickupLocation: '',
    notes: '',
  });

  useEffect(() => {
    loadPrerequisites();
  }, []);

  const loadPrerequisites = async () => {
    setLoading(true);
    try {
      const bizRes = await getBusinessProfile();
      const biz = bizRes.data.data?.business || bizRes.data.business;
      const bizId = biz?._id;

      const prodRes = await getProducts({ business: bizId, isAvailable: true });
      const prodList = prodRes.data.data?.products || prodRes.data.products || [];
      setProducts(prodList);

      if (prodList.length > 0) {
        setFormData((prev) => ({
          ...prev,
          product: prodList[0]._id,
          batchName: `${prodList[0].name} - Fresh Batch`,
          pricePerUnit: prodList[0].price,
          pickupLocation: biz?.address || 'Kitchen Pickup Counter',
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          pickupLocation: biz?.address || 'Kitchen Pickup Counter',
        }));
      }
    } catch (err) {
      console.error('Failed to load products for batch:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (e) => {
    const prodId = e.target.value;
    const selected = products.find((p) => p._id === prodId);
    setFormData((prev) => ({
      ...prev,
      product: prodId,
      batchName: selected ? `${selected.name} - Fresh Batch` : prev.batchName,
      pricePerUnit: selected ? selected.price : prev.pricePerUnit,
    }));
    if (errors.product) setErrors((prev) => ({ ...prev, product: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.product) errs.product = 'Please select a dish';
    if (!formData.batchName.trim()) errs.batchName = 'Batch name is required';
    if (!formData.totalQuantity || Number(formData.totalQuantity) <= 0) {
      errs.totalQuantity = 'Quantity must be at least 1';
    }
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
        product: formData.product,
        batchName: formData.batchName,
        totalQuantity: Number(formData.totalQuantity),
        pricePerUnit: Number(formData.pricePerUnit),
        preparationDate: formData.preparationDate,
        pickupStartTime: formData.pickupStartTime,
        pickupEndTime: formData.pickupEndTime,
        orderDeadline: formData.orderDeadline,
        pickupLocation: formData.pickupLocation,
        notes: formData.notes,
      };

      await createBatch(payload);
      toast.success('Food batch scheduled successfully! 📦');
      navigate('/owner/batches');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage text="Preparing batch setup..." />;

  if (products.length === 0) {
    return (
      <div className="card-custom p-5 text-center" style={{ maxWidth: '600px', margin: '40px auto' }}>
        <div style={{ fontSize: '3rem' }}>🍲</div>
        <h4 className="fw-bold mt-2">No Active Food Products</h4>
        <p className="text-muted">
          You need at least one dish in your product catalog before scheduling a batch.
        </p>
        <Link to="/owner/products/add" className="btn-primary-custom d-inline-flex mt-2">
          Create a Food Product First
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/owner/batches" className="btn btn-sm btn-outline-secondary" style={{ borderRadius: '8px' }}>
          ← Back to Batches
        </Link>
        <div>
          <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary)' }}>
            Schedule New Food Batch
          </h2>
          <small className="text-muted">Open pre-orders for a planned cooking date</small>
        </div>
      </div>

      <div className="card-custom p-4 p-md-5" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-4">
            {/* Dish Selection */}
            <div className="col-md-6">
              <label className="form-label-custom">Select Dish from Catalog *</label>
              <select
                name="product"
                className="form-select form-control-custom"
                value={formData.product}
                onChange={handleProductChange}
              >
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.category}) - ₹{p.price}
                  </option>
                ))}
              </select>
              {errors.product && <div className="form-error">{errors.product}</div>}
            </div>

            {/* Batch Name */}
            <div className="col-md-6">
              <label className="form-label-custom">Batch Title / Name *</label>
              <input
                type="text"
                name="batchName"
                className="form-control form-control-custom"
                placeholder="e.g. Friday Lunch Dum Biryani Special"
                value={formData.batchName}
                onChange={handleChange}
              />
              {errors.batchName && <div className="form-error">{errors.batchName}</div>}
            </div>

            {/* Quantity & Price */}
            <div className="col-md-6">
              <label className="form-label-custom">Total Available Quantity (Servings) *</label>
              <input
                type="number"
                name="totalQuantity"
                className="form-control form-control-custom"
                placeholder="20"
                min="1"
                value={formData.totalQuantity}
                onChange={handleChange}
              />
              {errors.totalQuantity && <div className="form-error">{errors.totalQuantity}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Price Per Serving (₹) *</label>
              <input
                type="number"
                name="pricePerUnit"
                className="form-control form-control-custom"
                placeholder="250"
                min="1"
                value={formData.pricePerUnit}
                onChange={handleChange}
              />
              {errors.pricePerUnit && <div className="form-error">{errors.pricePerUnit}</div>}
            </div>

            {/* Dates & Deadlines */}
            <div className="col-md-6">
              <label className="form-label-custom">Planned Preparation Date *</label>
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
              <label className="form-label-custom">Pre-Order Closing Deadline *</label>
              <input
                type="datetime-local"
                name="orderDeadline"
                className="form-control form-control-custom"
                value={formData.orderDeadline}
                onChange={handleChange}
              />
              {errors.orderDeadline && <div className="form-error">{errors.orderDeadline}</div>}
              <small className="text-muted">Customers cannot pre-order past this time.</small>
            </div>

            {/* Pickup Window */}
            <div className="col-md-6">
              <label className="form-label-custom">Pickup Window Start Time</label>
              <input
                type="text"
                name="pickupStartTime"
                className="form-control form-control-custom"
                placeholder="e.g. 12:30 PM"
                value={formData.pickupStartTime}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Pickup Window End Time</label>
              <input
                type="text"
                name="pickupEndTime"
                className="form-control form-control-custom"
                placeholder="e.g. 03:00 PM"
                value={formData.pickupEndTime}
                onChange={handleChange}
              />
            </div>

            {/* Pickup Location */}
            <div className="col-12">
              <label className="form-label-custom">Pickup Address / Location Details *</label>
              <input
                type="text"
                name="pickupLocation"
                className="form-control form-control-custom"
                placeholder="e.g. Flat 302, Green Valley Apartments, Indiranagar"
                value={formData.pickupLocation}
                onChange={handleChange}
              />
              {errors.pickupLocation && <div className="form-error">{errors.pickupLocation}</div>}
            </div>

            {/* Chef Notes */}
            <div className="col-12">
              <label className="form-label-custom">Special Batch Notes (Optional)</label>
              <textarea
                name="notes"
                rows={2}
                className="form-control form-control-custom"
                placeholder="e.g. Containers are eco-friendly microwave-safe; extra raita included."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            {/* Submit */}
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
                    Scheduling Batch...
                  </>
                ) : (
                  'Schedule Batch 📦'
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

export default AddBatch;
