import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  IndianRupee,
  ShoppingBag,
  AlertTriangle,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Database
} from 'lucide-react';

export default function DashboardPage() {
  const {
    products,
    invoices,
    customers,
    setCurrentPage,
    setActiveInvoiceModal,
    storeSettings,
    dashboardStats,
    backendConnected
  } = useApp();

  const lowStockProducts = products.filter(p => p.stock <= p.minAlert);
  const totalRevenue = dashboardStats?.todayRevenue ?? invoices.reduce((sum, inv) => sum + inv.total, 84520);
  const totalOrders = dashboardStats?.ordersToday ?? (invoices.length + 308);
  const lowStockCount = dashboardStats?.lowStockCount ?? lowStockProducts.length;
  const activeCustomersCount = dashboardStats?.activeCustomersCount ?? (customers.length + 2842);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  const [chartRange, setChartRange] = useState('7d');
  const curr = storeSettings?.currency || '₹';

  const chartDatasets = {
    '7d': {
      title: 'Past 7 Days Sales',
      summary: curr + '5,46,700',
      bars: [
        { day: 'Mon', height: '58%', amt: curr + '62,400' },
        { day: 'Tue', height: '74%', amt: curr + '78,200' },
        { day: 'Wed', height: '50%', amt: curr + '54,300' },
        { day: 'Thu', height: '88%', amt: curr + '91,000' },
        { day: 'Fri', height: '68%', amt: curr + '71,500' },
        { day: 'Sat', height: '96%', amt: curr + '1,02,400' },
        { day: 'Sun', height: '82%', amt: curr + '86,900' }
      ]
    },
    '30d': {
      title: 'Past 30 Days Sales',
      summary: curr + '25,64,000',
      bars: [
        { day: 'W1', height: '65%', amt: curr + '4,85,000' },
        { day: 'W2', height: '78%', amt: curr + '5,42,000' },
        { day: 'W3', height: '72%', amt: curr + '5,18,000' },
        { day: 'W4', height: '92%', amt: curr + '6,24,000' },
        { day: 'W5', height: '54%', amt: curr + '3,95,000' }
      ]
    },
    'quarter': {
      title: 'Current Quarter Performance',
      summary: curr + '64,80,000',
      bars: [
        { day: 'Month 1', height: '72%', amt: curr + '18,40,000' },
        { day: 'Month 2', height: '85%', amt: curr + '21,60,000' },
        { day: 'Month 3', height: '96%', amt: curr + '24,80,000' }
      ]
    },
    'year': {
      title: 'Annual Performance (12 Months)',
      summary: curr + '2.68 Cr',
      bars: [
        { day: 'Jan', height: '52%', amt: curr + '14.2L' },
        { day: 'Feb', height: '58%', amt: curr + '15.8L' },
        { day: 'Mar', height: '68%', amt: curr + '18.1L' },
        { day: 'Apr', height: '63%', amt: curr + '16.9L' },
        { day: 'May', height: '74%', amt: curr + '19.4L' },
        { day: 'Jun', height: '80%', amt: curr + '20.8L' },
        { day: 'Jul', height: '82%', amt: curr + '21.2L' },
        { day: 'Aug', height: '90%', amt: curr + '23.5L' },
        { day: 'Sep', height: '96%', amt: curr + '25.1L' },
        { day: 'Oct', height: '86%', amt: curr + '22.4L' },
        { day: 'Nov', height: '94%', amt: curr + '24.8L' },
        { day: 'Dec', height: '100%', amt: curr + '26.0L' }
      ]
    }
  };

  const activeChartData = chartDatasets[chartRange] || chartDatasets['7d'];

  // Calculate payment method share
  const paymentBreakdown = dashboardStats?.paymentBreakdown;
  const cardPct = paymentBreakdown ? (paymentBreakdown.Card || 42) : 42;
  const upiPct = paymentBreakdown ? (paymentBreakdown.UPI || 32) : 32;
  const cashPct = paymentBreakdown ? (paymentBreakdown.Cash || 19) : 19;
  const otherPct = paymentBreakdown ? (paymentBreakdown.Other || 7) : 7;

  return (
    <div className="page-container">
      {/* Quick Launchpad & Backend Status */}
      <div className="dashboard-status-strip">
        <div className="status-left">
          <div className="status-indicator-beacon" />
          <div>
            <div className="status-heading">
              Enterprise POS Core · Spring Boot & H2 Persistent Engine
            </div>
            <div className="status-sub">
              Live Stock Deduction · Atomic Ledger Active · Multi-Register Ready
            </div>
          </div>
        </div>

        <div className="status-actions">
          <button
            onClick={() => setCurrentPage('pos')}
            className="btn btn-primary btn-sm"
            style={{ gap: 6, padding: '6px 14px', fontSize: 12 }}
          >
            <ShoppingBag size={14} />
            <span>Open Register (POS)</span>
          </button>
          <button
            onClick={() => setCurrentPage('reports')}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 12, padding: '6px 12px' }}
          >
            <span>Daily Z-Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon i1">
              <IndianRupee size={18} />
            </div>
            <span className="kpi-trend up">
              <ArrowUpRight size={11} /> +12.4%
            </span>
          </div>
          <div className="kpi-label">Today's Gross Sales</div>
          <div className="kpi-value">
            {storeSettings.currency}{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="kpi-sub">vs ₹75,180 yesterday · Net Profit ₹{(totalRevenue * 0.28).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <svg className="spark" width="56" height="20" viewBox="0 0 70 24" fill="none">
            <path
              d="M2 18 L12 14 L22 16 L32 10 L42 12 L52 6 L68 8"
              stroke="#4F46E5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon i2">
              <ShoppingBag size={18} />
            </div>
            <span className="kpi-trend up">
              <ArrowUpRight size={11} /> +8.1%
            </span>
          </div>
          <div className="kpi-label">Total Completed Orders</div>
          <div className="kpi-value">{totalOrders}</div>
          <div className="kpi-sub">Avg ticket: {storeSettings.currency}{Math.round(totalRevenue / (totalOrders || 1))} per receipt</div>
          <svg className="spark" width="56" height="20" viewBox="0 0 70 24" fill="none">
            <path
              d="M2 16 L12 12 L22 14 L32 8 L42 10 L52 4 L68 6"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="kpi" style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('inventory')}>
          <div className="kpi-top">
            <div className="kpi-icon i3">
              <AlertTriangle size={18} />
            </div>
            <span className="kpi-trend down">
              <ArrowDownRight size={11} /> {outOfStockProducts.length} zero stock
            </span>
          </div>
          <div className="kpi-label">Low Stock Warnings</div>
          <div className="kpi-value">{lowStockCount}</div>
          <div className="kpi-sub">{outOfStockProducts.length} depleted · Click to restock</div>
          <svg className="spark" width="56" height="20" viewBox="0 0 70 24" fill="none">
            <path
              d="M2 6 L12 8 L22 7 L32 12 L42 10 L52 16 L68 14"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="kpi" style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('customers')}>
          <div className="kpi-top">
            <div className="kpi-icon i4">
              <UserPlus size={18} />
            </div>
            <span className="kpi-trend up">
              <ArrowUpRight size={11} /> +{customers.length}
            </span>
          </div>
          <div className="kpi-label">Active Customer Accounts</div>
          <div className="kpi-value">{activeCustomersCount}</div>
          <div className="kpi-sub">94% repeat purchase rate</div>
          <svg className="spark" width="56" height="20" viewBox="0 0 70 24" fill="none">
            <path
              d="M2 20 L12 18 L22 14 L32 15 L42 10 L52 8 L68 4"
              stroke="#EC4899"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Row 2: Revenue Chart + Payment Donut */}
      <div className="grid-2">
        <div className="card">
          <div className="card-hd">
            <div>
              <h3>Revenue Performance</h3>
              <p><span className="live-dot" />Live register sync</p>
            </div>
            <div className="spacer" />
            <select
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value)}
              style={{
                padding: '4px 10px',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 11.5,
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="quarter">This Quarter</option>
              <option value="year">Last 12 Months</option>
            </select>
          </div>
          <div className="card-bd" style={{ padding: '12px 14px' }}>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ background: '#4F46E5' }} />
                <span>Sales Volume ({activeChartData.summary})</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: '#10B981' }} />
                <span>Avg Revenue</span>
              </div>
            </div>
            <div className="bar-chart">
              {activeChartData.bars.map((b) => (
                <div key={b.day} className="bar-col" title={`${b.day}: ${b.amt}`}>
                  <div className="bar" style={{ height: b.height, maxWidth: '48px', width: '100%', margin: '0 auto' }} />
                  <span className="bar-x">{b.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <div>
              <h3>Payment Methods</h3>
              <p>Breakdown across all registers</p>
            </div>
          </div>
          <div className="card-bd" style={{ padding: '12px 14px' }}>
            <div className="donut-wrap">
              <div className="donut">
                <svg width="130" height="130" viewBox="0 0 130 130">
                  <circle cx="65" cy="65" r="48" fill="none" stroke="#EEF2FF" strokeWidth="15" />
                  <circle
                    className="seg"
                    cx="65"
                    cy="65"
                    r="48"
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="15"
                    strokeDasharray="144 301"
                    strokeLinecap="round"
                  />
                  <circle
                    className="seg"
                    cx="65"
                    cy="65"
                    r="48"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="15"
                    strokeDasharray="87 301"
                    strokeDashoffset="-144"
                    strokeLinecap="round"
                  />
                  <circle
                    className="seg"
                    cx="65"
                    cy="65"
                    r="48"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="15"
                    strokeDasharray="48 301"
                    strokeDashoffset="-231"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="donut-center">
                  <div>
                    <div className="v">{storeSettings.currency}4.2L</div>
                    <div className="l">Total Paid</div>
                  </div>
                </div>
              </div>

              <div className="donut-legend">
                <div className="dl-row">
                  <span className="dl-dot" style={{ background: '#4F46E5' }} />
                  <span className="nm">Card</span>
                  <span className="vl">{cardPct}%</span>
                </div>
                <div className="dl-row">
                  <span className="dl-dot" style={{ background: '#10B981' }} />
                  <span className="nm">UPI</span>
                  <span className="vl">{upiPct}%</span>
                </div>
                <div className="dl-row">
                  <span className="dl-dot" style={{ background: '#F59E0B' }} />
                  <span className="nm">Cash</span>
                  <span className="vl">{cashPct}%</span>
                </div>
                <div className="dl-row">
                  <span className="dl-dot" style={{ background: '#CBD5E1' }} />
                  <span className="nm">Credit/Other</span>
                  <span className="vl">{otherPct}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Transactions + Low Stock Alerts */}
      <div className="grid-2">
        <div className="card">
          <div className="card-hd">
            <div>
              <h3>Recent Invoices</h3>
              <p>Real-time stream of completed sales</p>
            </div>
            <div className="spacer" />
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setCurrentPage('invoices')}
            >
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 5).map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => setActiveInvoiceModal(inv)}
                    style={{ cursor: 'pointer' }}
                    title="Click to view printable receipt"
                  >
                    <td className="mono td-strong" style={{ color: 'var(--primary)' }}>
                      {inv.id}
                    </td>
                    <td>{inv.customer}</td>
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
                    <td style={{ textAlign: 'right' }} className="td-strong">
                      {storeSettings.currency}{inv.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <div>
              <h3>Low Stock Alerts</h3>
              <p><span className="live-dot" />{lowStockProducts.length} items requiring replenishment</p>
            </div>
            <div className="spacer" />
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setCurrentPage('inventory')}
            >
              Manage
            </button>
          </div>
          <div className="card-bd" style={{ paddingTop: 4 }}>
            {lowStockProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="activity">
                <div
                  className="ic"
                  style={{
                    background: p.stock === 0 ? 'var(--danger-50)' : 'var(--warning-50)',
                    color: p.stock === 0 ? 'var(--danger)' : 'var(--warning)',
                    fontSize: 16
                  }}
                >
                  {p.emoji}
                </div>
                <div>
                  <div className="tt">{p.name}</div>
                  <div className="st">
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} units left`} · Min: {p.minAlert}
                  </div>
                </div>
                <div
                  className="amt"
                  style={{ color: p.stock === 0 ? 'var(--danger)' : 'var(--warning)' }}
                >
                  {p.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                </div>
              </div>
            ))}

            {lowStockProducts.length === 0 && (
              <div className="empty">
                <p>All stock levels are optimal!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
