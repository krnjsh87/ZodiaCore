import React from 'react';
import { MuhuratReport } from '../types/astrology';

interface MuhuratDetailsProps {
  report: MuhuratReport | null;
  onBack: () => void;
  loading?: boolean;
}

const GRADE_COLORS = {
  'Excellent': '#22c55e',
  'Very Good': '#16a34a',
  'Good': '#eab308',
  'Fair': '#f97316',
  'Poor': '#ef4444',
  'Inauspicious': '#dc2626'
};

const VALIDATION_COLORS = {
  passed: '#22c55e',
  failed: '#ef4444'
};

const MuhuratDetails: React.FC<MuhuratDetailsProps> = ({ report, onBack, loading = false }) => {
  if (loading) {
    return (
      <div className="muhurat-details loading">
        <div className="loading-spinner"></div>
        <p>Generating detailed report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="muhurat-details empty">
        <p>No report selected. Please select a muhurat to view details.</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="muhurat-details">
      <div className="details-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Results
        </button>
        <h2>Detailed Muhurat Report</h2>
      </div>

      {/* Basic Information */}
      <section className="report-section">
        <h3>Basic Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Activity Type:</label>
            <span className="activity-badge">{report.activityType}</span>
          </div>
          <div className="info-item">
            <label>Date:</label>
            <span>{formatDate(report.date)}</span>
          </div>
          {report.timeSlot && (
            <div className="info-item">
              <label>Time Slot:</label>
              <span>{formatTime(report.timeSlot.startTime)} - {formatTime(report.timeSlot.endTime)}</span>
            </div>
          )}
          <div className="info-item">
            <label>Overall Grade:</label>
            <span
              className="grade-badge"
              style={{ backgroundColor: GRADE_COLORS[report.score.grade] }}
            >
              {report.score.grade} ({report.score.totalScore})
            </span>
          </div>
        </div>
      </section>

      {/* Panchang Details */}
      <section className="report-section">
        <h3>Panchang Elements</h3>
        <div className="panchang-grid">
          <div className="panchang-card">
            <h4>Tithi</h4>
            <div className="panchang-content">
              <p className="main-value">{report.panchang.tithi.name}</p>
              <p className="sub-value">Paksha: {report.panchang.tithi.paksha}</p>
              <p className="sub-value">Progress: {(report.panchang.tithi.progress * 100).toFixed(1)}%</p>
              <span className={`status ${report.panchang.tithi.isAuspicious ? 'auspicious' : 'inauspicious'}`}>
                {report.panchang.tithi.isAuspicious ? 'Auspicious' : 'Inauspicious'}
              </span>
            </div>
          </div>

          <div className="panchang-card">
            <h4>Nakshatra</h4>
            <div className="panchang-content">
              <p className="main-value">{report.panchang.nakshatra.name}</p>
              <p className="sub-value">Lord: {report.panchang.nakshatra.lord}</p>
              <p className="sub-value">Pada: {report.panchang.nakshatra.pada}</p>
              <span className={`status ${report.panchang.nakshatra.isAuspicious ? 'auspicious' : 'inauspicious'}`}>
                {report.panchang.nakshatra.isAuspicious ? 'Auspicious' : 'Inauspicious'}
              </span>
            </div>
          </div>

          <div className="panchang-card">
            <h4>Yoga</h4>
            <div className="panchang-content">
              <p className="main-value">{report.panchang.yoga.name}</p>
              <p className="sub-value">Strength: {(report.panchang.yoga.strength * 100).toFixed(0)}%</p>
              <span className={`status ${report.panchang.yoga.isAuspicious ? 'auspicious' : 'inauspicious'}`}>
                {report.panchang.yoga.isAuspicious ? 'Auspicious' : 'Inauspicious'}
              </span>
            </div>
          </div>

          <div className="panchang-card">
            <h4>Karana</h4>
            <div className="panchang-content">
              <p className="main-value">{report.panchang.karana.name}</p>
              <span className={`status ${report.panchang.karana.isAuspicious ? 'auspicious' : 'inauspicious'}`}>
                {report.panchang.karana.isAuspicious ? 'Auspicious' : 'Inauspicious'}
              </span>
            </div>
          </div>

          <div className="panchang-card">
            <h4>Weekday (Vara)</h4>
            <div className="panchang-content">
              <p className="main-value">{report.panchang.vara.name}</p>
              <p className="sub-value">Lord: {report.panchang.vara.lord}</p>
              <p className="sub-value">Nature: {report.panchang.vara.nature}</p>
              <span className={`status ${report.panchang.vara.isAuspicious ? 'auspicious' : 'inauspicious'}`}>
                {report.panchang.vara.isAuspicious ? 'Auspicious' : 'Inauspicious'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis */}
      <section className="report-section">
        <h3>Analysis</h3>

        {report.strengths.length > 0 && (
          <div className="analysis-section">
            <h4>Strengths</h4>
            <ul className="strengths-list">
              {report.strengths.map((strength, index) => (
                <li key={index} className="strength-item">
                  <span className="icon">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {report.weaknesses.length > 0 && (
          <div className="analysis-section">
            <h4>Areas of Concern</h4>
            <ul className="weaknesses-list">
              {report.weaknesses.map((weakness, index) => (
                <li key={index} className="weakness-item">
                  <span className="icon">⚠</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Recommendations */}
      <section className="report-section">
        <h3>Recommendations</h3>
        <div className="recommendations-content">
          <div className="main-recommendation">
            <h4>Overall Recommendation</h4>
            <p className="recommendation-text">{report.recommendations[0]}</p>
          </div>

          {report.remedies.length > 0 && (
            <div className="remedies-section">
              <h4>Suggested Remedies</h4>
              <ul className="remedies-list">
                {report.remedies.map((remedy, index) => (
                  <li key={index} className="remedy-item">
                    <span className="icon">🕉️</span>
                    {remedy}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Validation */}
      <section className="report-section">
        <h3>Validation Checks</h3>
        <div className="validation-grid">
          {Object.entries(report.validation.validations).map(([check, result]) => (
            <div key={check} className="validation-item">
              <div className="validation-header">
                <span className="check-name">
                  {check.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <span
                  className="status-indicator"
                  style={{ backgroundColor: VALIDATION_COLORS[result.passed ? 'passed' : 'failed'] }}
                >
                  {result.passed ? '✓' : '✗'}
                </span>
              </div>
              {result.message && (
                <p className="validation-message">{result.message}</p>
              )}
            </div>
          ))}
        </div>

        <div className="validation-summary">
          <p className={`validation-result ${report.validation.isValid ? 'valid' : 'invalid'}`}>
            {report.validation.isValid
              ? '✓ All validation checks passed. This muhurat appears suitable for your activity.'
              : '⚠ Some validation checks failed. Consider consulting an expert astrologer.'
            }
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="report-section disclaimer-section">
        <h3>Important Disclaimer</h3>
        <div className="disclaimer-content">
          <p>
            <strong>This analysis is based on traditional Vedic astrology principles and is provided for informational purposes only.</strong>
          </p>
          <ul>
            <li>Astrology is not a substitute for professional advice in matters of health, finance, or legal issues.</li>
            <li>Results may vary based on individual birth charts, current planetary transits, and other factors.</li>
            <li>For important life decisions, please consult with qualified astrologers or priests.</li>
            <li>The calculations use astronomical data and traditional formulas but cannot account for all variables.</li>
          </ul>
          <p>
            <em>ZodiaCore recommends using this tool as a guide alongside traditional consultation methods.</em>
          </p>
        </div>
      </section>
    </div>
  );
};

export default MuhuratDetails;