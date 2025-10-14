import React from 'react';
import { MuhuratResult } from '../types/astrology';

interface MuhuratResultsProps {
  results: MuhuratResult[];
  onSelectMuhurat: (muhurat: MuhuratResult) => void;
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

const SCORE_BAR_COLORS = {
  tithi: '#8b5cf6',
  nakshatra: '#06b6d4',
  yoga: '#10b981',
  karana: '#f59e0b',
  vara: '#ef4444',
  muhurat: '#3b82f6',
  planetary: '#ec4899'
};

const MuhuratResults: React.FC<MuhuratResultsProps> = ({ results, onSelectMuhurat, loading = false }) => {
  if (loading) {
    return (
      <div className="muhurat-results loading">
        <div className="loading-spinner"></div>
        <p>Analyzing auspicious timings...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="muhurat-results empty">
        <div className="empty-state">
          <h3>No Results Found</h3>
          <p>Try adjusting your search criteria or expanding the date range.</p>
        </div>
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

  const renderScoreBar = (score: number, label: string, color: string) => (
    <div className="score-bar" key={label}>
      <div className="score-label">
        <span>{label}</span>
        <span>{(score * 100).toFixed(0)}%</span>
      </div>
      <div className="score-bar-container">
        <div
          className="score-bar-fill"
          style={{
            width: `${score * 100}%`,
            backgroundColor: color
          }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="muhurat-results">
      <h3>Auspicious Muhurats Found ({results.length})</h3>
      <p className="results-summary">
        Results are sorted by overall auspiciousness score. Higher scores indicate more favorable timing.
      </p>

      <div className="results-list">
        {results.map((result, index) => (
          <div key={index} className="muhurat-card">
            <div className="muhurat-header">
              <div className="date-info">
                <h4>{formatDate(result.date)}</h4>
                {result.timeSlot && (
                  <p className="time-slot">
                    {formatTime(result.timeSlot.startTime)} - {formatTime(result.timeSlot.endTime)}
                  </p>
                )}
              </div>
              <div className="score-badge" style={{ backgroundColor: GRADE_COLORS[result.score.grade] }}>
                {result.score.grade}
                <span className="score-value">{result.score.totalScore}</span>
              </div>
            </div>

            <div className="panchang-summary">
              <div className="panchang-item">
                <span className="label">Tithi:</span>
                <span className={`value ${result.panchang.tithi.isAuspicious ? 'auspicious' : 'inauspicious'}`}>
                  {result.panchang.tithi.name} ({result.panchang.tithi.paksha})
                </span>
              </div>
              <div className="panchang-item">
                <span className="label">Nakshatra:</span>
                <span className={`value ${result.panchang.nakshatra.isAuspicious ? 'auspicious' : 'inauspicious'}`}>
                  {result.panchang.nakshatra.name} (Lord: {result.panchang.nakshatra.lord})
                </span>
              </div>
              <div className="panchang-item">
                <span className="label">Yoga:</span>
                <span className={`value ${result.panchang.yoga.isAuspicious ? 'auspicious' : 'inauspicious'}`}>
                  {result.panchang.yoga.name}
                </span>
              </div>
              <div className="panchang-item">
                <span className="label">Weekday:</span>
                <span className={`value ${result.panchang.vara.isAuspicious ? 'auspicious' : 'inauspicious'}`}>
                  {result.panchang.vara.name}
                </span>
              </div>
            </div>

            <div className="score-breakdown">
              <h5>Score Components</h5>
              <div className="score-bars">
                {Object.entries(result.score.componentScores).map(([key, value]) =>
                  renderScoreBar(value, key.charAt(0).toUpperCase() + key.slice(1), SCORE_BAR_COLORS[key as keyof typeof SCORE_BAR_COLORS])
                )}
              </div>
            </div>

            <div className="recommendation">
              <p>{result.score.recommendation}</p>
            </div>

            <div className="card-actions">
              <button
                className="btn-primary"
                onClick={() => onSelectMuhurat(result)}
              >
                View Detailed Report
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="results-footer">
        <p className="disclaimer">
          <strong>Important:</strong> These calculations are based on traditional Vedic astrology principles.
          For critical decisions, please consult with experienced astrologers or priests.
          Results are for informational purposes only.
        </p>
      </div>
    </div>
  );
};

export default MuhuratResults;