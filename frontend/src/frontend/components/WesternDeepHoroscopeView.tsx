/**
 * ZodiaCore - Western Deep Horoscope View Component
 *
 * Comprehensive view for Western deep horoscope interpretations showing complete
 * astrological analysis including planetary strengths, life areas, predictions,
 * and remedial recommendations based on Western astrology principles.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

import React, { useState } from 'react';
import { DeepHoroscopeInterpretation } from '../types/astrology';
import './WesternDeepHoroscopeView.css';

interface WesternDeepHoroscopeViewProps {
  interpretation: DeepHoroscopeInterpretation;
}

/**
 * Western Deep Horoscope View Component
 * Displays comprehensive Western astrology interpretation with all analysis layers
 */
const WesternDeepHoroscopeView: React.FC<WesternDeepHoroscopeViewProps> = ({
  interpretation
}) => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  /**
   * Render header with basic information
   */
  const renderHeader = () => {
    const { basicInfo } = interpretation;

    return (
      <header className="western-deep-horoscope-header">
        <div className="western-deep-horoscope-header__main">
          <h1 className="western-deep-horoscope-header__title">
            Western Deep Horoscope Analysis
          </h1>
          <div className="western-deep-horoscope-header__meta">
            <span className="western-deep-horoscope-header__version">
              Version {interpretation.version}
            </span>
            <span className="western-deep-horoscope-header__confidence">
              Confidence: {Math.round(interpretation.confidence * 100)}%
            </span>
            <span className="western-deep-horoscope-header__date">
              Generated: {new Date(interpretation.generatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="western-deep-horoscope-header__chart-info">
          <div className="chart-info-item">
            <span className="chart-info-label">Sun Sign:</span>
            <span className="chart-info-value">{basicInfo.chartInfo.sunSign || 'N/A'}</span>
          </div>
          <div className="chart-info-item">
            <span className="chart-info-label">Moon Sign:</span>
            <span className="chart-info-value">{basicInfo.chartInfo.moonSign || 'N/A'}</span>
          </div>
          <div className="chart-info-item">
            <span className="chart-info-label">Rising Sign:</span>
            <span className="chart-info-value">{basicInfo.chartInfo.ascendant?.sign || 'N/A'}</span>
          </div>
        </div>
      </header>
    );
  };

  /**
   * Render navigation tabs
   */
  const renderNavigation = () => {
    const sections = [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'planetary', label: 'Planets', icon: '🪐' },
      { id: 'life-areas', label: 'Life Areas', icon: '🏠' },
      { id: 'predictions', label: 'Predictions', icon: '🔮' },
      { id: 'current-period', label: 'Current Period', icon: '📅' },
      { id: 'remedies', label: 'Remedies', icon: '💫' },
      { id: 'assessment', label: 'Assessment', icon: '📋' }
    ];

    return (
      <nav className="western-deep-horoscope-nav">
        <div className="western-deep-horoscope-nav__tabs">
          {sections.map(section => (
            <button
              key={section.id}
              className={`western-deep-horoscope-nav__tab ${
                activeSection === section.id ? 'active' : ''
              }`}
              onClick={() => setActiveSection(section.id)}
              aria-pressed={activeSection === section.id}
            >
              <span className="nav-tab-icon">{section.icon}</span>
              <span className="nav-tab-label">{section.label}</span>
            </button>
          ))}
        </div>
      </nav>
    );
  };

  /**
   * Render overview section
   */
  const renderOverview = () => {
    const { overallAssessment, basicInfo } = interpretation;

    return (
      <section className="western-deep-horoscope-section western-deep-horoscope-section--overview">
        <h2 className="western-deep-horoscope-section__title">Chart Overview</h2>

        <div className="overview-grid">
          <div className="overview-card overview-card--dominant">
            <h3 className="overview-card__title">Dominant Planets</h3>
            <div className="dominant-planets">
              {basicInfo.chartInfo.dominantPlanets?.map(planet => (
                <span key={planet} className="dominant-planet">{planet}</span>
              )) || <span className="no-data">Analysis pending</span>}
            </div>
          </div>

          <div className="overview-card overview-card--strength">
            <h3 className="overview-card__title">Chart Strength</h3>
            <div className="chart-strength">
              <div className="strength-bar">
                <div
                  className="strength-bar__fill"
                  style={{ width: `${(basicInfo.chartInfo.chartStrength || 0) * 100}%` }}
                ></div>
              </div>
              <span className="strength-value">
                {Math.round((basicInfo.chartInfo.chartStrength || 0) * 100)}%
              </span>
            </div>
          </div>

          <div className="overview-card overview-card--assessment">
            <h3 className="overview-card__title">Overall Assessment</h3>
            <p className="assessment-summary">{overallAssessment.summary}</p>
            <div className="assessment-key-themes">
              <h4>Key Themes:</h4>
              <ul>
                {overallAssessment.keyThemes?.map((theme, index) => (
                  <li key={index}>{theme}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  };

  /**
   * Render planetary analysis section
   */
  const renderPlanetaryAnalysis = () => {
    const { planetaryAnalysis } = interpretation;

    return (
      <section className="western-deep-horoscope-section western-deep-horoscope-section--planetary">
        <h2 className="western-deep-horoscope-section__title">Planetary Analysis</h2>

        <div className="planetary-grid">
          {Object.entries(planetaryAnalysis).map(([planet, analysis]) => (
            <div key={planet} className="planetary-card">
              <div className="planetary-card__header">
                <h3 className="planetary-card__name">{planet}</h3>
                <span className={`planetary-card__strength strength-${analysis.strength?.toLowerCase() || 'unknown'}`}>
                  {analysis.strength || 'Unknown'}
                </span>
              </div>

              <div className="planetary-card__details">
                <div className="planetary-strength-breakdown">
                  <h4>Strength Components:</h4>
                  <div className="strength-components">
                    {Object.entries(analysis.components || {}).map(([component, value]) => (
                      <div key={component} className="strength-component">
                        <span className="component-label">{component}:</span>
                        <span className="component-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="planetary-interpretation">
                  <p>{analysis.interpretation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /**
   * Render life areas section
   */
  const renderLifeAreas = () => {
    const { lifeAreas } = interpretation;

    const houseNames = {
      1: 'Self & Personality',
      2: 'Wealth & Possessions',
      3: 'Communication & Siblings',
      4: 'Home & Family',
      5: 'Creativity & Children',
      6: 'Health & Service',
      7: 'Partnerships & Marriage',
      8: 'Transformation & Secrets',
      9: 'Higher Learning & Travel',
      10: 'Career & Reputation',
      11: 'Friends & Hopes',
      12: 'Spirituality & Sacrifice'
    };

    return (
      <section className="western-deep-horoscope-section western-deep-horoscope-section--life-areas">
        <h2 className="western-deep-horoscope-section__title">Life Areas Analysis</h2>

        <div className="life-areas-grid">
          {Object.entries(lifeAreas).map(([houseNum, area]) => (
            <div key={houseNum} className="life-area-card">
              <div className="life-area-card__header">
                <h3 className="life-area-card__title">
                  House {houseNum}: {houseNames[parseInt(houseNum)]}
                </h3>
                <div className="life-area-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-bar__fill"
                      style={{ width: `${area.overallStrength * 100}%` }}
                    ></div>
                  </div>
                  <span className="strength-value">
                    {Math.round(area.overallStrength * 100)}%
                  </span>
                </div>
              </div>

              <div className="life-area-card__content">
                <div className="life-area-ruler">
                  <span className="ruler-label">Ruler:</span>
                  <span className="ruler-value">{area.ruler}</span>
                  <span className="ruler-strength">
                    (Strength: {Math.round(area.rulerStrength * 100)}%)
                  </span>
                </div>

                {area.planets && area.planets.length > 0 && (
                  <div className="life-area-planets">
                    <span className="planets-label">Planets:</span>
                    <div className="planets-list">
                      {area.planets.map(planet => (
                        <span key={planet} className="planet-tag">{planet}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="life-area-predictions">
                  <h4>Key Predictions:</h4>
                  <p>{area.predictions?.general || 'Analysis in progress'}</p>
                </div>

                {area.challenges && area.challenges.length > 0 && (
                  <div className="life-area-challenges">
                    <h4>Challenges:</h4>
                    <ul>
                      {area.challenges.map((challenge, index) => (
                        <li key={index}>{challenge}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /**
   * Render predictions section
   */
  const renderPredictions = () => {
    const { predictions } = interpretation;

    return (
      <section className="western-deep-horoscope-section western-deep-horoscope-section--predictions">
        <h2 className="western-deep-horoscope-section__title">Life Predictions</h2>

        <div className="predictions-grid">
          <div className="prediction-card prediction-card--career">
            <h3 className="prediction-card__title">Career & Success</h3>
            <div className="prediction-content">
              <p className="prediction-summary">{predictions.careerPredictions.overall}</p>
              <div className="prediction-details">
                <h4>Suitable Careers:</h4>
                <ul>
                  {predictions.careerPredictions.suitableCareers?.map((career, index) => (
                    <li key={index}>{career}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="prediction-card prediction-card--relationships">
            <h3 className="prediction-card__title">Relationships & Marriage</h3>
            <div className="prediction-content">
              <p className="prediction-summary">{predictions.relationshipPredictions.overall}</p>
              {predictions.relationshipPredictions.marriage && (
                <div className="marriage-timing">
                  <h4>Marriage Timing:</h4>
                  <p>{predictions.relationshipPredictions.marriage.timing}</p>
                  <span className="confidence">
                    Confidence: {Math.round(predictions.relationshipPredictions.marriage.confidence * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="prediction-card prediction-card--health">
            <h3 className="prediction-card__title">Health & Well-being</h3>
            <div className="prediction-content">
              <p className="prediction-summary">{predictions.healthPredictions.generalHealth}</p>
              <div className="health-concerns">
                <h4>Potential Health Focus Areas:</h4>
                <ul>
                  {predictions.healthPredictions.potentialIssues?.map((issue, index) => (
                    <li key={index}>{issue.condition} ({issue.likelihood})</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="prediction-card prediction-card--finance">
            <h3 className="prediction-card__title">Finance & Wealth</h3>
            <div className="prediction-content">
              <p className="prediction-summary">{predictions.financialPredictions.overall}</p>
            </div>
          </div>

          <div className="prediction-card prediction-card--spiritual">
            <h3 className="prediction-card__title">Spiritual Development</h3>
            <div className="prediction-content">
              <p className="prediction-summary">{predictions.spiritualPredictions.development}</p>
              <div className="spiritual-practices">
                <h4>Recommended Practices:</h4>
                <ul>
                  {predictions.spiritualPredictions.practices?.map((practice, index) => (
                    <li key={index}>{practice}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  /**
   * Render current period section
   */
  const renderCurrentPeriod = () => {
    const { currentPeriod } = interpretation;

    return (
      <section className="western-deep-horoscope-section western-deep-horoscope-section--current-period">
        <h2 className="western-deep-horoscope-section__title">Current Period Analysis</h2>

        <div className="current-period-content">
          <div className="current-dasha">
            <h3 className="current-dasha__title">Current Planetary Periods</h3>
            <div className="dasha-info">
              <div className="dasha-item">
                <span className="dasha-label">Mahadasha:</span>
                <span className="dasha-value">{currentPeriod.dasha.mahadasha.planet}</span>
                <span className="dasha-progress">
                  ({Math.round(currentPeriod.dasha.mahadasha.progress * 100)}% complete)
                </span>
              </div>
              {currentPeriod.dasha.antardasha && (
                <div className="dasha-item">
                  <span className="dasha-label">Antardasha:</span>
                  <span className="dasha-value">{currentPeriod.dasha.antardasha.planet}</span>
                  <span className="dasha-progress">
                    ({Math.round(currentPeriod.dasha.antardasha.progress * 100)}% complete)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="current-influences">
            <h3>Current Influences</h3>
            <div className="influence-effects">
              <div className="influence-positive">
                <h4>Positive Effects:</h4>
                <p>{currentPeriod.dasha.combinedEffect.positive}</p>
              </div>
              <div className="influence-negative">
                <h4>Challenges:</h4>
                <p>{currentPeriod.dasha.combinedEffect.negative}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  /**
   * Render remedies section
   */
  const renderRemedies = () => {
    const { remedies } = interpretation;

    return (
      <section className="western-deep-horoscope-section western-deep-horoscope-section--remedies">
        <h2 className="western-deep-horoscope-section__title">Remedial Recommendations</h2>

        <div className="remedies-content">
          <div className="remedies-priority">
            <h3>Priority Levels</h3>
            <div className="priority-levels">
              <div className="priority-level priority-critical">
                <h4>Critical Actions:</h4>
                <ul>
                  {remedies.priority.critical?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="priority-level priority-important">
                <h4>Important Actions:</h4>
                <ul>
                  {remedies.priority.important?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="priority-level priority-beneficial">
                <h4>Beneficial Practices:</h4>
                <ul>
                  {remedies.priority.beneficial?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="remedies-gemstones">
            <h3>Gemstone Recommendations</h3>
            <div className="gemstones-grid">
              {remedies.gemstones?.map((gemstone, index) => (
                <div key={index} className="gemstone-item">
                  <h4>{gemstone.planet} - {gemstone.stone}</h4>
                  <p><strong>Purpose:</strong> {gemstone.purpose}</p>
                  <p><strong>Wearing:</strong> {gemstone.wearingInstructions}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="remedies-mantras">
            <h3>Mantra Recommendations</h3>
            <div className="mantras-list">
              {remedies.mantras?.map((mantra, index) => (
                <div key={index} className="mantra-item">
                  <h4>{mantra.planet} Mantra</h4>
                  <p className="mantra-text">{mantra.mantra}</p>
                  <p><strong>Repetitions:</strong> {mantra.repetitions}</p>
                  <p><strong>Benefits:</strong> {mantra.benefits}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  /**
   * Render overall assessment section
   */
  const renderAssessment = () => {
    const { overallAssessment, recommendations } = interpretation;

    return (
      <section className="western-deep-horoscope-section western-deep-horoscope-section--assessment">
        <h2 className="western-deep-horoscope-section__title">Overall Assessment & Recommendations</h2>

        <div className="assessment-content">
          <div className="overall-strength">
            <h3>Chart Strength: {Math.round(overallAssessment.strength * 100)}%</h3>
            <div className="strength-bar">
              <div
                className="strength-bar__fill"
                style={{ width: `${overallAssessment.strength * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="life-purpose">
            <h3>Life Purpose & Direction</h3>
            <p>{overallAssessment.lifePurpose}</p>
          </div>

          <div className="key-influences">
            <h3>Dominant Influences</h3>
            <ul>
              {overallAssessment.dominantInfluences?.map((influence, index) => (
                <li key={index}>{influence}</li>
              ))}
            </ul>
          </div>

          <div className="karmic-lessons">
            <h3>Karmic Lessons & Growth Areas</h3>
            <ul>
              {overallAssessment.karmicLessons?.map((lesson, index) => (
                <li key={index}>{lesson}</li>
              ))}
            </ul>
          </div>

          <div className="final-recommendations">
            <h3>Key Recommendations</h3>
            <div className="recommendations-list">
              {recommendations?.map((rec, index) => (
                <div key={index} className={`recommendation-item priority-${rec.priority?.toLowerCase()}`}>
                  <h4>{rec.type} ({rec.priority})</h4>
                  <p>{rec.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  /**
   * Render main content based on active section
   */
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'planetary':
        return renderPlanetaryAnalysis();
      case 'life-areas':
        return renderLifeAreas();
      case 'predictions':
        return renderPredictions();
      case 'current-period':
        return renderCurrentPeriod();
      case 'remedies':
        return renderRemedies();
      case 'assessment':
        return renderAssessment();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="western-deep-horoscope-view">
      {renderHeader()}
      {renderNavigation()}
      <main className="western-deep-horoscope-content">
        {renderContent()}
      </main>

      <footer className="western-deep-horoscope-footer">
        <div className="western-deep-horoscope-footer__disclaimer">
          <p>
            <strong>Disclaimer:</strong> This Western astrological analysis is for informational purposes only.
            It should not be considered as professional advice for health, financial, or legal matters.
            Always consult with qualified professionals for important decisions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WesternDeepHoroscopeView;