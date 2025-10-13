/**
 * ZodiaCore - Horoscope Input Component
 *
 * Input component for selecting horoscope type, date, and triggering generation.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

import React from 'react';
import { HoroscopeType } from '../types/astrology';
import './HoroscopeInput.css';

interface HoroscopeInputProps {
  selectedType: HoroscopeType;
  selectedDate: Date;
  onTypeChange: (type: HoroscopeType) => void;
  onDateChange: (date: Date) => void;
  onGenerate: () => void;
  onGenerateAll: () => void;
  loading: boolean;
}

/**
 * Horoscope Input Component
 * Provides controls for horoscope generation
 */
const HoroscopeInput: React.FC<HoroscopeInputProps> = ({
  selectedType,
  selectedDate,
  onTypeChange,
  onDateChange,
  onGenerate,
  onGenerateAll,
  loading
}) => {
  const horoscopeTypes: { value: HoroscopeType; label: string; description: string }[] = [
    { value: 'daily', label: 'Daily', description: '24-hour predictions with Panchang elements' },
    { value: 'weekly', label: 'Weekly', description: '7-day overview with peak and challenging days' },
    { value: 'monthly', label: 'Monthly', description: '30-day analysis with lunar phases' },
    { value: 'yearly', label: 'Yearly', description: 'Annual predictions with major events' }
  ];

  /**
   * Handle date input change
   */
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    if (!isNaN(newDate.getTime())) {
      onDateChange(newDate);
    }
  };

  /**
   * Format date for input field
   */
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="horoscope-input">
      <div className="horoscope-input__section">
        <h3 className="horoscope-input__section-title">Horoscope Type</h3>
        <div className="horoscope-input__type-selector">
          {horoscopeTypes.map((type) => (
            <label key={type.value} className="horoscope-input__type-option">
              <input
                type="radio"
                name="horoscope-type"
                value={type.value}
                checked={selectedType === type.value}
                onChange={() => onTypeChange(type.value)}
                disabled={loading}
                className="horoscope-input__radio"
              />
              <div className="horoscope-input__type-content">
                <span className="horoscope-input__type-label">{type.label}</span>
                <span className="horoscope-input__type-description">{type.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="horoscope-input__section">
        <h3 className="horoscope-input__section-title">Date Selection</h3>
        <div className="horoscope-input__date-selector">
          <label htmlFor="horoscope-date" className="horoscope-input__date-label">
            Select Date:
          </label>
          <input
            id="horoscope-date"
            type="date"
            value={formatDateForInput(selectedDate)}
            onChange={handleDateChange}
            disabled={loading}
            className="horoscope-input__date-input"
            min="1900-01-01"
            max="2100-12-31"
          />
          <div className="horoscope-input__date-info">
            <span className="horoscope-input__date-display">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="horoscope-input__section">
        <h3 className="horoscope-input__section-title">Generate Horoscope</h3>
        <div className="horoscope-input__actions">
          <button
            onClick={onGenerate}
            disabled={loading}
            className="horoscope-input__button horoscope-input__button--primary"
          >
            {loading ? 'Generating...' : `Generate ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Horoscope`}
          </button>

          <button
            onClick={onGenerateAll}
            disabled={loading}
            className="horoscope-input__button horoscope-input__button--secondary"
          >
            {loading ? 'Generating...' : 'Generate All Horoscopes'}
          </button>
        </div>

        <div className="horoscope-input__help">
          <p className="horoscope-input__help-text">
            <strong>Daily:</strong> Includes Tithi, Nakshatra, Yoga, Karana, and auspicious hours<br/>
            <strong>Weekly:</strong> Shows peak days, challenges, and best activities<br/>
            <strong>Monthly:</strong> Covers lunar phases and planetary movements<br/>
            <strong>Yearly:</strong> Major events and life area focus
          </p>
        </div>
      </div>
    </div>
  );
};

export default HoroscopeInput;