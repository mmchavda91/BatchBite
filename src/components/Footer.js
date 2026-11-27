import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5>🍱 BatchBite</h5>
            <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              Connecting home chefs with food lovers. Pre-order fresh, homemade meals made with love.
            </p>
          </div>
          <div className="col-lg-2 col-md-6">
            <h5>Browse</h5>
            <Link to="/products">All Batches</Link>
            <Link to="/products?category=Indian">Indian Food</Link>
            <Link to="/products?category=Desserts">Desserts</Link>
            <Link to="/products?category=Beverages">Beverages</Link>
          </div>
          <div className="col-lg-2 col-md-6">
            <h5>Customers</h5>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            <Link to="/my-orders">My Orders</Link>
            <Link to="/cart">Cart</Link>
          </div>
          <div className="col-lg-2 col-md-6">
            <h5>Sellers</h5>
            <Link to="/owner/login">Owner Login</Link>
            <Link to="/owner/dashboard">Dashboard</Link>
            <Link to="/owner/products">My Products</Link>
            <Link to="/owner/batches">My Batches</Link>
          </div>
          <div className="col-lg-2 col-md-6">
            <h5>Contact</h5>
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>
              📧 hello@batchbite.in
            </span>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>
              📞 +91 98765 43210
            </span>
          </div>
        </div>
        <hr className="footer-divider" />
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0 }}>
            © {new Date().getFullYear()} BatchBite. All rights reserved.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0 }}>
            Made with ❤️ for home food businesses
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
