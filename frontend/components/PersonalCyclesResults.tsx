import React from 'react';
import { PersonalCyclesAnalysis } from '../types/astrology';

/**
 * Personal Cycles Results Component
 * Displays the calculated personal cycles analysis with detailed interpretations
 */
interface PersonalCyclesResultsProps {
  analysis: PersonalCyclesAnalysis;
  loading: boolean;
  error: string | null;
}

const PersonalCyclesResults: React.FC<PersonalCyclesResultsProps> = ({
  analysis,
  loading,
  error
}) => {
  if (loading) {
    return (
      <div className="results-loading">
        <div className="loading-spinner"></div>
        <p>Loading your personal cycles analysis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="results-empty">
        <p>No analysis data available</p>
      </div>
    );
  }

  const { cycles, compatibility, interpretations, recommendations } = analysis.cycles.pythagorean;

  return (
    <div className="personal-cycles-results">
      <div className="results-header">
        <h2>Your Personal Cycles Analysis</h2>
        <p className="analysis-date">
          Analysis for: {new Date(analysis.targetDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Cycle Overview Cards */}
      <div className="cycles-overview">
        <div className="cycle-card year-cycle">
          <div className="cycle-number">{cycles.year.personalYear}</div>
          <h3>Personal Year</h3>
          <p className="cycle-name">{cycles.year.interpretation.name}</p>
          <p className="cycle-description">{cycles.year.interpretation.qualities.join(', ')}</p>
          <div className="cycle-details">
            <small>Year {cycles.year.cyclePosition.cyclePosition} of 9-year cycle</small>
          </div>
        </div>

        <div className="cycle-card month-cycle">
          <div className="cycle-number">{cycles.month.personalMonth}</div>
          <h3>Personal Month</h3>
          <p className="cycle-name">{cycles.month.interpretation.name}</p>
          <p className="cycle-description">{cycles.month.interpretation.qualities.join(', ')}</p>
          <div className="cycle-details">
            <small>{cycles.month.monthName}</small>
          </div>
        </div>

        <div className="cycle-card day-cycle">
          <div className="cycle-number">{cycles.day.personalDay}</div>
          <h3>Personal Day</h3>
          <p className="cycle-name">{cycles.day.interpretation.name}</p>
          <p className="cycle-description">{cycles.day.interpretation.qualities.join(', ')}</p>
          <div className="cycle-details">
            <small>Today's Energy</small>
          </div>
        </div>
      </div>

      {/* Cycle Compatibility */}
      <div className="compatibility-section">
        <h3>Cycle Harmony</h3>
        <div className="compatibility-indicator">
          <div className={`harmony-level ${compatibility.overallHarmony.toLowerCase()}`}>
            {compatibility.overallHarmony} Harmony
          </div>
          <div className="compatibility-details">
            <div className="compatibility-item">
              <span>Year ↔ Month:</span>
              <span className={compatibility.yearMonth.compatible ? 'compatible' : 'incompatible'}>
                {compatibility.yearMonth.difference === 0 ? 'Perfect' :
                 compatibility.yearMonth.difference <= 2 ? 'Harmonious' : 'Challenging'}
              </span>
            </div>
            <div className="compatibility-item">
              <span>Month ↔ Day:</span>
              <span className={compatibility.monthDay.compatible ? 'compatible' : 'incompatible'}>
                {compatibility.monthDay.difference === 0 ? 'Perfect' :
                 compatibility.monthDay.difference <= 2 ? 'Harmonious' : 'Challenging'}
              </span>
            </div>
            <div className="compatibility-item">
              <span>Year ↔ Day:</span>
              <span className={compatibility.yearDay.compatible ? 'compatible' : 'incompatible'}>
                {compatibility.yearDay.difference === 0 ? 'Perfect' :
                 compatibility.yearDay.difference <= 2 ? 'Harmonious' : 'Challenging'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Interpretations */}
      <div className="interpretations-section">
        <h3>Detailed Analysis</h3>

        <div className="interpretation-card">
          <h4>Overall Energy</h4>
          <p>{interpretations.overall}</p>
        </div>

        <div className="interpretation-card">
          <h4>Timing Guidance</h4>
          <ul>
            {interpretations.timing.map((guidance: string, index: number) => (
              <li key={index}>{guidance}</li>
            ))}
          </ul>
        </div>

        <div className="interpretation-card">
          <h4>Opportunities</h4>
          <ul>
            {interpretations.opportunities.map((opportunity: string, index: number) => (
              <li key={index}>{opportunity}</li>
            ))}
          </ul>
        </div>

        <div className="interpretation-card">
          <h4>Challenges to Consider</h4>
          <ul>
            {interpretations.challenges.map((challenge: string, index: number) => (
              <li key={index}>{challenge}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Practical Recommendations */}
      <div className="recommendations-section">
        <h3>Practical Recommendations</h3>

        <div className="recommendation-grid">
          <div className="recommendation-card">
            <h4>Decision Making</h4>
            <p>{recommendations.decisionMaking}</p>
          </div>

          <div className="recommendation-card">
            <h4>Relationships</h4>
            <p>{recommendations.relationshipTiming}</p>
          </div>

          <div className="recommendation-card">
            <h4>Career & Business</h4>
            <p>{recommendations.careerPlanning}</p>
          </div>

          <div className="recommendation-card">
            <h4>Health & Wellness</h4>
            <p>{recommendations.healthWellness}</p>
          </div>

          <div className="recommendation-card">
            <h4>Spiritual Growth</h4>
            <p>{recommendations.spiritualGrowth}</p>
          </div>
        </div>

        <div className="key-themes">
          <h4>Key Themes for This Period</h4>
          <div className="themes-list">
            {recommendations.keyThemes.map((theme: string, index: number) => (
              <span key={index} className="theme-tag">{theme}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Calculation Details */}
      <div className="calculation-details">
        <h3>How Your Cycles Were Calculated</h3>
        <div className="calculation-explanation">
          <div className="formula-card">
            <h4>Personal Year</h4>
            <div className="formula">
              <code>{cycles.year.components.birthMonth} + {cycles.year.components.birthDay} + {cycles.year.components.currentYear} = {cycles.year.components.total} → {cycles.year.personalYear}</code>
            </div>
            <p>Birth month + birth day + current year, reduced to single digit</p>
          </div>

          <div className="formula-card">
            <h4>Personal Month</h4>
            <div className="formula">
              <code>{cycles.month.components.personalYear} + {cycles.month.components.currentMonth} = {cycles.month.components.total} → {cycles.month.personalMonth}</code>
            </div>
            <p>Personal year + current month, reduced to single digit</p>
          </div>

          <div className="formula-card">
            <h4>Personal Day</h4>
            <div className="formula">
              <code>{cycles.day.components.personalMonth} + {cycles.day.components.currentDay} = {cycles.day.components.total} → {cycles.day.personalDay}</code>
            </div>
            <p>Personal month + current day, reduced to single digit</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="results-disclaimer">
        <div className="disclaimer-icon">ℹ️</div>
        <div className="disclaimer-content">
          <p>
            <strong>Important:</strong> Personal cycles provide timing guidance based on numerological calculations.
            They are tools for self-reflection and should not replace professional advice for important life decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalCyclesResults;