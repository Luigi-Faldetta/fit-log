import { useState, useEffect } from 'react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { getQueueCount } from '../../services/offlineQueue';
import './OfflineIndicator.css';

const OfflineIndicator = () => {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [queueCount, setQueueCount] = useState(0);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const updateQueueCount = async () => {
      const count = await getQueueCount();
      setQueueCount(count);
    };

    updateQueueCount();

    // Update queue count periodically
    const interval = setInterval(updateQueueCount, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setMessage('You are offline. Changes will be saved locally.');
      setShow(true);
    } else if (wasOffline) {
      if (queueCount > 0) {
        setMessage(`Back online! Syncing ${queueCount} pending changes...`);
      } else {
        setMessage('Back online!');
      }
      setShow(true);
      // Hide after 5 seconds
      setTimeout(() => setShow(false), 5000);
    } else if (isOnline && queueCount > 0) {
      setMessage(`${queueCount} changes pending sync`);
      setShow(true);
    } else {
      setShow(false);
    }
  }, [isOnline, wasOffline, queueCount]);

  // Listen for sync complete events
  useEffect(() => {
    const handleSyncComplete = () => {
      setMessage('All changes synced!');
      setShow(true);
      setTimeout(async () => {
        const count = await getQueueCount();
        setQueueCount(count);
        if (count === 0) {
          setShow(false);
        }
      }, 3000);
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SYNC_COMPLETE') {
          handleSyncComplete();
        }
      });
    }
  }, []);

  if (!show) return null;

  return (
    <div className={`offline-indicator ${isOnline ? 'online' : 'offline'}`}>
      <div className="offline-indicator-content">
        <div className="offline-indicator-icon">
          {isOnline ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          )}
        </div>
        <span className="offline-indicator-message">{message}</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
