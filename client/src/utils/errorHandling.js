/**
 * Error Handling Utilities
 *
 * Centralized error handling for consistent user-friendly error messages
 * and proper error logging throughout the application.
 */

/**
 * Custom error class for API-related errors.
 */
export class ApiError extends Error {
  constructor(message, status, statusText, endpoint) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.endpoint = endpoint;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Custom error class for network-related errors.
 */
export class NetworkError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'NetworkError';
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Custom error class for validation errors.
 */
export class ValidationError extends Error {
  constructor(message, field, value) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Converts an error into a user-friendly message.
 *
 * @param {Error} error - The error to convert
 * @param {string} [context=''] - Additional context for the error
 * @returns {string} User-friendly error message
 * @example
 * getUserFriendlyMessage(new ApiError('Not found', 404))
 * // 'The requested resource was not found. Please try again.'
 */
export const getUserFriendlyMessage = (error, context = '') => {
  // Handle ApiError
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'You are not authorized. Please sign in and try again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found. Please try again.';
      case 409:
        return 'This action conflicts with existing data. Please refresh and try again.';
      case 422:
        return 'The data provided is invalid. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Our team has been notified. Please try again later.';
      case 502:
      case 503:
        return 'Service temporarily unavailable. Please try again in a few moments.';
      case 504:
        return 'Request timed out. Please check your connection and try again.';
      default:
        return `An error occurred${context ? ` while ${context}` : ''}. Please try again.`;
    }
  }

  // Handle NetworkError
  if (error instanceof NetworkError) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Handle ValidationError
  if (error instanceof ValidationError) {
    return error.message;
  }

  // Handle generic errors
  if (error.message) {
    // Check for common network error messages
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'Network error. Please check your internet connection and try again.';
    }

    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }

    // For other errors, return a generic message
    return `An error occurred${context ? ` while ${context}` : ''}. Please try again.`;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Handles API fetch errors and throws appropriate error types.
 *
 * @param {Response} response - The fetch response object
 * @param {string} endpoint - The API endpoint that was called
 * @throws {ApiError} When the response is not ok
 * @example
 * const response = await fetch('/api/workouts');
 * await handleApiResponse(response, '/api/workouts');
 */
export const handleApiResponse = async (response, endpoint) => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

    // Try to get error details from response body
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      }
    } catch (parseError) {
      // If we can't parse the error response, use the default message
      console.warn('Failed to parse error response:', parseError);
    }

    throw new ApiError(
      errorMessage,
      response.status,
      response.statusText,
      endpoint
    );
  }
};

/**
 * Wraps a fetch call with error handling.
 *
 * @param {string} endpoint - The API endpoint to call
 * @param {RequestInit} [options={}] - Fetch options
 * @returns {Promise<any>} The parsed JSON response
 * @throws {ApiError|NetworkError} When the request fails
 * @example
 * const data = await fetchWithErrorHandling('/api/workouts');
 */
export const fetchWithErrorHandling = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, options);
    await handleApiResponse(response, endpoint);

    // Parse JSON response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return null;
  } catch (error) {
    // If it's already an ApiError, re-throw it
    if (error instanceof ApiError) {
      throw error;
    }

    // Wrap network/fetch errors in NetworkError
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new NetworkError('Failed to connect to server', error);
    }

    // Re-throw other errors
    throw error;
  }
};

/**
 * Logs errors with appropriate detail level based on environment.
 *
 * @param {Error} error - The error to log
 * @param {string} [context=''] - Additional context for logging
 * @example
 * logError(error, 'fetching workouts');
 */
export const logError = (error, context = '') => {
  const isDevelopment = import.meta.env.DEV;
  const prefix = context ? `[${context}]` : '';

  if (error instanceof ApiError) {
    console.error(`${prefix} API Error:`, {
      message: error.message,
      status: error.status,
      endpoint: error.endpoint,
      timestamp: error.timestamp
    });
  } else if (error instanceof NetworkError) {
    console.error(`${prefix} Network Error:`, {
      message: error.message,
      originalError: error.originalError,
      timestamp: error.timestamp
    });
  } else if (error instanceof ValidationError) {
    console.error(`${prefix} Validation Error:`, {
      message: error.message,
      field: error.field,
      value: error.value,
      timestamp: error.timestamp
    });
  } else {
    console.error(`${prefix} Error:`, error);
  }

  // In development, also log the stack trace
  if (isDevelopment && error.stack) {
    console.error('Stack trace:', error.stack);
  }
};

/**
 * Error boundary helper to catch and handle React errors.
 *
 * @param {Error} error - The error caught by error boundary
 * @param {Object} errorInfo - React error info
 * @returns {string} User-friendly error message
 */
export const handleReactError = (error, errorInfo) => {
  logError(error, 'React Error Boundary');

  if (errorInfo?.componentStack) {
    console.error('Component stack:', errorInfo.componentStack);
  }

  return 'Something went wrong. Please refresh the page and try again.';
};
