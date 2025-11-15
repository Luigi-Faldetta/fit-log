import { useState, useEffect } from 'react';

/**
 * Custom hook to monitor network status (online/offline)
 * @returns {Object} Network status information
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Track if we were offline before
      if (!isOnline) {
        setWasOffline(true);
        // Reset after a short delay
        setTimeout(() => setWasOffline(false), 5000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    setIsOnline(navigator.onLine);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline, // Useful for showing "Back online" messages
  };
};

/**
 * Custom hook to detect connection quality
 * Uses Network Information API if available
 * @returns {Object} Connection quality information
 */
export const useConnectionQuality = () => {
  const [connectionQuality, setConnectionQuality] = useState({
    effectiveType: 'unknown',
    downlink: null,
    rtt: null,
    saveData: false,
  });

  useEffect(() => {
    const updateConnectionInfo = () => {
      if ('connection' in navigator) {
        const conn = navigator.connection;
        setConnectionQuality({
          effectiveType: conn.effectiveType || 'unknown',
          downlink: conn.downlink || null,
          rtt: conn.rtt || null,
          saveData: conn.saveData || false,
        });
      }
    };

    // Update immediately
    updateConnectionInfo();

    // Listen for changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateConnectionInfo);
    }

    return () => {
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateConnectionInfo);
      }
    };
  }, []);

  return connectionQuality;
};

/**
 * Check if the server is reachable
 * @param {string} url - URL to check (defaults to /health endpoint)
 * @returns {Promise<boolean>} True if server is reachable
 */
export const checkServerReachability = async (url = '/health') => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-cache',
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Server reachability check failed:', error);
    return false;
  }
};

/**
 * Custom hook to periodically check server reachability
 * @param {number} interval - Check interval in milliseconds (default: 30000)
 * @returns {Object} Server reachability status
 */
export const useServerReachability = (interval = 30000) => {
  const [isReachable, setIsReachable] = useState(true);
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (!isOnline) {
      setIsReachable(false);
      return;
    }

    const checkReachability = async () => {
      const reachable = await checkServerReachability();
      setIsReachable(reachable);
    };

    // Check immediately
    checkReachability();

    // Set up periodic checks
    const intervalId = setInterval(checkReachability, interval);

    return () => clearInterval(intervalId);
  }, [isOnline, interval]);

  return { isReachable, isOnline };
};

export default {
  useNetworkStatus,
  useConnectionQuality,
  useServerReachability,
  checkServerReachability,
};
