import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message }) => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p>{message || 'Loading...'}</p>
    </div>
  );
};

export default LoadingSpinner;