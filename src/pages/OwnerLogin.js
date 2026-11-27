import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, registerOwner } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../utils/helpers';

const OwnerLogin = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateLogin = () => {
    const errs = {};
    if (!loginData.email.trim()) errs.email = 'Email is required';
    if (!loginData.password) errs.password = 'Password is required';
    return errs;
  };

  const validateRegister = () => {
    const errs = {};
    if (!regData.name.trim()) errs.name = 'Name is required';
    if (!regData.email.trim()) errs.email = 'Email is required';
    if (!regData.businessName.trim()) errs.businessName = 'Business name is required';
    if (!regData.password) errs.password = 'Password is required';
    else if (regData.password.length < 6) errs.password = 'Min 6 characters';
    if (regData.password !== regData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await loginUser(loginData);
      const resData = res.data.data || res.data;
      const { token, user } = resData;

      if (!token || !user) {
        throw new Error('Authentication response invalid. Please try again.');
      }

      if (user.role !== 'owner') {
        toast.error('This account is not registered as an Owner. Please use the Customer login.');
        setLoading(false);
        return;
      }
      login(user, token);
      toast.success(`Welcome back, Chef ${user.name}! 👨‍🍳`);
      navigate('/owner/dashboard', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = validateRegister();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = regData;
      const res = await registerOwner(payload);
      const resData = res.data.data || res.data;
      const { token, user } = resData;

      if (!token || !user) {
        throw new Error('Owner registration failed. Please try again.');
      }

      login(user, token);
      toast.success(`Welcome to BatchBite, ${user.name}! Your kitchen is ready. 🍱`);
      navigate('/owner/dashboard', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const handleRegChange = (e) => {
    setRegData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  return (
    <div className="auth-page" style={{ minHeight: '100vh', paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="auth-card" style={{ maxWidth: mode === 'register' ? '540px' : '460px' }}>
        <div className="auth-logo">👨‍🍳</div>
        <h2 className="auth-title" style={{ color: 'var(--secondary)' }}>
          {mode === 'login' ? 'Owner Login' : 'Register Your Business'}
        </h2>
        <p className="auth-subtitle">
          {mode === 'login' ? 'Manage your home food business' : 'Start selling your homemade food'}
        </p>

        {/* Tab switcher */}
        <div className="d-flex gap-2 mb-4">
          <button
            type="button"
            className={mode === 'login' ? 'btn-secondary-custom flex-fill justify-content-center' : 'btn-outline-primary-custom flex-fill'}
            style={{ display: 'flex', padding: '10px' }}
            onClick={() => { setMode('login'); setErrors({}); }}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'btn-secondary-custom flex-fill justify-content-center' : 'btn-outline-primary-custom flex-fill'}
            style={{ display: 'flex', padding: '10px' }}
            onClick={() => { setMode('register'); setErrors({}); }}
          >
            Register
          </button>
        </div>

        {mode === 'login' ? (
          <div>
            {/* Quick Demo Fill Card */}
            <div
              className="p-3 mb-3 rounded-3 d-flex justify-content-between align-items-center"
              style={{ background: '#fff8eb', border: '1px solid #ffd599', fontSize: '0.85rem' }}
            >
              <div>
                <div className="fw-bold text-warning-emphasis mb-1">👨‍🍳 Demo Business Owner</div>
                <div className="text-muted">owner@batchbite.com / owner123</div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-warning px-2 py-1"
                style={{ fontSize: '0.8rem', fontWeight: 600 }}
                onClick={() => {
                  setLoginData({ email: 'owner@batchbite.com', password: 'owner123' });
                  setErrors({});
                }}
              >
                Auto-Fill
              </button>
            </div>

            <form onSubmit={handleLogin} noValidate>
            <div className="mb-3">
              <label className="form-label-custom">Email</label>
              <input
                type="email"
                name="email"
                className="form-control form-control-custom"
                placeholder="owner@batchbite.com"
                value={loginData.email}
                onChange={handleLoginChange}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
            <div className="mb-4">
              <label className="form-label-custom">Password</label>
              <input
                type="password"
                name="password"
                className="form-control form-control-custom"
                placeholder="owner123"
                value={loginData.password}
                onChange={handleLoginChange}
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>
            <button
              type="submit"
              className="btn-secondary-custom w-100 justify-content-center"
              style={{ padding: '13px', fontSize: '1rem', display: 'flex' }}
              disabled={loading}
            >
              {loading ? <><span className="spinner-border spinner-border-sm me-2" /> Signing in...</> : 'Sign In as Owner 🏠'}
            </button>
          </form>
        </div>
        ) : (
          <form onSubmit={handleRegister} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label-custom">Your Name *</label>
                <input type="text" name="name" className="form-control form-control-custom" placeholder="Full name" value={regData.name} onChange={handleRegChange} />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label-custom">Business Name *</label>
                <input type="text" name="businessName" className="form-control form-control-custom" placeholder="Mom's Kitchen" value={regData.businessName} onChange={handleRegChange} />
                {errors.businessName && <div className="form-error">{errors.businessName}</div>}
              </div>
              <div className="col-12">
                <label className="form-label-custom">Email *</label>
                <input type="email" name="email" className="form-control form-control-custom" placeholder="business@email.com" value={regData.email} onChange={handleRegChange} />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
              <div className="col-12">
                <label className="form-label-custom">Phone</label>
                <input type="tel" name="phone" className="form-control form-control-custom" placeholder="+91 98765 43210" value={regData.phone} onChange={handleRegChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label-custom">Password *</label>
                <input type="password" name="password" className="form-control form-control-custom" placeholder="Min 6 characters" value={regData.password} onChange={handleRegChange} />
                {errors.password && <div className="form-error">{errors.password}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label-custom">Confirm Password *</label>
                <input type="password" name="confirmPassword" className="form-control form-control-custom" placeholder="Repeat password" value={regData.confirmPassword} onChange={handleRegChange} />
                {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
              </div>
              <div className="col-12">
                <label className="form-label-custom">Business Address</label>
                <textarea name="address" className="form-control form-control-custom" rows={2} placeholder="Your kitchen/pickup address" value={regData.address} onChange={handleRegChange} />
              </div>
            </div>
            <button
              type="submit"
              className="btn-secondary-custom w-100 justify-content-center mt-4"
              style={{ padding: '13px', fontSize: '1rem', display: 'flex' }}
              disabled={loading}
            >
              {loading ? <><span className="spinner-border spinner-border-sm me-2" /> Registering...</> : 'Start My Food Business 🚀'}
            </button>
          </form>
        )}

        <div className="text-center mt-4">
          <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginBottom: 0 }}>
            Customer?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Customer Login here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerLogin;
