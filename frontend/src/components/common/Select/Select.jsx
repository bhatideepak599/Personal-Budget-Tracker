// src/components/common/Select/Select.jsx
import './Select.css';

/**
 * Reusable Select Component
 * @param {Object} props
 * @param {string} props.id - Select ID
 * @param {string} props.name - Select name
 * @param {string} props.label - Select label text
 * @param {string|number} props.value - Selected value
 * @param {Function} props.onChange - Change handler
 * @param {Array} props.options - Array of {value, label} objects
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.placeholder - Placeholder option text
 * @param {string} props.className - Additional CSS classes
 */
export default function Select({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  error,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  className = '',
  ...rest
}) {
  const selectClasses = [
    'select-field',
    error && 'select-error',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="select-group">
      {label && (
        <label htmlFor={id} className="select-label">
          {label}
          {required && <span className="select-required" aria-label="required">*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        className={selectClasses}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${id}-error`} className="select-error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}