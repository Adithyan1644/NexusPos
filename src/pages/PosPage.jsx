import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Plus,
  Trash2,
  CheckCircle,
  CreditCard,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Coins,
  X,
  Keyboard,
  ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  'All Items',
  'Beverages',
  'Snacks',
  'Dairy',
  'Grains',
  'Personal Care',
  'Bakery',
  'Oils'
];

export default function PosPage() {
  const {
    products,
    cart,
    cartItemCount,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    subtotal,
    discountPercent,
    setDiscountPercent,
    discountAmount,
    taxAmount,
    grandTotal,
    checkoutCart,
    selectedCustomer,
    setSelectedCustomer,
    customers,
    storeSettings,
    setCustomerModalOpen
  } = useApp();

  const [activeCategory, setActiveCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [tenderedCash, setTenderedCash] = useState('');

  const searchInputRef = useRef(null);

  // Global POS Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if inside a modal or typing in standard textareas
      if (e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'F1') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'F2') {
        e.preventDefault();
        setPaymentMethod('UPI');
      } else if (e.key === 'F3') {
        e.preventDefault();
        setPaymentMethod('Card');
      } else if (e.key === 'F4') {
        e.preventDefault();
        setPaymentMethod('Cash');
      } else if (e.key === 'Escape') {
        setShowCustomerPicker(false);
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        activeCategory === 'All Items' ||
        p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.barcode.includes(searchQuery);
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // Barcode enter key trigger
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (filteredProducts.length > 0) {
        addToCart(filteredProducts[0]);
        setSearchQuery('');
      } else if (cart.length > 0) {
        handleCharge();
      }
    }
  };

  const handleCharge = async (forcedMethod = null) => {
    if (cart.length === 0 || isProcessing) return;
    const methodToUse = forcedMethod || paymentMethod;
    setIsProcessing(true);
    try {
      await checkoutCart(methodToUse);
      setTenderedCash('');
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick cash calculations
  const nextHundred = Math.ceil(grandTotal / 100) * 100;
  const nextFiveHundred = Math.ceil(grandTotal / 500) * 500;
  const numericTendered = Number(tenderedCash) || 0;
  const changeDue = numericTendered > grandTotal ? numericTendered - grandTotal : 0;

  // Category counts
  const categoryCounts = useMemo(() => {
    const map = { 'All Items': products.length };
    products.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [products]);

  return (
    <div className="pos-layout">
      {/* Products Left Panel — Optimized Showcase */}
      <div className="pos-products">
        <div className="toolbar">
          <div className="search">
            <Search size={15} />
            <input
              ref={searchInputRef}
              autoFocus
              placeholder="Scan barcode or search SKU/name (F1)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            {searchQuery ? (
              <button
                type="button"
                className="icon-btn-micro"
                onClick={() => setSearchQuery('')}
                title="Clear Search"
              >
                <X size={12} />
              </button>
            ) : (
              <kbd className="pos-hotkey-kbd">F1</kbd>
            )}
          </div>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Mode:
            </span>
            {[
              { id: 'UPI', key: 'F2' },
              { id: 'Card', key: 'F3' },
              { id: 'Cash', key: 'F4' }
            ].map(({ id: m, key }) => (
              <button
                key={m}
                type="button"
                className={`btn btn-sm ${paymentMethod === m ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setPaymentMethod(m)}
                style={{ padding: '4px 8px', fontSize: 11.5, gap: 4 }}
                title={`Press ${key} to switch`}
              >
                <span>{m}</span>
                <kbd style={{
                  fontSize: 9,
                  opacity: paymentMethod === m ? 0.9 : 0.6,
                  background: paymentMethod === m ? 'rgba(255,255,255,0.2)' : 'var(--border)',
                  padding: '1px 3px',
                  borderRadius: 3
                }}>
                  {key}
                </kbd>
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="cat-pills">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0;
            return (
              <span
                key={cat}
                className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{cat}</span>
                <span className="cat-pill-count">{count}</span>
              </span>
            );
          })}
        </div>

        {/* Product Cards Showcase Grid — Compact & Non-Stretching */}
        <div className="prod-grid">
          {filteredProducts.map((p) => {
            const isOutOfStock = p.stock <= 0;
            const isLowStock = p.stock > 0 && p.stock <= p.minAlert;
            const cartItem = cart.find((c) => c.id === p.id);
            const inCartQty = cartItem ? cartItem.qty : 0;
            const catClass = `cat-${(p.category || 'Default').replace(/\s+/g, '')}`;

            return (
              <div
                key={p.id}
                className={`prod-card ${isOutOfStock ? 'disabled' : ''} ${
                  inCartQty > 0 ? 'in-cart' : ''
                }`}
                onClick={(e) => !isOutOfStock && addToCart(p, e)}
                title={isOutOfStock ? 'Out of Stock' : `Click or press to add ${p.name}`}
              >
                {/* Card Top Row (Cart quantity pill & stock status) */}
                <div className="prod-card-top">
                  {inCartQty > 0 ? (
                    <span className="cart-qty-pill">{inCartQty} in cart</span>
                  ) : (
                    <span style={{ fontSize: 9.5, color: 'var(--text-3)', fontWeight: 500 }}>
                      {p.category}
                    </span>
                  )}

                  <span
                    className={`prod-stock-pill ${
                      isOutOfStock ? 'out' : isLowStock ? 'low' : 'ok'
                    }`}
                  >
                    {isOutOfStock ? 'Out' : `${p.stock} left`}
                  </span>
                </div>

                {/* Center Visual Badge */}
                <div className="prod-thumb-wrap">
                  <div className={`prod-thumb ${catClass}`}>{p.emoji || '📦'}</div>
                </div>

                {/* Product Title */}
                <div className="prod-name">{p.name}</div>

                {/* Price & Add Indicator */}
                <div className="prod-meta">
                  <span className="prod-price">
                    {storeSettings.currency}
                    {p.price}
                  </span>
                  <div className="prod-add-btn">
                    <Plus size={13} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="empty" style={{ gridColumn: '1 / -1', padding: '40px 16px' }}>
              <h4>No products match your search</h4>
              <p>Check spelling, try barcode scanning, or switch category filter.</p>
            </div>
          )}
        </div>

        {/* POS Hotkeys Legend Footer */}
        <div className="pos-hotkeys-footer">
          <div className="hotkey-item">
            <kbd>F1</kbd> Search
          </div>
          <div className="hotkey-item">
            <kbd>F2</kbd> UPI
          </div>
          <div className="hotkey-item">
            <kbd>F3</kbd> Card
          </div>
          <div className="hotkey-item">
            <kbd>F4</kbd> Cash
          </div>
          <div className="hotkey-item">
            <kbd>↵ Enter</kbd> Add / Charge
          </div>
          <div className="hotkey-item">
            <kbd>Esc</kbd> Reset
          </div>
        </div>
      </div>

      {/* Cart Right Panel — Streamlined & Compact */}
      <div className="cart" id="cartPanel">
        <div className="cart-hd">
          <div>
            <h3>Current Order</h3>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
              {cartItemCount} item{cartItemCount === 1 ? '' : 's'} in register
            </span>
          </div>
          <div className="spacer" />
          {cart.length > 0 && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={clearCart}
              style={{ padding: '3px 8px', fontSize: 11, color: 'var(--danger)' }}
              title="Clear all cart items"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Customer Info Chip */}
        <div className="customer-chip" style={{ position: 'relative' }}>
          <div className="av">
            {selectedCustomer?.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2) || 'WK'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="nm">{selectedCustomer?.name || 'Walk-in Customer'}</span>
              <span className="loyalty-tag">{selectedCustomer?.type || 'Regular'}</span>
            </div>
            <div className="sub">
              {selectedCustomer?.phone || 'No phone'} · Points: 420
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowCustomerPicker(!showCustomerPicker)}
            style={{ padding: '3px 7px', fontSize: 11 }}
          >
            Change
          </button>

          {/* Customer Dropdown */}
          {showCustomerPicker && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                boxShadow: 'var(--shadow-lg)',
                zIndex: 60,
                padding: 6,
                marginTop: 4
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-3)'
                }}
              >
                <span>Select Customer</span>
                <span
                  style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => {
                    setShowCustomerPicker(false);
                    setCustomerModalOpen(true);
                  }}
                >
                  + Add New
                </span>
              </div>
              {customers.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCustomer(c);
                    setShowCustomerPicker(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    background: selectedCustomer?.id === c.id ? 'var(--primary-50)' : 'transparent'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>{c.name}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{c.phone}</div>
                  </div>
                  <span className="badge neutral no-dot" style={{ fontSize: 10 }}>
                    {c.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Item Rows */}
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="ci-thumb">{item.emoji || '📦'}</div>
              <div className="ci-info">
                <div className="ci-name">{item.name}</div>
                <div className="ci-sub">
                  {storeSettings.currency}
                  {item.price} × {item.qty}
                </div>
              </div>
              <div className="ci-qty">
                <button onClick={() => updateCartQty(item.id, -1)} title="Decrease quantity">−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateCartQty(item.id, 1)} title="Increase quantity">+</button>
              </div>
              <div className="ci-price">
                {storeSettings.currency}
                {(item.price * item.qty).toLocaleString('en-IN')}
              </div>
              <button
                className="ci-remove"
                onClick={() => removeFromCart(item.id)}
                title="Remove item"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="empty" style={{ padding: '36px 14px' }}>
              <ShoppingBag size={34} color="var(--text-3)" style={{ opacity: 0.5, marginBottom: 8 }} />
              <h4>Order is empty</h4>
              <p>Click any product on the left, scan barcode, or press [F1] to search.</p>
            </div>
          )}
        </div>

        {/* Quick Cash Tender & Change Calculator (when Cash is selected and cart has items) */}
        {cart.length > 0 && paymentMethod === 'Cash' && (
          <div className="cash-tender-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Cash Tendered
              </span>
              {changeDue > 0 && (
                <span className="badge success no-dot" style={{ fontWeight: 700, fontSize: 11 }}>
                  Change: {storeSettings.currency}{changeDue.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <div className="quick-tenders">
              <button
                className="quick-tender-btn"
                onClick={() => setTenderedCash(String(grandTotal))}
                title="Exact change"
              >
                Exact ({storeSettings.currency}{grandTotal.toLocaleString('en-IN')})
              </button>
              {nextHundred > grandTotal && (
                <button
                  className="quick-tender-btn"
                  onClick={() => setTenderedCash(String(nextHundred))}
                >
                  {storeSettings.currency}{nextHundred}
                </button>
              )}
              {nextFiveHundred > grandTotal && nextFiveHundred !== nextHundred && (
                <button
                  className="quick-tender-btn"
                  onClick={() => setTenderedCash(String(nextFiveHundred))}
                >
                  {storeSettings.currency}{nextFiveHundred}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bill Summary */}
        <div className="cart-summary">
          <div className="sum-row">
            <span>Subtotal</span>
            <span className="val">
              {storeSettings.currency}
              {subtotal.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="sum-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Discount</span>
              <div className="discount-presets">
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    className={`discount-chip ${discountPercent === pct ? 'active' : ''}`}
                    onClick={() => setDiscountPercent(pct)}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
            <span className="val" style={{ color: 'var(--success)' }}>
              − {storeSettings.currency}
              {discountAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="sum-row">
            <span>Tax (GST {storeSettings.defaultTax}%)</span>
            <span className="val">
              {storeSettings.currency}
              {taxAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="sum-row total">
            <div>
              <span className="total-label">Grand Total</span>
              <span className="total-sub">Includes all taxes</span>
            </div>
            <span className="val">
              {storeSettings.currency}
              {grandTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Checkout Actions */}
        <div className="cart-actions">
          <button
            className="btn btn-outline"
            style={{ flex: '0 0 auto', padding: '8px 12px' }}
            onClick={() =>
              setPaymentMethod((prev) =>
                prev === 'UPI' ? 'Card' : prev === 'Card' ? 'Cash' : 'UPI'
              )
            }
            title="Cycle payment mode (UPI / Card / Cash)"
          >
            <CreditCard size={15} />
            <span style={{ fontSize: 11, fontWeight: 700 }}>{paymentMethod}</span>
          </button>

          <button
            className="btn btn-success btn-block"
            onClick={() => handleCharge()}
            disabled={cart.length === 0 || isProcessing}
            style={{ padding: '9px 16px', fontSize: 13, gap: 8 }}
          >
            {isProcessing ? (
              <span>Processing Sale...</span>
            ) : (
              <>
                <CheckCircle size={16} />
                <span>
                  Complete Sale · {storeSettings.currency}
                  {grandTotal.toLocaleString('en-IN')}
                </span>
                <ArrowRight size={14} style={{ opacity: 0.8 }} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
