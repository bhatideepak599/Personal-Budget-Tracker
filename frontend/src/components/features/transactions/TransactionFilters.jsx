// src/components/features/transactions/TransactionFilters.jsx
import { useState } from 'react';
import { Button, Input, Select } from '../../common';

export default function TransactionFilters({ categories, onFilter }) {
  const [filters, setFilters] = useState({
    date_from: '',
    date_to: '',
    category: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    const activeFilters = {};
    if (filters.date_from) activeFilters.date_from = filters.date_from;
    if (filters.date_to) activeFilters.date_to = filters.date_to;
    if (filters.category) activeFilters.category = filters.category;
    onFilter(activeFilters);
  };

  const handleClear = () => {
    setFilters({
      date_from: '',
      date_to: '',
      category: '',
    });
    onFilter({});
  };

  return (
    <div style={{ 
      padding: 16, 
      background: '#f8f9fa', 
      borderRadius: 8, 
      marginBottom: 24 
    }}>
      <h4 style={{ marginTop: 0, marginBottom: 16 }}>Filters</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <Input
          label="From Date"
          type="date"
          name="date_from"
          value={filters.date_from}
          onChange={handleChange}
        />
        <Input
          label="To Date"
          type="date"
          name="date_to"
          value={filters.date_to}
          onChange={handleChange}
        />
        <Select
          label="Category"
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Button onClick={handleApply}>Apply Filters</Button>
        <Button onClick={handleClear} variant="secondary">Clear</Button>
      </div>
    </div>
  );
}

