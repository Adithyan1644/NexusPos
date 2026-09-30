import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  Search,
  Plus,
  SlidersHorizontal,
  X
} from 'lucide-react';

export default function InventoryPage() {
  const {
    products,
    inventoryLogs,
    storeSettings,
    showToast,
    adjustStock
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All Movements');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustData, setAdjustData] = useState({
    productId: products[0]?.id || '',
    type: 'Stock In',
    quantity: '',
    reason: 'Replenishment'
  });

  // Calculate stock valuation
  const totalStockValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.cost * p.stock, 0);
  }, [products]);

  const filteredLogs = useMemo(() => {
    return inventoryLogs.filter((log) => {
      const matchSearch =
        !search ||
        log.product.toLowerCase().includes(search.toLowerCase()) ||
        log.ref.toLowerCase().includes(search.toLowerCase()) ||
        log.by.toLowerCase().includes(search.toLowerCase());
      const matchType =
        filterType === 'All Movements' || log.type === filterType;
      return matchSearch && matchType;
    });
  }, [inventoryLogs, search, filterType]);

  const handleStockAdjustment = async (e) => {
    e.preventDefault();
    const qty = Number(adjustData.quantity);
    if (!qty || !adjustData.productId) return;

    await adjustStock({
      productId: adjustData.productId,
      type: adjustData.type,
      quantity: qty,
      reason: adjustData.reason
    });

    setShowAdjustModal(false);
    setAdjustData({
      productId: products[0]?.id || '',
      type: 'Stock In',
      quantity: '',
      reason: 'Replenishment'
    });
  };

  return (
    <div className="page-container">
      {/* Top Stat Cards */}
      <div className="kpi-grid">
        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}>
            <Layers size={20} />
          </div>
          <div>
            <div className="v">
              {storeSettings.currency}{totalStockValue.toLocaleString('en-IN')}
            </div>
            <div className="l">Total Inventory Valuation</div>
          </div>
        </div>

        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
            <ArrowDownLeft size={20} />
          </div>
          <div>
            <div className="v">+2,340</div>
            <div className="l">Stock In (This Month)</div>
          </div>
        </div>

        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)' }}>
            <ArrowUpRight size={20} />
          </div>
          <div>
            <div className="v">−1,890</div>
            <div className="l">Stock Out (This Month)</div>
          </div>
        </div>

        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#EF4444,#DC2626)' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="v">
              {products.filter(p => p.stock <= p.minAlert).length}
            </div>
            <div className="l">Restock Alerts</div>
          </div>
        </div>
      </div>

      {/* Stock Movement Ledger Card */}
      <div className="card">
        <div className="toolbar">
          <div className="search">
            <Search size={16} />
            <input
              placeholder="Search product, PO or invoice reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '9px 14px',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontSize: 13.5,
              background: '#fff'
            }}
          >
            <option>All Movements</option>
            <option>Stock In</option>
            <option>Stock Out</option>
            <option>Adjustment</option>
          </select>

          <div className="spacer" />

          <button
            className="btn btn-outline btn-sm"
            onClick={() => setShowAdjustModal(true)}
          >
            <SlidersHorizontal size={15} />
            Stock Adjustment
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAdjustModal(true)}
          >
            <Plus size={16} />
            New Stock Entry
          </button>
        </div>

        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Product</th>
                <th>Movement Type</th>
                <th>Reference #</th>
                <th>Quantity Change</th>
                <th>Remaining Balance</th>
                <th>Date & Time</th>
                <th>Logged By</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const isPositive = log.change > 0;
                return (
                  <tr key={log.id}>
                    <td className="td-strong">{log.product}</td>
                    <td>
                      <span
                        className={`badge ${
                          log.type === 'Stock In'
                            ? 'success'
                            : log.type === 'Stock Out'
                            ? 'danger'
                            : 'warning'
                        } no-dot`}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td className="mono td-muted">{log.ref}</td>
                    <td
                      className="td-strong"
                      style={{ color: isPositive ? 'var(--success)' : 'var(--danger)' }}
                    >
                      {isPositive ? `+${log.change}` : log.change}
                    </td>
                    <td className="td-strong">{log.balance}</td>
                    <td className="td-muted">{log.date}</td>
                    <td>{log.by}</td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="empty">
                      <h4>No movements found</h4>
                      <p>Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjustModal && (
        <div className="modal-overlay" onClick={() => setShowAdjustModal(false)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-hd">
              <h3>Record Stock Adjustment</h3>
              <button className="icon-btn" onClick={() => setShowAdjustModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleStockAdjustment}>
              <div className="modal-bd">
                <div className="form-grid">
                  <div className="field span-2">
                    <label>Select Product</label>
                    <select
                      value={adjustData.productId}
                      onChange={(e) => setAdjustData({ ...adjustData, productId: e.target.value })}
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.emoji} {p.name} (Current Stock: {p.stock})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label>Movement Type</label>
                    <select
                      value={adjustData.type}
                      onChange={(e) => setAdjustData({ ...adjustData, type: e.target.value })}
                    >
                      <option>Stock In</option>
                      <option>Stock Out</option>
                      <option>Adjustment</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Quantity</label>
                    <input
                      required
                      type="number"
                      min={1}
                      placeholder="e.g. 50"
                      value={adjustData.quantity}
                      onChange={(e) => setAdjustData({ ...adjustData, quantity: e.target.value })}
                    />
                  </div>

                  <div className="field span-2">
                    <label>Reason / Note</label>
                    <input
                      placeholder="e.g. Damaged during transit, supplier delivery"
                      value={adjustData.reason}
                      onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-ft">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowAdjustModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
