// src/pages/Transactions/Transactions.jsx
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../api';
import { Card, Button, Input, Select, Table } from '../../components/common';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import './Transactions.css';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    description: '',
  });
  const [filters, setFilters] = useState({
    date_from: '',
    date_to: '',
    category: '',
    min_amount: '',
    max_amount: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const loadCategories = useCallback(async () => {
    try {
      const data = await api.getCategories();
      setCategories(data.results || data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filters.date_from) params.date_from = filters.date_from;
      if (filters.date_to) params.date_to = filters.date_to;
      if (filters.category) params.category = filters.category;
      if (filters.min_amount) params.min_amount = filters.min_amount;
      if (filters.max_amount) params.max_amount = filters.max_amount;

      const data = await api.getTransactions(params);
      setTransactions(data.results || data);
      setCurrentPage(1); // Reset to first page when filters change
    } catch (err) {
      setError('Failed to load transactions');
      console.error('Failed to load transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        // Update existing transaction
        await api.updateTransaction(editingId, {
          ...form,
          category: parseInt(form.category),
          amount: parseFloat(form.amount),
        });
        toast.success('Transaction updated successfully!');
        setEditingId(null);
      } else {
        // Create new transaction
        await api.createTransaction({
          ...form,
          category: parseInt(form.category),
          amount: parseFloat(form.amount),
        });
        toast.success('Transaction added successfully!');
      }

      setForm({
        date: new Date().toISOString().split('T')[0],
        category: '',
        amount: '',
        description: '',
      });
      loadTransactions();
    } catch (err) {
      const errorMsg = err.message || 'Failed to save transaction';
      toast.error(errorMsg);
      setError(errorMsg);
    }
  };

  const handleEdit = (transaction) => {
    setForm({
      date: transaction.date,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description || '',
    });
    setEditingId(transaction.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: '',
      description: '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await api.deleteTransaction(id);
      toast.success('Transaction deleted successfully!');
      loadTransactions();
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete transaction';
      toast.error(errorMsg);
      setError(errorMsg);
    }
  };

  const applyFilters = () => {
    loadTransactions();
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: `${cat.name} (${cat.type})`
  }));

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="page-container">
      <PageHeader 
        title="Transactions" 
        subtitle="Manage your income and expenses"
      />

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <Card title={editingId ? "Edit Transaction" : "Add Transaction"}>
        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-grid">
            <Input
              id="date"
              name="date"
              label="Date"
              type="date"
              value={form.date}
              onChange={handleInputChange}
              required
            />

            <Select
              id="category"
              name="category"
              label="Category"
              value={form.category}
              onChange={handleInputChange}
              options={categoryOptions}
              placeholder="Select category"
              required
            />

            <Input
              id="amount"
              name="amount"
              label="Amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              required
            />

            <Input
              id="description"
              name="description"
              label="Description"
              type="text"
              value={form.description}
              onChange={handleInputChange}
              placeholder="Optional description"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button type="submit" variant="primary" size="md">
              {editingId ? 'Update Transaction' : 'Add Transaction'}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" size="md" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card title="Filter Transactions">
        <div className="filter-grid">
          <Input
            id="date_from"
            name="date_from"
            label="From Date"
            type="date"
            value={filters.date_from}
            onChange={handleFilterChange}
          />

          <Input
            id="date_to"
            name="date_to"
            label="To Date"
            type="date"
            value={filters.date_to}
            onChange={handleFilterChange}
          />

          <Select
            id="filter_category"
            name="category"
            label="Category"
            value={filters.category}
            onChange={handleFilterChange}
            options={categoryOptions}
            placeholder="All categories"
          />

          <Input
            id="min_amount"
            name="min_amount"
            label="Min Amount"
            type="number"
            step="0.01"
            value={filters.min_amount}
            onChange={handleFilterChange}
            placeholder="0.00"
          />

          <Input
            id="max_amount"
            name="max_amount"
            label="Max Amount"
            type="number"
            step="0.01"
            value={filters.max_amount}
            onChange={handleFilterChange}
            placeholder="0.00"
          />

          <div className="filter-actions">
            <Button onClick={applyFilters} variant="secondary" size="md">
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Transaction List">
        {isLoading ? (
          <div className="transactions-loading">
            <div className="spinner spinner-dark"></div>
            <p>Loading transactions...</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label htmlFor="itemsPerPage" style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>
                  Show:
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
                  entries
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                Showing {transactions.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, transactions.length)} of {transactions.length} transactions
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>Date</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>Category</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>Type</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>Amount</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>Description</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9ca3af' }}>
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    currentTransactions.map((txn) => (
                      <tr key={txn.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '1rem 1.5rem' }}>{txn.date}</td>
                        <td style={{ padding: '1rem 1.5rem' }}>{txn.category_name}</td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{
                            color: txn.category_type === 'income' ? '#10b981' : '#ef4444',
                            fontWeight: 600
                          }}>
                            {txn.category_type === 'income' ? '💰 Income' : '💸 Expense'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                          <span style={{
                            color: txn.category_type === 'income' ? '#10b981' : '#ef4444',
                            fontWeight: 600
                          }}>
                            ${parseFloat(txn.amount).toFixed(2)}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>{txn.description || '-'}</td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(txn)}
                              style={{ fontSize: '0.875rem' }}
                            >
                              ✏️ Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(txn.id)}
                              style={{ fontSize: '0.875rem' }}
                            >
                              🗑️ Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}