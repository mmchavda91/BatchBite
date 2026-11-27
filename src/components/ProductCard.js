import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency, getImageUrl } from '../utils/helpers';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const imageUrl = getImageUrl(product?.image);

  return (
    <div className="card-custom h-100" style={{ cursor: 'pointer' }} onClick={() => navigate(`/products?category=${product.category}`)}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product.name}
          style={{ width: '100%', height: '160px', objectFit: 'cover' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '160px',
            background: 'var(--cream-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
          }}
        >
          🍱
        </div>
      )}
      <div style={{ padding: '16px' }}>
        <h6 style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
          {product.name}
        </h6>
        <p style={{ color: 'var(--text-medium)', fontSize: '0.85rem', marginBottom: '8px' }}>
          {product.category}
        </p>
        <div style={{ color: 'var(--primary)', fontWeight: 700 }}>
          {formatCurrency(product.price)}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
