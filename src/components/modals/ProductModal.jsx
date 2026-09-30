import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus } from 'lucide-react';

const EMOJIS = ['🍚', '🫒', '🍞', '🥛', '🍵', '🍫', '🧃', '🍟', '🪥', '🧴', '☕', '🥣', '🍎', '🥪', '🧁', '🥫'];

export default function ProductModal() {
  const { productModalOpen, setProductModalOpen, addProduct, storeSettings } = useApp();

  const [form, setForm] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: 'Grains',
    cost: '',
    price: '',
    stock: '',
    minAlert: '20',
    emoji: '📦'
  });

  if (!productModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    addProduct(form);
    setProductModalOpen(false);
    setForm({
      name: '',
      sku: '',
      barcode: '',
      category: 'Grains',
      cost: '',
      price: '',
      stock: '',
      minAlert: '20',
      emoji: '📦'
    });
  };

  return (
    <div className="modal-overlay" onClick={() => setProductModalOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-hd">
          <h3>Add New Product</h3>
          <button className="icon-btn" onClick={() => setProductModalOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-bd">
            <div className="form-grid">
              <div className="field span-2">
                <label>
                  Product Name <span className="req">*</span>
                </label>
                <input
                  required
                  placeholder="e.g. Basmati Rice 5kg"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="field">
                <label>SKU</label>
                <input
                  placeholder="Leave blank to auto-generate"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Barcode</label>
                <input
                  placeholder="Scan or enter barcode"
                  value={form.barcode}
                  onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option>Grains</option>
                  <option>Dairy</option>
                  <option>Bakery</option>
                  <option>Beverages</option>
                  <option>Snacks</option>
                  <option>Personal Care</option>
                  <option>Household</option>
                  <option>Oils</option>
                </select>
              </div>

              <div className="field">
                <label>Product Icon</label>
                <select
                  value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                >
                  {EMOJIS.map((em) => (
                    <option key={em} value={em}>
                      {em} Icon
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Purchase Cost ({storeSettings.currency})</label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: e.target.value })}
                />
              </div>

              <div className="field">
                <label>
                  Selling Price ({storeSettings.currency}) <span className="req">*</span>
                </label>
                <input
                  required
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Initial Stock Qty</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Low Stock Alert Level</label>
                <input
                  type="number"
                  value={form.minAlert}
                  onChange={(e) => setForm({ ...form, minAlert: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-ft">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setProductModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={16} />
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
