import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  showIcon?: boolean;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  retryLabel = 'Try Again',
  showIcon = true,
  className = ''
}) => {
  return (
    <div className={`error-message ${className}`}>
      {showIcon && (
        <div className="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
      )}

      <div className="error-content">
        <h3 className="error-title">Something went wrong</h3>
        <p className="error-description">{message}</p>

        {onRetry && (
          <button
            className="error-retry-button"
            onClick={onRetry}
            type="button"
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
};