import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import './OfflinePage.css';

const OfflinePage = () => {
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    // Redirect back when online
    if (isOnline) {
      navigate(-1);
    }
  }, [isOnline, navigate]);

  const handleRetry = async () => {
    setRetrying(true);

    // Try to check connectivity
    try {
      const response = await fetch('/health', {
        method: 'HEAD',
        cache: 'no-cache',
      });

      if (response.ok) {
        navigate(-1);
      }
    } catch (error) {
      console.error('Still offline:', error);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="offline-page">
      <div className="offline-page-content">
        <div className="offline-page-icon">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="2" />
          </svg>
        </div>

        <h1 className="offline-page-title">You&apos;re Offline</h1>

        <p className="offline-page-description">
          It looks like you&apos;ve lost your internet connection. Don&apos;t worry, your
          data is safe!
        </p>

        <div className="offline-page-features">
          <div className="offline-feature">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>Your data is saved locally</span>
          </div>

          <div className="offline-feature">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>Changes will sync automatically</span>
          </div>

          <div className="offline-feature">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Continue using cached data</span>
          </div>
        </div>

        <button
          className="offline-page-button"
          onClick={handleRetry}
          disabled={retrying}
        >
          {retrying ? (
            <>
              <span className="spinner"></span>
              Checking Connection...
            </>
          ) : (
            'Try Again'
          )}
        </button>

        <button
          className="offline-page-button-secondary"
          onClick={() => navigate('/')}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default OfflinePage;
