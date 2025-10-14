import React from 'react';
import { CurrentDasha } from '../types/astrology';
import './DashaDisplay.css';

interface DashaDisplayProps {
  dasha: CurrentDasha;
}

export const DashaDisplay: React.FC<DashaDisplayProps> = ({ dasha }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatProgress = (progress: number) => {
    return `${(progress * 100).toFixed(1)}%`;
  };

  return (
    <div className="dasha-display">
      <h3>Current Dasha Period</h3>

      <div className="dasha-section">
        <div className="dasha-card mahadasha">
          <h4>Mahadasha (Major Period)</h4>
          <div className="planet-name">{dasha.mahadasha.planet}</div>
          <div className="dasha-dates">
            {formatDate(dasha.mahadasha.startDate)} - {formatDate(dasha.mahadasha.endDate)}
          </div>
          <div className="progress-info">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${dasha.mahadasha.progress * 100}%` }}
              />
            </div>
            <span className="progress-text">
              {formatProgress(dasha.mahadasha.progress)} complete
            </span>
          </div>
          <div className="remaining-time">
            {dasha.mahadasha.remainingYears.toFixed(1)} years remaining
          </div>
        </div>

        <div className="dasha-card antardasha">
          <h4>Antardasha (Sub-Period)</h4>
          <div className="planet-name">{dasha.antardasha.planet}</div>
          <div className="dasha-dates">
            {formatDate(dasha.antardasha.startDate)} - {formatDate(dasha.antardasha.endDate)}
          </div>
          <div className="progress-info">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${dasha.antardasha.progress * 100}%` }}
              />
            </div>
            <span className="progress-text">
              {formatProgress(dasha.antardasha.progress)} complete
            </span>
          </div>
        </div>
      </div>

      <div className="dasha-summary">
        <p>
          Current Period: <strong>{dasha.mahadasha.planet} Mahadasha - {dasha.antardasha.planet} Antardasha</strong>
        </p>
      </div>
    </div>
  );
};