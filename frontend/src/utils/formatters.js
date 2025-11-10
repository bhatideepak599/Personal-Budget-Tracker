// src/utils/formatters.js

/**
 * Format number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = '$') => {
  if (amount === null || amount === undefined) return `${currency}0.00`;
  return `${currency}${parseFloat(amount).toFixed(2)}`;
};

/**
 * Format date to locale string
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale (default: 'en-US')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'en-US') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale);
};

/**
 * Format date for input field (YYYY-MM-DD)
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDateForInput = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

/**
 * Get month name from number
 * @param {number} monthNumber - Month number (1-12)
 * @returns {string} Month name
 */
export const getMonthName = (monthNumber) => {
  const date = new Date(2000, monthNumber - 1);
  return date.toLocaleString('default', { month: 'long' });
};

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString();
};