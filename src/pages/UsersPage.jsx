import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Search, Plus, Trash2, X } from 'lucide-react';

export default function UsersPage() {
  const { users, showToast, createUser, deleteUser } = useApp();
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Cashier'
  });

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole =
      selectedRole === 'All Roles' || u.role === selectedRole;
    return matchSearch && matchRole;
  });

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    await createUser({
      name: form.name,
      email: form.email,
      role: form.role,
      password: 'password123'
    });

    setShowModal(false);
    setForm({ name: '', email: '', role: 'Cashier' });
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="toolbar">
          <div className="search">
            <Search size={16} />
            <input
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            style={{
              padding: '9px 14px',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontSize: 13.5,
              background: '#fff'
            }}
          >
            <option>All Roles</option>
            <option>Super Admin</option>
            <option>Manager</option>
            <option>Cashier</option>
            <option>Inventory</option>
            <option>Accountant</option>
          </select>

          <div className="spacer" />

          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Add User
          </button>
        </div>

        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>User</th>
                <th>Email Address</th>
                <th>Assigned Role</th>
                <th>Last Login</th>
                <th>Account Status</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                      <div
                        className="ci-thumb"
                        style={{
                          background:
                            u.role === 'Super Admin'
                              ? 'linear-gradient(135deg,#6366F1,#8B5CF6)'
                              : u.role === 'Manager'
                              ? 'linear-gradient(135deg,#10B981,#059669)'
                              : 'linear-gradient(135deg,#F59E0B,#D97706)',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: 13
                        }}
                      >
                        {u.initials}
                      </div>
                      <div>
                        <div className="td-strong">{u.name}</div>
                        <div className="td-muted" style={{ fontSize: 11.5 }}>
                          ID: {u.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === 'Super Admin'
                          ? 'purple'
                          : u.role === 'Manager'
                          ? 'info'
                          : u.role === 'Inventory'
                          ? 'warning'
                          : 'neutral'
                      } no-dot`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="td-muted">{u.lastLogin}</td>
                  <td>
                    <span
                      className={`badge ${u.status === 'Active' ? 'success' : 'danger'}`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="icon-btn"
                      style={{ width: 32, height: 32, color: 'var(--danger)' }}
                      title="Delete user"
                      onClick={() => {
                        if (window.confirm(`Delete ${u.name}?`)) {
                          deleteUser(u.id);
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
          <div className="modal" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-hd">
              <h3>Create User Account</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUser}>
              <div className="modal-bd">
                <div className="form-grid">
                  <div className="field span-2">
                    <label>Full Name <span className="req">*</span></label>
                    <input
                      required
                      placeholder="e.g. Alex Morgan"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="field span-2">
                    <label>Email Address <span className="req">*</span></label>
                    <input
                      required
                      type="email"
                      placeholder="alex@nexuspos.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="field span-2">
                    <label>Role</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option>Cashier</option>
                      <option>Manager</option>
                      <option>Inventory</option>
                      <option>Accountant</option>
                      <option>Super Admin</option>
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
                <button type="submit" className="btn btn-primary">
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
