// src/components/common/Card/Card.jsx
import './Card.css';

/**
 * Reusable Card Component
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.noPadding - Remove default padding
 * @param {React.ReactNode} props.footer - Card footer content
 * @param {React.ReactNode} props.actions - Action buttons in header
 */
export default function Card({
  title,
  children,
  className = '',
  noPadding = false,
  footer,
  actions,
  ...rest
}) {
  const cardClasses = [
    'card',
    noPadding && 'card-no-padding',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...rest}>
      {(title || actions) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
}