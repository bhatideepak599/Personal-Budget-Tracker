// src/components/features/budgets/BudgetList.jsx
import { Table } from '../../common';
import { formatCurrency } from '../../../utils/formatters';

export default function BudgetList({ budgets, isLoading }) {
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: 32 }}>Loading budgets...</div>;
  }

  if (!budgets || budgets.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 32, color: '#6c757d' }}>
        No budgets set yet
      </div>
    );
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const columns = [
    { key: 'year', label: 'Year' },
    { 
      key: 'month', 
      label: 'Month',
      render: (row) => months[row.month - 1]
    },
    { 
      key: 'amount', 
      label: 'Budget Amount',
      render: (row) => formatCurrency(row.amount)
    },
  ];

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>Budget History</h3>
      <Table columns={columns} data={budgets} />
    </div>
  );
}

