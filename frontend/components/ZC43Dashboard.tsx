import React, { useState } from 'react';
import NumerologyInput from './NumerologyInput';
import './ZC43Dashboard.css';

/**
 * ZC4.3 Lucky Number & Auspicious Timing Generator Dashboard
 * Main component for ZC4.3 numerology-timing analysis
 */
interface ZC43Analysis {
  numerologyProfile: any;
  luckyNumbers: any;
  timingAnalysis: any;
  recommendations: any;
  comprehensiveReport: any;
  metadata: any;
}

interface ZC43InputData {
  birthDate: string;
  fullName: string;
  activityType: string;
  dateRange: {
    start: string;
    end: string;
  };
  options?: {
    preferences?: {
      riskTolerance?: 'low' | 'moderate' | 'high';
      culturalPreferences?: string[];
    };
  };
}

const ZC43Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<'input' | 'results'>('input');
  const [analysis, setAnalysis] = useState<ZC43Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle form submission from input component
   */
  const handleInputSubmit = async (inputData: ZC43InputData) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await astrologyApi.generateZC43Analysis(inputData);

      // Mock API call for now
      const mockResponse = await mockZC43Analysis(inputData);

      if (mockResponse.success) {
        setAnalysis(mockResponse.data);
        setCurrentView('results');
      } else {
        setError(mockResponse.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle back to input view
   */
  const handleBackToInput = () => {
    setCurrentView('input');
    setAnalysis(null);
    setError(null);
  };

  /**
   * Mock ZC4.3 analysis for development
   */
  const mockZC43Analysis = async (inputData: ZC43InputData): Promise<{ success: boolean; data?: ZC43Analysis; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock response based on ZC4.3 specification
    const mockAnalysis: ZC43Analysis = {
      numerologyProfile: {
        lifePath: {
          lifePathNumber: 3,
          significance: { name: 'Creative Expression' },
          timingSignificance: { rulingPlanet: 'JUPITER' }
        },
        destiny: {
          destinyNumber: 6,
          significance: { name: 'Harmony and Service' }
        }
      },
      luckyNumbers: {
        baseLucky: { primary: [3, 6, 9], secondary: [1, 5] },
        timingLucky: { current: [8, 9], personalYear: 5 }
      },
      timingAnalysis: {
        recommendedTimings: [
          {
            date: '2024-06-15',
            timeSlot: 'morning',
            overallScore: 0.85,
            numerologicalDay: 6
          },
          {
            date: '2024-07-20',
            timeSlot: 'afternoon',
            overallScore: 0.82,
            numerologicalDay: 9
          }
        ]
      },
      recommendations: {
        primaryLuckyNumbers: [3, 6, 9],
        recommendedTimings: [
          { date: '2024-06-15', timeSlot: 'morning' }
        ],
        confidence: 0.85,
        precautions: [
          'Consult with numerology experts for important decisions',
          'Consider both numerological and practical factors'
        ]
      },
      comprehensiveReport: {
        executiveSummary: {
          primaryLuckyNumbers: [3, 6, 9],
          recommendedTiming: '2024-06-15',
          confidence: 0.85
        }
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        systemVersion: '1.0.0',
        activityType: inputData.activityType,
        confidence: 0.85
      }
    };

    return { success: true, data: mockAnalysis };
  };

  return (
    <div className="zc43-dashboard">
      <div className="dashboard-header">
        <h1>ZC4.3 Lucky Number & Auspicious Timing Generator</h1>
        <p>Advanced numerology with personalized timing recommendations</p>
      </div>

      {currentView === 'input' ? (
        <ZC43InputForm
          onSubmit={handleInputSubmit}
          loading={loading}
          error={error}
        />
      ) : (
        <ZC43ResultsView
          analysis={analysis!}
          onBack={handleBackToInput}
        />
      )}
    </div>
  );
};

/**
 * ZC4.3 Input Form Component
 */
interface ZC43InputFormProps {
  onSubmit: (data: ZC43InputData) => void;
  loading: boolean;
  error: string | null;
}

const ZC43InputForm: React.FC<ZC43InputFormProps> = ({ onSubmit, loading, error }) => {
  const [birthDate, setBirthDate] = useState('');
  const [fullName, setFullName] = useState('');
  const [activityType, setActivityType] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const activityTypes = [
    { value: 'marriage', label: 'Marriage' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'travel', label: 'Travel' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'career', label: 'Career' }
  ];

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Birth date validation
    if (!birthDate) {
      errors.birthDate = 'Birth date is required';
    } else {
      const date = new Date(birthDate);
      if (isNaN(date.getTime())) {
        errors.birthDate = 'Please enter a valid date';
      } else if (date > new Date()) {
        errors.birthDate = 'Birth date cannot be in the future';
      }
    }

    // Full name validation
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters long';
    }

    // Activity type validation
    if (!activityType) {
      errors.activityType = 'Please select an activity type';
    }

    // Date range validation
    if (!dateRangeStart || !dateRangeEnd) {
      errors.dateRange = 'Date range is required';
    } else {
      const start = new Date(dateRangeStart);
      const end = new Date(dateRangeEnd);
      if (start >= end) {
        errors.dateRange = 'End date must be after start date';
      }
      const daysDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > 365) {
        errors.dateRange = 'Date range cannot exceed 1 year';
      }
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
      const inputData: ZC43InputData = {
        birthDate,
        fullName: fullName.trim(),
        activityType,
        dateRange: {
          start: dateRangeStart,
          end: dateRangeEnd
        }
      };
      onSubmit(inputData);
    }
  };

  return (
    <div className="zc43-input-form">
      <div className="form-header">
        <h2>Enter Your Details</h2>
        <p>Provide your information for personalized lucky number and timing analysis</p>
      </div>

      <form onSubmit={handleSubmit} className="zc43-form">
        <div className="form-row">
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
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="activityType" className="form-label">
            Activity Type *
          </label>
          <select
            id="activityType"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            className={`form-select ${validationErrors.activityType ? 'error' : ''}`}
            disabled={loading}
            required
            aria-describedby={validationErrors.activityType ? 'activityType-error' : undefined}
          >
            <option value="">Select an activity type</option>
            {activityTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {validationErrors.activityType && (
            <span id="activityType-error" className="error-message" role="alert">
              {validationErrors.activityType}
            </span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dateRangeStart" className="form-label">
              Analysis Start Date *
            </label>
            <input
              type="date"
              id="dateRangeStart"
              value={dateRangeStart}
              onChange={(e) => setDateRangeStart(e.target.value)}
              className={`form-input ${validationErrors.dateRange ? 'error' : ''}`}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateRangeEnd" className="form-label">
              Analysis End Date *
            </label>
            <input
              type="date"
              id="dateRangeEnd"
              value={dateRangeEnd}
              onChange={(e) => setDateRangeEnd(e.target.value)}
              className={`form-input ${validationErrors.dateRange ? 'error' : ''}`}
              disabled={loading}
              required
            />
          </div>
        </div>
        {validationErrors.dateRange && (
          <div className="error-message" role="alert">
            {validationErrors.dateRange}
          </div>
        )}

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
          {loading ? 'Generating Analysis...' : 'Generate ZC4.3 Analysis'}
        </button>

        {loading && (
          <div id="loading-status" className="loading-indicator" aria-live="polite">
            Processing your numerology-timing analysis...
          </div>
        )}
      </form>

      <div className="form-info">
        <div className="info-section">
          <h3>What You'll Discover</h3>
          <ul>
            <li><strong>Lucky Numbers:</strong> Primary and secondary numbers based on your numerology</li>
            <li><strong>Auspicious Timing:</strong> Optimal dates and times for your selected activity</li>
            <li><strong>Personalized Recommendations:</strong> Activity-specific guidance and precautions</li>
            <li><strong>Comprehensive Report:</strong> Detailed analysis with confidence scores</li>
          </ul>
        </div>

        <div className="info-section">
          <h3>Privacy Notice</h3>
          <p>
            Your personal information is used solely for this numerological analysis and is not stored
            or shared. All calculations are performed locally for your privacy.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * ZC4.3 Results View Component
 */
interface ZC43ResultsViewProps {
  analysis: ZC43Analysis;
  onBack: () => void;
}

const ZC43ResultsView: React.FC<ZC43ResultsViewProps> = ({ analysis, onBack }) => {
  return (
    <div className="zc43-results">
      <div className="results-header">
        <button
          onClick={onBack}
          className="back-button"
          aria-label="Return to input form"
        >
          ← Back to Input
        </button>
        <h2>Your ZC4.3 Analysis Results</h2>
        <div className="confidence-score">
          Confidence: {Math.round(analysis.metadata.confidence * 100)}%
        </div>
      </div>

      <div className="results-content">
        {/* Executive Summary */}
        <section className="results-section">
          <h3>Executive Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <h4>Primary Lucky Numbers</h4>
              <div className="lucky-numbers">
                {analysis.recommendations.primaryLuckyNumbers.map((num: number) => (
                  <span key={num} className="lucky-number">{num}</span>
                ))}
              </div>
            </div>
            <div className="summary-item">
              <h4>Best Timing</h4>
              <p>{analysis.comprehensiveReport.executiveSummary.recommendedTiming}</p>
            </div>
            <div className="summary-item">
              <h4>Activity Type</h4>
              <p>{analysis.metadata.activityType}</p>
            </div>
          </div>
        </section>

        {/* Numerology Profile */}
        <section className="results-section">
          <h3>Numerology Profile</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <h4>Life Path Number</h4>
              <div className="number-display">{analysis.numerologyProfile.lifePath.lifePathNumber}</div>
              <p>{analysis.numerologyProfile.lifePath.significance.name}</p>
            </div>
            <div className="profile-item">
              <h4>Destiny Number</h4>
              <div className="number-display">{analysis.numerologyProfile.destiny.destinyNumber}</div>
              <p>{analysis.numerologyProfile.destiny.significance.name}</p>
            </div>
          </div>
        </section>

        {/* Lucky Numbers */}
        <section className="results-section">
          <h3>Lucky Numbers</h3>
          <div className="lucky-numbers-section">
            <div className="lucky-category">
              <h4>Primary Numbers</h4>
              <div className="lucky-numbers">
                {analysis.luckyNumbers.baseLucky.primary.map((num: number) => (
                  <span key={num} className="lucky-number primary">{num}</span>
                ))}
              </div>
            </div>
            <div className="lucky-category">
              <h4>Secondary Numbers</h4>
              <div className="lucky-numbers">
                {analysis.luckyNumbers.baseLucky.secondary.map((num: number) => (
                  <span key={num} className="lucky-number secondary">{num}</span>
                ))}
              </div>
            </div>
            <div className="lucky-category">
              <h4>Current Timing Numbers</h4>
              <div className="lucky-numbers">
                {analysis.luckyNumbers.timingLucky.current.map((num: number) => (
                  <span key={num} className="lucky-number timing">{num}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Auspicious Timing */}
        <section className="results-section">
          <h3>Auspicious Timing</h3>
          <div className="timing-list">
            {analysis.timingAnalysis.recommendedTimings.map((timing: any, index: number) => (
              <div key={index} className="timing-item">
                <div className="timing-header">
                  <span className="timing-date">{timing.date}</span>
                  <span className="timing-score">
                    Score: {Math.round(timing.overallScore * 100)}%
                  </span>
                </div>
                <div className="timing-details">
                  <span className="timing-slot">{timing.timeSlot}</span>
                  <span className="numerological-day">Day: {timing.numerologicalDay}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="results-section">
          <h3>Personalized Recommendations</h3>
          <div className="recommendations-content">
            <div className="recommendations-list">
              <h4>Recommended Timings</h4>
              <ul>
                {analysis.recommendations.recommendedTimings.map((timing: any, index: number) => (
                  <li key={index}>
                    {timing.date} during {timing.timeSlot} hours
                  </li>
                ))}
              </ul>
            </div>
            <div className="precautions-list">
              <h4>Important Precautions</h4>
              <ul>
                {analysis.recommendations.precautions.map((precaution: string, index: number) => (
                  <li key={index}>{precaution}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Metadata */}
        <section className="results-section metadata">
          <h3>Analysis Details</h3>
          <div className="metadata-grid">
            <div className="metadata-item">
              <span className="label">Generated:</span>
              <span className="value">
                {new Date(analysis.metadata.generatedAt).toLocaleString()}
              </span>
            </div>
            <div className="metadata-item">
              <span className="label">System Version:</span>
              <span className="value">{analysis.metadata.systemVersion}</span>
            </div>
            <div className="metadata-item">
              <span className="label">Confidence:</span>
              <span className="value">{Math.round(analysis.metadata.confidence * 100)}%</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ZC43Dashboard;