/**
 * Data Transformation Utilities
 *
 * Follows Single Responsibility Principle - handles ONLY data transformation.
 * Separated from business logic and state management.
 */

/**
 * Format date to YYYY-MM-DD
 */
export const formatDate = (dateString) => {
  if (!dateString) return dateString;
  return dateString.split('T')[0];
};

/**
 * Transform weight entry from API/DB format to UI format
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
 * Transform body fat entry from API/DB format to UI format
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
 * Transform array of weight entries
 */
export const transformWeightData = (entries) => {
  if (!Array.isArray(entries)) return [];
  return entries.map(transformWeightEntry).filter(Boolean);
};

/**
 * Transform array of body fat entries
 */
export const transformBodyFatData = (entries) => {
  if (!Array.isArray(entries)) return [];
  return entries.map(transformBodyFatEntry).filter(Boolean);
};
