// src/components/common/Input/Input.jsx
import './Input.css';

/**
 * Reusable Input Component
 * @param {Object} props
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} props.label - Input label text
 * @param {string} props.type - Input type (text, number, date, email, password)
 * @param {string} props.placeholder - Placeholder text
 * @param {string|number} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 */
export default function Input({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  ...rest
}) {
  const inputClasses = [
    'input-field',
    error && 'input-error',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="input-required" aria-label="required">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <span id={`${id}-error`} className="input-error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}