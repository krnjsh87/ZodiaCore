import React from 'react';
import { ZC111Analysis } from '../types/astrology';

interface ZC111DetailsProps {
  analysis: ZC111Analysis | null;
  onBack: () => void;
  loading: boolean;
}

const ZC111Details: React.FC<ZC111DetailsProps> = ({ analysis, onBack, loading }) => {
  if (loading) {
    return (
      <div className="zc111-details loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading detailed report...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="zc111-details error">
        <div className="error-content">
          <h3>No Analysis Available</h3>
          <p>Please go back and generate a new analysis.</p>
        </div>
      </div>
    );
  }

  const { comprehensiveReport, numerologyProfile, activityRecommendations, integratedAnalysis } = analysis;

  return (
    <div className="zc111-details">
      <div className="details-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Results
        </button>
        <h2>Comprehensive Analysis Report</h2>
        <p>Detailed lucky number and auspicious timing analysis</p>
      </div>

      {/* Executive Summary */}
      <section className="report-section executive-summary">
        <h3>📊 Executive Summary</h3>
        <div className="summary-content">
          <div className="overview">
            <h4>Overview</h4>
            <p>{comprehensiveReport.executiveSummary.overview}</p>
          </div>
          <div className="key-findings">
            <h4>Key Findings</h4>
            <ul>
              {comprehensiveReport.executiveSummary.keyFindings.map((finding, index) => (
                <li key={index}>{finding}</li>
              ))}
            </ul>
          </div>
          <div className="recommendations">
            <h4>Primary Recommendations</h4>
            <ul>
              {comprehensiveReport.executiveSummary.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Numerology Analysis Section */}
      <section className="report-section numerology-analysis">
        <h3>🔢 Numerology Analysis</h3>

        <div className="numerology-profile">
          <h4>Your Core Numbers</h4>
          <div className="core-numbers">
            <div className="core-number">
              <div className="number-display">
                <span className="big-number">
                  {numerologyProfile.profile.systems.vedic.lifePath.lifePathNumber}
                </span>
                <span className="number-label">Life Path</span>
              </div>
              <div className="number-details">
                <p><strong>Planet:</strong> {numerologyProfile.profile.systems.vedic.lifePath.significance.name}</p>
                <p><strong>Qualities:</strong> {numerologyProfile.profile.systems.vedic.lifePath.significance.qualities.join(', ')}</p>
              </div>
            </div>

            <div className="core-number">
              <div className="number-display">
                <span className="big-number">
                  {numerologyProfile.profile.systems.vedic.destiny.destinyNumber}
                </span>
                <span className="number-label">Destiny</span>
              </div>
              <div className="number-details">
                <p><strong>Planet:</strong> {numerologyProfile.profile.systems.vedic.destiny.significance.name}</p>
                <p><strong>Qualities:</strong> {numerologyProfile.profile.systems.vedic.destiny.significance.qualities.join(', ')}</p>
              </div>
            </div>

            <div className="core-number">
              <div className="number-display">
                <span className="big-number">
                  {numerologyProfile.profile.systems.vedic.soulUrge.soulUrgeNumber}
                </span>
                <span className="number-label">Soul Urge</span>
              </div>
              <div className="number-details">
                <p><strong>Planet:</strong> {numerologyProfile.profile.systems.vedic.soulUrge.significance.name}</p>
                <p><strong>Qualities:</strong> {numerologyProfile.profile.systems.vedic.soulUrge.significance.qualities.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lucky-numbers-breakdown">
          <h4>Lucky Numbers Breakdown</h4>

          <div className="number-categories">
            <div className="category">
              <h5>Primary Lucky Numbers</h5>
              <div className="numbers-list">
                {numerologyProfile.categories.primary.numbers.map((num, index) => (
                  <div key={index} className="lucky-number-item">
                    <span className="number">{num}</span>
                    <span className="planet">
                      {numerologyProfile.categories.primary.significance[index]?.significance.name}
                    </span>
                    <span className="qualities">
                      {numerologyProfile.categories.primary.significance[index]?.significance.qualities.slice(0, 2).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="category">
              <h5>Secondary Lucky Numbers</h5>
              <div className="numbers-list">
                {numerologyProfile.categories.secondary.numbers.slice(0, 8).map((num, index) => (
                  <div key={index} className="lucky-number-item secondary">
                    <span className="number">{num}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="category">
              <h5>Planetary Lucky Numbers</h5>
              <div className="numbers-list">
                {numerologyProfile.categories.planetary.numbers.map((num, index) => (
                  <div key={index} className="lucky-number-item planetary">
                    <span className="number">{num}</span>
                    <span className="planet">
                      {numerologyProfile.categories.planetary.significance[index]?.planet}
                    </span>
                    <span className="relation">
                      ({numerologyProfile.categories.planetary.significance[index]?.relation})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="challenge-numbers">
          <h4>Challenge Numbers</h4>
          <p>Be cautious with these numbers during challenging periods:</p>
          <div className="challenge-list">
            {Object.entries(numerologyProfile.profile.challengeNumbers).map(([period, number]) => (
              <div key={period} className="challenge-item">
                <span className="period">{period.charAt(0).toUpperCase() + period.slice(1)} Challenge:</span>
                <span className="number">{number}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timing Analysis Section */}
      <section className="report-section timing-analysis">
        <h3>⏰ Auspicious Timing Analysis</h3>

        <div className="top-timings">
          <h4>Top Recommended Timings</h4>
          <div className="timings-list">
            {integratedAnalysis.integratedRecommendations.slice(0, 5).map((timing, index) => (
              <div key={index} className="timing-item">
                <div className="timing-header">
                  <span className="rank">#{index + 1}</span>
                  <span className="date">{timing.date.toLocaleDateString()}</span>
                  <span className="score">
                    {Math.round(timing.adjustedScore.combinedScore * 100)}% Compatible
                  </span>
                </div>
                <div className="timing-details">
                  <div className="detail-row">
                    <span><strong>Date Numbers:</strong> {timing.numerology.dateNumbers.join(', ')}</span>
                    <span><strong>Numerology Score:</strong> {Math.round(timing.numerology.compatibilityScore * 100)}%</span>
                  </div>
                  <div className="detail-row">
                    <span><strong>Time Slot:</strong> {timing.timeSlot?.period || 'Not specified'}</span>
                    <span><strong>Activity:</strong> {timing.activityType}</span>
                  </div>
                  {timing.numerology.luckyNumberMatch.length > 0 && (
                    <div className="lucky-matches">
                      <strong>Lucky Number Matches:</strong>
                      {timing.numerology.luckyNumberMatch.map((match, idx) => (
                        <span key={idx} className="match">
                          {match.number} ({match.significance.name})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity-Specific Guidance */}
      <section className="report-section activity-guidance">
        <h3>🎯 {activityRecommendations.activityType.charAt(0).toUpperCase() + activityRecommendations.activityType.slice(1)} Specific Guidance</h3>

        <div className="activity-numbers">
          <h4>Recommended Lucky Numbers for {activityRecommendations.activityType}</h4>
          <div className="priority-numbers">
            {activityRecommendations.luckyNumbers.map((item, index) => (
              <div key={index} className={`priority-number ${item.priority}`}>
                <div className="number-info">
                  <span className="number">{item.number}</span>
                  <span className="priority-badge">{item.priority}</span>
                </div>
                <p className="reason">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="auspicious-periods">
          <h4>Auspicious Months</h4>
          <div className="months-grid">
            {activityRecommendations.auspiciousMonths.map((month, index) => (
              <span key={index} className="month-item">{month}</span>
            ))}
          </div>
        </div>

        <div className="preferred-nakshatras">
          <h4>Preferred Nakshatras</h4>
          <div className="nakshatras-list">
            {activityRecommendations.preferredNakshatras.map((nakshatra, index) => (
              <span key={index} className="nakshatra-item">{nakshatra}</span>
            ))}
          </div>
        </div>

        <div className="activity-insights">
          <h4>Activity Insights</h4>
          <ul>
            {activityRecommendations.numerologyInsights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>

        <div className="activity-precautions">
          <h4>Important Precautions</h4>
          <ul>
            {activityRecommendations.precautions.map((precaution, index) => (
              <li key={index}>{precaution}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Detailed Recommendations */}
      <section className="report-section detailed-recommendations">
        <h3>📋 Detailed Recommendations</h3>

        {comprehensiveReport.recommendations.map((category, index) => (
          <div key={index} className="recommendation-category">
            <h4>{category.category}</h4>
            <ul>
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Precautions */}
      <section className="report-section precautions">
        <h3>⚠️ Important Precautions</h3>
        <div className="precautions-list">
          {comprehensiveReport.precautions.map((precaution, index) => (
            <li key={index}>{precaution}</li>
          ))}
        </div>
      </section>

      {/* Metadata */}
      <section className="report-section metadata">
        <h3>ℹ️ Report Information</h3>
        <div className="metadata-content">
          <div className="meta-item">
            <span className="label">Generated:</span>
            <span className="value">{new Date(analysis.metadata.generatedAt).toLocaleString()}</span>
          </div>
          <div className="meta-item">
            <span className="label">System Version:</span>
            <span className="value">{analysis.metadata.systemVersion}</span>
          </div>
          <div className="meta-item">
            <span className="label">Activity Type:</span>
            <span className="value">{analysis.metadata.activityType}</span>
          </div>
          <div className="meta-item">
            <span className="label">Date Range:</span>
            <span className="value">
              {analysis.metadata.dateRange.start.toLocaleDateString()} - {analysis.metadata.dateRange.end.toLocaleDateString()}
            </span>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="report-actions">
        <button className="print-btn" onClick={() => window.print()}>
          🖨️ Print Report
        </button>
        <button
          className="download-btn"
          onClick={() => {
            // TODO: Implement PDF download
            alert('PDF download feature coming soon!');
          }}
        >
          📥 Download PDF
        </button>
        <button className="share-btn" onClick={() => {
          // TODO: Implement sharing
          alert('Share feature coming soon!');
        }}>
          📤 Share Report
        </button>
      </div>
    </div>
  );
};

export default ZC111Details;