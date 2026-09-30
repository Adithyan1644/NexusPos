import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Award, CreditCard, Search, Plus, Trash2 } from 'lucide-react';

export default function CustomersPage() {
  const { customers, setCustomerModalOpen, storeSettings, deleteCustomer } = useApp();
  const [search, setSearch] = useState('');

  const loyaltyCount = customers.filter(c => c.type === 'Gold' || c.type === 'Silver').length;
  const totalCredit = customers.reduce((sum, c) => sum + (c.outstanding || 0), 42300);

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="grid-3" style={{ marginBottom: 22 }}>
        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}>
            <Users size={20} />
          </div>
          <div>
            <div className="v">{customers.length + 2842}</div>
            <div className="l">Total Registered Customers</div>
          </div>
        </div>

        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
            <Award size={20} />
          </div>
          <div>
            <div className="v">{loyaltyCount + 424}</div>
            <div className="l">Loyalty Tier Members</div>
          </div>
        </div>

        <div className="stat-mini">
          <div className="ic" style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)' }}>
            <CreditCard size={20} />
          </div>
          <div>
            <div className="v">
              {storeSettings.currency}{totalCredit.toLocaleString('en-IN')}
            </div>
            <div className="l">Outstanding Store Credit</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search">
            <Search size={16} />
            <input
              placeholder="Search customer by name, mobile or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="spacer" />

          <button className="btn btn-primary btn-sm" onClick={() => setCustomerModalOpen(true)}>
            <Plus size={16} />
            Add Customer
          </button>
        </div>

        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Customer Profile</th>
                <th>Mobile Number</th>
                <th>Loyalty Tier</th>
                <th>Total Spent</th>
                <th>Last Visit</th>
                <th>Credit Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const initials = c.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2);

                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <div
                          className="ci-thumb"
                          style={{
                            background:
                              c.type === 'Gold'
                                ? 'linear-gradient(135deg,#F59E0B,#D97706)'
                                : c.type === 'Silver'
                                ? 'linear-gradient(135deg,#10B981,#059669)'
                                : 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: 13
                          }}
                        >
                          {initials}
                        </div>
                        <div>
                          <div className="td-strong">{c.name}</div>
                          <div className="td-muted" style={{ fontSize: 11.5 }}>
                            {c.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="mono td-strong">{c.phone}</td>
                    <td>
                      <span
                        className={`badge ${
                          c.type === 'Gold'
                            ? 'warning'
                            : c.type === 'Silver'
                            ? 'info'
                            : 'neutral'
                        } no-dot`}
                      >
                        {c.type}
                      </span>
                    </td>
                    <td className="td-strong">
                      {storeSettings.currency}{c.totalSpent.toLocaleString('en-IN')}
                    </td>
                    <td className="td-muted">{c.lastVisit}</td>
                    <td>
                      <span
                        className={`badge ${
                          c.outstanding === 0 ? 'success' : 'danger'
                        } no-dot`}
                      >
                        {storeSettings.currency}{(c.outstanding || 0).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td>
                      <button
                        className="icon-btn"
                        style={{ width: 32, height: 32, color: 'var(--danger)' }}
                        title="Delete customer"
                        onClick={() => {
                          if (window.confirm(`Delete ${c.name} from customer directory?`)) {
                            deleteCustomer(c.id);
                          }
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
