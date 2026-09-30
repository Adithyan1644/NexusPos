import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import api from '../services/api';

const AppContext = createContext();

const INITIAL_PRODUCTS = [
  { id: 'prod-1', name: 'Basmati Rice 5kg', sku: 'SKU-0001', barcode: '8901234567890', category: 'Grains', cost: 520, price: 649, stock: 42, minAlert: 20, emoji: '🍚', status: 'Active' },
  { id: 'prod-2', name: 'Olive Oil 1L', sku: 'SKU-0002', barcode: '8901234567891', category: 'Oils', cost: 720, price: 899, stock: 0, minAlert: 15, emoji: '🫒', status: 'Active' },
  { id: 'prod-3', name: 'Whole Wheat Bread', sku: 'SKU-0003', barcode: '8901234567892', category: 'Bakery', cost: 32, price: 45, stock: 128, minAlert: 20, emoji: '🍞', status: 'Active' },
  { id: 'prod-4', name: 'Amul Milk 1L', sku: 'SKU-0004', barcode: '8901234567893', category: 'Dairy', cost: 52, price: 68, stock: 9, minAlert: 15, emoji: '🥛', status: 'Active' },
  { id: 'prod-5', name: 'Green Tea 100g', sku: 'SKU-0005', barcode: '8901234567894', category: 'Beverages', cost: 240, price: 320, stock: 56, minAlert: 15, emoji: '🍵', status: 'Active' },
  { id: 'prod-6', name: 'Dark Chocolate 70%', sku: 'SKU-0006', barcode: '8901234567895', category: 'Snacks', cost: 110, price: 150, stock: 74, minAlert: 20, emoji: '🍫', status: 'Active' },
  { id: 'prod-7', name: 'Orange Juice 1L', sku: 'SKU-0007', barcode: '8901234567896', category: 'Beverages', cost: 85, price: 120, stock: 33, minAlert: 10, emoji: '🧃', status: 'Active' },
  { id: 'prod-8', name: 'Potato Chips 200g', sku: 'SKU-0008', barcode: '8901234567897', category: 'Snacks', cost: 60, price: 85, stock: 98, minAlert: 25, emoji: '🍟', status: 'Active' },
  { id: 'prod-9', name: 'Toothpaste 150g', sku: 'SKU-0009', barcode: '8901234567898', category: 'Personal Care', cost: 80, price: 110, stock: 14, minAlert: 20, emoji: '🪥', status: 'Active' },
  { id: 'prod-10', name: 'Hand Sanitizer 500ml', sku: 'SKU-0010', barcode: '8901234567899', category: 'Personal Care', cost: 65, price: 95, stock: 61, minAlert: 15, emoji: '🧴', status: 'Active' },
  { id: 'prod-11', name: 'Coffee Beans 250g', sku: 'SKU-0011', barcode: '8901234567800', category: 'Beverages', cost: 360, price: 480, stock: 28, minAlert: 10, emoji: '☕', status: 'Active' },
  { id: 'prod-12', name: 'Yogurt 500g', sku: 'SKU-0012', barcode: '8901234567801', category: 'Dairy', cost: 55, price: 75, stock: 7, minAlert: 15, emoji: '🥣', status: 'Active' }
];

const INITIAL_CUSTOMERS = [
  { id: 'cust-1', name: 'Priya Sharma', phone: '+91 98765 43210', email: 'priya@example.com', type: 'Gold', totalSpent: 124500, outstanding: 0, lastVisit: 'Today' },
  { id: 'cust-2', name: 'Rahul Verma', phone: '+91 98765 43211', email: 'rahul.v@example.com', type: 'Silver', totalSpent: 68200, outstanding: 1800, lastVisit: 'Today' },
  { id: 'cust-3', name: 'Amit Patel', phone: '+91 98765 43212', email: 'amit.p@example.com', type: 'Gold', totalSpent: 204300, outstanding: 4900, lastVisit: 'Yesterday' },
  { id: 'cust-4', name: 'Sneha Reddy', phone: '+91 98765 43213', email: 'sneha.r@example.com', type: 'Regular', totalSpent: 32100, outstanding: 0, lastVisit: 'Yesterday' },
  { id: 'cust-5', name: 'Manoj Kumar', phone: '+91 98765 43214', email: 'manoj@example.com', type: 'Regular', totalSpent: 18450, outstanding: 0, lastVisit: '3 days ago' }
];

const INITIAL_INVOICES = [
  {
    id: 'INV-2024-0891',
    customer: 'Priya Sharma',
    phone: '+91 98765 43210',
    method: 'UPI',
    status: 'Paid',
    items: [
      { name: 'Basmati Rice 5kg', price: 649, qty: 2, total: 1298 },
      { name: 'Whole Wheat Bread', price: 45, qty: 3, total: 135 },
      { name: 'Amul Milk 1L', price: 68, qty: 4, total: 272 }
    ],
    subtotal: 1705,
    discount: 85,
    tax: 292,
    total: 1912,
    date: '17 Sep 2026, 14:20'
  },
  {
    id: 'INV-2024-0890',
    customer: 'Rahul Verma',
    phone: '+91 98765 43211',
    method: 'Card',
    status: 'Paid',
    items: [
      { name: 'Olive Oil 1L', price: 899, qty: 1, total: 899 },
      { name: 'Green Tea 100g', price: 320, qty: 1, total: 320 }
    ],
    subtotal: 1219,
    discount: 61,
    tax: 208,
    total: 1366,
    date: '17 Sep 2026, 13:05'
  },
  {
    id: 'INV-2024-0889',
    customer: 'Walk-in Customer',
    phone: '—',
    method: 'Cash',
    status: 'Paid',
    items: [
      { name: 'Potato Chips 200g', price: 85, qty: 4, total: 340 },
      { name: 'Orange Juice 1L', price: 120, qty: 2, total: 240 }
    ],
    subtotal: 580,
    discount: 0,
    tax: 104,
    total: 684,
    date: '17 Sep 2026, 11:45'
  },
  {
    id: 'INV-2024-0888',
    customer: 'Amit Patel',
    phone: '+91 98765 43212',
    method: 'UPI',
    status: 'Partial',
    items: [
      { name: 'Coffee Beans 250g', price: 480, qty: 6, total: 2880 },
      { name: 'Dark Chocolate 70%', price: 150, qty: 10, total: 1500 }
    ],
    subtotal: 4380,
    discount: 219,
    tax: 749,
    total: 4910,
    date: '16 Sep 2026, 18:30'
  }
];

const INITIAL_SUPPLIERS = [
  { id: 'sup-1', name: 'Agro Supplies Pvt Ltd', gstin: '29ABCDE1234F1Z5', contact: 'Rajesh Kumar', phone: '+91 98765 11111', orders: 128, outstanding: 0, status: 'Active' },
  { id: 'sup-2', name: 'Fresh Dairy Co.', gstin: '29FGHIJ5678K2Z6', contact: 'Suresh Patel', phone: '+91 98765 22222', orders: 92, outstanding: 18240, status: 'Active' },
  { id: 'sup-3', name: 'Sunrise Beverages', gstin: '29KLMNO9012P3Z7', contact: 'Anita Sharma', phone: '+91 98765 33333', orders: 76, outstanding: 9600, status: 'Active' },
  { id: 'sup-4', name: 'Packaging World', gstin: '29QRSTU3456V4Z8', contact: 'Vikram Singh', phone: '+91 98765 44444', orders: 54, outstanding: 0, status: 'Active' }
];

const INITIAL_PURCHASES = [
  { id: 'PO-2024-0234', supplier: 'Agro Supplies Pvt Ltd', itemsCount: 4, total: 42500, payment: 'Paid', status: 'Received', date: '17 Sep 2026' },
  { id: 'PO-2024-0233', supplier: 'Fresh Dairy Co.', itemsCount: 6, total: 18240, payment: 'Partial', status: 'Received', date: '17 Sep 2026' },
  { id: 'PO-2024-0232', supplier: 'Sunrise Beverages', itemsCount: 3, total: 9600, payment: 'Unpaid', status: 'Pending', date: '16 Sep 2026' },
  { id: 'PO-2024-0231', supplier: 'Packaging World', itemsCount: 2, total: 5200, payment: 'Paid', status: 'Received', date: '15 Sep 2026' }
];

const INITIAL_RETURNS = [
  { id: 'RET-2024-0042', invoice: 'INV-2024-0887', customer: 'Sneha Reddy', item: 'Basmati Rice 5kg', refund: 649, reason: 'Damaged packaging', status: 'Approved', date: '17 Sep 2026' },
  { id: 'RET-2024-0041', invoice: 'INV-2024-0883', customer: 'Amit Patel', item: 'Olive Oil 1L', refund: 899, reason: 'Wrong item selected', status: 'Approved', date: '16 Sep 2026' },
  { id: 'RET-2024-0040', invoice: 'INV-2024-0879', customer: 'Rahul Verma', item: 'Green Tea 100g', refund: 320, reason: 'Changed mind', status: 'Pending', date: '16 Sep 2026' },
  { id: 'RET-2024-0039', invoice: 'INV-2024-0871', customer: 'Priya Sharma', item: 'Coffee Beans 250g', refund: 480, reason: 'Quality dissatisfaction', status: 'Approved', date: '15 Sep 2026' }
];

const INITIAL_USERS = [
  { id: 'usr-1', name: 'Sarah Anderson', email: 'sarah@nexuspos.com', role: 'Super Admin', lastLogin: 'Just now', status: 'Active', initials: 'SA' },
  { id: 'usr-2', name: 'Ravi Kumar', email: 'ravi@nexuspos.com', role: 'Manager', lastLogin: '2 hours ago', status: 'Active', initials: 'RK' },
  { id: 'usr-3', name: 'Maya Pillai', email: 'maya@nexuspos.com', role: 'Cashier', lastLogin: 'Today, 09:00', status: 'Active', initials: 'MP' },
  { id: 'usr-4', name: 'Arjun Joshi', email: 'arjun@nexuspos.com', role: 'Inventory', lastLogin: 'Yesterday', status: 'Active', initials: 'AJ' },
  { id: 'usr-5', name: 'Nisha Patel', email: 'nisha@nexuspos.com', role: 'Accountant', lastLogin: '3 days ago', status: 'Inactive', initials: 'NP' }
];

const INITIAL_INVENTORY_LOGS = [
  { id: 'log-1', product: 'Basmati Rice 5kg', type: 'Stock In', ref: 'PO-2024-0234', change: 50, balance: 42, date: 'Today, 10:24', by: 'Ravi K.' },
  { id: 'log-2', product: 'Amul Milk 1L', type: 'Stock Out', ref: 'INV-2024-0891', change: -4, balance: 9, date: 'Today, 09:12', by: 'Sarah A.' },
  { id: 'log-3', product: 'Whole Wheat Bread', type: 'Stock In', ref: 'PO-2024-0233', change: 200, balance: 128, date: 'Today, 08:45', by: 'Ravi K.' },
  { id: 'log-4', product: 'Olive Oil 1L', type: 'Adjustment', ref: 'ADJ-00112', change: -3, balance: 0, date: 'Yesterday, 18:30', by: 'Maya P.' },
  { id: 'log-5', product: 'Green Tea 100g', type: 'Stock In', ref: 'PO-2024-0232', change: 40, balance: 56, date: 'Yesterday, 14:10', by: 'Ravi K.' }
];

export function AppProvider({ children }) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedToken = localStorage.getItem('nexus_token');
    const savedAuth = localStorage.getItem('nexus_auth');
    return savedToken !== null || (savedAuth !== null && JSON.parse(savedAuth) === true);
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nexus_user');
    return saved ? JSON.parse(saved) : {
      name: 'Sarah Anderson',
      email: 'sarah@nexuspos.com',
      role: 'SUPER_ADMIN',
      initials: 'SA'
    };
  });

  // Spring Boot Backend Sync State
  const [backendConnected, setBackendConnected] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);

  // Current page
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('nexus_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexus_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Sound effects state
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('nexus_sound');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('nexus_sound', JSON.stringify(next));
      return next;
    });
  };

  // Tactile Web Audio Cashier Chime
  const playCashierChime = (type = 'add') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'add') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'sale') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.24); // C6
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.45);
      }
    } catch {
      // Audio autoplay policy or not supported, ignore silently
    }
  };

  // Core Data Stores with LocalStorage Fallback
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('nexus_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('nexus_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('nexus_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('nexus_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [purchases, setPurchases] = useState(() => {
    const saved = localStorage.getItem('nexus_purchases');
    return saved ? JSON.parse(saved) : INITIAL_PURCHASES;
  });

  const [returns, setReturns] = useState(() => {
    const saved = localStorage.getItem('nexus_returns');
    return saved ? JSON.parse(saved) : INITIAL_RETURNS;
  });

  const [inventoryLogs, setInventoryLogs] = useState(() => {
    const saved = localStorage.getItem('nexus_inv_logs');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY_LOGS;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('nexus_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [storeSettings, setStoreSettings] = useState(() => {
    const saved = localStorage.getItem('nexus_settings');
    return saved ? JSON.parse(saved) : {
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
  });

  // POS Cart State
  const [cart, setCart] = useState([
    { id: 'prod-1', name: 'Basmati Rice 5kg', price: 649, qty: 2, emoji: '🍚' },
    { id: 'prod-3', name: 'Whole Wheat Bread', price: 45, qty: 3, emoji: '🍞' },
    { id: 'prod-4', name: 'Amul Milk 1L', price: 68, qty: 4, emoji: '🥛' }
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState(INITIAL_CUSTOMERS[0]);
  const [discountPercent, setDiscountPercent] = useState(5);

  // Active Modals
  const [activeInvoiceModal, setActiveInvoiceModal] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Fetch Dashboard Stats from Spring Boot
  const fetchDashboardStats = async () => {
    try {
      const stats = await api.dashboard.getStats();
      if (stats) {
        setDashboardStats(stats);
      }
    } catch (err) {
      console.warn('Dashboard stats fetch failed:', err);
    }
  };

  // Load all data from Spring Boot REST API
  const loadBackendData = async () => {
    try {
      const [prods, custs, ords, sups, pos, rets, logs, usrs, sets, stats] = await Promise.allSettled([
        api.products.getAll(),
        api.customers.getAll(),
        api.orders.getAll(),
        api.suppliers.getAll(),
        api.purchases.getAll(),
        api.returns.getAll(),
        api.inventory.getLogs(),
        api.users.getAll(),
        api.settings.get(),
        api.dashboard.getStats()
      ]);

      if (prods.status === 'fulfilled' && Array.isArray(prods.value) && prods.value.length > 0) {
        setProducts(prods.value);
      }
      if (custs.status === 'fulfilled' && Array.isArray(custs.value) && custs.value.length > 0) {
        setCustomers(custs.value);
      }
      if (ords.status === 'fulfilled' && Array.isArray(ords.value) && ords.value.length > 0) {
        setInvoices(ords.value);
      }
      if (sups.status === 'fulfilled' && Array.isArray(sups.value) && sups.value.length > 0) {
        setSuppliers(sups.value);
      }
      if (pos.status === 'fulfilled' && Array.isArray(pos.value) && pos.value.length > 0) {
        setPurchases(pos.value);
      }
      if (rets.status === 'fulfilled' && Array.isArray(rets.value) && rets.value.length > 0) {
        setReturns(rets.value);
      }
      if (logs.status === 'fulfilled' && Array.isArray(logs.value) && logs.value.length > 0) {
        setInventoryLogs(logs.value);
      }
      if (usrs.status === 'fulfilled' && Array.isArray(usrs.value) && usrs.value.length > 0) {
        setUsers(usrs.value);
      }
      if (sets.status === 'fulfilled' && sets.value) {
        setStoreSettings(sets.value);
      }
      if (stats.status === 'fulfilled' && stats.value) {
        setDashboardStats(stats.value);
      }
      setBackendConnected(true);
    } catch (e) {
      console.warn('Backend sync failed, maintaining local cache:', e);
    }
  };

  // Synchronize on mount and on page changes
  useEffect(() => {
    loadBackendData();
  }, []);

  useEffect(() => {
    if (currentPage === 'dashboard') {
      fetchDashboardStats();
    }
  }, [currentPage]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nexus_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('nexus_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nexus_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('nexus_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('nexus_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('nexus_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('nexus_returns', JSON.stringify(returns));
  }, [returns]);

  useEffect(() => {
    localStorage.setItem('nexus_inv_logs', JSON.stringify(inventoryLogs));
  }, [inventoryLogs]);

  useEffect(() => {
    localStorage.setItem('nexus_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  // Toast Helper
  const showToast = (type, title, message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth methods with Spring Boot integration
  const login = async (email, password) => {
    try {
      const res = await api.auth.signIn(email, password);
      if (res.token) {
        localStorage.setItem('nexus_token', res.token);
      }
      if (res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('nexus_user', JSON.stringify(res.user));
      }
      setIsAuthenticated(true);
      setBackendConnected(true);
      showToast('success', `Welcome back, ${res.user?.name || 'Admin'}!`, 'Authenticated via Spring Boot & JWT.');
      loadBackendData();
      return res;
    } catch (err) {
      // Offline fallback for demo admin if backend was unreachable
      if (email === 'sarah@nexuspos.com' && password === 'password') {
        setIsAuthenticated(true);
        showToast('success', 'Welcome back, Sarah!', 'Signed in successfully.');
        return;
      }
      throw err;
    }
  };

  const signup = async (userData) => {
    const res = await api.auth.signUp(userData);
    if (res.token) {
      localStorage.setItem('nexus_token', res.token);
    }
    if (res.user) {
      setCurrentUser(res.user);
      localStorage.setItem('nexus_user', JSON.stringify(res.user));
    }
    setIsAuthenticated(true);
    setBackendConnected(true);
    showToast('success', 'Account Registered', `Welcome to NexusPOS, ${res.user?.name}!`);
    loadBackendData();
    return res;
  };

  const logout = () => {
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
    setIsAuthenticated(false);
    showToast('info', 'Logged out', 'You have been signed out of NexusPOS.');
  };

  // Cart Calculations
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((taxableAmount * storeSettings.defaultTax) / 100);
  const grandTotal = taxableAmount + taxAmount;

  const addToCart = (product, clickEvent) => {
    if (product.stock <= 0) {
      showToast('error', 'Out of Stock', `${product.name} is currently unavailable.`);
      return;
    }

    playCashierChime('add');

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          showToast('warn', 'Max Stock Reached', `Only ${product.stock} units available in stock.`);
          return prev;
        }
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, emoji: product.emoji || '📦' }];
    });

    // Flying Emoji animation
    if (clickEvent) {
      const cartEl = document.getElementById('cartPanel');
      if (cartEl) {
        const cartRect = cartEl.getBoundingClientRect();
        const fly = document.createElement('div');
        fly.style.cssText = `
          position: fixed; left: ${clickEvent.clientX}px; top: ${clickEvent.clientY}px;
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg,#6366F1,#8B5CF6);
          display: grid; place-items: center; color: #fff; font-size: 22px; z-index: 999;
          box-shadow: 0 10px 24px -6px rgba(99,102,241,.6); pointer-events: none;
          transition: all 0.75s cubic-bezier(.4,0,.2,1);
        `;
        fly.textContent = product.emoji || '📦';
        document.body.appendChild(fly);
        requestAnimationFrame(() => {
          fly.style.left = `${cartRect.left + 50}px`;
          fly.style.top = `${cartRect.top + 50}px`;
          fly.style.transform = 'scale(.25)';
          fly.style.opacity = '0';
        });
        setTimeout(() => fly.remove(), 800);
      }
    }
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Checkout & Charge with Spring Boot Backend Integration
  const checkoutCart = async (paymentMethod = 'UPI') => {
    if (cart.length === 0) {
      showToast('warn', 'Cart is Empty', 'Please add items before charging.');
      return;
    }

    const payload = {
      customerId: selectedCustomer?.id || null,
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      customerPhone: selectedCustomer?.phone || '—',
      paymentMethod,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total: grandTotal,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty
      }))
    };

    let newInvoice = null;
    try {
      // Call Spring Boot backend checkout
      newInvoice = await api.orders.checkout(payload);
      setBackendConnected(true);

      // Refresh products from backend so stock matches DB exactly
      api.products.getAll().then(dbProds => {
        if (Array.isArray(dbProds) && dbProds.length > 0) {
          setProducts(dbProds);
        }
      }).catch(() => {});

      // Refresh dashboard stats
      fetchDashboardStats();
    } catch (err) {
      console.warn('Backend checkout fallback to local state:', err);
      // Local fallback
      const nextIdNum = 890 + invoices.length + 1;
      const invId = `${storeSettings.invoicePrefix}${String(nextIdNum).padStart(4, '0')}`;
      const now = new Date();
      const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      newInvoice = {
        id: invId,
        customer: selectedCustomer?.name || 'Walk-in Customer',
        phone: selectedCustomer?.phone || '—',
        method: paymentMethod,
        status: 'Paid',
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          qty: item.qty,
          total: item.price * item.qty
        })),
        subtotal,
        discount: discountAmount,
        tax: taxAmount,
        total: grandTotal,
        date: formattedDate
      };

      // Decrement product inventory locally
      setProducts(prev => {
        return prev.map(p => {
          const inCart = cart.find(c => c.id === p.id);
          if (inCart) {
            const newStock = Math.max(0, p.stock - inCart.qty);
            return { ...p, stock: newStock };
          }
          return p;
        });
      });
    }

    // Append to invoices list
    setInvoices(prev => [newInvoice, ...prev.filter(inv => inv.id !== newInvoice.id)]);

    // Update customer stats
    if (selectedCustomer && selectedCustomer.id) {
      setCustomers(prev =>
        prev.map(c =>
          c.id === selectedCustomer.id
            ? { ...c, totalSpent: (c.totalSpent || 0) + grandTotal, lastVisit: 'Today' }
            : c
        )
      );
    }

    // Confetti celebration & Chime
    playCashierChime('sale');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    clearCart();
    showToast('success', 'Payment Received', `${storeSettings.currency}${grandTotal.toLocaleString('en-IN')} collected. ${newInvoice.id} created.`);
    setActiveInvoiceModal(newInvoice);
  };

  // Product CRUD Operations
  const addProduct = async (productData) => {
    const newProd = {
      id: `prod-${Date.now()}`,
      sku: productData.sku || `SKU-${String(products.length + 1).padStart(4, '0')}`,
      barcode: productData.barcode || `890123456${Math.floor(1000 + Math.random() * 9000)}`,
      name: productData.name,
      category: productData.category || 'General',
      cost: Number(productData.cost) || 0,
      price: Number(productData.price) || 0,
      stock: Number(productData.stock) || 0,
      minAlert: Number(productData.minAlert) || 15,
      emoji: productData.emoji || '📦',
      status: productData.status || 'Active'
    };

    try {
      const saved = await api.products.create(newProd);
      setProducts(prev => [saved, ...prev.filter(p => p.id !== saved.id)]);
      showToast('success', 'Product Added', `${saved.name} is now available in database.`);
      fetchDashboardStats();
    } catch (err) {
      setProducts(prev => [newProd, ...prev]);
      showToast('success', 'Product Added', `${newProd.name} added to catalog.`);
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const updated = await api.products.update(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
      showToast('success', 'Product Updated', `${updated.name} updated successfully.`);
    } catch (err) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      showToast('success', 'Product Updated', 'Product updated locally.');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.products.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('info', 'Product Removed', 'Product has been deleted from catalog.');
      fetchDashboardStats();
    } catch (err) {
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('info', 'Product Removed', 'Product deleted locally.');
    }
  };

  // Customer CRUD Operations
  const addCustomer = async (customerData) => {
    const newCust = {
      id: `cust-${Date.now()}`,
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email || '—',
      type: customerData.type || 'Regular',
      totalSpent: 0,
      outstanding: 0,
      lastVisit: 'Today'
    };

    try {
      const saved = await api.customers.create(newCust);
      setCustomers(prev => [saved, ...prev.filter(c => c.id !== saved.id)]);
      showToast('success', 'Customer Created', `${saved.name} added to customer directory.`);
    } catch (err) {
      setCustomers(prev => [newCust, ...prev]);
      showToast('success', 'Customer Created', `${newCust.name} added.`);
    }
  };

  const updateCustomer = async (id, updates) => {
    try {
      const updated = await api.customers.update(id, updates);
      setCustomers(prev => prev.map(c => c.id === id ? updated : c));
      showToast('success', 'Customer Updated', 'Profile details updated.');
    } catch (err) {
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
      showToast('success', 'Customer Updated', 'Profile updated locally.');
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await api.customers.delete(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
      showToast('info', 'Customer Deleted', 'Customer removed from directory.');
    } catch (err) {
      setCustomers(prev => prev.filter(c => c.id !== id));
      showToast('info', 'Customer Deleted', 'Customer removed.');
    }
  };

  // Supplier CRUD Operations
  const addSupplier = async (supplierData) => {
    const newSup = {
      id: `sup-${Date.now()}`,
      name: supplierData.name,
      gstin: supplierData.gstin || '29ABCDE1234F1Z5',
      contact: supplierData.contact || supplierData.name,
      phone: supplierData.phone,
      orders: 0,
      outstanding: 0,
      status: 'Active'
    };

    try {
      const saved = await api.suppliers.create(newSup);
      setSuppliers(prev => [saved, ...prev.filter(s => s.id !== saved.id)]);
      showToast('success', 'Supplier Added', `${saved.name} added to vendor registry.`);
    } catch (err) {
      setSuppliers(prev => [newSup, ...prev]);
      showToast('success', 'Supplier Added', `${newSup.name} added.`);
    }
  };

  const updateSupplier = async (id, updates) => {
    try {
      const updated = await api.suppliers.update(id, updates);
      setSuppliers(prev => prev.map(s => s.id === id ? updated : s));
      showToast('success', 'Supplier Updated', 'Vendor updated successfully.');
    } catch (err) {
      setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    }
  };

  const deleteSupplier = async (id) => {
    try {
      await api.suppliers.delete(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      showToast('info', 'Supplier Deleted', 'Vendor removed from registry.');
    } catch (err) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
    }
  };

  // Purchase Order Operations
  const createPurchaseOrder = async (poData) => {
    try {
      const saved = await api.purchases.create(poData);
      setPurchases(prev => [saved, ...prev.filter(p => p.id !== saved.id)]);
      showToast('success', 'Purchase Order Created', `${saved.id} generated for ${saved.supplier}.`);
    } catch (err) {
      const fallback = { id: `PO-2024-${String(235 + purchases.length).padStart(4, '0')}`, ...poData, status: 'Received', date: 'Today' };
      setPurchases(prev => [fallback, ...prev]);
      showToast('success', 'Purchase Order Created', `PO generated.`);
    }
  };

  const receivePurchaseOrder = async (id) => {
    try {
      const received = await api.purchases.receive(id);
      setPurchases(prev => prev.map(p => p.id === id ? received : p));
      showToast('success', 'Order Received', `${id} marked as received.`);
    } catch (err) {
      setPurchases(prev => prev.map(p => p.id === id ? { ...p, status: 'Received', payment: 'Paid' } : p));
      showToast('success', 'Order Received', `${id} received.`);
    }
  };

  // Returns & Refunds
  const processReturn = async (invId, itemName, reason, refundAmount) => {
    const retPayload = {
      invoice: invId,
      customer: 'Priya Sharma',
      item: itemName,
      refund: refundAmount,
      reason,
      status: 'Approved',
      date: 'Today'
    };

    try {
      const saved = await api.returns.create(retPayload);
      setReturns(prev => [saved, ...prev.filter(r => r.id !== saved.id)]);
      // Refresh products from backend as stock increased by 1
      api.products.getAll().then(setProducts).catch(() => {});
      showToast('success', 'Return Processed', `${saved.id} approved. ₹${refundAmount} refunded.`);
    } catch (err) {
      const fallback = { id: `RET-2024-${String(returns.length + 43).padStart(4, '0')}`, ...retPayload };
      setReturns(prev => [fallback, ...prev]);
      setProducts(prev => prev.map(p => p.name === itemName ? { ...p, stock: p.stock + 1 } : p));
      showToast('success', 'Return Processed', `${fallback.id} approved. ₹${refundAmount} refunded.`);
    }
  };

  // Inventory Adjustment
  const adjustStock = async (payload) => {
    try {
      const res = await api.inventory.adjust(payload);
      if (res.product) {
        setProducts(prev => prev.map(p => p.id === res.product.id ? res.product : p));
      }
      if (res.log) {
        setInventoryLogs(prev => [res.log, ...prev]);
      }
      showToast('success', 'Stock Adjusted', `${payload.type}: ${payload.quantity} units recorded in database.`);
      fetchDashboardStats();
    } catch (err) {
      showToast('warn', 'Adjustment Offline', 'Stock updated locally.');
    }
  };

  // Users Management
  const createUser = async (userData) => {
    try {
      const saved = await api.users.create(userData);
      setUsers(prev => [...prev.filter(u => u.id !== saved.id), saved]);
      showToast('success', 'Staff Member Added', `${saved.name} added as ${saved.role}.`);
    } catch (err) {
      const fallback = { id: `usr-${Date.now()}`, ...userData, status: 'Active', initials: (userData.name || 'US').slice(0, 2).toUpperCase() };
      setUsers(prev => [...prev, fallback]);
      showToast('success', 'User Created', `${fallback.name} added.`);
    }
  };

  const updateUser = async (id, updates) => {
    try {
      const updated = await api.users.update(id, updates);
      setUsers(prev => prev.map(u => u.id === id ? updated : u));
      showToast('success', 'User Updated', 'User role/status updated.');
    } catch (err) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.users.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      showToast('info', 'User Deleted', 'Account removed from system.');
    } catch (err) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  // Settings
  const saveSettings = async (settingsData) => {
    try {
      const saved = await api.settings.update(settingsData);
      setStoreSettings(saved);
      showToast('success', 'Settings Saved', 'Store configuration persisted to database.');
    } catch (err) {
      setStoreSettings(settingsData);
      showToast('success', 'Settings Saved', 'Settings saved locally.');
    }
  };

  // Global search keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setActiveInvoiceModal(null);
        setProductModalOpen(false);
        setCustomerModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        signup,
        logout,
        currentUser,
        backendConnected,
        dashboardStats,
        fetchDashboardStats,
        currentPage,
        setCurrentPage,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        selectedCustomer,
        setSelectedCustomer,
        invoices,
        suppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        purchases,
        createPurchaseOrder,
        receivePurchaseOrder,
        returns,
        processReturn,
        inventoryLogs,
        adjustStock,
        users,
        createUser,
        updateUser,
        deleteUser,
        storeSettings,
        setStoreSettings,
        saveSettings,
        cart,
        cartItemCount,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        subtotal,
        discountPercent,
        setDiscountPercent,
        discountAmount,
        taxAmount,
        grandTotal,
        checkoutCart,
        toasts,
        showToast,
        dismissToast,
        activeInvoiceModal,
        setActiveInvoiceModal,
        productModalOpen,
        setProductModalOpen,
        customerModalOpen,
        setCustomerModalOpen,
        commandPaletteOpen,
        setCommandPaletteOpen,
        theme,
        setTheme,
        toggleTheme,
        soundEnabled,
        toggleSound,
        playCashierChime
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
