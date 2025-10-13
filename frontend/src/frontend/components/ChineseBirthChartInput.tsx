import React, { useState } from 'react';
import { ChineseBirthData } from '../types/astrology';
import './ChineseBirthChartInput.css';

interface ChineseBirthChartInputProps {
  onSubmit: (birthData: ChineseBirthData) => void;
  loading?: boolean;
  className?: string;
}

/**
 * Chinese Birth Chart Input Form Component
 * Collects birth data for generating Chinese birth charts
 */
const ChineseBirthChartInput: React.FC<ChineseBirthChartInputProps> = ({
  onSubmit,
  loading = false,
  className = ''
}) => {
  const [birthData, setBirthData] = useState<ChineseBirthData>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: 12,
    minute: 0,
    second: 0,
    timezoneOffset: new Date().getTimezoneOffset() / -60
  });

  const [errors, setErrors] = useState<Partial<ChineseBirthData>>({});

  const handleInputChange = (field: keyof ChineseBirthData, value: number) => {
    setBirthData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ChineseBirthData> = {};

    if (birthData.year < 1900 || birthData.year > 2100) {
      newErrors.year = 1900;
    }

    if (birthData.month < 1 || birthData.month > 12) {
      newErrors.month = 1;
    }

    // Validate day based on month and leap year
    const daysInMonth = getDaysInMonth(birthData.year, birthData.month);
    if (birthData.day < 1 || birthData.day > daysInMonth) {
      newErrors.day = 1;
    }

    if (birthData.hour < 0 || birthData.hour > 23) {
      newErrors.hour = 0;
    }

    if (birthData.minute < 0 || birthData.minute > 59) {
      newErrors.minute = 0;
    }

    if (birthData.second < 0 || birthData.second > 59) {
      newErrors.second = 0;
    }

    if (birthData.timezoneOffset !== undefined &&
        (birthData.timezoneOffset < -12 || birthData.timezoneOffset > 14)) {
      newErrors.timezoneOffset = 0;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(birthData);
    }
  };

  const getDaysInMonth = (year: number, month: number): number => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && isLeapYear(year)) {
      return 29;
    }
    return daysInMonth[month - 1];
  };

  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1900; year <= currentYear + 10; year++) {
      years.push(year);
    }
    return years;
  };

  const generateHourOptions = () => {
    const hours = [];
    for (let hour = 0; hour < 24; hour++) {
      hours.push(hour);
    }
    return hours;
  };

  const generateMinuteOptions = () => {
    const minutes = [];
    for (let minute = 0; minute < 60; minute += 5) {
      minutes.push(minute);
    }
    return minutes;
  };

  const formatHour = (hour: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour} ${period}`;
  };

  return (
    <div className={`chinese-birth-input ${className}`}>
      <div className="input-header">
        <h2>Enter Your Birth Details</h2>
        <p>Provide accurate birth information for your Chinese birth chart</p>
      </div>

      <form onSubmit={handleSubmit} className="birth-form">
        {/* Date Section */}
        <fieldset className="form-section">
          <legend>Birth Date</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">Year</label>
              <select
                id="year"
                value={birthData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                className={errors.year ? 'error' : ''}
                disabled={loading}
              >
                {generateYearOptions().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {errors.year && <span className="error-message">Year must be between 1900 and {new Date().getFullYear() + 10}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="month">Month</label>
              <select
                id="month"
                value={birthData.month}
                onChange={(e) => handleInputChange('month', parseInt(e.target.value))}
                className={errors.month ? 'error' : ''}
                disabled={loading}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>
                    {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              {errors.month && <span className="error-message">Invalid month</span>}
            </div>

            <div className="form-group">
              <label htmlFor="day">Day</label>
              <select
                id="day"
                value={birthData.day}
                onChange={(e) => handleInputChange('day', parseInt(e.target.value))}
                className={errors.day ? 'error' : ''}
                disabled={loading}
              >
                {Array.from({ length: getDaysInMonth(birthData.year, birthData.month) }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              {errors.day && <span className="error-message">Invalid day for selected month</span>}
            </div>
          </div>
        </fieldset>

        {/* Time Section */}
        <fieldset className="form-section">
          <legend>Birth Time</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hour">Hour</label>
              <select
                id="hour"
                value={birthData.hour}
                onChange={(e) => handleInputChange('hour', parseInt(e.target.value))}
                className={errors.hour ? 'error' : ''}
                disabled={loading}
              >
                {generateHourOptions().map(hour => (
                  <option key={hour} value={hour}>{formatHour(hour)}</option>
                ))}
              </select>
              {errors.hour && <span className="error-message">Hour must be between 0 and 23</span>}
            </div>

            <div className="form-group">
              <label htmlFor="minute">Minute</label>
              <select
                id="minute"
                value={birthData.minute}
                onChange={(e) => handleInputChange('minute', parseInt(e.target.value))}
                className={errors.minute ? 'error' : ''}
                disabled={loading}
              >
                {generateMinuteOptions().map(minute => (
                  <option key={minute} value={minute}>
                    {minute.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
              {errors.minute && <span className="error-message">Minute must be between 0 and 59</span>}
            </div>

            <div className="form-group">
              <label htmlFor="second">Second</label>
              <input
                type="number"
                id="second"
                min="0"
                max="59"
                value={birthData.second}
                onChange={(e) => handleInputChange('second', parseInt(e.target.value) || 0)}
                className={errors.second ? 'error' : ''}
                disabled={loading}
              />
              {errors.second && <span className="error-message">Second must be between 0 and 59</span>}
            </div>
          </div>
        </fieldset>

        {/* Timezone Section */}
        <fieldset className="form-section">
          <legend>Timezone (Optional)</legend>

          <div className="form-group">
            <label htmlFor="timezone">Timezone Offset (hours from UTC)</label>
            <input
              type="number"
              id="timezone"
              min="-12"
              max="14"
              step="0.5"
              value={birthData.timezoneOffset || ''}
              onChange={(e) => handleInputChange('timezoneOffset', parseFloat(e.target.value) || 0)}
              className={errors.timezoneOffset ? 'error' : ''}
              disabled={loading}
              placeholder="Auto-detected"
            />
            {errors.timezoneOffset && <span className="error-message">Timezone offset must be between -12 and 14</span>}
            <small className="help-text">
              Leave empty to use your current timezone ({birthData.timezoneOffset} hours from UTC)
            </small>
          </div>
        </fieldset>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Generating Chart...' : 'Generate Chinese Birth Chart'}
          </button>
        </div>
      </form>

      {/* Information Section */}
      <div className="info-section">
        <h3>Why Accurate Birth Time Matters</h3>
        <ul>
          <li><strong>Year Pillar:</strong> Determines your zodiac animal and basic life themes</li>
          <li><strong>Month Pillar:</strong> Influences career and monthly cycles</li>
          <li><strong>Day Pillar:</strong> Represents your core personality and destiny</li>
          <li><strong>Hour Pillar:</strong> Affects daily rhythms and relationships</li>
        </ul>
        <p className="disclaimer">
          For the most accurate results, provide your exact birth time. If unknown, you can still generate a chart using noon (12:00 PM) as an approximation.
        </p>
      </div>
    </div>
  );
};

export default ChineseBirthChartInput;