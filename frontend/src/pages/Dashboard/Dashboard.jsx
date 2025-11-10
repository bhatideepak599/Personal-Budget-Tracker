// src/pages/Dashboard/Dashboard.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../../api';
import { Card } from '../../components/common';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import * as d3 from 'd3';
import './Dashboard.css';

export default function Dashboard() {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [summary, setSummary] = useState(null);
  const [budget, setBudget] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const svgRef = useRef();
  const budgetChartRef = useRef();

  const loadSummary = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api.getSummary(month);
      setSummary(data);
    } catch (err) {
      setError('Failed to load summary data');
      console.error('Failed to load summary:', err);
    } finally {
      setIsLoading(false);
    }
  }, [month]);

  const loadBudget = useCallback(async () => {
    try {
      const [year, monthNum] = month.split('-');
      const data = await api.getBudgets({ year, month: monthNum });
      const budgets = data.results || data;
      if (budgets.length > 0) {
        setBudget(budgets[0]);
      } else {
        setBudget(null);
      }
    } catch (err) {
      console.error('Failed to load budget:', err);
      setBudget(null);
    }
  }, [month]);

  useEffect(() => {
    loadSummary();
    loadBudget();
  }, [loadSummary, loadBudget]);

 useEffect(() => {
  if (!summary || !summary.expenses_by_category || summary.expenses_by_category.length === 0 || !svgRef.current) {
    return;
  }

  const width = 350;
  const height = 350;
  const radius = Math.min(width, height) / 2 - 10;

  const svg = d3.select(svgRef.current);
  svg.selectAll('*').remove();

  const g = svg
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`);

  const color = d3.scaleOrdinal()
    .domain(summary.expenses_by_category.map((_, i) => i))
    .range(['#2563eb', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#10b981', '#f97316']);

  const pie = d3.pie()
    .value((d) => d.total)
    .sort(null);

  const arc = d3.arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius);

  const arcs = g
    .selectAll('.arc')
    .data(pie(summary.expenses_by_category))
    .enter()
    .append('g')
    .attr('class', 'arc');

  // Draw slices
  arcs
    .append('path')
    .attr('d', arc)
    .attr('fill', (_, i) => color(i))
    .attr('stroke', 'white')
    .attr('stroke-width', 3)
    .style('opacity', 0.9)
    .on('mouseenter', function() {
      d3.select(this).style('opacity', 1).style('cursor', 'pointer');
    })
    .on('mouseleave', function() {
      d3.select(this).style('opacity', 0.9);
    });

  // ✅ Add labels
  arcs
    .append('text')
    .text((d) => d.data.category__name)
    .attr('transform', (d) => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('fill', '#111')
    .style('font-weight', '500');

}, [summary]);

  // Budget vs Actual Expenses Chart
  useEffect(() => {
    if (!summary || !budgetChartRef.current) {
      return;
    }

    const budgetAmount = budget ? parseFloat(budget.amount) : 0;
    const actualExpenses = summary.total_expenses || 0;

    const width = 500;
    const height = 300;
    const margin = { top: 40, right: 30, bottom: 60, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(budgetChartRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = [
      { label: 'Budget', value: budgetAmount, color: '#3b82f6' },
      { label: 'Actual', value: actualExpenses, color: actualExpenses > budgetAmount ? '#ef4444' : '#10b981' }
    ];

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, chartWidth])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, Math.max(budgetAmount, actualExpenses) * 1.2])
      .range([chartHeight, 0]);

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => chartHeight - y(d.value))
      .attr('fill', d => d.color)
      .attr('rx', 4)
      .style('opacity', 0.9)
      .on('mouseenter', function() {
        d3.select(this).style('opacity', 1);
      })
      .on('mouseleave', function() {
        d3.select(this).style('opacity', 0.9);
      });

    // Add value labels on bars
    g.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.label) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', '#111')
      .text(d => `$${d.value.toFixed(2)}`);

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('font-size', '12px')
      .attr('font-weight', '500');

    // Add Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `$${d}`))
      .selectAll('text')
      .attr('font-size', '11px');

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', '600')
      .attr('fill', '#111')
      .text('Budget vs Actual Expenses');

  }, [summary, budget]);


  const formatCurrency = (amount) => {
  if (isNaN(Number(amount))) return '$0.00';
  return `$${Number(amount).toFixed(2)}`;
};


  const getBalanceColor = () => {
    if (!summary) return '';
    return summary.balance >= 0 ? 'text-success' : 'text-error';
  };

  return (
    <div className="page-container">
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your financial status"
      />

      {error && <Alert type="error" message={error} />}

      <div className="dashboard-month-selector">
        <label htmlFor="month-input" className="month-label">
          Select Month:
        </label>
        <input
          id="month-input"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="month-input"
        />
      </div>

      {isLoading ? (
        <Card>
          <div className="dashboard-loading">
            <div className="spinner spinner-dark"></div>
            <p>Loading summary...</p>
          </div>
        </Card>
      ) : summary ? (
        <>
          <div className="dashboard-summary-grid">
            <Card className="summary-card">
              <div className="summary-card-icon income-icon">💰</div>
              <div className="summary-card-content">
                <p className="summary-card-label">Total Income</p>
                <p className="summary-card-value text-success">
                  {formatCurrency(summary.total_income)}
                </p>
              </div>
            </Card>

            <Card className="summary-card">
              <div className="summary-card-icon expense-icon">💸</div>
              <div className="summary-card-content">
                <p className="summary-card-label">Total Expenses</p>
                <p className="summary-card-value text-error">
                  {formatCurrency(summary.total_expenses)}
                </p>
              </div>
            </Card>

            <Card className="summary-card">
              <div className="summary-card-icon balance-icon">📊</div>
              <div className="summary-card-content">
                <p className="summary-card-label">Balance</p>
                <p className={`summary-card-value ${getBalanceColor()}`}>
                  {formatCurrency(summary.balance)}
                </p>
              </div>
            </Card>
          </div>

          {/* Budget vs Actual Card */}
          <Card title="Budget Overview">
            <div className="dashboard-chart-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              {budget ? (
                <>
                  <svg ref={budgetChartRef} className="dashboard-chart"></svg>
                  <div style={{ marginTop: '1.5rem', width: '100%', maxWidth: '500px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ fontWeight: 600 }}>Budget Amount:</span>
                      <span style={{ color: '#3b82f6', fontWeight: 600 }}>{formatCurrency(budget.amount)}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ fontWeight: 600 }}>Actual Expenses:</span>
                      <span style={{
                        color: summary.total_expenses > budget.amount ? '#ef4444' : '#10b981',
                        fontWeight: 600
                      }}>
                        {formatCurrency(summary.total_expenses)}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: summary.total_expenses > budget.amount ? '#fee2e2' : '#d1fae5',
                      borderRadius: '8px',
                      border: `2px solid ${summary.total_expenses > budget.amount ? '#ef4444' : '#10b981'}`
                    }}>
                      <span style={{ fontWeight: 600 }}>
                        {summary.total_expenses > budget.amount ? 'Over Budget:' : 'Remaining:'}
                      </span>
                      <span style={{
                        color: summary.total_expenses > budget.amount ? '#ef4444' : '#10b981',
                        fontWeight: 700,
                        fontSize: '1.1rem'
                      }}>
                        {formatCurrency(Math.abs(budget.amount - summary.total_expenses))}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>📊 No budget set for this month</p>
                  <p style={{ fontSize: '0.9rem' }}>Visit the Budgets page to set a monthly budget</p>
                </div>
              )}
            </div>
          </Card>

          {summary.expenses_by_category && summary.expenses_by_category.length > 0 ? (
            <Card title="Expenses by Category">
              <div className="dashboard-chart-container">
                <svg ref={svgRef} className="dashboard-chart"></svg>
              </div>
              <div className="dashboard-category-list">
                {summary.expenses_by_category.map((cat, i) => (
                  <div key={i} className="category-item">
                    <span className="category-name">{cat.category__name}</span>
                    <span className="category-amount">
                      {formatCurrency(cat.total)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="dashboard-empty">
                <p>No expenses recorded for this month.</p>
              </div>
            </Card>
          )}
        </>
      ) : null}
    </div>
  );
}