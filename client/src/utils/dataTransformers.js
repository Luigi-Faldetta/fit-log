/**
 * Data Transformation Utilities
 *
 * Follows Single Responsibility Principle - handles ONLY data transformation.
 * Separated from business logic and state management.
 */

/**
 * Formats a date string or ISO datetime to YYYY-MM-DD format.
 *
 * @param {string} dateString - The date string to format (ISO format or similar)
 * @returns {string} Formatted date string in YYYY-MM-DD format
 * @example
 * formatDate('2024-01-15T10:30:00Z') // '2024-01-15'
 * formatDate('2024-01-15') // '2024-01-15'
 * formatDate(null) // null
 */
export const formatDate = (dateString) => {
  if (!dateString) return dateString;
  return dateString.split('T')[0];
};

/**
 * Transforms a weight entry from API/database format to UI-friendly format.
 * Normalizes different field names (value vs weight) and formats the date.
 *
 * @param {Object} entry - The weight entry from API/database
 * @param {string} entry.date - The date of the weight entry
 * @param {number} entry.value - The weight value (alternative field name)
 * @param {number} entry.weight - The weight value (alternative field name)
 * @param {number} entry.weight_id - The unique weight entry ID
 * @param {number} entry.user_id - The user ID
 * @returns {Object|null} Transformed weight entry or null if invalid
 * @example
 * transformWeightEntry({ date: '2024-01-15T10:00:00Z', value: 70, weight_id: 1, user_id: 123 })
 * // { date: '2024-01-15', weight: 70, weight_id: 1, user_id: 123 }
 */
export const transformWeightEntry = (entry) => {
  if (!entry) return null;

  return {
    date: formatDate(entry.date),
    weight: entry.value || entry.weight,
    weight_id: entry.weight_id,
    user_id: entry.user_id
  };
};

/**
 * Transforms a body fat entry from API/database format to UI-friendly format.
 * Normalizes different field names (value vs bodyFat vs percentage) and formats the date.
 *
 * @param {Object} entry - The body fat entry from API/database
 * @param {string} entry.date - The date of the body fat entry
 * @param {number} entry.value - The body fat percentage (alternative field name)
 * @param {number} entry.bodyFat - The body fat percentage (alternative field name)
 * @param {number} entry.percentage - The body fat percentage (alternative field name)
 * @param {number} entry.bodyfat_id - The unique body fat entry ID
 * @param {number} entry.user_id - The user ID
 * @returns {Object|null} Transformed body fat entry or null if invalid
 * @example
 * transformBodyFatEntry({ date: '2024-01-15T10:00:00Z', percentage: 15, bodyfat_id: 1, user_id: 123 })
 * // { date: '2024-01-15', bodyFat: 15, bodyfat_id: 1, user_id: 123 }
 */
export const transformBodyFatEntry = (entry) => {
  if (!entry) return null;

  return {
    date: formatDate(entry.date),
    bodyFat: entry.value || entry.bodyFat || entry.percentage,
    bodyfat_id: entry.bodyfat_id,
    user_id: entry.user_id
  };
};

/**
 * Transforms an array of weight entries from API/database format to UI format.
 * Filters out any null/invalid entries after transformation.
 *
 * @param {Array<Object>} entries - Array of weight entries from API/database
 * @returns {Array<Object>} Array of transformed weight entries
 * @example
 * transformWeightData([
 *   { date: '2024-01-15T10:00:00Z', value: 70, weight_id: 1, user_id: 123 },
 *   { date: '2024-01-16T10:00:00Z', value: 71, weight_id: 2, user_id: 123 }
 * ])
 * // Returns array of transformed entries with formatted dates
 */
export const transformWeightData = (entries) => {
  if (!Array.isArray(entries)) return [];
  return entries.map(transformWeightEntry).filter(Boolean);
};

/**
 * Transforms an array of body fat entries from API/database format to UI format.
 * Filters out any null/invalid entries after transformation.
 *
 * @param {Array<Object>} entries - Array of body fat entries from API/database
 * @returns {Array<Object>} Array of transformed body fat entries
 * @example
 * transformBodyFatData([
 *   { date: '2024-01-15T10:00:00Z', percentage: 15, bodyfat_id: 1, user_id: 123 },
 *   { date: '2024-01-16T10:00:00Z', percentage: 14.5, bodyfat_id: 2, user_id: 123 }
 * ])
 * // Returns array of transformed entries with formatted dates and normalized field names
 */
export const transformBodyFatData = (entries) => {
  if (!Array.isArray(entries)) return [];
  return entries.map(transformBodyFatEntry).filter(Boolean);
};
