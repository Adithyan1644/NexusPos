import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  X,
  Package,
  FileText,
  User,
  ArrowRight,
  LayoutDashboard,
  ScanBarcode,
  Layers,
  ShoppingCart,
  Truck,
  RotateCcw,
  BarChart3,
  Settings
} from 'lucide-react';

const PAGES = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, category: 'Pages' },
  { id: 'pos', label: 'Go to POS Billing', icon: ScanBarcode, category: 'Pages' },
  { id: 'products', label: 'Go to Products Catalog', icon: Package, category: 'Pages' },
  { id: 'inventory', label: 'Go to Inventory & Stock', icon: Layers, category: 'Pages' },
  { id: 'purchases', label: 'Go to Purchases', icon: ShoppingCart, category: 'Pages' },
  { id: 'suppliers', label: 'Go to Suppliers', icon: Truck, category: 'Pages' },
  { id: 'customers', label: 'Go to Customers', icon: User, category: 'Pages' },
  { id: 'invoices', label: 'Go to Sales & Invoices', icon: FileText, category: 'Pages' },
  { id: 'returns', label: 'Go to Returns & Refunds', icon: RotateCcw, category: 'Pages' },
  { id: 'reports', label: 'Go to Reports & Analytics', icon: BarChart3, category: 'Pages' },
  { id: 'settings', label: 'Go to Settings', icon: Settings, category: 'Pages' }
];

export default function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setCurrentPage,
    products,
    customers,
    invoices,
    setActiveInvoiceModal,
    storeSettings
  } = useApp();

  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        pages: PAGES.slice(0, 4),
        products: products.slice(0, 3),
        customers: customers.slice(0, 2),
        invoices: invoices.slice(0, 2)
      };
    }

    return {
      pages: PAGES.filter(p => p.label.toLowerCase().includes(q)),
      products: products.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.barcode.includes(q)
      ).slice(0, 4),
      customers: customers.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q)
      ).slice(0, 3),
      invoices: invoices.filter(
        inv =>
          inv.id.toLowerCase().includes(q) ||
          inv.customer.toLowerCase().includes(q)
      ).slice(0, 3)
    };
  }, [query, products, customers, invoices]);

  if (!commandPaletteOpen) return null;

  const close = () => {
    setCommandPaletteOpen(false);
    setQuery('');
  };

  const handleSelectPage = (pageId) => {
    setCurrentPage(pageId);
    close();
  };

  const handleSelectInvoice = (inv) => {
    setActiveInvoiceModal(inv);
    close();
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div
        className="modal"
        style={{ maxWidth: 620, padding: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-2)'
          }}
        >
          <Search size={20} color="var(--primary)" />
          <input
            autoFocus
            type="text"
            placeholder="Search anything (e.g. 'Rice', 'Priya', 'INV-2024', 'pos')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'none',
              outline: 'none',
              fontSize: 16,
              flex: 1,
              fontWeight: 500,
              color: 'var(--text)'
            }}
          />
          <button onClick={close} className="icon-btn" style={{ width: 32, height: 32 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ maxHeight: 420, overflowY: 'auto', padding: '12px 14px' }}>
          {/* Navigation Pages */}
          {filteredResults.pages.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', padding: '6px 10px' }}>
                Navigation
              </div>
              {filteredResults.pages.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPage(p.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '9px 12px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      transition: 'background .15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Icon size={16} color="var(--primary)" />
                    <span style={{ fontWeight: 600, fontSize: 13.5, flex: 1 }}>{p.label}</span>
                    <ArrowRight size={14} color="var(--text-3)" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Products */}
          {filteredResults.products.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', padding: '6px 10px' }}>
                Products
              </div>
              {filteredResults.products.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    setCurrentPage('products');
                    close();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px 12px',
                    borderRadius: 10,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: 20 }}>{prod.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{prod.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
                      {prod.sku} · {prod.category} · Stock: {prod.stock}
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    {storeSettings.currency}{prod.price}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Customers */}
          {filteredResults.customers.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', padding: '6px 10px' }}>
                Customers
              </div>
              {filteredResults.customers.map((cust) => (
                <div
                  key={cust.id}
                  onClick={() => {
                    setCurrentPage('customers');
                    close();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px 12px',
                    borderRadius: 10,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <User size={18} color="var(--info)" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{cust.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
                      {cust.phone} · Tier: {cust.type}
                    </div>
                  </div>
                  <span className="badge neutral no-dot">{cust.type}</span>
                </div>
              ))}
            </div>
          )}

          {/* Invoices */}
          {filteredResults.invoices.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', padding: '6px 10px' }}>
                Invoices
              </div>
              {filteredResults.invoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => handleSelectInvoice(inv)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px 12px',
                    borderRadius: 10,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <FileText size={18} color="var(--success)" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>
                      <span className="mono">{inv.id}</span> — {inv.customer}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
                      {inv.date} · {inv.method}
                    </div>
                  </div>
                  <span style={{ fontWeight: 700 }}>
                    {storeSettings.currency}{inv.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--border-2)',
            background: 'var(--surface-2)',
            fontSize: 12,
            color: 'var(--text-3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Use <strong>⌘K</strong> or <strong>Ctrl+K</strong> anytime to open search</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
