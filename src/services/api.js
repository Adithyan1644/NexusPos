const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('nexus_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type');
  const data = contentType && contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorMessage = (data && data.message) || (typeof data === 'string' && data) || 'API Request Failed';
    throw new Error(errorMessage);
  }

  return data;
}

export const api = {
  auth: {
    signIn: (email, password) =>
      request('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }),
    signUp: (userData) =>
      request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
    getMe: () => request('/auth/me')
  },
  products: {
    getAll: (category, search) => {
      const params = new URLSearchParams();
      if (category && category !== 'All Items' && category !== 'All Categories') params.append('category', category);
      if (search) params.append('search', search);
      const query = params.toString() ? `?${params.toString()}` : '';
      return request(`/products${query}`);
    },
    getById: (id) => request(`/products/${id}`),
    create: (data) =>
      request('/products', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    delete: (id) =>
      request(`/products/${id}`, {
        method: 'DELETE'
      }),
    getLowStock: () => request('/products/low-stock')
  },
  orders: {
    getAll: () => request('/orders'),
    getById: (id) => request(`/orders/${id}`),
    checkout: (payload) =>
      request('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
  },
  dashboard: {
    getStats: () => request('/dashboard/stats')
  },
  customers: {
    getAll: () => request('/customers'),
    create: (data) =>
      request('/customers', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    delete: (id) =>
      request(`/customers/${id}`, {
        method: 'DELETE'
      })
  },
  suppliers: {
    getAll: () => request('/suppliers'),
    create: (data) =>
      request('/suppliers', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/suppliers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    delete: (id) =>
      request(`/suppliers/${id}`, {
        method: 'DELETE'
      })
  },
  purchases: {
    getAll: () => request('/purchases'),
    create: (data) =>
      request('/purchases', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    receive: (id) =>
      request(`/purchases/${id}/receive`, {
        method: 'PUT'
      })
  },
  returns: {
    getAll: () => request('/returns'),
    create: (data) =>
      request('/returns', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    updateStatus: (id, status) =>
      request(`/returns/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      })
  },
  inventory: {
    getLogs: () => request('/inventory/logs'),
    adjust: (payload) =>
      request('/inventory/adjust', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
  },
  users: {
    getAll: () => request('/users'),
    create: (data) =>
      request('/users', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    delete: (id) =>
      request(`/users/${id}`, {
        method: 'DELETE'
      })
  },
  settings: {
    get: () => request('/settings'),
    update: (data) =>
      request('/settings', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
  },
  reports: {
    getSummary: () => request('/reports/summary')
  }
};

export default api;
