import React from 'react';
import { DeepHoroscopeInterpretation } from '../types/astrology';
import './PlanetaryAnalysisDisplay.css';

interface PlanetaryAnalysisDisplayProps {
  planetaryAnalysis: DeepHoroscopeInterpretation['planetaryAnalysis'];
}

/**
 * Planetary Analysis Display Component
 * Shows detailed Shad Bala analysis for all planets
 */
const PlanetaryAnalysisDisplay: React.FC<PlanetaryAnalysisDisplayProps> = ({
  planetaryAnalysis
}) => {
  /**
   * Get strength color based on level
   */
  const getStrengthColor = (strength: string) => {
    switch (strength?.toLowerCase()) {
      case 'excellent': return '#22c55e'; // green
      case 'very good': return '#84cc16'; // light green
      case 'good': return '#eab308'; // yellow
      case 'moderate': return '#f97316'; // orange
      case 'weak': return '#ef4444'; // red
      case 'very weak': return '#dc2626'; // dark red
      default: return '#6b7280'; // gray
    }
  };

  /**
   * Get planet symbol/emoji
   */
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

  /**
   * Render Shad Bala breakdown
   */
  const renderShadBalaBreakdown = (components: any) => {
    if (!components) return null;

    return (
      <div className="shad-bala-breakdown">
        <div className="breakdown-item">
          <span className="component-label">Sthan Bala:</span>
          <span className="component-value">{components.sthanBala || 0}</span>
        </div>
        <div className="breakdown-item">
          <span className="component-label">Dig Bala:</span>
          <span className="component-value">{components.digBala || 0}</span>
        </div>
        <div className="breakdown-item">
          <span className="component-label">Kala Bala:</span>
          <span className="component-value">{components.kalaBala || 0}</span>
        </div>
        <div className="breakdown-item">
          <span className="component-label">Chesta Bala:</span>
          <span className="component-value">{components.chestaBala || 0}</span>
        </div>
        <div className="breakdown-item">
          <span className="component-label">Naisargika:</span>
          <span className="component-value">{components.naisargikaBala || 0}</span>
        </div>
        <div className="breakdown-item">
          <span className="component-label">Drig Bala:</span>
          <span className="component-value">{components.drigBala || 0}</span>
        </div>
      </div>
    );
  };

  /**
   * Render planet card
   */
  const renderPlanetCard = (planet: string, analysis: any) => {
    if (!analysis) {
      return (
        <div key={planet} className="planet-card error">
          <div className="planet-header">
            <span className="planet-symbol">{getPlanetSymbol(planet)}</span>
            <h3 className="planet-name">{planet}</h3>
          </div>
          <div className="planet-strength">
            <span className="strength-text">Analysis unavailable</span>
          </div>
        </div>
      );
    }

    const strengthColor = getStrengthColor(analysis.strength);

    return (
      <div key={planet} className="planet-card">
        <div className="planet-header">
          <span className="planet-symbol">{getPlanetSymbol(planet)}</span>
          <h3 className="planet-name">{planet}</h3>
        </div>

        <div className="planet-strength">
          <div className="strength-bar">
            <div
              className="strength-fill"
              style={{
                width: `${Math.min(100, (analysis.total || 0) / 3)}%`,
                backgroundColor: strengthColor
              }}
            />
          </div>
          <div className="strength-info">
            <span className="strength-score">{(analysis.total || 0).toFixed(1)}</span>
            <span
              className="strength-level"
              style={{ color: strengthColor }}
            >
              {analysis.strength || 'Unknown'}
            </span>
          </div>
        </div>

        {renderShadBalaBreakdown(analysis.components)}

        {analysis.interpretation && (
          <div className="planet-interpretation">
            <p>{analysis.interpretation}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="planetary-analysis-display">
      <div className="section-header">
        <h2>Planetary Strength Analysis (Shad Bala)</h2>
        <p>
          Comprehensive analysis of planetary strengths using the traditional Shad Bala system,
          which evaluates six different types of planetary strength for accurate predictions.
        </p>
      </div>

      <div className="analysis-overview">
        <div className="overview-stats">
          <div className="stat-item">
            <span className="stat-label">Strong Planets:</span>
            <span className="stat-value">
              {Object.entries(planetaryAnalysis || {}).filter(([_, analysis]: [string, any]) =>
                ['excellent', 'very good', 'good'].includes((analysis?.strength || '').toLowerCase())
              ).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Weak Planets:</span>
            <span className="stat-value">
              {Object.entries(planetaryAnalysis || {}).filter(([_, analysis]: [string, any]) =>
                ['weak', 'very weak'].includes((analysis?.strength || '').toLowerCase())
              ).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average Strength:</span>
            <span className="stat-value">
              {Object.values(planetaryAnalysis || {}).length > 0
                ? (Object.values(planetaryAnalysis).reduce((sum: number, analysis: any) =>
                    sum + (analysis?.total || 0), 0) / Object.values(planetaryAnalysis).length).toFixed(1)
                : '0.0'
              }
            </span>
          </div>
        </div>
      </div>

      <div className="planets-grid">
        {['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'].map(planet =>
          renderPlanetCard(planet, planetaryAnalysis?.[planet])
        )}
      </div>

      <div className="analysis-notes">
        <h3>Understanding Shad Bala</h3>
        <div className="notes-grid">
          <div className="note-item">
            <h4>Sthan Bala (Positional Strength)</h4>
            <p>Based on exaltation, own sign, friendly signs, and moolatrikona positions.</p>
          </div>
          <div className="note-item">
            <h4>Dig Bala (Directional Strength)</h4>
            <p>Strength derived from the house position in the birth chart.</p>
          </div>
          <div className="note-item">
            <h4>Kala Bala (Temporal Strength)</h4>
            <p>Strength from nakshatra lord, weekday lord, and lunar day.</p>
          </div>
          <div className="note-item">
            <h4>Chesta Bala (Motivational Strength)</h4>
            <p>Strength from planetary speed and directional movement.</p>
          </div>
          <div className="note-item">
            <h4>Naisargika Bala (Natural Strength)</h4>
            <p>Inherent strength of each planet in Vedic astrology.</p>
          </div>
          <div className="note-item">
            <h4>Drig Bala (Aspect Strength)</h4>
            <p>Strength from aspects and conjunctions with other planets.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanetaryAnalysisDisplay;