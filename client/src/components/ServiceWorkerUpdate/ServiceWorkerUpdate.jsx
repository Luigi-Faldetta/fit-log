import { useRegisterSW } from 'virtual:pwa-register/react';
import './ServiceWorkerUpdate.css';

const ServiceWorkerUpdate = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      // Check for updates every 60 seconds
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60000);
      }
    },
    onRegisterError(error) {
      console.error('Service worker registration error:', error);
    },
  });

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) {
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
          >
            Update Now
          </button>
          <button
            className="sw-update-button sw-update-button-secondary"
            onClick={handleDismiss}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceWorkerUpdate;
