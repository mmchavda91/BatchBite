import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../utils/helpers';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email';
    if (!formData.password) errs.password = 'Password is required';
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
      const res = await loginUser(formData);
      const resData = res.data.data || res.data;
      const { token, user } = resData;

      if (!token || !user) {
        throw new Error('Authentication response invalid. Please try again.');
      }

      login(user, token);
      toast.success(`Welcome back, ${user.name}! 🍱`);
      if (user.role === 'owner') {
        navigate('/owner/dashboard', { replace: true });
      } else {
        navigate(from === '/owner/login' ? '/' : from, { replace: true });
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🍱</div>
        <h2 className="auth-title">Welcome Back!</h2>
        <p className="auth-subtitle">Sign in to your BatchBite account</p>

        {/* Quick Demo Fill Card */}
        <div
          className="p-3 mb-3 rounded-3 d-flex justify-content-between align-items-center"
          style={{ background: '#eef6f0', border: '1px solid #b8dfc4', fontSize: '0.85rem' }}
        >
          <div>
            <div className="fw-bold text-success mb-1">💡 Demo Customer Account</div>
            <div className="text-muted">customer@batchbite.com / customer123</div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-success px-2 py-1"
            style={{ fontSize: '0.8rem', fontWeight: 600 }}
            onClick={() => {
              setFormData({ email: 'customer@batchbite.com', password: 'customer123' });
              setErrors({});
            }}
          >
            Auto-Fill
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label-custom">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control form-control-custom"
              placeholder="customer@batchbite.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label-custom">Password</label>
            <input
              type="password"
              name="password"
              className="form-control form-control-custom"
              placeholder="customer123"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <button
            type="submit"
            className="btn-primary-custom w-100 justify-content-center"
            style={{ padding: '13px', fontSize: '1rem', display: 'flex' }}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" /> Signing in...</>
            ) : (
              'Sign In 🚀'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Register here
            </Link>
          </p>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginBottom: 0 }}>
            Are you a food business owner?{' '}
            <Link to="/owner/login" style={{ color: 'var(--secondary)', fontWeight: 600, textDecoration: 'none' }}>
              Owner Login →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
