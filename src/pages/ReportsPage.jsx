import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Download, FileSpreadsheet, Sparkles, TrendingUp, DollarSign, Layers, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const REPORT_CARDS = [
  { id: 'sales', title: 'Sales Summary Report', icon: '📊', sub: 'Daily, weekly, and monthly gross sales & volume' },
  { id: 'inventory', title: 'Stock Ledger Report', icon: '📦', sub: 'Stock levels, valuation & reorder indicators' },
  { id: 'purchase', title: 'Purchases & Vendor Report', icon: '🛒', sub: 'PO fulfillments and supplier payables' },
  { id: 'payment', title: 'Payment Mode Report', icon: '💳', sub: 'UPI, Card, and Cash collection splits' },
  { id: 'tax', title: 'GST & Tax Filing Report', icon: '🧾', sub: 'Output GST, input credit & filing ledger' },
  { id: 'pnl', title: 'Profit & Margins Report', icon: '💰', sub: 'Gross margins, cost of goods, and net markup' }
];

export default function ReportsPage() {
  const { storeSettings, showToast, invoices, products, purchases, suppliers, returns } = useApp();
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.reports.getSummary()
      .then(data => {
        if (mounted && data) setSummaryData(data);
      })
      .catch(() => {
        // Fallback calculation from context if backend unreachable
      });
    return () => { mounted = false; };
  }, [invoices, products, returns]);

  // Compute live metrics if summaryData not yet loaded
  const totalRev = summaryData?.totalRevenue ?? invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
  const totalTax = summaryData?.totalTaxCollected ?? invoices.reduce((acc, inv) => acc + (inv.tax || 0), 0);
  const inventoryCost = summaryData?.inventoryCostValue ?? products.reduce((acc, p) => acc + ((p.cost || 0) * (p.stock || 0)), 0);
  const inventoryRetail = summaryData?.inventoryRetailValue ?? products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0);
  const totalRefunded = summaryData?.totalRefundedValue ?? returns.reduce((acc, r) => acc + (r.refund || 0), 0);

  const handleDownloadReport = (rep) => {
    const storeName = storeSettings?.storeName || 'Nexus Retail Supermarket';
    let content = `${rep.title.toUpperCase()}\nGenerated on: ${new Date().toLocaleString()}\nStore: ${storeName}\n\n`;

    if (rep.id === 'sales') {
      content += 'Invoice ID,Customer,Phone,Payment Method,Subtotal,Discount,Tax,Total,Date\n';
      invoices.forEach(inv => {
        content += `${inv.id},"${inv.customer || 'Walk-in'}","${inv.phone || '—'}","${inv.method || 'Cash'}",${inv.subtotal || 0},${inv.discount || 0},${inv.tax || 0},${inv.total || 0},"${inv.date}"\n`;
      });
    } else if (rep.id === 'inventory') {
      content += 'SKU,Product Name,Category,Cost (₹),Retail Price (₹),Stock Qty,Cost Valuation (₹),Retail Valuation (₹)\n';
      products.forEach(p => {
        const costVal = (p.cost || 0) * (p.stock || 0);
        const retVal = (p.price || 0) * (p.stock || 0);
        content += `"${p.sku || ''}","${p.name}","${p.category}",${p.cost},${p.price},${p.stock},${costVal},${retVal}\n`;
      });
    } else if (rep.id === 'purchase') {
      content += 'PO ID,Supplier,Date,Amount (₹),Payment Status,Delivery Status\n';
      purchases.forEach(po => {
        content += `${po.id},"${po.supplier}","${po.date}",${po.amount},"${po.payment}","${po.status}"\n`;
      });
    } else if (rep.id === 'payment') {
      content += 'Payment Method,Transactions Count,Total Collected (₹)\n';
      const methods = ['UPI', 'Card', 'Cash'];
      methods.forEach(m => {
        const matching = invoices.filter(inv => (inv.method || '').toLowerCase() === m.toLowerCase());
        const totalAmt = matching.reduce((sum, i) => sum + (i.total || 0), 0);
        content += `"${m}",${matching.length},${totalAmt}\n`;
      });
    } else if (rep.id === 'tax') {
      content += 'Invoice ID,Customer,Taxable Amount (₹),GST Collected (₹),Date\n';
      invoices.forEach(inv => {
        content += `${inv.id},"${inv.customer || 'Walk-in'}",${inv.subtotal || 0},${inv.tax || 0},"${inv.date}"\n`;
      });
    } else if (rep.id === 'pnl') {
      content += 'Product,Cost (₹),Retail Price (₹),Unit Margin (₹),Margin Percent (%)\n';
      products.forEach(p => {
        const margin = (p.price || 0) - (p.cost || 0);
        const marginPct = p.price ? ((margin / p.price) * 100).toFixed(1) : 0;
        content += `"${p.name}",${p.cost},${p.price},${margin},${marginPct}%\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rep.id}_report_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Report Exported', `${rep.title} downloaded in CSV format.`);
  };

  return (
    <div className="page-container">
      {/* Financial Overview KPI Grid */}
      <div className="kpi-grid" style={{ marginBottom: 22 }}>
        <div className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon i1">
              <TrendingUp size={18} />
            </div>
            <span className="kpi-trend up">Live</span>
          </div>
          <div className="kpi-label">Total Invoiced Revenue</div>
          <div className="kpi-value">₹{Number(totalRev).toLocaleString('en-IN')}</div>
          <div className="kpi-sub">{invoices.length} transactions processed</div>
        </div>

        <div className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon i2">
              <Layers size={18} />
            </div>
            <span className="kpi-trend up">{products.length} SKUs</span>
          </div>
          <div className="kpi-label">Stock Retail Valuation</div>
          <div className="kpi-value">₹{Number(inventoryRetail).toLocaleString('en-IN')}</div>
          <div className="kpi-sub">Cost: ₹{Number(inventoryCost).toLocaleString('en-IN')}</div>
        </div>

        <div className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon i3">
              <DollarSign size={18} />
            </div>
            <span className="kpi-trend up">18% GST</span>
          </div>
          <div className="kpi-label">Total Tax Collected</div>
          <div className="kpi-value">₹{Number(totalTax).toLocaleString('en-IN')}</div>
          <div className="kpi-sub">Output GST reserve</div>
        </div>

        <div className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon i4">
              <ShieldCheck size={18} />
            </div>
            <span className="kpi-trend up">{returns.length} audits</span>
          </div>
          <div className="kpi-label">Returns & Refunds</div>
          <div className="kpi-value">₹{Number(totalRefunded).toLocaleString('en-IN')}</div>
          <div className="kpi-sub">Audited restocks</div>
        </div>
      </div>

      <div className="grid-2b" style={{ marginBottom: 22 }}>
        {/* Sales Performance */}
        <div className="card">
          <div className="card-hd">
            <div>
              <h3>Weekly Sales Velocity</h3>
              <p>Daily volume throughput</p>
            </div>
          </div>
          <div className="card-bd">
            <div className="bar-chart" style={{ height: 180 }}>
              {[
                { day: 'Mon', height: '62%' },
                { day: 'Tue', height: '80%' },
                { day: 'Wed', height: '54%' },
                { day: 'Thu', height: '90%' },
                { day: 'Fri', height: '72%' },
                { day: 'Sat', height: '98%' },
                { day: 'Sun', height: '84%' }
              ].map((b) => (
                <div key={b.day} className="bar-col">
                  <div className="bar" style={{ height: b.height }} />
                  <span className="bar-x">{b.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Contribution */}
        <div className="card">
          <div className="card-hd">
            <div>
              <h3>Category Revenue Contribution</h3>
              <p>Contribution towards month's turnover</p>
            </div>
          </div>
          <div className="card-bd">
            {[
              { name: 'Grains & Rice', amt: '₹2,84,500', width: '82%', bg: 'linear-gradient(90deg,#6366F1,#8B5CF6)' },
              { name: 'Dairy Products', amt: '₹1,92,300', width: '62%', bg: 'linear-gradient(90deg,#10B981,#059669)' },
              { name: 'Beverages', amt: '₹1,48,900', width: '48%', bg: 'linear-gradient(90deg,#F59E0B,#D97706)' },
              { name: 'Snacks & Confectionery', amt: '₹98,200', width: '32%', bg: 'linear-gradient(90deg,#EC4899,#DB2777)' },
              { name: 'Personal Care', amt: '₹72,400', width: '24%', bg: 'linear-gradient(90deg,#0EA5E9,#0284C7)' }
            ].map((cat, idx) => (
              <div key={idx} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{cat.name}</span>
                  <span style={{ fontWeight: 700 }}>{cat.amt}</span>
                </div>
                <div className="progress">
                  <div className="bar-fill" style={{ width: cat.width, background: cat.bg }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Downloadable Reports */}
      <div className="card">
        <div className="card-hd">
          <div>
            <h3>Available Financial & Audit Reports</h3>
            <p>Generate, export, and download real-time business statements</p>
          </div>
        </div>
        <div className="card-bd">
          <div className="grid-3">
            {REPORT_CARDS.map((rep) => (
              <div
                key={rep.id}
                className="prod-card"
                onClick={() => handleDownloadReport(rep)}
                style={{ cursor: 'pointer', padding: 18 }}
                title="Click to download CSV report"
              >
                <div className="prod-thumb" style={{ fontSize: 28, height: 70 }}>
                  {rep.icon}
                </div>
                <div className="prod-name" style={{ minHeight: 'auto', fontSize: 14 }}>
                  {rep.title}
                </div>
                <div className="td-muted" style={{ fontSize: 12, marginBottom: 8 }}>
                  {rep.sub}
                </div>
                <button className="btn btn-outline btn-sm btn-block" style={{ marginTop: 'auto' }}>
                  <Download size={14} /> Download CSV
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
