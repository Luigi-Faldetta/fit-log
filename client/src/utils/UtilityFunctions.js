/**
 * Generates a random integer ID within the specified range (inclusive).
 * Useful for temporary IDs before server-side ID assignment.
 *
 * @param {number} [min=1] - The minimum value for the random ID (inclusive)
 * @param {number} [max=1000000] - The maximum value for the random ID (inclusive)
 * @returns {number} A random integer between min and max (inclusive)
 * @example
 * generateRandomId() // Random number between 1 and 1000000
 * generateRandomId(1, 100) // Random number between 1 and 100
 * generateRandomId(1000, 9999) // Random 4-digit number
 */
const generateRandomId = (min = 1, max = 1000000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default generateRandomId;
