import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus } from 'lucide-react';

export default function CustomerModal() {
  const { customerModalOpen, setCustomerModalOpen, addCustomer } = useApp();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'Regular'
  });

  if (!customerModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    addCustomer(form);
    setCustomerModalOpen(false);
    setForm({ name: '', phone: '', email: '', type: 'Regular' });
  };

  return (
    <div className="modal-overlay" onClick={() => setCustomerModalOpen(false)}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-hd">
          <h3>Add New Customer</h3>
          <button className="icon-btn" onClick={() => setCustomerModalOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-bd">
            <div className="form-grid">
              <div className="field span-2">
                <label>
                  Customer Full Name <span className="req">*</span>
                </label>
                <input
                  required
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="field span-2">
                <label>
                  Mobile Number <span className="req">*</span>
                </label>
                <input
                  required
                  placeholder="+91 98765 00000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="field span-2">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="field span-2">
                <label>Loyalty Tier</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="Regular">Regular Member</option>
                  <option value="Silver">Silver Tier (2% points)</option>
                  <option value="Gold">Gold Tier (5% points)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-ft">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setCustomerModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <UserPlus size={16} />
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
