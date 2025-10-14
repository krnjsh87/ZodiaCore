import React from 'react';
import { CompleteLifeCounselingAnalysis } from '../../services/astrology/life-counseling-types';
import { ProgressBar } from '../common/ProgressBar';
import { ScoreIndicator } from '../common/ScoreIndicator';
import './LifeCounselingOverview.css';

interface LifeCounselingOverviewProps {
  analysis: CompleteLifeCounselingAnalysis;
}

export const LifeCounselingOverview: React.FC<LifeCounselingOverviewProps> = ({ analysis }) => {
  const { integrated, summary } = analysis;

  return (
    <div className="life-counseling-overview">
      <section className="overview-header">
        <h2>Your Life Potential Analysis</h2>
        <div className="overall-score">
          <ScoreIndicator
            score={integrated.overallLifePotential.score}
            label="Overall Life Potential"
            rating={integrated.overallLifePotential.rating}
          />
        </div>
      </section>

      <section className="life-balance-section">
        <h3>Life Balance Assessment</h3>
        <div className="balance-grid">
          {Object.entries(integrated.lifeBalance).map(([area, data]) => (
            <div key={area} className="balance-item">
              <h4>{area.charAt(0).toUpperCase() + area.slice(1)}</h4>
              <ProgressBar
                value={data.strength}
                max={100}
                label={`${data.strength}/100`}
                color={getBalanceColor(data.strength)}
              />
              <p className="balance-description">{summary.lifeBalance[area as keyof typeof summary.lifeBalance]}</p>
              <div className="development-needs">
                <small>Development: {data.development.join(', ')}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="timing-section">
        <h3>Current Life Timing</h3>
        <div className="timing-card">
          <div className="timing-rating">
            <span className={`rating-badge rating-${integrated.timingIntegration.currentPeriod.rating.toLowerCase()}`}>
              {integrated.timingIntegration.currentPeriod.rating}
            </span>
            <span className="timing-score">
              {integrated.timingIntegration.currentPeriod.score}/100
            </span>
          </div>
          <p className="timing-description">{summary.currentTiming}</p>
        </div>
      </section>

      <section className="key-insights">
        <h3>Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Life Purpose</h4>
            <p>{summary.lifePurpose}</p>
          </div>
          <div className="insight-card">
            <h4>Focus Areas</h4>
            <ul>
              {summary.keyFocusAreas.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="holistic-recommendations">
        <h3>Holistic Recommendations</h3>
        <div className="recommendations-list">
          {integrated.holisticRecommendations.map((rec, index) => (
            <div key={index} className={`recommendation-item priority-${rec.priority}`}>
              <div className="recommendation-header">
                <span className="recommendation-type">{rec.type.replace('_', ' ')}</span>
                <span className={`priority-badge ${rec.priority}`}>{rec.priority}</span>
              </div>
              <p className="recommendation-advice">{rec.advice}</p>
              <p className="recommendation-reasoning">{rec.reasoning}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const getBalanceColor = (strength: number): string => {
  if (strength >= 80) return '#4CAF50'; // Green
  if (strength >= 60) return '#FFC107'; // Yellow
  if (strength >= 40) return '#FF9800'; // Orange
  return '#F44336'; // Red
};