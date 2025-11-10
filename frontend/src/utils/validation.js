// src/utils/validation.js

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} Is valid
 */
export const isRequired = (value) => {
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== null && value !== undefined && value !== '';
};

/**
 * Validate number is positive
 * @param {number} value - Number to validate
 * @returns {boolean} Is positive
 */
export const isPositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

/**
 * Validate date is not in future
 * @param {string} date - Date string
 * @returns {boolean} Is not in future
 */
export const isNotFutureDate = (date) => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return inputDate <= today;
};

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {boolean} Is valid length
 */
export const isValidLength = (value, min = 0, max = Infinity) => {
  if (typeof value !== 'string') return false;
  const length = value.trim().length;
  return length >= min && length <= max;
};

/**
 * Form validation helper
 * @param {Object} values - Form values
 * @param {Object} rules - Validation rules
 * @returns {Object} Errors object
 */
export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = values[field];
    
    if (rule.required && !isRequired(value)) {
      errors[field] = rule.requiredMessage || 'This field is required';
    } else if (rule.email && value && !isValidEmail(value)) {
      errors[field] = rule.emailMessage || 'Invalid email format';
    } else if (rule.positive && value && !isPositiveNumber(value)) {
      errors[field] = rule.positiveMessage || 'Must be a positive number';
    } else if (rule.minLength && value && !isValidLength(value, rule.minLength)) {
      errors[field] = rule.minLengthMessage || `Must be at least ${rule.minLength} characters`;
    } else if (rule.maxLength && value && !isValidLength(value, 0, rule.maxLength)) {
      errors[field] = rule.maxLengthMessage || `Must be at most ${rule.maxLength} characters`;
    }
  });
  
  return errors;
};