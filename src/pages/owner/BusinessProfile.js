import React, { useState, useEffect } from 'react';
import { getBusinessProfile, updateBusinessProfile, uploadBusinessLogo } from '../../services/api';
import { getImageUrl, FOOD_CATEGORIES, getErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const BusinessProfile = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    cuisineTypes: [],
  });

  const [currentLogo, setCurrentLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getBusinessProfile();
      const biz = res.data.data?.business || res.data.business || res.data;

      setFormData({
        businessName: biz.businessName || '',
        description: biz.description || '',
        phone: biz.phone || '',
        email: biz.email || '',
        address: biz.address || '',
        cuisineTypes: biz.cuisineTypes || [],
      });

      if (biz.logo) {
        setCurrentLogo(biz.logo);
      }
    } catch (err) {
      toast.error('Failed to load business profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCuisineToggle = (cuisine) => {
    setFormData((prev) => {
      const exists = prev.cuisineTypes.includes(cuisine);
      const updated = exists
        ? prev.cuisineTypes.filter((c) => c !== cuisine)
        : [...prev.cuisineTypes, cuisine];
      return { ...prev, cuisineTypes: updated };
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo image must be smaller than 5MB');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.businessName.trim()) errs.businessName = 'Business name is required';
    if (!formData.address.trim()) errs.address = 'Kitchen/Pickup address is required';
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
      await updateBusinessProfile(formData);

      if (logoFile) {
        const logoData = new FormData();
        logoData.append('image', logoFile);
        await uploadBusinessLogo(logoData);
      }

      toast.success('Business profile updated successfully! 🍱');
      fetchProfile();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage text="Loading business profile..." />;

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: 'var(--secondary)' }}>
          Home Business Profile
        </h2>
        <p className="text-muted mb-0">Manage kitchen brand identity, pickup address, and specialties</p>
      </div>

      <div className="card-custom p-4 p-md-5" style={{ maxWidth: '840px' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-4">
            {/* Logo Section */}
            <div className="col-12">
              <label className="form-label-custom">Kitchen Brand Logo</label>
              <div className="d-flex align-items-center gap-4">
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: 'var(--cream-dark)',
                    border: '3px solid var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    flexShrink: 0,
                  }}
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : currentLogo ? (
                    <img src={getImageUrl(currentLogo)} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    '👩‍🍳'
                  )}
                </div>

                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control form-control-custom"
                    onChange={handleLogoChange}
                  />
                  <small className="text-muted">Recommended: Square JPG or PNG, under 5MB</small>
                </div>
              </div>
            </div>

            {/* Business Name */}
            <div className="col-md-6">
              <label className="form-label-custom">Business / Brand Name *</label>
              <input
                type="text"
                name="businessName"
                className="form-control form-control-custom"
                placeholder="e.g. Grandma's Rasoi"
                value={formData.businessName}
                onChange={handleChange}
              />
              {errors.businessName && <div className="form-error">{errors.businessName}</div>}
            </div>

            {/* Business Contact Phone */}
            <div className="col-md-6">
              <label className="form-label-custom">Official Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control form-control-custom"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Contact Email */}
            <div className="col-md-6">
              <label className="form-label-custom">Business Email</label>
              <input
                type="email"
                name="email"
                className="form-control form-control-custom"
                placeholder="contact@rasoi.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Pickup / Kitchen Address */}
            <div className="col-md-6">
              <label className="form-label-custom">Pickup Location / Kitchen Address *</label>
              <input
                type="text"
                name="address"
                className="form-control form-control-custom"
                placeholder="Full street and apartment pickup address"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && <div className="form-error">{errors.address}</div>}
            </div>

            {/* Description / Story */}
            <div className="col-12">
              <label className="form-label-custom">Kitchen Bio & Story</label>
              <textarea
                name="description"
                rows={3}
                className="form-control form-control-custom"
                placeholder="Share your culinary story, secret family recipes, and cooking style..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Cuisine Specialties */}
            <div className="col-12">
              <label className="form-label-custom">Cuisine Specialties</label>
              <div className="d-flex flex-wrap gap-2 mt-1">
                {FOOD_CATEGORIES.map((cat) => {
                  const isSelected = formData.cuisineTypes.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`btn btn-sm ${
                        isSelected ? 'btn-primary-custom text-white' : 'btn-outline-secondary'
                      }`}
                      style={{ borderRadius: '20px', padding: '6px 16px' }}
                      onClick={() => handleCuisineToggle(cat)}
                    >
                      {cat} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
              <small className="text-muted mt-2 d-block">
                Select cuisines that best describe your kitchen's offerings
              </small>
            </div>

            {/* Submit */}
            <div className="col-12 pt-3 border-top">
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
                  'Save Profile Details'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessProfile;
