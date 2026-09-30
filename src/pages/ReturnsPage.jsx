import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RotateCcw, IndianRupee, CheckCircle, Search, Plus, X } from 'lucide-react';

export default function ReturnsPage() {
  const { returns, processReturn, products, storeSettings } = useApp();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    invoice: 'INV-2024-0891',
    item: products[0]?.name || 'Basmati Rice 5kg',
    reason: 'Damaged packaging',
    refund: 649
  });

  const totalRefunded = returns.reduce((sum, r) => sum + r.refund, 18420);

  const filtered = returns.filter(
    (r) =>
      !search ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.invoice.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.item.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await processReturn(form.invoice, form.item, form.reason, Number(form.refund));
    setShowModal(false);
  };

  return (
    <div className="page-container">
      <div className="grid-3" style={{ marginBottom: 22 }}>
        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#EF4444,#DC2626)' }}>
            <RotateCcw size={20} />
          </div>
          <div>
            <div className="v">{returns.length + 24}</div>
            <div className="l">Returns Processed (Month)</div>
          </div>
        </div>

        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)' }}>
            <IndianRupee size={20} />
          </div>
          <div>
            <div className="v">
              {storeSettings.currency}{totalRefunded.toLocaleString('en-IN')}
            </div>
            <div className="l">Total Refunded Value</div>
          </div>
        </div>

        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="v">94%</div>
            <div className="l">Return Approval Rate</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search">
            <Search size={16} />
            <input
              placeholder="Search returns by invoice or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="spacer" />

          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Process Return
          </button>
        </div>

        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Return #</th>
                <th>Original Invoice</th>
                <th>Customer</th>
                <th>Item Returned</th>
                <th>Refund Amount</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="mono td-strong" style={{ color: 'var(--primary)' }}>
                    {r.id}
                  </td>
                  <td className="mono td-strong">{r.invoice}</td>
                  <td>{r.customer}</td>
                  <td className="td-strong">{r.item}</td>
                  <td className="td-strong" style={{ color: 'var(--danger)' }}>
                    {storeSettings.currency}{r.refund.toLocaleString('en-IN')}
                  </td>
                  <td className="td-muted">{r.reason}</td>
                  <td>
                    <span
                      className={`badge ${
                        r.status === 'Approved' ? 'success' : 'warning'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="td-muted">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-hd">
              <h3>Process Customer Return</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-bd">
                <div className="form-grid">
                  <div className="field span-2">
                    <label>Original Invoice #</label>
                    <input
                      required
                      placeholder="e.g. INV-2024-0891"
                      value={form.invoice}
                      onChange={(e) => setForm({ ...form, invoice: e.target.value })}
                    />
                  </div>

                  <div className="field span-2">
                    <label>Returned Item</label>
                    <select
                      value={form.item}
                      onChange={(e) => {
                        const selected = products.find(p => p.name === e.target.value);
                        setForm({
                          ...form,
                          item: e.target.value,
                          refund: selected?.price || form.refund
                        });
                      }}
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.emoji} {p.name} ({storeSettings.currency}{p.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label>Refund Amount ({storeSettings.currency})</label>
                    <input
                      required
                      type="number"
                      value={form.refund}
                      onChange={(e) => setForm({ ...form, refund: Number(e.target.value) })}
                    />
                  </div>

                  <div className="field">
                    <label>Return Reason</label>
                    <select
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    >
                      <option>Damaged packaging</option>
                      <option>Wrong item selected</option>
                      <option>Expired or near expiry</option>
                      <option>Customer changed mind</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-ft">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  Approve & Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
