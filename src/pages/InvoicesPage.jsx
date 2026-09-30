import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Download, Eye, FileText } from 'lucide-react';

export default function InvoicesPage() {
  const { invoices, setActiveInvoiceModal, storeSettings, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        !search ||
        inv.id.toLowerCase().includes(search.toLowerCase()) ||
        inv.customer.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        selectedStatus === 'All Status' || inv.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [invoices, search, selectedStatus]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredInvoices.slice(start, start + pageSize);
  }, [filteredInvoices, page]);

  const totalPages = Math.ceil(filteredInvoices.length / pageSize) || 1;

  const handleExportCSV = () => {
    const headers = 'Invoice ID,Customer,Phone,Method,Date,Subtotal,Discount,Tax,Total,Status\n';
    const rows = invoices
      .map(
        inv =>
          `"${inv.id}","${inv.customer}","${inv.phone}","${inv.method}","${inv.date}",${inv.subtotal},${inv.discount},${inv.tax},${inv.total},"${inv.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_invoices_${Date.now()}.csv`;
    a.click();
    showToast('success', 'Export Complete', 'Invoice records exported to CSV.');
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="toolbar">
          <div className="search">
            <Search size={16} />
            <input
              placeholder="Search invoice number or customer name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '9px 14px',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontSize: 13.5,
              background: '#fff'
            }}
          >
            <option>All Status</option>
            <option>Paid</option>
            <option>Partial</option>
            <option>Refunded</option>
          </select>

          <div className="spacer" />

          <button className="btn btn-outline btn-sm" onClick={handleExportCSV}>
            <Download size={15} />
            Export CSV
          </button>
        </div>

        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Purchased Items</th>
                <th>Payment Mode</th>
                <th>Date & Time</th>
                <th>Total Bill</th>
                <th>Status</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {paginated.map((inv) => (
                <tr key={inv.id}>
                  <td className="mono td-strong" style={{ color: 'var(--primary)' }}>
                    {inv.id}
                  </td>
                  <td>
                    <div className="td-strong">{inv.customer}</div>
                    <div className="td-muted" style={{ fontSize: 11.5 }}>
                      {inv.phone}
                    </div>
                  </td>
                  <td>{inv.items?.length || 1} items</td>
                  <td>
                    <span
                      className={`badge ${
                        inv.method === 'UPI'
                          ? 'info'
                          : inv.method === 'Card'
                          ? 'purple'
                          : 'neutral'
                      } no-dot`}
                    >
                      {inv.method}
                    </span>
                  </td>
                  <td className="td-muted">{inv.date}</td>
                  <td className="td-strong" style={{ color: 'var(--text)' }}>
                    {storeSettings.currency}{inv.total.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        inv.status === 'Paid'
                          ? 'success'
                          : inv.status === 'Partial'
                          ? 'warning'
                          : 'danger'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="icon-btn"
                      style={{ width: 32, height: 32 }}
                      onClick={() => setActiveInvoiceModal(inv)}
                      title="View Printable Invoice"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="empty">
                      <h4>No invoices found</h4>
                      <p>Completed POS orders will automatically show up here</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Showing {filteredInvoices.length > 0 ? (page - 1) * pageSize + 1 : 0}–
            {Math.min(page * pageSize, filteredInvoices.length)} of {filteredInvoices.length} invoices
          </span>

          <div className="page-btns">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                className={page === i + 1 ? 'active' : ''}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
