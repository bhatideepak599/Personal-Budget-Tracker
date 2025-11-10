// src/components/features/dashboard/ExpenseChart.jsx
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card } from '../../common';
import { formatCurrency } from '../../../utils/formatters';

export default function ExpenseChart({ expenses }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!expenses || expenses.length === 0) {
      return;
    }

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value((d) => d.total);

    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius - 10);

    const arcs = svg
      .selectAll('arc')
      .data(pie(expenses))
      .enter()
      .append('g');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    arcs
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .attr('font-size', '12px')
      .text((d) => d.data.category);
  }, [expenses]);

  if (!expenses || expenses.length === 0) {
    return (
      <Card>
        <h3 style={{ marginTop: 0 }}>Expenses by Category</h3>
        <div style={{ textAlign: 'center', padding: 32, color: '#6c757d' }}>
          No expenses for this month
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 style={{ marginTop: 0 }}>Expenses by Category</h3>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg ref={svgRef}></svg>
        <div style={{ marginTop: 24, width: '100%' }}>
          {expenses.map((expense, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #e9ecef',
              }}
            >
              <span style={{ fontWeight: 500 }}>{expense.category}</span>
              <span style={{ color: '#dc3545', fontWeight: 600 }}>
                {formatCurrency(expense.total)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

