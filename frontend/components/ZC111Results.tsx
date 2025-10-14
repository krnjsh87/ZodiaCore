import React from 'react';
import { ZC111Analysis } from '../types/astrology';

interface ZC111ResultsProps {
  analysis: ZC111Analysis | null;
  onSelectAnalysis: (analysis: ZC111Analysis) => void;
  loading: boolean;
}

const ZC111Results: React.FC<ZC111ResultsProps> = ({ analysis, onSelectAnalysis, loading }) => {
  if (loading) {
    return (
      <div className="zc111-results loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Generating your personalized lucky number and timing analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="zc111-results error">
        <div className="error-content">
          <h3>No Analysis Available</h3>
          <p>Please go back and generate a new analysis.</p>
        </div>
      </div>
    );
  }

  const { numerologyProfile, activityRecommendations, integratedAnalysis, comprehensiveReport } = analysis;

  return (
    <div className="zc111-results">
      <div className="results-header">
        <h2>Analysis Complete</h2>
        <p>Your personalized lucky number and auspicious timing analysis is ready</p>
      </div>

      {/* Executive Summary */}
      <div className="results-section executive-summary">
        <h3>📊 Executive Summary</h3>
        <div className="summary-card">
          <div className="summary-key-findings">
            <h4>Key Findings</h4>
            <ul>
              {comprehensiveReport.executiveSummary.keyFindings.map((finding, index) => (
                <li key={index}>{finding}</li>
              ))}
            </ul>
          </div>
          <div className="summary-recommendations">
            <h4>Recommendations</h4>
            <ul>
              {comprehensiveReport.executiveSummary.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Lucky Numbers Overview */}
      <div className="results-section lucky-numbers">
        <h3>🔢 Your Lucky Numbers</h3>
        <div className="numbers-grid">
          <div className="number-category primary">
            <h4>Primary Lucky Numbers</h4>
            <div className="numbers-list">
              {numerologyProfile.categories.primary.numbers.map((num, index) => (
                <div key={index} className="lucky-number primary">
                  <span className="number">{num}</span>
                  <span className="significance">
                    {numerologyProfile.categories.primary.significance[index]?.significance.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="number-category secondary">
            <h4>Secondary Lucky Numbers</h4>
            <div className="numbers-list">
              {numerologyProfile.categories.secondary.numbers.slice(0, 6).map((num, index) => (
                <div key={index} className="lucky-number secondary">
                  <span className="number">{num}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Numerology Profile */}
      <div className="results-section numerology-profile">
        <h3>📈 Numerology Profile</h3>
        <div className="profile-cards">
          <div className="profile-card">
            <h4>Life Path Number</h4>
            <div className="number-display">
              <span className="big-number">
                {numerologyProfile.profile.systems.vedic.lifePath.lifePathNumber}
              </span>
              <span className="planet-name">
                {numerologyProfile.profile.systems.vedic.lifePath.significance.name}
              </span>
            </div>
            <p className="qualities">
              {numerologyProfile.profile.systems.vedic.lifePath.significance.qualities.join(', ')}
            </p>
          </div>

          <div className="profile-card">
            <h4>Destiny Number</h4>
            <div className="number-display">
              <span className="big-number">
                {numerologyProfile.profile.systems.vedic.destiny.destinyNumber}
              </span>
              <span className="planet-name">
                {numerologyProfile.profile.systems.vedic.destiny.significance.name}
              </span>
            </div>
            <p className="qualities">
              {numerologyProfile.profile.systems.vedic.destiny.significance.qualities.join(', ')}
            </p>
          </div>

          <div className="profile-card">
            <h4>Soul Urge Number</h4>
            <div className="number-display">
              <span className="big-number">
                {numerologyProfile.profile.systems.vedic.soulUrge.soulUrgeNumber}
              </span>
              <span className="planet-name">
                {numerologyProfile.profile.systems.vedic.soulUrge.significance.name}
              </span>
            </div>
            <p className="qualities">
              {numerologyProfile.profile.systems.vedic.soulUrge.significance.qualities.join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* Activity-Specific Guidance */}
      <div className="results-section activity-guidance">
        <h3>🎯 {activityRecommendations.activityType.charAt(0).toUpperCase() + activityRecommendations.activityType.slice(1)} Guidance</h3>
        <div className="guidance-content">
          <div className="lucky-numbers-section">
            <h4>Recommended Lucky Numbers</h4>
            <div className="activity-numbers">
              {activityRecommendations.luckyNumbers.map((item, index) => (
                <div key={index} className={`activity-number ${item.priority}`}>
                  <span className="number">{item.number}</span>
                  <span className="reason">{item.reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="timing-info">
            <h4>Auspicious Months</h4>
            <div className="months-list">
              {activityRecommendations.auspiciousMonths.map((month, index) => (
                <span key={index} className="month-badge">{month}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Timing Recommendations */}
      <div className="results-section timing-recommendations">
        <h3>⏰ Top Auspicious Timings</h3>
        <div className="timing-list">
          {integratedAnalysis.integratedRecommendations.slice(0, 3).map((timing, index) => (
            <div key={index} className="timing-card">
              <div className="timing-header">
                <span className="rank">#{index + 1}</span>
                <span className="date">{timing.date.toLocaleDateString()}</span>
                <span className="compatibility">
                  {Math.round(timing.adjustedScore.combinedScore * 100)}% Compatible
                </span>
              </div>
              <div className="timing-details">
                <p><strong>Lucky Numbers:</strong> {timing.numerology.dateNumbers.join(', ')}</p>
                <p><strong>Compatibility Score:</strong> {Math.round(timing.numerology.compatibilityScore * 100)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="results-actions">
        <button
          className="view-details-btn"
          onClick={() => onSelectAnalysis(analysis)}
        >
          📋 View Detailed Report
        </button>
        <button
          className="download-btn"
          onClick={() => {
            // TODO: Implement PDF download
            alert('PDF download feature coming soon!');
          }}
        >
          📥 Download Report
        </button>
      </div>
    </div>
  );
};

export default ZC111Results;