import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBatches } from '../services/api';
import BatchCard from '../components/BatchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { FOOD_CATEGORIES } from '../utils/helpers';
import { FiSearch, FiSliders } from 'react-icons/fi';

const Products = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');

  const fetchBatches = useCallback(async () => {
    setLoading(true);

    try {
      const params = { status: 'active' };

      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      const res = await getBatches(params);

      const list =
        res.data.data?.batches ||
        res.data.batches ||
        (Array.isArray(res.data) ? res.data : []);

      setBatches(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to fetch batches:', err);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);
  // Filter by search query (product name, batch name, description, cuisine)
  const filteredBatches = batches.filter((b) => {
    const pName = b.product?.name?.toLowerCase() || '';
    const bName = b.batchName?.toLowerCase() || '';
    const desc = b.product?.description?.toLowerCase() || '';
    const category = b.product?.category?.toLowerCase() || '';
    const query = searchTerm.toLowerCase();
    return (
      pName.includes(query) ||
      bName.includes(query) ||
      desc.includes(query) ||
      category.includes(query)
    );
  });

  // Sort batches
  const sortedBatches = [...filteredBatches].sort((a, b) => {
    if (sortBy === 'price-low') return (a.pricePerUnit || 0) - (b.pricePerUnit || 0);
    if (sortBy === 'price-high') return (b.pricePerUnit || 0) - (a.pricePerUnit || 0);
    if (sortBy === 'deadline') return new Date(a.orderDeadline) - new Date(b.orderDeadline);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header text-center">
        <div className="container">
          <p
            style={{
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            Fresh & Handcrafted
          </p>
          <h1>Explore Fresh Food Batches</h1>
          <p>Pre-order authentic homemade dishes directly from passionate local home chefs</p>
        </div>
      </div>

      <div className="container flex-grow-1 mb-5">
        {/* Search and Sort Toolbar */}
        <div className="row g-3 mb-4 align-items-center">
          <div className="col-md-7">
            <div className="input-group">
              <span
                className="input-group-text bg-white border-end-0"
                style={{ borderRadius: '10px 0 0 10px', borderColor: '#e0e0e0' }}
              >
                <FiSearch color="#888" size={18} />
              </span>
              <input
                type="text"
                className="form-control form-control-custom border-start-0"
                placeholder="Search food by dish name, spices, ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: '0 10px 10px 0' }}
              />
            </div>
          </div>
          <div className="col-md-5 d-flex justify-content-md-end gap-2 align-items-center">
            <FiSliders className="text-muted d-none d-sm-inline" />
            <label className="text-muted small fw-bold text-nowrap mb-0">Sort By:</label>
            <select
              className="form-select form-control-custom"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ maxWidth: '200px' }}
            >
              <option value="newest">Latest Batches</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="deadline">Closing Soonest</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mb-4 d-flex flex-wrap align-items-center">
          <button
            className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            All Cuisines
          </button>
          {FOOD_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Batch Grid or Empty State */}
        {loading ? (
          <LoadingSpinner text="Finding delicious batches..." />
        ) : sortedBatches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🍱</div>
            <h3>No Available Batches Found</h3>
            <p>
              {searchTerm || selectedCategory !== 'All'
                ? 'Try tweaking your search keywords or switching category filters.'
                : 'There are currently no active batches open for order. Check back shortly!'}
            </p>
            {(searchTerm || selectedCategory !== 'All') && (
              <button
                className="btn-primary-custom mt-3"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small fw-semibold">
                Showing {sortedBatches.length} active batch{sortedBatches.length === 1 ? '' : 'es'}
              </span>
            </div>
            <div className="row g-4">
              {sortedBatches.map((batch) => (
                <div className="col-lg-4 col-md-6" key={batch._id}>
                  <BatchCard batch={batch} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
