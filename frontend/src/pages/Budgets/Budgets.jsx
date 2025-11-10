// src/pages/Budgets/Budgets.jsx
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../api';
import { Card, Button, Input, Select } from '../../components/common';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import './Budgets.css';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    amount: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadBudgets = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getBudgets();
      setBudgets(data.results || data);
    } catch (err) {
      setError('Failed to load budgets');
      console.error('Failed to load budgets:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        // Update existing budget
        await api.updateBudget(editingId, {
          ...form,
          year: parseInt(form.year),
          month: parseInt(form.month),
          amount: parseFloat(form.amount),
        });
        toast.success('Budget updated successfully!');
        setEditingId(null);
      } else {
        // Create new budget
        await api.createBudget({
          ...form,
          year: parseInt(form.year),
          month: parseInt(form.month),
          amount: parseFloat(form.amount),
        });
        toast.success('Budget created successfully!');
      }

      setForm({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        amount: '',
      });
      loadBudgets();
    } catch (err) {
      const errorMsg = err.response?.data?.non_field_errors?.[0]
        || err.response?.data?.detail
        || err.message
        || (editingId ? 'Failed to update budget' : 'Failed to create budget');
      toast.error(errorMsg);
      setError(errorMsg);
    }
  };

  const handleEdit = (budget) => {
    setForm({
      year: budget.year,
      month: budget.month,
      amount: budget.amount,
    });
    setEditingId(budget.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      amount: '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    try {
      await api.deleteBudget(id);
      toast.success('Budget deleted successfully!');
      loadBudgets();
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete budget';
      toast.error(errorMsg);
      setError(errorMsg);
    }
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2000, i).toLocaleString('default', { month: 'long' })
  }));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - 2 + i,
    label: (currentYear - 2 + i).toString()
  }));

  return (
    <div className="page-container">
      <PageHeader 
        title="Budget Management" 
        subtitle="Set and track your monthly budgets"
      />

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <Card title={editingId ? "Edit Budget" : "Set Monthly Budget"}>
        <form onSubmit={handleSubmit} className="budget-form">
          <div className="budget-form-grid">
            <Select
              id="year"
              name="year"
              label="Year"
              value={form.year}
              onChange={handleInputChange}
              options={yearOptions}
              required
            />

            <Select
              id="month"
              name="month"
              label="Month"
              value={form.month}
              onChange={handleInputChange}
              options={monthOptions}
              required
            />

            <Input
              id="amount"
              name="amount"
              label="Budget Amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              required
            />

            <div className="budget-form-actions">
              <Button type="submit" variant="primary" size="md" fullWidth>
                {editingId ? 'Update Budget' : 'Set Budget'}
              </Button>
              {editingId && (
                <Button type="button" variant="secondary" size="md" fullWidth onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>

      <Card title="Budget History">
        {isLoading ? (
          <div className="budgets-loading">
            <div className="spinner spinner-dark"></div>
            <p>Loading budgets...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>Year</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>Month</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>Budget Amount</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgets.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9ca3af' }}>
                      No budgets set yet
                    </td>
                  </tr>
                ) : (
                  budgets.map((budget) => (
                    <tr key={budget.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '1rem 1.5rem' }}>{budget.year}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {new Date(budget.year, budget.month - 1).toLocaleString('default', { month: 'long' })}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#2563eb' }}>
                        ${parseFloat(budget.amount).toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(budget)}
                            style={{ fontSize: '0.875rem' }}
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(budget.id)}
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
        )}
      </Card>
    </div>
  );
}