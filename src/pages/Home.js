import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBatches } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import BatchCard from '../components/BatchCard';
import Footer from '../components/Footer';
import {
  FiCheckCircle,
  FiArrowRight,
  FiClock,
  FiShoppingBag,
  FiMapPin,
  FiSearch,
} from 'react-icons/fi';

const CATEGORIES = [
  { name: 'Indian', emoji: '🍛' },
  { name: 'South Indian', emoji: '🥞' },
  { name: 'Biryani & Rice', emoji: '🍚' },
  { name: 'Chinese', emoji: '🥢' },
  { name: 'Desserts', emoji: '🧁' },
  { name: 'Beverages', emoji: '🧋' },
  { name: 'Snacks', emoji: '🥟' },
  { name: 'Continental', emoji: '🥗' },
];

const Home = () => {
  const [featuredBatches, setFeaturedBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isOwner } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOwner) {
      navigate('/owner/dashboard', { replace: true });
      return;
    }
    const fetchFeatured = async () => {
      try {
        const res = await getBatches({ status: 'active', limit: 6 });
        const list = res.data.data?.batches || res.data.batches || (Array.isArray(res.data) ? res.data : []);
        setFeaturedBatches(Array.isArray(list) ? list.slice(0, 6) : []);
      } catch (err) {
        console.error('Failed to load featured batches:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [isOwner, navigate]);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="hero-section">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <p
                style={{
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                🍱 HOME FOOD BUSINESS PLATFORM
              </p>
              <h1 className="hero-title">
                Fresh Homemade Food,<br />
                <span>Pre-ordered</span><br />
                Just For You
              </h1>
              <p className="hero-subtitle">
                Order directly from passionate home chefs in your neighborhood. Fresh, authentic, and made with love — delivered on a pre-order schedule that guarantees freshness.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="btn-primary-custom d-inline-flex align-items-center gap-2"
                  style={{ fontSize: '1.05rem', padding: '14px 32px' }}
                >
                  Browse Batches 🍱 <FiArrowRight />
                </Link>
                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="btn-outline-primary-custom"
                    style={{ fontSize: '1.05rem', padding: '12px 30px' }}
                  >
                    Join Free
                  </Link>
                )}
              </div>
              <div
                className="d-flex gap-4 mt-4 flex-wrap"
                style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}
              >
                <span className="d-inline-flex align-items-center gap-1">
                  <FiCheckCircle color="var(--primary)" /> No hidden charges
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <FiCheckCircle color="var(--primary)" /> 100% Fresh ingredients
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <FiCheckCircle color="var(--primary)" /> Verified local home chefs
                </span>
              </div>
            </div>
            <div className="col-lg-5 text-center d-none d-lg-block">
              <div
                style={{
                  width: '320px',
                  height: '320px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '7rem',
                  margin: '0 auto',
                  border: '3px solid rgba(232, 160, 32, 0.4)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                }}
              >
                🍱
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Why BatchBite?</p>
            <h2 className="section-title">The Better Way to Order Homemade Food</h2>
            <p className="section-subtitle">
              We connect hungry food lovers with home chefs who pour their hearts into every dish.
            </p>
          </div>
          <div className="row g-4">
            {[
              {
                icon: <FiClock size={36} color="var(--primary)" />,
                title: 'Pre-order System',
                desc: 'Know exactly when your food is being cooked. Order in advance and get the freshest possible meal without waiting in restaurants.',
              },
              {
                icon: <FiShoppingBag size={36} color="var(--secondary)" />,
                title: 'Fresh Batches Daily',
                desc: 'Home chefs create new batches every day with fresh ingredients. Zero reheated leftovers, zero commercial preservatives.',
              },
              {
                icon: <FiMapPin size={36} color="var(--primary)" />,
                title: 'Easy Local Pickup',
                desc: 'Flexible pickup windows at convenient neighborhood locations. Pick up your warm meal directly from the chef.',
              },
            ].map((f, i) => (
              <div className="col-md-4" key={i}>
                <div className="feature-card card-custom h-100 p-4 text-center">
                  <div className="mb-3 d-inline-block p-3 rounded-circle" style={{ background: 'var(--cream-dark)' }}>
                    {f.icon}
                  </div>
                  <h4 className="feature-title">{f.title}</h4>
                  <p style={{ color: 'var(--text-medium)', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section style={{ padding: '60px 0', background: 'var(--cream)' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-label">Explore Cuisines</p>
            <h2 className="section-title">Browse By Category</h2>
          </div>
          <div className="row g-3 justify-content-center">
            {CATEGORIES.map((cat, i) => (
              <div className="col-6 col-sm-4 col-md-3" key={i}>
                <Link
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="card-custom text-center p-3 text-decoration-none d-block h-100"
                  style={{ transition: 'var(--transition)' }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{cat.emoji}</div>
                  <div className="fw-bold text-dark">{cat.name}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED BATCHES ===== */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-label">Fresh & Open For Orders</p>
            <h2 className="section-title">Today's Active Food Batches</h2>
            <p className="section-subtitle">
              Pre-order before the batch closes to reserve your fresh portion!
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Fetching today's fresh batches...</p>
            </div>
          ) : featuredBatches.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🍱</div>
              <p style={{ color: 'var(--text-medium)' }}>No batches available right now. Check back soon!</p>
            </div>
          ) : (
            <div className="row g-4">
              {featuredBatches.map((batch) => (
                <div className="col-lg-4 col-md-6" key={batch._id}>
                  <BatchCard batch={batch} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-5">
            <Link
              to="/products"
              className="btn-primary-custom d-inline-flex align-items-center gap-2"
              style={{ fontSize: '1.05rem', padding: '14px 36px' }}
            >
              <FiSearch /> View All Available Batches
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
