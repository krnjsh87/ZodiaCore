import React, { useState } from 'react';
import { WesternBirthChartAnalysis } from '../types/astrology';

/**
 * Props for WesternBirthChartAnalysisDisplay component
 */
interface WesternBirthChartAnalysisDisplayProps {
  analysis: WesternBirthChartAnalysis;
  loading: boolean;
  error: string | null;
}

/**
 * Western Birth Chart Analysis Display Component
 * Comprehensive display of birth chart analysis results
 */
const WesternBirthChartAnalysisDisplay: React.FC<WesternBirthChartAnalysisDisplayProps> = ({
  analysis,
  loading,
  error
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'planets' | 'houses' | 'aspects' | 'patterns' | 'synthesis'>('overview');

  if (loading) {
    return (
      <div className="analysis-loading">
        <div className="loading-spinner"></div>
        <p>Analyzing your birth chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analysis-error" role="alert">
        <h3>Analysis Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="analysis-empty">
        <p>No analysis data available</p>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="analysis-overview">
      <div className="overview-header">
        <h3>Birth Chart Overview</h3>
        <div className="analysis-meta">
          <p><strong>Analysis Date:</strong> {new Date(analysis.analysisTime).toLocaleDateString()}</p>
          <p><strong>Framework:</strong> {analysis.options.framework}</p>
          <p><strong>House System:</strong> {analysis.options.houseSystem}</p>
        </div>
      </div>

      <div className="overview-summary">
        <div className="summary-card">
          <h4>Chart Shape</h4>
          <p className="chart-shape">{analysis.summary.chartShape.shape}</p>
          <p className="chart-description">{analysis.summary.chartShape.concentration} distribution</p>
        </div>

        <div className="summary-card">
          <h4>Dominant Planets</h4>
          <ul className="dominant-list">
            {analysis.summary.dominantPlanets.map(planet => (
              <li key={planet}>{planet}</li>
            ))}
          </ul>
        </div>

        <div className="summary-card">
          <h4>Dominant Houses</h4>
          <ul className="dominant-list">
            {analysis.summary.dominantHouses.map(house => (
              <li key={house}>House {house}</li>
            ))}
          </ul>
        </div>

        <div className="summary-card">
          <h4>Overall Strength</h4>
          <div className="strength-meter">
            <div
              className="strength-bar"
              style={{ width: `${analysis.summary.overallStrength * 100}%` }}
            ></div>
          </div>
          <p className="strength-value">{Math.round(analysis.summary.overallStrength * 100)}%</p>
        </div>
      </div>

      <div className="overview-birth-data">
        <h4>Birth Information</h4>
        <dl className="birth-details">
          <div>
            <dt>Date:</dt>
            <dd>{analysis.birthData.date}</dd>
          </div>
          <div>
            <dt>Time:</dt>
            <dd>{analysis.birthData.time}</dd>
          </div>
          <div>
            <dt>Location:</dt>
            <dd>{analysis.birthData.location.latitude.toFixed(4)}, {analysis.birthData.location.longitude.toFixed(4)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );

  const renderPlanets = () => (
    <div className="analysis-planets">
      <h3>Planetary Analysis</h3>
      <div className="planets-grid">
        {analysis.planetaryAnalysis.map((planet) => (
          <div key={planet.planet} className="planet-card">
            <div className="planet-header">
              <h4>{planet.planet}</h4>
              <span className="planet-sign">{planet.sign}</span>
              <span className="planet-house">House {planet.house}</span>
            </div>

            <div className="planet-strength">
              <div className="strength-breakdown">
                <div className="strength-item">
                  <span>Essential:</span>
                  <span>{Math.round(planet.strength.essential * 100)}%</span>
                </div>
                <div className="strength-item">
                  <span>Accidental:</span>
                  <span>{Math.round(planet.strength.accidental * 100)}%</span>
                </div>
                <div className="strength-item">
                  <span>Aspect:</span>
                  <span>{Math.round(planet.strength.aspect * 100)}%</span>
                </div>
                <div className="strength-item">
                  <span>Overall:</span>
                  <span>{Math.round(planet.strength.total * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="planet-interpretation">
              <h5>Personality</h5>
              <p>{planet.personality}</p>

              <h5>Life Areas</h5>
              <p>{planet.lifeAreas}</p>

              <h5>Challenges</h5>
              <p>{planet.challenges}</p>

              <h5>Potentials</h5>
              <p>{planet.potentials}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHouses = () => (
    <div className="analysis-houses">
      <h3>House Analysis</h3>
      <div className="houses-grid">
        {analysis.houseAnalysis.map((house) => (
          <div key={house.house} className="house-card">
            <div className="house-header">
              <h4>House {house.house}</h4>
              <span className="house-sign">{house.sign}</span>
              <span className="house-ruler">{house.ruler}</span>
            </div>

            <div className="house-strength">
              <div className="strength-bar">
                <div
                  className="strength-fill"
                  style={{ width: `${house.strength * 100}%` }}
                ></div>
              </div>
              <span className="strength-value">{Math.round(house.strength * 100)}%</span>
            </div>

            <div className="house-themes">
              <h5>Themes</h5>
              <p>{house.themes}</p>
            </div>

            <div className="house-interpretation">
              <h5>Interpretation</h5>
              <p>{house.interpretation}</p>
            </div>

            {house.planets.length > 0 && (
              <div className="house-planets">
                <h5>Planets</h5>
                <ul>
                  {house.planets.map(planet => (
                    <li key={planet}>{planet}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAspects = () => (
    <div className="analysis-aspects">
      <h3>Aspects Analysis</h3>
      <div className="aspects-summary">
        <div className="aspect-balance">
          <h4>Aspect Balance</h4>
          <div className="balance-chart">
            <div className="balance-harmonious">
              <span>Harmonious: {Math.round(analysis.summary.aspectBalance.harmonious * 100)}%</span>
            </div>
            <div className="balance-challenging">
              <span>Challenging: {Math.round(analysis.summary.aspectBalance.challenging * 100)}%</span>
            </div>
          </div>
          <p className="balance-description">{analysis.summary.aspectBalance.overall} aspects</p>
        </div>
      </div>

      <div className="aspects-list">
        <h4>Aspect Details</h4>
        <div className="aspects-table">
          <div className="table-header">
            <span>Planets</span>
            <span>Aspect</span>
            <span>Angle</span>
            <span>Orb</span>
            <span>Strength</span>
          </div>
          {analysis.aspects.map((aspect, index) => (
            <div key={index} className="aspect-row">
              <span>{aspect.planets.join(' - ')}</span>
              <span className={`aspect-type ${aspect.type}`}>{aspect.type}</span>
              <span>{aspect.angle.toFixed(1)}°</span>
              <span>{aspect.orb.toFixed(1)}°</span>
              <span>{Math.round(aspect.strength * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPatterns = () => (
    <div className="analysis-patterns">
      <h3>Chart Patterns</h3>
      {analysis.patterns.length === 0 ? (
        <p>No significant patterns detected in this chart.</p>
      ) : (
        <div className="patterns-grid">
          {analysis.patterns.map((pattern, index) => (
            <div key={index} className="pattern-card">
              <div className="pattern-header">
                <h4>{pattern.type.replace('-', ' ').toUpperCase()}</h4>
                <span className="pattern-strength">{Math.round(pattern.strength * 100)}%</span>
              </div>

              <div className="pattern-planets">
                <h5>Planets Involved</h5>
                <ul>
                  {pattern.planets.map(planet => (
                    <li key={planet}>{planet}</li>
                  ))}
                </ul>
              </div>

              {pattern.element && (
                <div className="pattern-element">
                  <h5>Element</h5>
                  <p>{pattern.element}</p>
                </div>
              )}

              {pattern.description && (
                <div className="pattern-description">
                  <h5>Description</h5>
                  <p>{pattern.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSynthesis = () => (
    <div className="analysis-synthesis">
      <h3>Holistic Synthesis</h3>

      <div className="synthesis-section">
        <h4>Personality Profile</h4>
        <div className="personality-grid">
          <div className="personality-item">
            <h5>Core Identity</h5>
            <p>{analysis.synthesis.personalityProfile.coreIdentity}</p>
          </div>
          <div className="personality-item">
            <h5>Emotional Nature</h5>
            <p>{analysis.synthesis.personalityProfile.emotionalNature}</p>
          </div>
          <div className="personality-item">
            <h5>Mental Processes</h5>
            <p>{analysis.synthesis.personalityProfile.mentalProcesses}</p>
          </div>
          <div className="personality-item">
            <h5>Social Style</h5>
            <p>{analysis.synthesis.personalityProfile.socialStyle}</p>
          </div>
          <div className="personality-item">
            <h5>Life Approach</h5>
            <p>{analysis.synthesis.personalityProfile.lifeApproach}</p>
          </div>
        </div>
      </div>

      <div className="synthesis-section">
        <h4>Life Path</h4>
        <div className="life-path-grid">
          <div className="life-path-item">
            <h5>Purpose</h5>
            <p>{analysis.synthesis.lifePurpose}</p>
          </div>
          <div className="life-path-item">
            <h5>Challenges</h5>
            <p>{analysis.synthesis.challenges}</p>
          </div>
          <div className="life-path-item">
            <h5>Potentials</h5>
            <p>{analysis.synthesis.potentials}</p>
          </div>
          <div className="life-path-item">
            <h5>Life Path</h5>
            <p>{analysis.synthesis.lifePath}</p>
          </div>
        </div>
      </div>

      <div className="synthesis-section">
        <h4>Key Areas</h4>
        <div className="key-areas-grid">
          <div className="key-area-item">
            <h5>Relationships</h5>
            <p>{analysis.synthesis.relationships}</p>
          </div>
          <div className="key-area-item">
            <h5>Career</h5>
            <p>{analysis.synthesis.career}</p>
          </div>
          <div className="key-area-item">
            <h5>Spirituality</h5>
            <p>{analysis.synthesis.spirituality}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="western-birth-chart-analysis-display">
      <nav className="analysis-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'planets' ? 'active' : ''}
          onClick={() => setActiveTab('planets')}
        >
          Planets
        </button>
        <button
          className={activeTab === 'houses' ? 'active' : ''}
          onClick={() => setActiveTab('houses')}
        >
          Houses
        </button>
        <button
          className={activeTab === 'aspects' ? 'active' : ''}
          onClick={() => setActiveTab('aspects')}
        >
          Aspects
        </button>
        <button
          className={activeTab === 'patterns' ? 'active' : ''}
          onClick={() => setActiveTab('patterns')}
        >
          Patterns
        </button>
        <button
          className={activeTab === 'synthesis' ? 'active' : ''}
          onClick={() => setActiveTab('synthesis')}
        >
          Synthesis
        </button>
      </nav>

      <main className="analysis-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'planets' && renderPlanets()}
        {activeTab === 'houses' && renderHouses()}
        {activeTab === 'aspects' && renderAspects()}
        {activeTab === 'patterns' && renderPatterns()}
        {activeTab === 'synthesis' && renderSynthesis()}
      </main>
    </div>
  );
};

export default WesternBirthChartAnalysisDisplay;