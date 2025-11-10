// src/components/features/dashboard/SummaryCards.jsx
import { Card } from '../../common';
import { formatCurrency } from '../../../utils/formatters';

export default function SummaryCards({ summary }) {
  if (!summary) {
    return null;
  }

  const cards = [
    {
      title: 'Total Income',
      value: formatCurrency(summary.total_income || 0),
      color: '#28a745',
      icon: '💰'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(summary.total_expenses || 0),
      color: '#dc3545',
      icon: '💸'
    },
    {
      title: 'Balance',
      value: formatCurrency(summary.balance || 0),
      color: summary.balance >= 0 ? '#17a2b8' : '#dc3545',
      icon: '💵'
    }
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: 24,
      marginBottom: 32 
    }}>
      {cards.map((card, index) => (
        <Card key={index} style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{card.icon}</div>
          <h3 style={{ 
            margin: '0 0 8px 0', 
            fontSize: 14, 
            color: '#6c757d',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {card.title}
          </h3>
          <div style={{ 
            fontSize: 32, 
            fontWeight: 700, 
            color: card.color 
          }}>
            {card.value}
          </div>
        </Card>
      ))}
    </div>
  );
}

