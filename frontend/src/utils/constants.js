// src/utils/constants.js

// Transaction Types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

// Category Types
export const CATEGORY_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

// Month Names
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Date Formats
export const DATE_FORMATS = {
  INPUT: 'YYYY-MM-DD',
  DISPLAY: 'MMM DD, YYYY',
  MONTH: 'YYYY-MM'
};

// Alert Types
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Button Variants
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  DANGER: 'danger'
};

// Button Sizes
export const BUTTON_SIZES = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg'
};

// API Endpoints (if needed)
export const API_ENDPOINTS = {
  LOGIN: '/auth/login/',
  LOGOUT: '/auth/logout/',
  TRANSACTIONS: '/transactions/',
  CATEGORIES: '/categories/',
  BUDGETS: '/budgets/',
  SUMMARY: '/summary/'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
};