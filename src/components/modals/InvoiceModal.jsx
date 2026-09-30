import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, CheckCircle, Copy } from 'lucide-react';

export default function InvoiceModal() {
  const { activeInvoiceModal, setActiveInvoiceModal, storeSettings, showToast } = useApp();

  if (!activeInvoiceModal) return null;

  const inv = activeInvoiceModal;

  const handlePrint = () => {
    window.print();
    showToast('info', 'Printing Invoice', `${inv.id} sent to thermal printer.`);
  };

  const handleCopy = () => {
    const text = `${storeSettings.storeName}\nInvoice: ${inv.id}\nDate: ${inv.date}\nCustomer: ${inv.customer}\nTotal: ${storeSettings.currency}${inv.total}\nPayment: ${inv.method} (${inv.status})`;
    navigator.clipboard?.writeText(text);
    showToast('success', 'Receipt Copied', 'Receipt summary copied to clipboard.');
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveInvoiceModal(null)}>
      <div
        className="modal"
        style={{ maxWidth: 480 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-hd">
          <div>
            <h3>Receipt & Invoice {inv.id}</h3>
            <p style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>
              {inv.date} · Cashier: Terminal 01
            </p>
          </div>
          <button
            className="icon-btn"
            onClick={() => setActiveInvoiceModal(null)}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-bd printable-receipt">
          {/* Header store branding */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{storeSettings.storeName}</h2>
            <p style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>{storeSettings.address}</p>
            <p style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
              GSTIN: {storeSettings.gstin} · Tel: {storeSettings.phone}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: 12,
              borderBottom: '1px solid var(--border-2)',
              marginBottom: 12
            }}
          >
            <div>
              <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase' }}>
                Customer Details
              </div>
              <div style={{ fontWeight: 700, marginTop: 2, fontSize: 13, color: 'var(--text)' }}>{inv.customer}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{inv.phone}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase' }}>
                Payment Method
              </div>
              <div style={{ fontWeight: 700, marginTop: 2, fontSize: 13, color: 'var(--text)' }}>{inv.method}</div>
              <div style={{ fontSize: 11.5, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', fontWeight: 600 }}>
                <CheckCircle size={12} /> {inv.status}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
            Purchased Line Items
          </div>

          <table style={{ fontSize: 12.5, marginBottom: 14 }}>
            <tbody>
              {inv.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-2)' }}>
                  <td style={{ padding: '7px 0' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                      {storeSettings.currency}{item.price} × {item.qty}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, verticalAlign: 'middle', color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                    {storeSettings.currency}{item.total.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ background: 'var(--surface-2)', padding: 14, borderRadius: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
              <span style={{ color: 'var(--text-2)' }}>Subtotal</span>
              <span style={{ fontWeight: 600, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                {storeSettings.currency}{inv.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            {inv.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6, color: 'var(--success)' }}>
                <span>Discount Applied</span>
                <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  − {storeSettings.currency}{inv.discount.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 10 }}>
              <span style={{ color: 'var(--text-2)' }}>GST Tax ({storeSettings.defaultTax}%)</span>
              <span style={{ fontWeight: 600, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                {storeSettings.currency}{inv.tax.toLocaleString('en-IN')}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 16,
                fontWeight: 800,
                paddingTop: 8,
                borderTop: '1.5px dashed var(--border)'
              }}
            >
              <span style={{ color: 'var(--text)' }}>Grand Total</span>
              <span style={{ color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                {storeSettings.currency}{inv.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Barcode Stripes Graphic */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 16 }}>
            <svg width="200" height="40" viewBox="0 0 200 40" fill="currentColor" style={{ opacity: 0.85, color: 'var(--text)' }}>
              <rect x="0" y="0" width="3" height="40" />
              <rect x="5" y="0" width="1" height="40" />
              <rect x="8" y="0" width="4" height="40" />
              <rect x="14" y="0" width="2" height="40" />
              <rect x="18" y="0" width="5" height="40" />
              <rect x="25" y="0" width="2" height="40" />
              <rect x="29" y="0" width="1" height="40" />
              <rect x="33" y="0" width="3" height="40" />
              <rect x="38" y="0" width="4" height="40" />
              <rect x="44" y="0" width="2" height="40" />
              <rect x="48" y="0" width="1" height="40" />
              <rect x="52" y="0" width="3" height="40" />
              <rect x="58" y="0" width="5" height="40" />
              <rect x="65" y="0" width="2" height="40" />
              <rect x="70" y="0" width="4" height="40" />
              <rect x="76" y="0" width="1" height="40" />
              <rect x="80" y="0" width="3" height="40" />
              <rect x="86" y="0" width="2" height="40" />
              <rect x="90" y="0" width="4" height="40" />
              <rect x="96" y="0" width="3" height="40" />
              <rect x="102" y="0" width="1" height="40" />
              <rect x="106" y="0" width="4" height="40" />
              <rect x="112" y="0" width="2" height="40" />
              <rect x="117" y="0" width="5" height="40" />
              <rect x="124" y="0" width="1" height="40" />
              <rect x="128" y="0" width="3" height="40" />
              <rect x="133" y="0" width="2" height="40" />
              <rect x="138" y="0" width="4" height="40" />
              <rect x="144" y="0" width="1" height="40" />
              <rect x="148" y="0" width="3" height="40" />
              <rect x="154" y="0" width="5" height="40" />
              <rect x="162" y="0" width="2" height="40" />
              <rect x="166" y="0" width="3" height="40" />
              <rect x="171" y="0" width="1" height="40" />
              <rect x="175" y="0" width="4" height="40" />
              <rect x="182" y="0" width="2" height="40" />
              <rect x="186" y="0" width="4" height="40" />
              <rect x="193" y="0" width="2" height="40" />
              <rect x="197" y="0" width="3" height="40" />
            </svg>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-3)', letterSpacing: 2, marginTop: 4 }}>
              *{inv.id}*
            </span>
          </div>

          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 10.5, color: 'var(--text-3)', fontStyle: 'italic' }}>
            {storeSettings.footerNote}
          </div>
        </div>

        <div className="modal-ft">
          <button className="btn btn-ghost" onClick={handleCopy} title="Copy receipt text">
            <Copy size={14} />
            Copy
          </button>
          <button className="btn btn-outline" onClick={() => setActiveInvoiceModal(null)}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={15} />
            Print Thermal Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
