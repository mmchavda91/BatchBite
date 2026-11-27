import React from 'react';

const LoadingSpinner = ({ fullPage = false, text = 'Loading...' }) => {
  if (fullPage) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
          background: 'var(--cream)',
        }}
      >
        <div className="spinner-border" style={{ color: 'var(--primary)', width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ color: 'var(--text-medium)', fontWeight: 500 }}>{text}</p>
      </div>
    );
  }

  return (
    <div className="loading-overlay">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p style={{ color: 'var(--text-medium)', fontWeight: 500 }}>{text}</p>
    </div>
  );
};

export default LoadingSpinner;
