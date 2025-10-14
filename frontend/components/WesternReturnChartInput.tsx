import React, { useState } from 'react';
import { BirthData, ReturnChartRequest, ReturnChartType } from '../types/astrology';

/**
 * Props for WesternReturnChartInput component
 */
interface WesternReturnChartInputProps {
  onSubmit: (request: ReturnChartRequest) => void;
  onCombinedSubmit: (birthData: BirthData, targetDate: Date) => void;
  loading: boolean;
  error: string | null;
}

/**
 * Western Return Chart Input Component
 * Handles user input for generating return charts
 */
const WesternReturnChartInput: React.FC<WesternReturnChartInputProps> = ({
  onSubmit,
  onCombinedSubmit,
  loading,
  error
}) => {
  const [chartType, setChartType] = useState<ReturnChartType>('solar');
  const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear());
  const [targetMonth, setTargetMonth] = useState<number>(new Date().getMonth());
  const [birthData, setBirthData] = useState<BirthData>({
    year: 1990,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    second: 0,
    latitude: 40.7128,
    longitude: -74.0060
  });
  const [castingLocation, setCastingLocation] = useState({
    latitude: 40.7128,
    longitude: -74.0060
  });
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [generateCombined, setGenerateCombined] = useState(false);

  /**
   * Handle form submission for single return chart
   */
  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const request: ReturnChartRequest = {
      type: chartType,
      targetDate: chartType === 'solar'
        ? new Date(targetYear, birthData.month - 1, birthData.day)
        : new Date(targetYear, targetMonth, 15), // Approximate for lunar
      castingLocation: useCustomLocation ? castingLocation : undefined
    };

    onSubmit(request);
  };

  /**
   * Handle form submission for combined charts
   */
  const handleCombinedSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const targetDate = new Date(targetYear, targetMonth, 15);
    onCombinedSubmit(birthData, targetDate);
  };

  /**
   * Update birth data
   */
  const updateBirthData = (field: keyof BirthData, value: number) => {
    setBirthData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Update casting location
   */
  const updateLocation = (field: 'latitude' | 'longitude', value: number) => {
    setCastingLocation(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="western-return-chart-input">
      <div className="input-header">
        <h2>Generate Return Chart</h2>
        <p>Enter your birth details and select the return chart type you want to generate.</p>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={generateCombined ? handleCombinedSubmit : handleSingleSubmit} className="return-chart-form">
        {/* Chart Type Selection */}
        <div className="form-section">
          <h3>Chart Type</h3>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="chartType"
                value="single"
                checked={!generateCombined}
                onChange={() => setGenerateCombined(false)}
              />
              <span className="radio-label">Single Return Chart</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="chartType"
                value="combined"
                checked={generateCombined}
                onChange={() => setGenerateCombined(true)}
              />
              <span className="radio-label">Combined Solar & Lunar Returns</span>
            </label>
          </div>
        </div>

        {/* Return Type Selection (for single charts) */}
        {!generateCombined && (
          <div className="form-section">
            <h3>Return Type</h3>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="returnType"
                  value="solar"
                  checked={chartType === 'solar'}
                  onChange={() => setChartType('solar')}
                />
                <span className="radio-label">Solar Return (Yearly)</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="returnType"
                  value="lunar"
                  checked={chartType === 'lunar'}
                  onChange={() => setChartType('lunar')}
                />
                <span className="radio-label">Lunar Return (Monthly)</span>
              </label>
            </div>
          </div>
        )}

        {/* Birth Data */}
        <div className="form-section">
          <h3>Birth Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="birthYear">Birth Year</label>
              <input
                id="birthYear"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={birthData.year}
                onChange={(e) => updateBirthData('year', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="birthMonth">Birth Month</label>
              <select
                id="birthMonth"
                value={birthData.month}
                onChange={(e) => updateBirthData('month', parseInt(e.target.value))}
                required
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="birthDay">Birth Day</label>
              <input
                id="birthDay"
                type="number"
                min="1"
                max="31"
                value={birthData.day}
                onChange={(e) => updateBirthData('day', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="birthHour">Birth Hour</label>
              <input
                id="birthHour"
                type="number"
                min="0"
                max="23"
                value={birthData.hour}
                onChange={(e) => updateBirthData('hour', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="birthMinute">Birth Minute</label>
              <input
                id="birthMinute"
                type="number"
                min="0"
                max="59"
                value={birthData.minute}
                onChange={(e) => updateBirthData('minute', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="birthSecond">Birth Second</label>
              <input
                id="birthSecond"
                type="number"
                min="0"
                max="59"
                value={birthData.second}
                onChange={(e) => updateBirthData('second', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="latitude">Birth Latitude</label>
              <input
                id="latitude"
                type="number"
                step="0.0001"
                min="-90"
                max="90"
                value={birthData.latitude}
                onChange={(e) => updateBirthData('latitude', parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="longitude">Birth Longitude</label>
              <input
                id="longitude"
                type="number"
                step="0.0001"
                min="-180"
                max="180"
                value={birthData.longitude}
                onChange={(e) => updateBirthData('longitude', parseFloat(e.target.value))}
                required
              />
            </div>
          </div>
        </div>

        {/* Target Date/Time */}
        <div className="form-section">
          <h3>Target Period</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="targetYear">Year</label>
              <input
                id="targetYear"
                type="number"
                min={birthData.year}
                max={birthData.year + 100}
                value={targetYear}
                onChange={(e) => setTargetYear(parseInt(e.target.value))}
                required
              />
            </div>

            {chartType === 'lunar' && !generateCombined && (
              <div className="form-group">
                <label htmlFor="targetMonth">Month</label>
                <select
                  id="targetMonth"
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(parseInt(e.target.value))}
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Casting Location */}
        <div className="form-section">
          <h3>Casting Location</h3>
          <div className="checkbox-group">
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={useCustomLocation}
                onChange={(e) => setUseCustomLocation(e.target.checked)}
              />
              <span className="checkbox-label">Use custom casting location (different from birth location)</span>
            </label>
          </div>

          {useCustomLocation && (
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="castLatitude">Casting Latitude</label>
                <input
                  id="castLatitude"
                  type="number"
                  step="0.0001"
                  min="-90"
                  max="90"
                  value={castingLocation.latitude}
                  onChange={(e) => updateLocation('latitude', parseFloat(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="castLongitude">Casting Longitude</label>
                <input
                  id="castLongitude"
                  type="number"
                  step="0.0001"
                  min="-180"
                  max="180"
                  value={castingLocation.longitude}
                  onChange={(e) => updateLocation('longitude', parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Generating...' : `Generate ${generateCombined ? 'Combined Return Charts' : `${chartType === 'solar' ? 'Solar' : 'Lunar'} Return Chart`}`}
          </button>
        </div>
      </form>

      <div className="info-section">
        <h3>About Return Charts</h3>
        <div className="info-content">
          <div className="info-item">
            <h4>Solar Return</h4>
            <p>Cast for the exact moment the Sun returns to its natal position, representing themes for the upcoming year.</p>
          </div>
          <div className="info-item">
            <h4>Lunar Return</h4>
            <p>Cast for the exact moment the Moon returns to its natal position, representing emotional themes for the upcoming month.</p>
          </div>
          <div className="info-item">
            <h4>Combined Returns</h4>
            <p>Generate both solar and lunar returns together to see how yearly and monthly themes interact.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WesternReturnChartInput;