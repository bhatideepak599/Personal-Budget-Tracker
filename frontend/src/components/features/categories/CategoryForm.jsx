// src/components/features/categories/CategoryForm.jsx
import { useState } from 'react';
import { Button, Input, Select } from '../../common';

export default function CategoryForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    // Reset form
    setFormData({
      name: '',
      type: 'expense',
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
      <h3 style={{ marginBottom: 16 }}>Add Category</h3>
      <div style={{ display: 'flex', gap: 16, alignItems: 'end' }}>
        <Input
          label="Category Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Groceries, Salary"
          required
          style={{ flex: 1 }}
        />
        <Select
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          style={{ flex: 1 }}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Category'}
        </Button>
      </div>
    </form>
  );
}

