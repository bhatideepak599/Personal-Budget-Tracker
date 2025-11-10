// src/components/layout/Navbar/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

/**
 * Navigation Bar Component
 * @param {Object} props
 * @param {Function} props.onLogout - Logout handler
 */
export default function Navbar({ onLogout }) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/transactions', label: 'Transactions', icon: '💰' },
    { path: '/categories', label: 'Categories', icon: '📁' },
    { path: '/budgets', label: 'Budgets', icon: '💳' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="navbar-logo-icon">💰</span>
        <span>Budget Tracker</span>
      </div>

      <div className="navbar-links">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={isActive(item.path) ? 'active' : ''}
          >
            <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="navbar-actions">
        <div className="navbar-user">
          <div className="navbar-user-icon">T</div>
          <span>testuser</span>
        </div>
        <button className="navbar-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}