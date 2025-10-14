import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#667eea',
  message,
  className = ''
}) => {
  return (
    <div className={`loading-spinner-container ${size} ${className}`}>
      <div className="loading-spinner" style={{ borderTopColor: color }}>
        <div className="loading-spinner-inner" style={{ borderTopColor: color }}></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};