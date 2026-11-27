import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency, getTimeRemaining, getImageUrl } from '../utils/helpers';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const BatchCard = ({ batch }) => {
  const { addToCart, cartItems } = useCart();
  const { isOwner } = useAuth();
  const navigate = useNavigate();

  if (!batch) return null;

  const product = batch.product || {};
  const imageUrl = getImageUrl(product.image, product.category);
  const timeLeft = getTimeRemaining(batch.orderDeadline);
  const isDeadlinePassed = new Date(batch.orderDeadline) < new Date();
  const inCart = cartItems.some((item) => item.batch?._id === batch._id);

  const handleAddToCart = () => {
    if (isOwner) {
      toast.warning('You are currently logged in as an Owner. To place customer orders, please log in with a customer account (e.g. customer@batchbite.com).');
      return;
    }
    if (batch.availableQuantity <= 0 || isDeadlinePassed) {
      toast.error('This batch is no longer available for ordering.');
      return;
    }
    addToCart(batch, product, 1);
    toast.success(`${product.name || 'Dish'} added to cart! 🍱`);
  };

  return (
    <div className="batch-card h-100">
      <Link to={`/products/${batch._id}`} style={{ textDecoration: 'none' }}>
        <img
          src={imageUrl}
          alt={product.name || 'Food item'}
          className="batch-card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80';
          }}
        />
      </Link>

      <div className="batch-card-body">
        {product.category && (
          <span
            style={{
              background: 'var(--cream-dark)',
              color: 'var(--secondary)',
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              marginBottom: '8px',
              display: 'inline-block',
            }}
          >
            {product.category}
          </span>
        )}

        <Link to={`/products/${batch._id}`} style={{ textDecoration: 'none' }}>
          <h5 className="batch-card-title">{product.name || batch.batchName}</h5>
        </Link>
        <p className="batch-card-desc">{product.description}</p>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <div className="batch-price">{formatCurrency(batch.pricePerUnit)}</div>
            <div className="batch-qty">
              {batch.availableQuantity > 0
                ? `${batch.availableQuantity} available`
                : 'Sold out'}
            </div>
          </div>
          {!isDeadlinePassed && batch.availableQuantity > 0 && timeLeft && (
            <span className="deadline-countdown">⏳ {timeLeft}</span>
          )}
        </div>

        {batch.availableQuantity <= 0 || isDeadlinePassed || batch.status !== 'active' ? (
          <button className="btn w-100" disabled style={{ background: '#f0f0f0', borderRadius: '8px', color: '#999', fontWeight: 600 }}>
            {batch.availableQuantity <= 0 ? 'Sold Out' : 'Deadline Closed'}
          </button>
        ) : inCart ? (
          <button
            className="btn-secondary-custom w-100 justify-content-center"
            onClick={() => navigate('/cart')}
            style={{ display: 'flex' }}
          >
            🛒 View in Cart
          </button>
        ) : (
          <button
            className="btn-primary-custom w-100 justify-content-center"
            onClick={handleAddToCart}
            style={{ display: 'flex' }}
          >
            + Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default BatchCard;
