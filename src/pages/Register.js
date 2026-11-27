import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCustomer } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../utils/helpers';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) errs.confirmPassword = 'Please confirm password';
    else if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) errs.phone = 'Enter a valid phone number';
    return errs;
  };

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;
      const res = await registerCustomer(payload);
      const resData = res.data.data || res.data;
      const { token, user } = resData;

      if (!token || !user) {
        throw new Error('Customer registration failed. Please try again.');
      }

      login(user, token);
      toast.success(`Welcome to BatchBite, ${user.name}! 🎉`);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ minHeight: '100vh', paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-logo">🍱</div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join BatchBite and discover amazing homemade food</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label-custom">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-control form-control-custom"
                placeholder="Mamta"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="col-12">
              <label className="form-label-custom">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-control form-control-custom"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Password *</label>
              <input
                type="password"
                name="password"
                className="form-control form-control-custom"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control form-control-custom"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
            </div>

            <div className="col-12">
              <label className="form-label-custom">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control form-control-custom"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>

            <div className="col-12">
              <label className="form-label-custom">Address</label>
              <textarea
                name="address"
                className="form-control form-control-custom"
                placeholder="Your address (optional)"
                value={formData.address}
                onChange={handleChange}
                rows={2}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary-custom w-100 justify-content-center mt-4"
            style={{ padding: '13px', fontSize: '1rem', display: 'flex' }}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" /> Creating account...</>
            ) : (
              'Create My Account 🎉'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginBottom: '8px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in here
            </Link>
          </p>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginBottom: 0 }}>
            Starting a food business?{' '}
            <Link to="/owner/login" style={{ color: 'var(--secondary)', fontWeight: 600, textDecoration: 'none' }}>
              Register as Owner →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
