import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  ScanBarcode,
  Package,
  Layers,
  ShoppingCart,
  Truck,
  Users,
  FileText,
  RotateCcw,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'pos', label: 'POS Billing', icon: ScanBarcode, badge: 'Live', badgeType: 'ok' }
    ]
  },
  {
    label: 'Catalog',
    items: [
      { id: 'products', label: 'Products', icon: Package },
      { id: 'inventory', label: 'Inventory', icon: Layers, badge: '12', badgeType: 'warn' }
    ]
  },
  {
    label: 'Operations',
    items: [
      { id: 'purchases', label: 'Purchases', icon: ShoppingCart },
      { id: 'suppliers', label: 'Suppliers', icon: Truck },
      { id: 'customers', label: 'Customers', icon: Users }
    ]
  },
  {
    label: 'Transactions',
    items: [
      { id: 'invoices', label: 'Sales & Invoices', icon: FileText },
      { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
      { id: 'reports', label: 'Reports', icon: BarChart3 }
    ]
  },
  {
    label: 'Administration',
    items: [
      { id: 'users', label: 'Users & Roles', icon: ShieldCheck },
      { id: 'settings', label: 'Settings', icon: Settings }
    ]
  }
];

export default function Sidebar() {
  const {
    currentPage,
    setCurrentPage,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    currentUser,
    logout,
    theme,
    toggleTheme,
    products
  } = useApp();

  const lowStockCount = products.filter(p => p.stock <= p.minAlert).length;

  const handleNav = (pageId) => {
    setCurrentPage(pageId);
    if (mobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
  };

  return (
    <aside className={`sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
      <div className="brand">
        <div className="brand-logo">
          <Sparkles size={20} color="#FFFFFF" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="brand-name">NexusPOS</span>
            <span className="version-pill">PRO</span>
          </div>
          <div className="brand-sub">Retail Management Suite</div>
        </div>
      </div>

      {/* Terminal Live Status Chip */}
      <div className="sidebar-terminal-chip">
        <div className="terminal-status-dot" />
        <div className="terminal-info">
          <div className="terminal-title">Terminal #01 · Online</div>
          <div className="terminal-sub">Main Cashier Register</div>
        </div>
      </div>

      <nav className="nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="nav-group">
            <div className="nav-label">{group.label}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const badgeValue = item.id === 'inventory' ? (lowStockCount > 0 ? String(lowStockCount) : null) : item.badge;
              const badgeType = item.id === 'inventory' ? (lowStockCount > 0 ? 'warn' : 'ok') : item.badgeType;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {badgeValue && (
                    <span className={`nav-badge ${badgeType}`}>
                      {badgeValue}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 8px' }}>
          <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Theme & Session
          </span>
          <button
            onClick={toggleTheme}
            className="theme-switch-btn"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>

        <button className="user-card" onClick={logout} title="Click to log out">
          <div className="user-avatar">{currentUser?.initials || 'SA'}</div>
          <div className="user-info">
            <div className="user-name">{currentUser?.name || 'Sarah Anderson'}</div>
            <div className="user-role">{currentUser?.role || 'Super Admin'} · Sign Out</div>
          </div>
          <ChevronRight size={15} color="#6B7A99" />
        </button>
      </div>
    </aside>
  );
}
