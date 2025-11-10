// src/components/features/transactions/TransactionForm.jsx
import { useState } from 'react';
import { Button, Input, Select } from '../../common';

export default function TransactionForm({ categories, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      category: parseInt(formData.category),
      amount: parseFloat(formData.amount),
    });
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: '',
      description: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
      <h3 style={{ marginBottom: 16 }}>Add Transaction</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <Input
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.type})
            </option>
          ))}
        </Select>
        <Input
          label="Amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
        />
        <Input
          label="Description"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <Button type="submit" disabled={isLoading} style={{ marginTop: 16 }}>
        {isLoading ? 'Adding...' : 'Add Transaction'}
      </Button>
    </form>
  );
}

