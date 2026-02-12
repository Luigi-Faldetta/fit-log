import { PulseLoader } from 'react-spinners';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 12, color = '#6366f1', message }) => {
  return (
    <div className="loading-spinner" role="status">
      <PulseLoader size={size} color={color} />
      {message && <p className="loading-spinner__message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
