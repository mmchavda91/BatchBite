import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../services/api';
import { toast } from 'react-toastify';
import { getErrorMessage, formatDate } from '../utils/helpers';
import Footer from '../components/Footer';
import { FiUser, FiMail, FiPhone, FiMapPin, FiPackage, FiLogOut, FiCheck } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: typeof user?.address === 'string' ? user?.address : user?.address?.street || '',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile(formData);
      const updated = res.data.data?.user || res.data.user || res.data;
      setUser(updated);
      toast.success('Profile details updated successfully! 🍱');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <div className="container">
          <h1>My Customer Profile</h1>
          <p>Manage your delivery details, contact number, and food pre-order history</p>
        </div>
      </div>

      <div className="container mb-5 flex-grow-1">
        <div className="row g-4 justify-content-center">
          {/* Profile Card Left */}
          <div className="col-lg-4">
            <div className="card-custom p-4 text-center mb-4">
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'var(--cream-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  color: 'var(--secondary)',
                  margin: '0 auto 16px',
                  border: '3px solid var(--primary)',
                }}
              >
                👤
              </div>

              <h4 className="fw-bold mb-1" style={{ color: 'var(--secondary)' }}>
                {user?.name}
              </h4>
              <p className="text-muted small mb-3">{user?.email}</p>

              <span className="badge rounded-pill bg-success mb-3 px-3 py-2">
                Active Customer Account
              </span>

              <div className="d-flex flex-column gap-2 text-start mt-3 pt-3 border-top small">
                <div className="d-flex align-items-center gap-2 text-muted">
                  <FiMail /> <span>{user?.email}</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted">
                  <FiPhone /> <span>{user?.phone || 'No phone set'}</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted">
                  <FiMapPin /> <span>{formData.address || 'No address set'}</span>
                </div>
              </div>

              <hr className="my-4" />

              <div className="d-grid gap-2">
                <Link to="/my-orders" className="btn btn-outline-primary d-inline-flex align-items-center justify-content-center gap-2 py-2">
                  <FiPackage /> View Order History
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger d-inline-flex align-items-center justify-content-center gap-2 py-2"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Edit Details Right */}
          <div className="col-lg-7">
            <div className="card-custom p-4 p-md-5">
              <h5 className="fw-bold mb-4" style={{ color: 'var(--secondary)' }}>
                Edit Personal Information
              </h5>

              <form onSubmit={handleUpdate}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label-custom">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-custom"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-custom">Email Address</label>
                    <input
                      type="email"
                      className="form-control form-control-custom bg-light"
                      value={user?.email || ''}
                      disabled
                    />
                    <small className="text-muted">Email cannot be changed.</small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-custom">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control form-control-custom"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label-custom">Default Delivery / Pickup Notes</label>
                    <textarea
                      name="address"
                      rows={3}
                      className="form-control form-control-custom"
                      placeholder="Your street address or building details"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 pt-3">
                    <button
                      type="submit"
                      className="btn-primary-custom d-inline-flex align-items-center gap-2"
                      disabled={saving}
                      style={{ padding: '12px 30px' }}
                    >
                      <FiCheck /> {saving ? 'Saving Changes...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;

