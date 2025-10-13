import React from 'react';
import './ScoreIndicator.css';

interface ScoreIndicatorProps {
  score: number;
  label: string;
  rating?: string;
  maxScore?: number;
  size?: 'small' | 'medium' | 'large';
  showRating?: boolean;
  className?: string;
}

export const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({
  score,
  label,
  rating,
  maxScore = 100,
  size = 'medium',
  showRating = true,
  className = ''
}) => {
  const percentage = Math.min((score / maxScore) * 100, 100);
  const scoreColor = getScoreColor(percentage);

  return (
    <div className={`score-indicator ${size} ${className}`}>
      <div className="score-header">
        <h3 className="score-label">{label}</h3>
        {showRating && rating && (
          <span className={`score-rating rating-${rating.toLowerCase().replace(' ', '-')}`}>
            {rating}
          </span>
        )}
      </div>

      <div className="score-display">
        <div className="score-circle">
          <svg className="score-circle-svg" viewBox="0 0 120 120">
            <circle
              className="score-circle-bg"
              cx="60"
              cy="60"
              r="50"
              stroke="#e0e0e0"
              strokeWidth="8"
              fill="none"
            />
            <circle
              className="score-circle-fill"
              cx="60"
              cy="60"
              r="50"
              stroke={scoreColor}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${percentage * 3.14} 314`}
              strokeDashoffset="0"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="score-text">
            <div className="score-number">{Math.round(score)}</div>
            <div className="score-max">/{maxScore}</div>
          </div>
        </div>
      </div>

      <div className="score-percentage">
        {Math.round(percentage)}% of maximum potential
      </div>
    </div>
  );
};

const getScoreColor = (percentage: number): string => {
  if (percentage >= 85) return '#4CAF50'; // Green - Excellent
  if (percentage >= 75) return '#8BC34A'; // Light Green - Very Good
  if (percentage >= 65) return '#FFC107'; // Yellow - Good
  if (percentage >= 55) return '#FF9800'; // Orange - Moderate
  if (percentage >= 45) return '#FF5722'; // Deep Orange - Fair
  return '#F44336'; // Red - Needs Improvement
};