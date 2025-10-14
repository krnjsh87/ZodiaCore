import React from 'react';
import { VargaBala } from '../types/astrology';

/**
 * Props for VargaBalaDisplay component
 */
interface VargaBalaDisplayProps {
  /** Varga Bala data for all planets */
  vargaBala: Record<string, VargaBala>;
  /** Optional CSS class name */
  className?: string;
  /** Whether to show detailed breakdown */
  showBreakdown?: boolean;
}

/**
 * Planet symbols for display
 */
const PLANET_SYMBOLS: Record<string, string> = {
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

/**
 * Planet colors for visual distinction
 */
const PLANET_COLORS: Record<string, string> = {
  SUN: '#ff6b35',
  MOON: '#4ecdc4',
  MARS: '#e74c3c',
  MERCURY: '#f39c12',
  JUPITER: '#9b59b6',
  VENUS: '#e91e63',
  SATURN: '#34495e',
  RAHU: '#95a5a6',
  KETU: '#7f8c8d'
};

/**
 * Strength level colors
 */
const STRENGTH_COLORS: Record<string, string> = {
  'Excellent': '#27ae60',
  'Good': '#2ecc71',
  'Moderate': '#f39c12',
  'Weak': '#e67e22',
  'Very Weak': '#e74c3c'
};

/**
 * VargaBalaDisplay Component
 *
 * Displays planetary strength analysis (Varga Bala) in Vedic astrology,
 * showing how well planets perform in different divisional charts.
 */
const VargaBalaDisplay: React.FC<VargaBalaDisplayProps> = ({
  vargaBala,
  className = '',
  showBreakdown = true
}) => {
  /**
   * Get strength level color
   */
  const getStrengthColor = (strength: string) => {
    return STRENGTH_COLORS[strength] || '#95a5a6';
  };

  /**
   * Calculate overall average strength
   */
  const calculateAverageStrength = () => {
    const planets = Object.values(vargaBala);
    if (planets.length === 0) return 0;

    const totalPercentage = planets.reduce((sum, planet) => sum + planet.percentage, 0);
    return totalPercentage / planets.length;
  };

  /**
   * Get overall strength level
   */
  const getOverallStrengthLevel = (average: number) => {
    if (average >= 80) return 'Excellent';
    if (average >= 60) return 'Good';
    if (average >= 40) return 'Moderate';
    if (average >= 20) return 'Weak';
    return 'Very Weak';
  };

  /**
   * Sort planets by strength (highest first)
   */
  const sortedPlanets = Object.values(vargaBala).sort((a, b) => b.percentage - a.percentage);

  const averageStrength = calculateAverageStrength();
  const overallLevel = getOverallStrengthLevel(averageStrength);

  return (
    <div className={`varga-bala-display ${className}`} role="region" aria-labelledby="varga-bala-title">
      {/* Header */}
      <header className="varga-bala__header">
        <h3 id="varga-bala-title">Planetary Strength Analysis (Varga Bala)</h3>
        <p className="varga-bala-description">
          Varga Bala measures how well planets perform across different divisional charts.
          Higher scores indicate stronger planetary influence.
        </p>

        {/* Overall Summary */}
        <div className="strength-summary" role="status" aria-live="polite">
          <div className="summary-metric">
            <span className="metric-label">Overall Strength:</span>
            <span
              className="metric-value"
              style={{ color: getStrengthColor(overallLevel) }}
            >
              {overallLevel} ({averageStrength.toFixed(1)}%)
            </span>
          </div>
        </div>
      </header>

      {/* Planet Strength Grid */}
      <div className="planet-strength-grid" role="table" aria-label="Planetary strength breakdown">
        <div className="grid-header" role="row">
          <div className="header-cell planet-header">Planet</div>
          <div className="header-cell score-header">Score</div>
          <div className="header-cell percentage-header">Strength</div>
          <div className="header-cell level-header">Level</div>
          {showBreakdown && <div className="header-cell breakdown-header">Chart Weights</div>}
        </div>

        {sortedPlanets.map(planet => (
          <div key={planet.planet} className="planet-row" role="row">
            <div className="planet-cell" role="cell">
              <div className="planet-info">
                <span
                  className="planet-symbol"
                  style={{ color: PLANET_COLORS[planet.planet] || '#333' }}
                  aria-label={`${planet.planet} symbol`}
                >
                  {PLANET_SYMBOLS[planet.planet] || planet.planet}
                </span>
                <span className="planet-name">{planet.planet}</span>
              </div>
            </div>

            <div className="score-cell" role="cell">
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${(planet.score / planet.maxScore) * 100}%`,
                    backgroundColor: getStrengthColor(planet.strength)
                  }}
                  aria-label={`Score: ${planet.score} out of ${planet.maxScore}`}
                ></div>
              </div>
              <span className="score-text">{planet.score.toFixed(1)}/{planet.maxScore}</span>
            </div>

            <div className="percentage-cell" role="cell">
              {planet.percentage.toFixed(1)}%
            </div>

            <div className="level-cell" role="cell">
              <span
                className="strength-level"
                style={{ color: getStrengthColor(planet.strength) }}
              >
                {planet.strength}
              </span>
            </div>

            {showBreakdown && (
              <div className="breakdown-cell" role="cell">
                <div className="chart-breakdown">
                  {Object.entries(planet.breakdown).map(([chart, weight]) => (
                    <div key={chart} className="chart-weight" title={`${chart}: ${weight} points`}>
                      <span className="chart-code">{chart}</span>
                      <span className="weight-value">{weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer with explanation */}
      <footer className="varga-bala__footer">
        <div className="strength-explanation">
          <h4>Understanding Varga Bala</h4>
          <ul>
            <li><strong>Excellent (80-100%):</strong> Planet gives outstanding results</li>
            <li><strong>Good (60-79%):</strong> Planet performs well with good results</li>
            <li><strong>Moderate (40-59%):</strong> Planet gives mixed results</li>
            <li><strong>Weak (20-39%):</strong> Planet gives challenging results</li>
            <li><strong>Very Weak (0-19%):</strong> Planet gives difficult results</li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default VargaBalaDisplay;