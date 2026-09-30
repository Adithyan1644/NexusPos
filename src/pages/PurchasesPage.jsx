import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Plus, Search, MoreVertical, X } from 'lucide-react';

export default function PurchasesPage() {
  const { purchases, suppliers, storeSettings, showToast, createPurchaseOrder, receivePurchaseOrder } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showPOModal, setShowPOModal] = useState(false);
  const [poForm, setPoForm] = useState({
    supplier: suppliers[0]?.name || 'Agro Supplies Pvt Ltd',
    itemsCount: 3,
    total: '',
    payment: 'Paid',
    status: 'Received'
  });

  const filteredPurchases = useMemo(() => {
    return purchases.filter((po) => {
      const matchSearch =
        !search ||
        po.id.toLowerCase().includes(search.toLowerCase()) ||
        po.supplier.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        selectedStatus === 'All Status' ||
        po.status === selectedStatus ||
        po.payment === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [purchases, search, selectedStatus]);

  const handleCreatePO = async (e) => {
    e.preventDefault();
    if (!poForm.total) return;

    await createPurchaseOrder({
      supplier: poForm.supplier,
      itemsCount: Number(poForm.itemsCount) || 1,
      total: Number(poForm.total),
      payment: poForm.payment,
      status: poForm.status
    });

    setShowPOModal(false);
    setPoForm({
      supplier: suppliers[0]?.name || 'Agro Supplies Pvt Ltd',
      itemsCount: 3,
      total: '',
      payment: 'Paid',
      status: 'Received'
    });
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="toolbar">
          <div className="search">
            <Search size={16} />
            <input
              placeholder="Search PO number or supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '9px 14px',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontSize: 13.5,
              background: '#fff'
            }}
          >
            <option>All Status</option>
            <option>Received</option>
            <option>Pending</option>
            <option>Paid</option>
            <option>Partial</option>
            <option>Unpaid</option>
          </select>

          <div className="spacer" />

          <button className="btn btn-primary btn-sm" onClick={() => setShowPOModal(true)}>
            <Plus size={16} />
            New Purchase
          </button>
        </div>

        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Supplier</th>
                <th>Items</th>
                <th>Total Value</th>
                <th>Payment</th>
                <th>Receiving Status</th>
                <th>Date</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((po) => (
                <tr key={po.id}>
                  <td className="mono td-strong" style={{ color: 'var(--primary)' }}>
                    {po.id}
                  </td>
                  <td className="td-strong">{po.supplier}</td>
                  <td>{po.itemsCount} items</td>
                  <td className="td-strong">
                    {storeSettings.currency}{po.total.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        po.payment === 'Paid'
                          ? 'success'
                          : po.payment === 'Partial'
                          ? 'warning'
                          : 'danger'
                      }`}
                    >
                      {po.payment}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${po.status === 'Received' ? 'success' : 'info'}`}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td className="td-muted">{po.date}</td>
                  <td>
                    {po.status === 'Pending' ? (
                      <button
                        className="btn btn-sm btn-primary"
                        style={{ padding: '3px 8px', fontSize: 11 }}
                        title="Mark order as received"
                        onClick={() => receivePurchaseOrder(po.id)}
                      >
                        Receive
                      </button>
                    ) : (
                      <span className="td-muted" style={{ fontSize: 11 }}>Complete</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPOModal && (
        <div className="modal-overlay" onClick={() => setShowPOModal(false)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-hd">
              <h3>Create Purchase Order</h3>
              <button className="icon-btn" onClick={() => setShowPOModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePO}>
              <div className="modal-bd">
                <div className="form-grid">
                  <div className="field span-2">
                    <label>Supplier</label>
                    <select
                      value={poForm.supplier}
                      onChange={(e) => setPoForm({ ...poForm, supplier: e.target.value })}
                    >
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label>Items Count</label>
                    <input
                      type="number"
                      value={poForm.itemsCount}
                      onChange={(e) => setPoForm({ ...poForm, itemsCount: Number(e.target.value) })}
                    />
                  </div>

                  <div className="field">
                    <label>Total Value ({storeSettings.currency})</label>
                    <input
                      required
                      type="number"
                      placeholder="e.g. 45000"
                      value={poForm.total}
                      onChange={(e) => setPoForm({ ...poForm, total: Number(e.target.value) })}
                    />
                  </div>

                  <div className="field">
                    <label>Payment Mode</label>
                    <select
                      value={poForm.payment}
                      onChange={(e) => setPoForm({ ...poForm, payment: e.target.value })}
                    >
                      <option>Paid</option>
                      <option>Partial</option>
                      <option>Unpaid</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Delivery Status</label>
                    <select
                      value={poForm.status}
                      onChange={(e) => setPoForm({ ...poForm, status: e.target.value })}
                    >
                      <option>Received</option>
                      <option>Pending</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-ft">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowPOModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
