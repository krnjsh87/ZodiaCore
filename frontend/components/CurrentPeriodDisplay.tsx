import React from 'react';
import { DeepHoroscopeInterpretation } from '../types/astrology';

interface CurrentPeriodDisplayProps {
  currentPeriod: DeepHoroscopeInterpretation['currentPeriod'];
}

const CurrentPeriodDisplay: React.FC<CurrentPeriodDisplayProps> = ({ currentPeriod }) => {
  return (
    <div className="current-period-display">
      <h2>Current Period Analysis</h2>
      <div className="period-section">
        <h3>Mahadasha</h3>
        <p>Lord: {currentPeriod?.mahadasha?.lord || 'Unknown'}</p>
        <p>Effects: {currentPeriod?.mahadasha?.effects || 'Analysis available'}</p>
      </div>
      <div className="period-section">
        <h3>Antardasha</h3>
        <p>Lord: {currentPeriod?.antardasha?.lord || 'Unknown'}</p>
        <p>Effects: {currentPeriod?.antardasha?.effects || 'Analysis available'}</p>
      </div>
    </div>
  );
};

export default CurrentPeriodDisplay;