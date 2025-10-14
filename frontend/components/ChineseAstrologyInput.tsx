import React, { useState } from 'react';
import { ChineseBirthData } from '../types/astrology';

/**
 * Props for ChineseAstrologyInput component
 */
interface ChineseAstrologyInputProps {
  onSubmit: (data: ChineseBirthData) => void;
  loading: boolean;
}

/**
 * Input component for Chinese Astrology birth data
 * Collects precise birth information for ZC2.2 calculations
 */
const ChineseAstrologyInput: React.FC<ChineseAstrologyInputProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<ChineseBirthData>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: 12,
    minute: 0,
    second: 0,
    timezone: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Handle input changes with validation
   */
  const handleInputChange = (field: keyof ChineseBirthData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Basic validation
    validateField(field, value);
  };

  /**
   * Validate individual field
   */
  const validateField = (field: keyof ChineseBirthData, value: number) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'year':
        if (value < 1900 || value > 2100) {
          newErrors.year = 'Year must be between 1900 and 2100';
        } else {
          delete newErrors.year;
        }
        break;
      case 'month':
        if (value < 1 || value > 12) {
          newErrors.month = 'Month must be between 1 and 12';
        } else {
          delete newErrors.month;
        }
        break;
      case 'day':
        if (value < 1 || value > 31) {
          newErrors.day = 'Day must be between 1 and 31';
        } else {
          delete newErrors.day;
        }
        break;
      case 'hour':
        if (value < 0 || value >= 24) {
          newErrors.hour = 'Hour must be between 0 and 23';
        } else {
          delete newErrors.hour;
        }
        break;
      case 'minute':
      case 'second':
        if (value < 0 || value >= 60) {
          newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be between 0 and 59`;
        } else {
          delete newErrors[field];
        }
        break;
      case 'timezone':
        if (value < -14 || value > 14) {
          newErrors.timezone = 'Timezone must be between -14 and +14 hours';
        } else {
          delete newErrors.timezone;
        }
        break;
    }

    setErrors(newErrors);
  };

  /**
   * Validate date combination
   */
  const validateDate = () => {
    const { year, month, day } = formData;
    const date = new Date(year, month - 1, day);

    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      setErrors(prev => ({ ...prev, day: 'Invalid date combination' }));
      return false;
    }

    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    Object.keys(formData).forEach(key => {
      validateField(key as keyof ChineseBirthData, formData[key as keyof ChineseBirthData]);
    });

    // Validate date combination
    if (!validateDate()) {
      return;
    }

    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    onSubmit(formData);
  };

  /**
   * Generate hour options for select
   */
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteSecondOptions = Array.from({ length: 60 }, (_, i) => i);
  const timezoneOptions = Array.from({ length: 29 }, (_, i) => i - 14);

  return (
    <div className="chinese-astrology-input">
      <div className="input-header">
        <h2>Enter Your Birth Details</h2>
        <p>For accurate ZC2.2 Chinese Astrology calculations, please provide precise birth information.</p>
      </div>

      <form onSubmit={handleSubmit} className="birth-data-form">
        {/* Date Section */}
        <fieldset className="form-section">
          <legend>Birth Date</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">Year *</label>
              <input
                type="number"
                id="year"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value) || 0)}
                min="1900"
                max="2100"
                required
                className={errors.year ? 'error' : ''}
                disabled={loading}
              />
              {errors.year && <span className="error-text">{errors.year}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="month">Month *</label>
              <input
                type="number"
                id="month"
                value={formData.month}
                onChange={(e) => handleInputChange('month', parseInt(e.target.value) || 0)}
                min="1"
                max="12"
                required
                className={errors.month ? 'error' : ''}
                disabled={loading}
              />
              {errors.month && <span className="error-text">{errors.month}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="day">Day *</label>
              <input
                type="number"
                id="day"
                value={formData.day}
                onChange={(e) => handleInputChange('day', parseInt(e.target.value) || 0)}
                min="1"
                max="31"
                required
                className={errors.day ? 'error' : ''}
                disabled={loading}
              />
              {errors.day && <span className="error-text">{errors.day}</span>}
            </div>
          </div>
        </fieldset>

        {/* Time Section */}
        <fieldset className="form-section">
          <legend>Birth Time</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hour">Hour *</label>
              <select
                id="hour"
                value={formData.hour}
                onChange={(e) => handleInputChange('hour', parseInt(e.target.value))}
                required
                className={errors.hour ? 'error' : ''}
                disabled={loading}
              >
                {hourOptions.map(hour => (
                  <option key={hour} value={hour}>
                    {hour.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
              {errors.hour && <span className="error-text">{errors.hour}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="minute">Minute</label>
              <select
                id="minute"
                value={formData.minute}
                onChange={(e) => handleInputChange('minute', parseInt(e.target.value))}
                disabled={loading}
              >
                {minuteSecondOptions.map(minute => (
                  <option key={minute} value={minute}>
                    {minute.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="second">Second</label>
              <select
                id="second"
                value={formData.second}
                onChange={(e) => handleInputChange('second', parseInt(e.target.value))}
                disabled={loading}
              >
                {minuteSecondOptions.map(second => (
                  <option key={second} value={second}>
                    {second.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Timezone Section */}
        <fieldset className="form-section">
          <legend>Timezone</legend>

          <div className="form-group">
            <label htmlFor="timezone">Timezone Offset (hours)</label>
            <select
              id="timezone"
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', parseInt(e.target.value))}
              disabled={loading}
            >
              {timezoneOptions.map(offset => (
                <option key={offset} value={offset}>
                  {offset >= 0 ? '+' : ''}{offset} hours
                </option>
              ))}
            </select>
            {errors.timezone && <span className="error-text">{errors.timezone}</span>}
            <small className="help-text">
              Select your timezone offset from UTC. For example, IST is +5.5, EST is -5.
            </small>
          </div>
        </fieldset>

        {/* Submit Section */}
        <div className="form-actions">
          <button
            type="submit"
            className="calculate-button"
            disabled={loading || Object.keys(errors).length > 0}
          >
            {loading ? 'Calculating...' : 'Calculate Chinese Astrology'}
          </button>

          <div className="calculation-info">
            <p><strong>Precision Note:</strong> ZC2.2 calculations require accurate birth time for optimal results.</p>
            <p><strong>Privacy:</strong> Your birth data is processed locally and not stored.</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChineseAstrologyInput;