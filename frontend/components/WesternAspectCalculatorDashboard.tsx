import React, { useState, useCallback } from 'react';
import { WesternAspectAnalysis, WesternAspectResult, WesternAspectPattern } from '../types/astrology';
import './WesternAspectCalculatorDashboard.css';

/**
 * Western Aspect Calculator Dashboard
 *
 * Main component for calculating and displaying Western astrology aspects
 */
const WesternAspectCalculatorDashboard: React.FC = () => {
  const [analysis, setAnalysis] = useState<WesternAspectAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock planetary data for demonstration
  const [planets] = useState([
    { name: 'sun', longitude: 120.5, speed: 1.0, sign: 'leo' },
    { name: 'moon', longitude: 180.3, speed: 13.2, sign: 'virgo' },
    { name: 'mercury', longitude: 115.7, speed: 1.4, sign: 'leo' },
    { name: 'venus', longitude: 90.2, speed: 1.2, sign: 'cancer' },
    { name: 'mars', longitude: 240.8, speed: 0.5, sign: 'scorpio' },
    { name: 'jupiter', longitude: 300.1, speed: 0.1, sign: 'capricorn' },
    { name: 'saturn', longitude: 45.6, speed: 0.05, sign: 'taurus' },
    { name: 'uranus', longitude: 280.4, speed: 0.03, sign: 'capricorn' },
    { name: 'neptune', longitude: 315.2, speed: 0.03, sign: 'aquarius' },
    { name: 'pluto', longitude: 225.8, speed: 0.02, sign: 'scorpio' }
  ]);

  const calculateAspects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Import the calculator dynamically to avoid bundling issues
      const { default: WesternAspectCalculator } = await import('../../services/astrology/western-aspect-calculator');

      const calculator = new WesternAspectCalculator();
      const result = calculator.calculateAspects(planets);

      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate aspects');
    } finally {
      setLoading(false);
    }
  }, [planets]);

  const getAspectColor = (type: string): string => {
    const colors: Record<string, string> = {
      conjunction: '#ff6b6b',
      sextile: '#4ecdc4',
      square: '#45b7d1',
      trine: '#96ceb4',
      opposition: '#ffeaa7',
      'semi-sextile': '#dda0dd',
      'semi-square': '#98d8c8',
      'sesqui-square': '#f7dc6f',
      quincunx: '#bb8fce'
    };
    return colors[type] || '#bdc3c7';
  };

  const getStrengthColor = (strength: number): string => {
    if (strength >= 0.8) return '#27ae60';
    if (strength >= 0.6) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className="western-aspect-dashboard">
      <header className="dashboard-header">
        <h1>Western Aspect Calculator</h1>
        <p>Calculate planetary aspects in Western astrology</p>
      </header>

      <div className="dashboard-content">
        <section className="input-section">
          <h2>Planetary Data</h2>
          <div className="planet-grid">
            {planets.map((planet) => (
              <div key={planet.name} className="planet-card">
                <h3>{planet.name.charAt(0).toUpperCase() + planet.name.slice(1)}</h3>
                <div className="planet-details">
                  <span>Longitude: {planet.longitude.toFixed(1)}°</span>
                  <span>Speed: {planet.speed}°/day</span>
                  <span>Sign: {planet.sign}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={calculateAspects}
            disabled={loading}
            className="calculate-button"
          >
            {loading ? 'Calculating...' : 'Calculate Aspects'}
          </button>

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
        </section>

        {analysis && (
          <>
            <section className="summary-section">
              <h2>Analysis Summary</h2>
              <div className="summary-grid">
                <div className="summary-card">
                  <h3>Total Aspects</h3>
                  <span className="summary-value">{analysis.summary.totalAspects}</span>
                </div>
                <div className="summary-card">
                  <h3>Major Aspects</h3>
                  <span className="summary-value">{analysis.summary.majorAspects}</span>
                </div>
                <div className="summary-card">
                  <h3>Minor Aspects</h3>
                  <span className="summary-value">{analysis.summary.minorAspects}</span>
                </div>
                <div className="summary-card">
                  <h3>Average Strength</h3>
                  <span className="summary-value">{(analysis.summary.averageStrength * 100).toFixed(1)}%</span>
                </div>
              </div>
            </section>

            <section className="aspects-section">
              <h2>Aspects</h2>
              <div className="aspects-list">
                {analysis.aspects.map((aspect) => (
                  <AspectCard key={aspect.id} aspect={aspect} />
                ))}
              </div>
            </section>

            {analysis.patterns.length > 0 && (
              <section className="patterns-section">
                <h2>Aspect Patterns</h2>
                <div className="patterns-list">
                  {analysis.patterns.map((pattern, index) => (
                    <PatternCard key={index} pattern={pattern} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Individual Aspect Card Component
 */
interface AspectCardProps {
  aspect: WesternAspectResult;
}

const AspectCard: React.FC<AspectCardProps> = ({ aspect }) => {
  const [expanded, setExpanded] = useState(false);

  const getAspectColor = (type: string): string => {
    const colors: Record<string, string> = {
      conjunction: '#ff6b6b',
      sextile: '#4ecdc4',
      square: '#45b7d1',
      trine: '#96ceb4',
      opposition: '#ffeaa7',
      'semi-sextile': '#dda0dd',
      'semi-square': '#98d8c8',
      'sesqui-square': '#f7dc6f',
      quincunx: '#bb8fce'
    };
    return colors[type] || '#bdc3c7';
  };

  const getStrengthColor = (strength: number): string => {
    if (strength >= 0.8) return '#27ae60';
    if (strength >= 0.6) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className="aspect-card">
      <div
        className="aspect-header"
        onClick={() => setExpanded(!expanded)}
        style={{ borderLeftColor: getAspectColor(aspect.type) }}
      >
        <div className="aspect-main">
          <span className="aspect-planets">
            {aspect.planets.join(' - ')}
          </span>
          <span className="aspect-type" style={{ backgroundColor: getAspectColor(aspect.type) }}>
            {aspect.type}
          </span>
        </div>
        <div className="aspect-metrics">
          <span className="aspect-strength" style={{ color: getStrengthColor(aspect.strength) }}>
            {(aspect.strength * 100).toFixed(1)}%
          </span>
          <span className="aspect-angle">{aspect.angle}°</span>
          <span className={`aspect-applying ${aspect.applying ? 'applying' : 'separating'}`}>
            {aspect.applying ? '→' : '←'}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="aspect-details">
          <div className="aspect-info">
            <p><strong>Separation:</strong> {aspect.separation.toFixed(1)}°</p>
            <p><strong>Exact:</strong> {aspect.interpretation.aspect.exact ? 'Yes' : 'No'}</p>
          </div>
          <div className="aspect-interpretation">
            <h4>Summary</h4>
            <p>{aspect.interpretation.summary}</p>

            <h4>Personality Impact</h4>
            <p>{aspect.interpretation.personality}</p>

            <h4>Life Areas</h4>
            <p>{aspect.interpretation.lifeAreas}</p>

            <h4>Challenges</h4>
            <p>{aspect.interpretation.challenges}</p>

            <h4>Strengths</h4>
            <p>{aspect.interpretation.strengths}</p>

            <h4>Advice</h4>
            <p>{aspect.interpretation.advice}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Aspect Pattern Card Component
 */
interface PatternCardProps {
  pattern: WesternAspectPattern;
}

const PatternCard: React.FC<PatternCardProps> = ({ pattern }) => {
  return (
    <div className="pattern-card">
      <h3>{pattern.type.replace('-', ' ').toUpperCase()}</h3>
      <div className="pattern-details">
        <p><strong>Planets:</strong> {pattern.planets.join(', ')}</p>
        {pattern.element && <p><strong>Element:</strong> {pattern.element}</p>}
        <p><strong>Strength:</strong> {(pattern.strength * 100).toFixed(1)}%</p>
      </div>
    </div>
  );
};

export default WesternAspectCalculatorDashboard;