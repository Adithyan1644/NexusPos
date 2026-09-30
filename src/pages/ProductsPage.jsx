import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Download,
  Plus,
  Trash2
} from 'lucide-react';

export default function ProductsPage() {
  const { products, setProductModalOpen, storeSettings, showToast, deleteProduct } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter(p => p.status === 'Active').length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.minAlert).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    return { total, active, lowStock, outOfStock };
  }, [products]);

  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category));
    return ['All Categories', ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode.includes(search);
      const matchCat =
        selectedCategory === 'All Categories' || p.category === selectedCategory;
      const matchStatus =
        selectedStatus === 'All Status' || p.status === selectedStatus;
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, search, selectedCategory, selectedStatus]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  const handleExport = () => {
    const headers = 'ID,Name,SKU,Barcode,Category,Cost,Price,Stock,Status\n';
    const rows = products
      .map(
        p =>
          `"${p.id}","${p.name}","${p.sku}","${p.barcode}","${p.category}",${p.cost},${p.price},${p.stock},"${p.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_products_${Date.now()}.csv`;
    a.click();
    showToast('success', 'Export Complete', 'Products list downloaded as CSV.');
  };

  return (
    <div className="page-container">
      {/* Mini Stats Grid */}
      <div className="kpi-grid">
        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}>
            <Package size={20} />
          </div>
          <div>
            <div className="v">{stats.total}</div>
            <div className="l">Total Products</div>
          </div>
        </div>

        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="v">{stats.active}</div>
            <div className="l">Active Status</div>
          </div>
        </div>

        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="v">{stats.lowStock}</div>
            <div className="l">Low Stock Items</div>
          </div>
        </div>

        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#EF4444,#DC2626)' }}>
            <XCircle size={20} />
          </div>
          <div>
            <div className="v">{stats.outOfStock}</div>
            <div className="l">Out of Stock</div>
          </div>
        </div>
      </div>

      {/* Main Catalog Card */}
      <div className="card">
        <div className="toolbar">
          <div className="search">
            <Search size={16} />
            <input
              placeholder="Search by name, SKU or barcode..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '9px 14px',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontSize: 13.5,
              background: '#fff'
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '9px 14px',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontSize: 13.5,
              background: '#fff'
            }}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <div className="spacer" />

          <button className="btn btn-outline btn-sm" onClick={handleExport}>
            <Download size={15} />
            Export CSV
          </button>

          <button className="btn btn-primary btn-sm" onClick={() => setProductModalOpen(true)}>
            <Plus size={16} />
            Add Product
          </button>
        </div>

        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU / Barcode</th>
                <th>Category</th>
                <th>Cost</th>
                <th>Selling Price</th>
                <th>Stock Level</th>
                <th>Status</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => {
                const isOutOfStock = p.stock <= 0;
                const isLowStock = p.stock > 0 && p.stock <= p.minAlert;

                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="ci-thumb">{p.emoji}</div>
                        <div>
                          <div className="td-strong">{p.name}</div>
                          <div className="td-muted" style={{ fontSize: 11.5 }}>
                            Min Alert: {p.minAlert} units
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="mono td-strong">{p.sku}</div>
                      <div className="mono td-muted" style={{ fontSize: 11.5 }}>
                        {p.barcode}
                      </div>
                    </td>
                    <td>
                      <span className="badge neutral no-dot">{p.category}</span>
                    </td>
                    <td className="td-muted">{storeSettings.currency}{p.cost}</td>
                    <td className="td-strong" style={{ color: 'var(--primary)' }}>
                      {storeSettings.currency}{p.price}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          isOutOfStock ? 'danger' : isLowStock ? 'warning' : 'success'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${p.status === 'Active' ? 'success' : 'neutral'}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="icon-btn"
                        style={{ width: 32, height: 32, color: 'var(--danger)' }}
                        title="Delete product"
                        onClick={() => {
                          if (window.confirm(`Delete ${p.name} from catalog?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="empty">
                      <h4>No products match your filters</h4>
                      <p>Try clearing search parameters or add a new product</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Showing {filtered.length > 0 ? (page - 1) * pageSize + 1 : 0}–
            {Math.min(page * pageSize, filtered.length)} of {filtered.length} products
          </span>

          <div className="page-btns">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                className={page === i + 1 ? 'active' : ''}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
