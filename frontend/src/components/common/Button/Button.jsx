// src/components/common/Button/Button.jsx
import './Button.css';

/**
 * Reusable Button Component
 * @param {Object} props
 * @param {string} props.variant - 'primary' | 'secondary' | 'outline' | 'danger'
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {boolean} props.isLoading - Show loading spinner
 * @param {boolean} props.disabled - Disable button
 * @param {boolean} props.fullWidth - Full width button
 * @param {string} props.type - HTML button type
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  children,
  className = '',
  ...rest
}) {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    isLoading && 'btn-loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <span className="btn-spinner" aria-hidden="true"></span>
      )}
      <span className={isLoading ? 'btn-content-loading' : ''}>
        {children}
      </span>
    </button>
  );
}