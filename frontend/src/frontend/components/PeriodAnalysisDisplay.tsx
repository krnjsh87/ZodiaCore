import React from 'react';
import { PeriodAnalysis } from '../types/astrology';
import './PeriodAnalysisDisplay.css';

interface PeriodAnalysisDisplayProps {
  analysis: PeriodAnalysis;
}

export const PeriodAnalysisDisplay: React.FC<PeriodAnalysisDisplayProps> = ({ analysis }) => {
  const getStrengthColor = (strength: number) => {
    if (strength >= 0.8) return 'strong';
    if (strength >= 0.6) return 'moderate';
    return 'weak';
  };

  const getPlanetSymbol = (planet: string) => {
    const symbols: Record<string, string> = {
      SUN: '☉',
      MOON: '☽',
      MARS: '♂',
      MERCURY: '☿',
      JUPITER: '♃',
      VENUS: '♀',
      SATURN: '♄',
      RAHU: '☊',
      KETU: '☋'
    };
    return symbols[planet] || planet;
  };

  return (
    <div className="period-analysis-display">
      <h3>Period Analysis</h3>

      <div className="analysis-section">
        <h4>Overall Period Strength</h4>
        <div className={`strength-indicator ${getStrengthColor(analysis.strength.overall)}`}>
          <div className="strength-bar">
            <div
              className="strength-fill"
              style={{ width: `${analysis.strength.overall * 100}%` }}
            />
          </div>
          <span className="strength-value">
            {(analysis.strength.overall * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="analysis-section">
        <h4>Planetary Strengths</h4>
        <div className="planetary-strengths">
          {Object.entries(analysis.strength.planetary).map(([planet, strength]) => (
            <div key={planet} className="planet-strength">
              <span className="planet-symbol">{getPlanetSymbol(planet)}</span>
              <span className="planet-name">{planet}</span>
              <div className={`strength-bar ${getStrengthColor(strength)}`}>
                <div
                  className="strength-fill"
                  style={{ width: `${strength * 100}%` }}
                />
              </div>
              <span className="strength-value">
                {(strength * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="analysis-section">
        <h4>Favorable Periods</h4>
        {analysis.favorablePeriods.length > 0 ? (
          <div className="periods-list">
            {analysis.favorablePeriods.map((period, index) => (
              <div key={index} className="period-item favorable">
                <div className="period-header">
                  <span className="period-name">{period.period}</span>
                  <span className="period-strength">
                    {(period.strength * 100).toFixed(0)}% favorable
                  </span>
                </div>
                <p className="period-reason">{period.reason}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-periods">No favorable periods identified</p>
        )}
      </div>

      <div className="analysis-section">
        <h4>Challenging Periods</h4>
        {analysis.challengingPeriods.length > 0 ? (
          <div className="periods-list">
            {analysis.challengingPeriods.map((period, index) => (
              <div key={index} className="period-item challenging">
                <div className="period-header">
                  <span className="period-name">{period.period}</span>
                  <span className="period-strength">
                    {(period.strength * 100).toFixed(0)}% challenging
                  </span>
                </div>
                <p className="period-reason">{period.reason}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-periods">No challenging periods identified</p>
        )}
      </div>
    </div>
  );
};