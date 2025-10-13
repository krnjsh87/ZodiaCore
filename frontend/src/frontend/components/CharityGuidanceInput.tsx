import React, { useState } from 'react';
import { BirthData } from '../types/astrology';
import './CharityGuidanceInput.css';

interface CharityGuidanceInputProps {
  onSubmit: (birthData: BirthData) => void;
  loading?: boolean;
  error?: string;
}

/**
 * Charity Guidance Input Form Component
 * Allows users to enter birth data for personalized charity guidance
 */
const CharityGuidanceInput: React.FC<CharityGuidanceInputProps> = ({
  onSubmit,
  loading = false,
  error
}) => {
  const [formData, setFormData] = useState<BirthData>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: 12,
    minute: 0,
    second: 0,
    latitude: 28.6139, // Default to Delhi
    longitude: 77.2090,
    timezone: 5.5 // IST
  });

  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof BirthData, string>>>({});

  /**
   * Handle input changes
   */
  const handleInputChange = (field: keyof BirthData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof BirthData, string>> = {};

    // Year validation
    if (formData.year < 1800 || formData.year > 2100) {
      errors.year = 'Year must be between 1800 and 2100';
    }

    // Month validation
    if (formData.month < 1 || formData.month > 12) {
      errors.month = 'Month must be between 1 and 12';
    }

    // Day validation
    if (formData.day < 1 || formData.day > 31) {
      errors.day = 'Day must be between 1 and 31';
    }

    // Additional day validation based on month
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let maxDays = daysInMonth[formData.month - 1];

    // Check for leap year (February)
    if (formData.month === 2 && ((formData.year % 4 === 0 && formData.year % 100 !== 0) || formData.year % 400 === 0)) {
      maxDays = 29;
    }

    if (formData.day > maxDays) {
      errors.day = `Day must be between 1 and ${maxDays} for the selected month`;
    }

    // Hour validation
    if (formData.hour < 0 || formData.hour > 23) {
      errors.hour = 'Hour must be between 0 and 23';
    }

    // Minute validation
    if (formData.minute < 0 || formData.minute > 59) {
      errors.minute = 'Minute must be between 0 and 59';
    }

    // Second validation
    if (formData.second < 0 || formData.second > 59) {
      errors.second = 'Second must be between 0 and 59';
    }

    // Latitude validation
    if (formData.latitude < -90 || formData.latitude > 90) {
      errors.latitude = 'Latitude must be between -90 and 90 degrees';
    }

    // Longitude validation
    if (formData.longitude < -180 || formData.longitude > 180) {
      errors.longitude = 'Longitude must be between -180 and 180 degrees';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  /**
   * Get day options based on selected month and year
   */
  const getDayOptions = () => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let maxDays = daysInMonth[formData.month - 1];

    // Check for leap year
    if (formData.month === 2 && ((formData.year % 4 === 0 && formData.year % 100 !== 0) || formData.year % 400 === 0)) {
      maxDays = 29;
    }

    return Array.from({ length: maxDays }, (_, i) => i + 1);
  };

  return (
    <div className="charity-guidance-input">
      <div className="input-header">
        <h2>Enter Your Birth Details for Charity Guidance</h2>
        <p>Provide accurate birth information for personalized Vedic charity recommendations based on your planetary positions</p>
      </div>

      {error && (
        <div className="input-error" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="charity-data-form">
        {/* Date Section */}
        <fieldset className="form-section">
          <legend>Birth Date</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="charity-year">Year</label>
              <input
                type="number"
                id="charity-year"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value) || 0)}
                min="1800"
                max="2100"
                required
                aria-describedby={validationErrors.year ? "charity-year-error" : undefined}
                className={validationErrors.year ? 'error' : ''}
              />
              {validationErrors.year && (
                <span id="charity-year-error" className="field-error" role="alert">
                  {validationErrors.year}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="charity-month">Month</label>
              <select
                id="charity-month"
                value={formData.month}
                onChange={(e) => handleInputChange('month', parseInt(e.target.value))}
                required
                aria-describedby={validationErrors.month ? "charity-month-error" : undefined}
                className={validationErrors.month ? 'error' : ''}
              >
                <option value="">Select Month</option>
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((month, index) => (
                  <option key={index + 1} value={index + 1}>{month}</option>
                ))}
              </select>
              {validationErrors.month && (
                <span id="charity-month-error" className="field-error" role="alert">
                  {validationErrors.month}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="charity-day">Day</label>
              <select
                id="charity-day"
                value={formData.day}
                onChange={(e) => handleInputChange('day', parseInt(e.target.value))}
                required
                aria-describedby={validationErrors.day ? "charity-day-error" : undefined}
                className={validationErrors.day ? 'error' : ''}
              >
                <option value="">Select Day</option>
                {getDayOptions().map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              {validationErrors.day && (
                <span id="charity-day-error" className="field-error" role="alert">
                  {validationErrors.day}
                </span>
              )}
            </div>
          </div>
        </fieldset>

        {/* Time Section */}
        <fieldset className="form-section">
          <legend>Birth Time</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="charity-hour">Hour (24h)</label>
              <input
                type="number"
                id="charity-hour"
                value={formData.hour}
                onChange={(e) => handleInputChange('hour', parseInt(e.target.value) || 0)}
                min="0"
                max="23"
                required
                aria-describedby={validationErrors.hour ? "charity-hour-error" : undefined}
                className={validationErrors.hour ? 'error' : ''}
              />
              {validationErrors.hour && (
                <span id="charity-hour-error" className="field-error" role="alert">
                  {validationErrors.hour}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="charity-minute">Minute</label>
              <input
                type="number"
                id="charity-minute"
                value={formData.minute}
                onChange={(e) => handleInputChange('minute', parseInt(e.target.value) || 0)}
                min="0"
                max="59"
                required
                aria-describedby={validationErrors.minute ? "charity-minute-error" : undefined}
                className={validationErrors.minute ? 'error' : ''}
              />
              {validationErrors.minute && (
                <span id="charity-minute-error" className="field-error" role="alert">
                  {validationErrors.minute}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="charity-second">Second</label>
              <input
                type="number"
                id="charity-second"
                value={formData.second}
                onChange={(e) => handleInputChange('second', parseInt(e.target.value) || 0)}
                min="0"
                max="59"
                aria-describedby={validationErrors.second ? "charity-second-error" : undefined}
                className={validationErrors.second ? 'error' : ''}
              />
              {validationErrors.second && (
                <span id="charity-second-error" className="field-error" role="alert">
                  {validationErrors.second}
                </span>
              )}
            </div>
          </div>
        </fieldset>

        {/* Location Section */}
        <fieldset className="form-section">
          <legend>Birth Location</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="charity-latitude">Latitude</label>
              <input
                type="number"
                id="charity-latitude"
                value={formData.latitude}
                onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value) || 0)}
                step="0.0001"
                min="-90"
                max="90"
                required
                aria-describedby={validationErrors.latitude ? "charity-latitude-error" : undefined}
                className={validationErrors.latitude ? 'error' : ''}
              />
              <small className="field-help">Degrees North/South (-90 to 90)</small>
              {validationErrors.latitude && (
                <span id="charity-latitude-error" className="field-error" role="alert">
                  {validationErrors.latitude}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="charity-longitude">Longitude</label>
              <input
                type="number"
                id="charity-longitude"
                value={formData.longitude}
                onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value) || 0)}
                step="0.0001"
                min="-180"
                max="180"
                required
                aria-describedby={validationErrors.longitude ? "charity-longitude-error" : undefined}
                className={validationErrors.longitude ? 'error' : ''}
              />
              <small className="field-help">Degrees East/West (-180 to 180)</small>
              {validationErrors.longitude && (
                <span id="charity-longitude-error" className="field-error" role="alert">
                  {validationErrors.longitude}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="charity-timezone">Timezone Offset</label>
              <input
                type="number"
                id="charity-timezone"
                value={formData.timezone || 0}
                onChange={(e) => handleInputChange('timezone', parseFloat(e.target.value) || 0)}
                step="0.5"
                min="-12"
                max="14"
                aria-describedby="charity-timezone-help"
              />
              <small id="charity-timezone-help" className="field-help">Hours from UTC (e.g., 5.5 for IST)</small>
            </div>
          </div>
        </fieldset>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            className="generate-charity-button"
            disabled={loading}
            aria-describedby="charity-generate-button-help"
          >
            {loading ? 'Generating Charity Guidance...' : 'Get Charity Guidance'}
          </button>
          <small id="charity-generate-button-help" className="button-help">
            This will analyze your birth chart and provide personalized charity recommendations based on Vedic astrology principles
          </small>
        </div>
      </form>

      {/* Charity Information */}
      <div className="charity-info">
        <h3>About Vedic Charity Guidance</h3>
        <div className="charity-benefits">
          <h4>Benefits of Charitable Giving (Dana)</h4>
          <ul>
            <li>Neutralizes negative karmic influences</li>
            <li>Strengthens weak planetary positions</li>
            <li>Enhances positive planetary effects</li>
            <li>Promotes spiritual growth and merit</li>
            <li>Addresses specific life challenges</li>
          </ul>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="privacy-notice">
        <h3>Privacy Notice</h3>
        <p>
          Your birth data is used solely for astrological calculations and charity guidance.
          We respect your privacy and do not store or share your personal information.
        </p>
      </div>
    </div>
  );
};

export default CharityGuidanceInput;