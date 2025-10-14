import React, { useState } from 'react';
import {
  FengShuiPropertyData,
  FengShuiPersonalData,
  FengShuiTimeframe
} from '../types/astrology';
import './FengShuiRemediesInput.css';

/**
 * Props for FengShuiRemediesInput component
 */
interface FengShuiRemediesInputProps {
  onSubmit: (
    propertyData: FengShuiPropertyData,
    personalData?: FengShuiPersonalData,
    timeframe?: FengShuiTimeframe
  ) => void;
  loading: boolean;
}

/**
 * Input component for Feng Shui property data and analysis parameters
 */
const FengShuiRemediesInput: React.FC<FengShuiRemediesInputProps> = ({
  onSubmit,
  loading
}) => {
  // Property data state
  const [propertyData, setPropertyData] = useState<FengShuiPropertyData>({
    layout: {
      width: 0,
      length: 0,
      floors: 1,
      facingDirection: 0,
      rooms: []
    },
    location: {
      latitude: 0,
      longitude: 0
    }
  });

  // Personal data state (optional)
  const [personalData, setPersonalData] = useState<FengShuiPersonalData | undefined>();

  // Timeframe state
  const [timeframe, setTimeframe] = useState<FengShuiTimeframe>({
    year: new Date().getFullYear(),
    analysisType: 'annual'
  });

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Handle property layout changes
   */
  const handleLayoutChange = (field: string, value: any) => {
    setPropertyData(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [field]: value
      }
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Handle location changes
   */
  const handleLocationChange = (field: string, value: any) => {
    setPropertyData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Handle room addition
   */
  const addRoom = () => {
    const newRoom = {
      name: '',
      area: 0,
      direction: 0,
      purpose: ''
    };

    setPropertyData(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        rooms: [...prev.layout.rooms, newRoom]
      }
    }));
  };

  /**
   * Handle room removal
   */
  const removeRoom = (index: number) => {
    setPropertyData(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        rooms: prev.layout.rooms.filter((_, i) => i !== index)
      }
    }));
  };

  /**
   * Handle room changes
   */
  const handleRoomChange = (index: number, field: string, value: any) => {
    setPropertyData(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        rooms: prev.layout.rooms.map((room, i) =>
          i === index ? { ...room, [field]: value } : room
        )
      }
    }));
  };

  /**
   * Handle personal data changes
   */
  const handlePersonalDataChange = (field: string, value: any) => {
    setPersonalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handle timeframe changes
   */
  const handleTimeframeChange = (field: string, value: any) => {
    setTimeframe(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate property layout
    if (propertyData.layout.width <= 0) {
      newErrors.width = 'Width must be greater than 0';
    }
    if (propertyData.layout.length <= 0) {
      newErrors.length = 'Length must be greater than 0';
    }
    if (propertyData.layout.floors <= 0) {
      newErrors.floors = 'Floors must be greater than 0';
    }
    if (propertyData.layout.facingDirection < 0 || propertyData.layout.facingDirection >= 360) {
      newErrors.facingDirection = 'Facing direction must be between 0 and 359 degrees';
    }

    // Validate location
    if (propertyData.location.latitude < -90 || propertyData.location.latitude > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }
    if (propertyData.location.longitude < -180 || propertyData.location.longitude > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }

    // Validate rooms
    propertyData.layout.rooms.forEach((room, index) => {
      if (!room.name.trim()) {
        newErrors[`room_${index}_name`] = `Room ${index + 1} name is required`;
      }
      if (room.area <= 0) {
        newErrors[`room_${index}_area`] = `Room ${index + 1} area must be greater than 0`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(propertyData, personalData, timeframe);
  };

  /**
   * Get direction name from degrees
   */
  const getDirectionName = (degrees: number): string => {
    const directions = [
      'North', 'North-Northeast', 'Northeast', 'East-Northeast',
      'East', 'East-Southeast', 'Southeast', 'South-Southeast',
      'South', 'South-Southwest', 'Southwest', 'West-Southwest',
      'West', 'West-Northwest', 'Northwest', 'North-Northwest'
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className="feng-shui-input-container">
      <form onSubmit={handleSubmit} className="feng-shui-form">
        {/* Property Layout Section */}
        <div className="form-section">
          <h3>Property Layout</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="width">Width (feet/meters)</label>
              <input
                type="number"
                id="width"
                value={propertyData.layout.width || ''}
                onChange={(e) => handleLayoutChange('width', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.1"
                required
                className={errors.width ? 'error' : ''}
              />
              {errors.width && <span className="error-message">{errors.width}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="length">Length (feet/meters)</label>
              <input
                type="number"
                id="length"
                value={propertyData.layout.length || ''}
                onChange={(e) => handleLayoutChange('length', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.1"
                required
                className={errors.length ? 'error' : ''}
              />
              {errors.length && <span className="error-message">{errors.length}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="floors">Number of Floors</label>
              <input
                type="number"
                id="floors"
                value={propertyData.layout.floors}
                onChange={(e) => handleLayoutChange('floors', parseInt(e.target.value) || 1)}
                min="1"
                required
                className={errors.floors ? 'error' : ''}
              />
              {errors.floors && <span className="error-message">{errors.floors}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="facingDirection">Facing Direction (degrees)</label>
            <input
              type="number"
              id="facingDirection"
              value={propertyData.layout.facingDirection}
              onChange={(e) => handleLayoutChange('facingDirection', parseFloat(e.target.value) || 0)}
              min="0"
              max="359"
              step="0.1"
              required
              className={errors.facingDirection ? 'error' : ''}
            />
            <span className="direction-display">
              {getDirectionName(propertyData.layout.facingDirection)}
            </span>
            {errors.facingDirection && <span className="error-message">{errors.facingDirection}</span>}
          </div>
        </div>

        {/* Location Section */}
        <div className="form-section">
          <h3>Location</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="latitude">Latitude</label>
              <input
                type="number"
                id="latitude"
                value={propertyData.location.latitude || ''}
                onChange={(e) => handleLocationChange('latitude', parseFloat(e.target.value) || 0)}
                min="-90"
                max="90"
                step="0.000001"
                required
                className={errors.latitude ? 'error' : ''}
              />
              {errors.latitude && <span className="error-message">{errors.latitude}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="longitude">Longitude</label>
              <input
                type="number"
                id="longitude"
                value={propertyData.location.longitude || ''}
                onChange={(e) => handleLocationChange('longitude', parseFloat(e.target.value) || 0)}
                min="-180"
                max="180"
                step="0.000001"
                required
                className={errors.longitude ? 'error' : ''}
              />
              {errors.longitude && <span className="error-message">{errors.longitude}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address (Optional)</label>
            <input
              type="text"
              id="address"
              value={propertyData.location.address || ''}
              onChange={(e) => handleLocationChange('address', e.target.value)}
              placeholder="Street address, city, country"
            />
          </div>
        </div>

        {/* Rooms Section */}
        <div className="form-section">
          <div className="section-header">
            <h3>Rooms</h3>
            <button type="button" onClick={addRoom} className="add-room-button">
              Add Room
            </button>
          </div>

          {propertyData.layout.rooms.map((room, index) => (
            <div key={index} className="room-item">
              <div className="room-header">
                <h4>Room {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeRoom(index)}
                  className="remove-room-button"
                  aria-label={`Remove room ${index + 1}`}
                >
                  ×
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`room_${index}_name`}>Room Name</label>
                  <input
                    type="text"
                    id={`room_${index}_name`}
                    value={room.name}
                    onChange={(e) => handleRoomChange(index, 'name', e.target.value)}
                    required
                    className={errors[`room_${index}_name`] ? 'error' : ''}
                  />
                  {errors[`room_${index}_name`] && (
                    <span className="error-message">{errors[`room_${index}_name`]}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor={`room_${index}_area`}>Area (sq ft/m)</label>
                  <input
                    type="number"
                    id={`room_${index}_area`}
                    value={room.area || ''}
                    onChange={(e) => handleRoomChange(index, 'area', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                    required
                    className={errors[`room_${index}_area`] ? 'error' : ''}
                  />
                  {errors[`room_${index}_area`] && (
                    <span className="error-message">{errors[`room_${index}_area`]}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor={`room_${index}_direction`}>Direction (degrees)</label>
                  <input
                    type="number"
                    id={`room_${index}_direction`}
                    value={room.direction}
                    onChange={(e) => handleRoomChange(index, 'direction', parseFloat(e.target.value) || 0)}
                    min="0"
                    max="359"
                    step="0.1"
                  />
                  <span className="direction-display">
                    {getDirectionName(room.direction)}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={`room_${index}_purpose`}>Purpose (Optional)</label>
                <input
                  type="text"
                  id={`room_${index}_purpose`}
                  value={room.purpose || ''}
                  onChange={(e) => handleRoomChange(index, 'purpose', e.target.value)}
                  placeholder="e.g., Living room, Bedroom, Kitchen"
                />
              </div>
            </div>
          ))}

          {propertyData.layout.rooms.length === 0 && (
            <p className="no-rooms-message">
              No rooms added yet. Click "Add Room" to include rooms in your analysis.
            </p>
          )}
        </div>

        {/* Personal Data Section (Optional) */}
        <div className="form-section">
          <h3>Personal Data (Optional)</h3>
          <p className="section-description">
            Providing birth data can help personalize remedies based on your elemental compatibility.
          </p>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="birthYear">Birth Year</label>
              <input
                type="number"
                id="birthYear"
                value={personalData?.birthData?.year || ''}
                onChange={(e) => handlePersonalDataChange('birthData', {
                  ...personalData?.birthData,
                  year: parseInt(e.target.value) || undefined
                })}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="form-group">
              <label htmlFor="birthMonth">Birth Month</label>
              <select
                id="birthMonth"
                value={personalData?.birthData?.month || ''}
                onChange={(e) => handlePersonalDataChange('birthData', {
                  ...personalData?.birthData,
                  month: parseInt(e.target.value) || undefined
                })}
              >
                <option value="">Select Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="birthDay">Birth Day</label>
              <input
                type="number"
                id="birthDay"
                value={personalData?.birthData?.day || ''}
                onChange={(e) => handlePersonalDataChange('birthData', {
                  ...personalData?.birthData,
                  day: parseInt(e.target.value) || undefined
                })}
                min="1"
                max="31"
              />
            </div>
          </div>
        </div>

        {/* Timeframe Section */}
        <div className="form-section">
          <h3>Analysis Timeframe</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="analysisYear">Year</label>
              <input
                type="number"
                id="analysisYear"
                value={timeframe.year}
                onChange={(e) => handleTimeframeChange('year', parseInt(e.target.value) || new Date().getFullYear())}
                min="2020"
                max="2050"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="analysisType">Analysis Type</label>
              <select
                id="analysisType"
                value={timeframe.analysisType}
                onChange={(e) => handleTimeframeChange('analysisType', e.target.value as 'annual' | 'monthly' | 'daily')}
                required
              >
                <option value="annual">Annual</option>
                <option value="monthly">Monthly</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            {timeframe.analysisType === 'monthly' && (
              <div className="form-group">
                <label htmlFor="analysisMonth">Month</label>
                <select
                  id="analysisMonth"
                  value={timeframe.month || ''}
                  onChange={(e) => handleTimeframeChange('month', parseInt(e.target.value) || undefined)}
                >
                  <option value="">Select Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {timeframe.analysisType === 'daily' && (
              <>
                <div className="form-group">
                  <label htmlFor="analysisMonth">Month</label>
                  <select
                    id="analysisMonth"
                    value={timeframe.month || ''}
                    onChange={(e) => handleTimeframeChange('month', parseInt(e.target.value) || undefined)}
                  >
                    <option value="">Select Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="analysisDay">Day</label>
                  <input
                    type="number"
                    id="analysisDay"
                    value={timeframe.day || ''}
                    onChange={(e) => handleTimeframeChange('day', parseInt(e.target.value) || undefined)}
                    min="1"
                    max="31"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Analyzing...' : 'Generate Feng Shui Analysis'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FengShuiRemediesInput;