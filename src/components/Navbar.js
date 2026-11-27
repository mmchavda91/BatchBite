import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import {
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiHome,
  FiGrid,
  FiPackage,
  FiMenu,
  FiX,
  FiShoppingBag,
} from 'react-icons/fi';

const Navbar = () => {
  const { isAuthenticated, isOwner, isCustomer, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setExpanded(false);
  };

  const closeNav = () => setExpanded(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-batchbite sticky-top">
      <div className="container">
        <Link className="navbar-brand-custom" to="/" onClick={closeNav}>
          <span style={{ fontSize: '1.6rem' }}>🍱</span>
          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>BatchBite</span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none p-1"
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-label="Toggle navigation"
        >
          {expanded ? <FiX size={26} color="var(--primary)" /> : <FiMenu size={26} color="var(--primary)" />}
        </button>

        <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link-custom${isActive ? ' active' : ''}`}
                to="/"
                end
                onClick={closeNav}
              >
                <FiHome className="me-1" /> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link-custom${isActive ? ' active' : ''}`}
                to="/products"
                onClick={closeNav}
              >
                <FiGrid className="me-1" /> Browse Food
              </NavLink>
            </li>

            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => `nav-link-custom${isActive ? ' active' : ''}`}
                    to="/login"
                    onClick={closeNav}
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => `nav-link-custom${isActive ? ' active' : ''}`}
                    to="/register"
                    onClick={closeNav}
                  >
                    Register
                  </NavLink>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link
                    to="/owner/login"
                    className="btn-secondary-custom"
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.9rem',
                    }}
                    onClick={closeNav}
                  >
                    <FiShoppingBag /> Owner Login
                  </Link>
                </li>
              </>
            )}

            {isCustomer && (
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => `nav-link-custom${isActive ? ' active' : ''}`}
                    to="/cart"
                    onClick={closeNav}
                  >
                    <FiShoppingCart className="me-1" /> Cart
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => `nav-link-custom${isActive ? ' active' : ''}`}
                    to="/my-orders"
                    onClick={closeNav}
                  >
                    <FiPackage className="me-1" /> My Orders
                  </NavLink>
                </li>

                {/* Profile Dropdown */}
                <li className="nav-item dropdown">
                  <button
                    className="nav-link-custom btn btn-link dropdown-toggle p-0 border-0 d-inline-flex align-items-center gap-1"
                    data-bs-toggle="dropdown"
                    style={{ color: 'var(--text-dark)', textDecoration: 'none', fontWeight: 500 }}
                  >
                    <FiUser /> {user?.name?.split(' ')[0] || 'Profile'}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                    <li>
                      <div className="dropdown-item-text" style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-medium)' }}>{user?.email}</div>
                      </div>
                    </li>
                    <li>
                      <Link to="/profile" className="dropdown-item py-2" onClick={closeNav}>
                        <FiUser className="me-2" /> My Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/my-orders" className="dropdown-item py-2" onClick={closeNav}>
                        <FiPackage className="me-2" /> Order History
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                        <FiLogOut className="me-2" /> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}

            {isOwner && (
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => `nav-link-custom${isActive ? ' active' : ''}`}
                    to="/owner/dashboard"
                    onClick={closeNav}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item ms-lg-2">
                  <button
                    className="btn-secondary-custom d-inline-flex align-items-center gap-1"
                    style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                    onClick={handleLogout}
                  >
                    <FiLogOut /> Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
