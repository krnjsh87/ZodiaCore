import React, { useState } from 'react';
import { ReturnChartInterpretation } from '../types/astrology';

/**
 * Props for WesternReturnChartInterpretation component
 */
interface WesternReturnChartInterpretationProps {
  interpretation: ReturnChartInterpretation;
  compact?: boolean;
}

/**
 * Western Return Chart Interpretation Component
 * Displays the astrological interpretation of the return chart
 */
const WesternReturnChartInterpretation: React.FC<WesternReturnChartInterpretationProps> = ({
  interpretation,
  compact = false
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'themes' | 'predictions'>('overview');

  if (compact) {
    return (
      <div className="return-chart-interpretation-compact">
        <div className="overall-rating">
          <h4>Overall: {interpretation.overall.rating}</h4>
          <div className="rating-score">
            Score: {Math.round(interpretation.overall.score * 100)}%
          </div>
        </div>
        <div className="key-themes">
          <h5>Key Themes</h5>
          <ul>
            {interpretation.themes.slice(0, 3).map((theme, index) => (
              <li key={index}>{theme.description}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="western-return-chart-interpretation">
      <h3>Chart Interpretation</h3>

      {/* Tab Navigation */}
      <div className="interpretation-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'themes' ? 'active' : ''}`}
          onClick={() => setActiveTab('themes')}
        >
          Key Themes
        </button>
        <button
          className={`tab-button ${activeTab === 'predictions' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictions')}
        >
          Predictions
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <OverviewTab interpretation={interpretation} />
        )}

        {activeTab === 'themes' && (
          <ThemesTab interpretation={interpretation} />
        )}

        {activeTab === 'predictions' && (
          <PredictionsTab interpretation={interpretation} />
        )}
      </div>
    </div>
  );
};

/**
 * Overview Tab Component
 */
const OverviewTab: React.FC<{ interpretation: ReturnChartInterpretation }> = ({ interpretation }) => (
  <div className="overview-tab">
    <div className="overall-assessment">
      <h4>Overall Assessment</h4>
      <div className="assessment-grid">
        <div className="assessment-item">
          <div className="rating-circle" data-rating={interpretation.overall.rating.toLowerCase()}>
            {interpretation.overall.rating}
          </div>
          <div className="rating-label">Overall Rating</div>
        </div>

        <div className="assessment-item">
          <div className="score-display">
            <div className="score-number">{Math.round(interpretation.overall.score * 100)}</div>
            <div className="score-unit">%</div>
          </div>
          <div className="score-label">Strength Score</div>
        </div>
      </div>

      <div className="overall-summary">
        <h5>Summary</h5>
        <p>{interpretation.overall.summary}</p>
      </div>

      <div className="key-influences">
        <h5>Key Influences</h5>
        <div className="influences-list">
          {interpretation.overall.keyInfluences.map((influence, index) => (
            <span key={index} className="influence-tag">{influence}</span>
          ))}
        </div>
      </div>
    </div>

    <div className="planetary-analysis">
      <h4>Planetary Analysis</h4>
      <div className="planetary-grid">
        {Object.entries(interpretation.planetary).map(([planet, analysis]: [string, any]) => (
          <div key={planet} className="planetary-item">
            <div className="planet-name">{planet}</div>
            <div className="planet-influence">{analysis.influence}</div>
            <div className="planet-strength">Strength: {Math.round(analysis.strength * 100)}%</div>
          </div>
        ))}
      </div>
    </div>

    <div className="house-analysis">
      <h4>House Analysis</h4>
      <div className="houses-grid">
        {Object.entries(interpretation.houses).map(([house, analysis]: [string, any]) => (
          <div key={house} className="house-item">
            <div className="house-number">House {house}</div>
            <div className="house-significance">{analysis.significance}</div>
            <div className="house-planets">
              Planets: {analysis.planets.join(', ') || 'None'}
            </div>
            <div className="house-strength">
              Strength: {Math.round(analysis.overallStrength * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Themes Tab Component
 */
const ThemesTab: React.FC<{ interpretation: ReturnChartInterpretation }> = ({ interpretation }) => (
  <div className="themes-tab">
    <div className="themes-intro">
      <h4>Key Themes & Patterns</h4>
      <p>These are the dominant themes and patterns identified in your return chart.</p>
    </div>

    <div className="themes-list">
      {interpretation.themes.map((theme, index) => (
        <div key={index} className="theme-item">
          <div className="theme-header">
            <h5>{theme.type.replace(/_/g, ' ').toUpperCase()}</h5>
            {theme.house && <span className="theme-house">House {theme.house}</span>}
            {theme.planet && <span className="theme-planet">{theme.planet}</span>}
          </div>
          <div className="theme-description">
            {theme.description}
          </div>
          {theme.aspect && (
            <div className="theme-aspect">
              <span className="aspect-type">{theme.aspect.aspect}</span>
              <span className="aspect-planets">
                {theme.aspect.planet1} - {theme.aspect.planet2}
              </span>
              <span className="aspect-orb">{theme.aspect.orb.toFixed(1)}° orb</span>
            </div>
          )}
        </div>
      ))}
    </div>

    <div className="aspects-analysis">
      <h4>Major Aspects</h4>
      <div className="aspects-summary">
        <p>{interpretation.aspects.analysis}</p>
      </div>
      <div className="major-aspects">
        {interpretation.aspects.major.map((aspect, index) => (
          <div key={index} className="aspect-item">
            <div className="aspect-planets">
              {aspect.planet1} {aspect.aspect} {aspect.planet2}
            </div>
            <div className="aspect-details">
              <span className="orb">{aspect.orb.toFixed(1)}° orb</span>
              <span className="strength">{getAspectStrength(aspect.strength)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Predictions Tab Component
 */
const PredictionsTab: React.FC<{ interpretation: ReturnChartInterpretation }> = ({ interpretation }) => (
  <div className="predictions-tab">
    <div className="predictions-intro">
      <h4>Predictions & Insights</h4>
      <p>Based on the planetary configurations in your return chart.</p>
    </div>

    <div className="predictions-grid">
      {interpretation.predictions.map((prediction, index) => (
        <div key={index} className="prediction-item">
          <div className="prediction-header">
            <div className="prediction-timeframe">{prediction.timeframe}</div>
            <div className="prediction-area">{prediction.area}</div>
          </div>
          <div className="prediction-content">
            <p>{prediction.prediction}</p>
          </div>
          <div className="prediction-confidence">
            <div className="confidence-bar">
              <div
                className="confidence-fill"
                style={{ width: `${prediction.confidence * 100}%` }}
              ></div>
            </div>
            <span className="confidence-text">{Math.round(prediction.confidence * 100)}% confidence</span>
          </div>
        </div>
      ))}
    </div>

    <div className="predictions-disclaimer">
      <div className="disclaimer-icon">⚠️</div>
      <div className="disclaimer-text">
        <strong>Important:</strong> These predictions are based on astrological analysis and should not replace professional advice.
        Astrology provides insights and guidance, not definitive outcomes.
      </div>
    </div>
  </div>
);

/**
 * Helper function to get aspect strength description
 */
const getAspectStrength = (strength: number): string => {
  if (strength >= 0.8) return 'Very Strong';
  if (strength >= 0.6) return 'Strong';
  if (strength >= 0.4) return 'Moderate';
  if (strength >= 0.2) return 'Weak';
  return 'Very Weak';
};

export default WesternReturnChartInterpretation;