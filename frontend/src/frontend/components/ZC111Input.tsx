import React, { useState } from 'react';
import { ActivityType } from '../types/astrology';

interface ZC111InputProps {
  onAnalysis: (
    birthDate: Date,
    fullName: string,
    activityType: ActivityType,
    dateRange: { start: Date; end: Date },
    preferences?: { latitude?: number; longitude?: number }
  ) => void;
  loading: boolean;
}

const ZC111Input: React.FC<ZC111InputProps> = ({ onAnalysis, loading }) => {
  const [birthDate, setBirthDate] = useState('');
  const [fullName, setFullName] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('general');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activityOptions: { value: ActivityType; label: string; description: string }[] = [
    { value: 'marriage', label: 'Marriage', description: 'Wedding and matrimonial activities' },
    { value: 'business', label: 'Business', description: 'Starting or expanding business ventures' },
    { value: 'education', label: 'Education', description: 'Academic pursuits and examinations' },
    { value: 'travel', label: 'Travel', description: 'Journeys and relocation' },
    { value: 'health', label: 'Health', description: 'Medical treatments and wellness' },
    { value: 'career', label: 'Career', description: 'Job changes and professional growth' },
    { value: 'finance', label: 'Finance', description: 'Financial investments and decisions' },
    { value: 'general', label: 'General', description: 'General auspicious timing and lucky numbers' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!birthDate) {
      newErrors.birthDate = 'Birth date is required';
    } else {
      const date = new Date(birthDate);
      if (isNaN(date.getTime())) {
        newErrors.birthDate = 'Please enter a valid date';
      } else if (date > new Date()) {
        newErrors.birthDate = 'Birth date cannot be in the future';
      }
    }

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    } else {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        newErrors.startDate = 'Please enter a valid start date';
      }
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    } else {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        newErrors.endDate = 'Please enter a valid end date';
      } else if (startDate) {
        const start = new Date(startDate);
        if (end < start) {
          newErrors.endDate = 'End date must be after start date';
        } else if ((end.getTime() - start.getTime()) > (365 * 24 * 60 * 60 * 1000)) {
          newErrors.endDate = 'Date range cannot exceed 1 year';
        }
      }
    }

    if (latitude && (isNaN(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90)) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }

    if (longitude && (isNaN(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180)) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const preferences = {
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined
    };

    onAnalysis(
      new Date(birthDate),
      fullName.trim(),
      activityType,
      { start: new Date(startDate), end: new Date(endDate) },
      preferences
    );
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="zc111-input">
      <div className="input-header">
        <h2>Personal Information</h2>
        <p>Enter your details to generate personalized lucky numbers and auspicious timing analysis</p>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="form-section">
          <h3>Basic Information</h3>

          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className={errors.fullName ? 'error' : ''}
              disabled={loading}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="birthDate">
              Birth Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={errors.birthDate ? 'error' : ''}
              disabled={loading}
            />
            {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Activity & Timing</h3>

          <div className="form-group">
            <label htmlFor="activityType">
              Activity Type <span className="required">*</span>
            </label>
            <select
              id="activityType"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value as ActivityType)}
              disabled={loading}
            >
              {activityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="field-description">
              {activityOptions.find(opt => opt.value === activityType)?.description}
            </p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">
                Start Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={errors.startDate ? 'error' : ''}
                disabled={loading}
              />
              {errors.startDate && <span className="error-message">{errors.startDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="endDate">
                End Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={errors.endDate ? 'error' : ''}
                disabled={loading}
              />
              {errors.endDate && <span className="error-message">{errors.endDate}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Location (Optional)</h3>
          <p className="section-description">
            Location coordinates help provide more accurate timing calculations based on your position
          </p>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="latitude">Latitude</label>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="-90 to 90"
                step="0.000001"
                min="-90"
                max="90"
                className={errors.latitude ? 'error' : ''}
                disabled={loading}
              />
              {errors.latitude && <span className="error-message">{errors.latitude}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="longitude">Longitude</label>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="-180 to 180"
                step="0.000001"
                min="-180"
                max="180"
                className={errors.longitude ? 'error' : ''}
                disabled={loading}
              />
              {errors.longitude && <span className="error-message">{errors.longitude}</span>}
            </div>
          </div>

          <button
            type="button"
            className="location-btn"
            onClick={getCurrentLocation}
            disabled={loading}
          >
            📍 Use Current Location
          </button>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="analyze-btn"
            disabled={loading}
          >
            {loading ? '🔄 Analyzing...' : '🔢 Generate Analysis'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ZC111Input;