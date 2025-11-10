// src/pages/Categories/Categories.jsx
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../api';
import { Card, Button, Input, Select } from '../../components/common';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import './Categories.css';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    type: 'expense',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCategories = useCallback(async () => {
    try {
      const data = await api.getCategories();
      setCategories(data.results || data);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Failed to load categories:', err);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.createCategory(form);
      setForm({ name: '', type: 'expense' });
      toast.success('Category created successfully!');
      loadCategories();
    } catch (err) {
      const errorMsg = err.message || 'Failed to create category';
      toast.error(errorMsg);
      setError(errorMsg);
    }
  };

  const typeOptions = [
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' }
  ];

  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  return (
    <div className="page-container">
      <PageHeader 
        title="Categories" 
        subtitle="Organize your transactions"
      />

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <Card title="Add Category">
        <form onSubmit={handleSubmit} className="category-form">
          <div className="category-form-grid">
            <Input
              id="name"
              name="name"
              label="Category Name"
              type="text"
              value={form.name}
              onChange={handleInputChange}
              placeholder="e.g., Groceries, Salary"
              required
            />

            <Select
              id="type"
              name="type"
              label="Type"
              value={form.type}
              onChange={handleInputChange}
              options={typeOptions}
              required
            />
          </div>
          
          <Button type="submit" variant="primary" size="md">
            Add Category
          </Button>
        </form>
      </Card>

      <div className="categories-sections">
        <Card title="Income Categories" className="categories-section">
          {incomeCategories.length === 0 ? (
            <p className="categories-empty">No income categories yet</p>
          ) : (
            <div className="categories-grid">
              {incomeCategories.map((cat) => (
                <div key={cat.id} className="category-card category-income">
                  <div className="category-icon">💰</div>
                  <div className="category-info">
                    <h4 className="category-name">{cat.name}</h4>
                    <span className="category-type">Income</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Expense Categories" className="categories-section">
          {expenseCategories.length === 0 ? (
            <p className="categories-empty">No expense categories yet</p>
          ) : (
            <div className="categories-grid">
              {expenseCategories.map((cat) => (
                <div key={cat.id} className="category-card category-expense">
                  <div className="category-icon">💸</div>
                  <div className="category-info">
                    <h4 className="category-name">{cat.name}</h4>
                    <span className="category-type">Expense</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}