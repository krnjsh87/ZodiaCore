import React, { useState } from 'react';
import './PersonalCyclesInput.css';

/**
 * Personal Cycles Input Component
 * Form component for collecting birth date and optional target date for personal cycles calculation
 */
interface PersonalCyclesInputProps {
  onSubmit: (birthDate: string, targetDate?: string) => void;
  loading: boolean;
  error: string | null;
}

const PersonalCyclesInput: React.FC<PersonalCyclesInputProps> = ({
  onSubmit,
  loading,
  error
}) => {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [useCurrentDate, setUseCurrentDate] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  /**
   * Validate date format (YYYY-MM-DD)
   */
  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate birth date
    if (!birthDate) {
      setFormError('Birth date is required');
      return;
    }

    if (!isValidDate(birthDate)) {
      setFormError('Please enter a valid birth date');
      return;
    }

    // Validate target date if provided
    if (!useCurrentDate && targetDate && !isValidDate(targetDate)) {
      setFormError('Please enter a valid target date');
      return;
    }

    // Check if birth date is not in the future
    const birth = new Date(birthDate);
    const now = new Date();
    if (birth > now) {
      setFormError('Birth date cannot be in the future');
      return;
    }

    // Submit the form
    onSubmit(birthDate, useCurrentDate ? undefined : targetDate || undefined);
  };

  /**
   * Handle current date toggle
   */
  const handleCurrentDateToggle = (checked: boolean) => {
    setUseCurrentDate(checked);
    if (checked) {
      setTargetDate('');
    }
  };

  return (
    <div className="personal-cycles-input">
      <div className="input-header">
        <h2>Personal Cycles Calculator</h2>
        <p>Enter your birth date to discover your Personal Year, Month, and Day cycles</p>
      </div>

      <form onSubmit={handleSubmit} className="cycles-form">
        <div className="form-group">
          <label htmlFor="birthDate" className="required">
            Birth Date
          </label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="date-input"
            required
            aria-describedby="birthDate-help"
            disabled={loading}
          />
          <small id="birthDate-help" className="form-help">
            Your date of birth in Gregorian calendar format
          </small>
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="useCurrentDate"
              checked={useCurrentDate}
              onChange={(e) => handleCurrentDateToggle(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="useCurrentDate">
              Calculate for today ({new Date().toLocaleDateString()})
            </label>
          </div>
        </div>

        {!useCurrentDate && (
          <div className="form-group">
            <label htmlFor="targetDate">
              Target Date (Optional)
            </label>
            <input
              type="date"
              id="targetDate"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="date-input"
              aria-describedby="targetDate-help"
              disabled={loading}
            />
            <small id="targetDate-help" className="form-help">
              Date to analyze cycles for (defaults to today if empty)
            </small>
          </div>
        )}

        {(formError || error) && (
          <div className="form-error" role="alert">
            <span className="error-icon">⚠️</span>
            <span>{formError || error}</span>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="calculate-button"
            disabled={loading || !birthDate}
          >
            {loading ? 'Calculating...' : 'Calculate Personal Cycles'}
          </button>
        </div>
      </form>

      <div className="input-info">
        <div className="info-section">
          <h3>What are Personal Cycles?</h3>
          <p>
            Personal cycles reveal timing influences based on Pythagorean numerology.
            Your Personal Year shows annual themes, Personal Month shows monthly influences,
            and Personal Day shows daily energy patterns.
          </p>
        </div>

        <div className="info-section">
          <h3>How it works</h3>
          <ul>
            <li>Personal Year = Birth Month + Birth Day + Current Year</li>
            <li>Personal Month = Personal Year + Current Month</li>
            <li>Personal Day = Personal Month + Current Day</li>
            <li>All numbers reduced to single digits (1-9)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PersonalCyclesInput;