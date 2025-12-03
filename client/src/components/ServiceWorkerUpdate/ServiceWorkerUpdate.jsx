import { useState, useEffect, useRef } from 'react';
import './ServiceWorkerUpdate.css';

const ServiceWorkerUpdate = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  // Use ref to track updating state synchronously (avoids race condition with controllerchange)
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Listen for updates to the service worker
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Check for updates periodically (every 60 seconds)
        const checkForUpdates = () => {
          reg.update().catch((error) => {
            console.error('Error checking for service worker updates:', error);
          });
        };

        const updateInterval = setInterval(checkForUpdates, 60000);

        // Cleanup
        return () => clearInterval(updateInterval);
      });

      // Listen for controlling service worker changes
      const handleControllerChange = () => {
        // Service worker has been updated and is now controlling the page
        // Use ref for synchronous check to avoid race condition
        if (isUpdatingRef.current) {
          window.location.reload();
        }
      };
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

      // Listen for messages from service worker
      const handleMessage = (event) => {
        if (event.data && event.data.type === 'NEW_VERSION_AVAILABLE') {
          setShowUpdate(true);
        }
      };
      navigator.serviceWorker.addEventListener('message', handleMessage);

      // Cleanup listeners
      return () => {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    }
  }, []);

  // Check for waiting service worker on mount
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        if (reg.waiting) {
          setShowUpdate(true);
          setRegistration(reg);
        }

        // Listen for new service worker installing
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is installed and waiting
                setShowUpdate(true);
                setRegistration(reg);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if (!registration || !registration.waiting) {
      return;
    }

    // Set ref synchronously before triggering skip waiting
    isUpdatingRef.current = true;
    setIsUpdating(true);

    // Tell the waiting service worker to skip waiting
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // The page will reload automatically when the new service worker takes control
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="sw-update-banner">
      <div className="sw-update-content">
        <div className="sw-update-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="sw-update-text">
          <h3 className="sw-update-title">New Version Available</h3>
          <p className="sw-update-description">
            A new version of FitLog is ready. Update now to get the latest features and improvements.
          </p>
        </div>
        <div className="sw-update-actions">
          <button
            className="sw-update-button sw-update-button-primary"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <span className="sw-update-spinner"></span>
                Updating...
              </>
            ) : (
              'Update Now'
            )}
          </button>
          <button
            className="sw-update-button sw-update-button-secondary"
            onClick={handleDismiss}
            disabled={isUpdating}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceWorkerUpdate;
