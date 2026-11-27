import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct, getBusinessProfile } from '../../services/api';
import { formatCurrency, getImageUrl, getErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import { toast } from 'react-toastify';

const OwnerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const bizRes = await getBusinessProfile();
      const businessId = bizRes.data.data?.business?._id || bizRes.data.business?._id;
      const res = await getProducts({ business: businessId });
      const list = res.data.data?.products || res.data.products || [];
      setProducts(list);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteId);
      toast.success('Food product deleted successfully');
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const filtered = products.filter((p) => {
    const name = p.name?.toLowerCase() || '';
    const cat = p.category?.toLowerCase() || '';
    const q = searchTerm.toLowerCase();
    return name.includes(q) || cat.includes(q);
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--secondary)' }}>
            Food Products Catalog
          </h2>
          <p className="text-muted mb-0">Manage your dishes, recipes, pricing, and allergen details</p>
        </div>

        <Link to="/owner/products/add" className="btn-primary-custom" style={{ padding: '10px 22px' }}>
          + Add New Product 🍱
        </Link>
      </div>

      {/* Search Bar */}
      <div className="card-custom p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control form-control-custom"
              placeholder="Search products by dish name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-6 text-md-end text-muted small">
            Total {filtered.length} product{filtered.length === 1 ? '' : 's'} listed
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Loading your product catalog..." />
      ) : filtered.length === 0 ? (
        <div className="card-custom p-5 text-center">
          <div style={{ fontSize: '3rem' }}>🍲</div>
          <h4 className="fw-bold mt-2">No Food Products Found</h4>
          <p className="text-muted">
            {searchTerm ? 'No items match your search.' : 'You haven’t added any food products yet.'}
          </p>
          <Link to="/owner/products/add" className="btn-primary-custom d-inline-flex mt-2">
            Create Your First Product
          </Link>
        </div>
      ) : (
        <div className="card-custom overflow-hidden">
          <div className="table-responsive">
            <table className="table table-custom table-hover mb-0">
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Category</th>
                  <th>Base Price</th>
                  <th>Prep Time</th>
                  <th>Availability</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((prod) => {
                  const img = getImageUrl(prod.image);
                  return (
                    <tr key={prod._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              background: 'var(--cream-dark)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.5rem',
                              flexShrink: 0,
                            }}
                          >
                            {img ? (
                              <img
                                src={img}
                                alt={prod.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              '🍱'
                            )}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{prod.name}</div>
                            <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '240px' }}>
                              {prod.description}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border">
                          {prod.category || 'General'}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--primary)' }}>
                          {formatCurrency(prod.price)}
                        </strong>
                      </td>
                      <td>
                        <small className="text-muted">{prod.preparationTime || '30 mins'}</small>
                      </td>
                      <td>
                        <span className={`badge ${prod.isAvailable ? 'bg-success' : 'bg-secondary'}`}>
                          {prod.isAvailable ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Link
                            to={`/owner/products/edit/${prod._id}`}
                            className="btn btn-sm btn-outline-secondary"
                            style={{ borderRadius: '6px' }}
                          >
                            Edit ✏️
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            style={{ borderRadius: '6px' }}
                            onClick={() => setDeleteId(prod._id)}
                          >
                            Delete 🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={!!deleteId}
        onHide={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Food Product"
        message="Are you sure you want to remove this dish from your catalog? Existing past orders will remain intact."
        confirmText="Yes, Delete Product"
        confirmVariant="danger"
        loading={deleting}
      />
    </div>
  );
};

export default OwnerProducts;
