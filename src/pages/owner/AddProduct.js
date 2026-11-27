import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct, uploadProductImage } from '../../services/api';
import { FOOD_CATEGORIES, getErrorMessage } from '../../utils/helpers';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Indian',
    preparationTime: '45 mins',
    allergens: '',
    isAvailable: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Dish name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Valid price is required';
    if (!formData.category) errs.category = 'Category is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be smaller than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        preparationTime: formData.preparationTime,
        allergens: formData.allergens
          ? formData.allergens.split(',').map((a) => a.trim()).filter(Boolean)
          : [],
        isAvailable: formData.isAvailable,
      };

      const res = await createProduct(payload);
      const created = res.data.data?.product || res.data.product || res.data;

      // If image selected, upload image
      if (imageFile && created?._id) {
        const data = new FormData();
        data.append('image', imageFile);
        await uploadProductImage(created._id, data);
      }

      toast.success('Food product created successfully! 🍱');
      navigate('/owner/products');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/owner/products" className="btn btn-sm btn-outline-secondary" style={{ borderRadius: '8px' }}>
          ← Back to Catalog
        </Link>
        <div>
          <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary)' }}>
            Add New Food Product
          </h2>
          <small className="text-muted">Create a dish recipe template to schedule into batches</small>
        </div>
      </div>

      <div className="card-custom p-4 p-md-5" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-4">
            {/* Dish Name */}
            <div className="col-12">
              <label className="form-label-custom">Dish / Product Name *</label>
              <input
                type="text"
                name="name"
                className="form-control form-control-custom"
                placeholder="e.g. Hyderabadi Dum Biryani"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label-custom">Detailed Description *</label>
              <textarea
                name="description"
                rows={3}
                className="form-control form-control-custom"
                placeholder="Describe your dish, special spices, ingredients, portion size..."
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>

            {/* Price & Category */}
            <div className="col-md-6">
              <label className="form-label-custom">Base Price per Serving (₹) *</label>
              <input
                type="number"
                name="price"
                className="form-control form-control-custom"
                placeholder="250"
                value={formData.price}
                onChange={handleChange}
                min="1"
              />
              {errors.price && <div className="form-error">{errors.price}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Cuisine Category *</label>
              <select
                name="category"
                className="form-select form-control-custom"
                value={formData.category}
                onChange={handleChange}
              >
                {FOOD_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <div className="form-error">{errors.category}</div>}
            </div>

            {/* Preparation Time & Allergens */}
            <div className="col-md-6">
              <label className="form-label-custom">Average Prep Time</label>
              <input
                type="text"
                name="preparationTime"
                className="form-control form-control-custom"
                placeholder="e.g. 45 mins"
                value={formData.preparationTime}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Allergens (Comma Separated)</label>
              <input
                type="text"
                name="allergens"
                className="form-control form-control-custom"
                placeholder="e.g. Dairy, Nuts, Gluten"
                value={formData.allergens}
                onChange={handleChange}
              />
            </div>

            {/* Product Image Upload */}
            <div className="col-12">
              <label className="form-label-custom">Product Photo</label>
              <input
                type="file"
                accept="image/*"
                className="form-control form-control-custom"
                onChange={handleImageChange}
              />
              <small className="text-muted">Accepts JPG, PNG, WEBP (Max 5MB)</small>

              {imagePreview && (
                <div className="img-preview-wrapper mt-3">
                  <img src={imagePreview} alt="Dish preview" />
                  <small className="d-block text-success mt-1 fw-semibold">Photo ready for upload</small>
                </div>
              )}
            </div>

            {/* Availability Toggle */}
            <div className="col-12">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                />
                <label className="form-check-label fw-semibold text-dark" htmlFor="isAvailable">
                  Active & Available for Batch Creation
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="col-12 pt-3 border-top d-flex gap-3">
              <button
                type="submit"
                className="btn-primary-custom"
                disabled={loading}
                style={{ padding: '12px 32px' }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving Product...
                  </>
                ) : (
                  'Create Product 🍱'
                )}
              </button>
              <Link to="/owner/products" className="btn btn-outline-secondary py-2 px-4" style={{ borderRadius: '8px' }}>
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
