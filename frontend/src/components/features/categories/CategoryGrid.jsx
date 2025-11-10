// src/components/features/categories/CategoryGrid.jsx
import { Card } from '../../common';

export default function CategoryGrid({ categories, isLoading }) {
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: 32 }}>Loading categories...</div>;
  }

  if (!categories || categories.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 32, color: '#6c757d' }}>
        No categories yet. Add your first category above!
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
      gap: 16 
    }}>
      {categories.map((category) => (
        <Card
          key={category.id}
          style={{
            background: category.type === 'income' 
              ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' 
              : 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)',
            color: 'white',
            textAlign: 'center',
            padding: 24,
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>
            {category.type === 'income' ? '💰' : '💸'}
          </div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: 18 }}>
            {category.name}
          </h4>
          <div style={{ 
            fontSize: 12, 
            textTransform: 'uppercase', 
            opacity: 0.9,
            letterSpacing: '0.5px'
          }}>
            {category.type}
          </div>
        </Card>
      ))}
    </div>
  );
}

