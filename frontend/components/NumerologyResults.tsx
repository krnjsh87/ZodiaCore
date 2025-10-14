import React from 'react';
import { NumerologyProfile } from '../types/astrology';
import './NumerologyResults.css';

/**
 * Numerology Results Component
 * Displays the complete numerology profile with organized sections
 */
interface NumerologyResultsProps {
  profile: NumerologyProfile;
  loading: boolean;
  error: string | null;
}

const NumerologyResults: React.FC<NumerologyResultsProps> = ({ profile, loading, error }) => {
  if (loading) {
    return (
      <div className="numerology-results loading">
        <div className="loading-spinner">Loading your numerology profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="numerology-results error">
        <div className="error-message">
          <h3>Error Loading Results</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="numerology-results empty">
        <p>No profile data available</p>
      </div>
    );
  }

  return (
    <div className="numerology-results">
      <div className="results-header">
        <h2>Your Numerology Profile</h2>
        <p className="profile-meta">
          Calculated for {profile.fullName} • {new Date(profile.birthDate).toLocaleDateString()}
        </p>
      </div>

      {/* Core Numbers Section */}
      <section className="results-section core-numbers">
        <h3>Core Numbers</h3>
        <div className="numbers-grid">
          {Object.entries(profile.systems.vedic).map(([key, data]) => (
            <div key={key} className="number-card">
              <div className="number-value">{data[key as keyof typeof data]}</div>
              <div className="number-label">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </div>
              <div className="number-significance">
                {data.significance?.name || 'Unknown'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pinnacle Numbers Section */}
      <section className="results-section pinnacle-numbers">
        <h3>Pinnacle Numbers</h3>
        <p className="section-description">
          Four life phases with specific challenges and opportunities
        </p>
        <div className="pinnacle-timeline">
          {Object.entries(profile.pinnacleNumbers.pinnacles).map(([key, pinnacle]) => (
            <div key={key} className="pinnacle-phase">
              <div className="pinnacle-header">
                <div className="pinnacle-number">{pinnacle.number}</div>
                <div className="pinnacle-period">{pinnacle.period}</div>
              </div>
              <div className="pinnacle-significance">{pinnacle.significance?.name}</div>
              <div className="pinnacle-details">
                <div className="challenges">
                  <strong>Challenges:</strong>
                  <ul>
                    {pinnacle.challenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>
                <div className="opportunities">
                  <strong>Opportunities:</strong>
                  <ul>
                    {pinnacle.opportunities.map((opportunity, index) => (
                      <li key={index}>{opportunity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        {profile.pinnacleNumbers.currentPinnacle && (
          <div className="current-pinnacle-highlight">
            <h4>Current Pinnacle Phase</h4>
            <div className="current-pinnacle-card">
              <div className="pinnacle-number">{profile.pinnacleNumbers.currentPinnacle.number}</div>
              <div className="pinnacle-significance">
                {profile.pinnacleNumbers.currentPinnacle.significance?.name}
              </div>
              <div className="pinnacle-period">{profile.pinnacleNumbers.currentPinnacle.period}</div>
            </div>
          </div>
        )}
      </section>

      {/* Challenge Numbers Section */}
      <section className="results-section challenge-numbers">
        <h3>Challenge Numbers</h3>
        <p className="section-description">
          Life lessons and obstacles to overcome in different phases
        </p>
        <div className="challenge-grid">
          {Object.entries(profile.challengeNumbers.challenges).map(([period, number]) => (
            <div key={period} className="challenge-card">
              <div className="challenge-number">{number}</div>
              <div className="challenge-period">
                {period.charAt(0).toUpperCase() + period.slice(1)} Challenge
              </div>
              <div className="challenge-significance">
                {profile.challengeNumbers.analysis?.lifePhases[period]?.significance?.name || 'Unknown'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lucky Numbers Section */}
      <section className="results-section lucky-numbers">
        <h3>Lucky Numbers</h3>
        <div className="lucky-numbers-container">
          <div className="lucky-category">
            <h4>Primary Lucky Numbers</h4>
            <div className="lucky-numbers-list">
              {profile.luckyNumbers.primary.map((number, index) => (
                <span key={index} className="lucky-number primary">{number}</span>
              ))}
            </div>
          </div>
          <div className="lucky-category">
            <h4>Secondary Lucky Numbers</h4>
            <div className="lucky-numbers-list">
              {profile.luckyNumbers.secondary.map((number, index) => (
                <span key={index} className="lucky-number secondary">{number}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Name Analysis Section */}
      <section className="results-section name-analysis">
        <h3>Name Analysis</h3>
        <div className="name-analysis-content">
          <div className="name-balance">
            <h4>Name Balance (Vedic vs Pythagorean)</h4>
            <div className="balance-comparison">
              <div className="balance-item">
                <span className="system-name">Vedic</span>
                <span className="system-number">{profile.nameAnalysis.destinyNumbers.vedic.destinyNumber}</span>
              </div>
              <div className="balance-item">
                <span className="system-name">Pythagorean</span>
                <span className="system-number">{profile.nameAnalysis.destinyNumbers.pythagorean.destinyNumber}</span>
              </div>
              <div className="balance-difference">
                Difference: {profile.nameAnalysis.balance.difference}
                {profile.nameAnalysis.balance.harmony ? ' (Harmonious)' : ' (Needs Balance)'}
              </div>
            </div>
          </div>

          <div className="name-strength">
            <h4>Name Strength</h4>
            <div className="strength-meter">
              <div className="strength-bar">
                <div
                  className="strength-fill"
                  style={{ width: `${profile.nameAnalysis.numerologicalStrength.overall}%` }}
                ></div>
              </div>
              <span className="strength-value">{profile.nameAnalysis.numerologicalStrength.overall}/10</span>
            </div>
          </div>

          {profile.nameAnalysis.recommendations && profile.nameAnalysis.recommendations.length > 0 && (
            <div className="name-recommendations">
              <h4>Recommendations</h4>
              <ul>
                {profile.nameAnalysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Insights and Recommendations */}
      <section className="results-section insights-recommendations">
        <h3>Insights & Recommendations</h3>

        <div className="insights-section">
          <h4>Key Insights</h4>
          <ul className="insights-list">
            {profile.insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>

        <div className="recommendations-section">
          <h4>Personal Recommendations</h4>
          <div className="recommendations-grid">
            {Object.entries(profile.recommendations).map(([category, items]) => (
              <div key={category} className="recommendation-category">
                <h5>{category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}</h5>
                <ul>
                  {items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="results-footer">
        <p className="disclaimer">
          <strong>Important:</strong> This numerology analysis is for entertainment and self-reflection purposes.
          It should not replace professional advice for important life decisions.
        </p>
        <p className="generated-info">
          Generated on {new Date(profile.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default NumerologyResults;