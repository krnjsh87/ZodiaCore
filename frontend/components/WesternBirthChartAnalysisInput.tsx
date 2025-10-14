import React, { useState } from 'react';
import { BirthData } from '../types/astrology';

/**
 * Props for WesternBirthChartAnalysisInput component
 */
interface WesternBirthChartAnalysisInputProps {
  onSubmit: (
    birthData: BirthData,
    options: {
      framework?: 'traditional' | 'modern' | 'evolutionary';
      houseSystem?: 'placidus' | 'koch' | 'equal' | 'whole-sign' | 'regiomontanus';
    }
  ) => void;
  loading: boolean;
  error: string | null;
}

/**
 * Western Birth Chart Analysis Input Component
 * Form for entering birth data and analysis options
 */
const WesternBirthChartAnalysisInput: React.FC<WesternBirthChartAnalysisInputProps> = ({
  onSubmit,
  loading,
  error
}) => {
  const [birthData, setBirthData] = useState<BirthData>({
    date: '',
    time: '',
    location: { latitude: 0, longitude: 0 }
  });

  const [options, setOptions] = useState({
    framework: 'modern' as 'traditional' | 'modern' | 'evolutionary',
    houseSystem: 'placidus' as 'placidus' | 'koch' | 'equal' | 'whole-sign' | 'regiomontanus'
  });

  const [locationInput, setLocationInput] = useState({
    latitude: '',
    longitude: ''
  });

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!birthData.date || !birthData.time || !locationInput.latitude || !locationInput.longitude) {
      return;
    }

    // Convert location strings to numbers
    const latitude = parseFloat(locationInput.latitude);
    const longitude = parseFloat(locationInput.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      return;
    }

    onSubmit({
      ...birthData,
      location: { latitude, longitude }
    }, options);
  };

  /**
   * Handle birth data input changes
   */
  const handleBirthDataChange = (field: keyof BirthData, value: string) => {
    setBirthData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handle location input changes
   */
  const handleLocationChange = (field: 'latitude' | 'longitude', value: string) => {
    setLocationInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handle analysis options changes
   */
  const handleOptionChange = (field: keyof typeof options, value: string) => {
    setOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="western-birth-chart-analysis-input">
      <div className="input-container">
        <h2>Birth Chart Analysis</h2>
        <p className="description">
          Enter your birth details and select analysis preferences for a comprehensive
          Western astrology birth chart interpretation.
        </p>

        <form onSubmit={handleSubmit} className="analysis-form">
          {/* Birth Data Section */}
          <fieldset className="form-section">
            <legend>Birth Information</legend>

            <div className="form-group">
              <label htmlFor="birth-date">
                Birth Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="birth-date"
                value={birthData.date}
                onChange={(e) => handleBirthDataChange('date', e.target.value)}
                required
                aria-describedby="birth-date-help"
              />
              <small id="birth-date-help">Enter your date of birth in YYYY-MM-DD format</small>
            </div>

            <div className="form-group">
              <label htmlFor="birth-time">
                Birth Time <span className="required">*</span>
              </label>
              <input
                type="time"
                id="birth-time"
                value={birthData.time}
                onChange={(e) => handleBirthDataChange('time', e.target.value)}
                required
                aria-describedby="birth-time-help"
              />
              <small id="birth-time-help">Enter your time of birth in HH:MM format (24-hour)</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="latitude">
                  Latitude <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="latitude"
                  step="0.0001"
                  min="-90"
                  max="90"
                  value={locationInput.latitude}
                  onChange={(e) => handleLocationChange('latitude', e.target.value)}
                  placeholder="40.7128"
                  required
                  aria-describedby="latitude-help"
                />
                <small id="latitude-help">Latitude in decimal degrees (e.g., 40.7128 for New York)</small>
              </div>

              <div className="form-group">
                <label htmlFor="longitude">
                  Longitude <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="longitude"
                  step="0.0001"
                  min="-180"
                  max="180"
                  value={locationInput.longitude}
                  onChange={(e) => handleLocationChange('longitude', e.target.value)}
                  placeholder="-74.0060"
                  required
                  aria-describedby="longitude-help"
                />
                <small id="longitude-help">Longitude in decimal degrees (e.g., -74.0060 for New York)</small>
              </div>
            </div>
          </fieldset>

          {/* Analysis Options Section */}
          <fieldset className="form-section">
            <legend>Analysis Preferences</legend>

            <div className="form-group">
              <label htmlFor="framework">
                Interpretive Framework
              </label>
              <select
                id="framework"
                value={options.framework}
                onChange={(e) => handleOptionChange('framework', e.target.value)}
                aria-describedby="framework-help"
              >
                <option value="modern">Modern Astrology</option>
                <option value="traditional">Traditional Astrology</option>
                <option value="evolutionary">Evolutionary Astrology</option>
              </select>
              <small id="framework-help">
                Choose the astrological framework for interpretation:
                Modern (psychological), Traditional (classical), or Evolutionary (soul growth)
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="house-system">
                House System
              </label>
              <select
                id="house-system"
                value={options.houseSystem}
                onChange={(e) => handleOptionChange('houseSystem', e.target.value)}
                aria-describedby="house-system-help"
              >
                <option value="placidus">Placidus</option>
                <option value="koch">Koch</option>
                <option value="equal">Equal House</option>
                <option value="whole-sign">Whole Sign</option>
                <option value="regiomontanus">Regiomontanus</option>
              </select>
              <small id="house-system-help">
                Select the house system for dividing the birth chart into 12 houses
              </small>
            </div>
          </fieldset>

          {/* Error Display */}
          {error && (
            <div className="error-message" role="alert" aria-live="polite">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={loading || !birthData.date || !birthData.time || !locationInput.latitude || !locationInput.longitude}
              className="submit-button"
              aria-describedby="submit-help"
            >
              {loading ? 'Analyzing...' : 'Analyze Birth Chart'}
            </button>
            <small id="submit-help">
              Analysis may take a few moments to complete
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WesternBirthChartAnalysisInput;