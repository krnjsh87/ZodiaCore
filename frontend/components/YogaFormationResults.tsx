import React from 'react';
import { BirthData } from '../types/astrology';
import './YogaFormationResults.css';

interface YogaResult {
  name: string;
  type: string;
  planets: string[];
  strength: number;
  description: string;
  effects: {
    [key: string]: string;
  };
  houses: number[];
  category?: string;
}

interface YogaAnalysis {
  detectedYogas: YogaResult[];
  summary: {
    totalYogas: number;
    categories: { [key: string]: number };
    strongestYoga: YogaResult | null;
    dominantCategory: string | null;
  };
}

interface YogaFormationResultsProps {
  analysis: YogaAnalysis;
  birthData: BirthData;
  onReset: () => void;
}

/**
 * Yoga Formation Results Component
 * Displays the detected yogas and their analysis
 */
const YogaFormationResults: React.FC<YogaFormationResultsProps> = ({
  analysis,
  birthData,
  onReset
}) => {
  /**
   * Get strength level description
   */
  const getStrengthLevel = (strength: number): { level: string; color: string } => {
    if (strength >= 0.9) return { level: 'Very Strong', color: '#2e7d32' };
    if (strength >= 0.8) return { level: 'Strong', color: '#1976d2' };
    if (strength >= 0.7) return { level: 'Moderate', color: '#f57c00' };
    return { level: 'Weak', color: '#d32f2f' };
  };

  /**
   * Get yoga category icon
   */
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'Power & Authority': return '👑';
      case 'Wealth & Prosperity': return '💰';
      case 'Great Person': return '⭐';
      default: return '🔮';
    }
  };

  /**
   * Format birth data for display
   */
  const formatBirthData = (data: BirthData): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${data.day} ${months[data.month - 1]} ${data.year}, ${String(data.hour).padStart(2, '0')}:${String(data.minute).padStart(2, '0')}`;
  };

  return (
    <div className="yoga-formation-results">
      {/* Header */}
      <div className="results-header">
        <h2>🧘 Your Yoga Analysis</h2>
        <p className="birth-info">
          Analysis for birth on {formatBirthData(birthData)}
        </p>
      </div>

      {/* Summary */}
      <div className="analysis-summary">
        <div className="summary-card">
          <h3>📊 Analysis Summary</h3>
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-number">{analysis.summary.totalYogas}</span>
              <span className="stat-label">Yogas Detected</span>
            </div>
            {analysis.summary.strongestYoga && (
              <div className="stat">
                <span className="stat-number">
                  {(analysis.summary.strongestYoga.strength * 100).toFixed(0)}%
                </span>
                <span className="stat-label">Strongest Yoga</span>
              </div>
            )}
            {analysis.summary.dominantCategory && (
              <div className="stat">
                <span className="stat-text">{analysis.summary.dominantCategory}</span>
                <span className="stat-label">Dominant Theme</span>
              </div>
            )}
          </div>
        </div>

        <div className="category-breakdown">
          <h4>Yoga Categories</h4>
          <div className="category-list">
            {Object.entries(analysis.summary.categories).map(([category, count]) => (
              <div key={category} className="category-item">
                <span className="category-icon">{getCategoryIcon(category)}</span>
                <span className="category-name">{category}</span>
                <span className="category-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Yogas List */}
      <div className="yogas-section">
        <h3>🔍 Detected Yogas</h3>

        {analysis.detectedYogas.length === 0 ? (
          <div className="no-yogas">
            <p>No significant yogas detected in your birth chart.</p>
            <p>This doesn't mean your chart is weak - many people lead successful lives without strong yogas!</p>
          </div>
        ) : (
          <div className="yogas-list">
            {analysis.detectedYogas.map((yoga, index) => {
              const strengthInfo = getStrengthLevel(yoga.strength);

              return (
                <div key={index} className="yoga-card">
                  <div className="yoga-header">
                    <div className="yoga-title">
                      <h4>{yoga.name}</h4>
                      <span className="yoga-type">{yoga.type}</span>
                    </div>
                    <div className="yoga-strength" style={{ color: strengthInfo.color }}>
                      <span className="strength-level">{strengthInfo.level}</span>
                      <span className="strength-percentage">
                        {(yoga.strength * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="yoga-details">
                    <p className="yoga-description">{yoga.description}</p>

                    <div className="yoga-info">
                      <div className="info-item">
                        <span className="info-label">Planets:</span>
                        <span className="info-value">{yoga.planets.join(', ')}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Houses:</span>
                        <span className="info-value">{yoga.houses.join(', ')}</span>
                      </div>
                      {yoga.category && (
                        <div className="info-item">
                          <span className="info-label">Category:</span>
                          <span className="info-value">{yoga.category}</span>
                        </div>
                      )}
                    </div>

                    <div className="yoga-effects">
                      <h5>Effects & Significance:</h5>
                      <ul>
                        {Object.entries(yoga.effects).map(([key, value]) => (
                          <li key={key}>
                            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Strength Bar */}
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${yoga.strength * 100}%`,
                        backgroundColor: strengthInfo.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interpretation */}
      <div className="interpretation-section">
        <h3>💡 Interpretation</h3>
        <div className="interpretation-content">
          <p>
            Yogas in Vedic astrology represent the cumulative effects of planetary positions,
            aspects, and relationships. They indicate specific life patterns and potentials.
          </p>

          {analysis.summary.dominantCategory && (
            <div className="dominant-theme">
              <h4>Your Dominant Life Theme: {analysis.summary.dominantCategory}</h4>
              <p>
                {analysis.summary.dominantCategory === 'Power & Authority' &&
                  'Your chart shows strong potential for leadership, authority, and influence in your chosen field.'}
                {analysis.summary.dominantCategory === 'Wealth & Prosperity' &&
                  'Your chart indicates good potential for financial success and material abundance.'}
                {analysis.summary.dominantCategory === 'Great Person' &&
                  'Your chart shows qualities of a great person with exceptional abilities in your area of strength.'}
                {analysis.summary.dominantCategory === 'Special Combinations' &&
                  'Your chart contains rare and powerful combinations that create unique life opportunities.'}
              </p>
            </div>
          )}

          <div className="disclaimer">
            <p>
              <strong>Important:</strong> This analysis is based on traditional Vedic astrology principles.
              Yogas indicate potentials and tendencies, but actual life outcomes depend on many factors
              including free will, karma, and environmental influences.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="results-actions">
        <button
          className="reset-button"
          onClick={onReset}
          aria-label="Analyze different birth data"
        >
          🔄 Analyze Different Chart
        </button>
        <button
          className="print-button"
          onClick={() => window.print()}
          aria-label="Print analysis results"
        >
          🖨️ Print Results
        </button>
      </div>
    </div>
  );
};

export default YogaFormationResults;