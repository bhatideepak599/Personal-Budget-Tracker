// src/components/features/dashboard/MonthSelector.jsx
import { Input } from '../../common';

export default function MonthSelector({ value, onChange }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <Input
        label="Select Month"
        type="month"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ maxWidth: 300 }}
      />
    </div>
  );
}

