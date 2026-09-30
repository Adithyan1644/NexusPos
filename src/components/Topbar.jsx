import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Plus,
  ScanBarcode,
  Package,
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const PAGE_META = {
  dashboard: { title: 'Dashboard', sub: 'Business performance & executive analytics' },
  pos: { title: 'POS Billing', sub: 'High-speed cashier terminal' },
  products: { title: 'Product Catalog', sub: 'Inventory items, barcodes & pricing' },
  inventory: { title: 'Inventory Control', sub: 'Stock audit, valuation & movements' },
  purchases: { title: 'Purchase Orders', sub: 'Inbound inventory & vendor shipments' },
  suppliers: { title: 'Vendors & Suppliers', sub: 'Supplier directory & accounts payable' },
  customers: { title: 'Customers & CRM', sub: 'Loyalty points, accounts & purchase history' },
  invoices: { title: 'Sales & Receipts', sub: 'Audit ledger & transaction logs' },
  returns: { title: 'Returns & Credits', sub: 'Customer exchanges & refund requests' },
  reports: { title: 'Analytics & Reports', sub: 'Tax reports, profit margins & Z-reports' },
  users: { title: 'Access & Cashiers', sub: 'Roles, cashier shifts & security' },
  settings: { title: 'Store Settings', sub: 'Tax rates, currency & hardware preferences' }
};

export default function Topbar() {
  const {
    currentPage,
    setCurrentPage,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    setCommandPaletteOpen,
    setProductModalOpen,
    setCustomerModalOpen,
    currentUser,
    logout,
    products,
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const quickRef = useRef(null);
  const userRef = useRef(null);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (quickRef.current && !quickRef.current.contains(event.target)) {
        setQuickActionOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const meta = PAGE_META[currentPage] || { title: 'NexusPOS', sub: 'Retail Suite' };
  const lowStockProducts = products.filter(p => p.stock <= p.minAlert);
  const lowStockCount = lowStockProducts.length;

  return (
    <header className="topbar">
      <button
        className="icon-btn mobile-toggle"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        title="Toggle Menu"
      >
        <Menu size={18} />
      </button>

      {/* Page Title */}
      <div className="topbar-title-wrap">
        <div className="page-title">
          {meta.title}
          <span>{meta.sub}</span>
        </div>
      </div>

      {/* Terminal Live Pill */}
      <div className="topbar-terminal-pill">
        <span className="live-dot" />
        <span>Register 01 · Flagship</span>
      </div>

      {/* Global Spotlight Search */}
      <div
        className="topbar-search"
        onClick={() => setCommandPaletteOpen(true)}
        role="button"
        tabIndex={0}
        title="Press ⌘K or Ctrl+K to search anything"
      >
        <Search size={15} />
        <span>Search products, invoices, customers...</span>
        <kbd>⌘K</kbd>
      </div>

      {/* Quick Action Button with Dropdown */}
      <div style={{ position: 'relative' }} ref={quickRef}>
        <button
          className="btn btn-primary btn-sm topbar-action-btn"
          onClick={() => setQuickActionOpen(!quickActionOpen)}
          title="Quick Actions"
        >
          <Plus size={14} />
          <span>New</span>
          <ChevronDown size={12} style={{ opacity: 0.8 }} />
        </button>

        {quickActionOpen && (
          <div className="dropdown-panel quick-actions-dropdown">
            <div className="dropdown-header">Quick Actions</div>
            <button
              className="dropdown-item"
              onClick={() => {
                setCurrentPage('pos');
                setQuickActionOpen(false);
              }}
            >
              <div className="dropdown-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary)' }}>
                <ScanBarcode size={15} />
              </div>
              <div className="dropdown-text">
                <span className="title">New POS Sale</span>
                <span className="sub">Launch cashier register (F1)</span>
              </div>
            </button>

            <button
              className="dropdown-item"
              onClick={() => {
                setProductModalOpen(true);
                setQuickActionOpen(false);
              }}
            >
              <div className="dropdown-icon" style={{ background: 'var(--success-50)', color: 'var(--success)' }}>
                <Package size={15} />
              </div>
              <div className="dropdown-text">
                <span className="title">Add New Product</span>
                <span className="sub">Create SKU & barcode</span>
              </div>
            </button>

            <button
              className="dropdown-item"
              onClick={() => {
                setCustomerModalOpen(true);
                setQuickActionOpen(false);
              }}
            >
              <div className="dropdown-icon" style={{ background: 'var(--warning-50)', color: 'var(--warning)' }}>
                <UserPlus size={15} />
              </div>
              <div className="dropdown-text">
                <span className="title">Register Customer</span>
                <span className="sub">Add account for loyalty tracking</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Audio / Sound Toggle */}
      <button
        className="icon-btn"
        onClick={toggleSound}
        title={soundEnabled ? 'Disable POS Audio Chimes' : 'Enable POS Audio Chimes'}
      >
        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} style={{ opacity: 0.6 }} />}
      </button>

      {/* Dark / Light Theme Toggle */}
      <button
        className="icon-btn theme-toggle-btn"
        onClick={toggleTheme}
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      >
        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
      </button>

      {/* Notifications Bell & Drawer */}
      <div style={{ position: 'relative' }} ref={notifRef}>
        <button
          className="icon-btn"
          onClick={() => setNotifOpen(!notifOpen)}
          title="Notifications & Alerts"
        >
          <Bell size={16} />
          {lowStockCount > 0 && <span className="dot" />}
        </button>

        {notifOpen && (
          <div className="dropdown-panel notif-dropdown">
            <div className="dropdown-header">
              <span>System Notifications</span>
              <span className="badge warning no-dot" style={{ fontSize: 10 }}>
                {lowStockCount} Alerts
              </span>
            </div>

            <div className="notif-list">
              {lowStockCount > 0 ? (
                lowStockProducts.slice(0, 4).map(p => (
                  <div
                    key={p.id}
                    className="notif-item"
                    onClick={() => {
                      setCurrentPage('inventory');
                      setNotifOpen(false);
                    }}
                  >
                    <div className="notif-icon warn">
                      <AlertTriangle size={14} />
                    </div>
                    <div className="notif-body">
                      <div className="notif-title">Low Stock: {p.name}</div>
                      <div className="notif-sub">
                        Only {p.stock} units remaining (Threshold: {p.minAlert})
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="notif-empty">
                  <CheckCircle2 size={24} color="var(--success)" />
                  <p>All stock levels optimal. No pending alerts.</p>
                </div>
              )}

              <div className="notif-item">
                <div className="notif-icon ok">
                  <CheckCircle2 size={14} />
                </div>
                <div className="notif-body">
                  <div className="notif-title">Register Synced</div>
                  <div className="notif-sub">All transactions backed up to local database.</div>
                </div>
              </div>
            </div>

            <div className="dropdown-footer">
              <button
                className="dropdown-footer-btn"
                onClick={() => {
                  setCurrentPage('inventory');
                  setNotifOpen(false);
                }}
              >
                <span>View Full Inventory Audit</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Cashier Avatar Dropdown */}
      <div style={{ position: 'relative' }} ref={userRef}>
        <button
          className="avatar-btn"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          title={`${currentUser?.name || 'Cashier'} (${currentUser?.role || 'Admin'})`}
        >
          {currentUser?.initials || 'SA'}
        </button>

        {userMenuOpen && (
          <div className="dropdown-panel user-menu-dropdown">
            <div className="user-menu-profile">
              <div className="user-avatar" style={{ width: 36, height: 36, fontSize: 14 }}>
                {currentUser?.initials || 'SA'}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>
                  {currentUser?.name || 'Sarah Anderson'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  {currentUser?.email || 'sarah@nexuspos.com'}
                </div>
                <span className="badge success no-dot" style={{ marginTop: 4, fontSize: 9.5 }}>
                  {currentUser?.role || 'Super Admin'}
                </span>
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />

            <button
              className="dropdown-item"
              onClick={() => {
                setCurrentPage('settings');
                setUserMenuOpen(false);
              }}
            >
              <span style={{ fontSize: 12 }}>Store & Terminal Settings</span>
            </button>

            <button
              className="dropdown-item"
              onClick={() => {
                setCurrentPage('reports');
                setUserMenuOpen(false);
              }}
            >
              <span style={{ fontSize: 12 }}>Daily Z-Report & Summary</span>
            </button>

            <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />

            <button
              className="dropdown-item"
              onClick={() => {
                setUserMenuOpen(false);
                logout();
              }}
              style={{ color: 'var(--danger)' }}
            >
              <span style={{ fontSize: 12, fontWeight: 600 }}>Log Out / Lock Register</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
