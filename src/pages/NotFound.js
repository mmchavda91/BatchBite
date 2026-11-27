import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="container py-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center">
        <div style={{ fontSize: '6rem', lineHeight: 1 }}>🍱</div>
        <h1 className="fw-bold mt-3 mb-2" style={{ color: 'var(--secondary)', fontSize: '3.5rem' }}>
          404
        </h1>
        <h3 className="fw-semibold text-dark mb-3">Page Not Found</h3>
        <p className="text-muted mb-4" style={{ maxWidth: '450px' }}>
          Oops! The page or batch you are looking for does not exist or may have been moved.
        </p>
        <Link to="/" className="btn-primary-custom" style={{ padding: '12px 30px' }}>
          ← Back to BatchBite Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
