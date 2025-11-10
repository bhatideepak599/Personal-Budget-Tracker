// src/components/features/transactions/TransactionList.jsx
import { Table } from '../../common';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function TransactionList({ transactions, isLoading }) {
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: 32 }}>Loading transactions...</div>;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 32, color: '#6c757d' }}>
        No transactions found
      </div>
    );
  }

  const columns = [
    { key: 'date', label: 'Date', render: (row) => formatDate(row.date) },
    { key: 'category_name', label: 'Category' },
    { 
      key: 'category_type', 
      label: 'Type',
      render: (row) => (
        <span style={{ 
          color: row.category_type === 'income' ? '#28a745' : '#dc3545',
          fontWeight: 600 
        }}>
          {row.category_type === 'income' ? '💰 Income' : '💸 Expense'}
        </span>
      )
    },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (row) => (
        <span style={{ 
          color: row.category_type === 'income' ? '#28a745' : '#dc3545',
          fontWeight: 600 
        }}>
          {formatCurrency(row.amount)}
        </span>
      )
    },
    { key: 'description', label: 'Description' },
  ];

  return <Table columns={columns} data={transactions} />;
}

