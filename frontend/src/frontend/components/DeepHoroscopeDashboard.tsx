import React, { useState } from 'react';
import { BirthData, DeepHoroscopeInterpretation } from '../types/astrology';
import { astrologyApi } from '../services/api';
import DeepHoroscopeInput from './DeepHoroscopeInput';
import PlanetaryAnalysisDisplay from './PlanetaryAnalysisDisplay';
import LifeAreasDisplay from './LifeAreasDisplay';
import YogasDisplay from './YogasDisplay';
import PredictionsDisplay from './PredictionsDisplay';
import CurrentPeriodDisplay from './CurrentPeriodDisplay';
import RemediesDisplay from './RemediesDisplay';
import OverallAssessmentDisplay from './OverallAssessmentDisplay';
import './DeepHoroscopeDashboard.css';

/**
 * Deep Horoscope Dashboard Component
 * Main component that handles deep horoscope interpretation workflow
 * Displays comprehensive Vedic astrology analysis with multiple sections
 */
const DeepHoroscopeDashboard: React.FC = () => {
  const [interpretation, setInterpretation] = useState<DeepHoroscopeInterpretation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'planetary' | 'life-areas' | 'yogas' | 'predictions' | 'remedies'>('overview');

  /**
   * Handle deep horoscope generation
   */
  const handleGenerateInterpretation = async (birthData: BirthData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await astrologyApi.generateDeepHoroscope(birthData);
      setInterpretation(result);
      setActiveTab('overview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate deep horoscope interpretation');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="deep-horoscope-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Generating Deep Horoscope Interpretation</h3>
          <p>This may take a few moments as we analyze your birth chart comprehensively...</p>
        </div>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className="deep-horoscope-dashboard">
        <div className="error-container">
          <h3>Error Generating Interpretation</h3>
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /**
   * Render input form if no interpretation yet
   */
  if (!interpretation) {
    return (
      <div className="deep-horoscope-dashboard">
        <div className="dashboard-header">
          <h1>Deep Horoscope Interpretation</h1>
          <p>Comprehensive Vedic astrology analysis covering all aspects of life</p>
        </div>
        <DeepHoroscopeInput onSubmit={handleGenerateInterpretation} />
      </div>
    );
  }

  /**
   * Render interpretation results
   */
  return (
    <div className="deep-horoscope-dashboard">
      <div className="dashboard-header">
        <h1>Deep Horoscope Interpretation</h1>
        <div className="interpretation-meta">
          <span className="version">Version: {interpretation.version}</span>
          <span className="confidence">Confidence: {Math.round(interpretation.confidence * 100)}%</span>
          <span className="generated">Generated: {new Date(interpretation.generatedAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'planetary' ? 'active' : ''}`}
          onClick={() => setActiveTab('planetary')}
        >
          Planetary Analysis
        </button>
        <button
          className={`tab-button ${activeTab === 'life-areas' ? 'active' : ''}`}
          onClick={() => setActiveTab('life-areas')}
        >
          Life Areas
        </button>
        <button
          className={`tab-button ${activeTab === 'yogas' ? 'active' : ''}`}
          onClick={() => setActiveTab('yogas')}
        >
          Yogas & Combinations
        </button>
        <button
          className={`tab-button ${activeTab === 'predictions' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictions')}
        >
          Predictions
        </button>
        <button
          className={`tab-button ${activeTab === 'remedies' ? 'active' : ''}`}
          onClick={() => setActiveTab('remedies')}
        >
          Remedies
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="basic-info-card">
              <h3>Basic Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Name:</label>
                  <span>{interpretation.basicInfo.name}</span>
                </div>
                <div className="info-item">
                  <label>Birth Details:</label>
                  <span>{interpretation.basicInfo.birthDetails}</span>
                </div>
                <div className="info-item">
                  <label>Ascendant:</label>
                  <span>{interpretation.basicInfo.chartInfo.ascendant.sign}° {interpretation.basicInfo.chartInfo.ascendant.lord}</span>
                </div>
                <div className="info-item">
                  <label>Moon Sign:</label>
                  <span>{interpretation.basicInfo.chartInfo.moonSign.sign} ({interpretation.basicInfo.chartInfo.moonSign.lord})</span>
                </div>
                <div className="info-item">
                  <label>Dominant Planets:</label>
                  <span>{interpretation.basicInfo.chartInfo.dominantPlanets.join(', ')}</span>
                </div>
                <div className="info-item">
                  <label>Chart Strength:</label>
                  <span>{Math.round(interpretation.basicInfo.chartInfo.chartStrength * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="assessment-card">
              <h3>Overall Assessment</h3>
              <div className="assessment-content">
                <div className="strength-indicator">
                  <label>Overall Strength:</label>
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{ width: `${interpretation.overallAssessment.strength * 100}%` }}
                    ></div>
                  </div>
                  <span>{Math.round(interpretation.overallAssessment.strength * 100)}%</span>
                </div>
                <p className="assessment-summary">{interpretation.overallAssessment.summary}</p>
                <div className="key-themes">
                  <h4>Key Themes:</h4>
                  <ul>
                    {interpretation.overallAssessment.keyThemes.map((theme, index) => (
                      <li key={index}>{theme}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="recommendations-card">
              <h3>Key Recommendations</h3>
              <ul className="recommendations-list">
                {interpretation.recommendations.map((rec, index) => (
                  <li key={index} className={`recommendation-${rec.priority.toLowerCase()}`}>
                    <strong>{rec.type}:</strong> {rec.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'planetary' && (
          <PlanetaryAnalysisDisplay planetaryAnalysis={interpretation.planetaryAnalysis} />
        )}

        {activeTab === 'life-areas' && (
          <LifeAreasDisplay lifeAreas={interpretation.lifeAreas} />
        )}

        {activeTab === 'yogas' && (
          <YogasDisplay yogas={interpretation.yogas} />
        )}

        {activeTab === 'predictions' && (
          <PredictionsDisplay predictions={interpretation.predictions} />
        )}

        {activeTab === 'remedies' && (
          <RemediesDisplay remedies={interpretation.remedies} />
        )}
      </div>

      <div className="dashboard-footer">
        <p>
          <strong>Disclaimer:</strong> This interpretation is for guidance purposes only.
          Consult with qualified astrologers for important life decisions.
          Predictions are probabilistic and based on traditional Vedic astrology principles.
        </p>
      </div>
    </div>
  );
};

export default DeepHoroscopeDashboard;