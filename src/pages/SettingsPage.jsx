import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Save, RotateCcw } from 'lucide-react';

export default function SettingsPage() {
  const {
    storeSettings,
    saveSettings,
    showToast,
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound
  } = useApp();
  const [form, setForm] = useState(storeSettings || {});

  useEffect(() => {
    if (storeSettings) {
      setForm(storeSettings);
    }
  }, [storeSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveSettings(form);
  };

  const handleReset = async () => {
    const defaults = {
      storeName: 'Nexus Retail Supermarket',
      address: '42 MG Road, Bengaluru, Karnataka 560001',
      gstin: '29ABCDE1234F1Z5',
      phone: '+91 80 4567 8900',
      email: 'hello@nexusretail.com',
      currency: '₹',
      defaultTax: 18,
      roundingMode: 'Nearest ₹1',
      invoicePrefix: 'INV-2024-',
      lowStockThreshold: 20,
      footerNote: 'Thank you for shopping with us! Returns accepted within 7 days with original invoice.'
    };
    setForm(defaults);
    await saveSettings(defaults);
    showToast('info', 'Settings Reset', 'Restored default configuration settings.');
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit}>
        <div className="grid-2b">
          <div className="card">
            <div className="card-hd">
              <div>
                <h3>Store Identity</h3>
                <p>Company details printed on receipts & invoices</p>
              </div>
            </div>
            <div className="card-bd">
              <div className="form-grid">
                <div className="field span-2">
                  <label>Store Name</label>
                  <input
                    value={form.storeName}
                    onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                  />
                </div>

                <div className="field span-2">
                  <label>Physical Address</label>
                  <textarea
                    rows={2}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>GSTIN Tax Number</label>
                  <input
                    value={form.gstin}
                    onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Support Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Operating Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  >
                    <option value="₹">INR (₹) - Indian Rupee</option>
                    <option value="$">USD ($) - US Dollar</option>
                    <option value="€">EUR (€) - Euro</option>
                    <option value="£">GBP (£) - British Pound</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-hd">
              <div>
                <h3>Tax & Billing Automation</h3>
                <p>Default calculation rules for the POS cashier register</p>
              </div>
            </div>
            <div className="card-bd">
              <div className="form-grid">
                <div className="field">
                  <label>Default GST Rate (%)</label>
                  <input
                    type="number"
                    value={form.defaultTax}
                    onChange={(e) => setForm({ ...form, defaultTax: Number(e.target.value) })}
                  />
                </div>

                <div className="field">
                  <label>Rounding Mode</label>
                  <select
                    value={form.roundingMode}
                    onChange={(e) => setForm({ ...form, roundingMode: e.target.value })}
                  >
                    <option>Nearest ₹1</option>
                    <option>Nearest ₹0.50</option>
                    <option>No rounding</option>
                  </select>
                </div>

                <div className="field">
                  <label>Invoice Prefix</label>
                  <input
                    value={form.invoicePrefix}
                    onChange={(e) => setForm({ ...form, invoicePrefix: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Low Stock Warning Threshold</label>
                  <input
                    type="number"
                    value={form.lowStockThreshold}
                    onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })}
                  />
                </div>

                <div className="field span-2">
                  <label>Thermal Receipt Footer Note</label>
                  <textarea
                    rows={2}
                    value={form.footerNote}
                    onChange={(e) => setForm({ ...form, footerNote: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="card span-2" style={{ gridColumn: 'span 2' }}>
            <div className="card-hd">
              <div>
                <h3>Terminal Interface & Hardware Preferences</h3>
                <p>Cashier screen aesthetics, sound chimes, and printer integration</p>
              </div>
            </div>
            <div className="card-bd">
              <div className="form-grid">
                <div className="field">
                  <label>Interface Theme Mode</label>
                  <select
                    value={theme}
                    onChange={(e) => {
                      if (e.target.value !== theme) toggleTheme();
                    }}
                  >
                    <option value="light">Classic Clean Light Mode (Optimal for bright counters)</option>
                    <option value="dark">Executive Dark Mode (High contrast, reduced glare)</option>
                  </select>
                </div>

                <div className="field">
                  <label>Cashier Audio Chimes</label>
                  <select
                    value={soundEnabled ? 'enabled' : 'disabled'}
                    onChange={(e) => {
                      const wants = e.target.value === 'enabled';
                      if (wants !== soundEnabled) toggleSound();
                    }}
                  >
                    <option value="enabled">Enabled (Play chime on scan & sale completion)</option>
                    <option value="disabled">Muted (Silent cashier mode)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 18 }}>
          <div
            className="card-bd"
            style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: 16 }}
          >
            <button type="button" className="btn btn-ghost" onClick={handleReset}>
              <RotateCcw size={15} />
              Reset Defaults
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={15} />
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
