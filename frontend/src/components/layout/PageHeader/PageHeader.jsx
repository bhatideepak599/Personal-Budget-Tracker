// src/components/layout/PageHeader/PageHeader.jsx
import './PageHeader.css';

/**
 * Page Header Component
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle (optional)
 * @param {React.ReactNode} props.actions - Action buttons (optional)
 */
export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header">
      <div className="page-header__content">
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && (
        <div className="page-header__actions">
          {actions}
        </div>
      )}
    </div>
  );
}