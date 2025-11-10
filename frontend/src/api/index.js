const API_BASE = '/api';

let token = localStorage.getItem('token');
let refreshToken = localStorage.getItem('refreshToken');

export function setToken(newToken, newRefreshToken = null) {
  token = newToken;
  if (newToken) {
    localStorage.setItem('token', newToken);
  } else {
    localStorage.removeItem('token');
  }

  if (newRefreshToken !== null) {
    refreshToken = newRefreshToken;
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }
}

export function getToken() {
  return token;
}

async function refreshAccessToken() {
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_BASE}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    setToken(data.access, data.refresh || refreshToken);
    return data.access;
  } catch (error) {
    // If refresh fails, clear tokens and redirect to login
    setToken(null, null);
    window.location.href = '/';
    throw error;
  }
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // If we get a 401, try to refresh the token once
  if (response.status === 401 && refreshToken && !options._retry) {
    try {
      const newToken = await refreshAccessToken();
      headers['Authorization'] = `Bearer ${newToken}`;

      // Retry the original request with new token
      response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        _retry: true,
      });
    } catch (error) {
      // Refresh failed, user will be redirected to login
      throw new Error('Session expired');
    }
  } else if (response.status === 401) {
    // No refresh token or retry already attempted
    setToken(null, null);
    window.location.href = '/';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}

export const api = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error('Login failed');

    const data = await response.json();
    // Store both access and refresh tokens
    setToken(data.access, data.refresh);
    return data;
  },

  getCategories: (type) => {
    const params = type ? `?type=${type}` : '';
    return request(`/categories/${params}`);
  },
  
  createCategory: (data) =>
    request('/categories/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getTransactions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/transactions/${query ? '?' + query : ''}`);
  },

  createTransaction: (data) =>
    request('/transactions/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateTransaction: (id, data) =>
    request(`/transactions/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteTransaction: (id) =>
    request(`/transactions/${id}/`, {
      method: 'DELETE',
    }),

  getSummary: (month) => {
    const params = month ? `?month=${month}` : '';
    return request(`/transactions/summary/${params}`);
  },

  getBudgets: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/budgets/${query ? '?' + query : ''}`);
  },

  createBudget: (data) =>
    request('/budgets/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateBudget: (id, data) =>
    request(`/budgets/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteBudget: (id) =>
    request(`/budgets/${id}/`, {
      method: 'DELETE',
    }),
};

