import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct, updateProduct, uploadProductImage } from '../../services/api';
import { FOOD_CATEGORIES, getImageUrl, getErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Indian',
    preparationTime: '',
    allergens: '',
    isAvailable: true,
  });

  const [currentImage, setCurrentImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchProduct = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getProduct(id);
      const prod = res.data.data?.product || res.data.product || res.data;

      setFormData({
        name: prod.name || '',
        description: prod.description || '',
        price: prod.price || '',
        category: prod.category || 'Indian',
        preparationTime: prod.preparationTime || '',
        allergens: prod.allergens ? prod.allergens.join(', ') : '',
        isAvailable: prod.isAvailable !== undefined ? prod.isAvailable : true,
      });

      if (prod.image) {
        setCurrentImage(prod.image);
      }
    } catch (err) {
      toast.error('Failed to load product details');
      navigate('/owner/products');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Dish name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Valid price is required';
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
      setNewImageFile(file);
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

    setSaving(true);
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

      await updateProduct(id, payload);

      if (newImageFile) {
        const imgData = new FormData();
        imgData.append('image', newImageFile);
        await uploadProductImage(id, imgData);
      }

      toast.success('Food product updated successfully! 🍱');
      navigate('/owner/products');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage text="Loading dish details..." />;

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/owner/products" className="btn btn-sm btn-outline-secondary" style={{ borderRadius: '8px' }}>
          ← Back to Catalog
        </Link>
        <div>
          <h2 className="fw-bold mb-0" style={{ color: 'var(--secondary)' }}>
            Edit Food Product
          </h2>
          <small className="text-muted">Update details for {formData.name}</small>
        </div>
      </div>

      <div className="card-custom p-4 p-md-5" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-4">
            <div className="col-12">
              <label className="form-label-custom">Dish Name *</label>
              <input
                type="text"
                name="name"
                className="form-control form-control-custom"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="col-12">
              <label className="form-label-custom">Description *</label>
              <textarea
                name="description"
                rows={3}
                className="form-control form-control-custom"
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Price per Serving (₹) *</label>
              <input
                type="number"
                name="price"
                className="form-control form-control-custom"
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
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Preparation Time</label>
              <input
                type="text"
                name="preparationTime"
                className="form-control form-control-custom"
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
                value={formData.allergens}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label-custom">Update Photo</label>
              <input
                type="file"
                accept="image/*"
                className="form-control form-control-custom"
                onChange={handleImageChange}
              />

              <div className="d-flex gap-3 align-items-center mt-3">
                {currentImage && !imagePreview && (
                  <div>
                    <small className="text-muted d-block mb-1">Current Image:</small>
                    <img
                      src={getImageUrl(currentImage)}
                      alt="Current"
                      style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </div>
                )}
                {imagePreview && (
                  <div>
                    <small className="text-success fw-bold d-block mb-1">New Image Preview:</small>
                    <img
                      src={imagePreview}
                      alt="New preview"
                      style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--primary)' }}
                    />
                  </div>
                )}
              </div>
            </div>

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
                  Active in Kitchen
                </label>
              </div>
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

export default EditProduct;
