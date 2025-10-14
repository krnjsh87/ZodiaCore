import React, { useState, useEffect } from 'react';
import { LalKitabKarmicDebtAnalysis, RinaAnalysis } from '../types/astrology';
import './LalKitabKarmicDebtDashboard.css';

interface LalKitabKarmicDebtDashboardProps {
  analysis: LalKitabKarmicDebtAnalysis | null;
  loading?: boolean;
  error?: string | null;
}

/**
 * Lal Kitab Karmic Debt Analysis Dashboard Component
 * Displays comprehensive karmic debt analysis with intuitive UI
 */
const LalKitabKarmicDebtDashboard: React.FC<LalKitabKarmicDebtDashboardProps> = ({
  analysis,
  loading = false,
  error = null
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pitru' | 'matru' | 'bhratru' | 'putra' | 'remedies'>('overview');

  if (loading) {
    return (
      <div className="lal-kitab-dashboard loading">
        <div className="loading-spinner" aria-label="Loading karmic debt analysis"></div>
        <p>Analyzing karmic debts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lal-kitab-dashboard error">
        <div className="error-message" role="alert">
          <h3>Analysis Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="lal-kitab-dashboard empty">
        <div className="empty-state">
          <h3>No Analysis Available</h3>
          <p>Please generate a Lal Kitab karmic debt analysis to view results.</p>
        </div>
      </div>
    );
  }

  const getIntensityColor = (intensity: number): string => {
    if (intensity >= 4) return 'severe';
    if (intensity >= 3) return 'strong';
    if (intensity >= 2) return 'moderate';
    return 'mild';
  };

  const getBurdenColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'high': return 'severe';
      case 'moderate': return 'strong';
      case 'low': return 'moderate';
      default: return 'mild';
    }
  };

  const renderRinaCard = (rina: RinaAnalysis, title: string, description: string) => (
    <div className={`rina-card ${rina.present ? 'active' : 'inactive'}`} key={rina.type}>
      <div className="rina-header">
        <h3>{title}</h3>
        <span className={`intensity-badge ${getIntensityColor(rina.intensity.value)}`}>
          {rina.intensity.description}
        </span>
      </div>

      <p className="rina-description">{description}</p>

      {rina.present && (
        <>
          <div className="rina-indicators">
            <h4>Key Indicators:</h4>
            <ul>
              {rina.indicators.map((indicator, index) => (
                <li key={index}>{indicator}</li>
              ))}
            </ul>
          </div>

          <div className="rina-effects">
            <h4>Life Effects:</h4>
            <ul>
              {rina.effects.map((effect, index) => (
                <li key={index}>{effect}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      {!rina.present && (
        <div className="rina-clean">
          <p>✓ No significant karmic debt detected in this area</p>
        </div>
      )}
    </div>
  );

  const renderRemediesSection = (remedies: RinaAnalysis['remedies']) => (
    <div className="remedies-section">
      {remedies.daily.length > 0 && (
        <div className="remedy-category">
          <h4>Daily Practices:</h4>
          <ul>
            {remedies.daily.map((remedy, index) => (
              <li key={index}>{remedy}</li>
            ))}
          </ul>
        </div>
      )}

      {remedies.weekly.length > 0 && (
        <div className="remedy-category">
          <h4>Weekly Practices:</h4>
          <ul>
            {remedies.weekly.map((remedy, index) => (
              <li key={index}>{remedy}</li>
            ))}
          </ul>
        </div>
      )}

      {remedies.monthly.length > 0 && (
        <div className="remedy-category">
          <h4>Monthly Practices:</h4>
          <ul>
            {remedies.monthly.map((remedy, index) => (
              <li key={index}>{remedy}</li>
            ))}
          </ul>
        </div>
      )}

      {remedies.oneTime.length > 0 && (
        <div className="remedy-category">
          <h4>One-time Actions:</h4>
          <ul>
            {remedies.oneTime.map((remedy, index) => (
              <li key={index}>{remedy}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderOverview = () => (
    <div className="overview-section">
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Karmic Burden</h3>
          <div className={`burden-level ${getBurdenColor(analysis.summary.karmicBurden.level)}`}>
            {analysis.summary.karmicBurden.level}
          </div>
          <p>{analysis.summary.karmicBurden.description}</p>
        </div>

        <div className="summary-card">
          <h3>Active Rinas</h3>
          <div className="active-count">{analysis.summary.totalActiveRinas}</div>
          <p>out of 4 karmic debts present</p>
        </div>

        <div className="summary-card">
          <h3>Dominant Rina</h3>
          <div className="dominant-rina">
            {analysis.summary.dominantRina || 'None dominant'}
          </div>
        </div>
      </div>

      <div className="quick-insights">
        <h3>Key Insights</h3>
        <div className="insights-grid">
          {analysis.pitruRina.present && (
            <div className="insight-item">
              <span className="insight-icon">👨‍👧‍👦</span>
              <span>Ancestral connections need attention</span>
            </div>
          )}
          {analysis.matruRina.present && (
            <div className="insight-item">
              <span className="insight-icon">👩‍👧‍👦</span>
              <span>Maternal lineage patterns active</span>
            </div>
          )}
          {analysis.bhratruRina.present && (
            <div className="insight-item">
              <span className="insight-icon">👥</span>
              <span>Sibling relationships need healing</span>
            </div>
          )}
          {analysis.putraRina.present && (
            <div className="insight-item">
              <span className="insight-icon">👶</span>
              <span>Children and creativity areas affected</span>
            </div>
          )}
        </div>
      </div>

      {analysis.recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>Recommendations</h3>
          <ul>
            {analysis.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderRinaDetail = (rina: RinaAnalysis) => (
    <div className="rina-detail-section">
      <div className="rina-overview">
        <h3>{rina.type} Analysis</h3>
        <div className={`rina-status ${rina.present ? 'present' : 'absent'}`}>
          {rina.present ? 'Present' : 'Not Present'}
        </div>
      </div>

      {rina.present && (
        <>
          <div className="rina-metrics">
            <div className="metric">
              <span className="metric-label">Intensity:</span>
              <span className={`metric-value ${getIntensityColor(rina.intensity.value)}`}>
                {rina.intensity.description}
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Score:</span>
              <span className="metric-value">{rina.score.toFixed(1)}/4</span>
            </div>
          </div>

          <div className="rina-content">
            <div className="rina-indicators">
              <h4>Planetary Indicators:</h4>
              <ul>
                {rina.indicators.map((indicator, index) => (
                  <li key={index}>{indicator}</li>
                ))}
              </ul>
            </div>

            <div className="rina-effects">
              <h4>Life Impact:</h4>
              <ul>
                {rina.effects.map((effect, index) => (
                  <li key={index}>{effect}</li>
                ))}
              </ul>
            </div>

            <div className="rina-remedies">
              <h4>Remedial Measures:</h4>
              {renderRemediesSection(rina.remedies)}
            </div>
          </div>
        </>
      )}

      {!rina.present && (
        <div className="rina-clean-state">
          <p>This karmic debt area appears to be in balance. Continue maintaining positive practices in this area.</p>
        </div>
      )}
    </div>
  );

  const renderRemedies = () => (
    <div className="remedies-overview">
      <h3>Comprehensive Remedial Plan</h3>

      <div className="remedies-categories">
        {analysis.comprehensiveRemedies.daily.length > 0 && (
          <div className="remedy-category-card">
            <h4>Daily Practices</h4>
            <ul>
              {analysis.comprehensiveRemedies.daily.map((remedy, index) => (
                <li key={index}>{remedy}</li>
              ))}
            </ul>
          </div>
        )}

        {analysis.comprehensiveRemedies.weekly.length > 0 && (
          <div className="remedy-category-card">
            <h4>Weekly Practices</h4>
            <ul>
              {analysis.comprehensiveRemedies.weekly.map((remedy, index) => (
                <li key={index}>{remedy}</li>
              ))}
            </ul>
          </div>
        )}

        {analysis.comprehensiveRemedies.monthly.length > 0 && (
          <div className="remedy-category-card">
            <h4>Monthly Practices</h4>
            <ul>
              {analysis.comprehensiveRemedies.monthly.map((remedy, index) => (
                <li key={index}>{remedy}</li>
              ))}
            </ul>
          </div>
        )}

        {analysis.comprehensiveRemedies.general.length > 0 && (
          <div className="remedy-category-card">
            <h4>General Recommendations</h4>
            <ul>
              {analysis.comprehensiveRemedies.general.map((remedy, index) => (
                <li key={index}>{remedy}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="remedies-note">
        <p><strong>Note:</strong> Lal Kitab remedies are most effective when practiced consistently for at least 43 days. Start with daily practices and gradually incorporate weekly and monthly rituals.</p>
      </div>
    </div>
  );

  return (
    <div className="lal-kitab-dashboard">
      <header className="dashboard-header">
        <h1>Lal Kitab Karmic Debt Analysis</h1>
        <p>Traditional analysis of inherited karmic patterns from Pt. Roop Chand Joshi</p>
      </header>

      <nav className="dashboard-nav" role="tablist">
        <button
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
          aria-selected={activeTab === 'overview'}
        >
          Overview
        </button>
        <button
          className={`nav-tab ${activeTab === 'pitru' ? 'active' : ''}`}
          onClick={() => setActiveTab('pitru')}
          aria-selected={activeTab === 'pitru'}
        >
          Pitru Rina
        </button>
        <button
          className={`nav-tab ${activeTab === 'matru' ? 'active' : ''}`}
          onClick={() => setActiveTab('matru')}
          aria-selected={activeTab === 'matru'}
        >
          Matru Rina
        </button>
        <button
          className={`nav-tab ${activeTab === 'bhratru' ? 'active' : ''}`}
          onClick={() => setActiveTab('bhratru')}
          aria-selected={activeTab === 'bhratru'}
        >
          Bhratru Rina
        </button>
        <button
          className={`nav-tab ${activeTab === 'putra' ? 'active' : ''}`}
          onClick={() => setActiveTab('putra')}
          aria-selected={activeTab === 'putra'}
        >
          Putra Rina
        </button>
        <button
          className={`nav-tab ${activeTab === 'remedies' ? 'active' : ''}`}
          onClick={() => setActiveTab('remedies')}
          aria-selected={activeTab === 'remedies'}
        >
          Remedies
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}

        {activeTab === 'pitru' && renderRinaDetail(analysis.pitruRina)}
        {activeTab === 'matru' && renderRinaDetail(analysis.matruRina)}
        {activeTab === 'bhratru' && renderRinaDetail(analysis.bhratruRina)}
        {activeTab === 'putra' && renderRinaDetail(analysis.putraRina)}

        {activeTab === 'remedies' && renderRemedies()}
      </main>

      <footer className="dashboard-footer">
        <p>
          This analysis is based on traditional Lal Kitab principles. Results are interpretive and should be used as guidance,
          not as a substitute for professional advice.
        </p>
      </footer>
    </div>
  );
};

export default LalKitabKarmicDebtDashboard;