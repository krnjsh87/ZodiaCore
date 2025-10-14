import React, { useState, useEffect } from 'react';
import './ChineseZodiacCompatibilityDashboard.css';

/**
 * Chinese Zodiac Compatibility Dashboard Component
 * Provides comprehensive Chinese zodiac animal sign compatibility analysis
 */
const ChineseZodiacCompatibilityDashboard: React.FC = () => {
  const [sign1, setSign1] = useState<string>('');
  const [sign2, setSign2] = useState<string>('');
  const [compatibility, setCompatibility] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chinese Zodiac signs
  const zodiacSigns = [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
    'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
  ];

  /**
   * Calculate compatibility between two signs
   */
  const calculateCompatibility = async () => {
    if (!sign1 || !sign2) {
      setError('Please select both zodiac signs');
      return;
    }

    if (sign1 === sign2) {
      setError('Cannot calculate compatibility between identical signs');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Import the compatibility engine dynamically
      const { ZodiacCompatibilityEngine } = await import('../../services/astrology/chinese-zodiac-compatibility-engine');

      const engine = new ZodiacCompatibilityEngine({ useMatrix: true });
      const result = engine.calculateCompatibility(sign1, sign2);

      setCompatibility(result);
    } catch (err) {
      setError('Failed to calculate compatibility');
      console.error('Compatibility calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get compatibility score color
   */
  const getScoreColor = (score: number): string => {
    if (score >= 8.5) return '#10b981'; // Excellent - Green
    if (score >= 7.5) return '#3b82f6'; // Good - Blue
    if (score >= 6.5) return '#f59e0b'; // Moderate - Yellow
    if (score >= 5.5) return '#f97316'; // Neutral - Orange
    return '#ef4444'; // Challenging - Red
  };

  /**
   * Get relationship type color
   */
  const getRelationshipColor = (type: string): string => {
    const colors: Record<string, string> = {
      'secret_friend': '#8b5cf6',
      'triangle_ally': '#10b981',
      'polar_opposite': '#06b6d4',
      'neutral': '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  /**
   * Reset compatibility results
   */
  const resetResults = () => {
    setCompatibility(null);
    setError(null);
  };

  // Auto-calculate when both signs are selected
  useEffect(() => {
    if (sign1 && sign2 && sign1 !== sign2) {
      calculateCompatibility();
    } else {
      resetResults();
    }
  }, [sign1, sign2]);

  return (
    <div className="chinese-zodiac-compatibility-dashboard">
      <header className="dashboard-header">
        <h1>🐉 Chinese Zodiac Compatibility</h1>
        <p>Discover the ancient wisdom of Chinese zodiac animal sign relationships</p>
      </header>

      {error && (
        <div className="error-message" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="input-section">
        <div className="sign-selection">
          <div className="sign-selector">
            <label htmlFor="sign1-select">First Sign</label>
            <select
              id="sign1-select"
              value={sign1}
              onChange={(e) => setSign1(e.target.value)}
              className="zodiac-select"
            >
              <option value="">Select a sign</option>
              {zodiacSigns.map(sign => (
                <option key={sign} value={sign}>{sign}</option>
              ))}
            </select>
          </div>

          <div className="compatibility-symbol">
            <span className="yin-yang">☯️</span>
          </div>

          <div className="sign-selector">
            <label htmlFor="sign2-select">Second Sign</label>
            <select
              id="sign2-select"
              value={sign2}
              onChange={(e) => setSign2(e.target.value)}
              className="zodiac-select"
            >
              <option value="">Select a sign</option>
              {zodiacSigns.map(sign => (
                <option key={sign} value={sign}>{sign}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Calculating compatibility...</p>
          </div>
        )}
      </div>

      {compatibility && !loading && (
        <div className="results-section">
          <div className="compatibility-overview">
            <div className="score-display">
              <div
                className="score-circle"
                style={{ borderColor: getScoreColor(compatibility.score) }}
              >
                <div className="score-value">{compatibility.score.toFixed(1)}</div>
                <div className="score-label">Compatibility</div>
              </div>
              <div className="compatibility-info">
                <h3 style={{ color: getRelationshipColor(compatibility.type) }}>
                  {compatibility.type.replace('_', ' ').toUpperCase()}
                </h3>
                <p className="summary">{compatibility.summary}</p>
              </div>
            </div>
          </div>

          <div className="detailed-analysis">
            <div className="analysis-tabs">
              <div className="tab-content">
                <div className="compatibility-factors">
                  <h4>Compatibility Factors</h4>
                  <div className="factors-grid">
                    <div className="factor-item">
                      <div className="factor-name">Triangle</div>
                      <div className="factor-score" style={{ color: getScoreColor(compatibility.breakdown.triangle.compatibility) }}>
                        {compatibility.breakdown.triangle.compatibility.toFixed(1)}
                      </div>
                      <div className="factor-type">{compatibility.breakdown.triangle.relationship.replace('_', ' ')}</div>
                    </div>

                    <div className="factor-item">
                      <div className="factor-name">Polar</div>
                      <div className="factor-score" style={{ color: getScoreColor(compatibility.breakdown.polar.compatibility) }}>
                        {compatibility.breakdown.polar.compatibility.toFixed(1)}
                      </div>
                      <div className="factor-type">{compatibility.breakdown.polar.relationship.replace('_', ' ')}</div>
                    </div>

                    <div className="factor-item">
                      <div className="factor-name">Secret Friend</div>
                      <div className="factor-score" style={{ color: getScoreColor(compatibility.breakdown.secretFriend.compatibility) }}>
                        {compatibility.breakdown.secretFriend.compatibility.toFixed(1)}
                      </div>
                      <div className="factor-type">{compatibility.breakdown.secretFriend.relationship.replace('_', ' ')}</div>
                    </div>

                    <div className="factor-item">
                      <div className="factor-name">Element</div>
                      <div className="factor-score" style={{ color: getScoreColor(compatibility.breakdown.element.compatibility / 10) }}>
                        {(compatibility.breakdown.element.compatibility / 10).toFixed(1)}
                      </div>
                      <div className="factor-type">{compatibility.breakdown.element.element1} ↔ {compatibility.breakdown.element.element2}</div>
                    </div>
                  </div>
                </div>

                <div className="relationship-insights">
                  <h4>Relationship Insights</h4>

                  <div className="insights-section">
                    <h5>Strengths</h5>
                    <ul>
                      {compatibility.analysis.strengths.map((strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  {compatibility.analysis.challenges.length > 0 && (
                    <div className="insights-section">
                      <h5>Challenges</h5>
                      <ul>
                        {compatibility.analysis.challenges.map((challenge: string, index: number) => (
                          <li key={index}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="insights-section">
                    <h5>Recommendations</h5>
                    <ul>
                      {compatibility.analysis.recommendations.map((rec: string, index: number) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="insights-section">
                    <h5>Long-term Potential</h5>
                    <p>{compatibility.analysis.longTermPotential}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cultural-note">
            <p>
              <strong>📜 Cultural Note:</strong> Chinese zodiac compatibility is based on thousands of years
              of traditional wisdom. While these insights can be valuable, they should be considered as
              complementary to modern relationship understanding and personal experience.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChineseZodiacCompatibilityDashboard;