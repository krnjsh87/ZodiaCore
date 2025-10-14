/**
 * ZodiaCore - Western Deep Horoscope Dashboard
 *
 * Dashboard component for generating and displaying comprehensive Western astrology deep horoscope interpretations.
 * Provides interface for birth data input and deep horoscope analysis display.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

import React, { useState } from 'react';
import { BirthData, DeepHoroscopeInterpretation } from '../types/astrology';
import { astrologyApi } from '../services/api';
import WesternDeepHoroscopeView from './WesternDeepHoroscopeView';
import './WesternDeepHoroscopeDashboard.css';

interface WesternDeepHoroscopeDashboardProps {
  className?: string;
}

/**
 * Western Deep Horoscope Dashboard Component
 * Main interface for Western deep horoscope generation and display
 */
const WesternDeepHoroscopeDashboard: React.FC<WesternDeepHoroscopeDashboardProps> = ({
  className = ''
}) => {
  const [birthData, setBirthData] = useState<BirthData>({
    year: 1990,
    month: 1,
    day: 15,
    hour: 12,
    minute: 0,
    second: 0,
    latitude: 40.7128,
    longitude: -74.0060
  });

  const [interpretation, setInterpretation] = useState<DeepHoroscopeInterpretation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle input changes
   */
  const handleInputChange = (field: keyof BirthData, value: number) => {
    setBirthData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Generate deep horoscope interpretation
   */
  const generateDeepHoroscope = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await astrologyApi.generateDeepHoroscope(birthData);
      setInterpretation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate deep horoscope');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validate birth data
   */
  const isValidBirthData = () => {
    const { year, month, day, hour, minute, latitude, longitude } = birthData;
    return year >= 1900 && year <= new Date().getFullYear() &&
           month >= 1 && month <= 12 &&
           day >= 1 && day <= 31 &&
           hour >= 0 && hour <= 23 &&
           minute >= 0 && minute <= 59 &&
           latitude >= -90 && latitude <= 90 &&
           longitude >= -180 && longitude <= 180;
  };

  return (
    <div className={`western-deep-horoscope-dashboard ${className}`}>
      <div className="western-deep-horoscope-dashboard__header">
        <h1 className="western-deep-horoscope-dashboard__title">
          ⚡ Western Deep Horoscope Analysis
        </h1>
        <p className="western-deep-horoscope-dashboard__subtitle">
          Comprehensive Western astrology interpretation covering all life areas, planetary influences, and predictive insights
        </p>
      </div>

      <div className="western-deep-horoscope-dashboard__input-section">
        <div className="input-form">
          <h2 className="input-form__title">Birth Information</h2>

          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="year" className="input-label">Year</label>
              <input
                id="year"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={birthData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label htmlFor="month" className="input-label">Month</label>
              <select
                id="month"
                value={birthData.month}
                onChange={(e) => handleInputChange('month', parseInt(e.target.value))}
                className="input-field"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="day" className="input-label">Day</label>
              <input
                id="day"
                type="number"
                min="1"
                max="31"
                value={birthData.day}
                onChange={(e) => handleInputChange('day', parseInt(e.target.value))}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label htmlFor="hour" className="input-label">Hour</label>
              <input
                id="hour"
                type="number"
                min="0"
                max="23"
                value={birthData.hour}
                onChange={(e) => handleInputChange('hour', parseInt(e.target.value))}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label htmlFor="minute" className="input-label">Minute</label>
              <input
                id="minute"
                type="number"
                min="0"
                max="59"
                value={birthData.minute}
                onChange={(e) => handleInputChange('minute', parseInt(e.target.value))}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label htmlFor="latitude" className="input-label">Latitude</label>
              <input
                id="latitude"
                type="number"
                step="0.0001"
                min="-90"
                max="90"
                value={birthData.latitude}
                onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label htmlFor="longitude" className="input-label">Longitude</label>
              <input
                id="longitude"
                type="number"
                step="0.0001"
                min="-180"
                max="180"
                value={birthData.longitude}
                onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                className="input-field"
              />
            </div>
          </div>

          <div className="input-actions">
            <button
              onClick={generateDeepHoroscope}
              disabled={!isValidBirthData() || loading}
              className="generate-button"
            >
              {loading ? '🔮 Generating...' : '⚡ Generate Deep Horoscope'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="western-deep-horoscope-dashboard__error" role="alert">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="western-deep-horoscope-dashboard__content">
        {loading && (
          <div className="western-deep-horoscope-dashboard__loading" aria-live="polite">
            <div className="loading-spinner"></div>
            <p>Analyzing your birth chart and generating comprehensive interpretation...</p>
            <p className="loading-note">This may take a few moments as we calculate planetary positions, aspects, and life predictions.</p>
          </div>
        )}

        {!loading && interpretation && (
          <WesternDeepHoroscopeView interpretation={interpretation} />
        )}

        {!loading && !interpretation && !error && (
          <div className="western-deep-horoscope-dashboard__placeholder">
            <div className="placeholder-content">
              <div className="placeholder-icon">🔮</div>
              <h3>Western Deep Horoscope Analysis</h3>
              <p>
                Enter your birth information above to receive a comprehensive Western astrology interpretation
                covering planetary strengths, life area analysis, predictive insights, and remedial recommendations.
              </p>
              <div className="placeholder-features">
                <div className="feature-item">
                  <span className="feature-icon">🪐</span>
                  <span>Complete Planetary Analysis</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏠</span>
                  <span>12 Life Areas Assessment</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔮</span>
                  <span>Life Predictions & Timing</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💫</span>
                  <span>Remedial Recommendations</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WesternDeepHoroscopeDashboard;