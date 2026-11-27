import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  FiPieChart,
  FiShoppingBag,
  FiLayers,
  FiClipboard,
  FiUser,
  FiTrendingUp,
  FiLogOut,
  FiGlobe,
  FiPlusCircle,
  FiMenu,
  FiX,
} from 'react-icons/fi';

const OwnerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/owner/login');
  };

  const navItems = [
    { to: '/owner/dashboard', label: 'Dashboard', icon: <FiPieChart size={19} /> },
    { to: '/owner/products', label: 'Food Products', icon: <FiShoppingBag size={19} /> },
    { to: '/owner/batches', label: 'Food Batches', icon: <FiLayers size={19} /> },
    { to: '/owner/orders', label: 'Customer Orders', icon: <FiClipboard size={19} /> },
    { to: '/owner/profile', label: 'Business Profile', icon: <FiUser size={19} /> },
    { to: '/owner/reports', label: 'Sales Reports', icon: <FiTrendingUp size={19} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Left Sidebar */}
      <aside
        className={`owner-sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          background: 'var(--secondary)',
          color: 'white',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease',
          boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            to="/owner/dashboard"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>🍱</span>
            <span>BatchBite <small style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700 }}>PRO</small></span>
          </Link>
          <button
            className="btn btn-sm d-md-none text-white border-0 p-0 fs-5"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Chef Store Summary Badge */}
        <div style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.15)' }}>
          <div className="small text-white-50">Logged in as Owner</div>
          <div className="fw-bold text-white text-truncate">{user?.name || 'Home Chef'}</div>
          <div className="small" style={{ color: 'var(--primary)' }}>Kitchen Admin Panel</div>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '16px 12px', flexGrow: 1, overflowY: 'auto' }}>
          <div className="d-flex flex-column gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.75)',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease',
                })}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <Link
            to="/"
            target="_blank"
            className="btn btn-sm btn-outline-light w-100 text-decoration-none py-2 d-flex align-items-center justify-content-center gap-2"
            style={{ borderRadius: '8px', fontSize: '0.85rem' }}
          >
            <FiGlobe />
            <span>View Customer Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"
            style={{
              background: 'rgba(220, 53, 69, 0.2)',
              color: '#ff6b7d',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className="owner-main"
        style={{
          flexGrow: 1,
          marginLeft: '260px',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* Top Navbar */}
        <header
          style={{
            background: 'white',
            borderBottom: '1px solid #eee',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FiMenu size={22} />
            </button>
            <h5 className="mb-0 fw-bold d-none d-sm-block" style={{ color: 'var(--secondary)' }}>
              Home Food Business Management
            </h5>
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link
              to="/owner/batches/add"
              className="btn-primary-custom d-none d-md-inline-flex"
              style={{ padding: '7px 16px', fontSize: '0.85rem' }}
            >
              <FiPlusCircle className="me-1" /> Create Batch
            </Link>
            <div className="d-flex align-items-center gap-2">
              <span
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--cream-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: 'var(--secondary)',
                }}
              >
                {user?.name?.charAt(0) || 'O'}
              </span>
              <span className="small fw-semibold text-dark d-none d-md-inline">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="owner-content" style={{ padding: '28px', flexGrow: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;
