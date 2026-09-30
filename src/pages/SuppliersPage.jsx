import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, IndianRupee, CheckCircle, Search, Plus, Trash2, X } from 'lucide-react';

export default function SuppliersPage() {
  const { suppliers, storeSettings, showToast, addSupplier, deleteSupplier } = useApp();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    gstin: '',
    contact: '',
    phone: ''
  });

  const totalPayable = suppliers.reduce((sum, s) => sum + s.outstanding, 0);

  const filtered = suppliers.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase()) ||
      s.gstin.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    await addSupplier(form);
    setShowModal(false);
    setForm({ name: '', gstin: '', contact: '', phone: '' });
  };

  return (
    <div className="page-container">
      <div className="grid-3" style={{ marginBottom: 22 }}>
        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}>
            <Building2 size={20} />
          </div>
          <div>
            <div className="v">{(suppliers || []).length}</div>
            <div className="l">Total Suppliers</div>
          </div>
        </div>

        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)' }}>
            <IndianRupee size={20} />
          </div>
          <div>
            <div className="v">
              {storeSettings.currency}{totalPayable.toLocaleString('en-IN')}
            </div>
            <div className="l">Outstanding Payable</div>
          </div>
        </div>

        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="v">{(suppliers || []).filter(s => s.status === 'Active').length}</div>
            <div className="l">Active Suppliers</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search">
            <Search size={16} />
            <input
              placeholder="Search suppliers by name, contact or GSTIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="spacer" />

          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Add Supplier
          </button>
        </div>

        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Supplier Company</th>
                <th>Contact Representative</th>
                <th>Total Purchases</th>
                <th>Outstanding Dues</th>
                <th>Status</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                      <div className="ci-thumb">🏢</div>
                      <div>
                        <div className="td-strong">{s.name}</div>
                        <div className="mono td-muted" style={{ fontSize: 11.5 }}>
                          GST: {s.gstin}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="td-strong">{s.contact}</div>
                    <div className="td-muted" style={{ fontSize: 11.5 }}>{s.phone}</div>
                  </td>
                  <td className="td-strong">{s.orders} orders</td>
                  <td>
                    <span
                      className={`badge ${
                        s.outstanding === 0 ? 'success' : 'warning'
                      } no-dot`}
                    >
                      {storeSettings.currency}{s.outstanding.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td>
                    <span className="badge success">{s.status}</span>
                  </td>
                  <td>
                    <button
                      className="icon-btn"
                      style={{ width: 32, height: 32, color: 'var(--danger)' }}
                      title="Delete supplier"
                      onClick={() => {
                        if (window.confirm(`Delete ${s.name} from vendors?`)) {
                          deleteSupplier(s.id);
                        }
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
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
              <h3>Add New Supplier</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSupplier}>
              <div className="modal-bd">
                <div className="form-grid">
                  <div className="field span-2">
                    <label>Supplier Company Name <span className="req">*</span></label>
                    <input
                      required
                      placeholder="e.g. Apex Consumer Goods"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="field span-2">
                    <label>GSTIN Number</label>
                    <input
                      placeholder="e.g. 29ABCDE1234F1Z5"
                      value={form.gstin}
                      onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label>Contact Person</label>
                    <input
                      placeholder="e.g. Robert Smith"
                      value={form.contact}
                      onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label>Phone Number <span className="req">*</span></label>
                    <input
                      required
                      placeholder="+91 98765 00000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
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
                <button type="submit" className="btn btn-primary">
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
