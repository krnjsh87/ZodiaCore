import React, { useState } from 'react';
import { MundaneAstrologyRequest, RegionData, NationalData } from '../types/astrology';
import './MundaneAstrologyInput.css';

interface MundaneAstrologyInputProps {
  onSubmit: (request: MundaneAstrologyRequest) => void;
  loading?: boolean;
  error?: string;
}

/**
 * Mundane Astrology Input Form Component
 * Allows users to enter region and national data for mundane analysis
 */
const MundaneAstrologyInput: React.FC<MundaneAstrologyInputProps> = ({
  onSubmit,
  loading = false,
  error
}) => {
  const [regionData, setRegionData] = useState<RegionData>({
    name: '',
    latitude: 0,
    longitude: 0
  });

  const [nationalData, setNationalData] = useState<NationalData | null>(null);
  const [includeNationalData, setIncludeNationalData] = useState(false);
  const [analysisType, setAnalysisType] = useState<'basic' | 'comprehensive' | 'collaborative'>('comprehensive');
  const [timeRange, setTimeRange] = useState(365);
  const [selectedPredictions, setSelectedPredictions] = useState<('political' | 'economic' | 'weather' | 'military' | 'social')[]>(['political', 'economic']);
  const [analysisOptions, setAnalysisOptions] = useState({
    dashaAnalysis: true,
    weatherAnalysis: true,
    economicAnalysis: true,
    historicalValidation: false
  });

  const [validationErrors, setValidationErrors] = useState<Partial<Record<string, string>>>({});

  /**
   * Handle region input changes
   */
  const handleRegionChange = (field: keyof RegionData, value: string | number) => {
    setRegionData(prev => ({
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
   * Handle national data input changes
   */
  const handleNationalChange = (field: keyof NationalData, value: string | number) => {
    if (!nationalData) return;

    setNationalData(prev => ({
      ...prev!,
      [field]: value
    }));

    // Clear validation error for this field
    if (validationErrors[`national_${field}`]) {
      setValidationErrors(prev => ({
        ...prev,
        [`national_${field}`]: undefined
      }));
    }
  };

  /**
   * Handle prediction type selection
   */
  const handlePredictionChange = (prediction: 'political' | 'economic' | 'weather' | 'military' | 'social', checked: boolean) => {
    if (checked) {
      setSelectedPredictions(prev => [...prev, prediction]);
    } else {
      setSelectedPredictions(prev => prev.filter(p => p !== prediction));
    }
  };

  /**
   * Handle analysis option changes
   */
  const handleOptionChange = (option: keyof typeof analysisOptions, checked: boolean) => {
    setAnalysisOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const errors: Partial<Record<string, string>> = {};

    // Region validation
    if (!regionData.name.trim()) {
      errors.name = 'Region name is required';
    }

    if (regionData.latitude < -90 || regionData.latitude > 90) {
      errors.latitude = 'Latitude must be between -90 and 90 degrees';
    }

    if (regionData.longitude < -180 || regionData.longitude > 180) {
      errors.longitude = 'Longitude must be between -180 and 180 degrees';
    }

    // National data validation (if included)
    if (includeNationalData && nationalData) {
      if (!nationalData.countryName.trim()) {
        errors.national_countryName = 'Country name is required';
      }

      if (nationalData.foundingYear < 1000 || nationalData.foundingYear > new Date().getFullYear()) {
        errors.national_foundingYear = 'Founding year must be between 1000 and current year';
      }

      if (nationalData.foundingMonth < 1 || nationalData.foundingMonth > 12) {
        errors.national_foundingMonth = 'Founding month must be between 1 and 12';
      }

      if (nationalData.foundingDay < 1 || nationalData.foundingDay > 31) {
        errors.national_foundingDay = 'Founding day must be between 1 and 31';
      }

      if (nationalData.capitalLatitude < -90 || nationalData.capitalLatitude > 90) {
        errors.national_capitalLatitude = 'Capital latitude must be between -90 and 90 degrees';
      }

      if (nationalData.capitalLongitude < -180 || nationalData.capitalLongitude > 180) {
        errors.national_capitalLongitude = 'Capital longitude must be between -180 and 180 degrees';
      }
    }

    // Prediction types validation
    if (selectedPredictions.length === 0) {
      errors.predictions = 'At least one prediction type must be selected';
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
      const request: MundaneAstrologyRequest = {
        region: regionData,
        type: analysisType,
        timeRange,
        predictions: selectedPredictions,
        ...analysisOptions
      };

      if (includeNationalData && nationalData) {
        request.nationalData = nationalData;
      }

      onSubmit(request);
    }
  };

  /**
   * Initialize national data when toggled
   */
  const handleNationalDataToggle = (checked: boolean) => {
    setIncludeNationalData(checked);
    if (checked) {
      setNationalData({
        countryName: regionData.name,
        foundingYear: 1900,
        foundingMonth: 1,
        foundingDay: 1,
        capitalLatitude: regionData.latitude,
        capitalLongitude: regionData.longitude
      });
    } else {
      setNationalData(null);
    }
  };

  return (
    <div className="mundane-astrology-input">
      <div className="input-header">
        <h2>Enter Mundane Analysis Details</h2>
        <p>Provide region information and analysis preferences for comprehensive mundane astrology forecasting</p>
      </div>

      {error && (
        <div className="input-error" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mundane-analysis-form">
        {/* Region Section */}
        <fieldset className="form-section">
          <legend>Region Information</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="region-name">Region/Country Name</label>
              <input
                type="text"
                id="region-name"
                value={regionData.name}
                onChange={(e) => handleRegionChange('name', e.target.value)}
                placeholder="e.g., United States, India, New York City"
                required
                aria-describedby={validationErrors.name ? "region-name-error" : undefined}
                className={validationErrors.name ? 'error' : ''}
              />
              {validationErrors.name && (
                <span id="region-name-error" className="field-error" role="alert">
                  {validationErrors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="latitude">Latitude</label>
              <input
                type="number"
                id="latitude"
                value={regionData.latitude}
                onChange={(e) => handleRegionChange('latitude', parseFloat(e.target.value) || 0)}
                step="0.0001"
                min="-90"
                max="90"
                required
                aria-describedby={validationErrors.latitude ? "latitude-error" : undefined}
                className={validationErrors.latitude ? 'error' : ''}
              />
              <small className="field-help">Degrees North/South (-90 to 90)</small>
              {validationErrors.latitude && (
                <span id="latitude-error" className="field-error" role="alert">
                  {validationErrors.latitude}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="longitude">Longitude</label>
              <input
                type="number"
                id="longitude"
                value={regionData.longitude}
                onChange={(e) => handleRegionChange('longitude', parseFloat(e.target.value) || 0)}
                step="0.0001"
                min="-180"
                max="180"
                required
                aria-describedby={validationErrors.longitude ? "longitude-error" : undefined}
                className={validationErrors.longitude ? 'error' : ''}
              />
              <small className="field-help">Degrees East/West (-180 to 180)</small>
              {validationErrors.longitude && (
                <span id="longitude-error" className="field-error" role="alert">
                  {validationErrors.longitude}
                </span>
              )}
            </div>
          </div>
        </fieldset>

        {/* National Data Toggle */}
        <fieldset className="form-section">
          <legend>National Horoscope Data</legend>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeNationalData}
                onChange={(e) => handleNationalDataToggle(e.target.checked)}
              />
              Include national founding data for detailed analysis
            </label>
            <small className="field-help">
              Enable this to analyze the region's national horoscope based on founding date and capital location
            </small>
          </div>

          {includeNationalData && nationalData && (
            <div className="national-data-section">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country-name">Country Name</label>
                  <input
                    type="text"
                    id="country-name"
                    value={nationalData.countryName}
                    onChange={(e) => handleNationalChange('countryName', e.target.value)}
                    required
                    aria-describedby={validationErrors.national_countryName ? "country-name-error" : undefined}
                    className={validationErrors.national_countryName ? 'error' : ''}
                  />
                  {validationErrors.national_countryName && (
                    <span id="country-name-error" className="field-error" role="alert">
                      {validationErrors.national_countryName}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="founding-year">Founding Year</label>
                  <input
                    type="number"
                    id="founding-year"
                    value={nationalData.foundingYear}
                    onChange={(e) => handleNationalChange('foundingYear', parseInt(e.target.value) || 0)}
                    min="1000"
                    max={new Date().getFullYear()}
                    required
                    aria-describedby={validationErrors.national_foundingYear ? "founding-year-error" : undefined}
                    className={validationErrors.national_foundingYear ? 'error' : ''}
                  />
                  {validationErrors.national_foundingYear && (
                    <span id="founding-year-error" className="field-error" role="alert">
                      {validationErrors.national_foundingYear}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="founding-month">Founding Month</label>
                  <select
                    id="founding-month"
                    value={nationalData.foundingMonth}
                    onChange={(e) => handleNationalChange('foundingMonth', parseInt(e.target.value))}
                    required
                    aria-describedby={validationErrors.national_foundingMonth ? "founding-month-error" : undefined}
                    className={validationErrors.national_foundingMonth ? 'error' : ''}
                  >
                    <option value="">Select Month</option>
                    {[
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                    ].map((month, index) => (
                      <option key={index + 1} value={index + 1}>{month}</option>
                    ))}
                  </select>
                  {validationErrors.national_foundingMonth && (
                    <span id="founding-month-error" className="field-error" role="alert">
                      {validationErrors.national_foundingMonth}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="founding-day">Founding Day</label>
                  <input
                    type="number"
                    id="founding-day"
                    value={nationalData.foundingDay}
                    onChange={(e) => handleNationalChange('foundingDay', parseInt(e.target.value) || 0)}
                    min="1"
                    max="31"
                    required
                    aria-describedby={validationErrors.national_foundingDay ? "founding-day-error" : undefined}
                    className={validationErrors.national_foundingDay ? 'error' : ''}
                  />
                  {validationErrors.national_foundingDay && (
                    <span id="founding-day-error" className="field-error" role="alert">
                      {validationErrors.national_foundingDay}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="capital-latitude">Capital Latitude</label>
                  <input
                    type="number"
                    id="capital-latitude"
                    value={nationalData.capitalLatitude}
                    onChange={(e) => handleNationalChange('capitalLatitude', parseFloat(e.target.value) || 0)}
                    step="0.0001"
                    min="-90"
                    max="90"
                    required
                    aria-describedby={validationErrors.national_capitalLatitude ? "capital-latitude-error" : undefined}
                    className={validationErrors.national_capitalLatitude ? 'error' : ''}
                  />
                  {validationErrors.national_capitalLatitude && (
                    <span id="capital-latitude-error" className="field-error" role="alert">
                      {validationErrors.national_capitalLatitude}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="capital-longitude">Capital Longitude</label>
                  <input
                    type="number"
                    id="capital-longitude"
                    value={nationalData.capitalLongitude}
                    onChange={(e) => handleNationalChange('capitalLongitude', parseFloat(e.target.value) || 0)}
                    step="0.0001"
                    min="-180"
                    max="180"
                    required
                    aria-describedby={validationErrors.national_capitalLongitude ? "capital-longitude-error" : undefined}
                    className={validationErrors.national_capitalLongitude ? 'error' : ''}
                  />
                  {validationErrors.national_capitalLongitude && (
                    <span id="capital-longitude-error" className="field-error" role="alert">
                      {validationErrors.national_capitalLongitude}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </fieldset>

        {/* Analysis Configuration */}
        <fieldset className="form-section">
          <legend>Analysis Configuration</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="analysis-type">Analysis Type</label>
              <select
                id="analysis-type"
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value as 'basic' | 'comprehensive' | 'collaborative')}
              >
                <option value="basic">Basic Analysis</option>
                <option value="comprehensive">Comprehensive Analysis</option>
                <option value="collaborative">Collaborative Analysis (A2A/MCP)</option>
              </select>
              <small className="field-help">
                Basic: Current transits only. Comprehensive: Full analysis. Collaborative: Multi-agent analysis.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="time-range">Time Range (Days)</label>
              <input
                type="number"
                id="time-range"
                value={timeRange}
                onChange={(e) => setTimeRange(parseInt(e.target.value) || 365)}
                min="1"
                max="3650"
              />
              <small className="field-help">Number of days to analyze for predictions (1-3650)</small>
            </div>
          </div>

          <div className="form-group">
            <label>Prediction Types</label>
            <div className="checkbox-group">
              {[
                { value: 'political', label: 'Political Events' },
                { value: 'economic', label: 'Economic Trends' },
                { value: 'weather', label: 'Weather Patterns' },
                { value: 'military', label: 'Military Activities' },
                { value: 'social', label: 'Social Developments' }
              ].map(({ value, label }) => (
                <label key={value} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedPredictions.includes(value as any)}
                    onChange={(e) => handlePredictionChange(value as any, e.target.checked)}
                  />
                  {label}
                </label>
              ))}
            </div>
            {validationErrors.predictions && (
              <span className="field-error" role="alert">
                {validationErrors.predictions}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Analysis Options</label>
            <div className="checkbox-group">
              {[
                { key: 'dashaAnalysis', label: 'Include Dasha Analysis' },
                { key: 'weatherAnalysis', label: 'Include Weather Forecasting' },
                { key: 'economicAnalysis', label: 'Include Economic Analysis' },
                { key: 'historicalValidation', label: 'Include Historical Validation' }
              ].map(({ key, label }) => (
                <label key={key} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={analysisOptions[key as keyof typeof analysisOptions]}
                    onChange={(e) => handleOptionChange(key as keyof typeof analysisOptions, e.target.checked)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            className="generate-button"
            disabled={loading}
            aria-describedby="generate-button-help"
          >
            {loading ? 'Generating Analysis...' : 'Generate Mundane Analysis'}
          </button>
          <small id="generate-button-help" className="button-help">
            This will perform comprehensive mundane astrology analysis based on Vedic principles
          </small>
        </div>
      </form>

      {/* Information Notice */}
      <div className="info-notice">
        <h3>Analysis Information</h3>
        <p>
          Mundane astrology analyzes collective experiences and world events using planetary positions
          and Vedic astrological techniques. Results are based on traditional astrological correlations
          and should be used for informational purposes only.
        </p>
        <p>
          <strong>Note:</strong> Astrological analysis does not predict specific events with certainty.
          Always consult qualified professionals for important decisions.
        </p>
      </div>
    </div>
  );
};

export default MundaneAstrologyInput;