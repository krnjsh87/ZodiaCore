import React, { useState } from 'react';
import './NumerologyInput.css';

/**
 * Numerology Input Component
 * Form for entering birth date and full name for numerology calculation
 */
interface NumerologyInputProps {
  onSubmit: (birthDate: string, fullName: string) => void;
  loading: boolean;
  error: string | null;
}

const NumerologyInput: React.FC<NumerologyInputProps> = ({ onSubmit, loading, error }) => {
  const [birthDate, setBirthDate] = useState('');
  const [fullName, setFullName] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ birthDate?: string; fullName?: string }>({});

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    const errors: { birthDate?: string; fullName?: string } = {};

    // Validate birth date
    if (!birthDate) {
      errors.birthDate = 'Birth date is required';
    } else {
      const date = new Date(birthDate);
      const now = new Date();
      if (isNaN(date.getTime())) {
        errors.birthDate = 'Please enter a valid date';
      } else if (date > now) {
        errors.birthDate = 'Birth date cannot be in the future';
      } else if (date < new Date('1900-01-01')) {
        errors.birthDate = 'Birth date seems too old';
      }
    }

    // Validate full name
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters long';
    } else if (fullName.trim().length > 100) {
      errors.fullName = 'Name must be less than 100 characters';
    } else if (!/^[a-zA-Z\s'-]+$/.test(fullName.trim())) {
      errors.fullName = 'Name can only contain letters, spaces, hyphens, and apostrophes';
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
      onSubmit(birthDate, fullName.trim());
    }
  };

  return (
    <div className="numerology-input">
      <div className="input-header">
        <h2>Enter Your Details</h2>
        <p>Provide your birth date and full name to calculate your numerology profile</p>
      </div>

      <form onSubmit={handleSubmit} className="numerology-form">
        <div className="form-group">
          <label htmlFor="birthDate" className="form-label">
            Birth Date *
          </label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className={`form-input ${validationErrors.birthDate ? 'error' : ''}`}
            disabled={loading}
            required
            aria-describedby={validationErrors.birthDate ? 'birthDate-error' : undefined}
          />
          {validationErrors.birthDate && (
            <span id="birthDate-error" className="error-message" role="alert">
              {validationErrors.birthDate}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="fullName" className="form-label">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`form-input ${validationErrors.fullName ? 'error' : ''}`}
            placeholder="Enter your full birth name"
            disabled={loading}
            required
            aria-describedby={validationErrors.fullName ? 'fullName-error' : undefined}
          />
          {validationErrors.fullName && (
            <span id="fullName-error" className="error-message" role="alert">
              {validationErrors.fullName}
            </span>
          )}
          <small className="form-help">
            Use your full birth name as it appears on official documents
          </small>
        </div>

        {error && (
          <div className="form-error" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        <button
          type="submit"
          className="calculate-button"
          disabled={loading}
          aria-describedby={loading ? 'loading-status' : undefined}
        >
          {loading ? 'Calculating...' : 'Calculate Numerology Profile'}
        </button>

        {loading && (
          <div id="loading-status" className="loading-indicator" aria-live="polite">
            Processing your numerology calculation...
          </div>
        )}
      </form>

      <div className="input-info">
        <div className="info-section">
          <h3>What You'll Discover</h3>
          <ul>
            <li><strong>Life Path Number:</strong> Your primary numerological blueprint</li>
            <li><strong>Destiny Number:</strong> Your life purpose and potential</li>
            <li><strong>Soul Urge Number:</strong> Your inner desires and motivations</li>
            <li><strong>Personality Number:</strong> How others perceive you</li>
            <li><strong>Pinnacle Numbers:</strong> Four life phases with challenges and opportunities</li>
            <li><strong>Lucky Numbers:</strong> Numbers that bring good fortune</li>
          </ul>
        </div>

        <div className="info-section">
          <h3>Privacy Notice</h3>
          <p>
            Your personal information is used only for this calculation and is not stored
            or shared. All processing happens locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NumerologyInput;