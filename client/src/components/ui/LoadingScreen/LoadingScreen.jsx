import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ message = 'Loading' }) => {
  return (
    <div className="loading-screen" role="status" aria-label={message}>
      <img
        className="loading-screen__logo"
        src="/logo.png"
        alt=""
        aria-hidden="true"
      />
      <span className="loading-screen__text">{message}</span>
      <div className="loading-screen__spinner" aria-hidden="true" />
      <span className="visually-hidden">Loading, please wait</span>
    </div>
  );
};

export default LoadingScreen;
