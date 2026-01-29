import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Toast.css';

const Toast = ({ message, type = 'success', duration = 2000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast--${type} ${isVisible ? 'toast--visible' : 'toast--hidden'}`}>
      <div className="toast__icon">
        {type === 'success' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
        {type === 'error' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        )}
      </div>
      <span className="toast__message">{message}</span>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error']),
  duration: PropTypes.number,
  onClose: PropTypes.func,
};

export default Toast;
