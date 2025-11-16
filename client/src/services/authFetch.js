/**
 * Authenticated fetch wrapper for Clerk
 * Automatically adds the Clerk session token to all API requests
 */

let getTokenFunction = null;

/**
 * Initialize the auth fetch with Clerk's getToken function
 * This should be called once when the app loads with the getToken from useAuth
 * @param {Function} getToken - Clerk's getToken function from useAuth hook
 */
export const initAuthFetch = (getToken) => {
  getTokenFunction = getToken;
};

/**
 * Fetch wrapper that adds Clerk authentication token
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export const authFetch = async (url, options = {}) => {
  // Get the token from Clerk
  const token = getTokenFunction ? await getTokenFunction() : null;

  // Add authorization header if token exists
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Make the fetch request with the token
  return fetch(url, {
    ...options,
    headers,
  });
};

export default authFetch;
