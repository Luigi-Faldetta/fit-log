import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ApiError,
  NetworkError,
  ValidationError,
  getUserFriendlyMessage,
  handleApiResponse,
  fetchWithErrorHandling,
  logError,
} from '../../utils/errorHandling';

describe('errorHandling utilities', () => {
  describe('ApiError', () => {
    it('should create an ApiError with all properties', () => {
      const error = new ApiError('Not found', 404, 'Not Found', '/api/test');

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ApiError');
      expect(error.message).toBe('Not found');
      expect(error.status).toBe(404);
      expect(error.statusText).toBe('Not Found');
      expect(error.endpoint).toBe('/api/test');
      expect(error.timestamp).toBeDefined();
    });
  });

  describe('NetworkError', () => {
    it('should create a NetworkError with all properties', () => {
      const originalError = new Error('Connection failed');
      const error = new NetworkError('Network issue', originalError);

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('NetworkError');
      expect(error.message).toBe('Network issue');
      expect(error.originalError).toBe(originalError);
      expect(error.timestamp).toBeDefined();
    });
  });

  describe('ValidationError', () => {
    it('should create a ValidationError with all properties', () => {
      const error = new ValidationError('Invalid email', 'email', 'not-an-email');

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('Invalid email');
      expect(error.field).toBe('email');
      expect(error.value).toBe('not-an-email');
      expect(error.timestamp).toBeDefined();
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return message for 400 Bad Request', () => {
      const error = new ApiError('Bad request', 400, 'Bad Request', '/api/test');
      const message = getUserFriendlyMessage(error);
      expect(message).toBe('Invalid request. Please check your input and try again.');
    });

    it('should return message for 401 Unauthorized', () => {
      const error = new ApiError('Unauthorized', 401, 'Unauthorized', '/api/test');
      const message = getUserFriendlyMessage(error);
      expect(message).toBe('You are not authorized. Please sign in and try again.');
    });

    it('should return message for 404 Not Found', () => {
      const error = new ApiError('Not found', 404, 'Not Found', '/api/test');
      const message = getUserFriendlyMessage(error);
      expect(message).toBe('The requested resource was not found. Please try again.');
    });

    it('should return message for 500 Server Error', () => {
      const error = new ApiError('Server error', 500, 'Internal Server Error', '/api/test');
      const message = getUserFriendlyMessage(error);
      expect(message).toBe('Server error. Our team has been notified. Please try again later.');
    });

    it('should return message for NetworkError', () => {
      const error = new NetworkError('Connection failed', new Error('Network error'));
      const message = getUserFriendlyMessage(error);
      expect(message).toBe('Unable to connect to the server. Please check your internet connection and try again.');
    });

    it('should return message for ValidationError', () => {
      const error = new ValidationError('Invalid email format', 'email', 'test');
      const message = getUserFriendlyMessage(error);
      expect(message).toBe('Invalid email format');
    });

    it('should include context in error message', () => {
      const error = new ApiError('Error', 999, 'Unknown', '/api/test');
      const message = getUserFriendlyMessage(error, 'loading workout');
      expect(message).toContain('while loading workout');
    });

    it('should handle generic errors', () => {
      const error = new Error('Something went wrong');
      const message = getUserFriendlyMessage(error);
      expect(message).toContain('An error occurred');
    });

    it('should detect network errors in message', () => {
      const error = new Error('fetch failed');
      const message = getUserFriendlyMessage(error);
      expect(message).toContain('Network error');
    });

    it('should detect timeout errors in message', () => {
      const error = new Error('Request timeout');
      const message = getUserFriendlyMessage(error);
      expect(message).toContain('timed out');
    });
  });

  describe('handleApiResponse', () => {
    it('should not throw for successful response', async () => {
      const response = { ok: true };
      await expect(handleApiResponse(response, '/api/test')).resolves.not.toThrow();
    });

    it('should throw ApiError for failed response', async () => {
      const response = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Map(),
        json: async () => ({ message: 'Resource not found' }),
      };

      await expect(handleApiResponse(response, '/api/test')).rejects.toThrow(ApiError);
    });

    it('should handle JSON error response', async () => {
      const response = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ message: 'Invalid data' }),
      };

      try {
        await handleApiResponse(response, '/api/test');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toContain('Invalid data');
      }
    });

    it('should handle text error response', async () => {
      const response = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Map(),
        text: async () => 'Server error details',
        json: async () => { throw new Error('Not JSON'); },
      };

      try {
        await handleApiResponse(response, '/api/test');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
      }
    });
  });

  describe('fetchWithErrorHandling', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it('should return JSON for successful request', async () => {
      const mockData = { id: 1, name: 'Test' };
      global.fetch.mockResolvedValue({
        ok: true,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => mockData,
      });

      const result = await fetchWithErrorHandling('/api/test');
      expect(result).toEqual(mockData);
    });

    it('should return null for non-JSON response', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        headers: new Map(),
      });

      const result = await fetchWithErrorHandling('/api/test');
      expect(result).toBeNull();
    });

    it('should throw ApiError for HTTP errors', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Map(),
        json: async () => ({}),
      });

      await expect(fetchWithErrorHandling('/api/test')).rejects.toThrow(ApiError);
    });

    it('should throw NetworkError for fetch failures', async () => {
      const fetchError = new TypeError('Failed to fetch');
      global.fetch.mockRejectedValue(fetchError);

      await expect(fetchWithErrorHandling('/api/test')).rejects.toThrow(NetworkError);
    });

    it('should pass through ApiError', async () => {
      const apiError = new ApiError('Test error', 500, 'Error', '/api/test');
      global.fetch.mockRejectedValue(apiError);

      await expect(fetchWithErrorHandling('/api/test')).rejects.toThrow(ApiError);
    });
  });

  describe('logError', () => {
    let consoleErrorSpy;

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should log ApiError with details', () => {
      const error = new ApiError('Test error', 404, 'Not Found', '/api/test');
      logError(error, 'test operation');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0];
      expect(loggedData[0]).toContain('[test operation]');
      expect(loggedData[0]).toContain('API Error');
    });

    it('should log NetworkError with details', () => {
      const error = new NetworkError('Connection failed', new Error('Network error'));
      logError(error, 'network operation');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0];
      expect(loggedData[0]).toContain('[network operation]');
      expect(loggedData[0]).toContain('Network Error');
    });

    it('should log ValidationError with details', () => {
      const error = new ValidationError('Invalid input', 'email', 'test');
      logError(error, 'validation');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0];
      expect(loggedData[0]).toContain('[validation]');
      expect(loggedData[0]).toContain('Validation Error');
    });

    it('should log generic errors', () => {
      const error = new Error('Generic error');
      logError(error, 'generic operation');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0];
      expect(loggedData[0]).toContain('[generic operation]');
      expect(loggedData[0]).toContain('Error');
    });

    it('should work without context', () => {
      const error = new Error('Error without context');
      logError(error);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
