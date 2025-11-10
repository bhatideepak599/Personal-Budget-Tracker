// src/components/features/budgets/BudgetForm.jsx
import { useState } from 'react';
import { Button, Input, Select } from '../../common';

export default function BudgetForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    amount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'amount' ? value : parseInt(value) 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });
    // Reset amount only
    setFormData(prev => ({ ...prev, amount: '' }));
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
      <h3 style={{ marginBottom: 16 }}>Set Monthly Budget</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 16, alignItems: 'end' }}>
        <Input
          label="Year"
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          min="2000"
          max="2100"
          required
        />
        <Select
          label="Month"
          name="month"
          value={formData.month}
          onChange={handleChange}
          required
        >
          {months.map((month, index) => (
            <option key={index + 1} value={index + 1}>
              {month}
            </option>
          ))}
        </Select>
        <Input
          label="Budget Amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Setting...' : 'Set Budget'}
        </Button>
      </div>
    </form>
  );
}

