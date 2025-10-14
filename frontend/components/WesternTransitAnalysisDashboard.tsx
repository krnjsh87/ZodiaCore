import React, { useState, useEffect, useCallback } from 'react';
import { WesternBirthChart, WesternTransitAnalysis } from '../types/astrology';
import { astrologyApi } from '../services/api';
import './WesternTransitAnalysisDashboard.css';

interface WesternTransitAnalysisDashboardProps {
  birthChart: WesternBirthChart;
}

export const WesternTransitAnalysisDashboard: React.FC<WesternTransitAnalysisDashboardProps> = ({
  birthChart
}) => {
  const [analysis, setAnalysis] = useState<WesternTransitAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'active' | 'upcoming' | 'analysis' | 'settings'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutes

  // Load transit analysis data
  const loadTransitAnalysis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Call the Western transit analysis API
      const response = await astrologyApi.analyzeWesternTransits(birthChart);
      setAnalysis(response.data);

    } catch (err) {
      setError('Failed to load Western transit analysis');
      console.error('Western transit analysis error:', err);
    } finally {
      setLoading(false);
    }
  }, [birthChart]);

  // Auto-refresh functionality
  useEffect(() => {
    loadTransitAnalysis();

    if (autoRefresh) {
      const interval = setInterval(loadTransitAnalysis, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [loadTransitAnalysis, autoRefresh, refreshInterval]);

  // Helper functions
  const getPlanetSymbol = (planet: string) => {
    const symbols: Record<string, string> = {
      SUN: '☉', MOON: '☽', MERCURY: '☿', VENUS: '♀',
      MARS: '♂', JUPITER: '♃', SATURN: '♄', URANUS: '⛢',
      NEPTUNE: '♆', PLUTO: '♇'
    };
    return symbols[planet] || planet;
  };

  const getAspectColor = (aspect: string) => {
    switch (aspect.toUpperCase()) {
      case 'CONJUNCTION': return 'conjunction';
      case 'OPPOSITION': return 'opposition';
      case 'TRINE': return 'trine';
      case 'SQUARE': return 'square';
      case 'SEXTILE': return 'sextile';
      default: return 'minor-aspect';
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return 'high-intensity';
    if (intensity >= 6) return 'medium-intensity';
    return 'low-intensity';
  };

  const formatOrb = (orb: number) => {
    return `${orb.toFixed(1)}°`;
  };

  if (loading && !analysis) {
    return (
      <div className="western-transit-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Analyzing Western planetary transits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="western-transit-dashboard-error">
        <h3>Error Loading Transit Analysis</h3>
        <p>{error}</p>
        <button onClick={loadTransitAnalysis} className="retry-button">
          Retry Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="western-transit-analysis-dashboard">
      <header className="dashboard-header">
        <h1>Western Planetary Transits Analysis</h1>
        <div className="dashboard-controls">
          <label className="auto-refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh
          </label>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="refresh-interval"
          >
            <option value={60000}>1 minute</option>
            <option value={300000}>5 minutes</option>
            <option value={900000}>15 minutes</option>
            <option value={3600000}>1 hour</option>
          </select>
          <button onClick={loadTransitAnalysis} className="refresh-button">
            Refresh Now
          </button>
        </div>
      </header>

      <nav className="dashboard-tabs">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'active', label: 'Active Transits', icon: '⚡', count: analysis?.activeTransits.length },
          { id: 'upcoming', label: 'Upcoming', icon: '🔮', count: analysis?.upcomingTransits.length },
          { id: 'analysis', label: 'Period Analysis', icon: '📈' },
          { id: 'settings', label: 'Settings', icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="tab-count">{tab.count}</span>
            )}
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        {activeTab === 'overview' && analysis && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="overview-card summary">
                <h3>Analysis Summary</h3>
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-label">Active Transits</span>
                    <span className="stat-value">{analysis.summary.totalActiveTransits}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Average Intensity</span>
                    <span className="stat-value">{analysis.summary.averageIntensity.toFixed(1)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Period Intensity</span>
                    <span className="stat-value">{analysis.periodAnalysis.periodIntensity.toFixed(1)}/10</span>
                  </div>
                </div>
                <div className="overall-theme">
                  <h4>Current Theme</h4>
                  <p>{analysis.periodAnalysis.overallTheme}</p>
                </div>
              </div>

              <div className="overview-card dominant-aspects">
                <h3>Dominant Aspects</h3>
                <div className="aspect-breakdown">
                  {analysis.summary.dominantAspects.map((aspect, index) => (
                    <div key={index} className="aspect-item">
                      <span className={`aspect-badge ${getAspectColor(aspect.aspect)}`}>
                        {aspect.aspect}
                      </span>
                      <span className="aspect-count">{aspect.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overview-card life-areas">
                <h3>Affected Life Areas</h3>
                <div className="life-areas-list">
                  {analysis.periodAnalysis.dominantLifeAreas.map((area, index) => (
                    <span key={index} className="life-area-tag">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="overview-card analysis-options">
                <h3>Analysis Settings</h3>
                <div className="options-list">
                  <div className="option-item">
                    <span className="option-label">Look Ahead</span>
                    <span className="option-value">{analysis.analysisOptions.lookAheadDays} days</span>
                  </div>
                  <div className="option-item">
                    <span className="option-label">Look Back</span>
                    <span className="option-value">{analysis.analysisOptions.lookBackDays} days</span>
                  </div>
                  <div className="option-item">
                    <span className="option-label">Min Intensity</span>
                    <span className="option-value">{analysis.analysisOptions.minIntensity}/10</span>
                  </div>
                  <div className="option-item">
                    <span className="option-label">Minor Aspects</span>
                    <span className="option-value">{analysis.analysisOptions.includeMinorAspects ? 'Included' : 'Excluded'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'active' && analysis && (
          <div className="active-transits-tab">
            <h3>Active Transit Aspects</h3>
            {analysis.activeTransits.length > 0 ? (
              <div className="transits-grid">
                {analysis.activeTransits.map((transit, index) => (
                  <div key={index} className={`transit-card ${getIntensityColor(transit.intensity)}`}>
                    <div className="transit-header">
                      <div className="planets">
                        <span className="transiting-planet">
                          {getPlanetSymbol(transit.transitingPlanet)} {transit.transitingPlanet}
                        </span>
                        <span className={`aspect ${getAspectColor(transit.aspect)}`}>
                          {transit.aspect}
                        </span>
                        <span className="natal-planet">
                          {getPlanetSymbol(transit.natalPlanet)} {transit.natalPlanet}
                        </span>
                      </div>
                      <div className="transit-metrics">
                        <span className="intensity">Intensity: {transit.intensity}/10</span>
                        <span className="orb">Orb: {formatOrb(transit.orb)}</span>
                      </div>
                    </div>

                    {transit.interpretation && (
                      <div className="transit-interpretation">
                        <div className="life-areas">
                          <strong>Affected Areas:</strong> {transit.interpretation.affectedLifeAreas.join(', ')}
                        </div>
                        <div className="effect">
                          <strong>Effect:</strong> {transit.interpretation.primaryEffect}
                        </div>
                        <div className="duration">
                          <strong>Duration:</strong> ~{transit.interpretation.duration} days
                        </div>
                        <div className="description">
                          {transit.interpretation.description}
                        </div>
                        <div className="recommendations">
                          <strong>Recommendations:</strong>
                          <ul>
                            {transit.interpretation.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-transits">
                <p>No significant active transits at this time.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'upcoming' && analysis && (
          <div className="upcoming-transits-tab">
            <h3>Upcoming Transit Aspects</h3>
            {analysis.upcomingTransits.length > 0 ? (
              <div className="upcoming-transits-list">
                {analysis.upcomingTransits.slice(0, 20).map((transit, index) => (
                  <div key={index} className={`upcoming-transit-item ${getIntensityColor(transit.intensity)}`}>
                    <div className="transit-info">
                      <span className="transit-planets">
                        {getPlanetSymbol(transit.transitingPlanet)} {transit.transitingPlanet} {transit.aspect} {getPlanetSymbol(transit.natalPlanet)} {transit.natalPlanet}
                      </span>
                      <span className="transit-intensity">Intensity: {transit.intensity}/10</span>
                      <span className="transit-orb">Orb: {formatOrb(transit.orb)}</span>
                    </div>
                    <div className="transit-timing">
                      <span className="julian-day">JD: {transit.julianDay.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-upcoming">
                <p>No upcoming transits found in the specified time range.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analysis' && analysis && (
          <div className="analysis-tab">
            <h3>Period Analysis</h3>
            <div className="analysis-grid">
              <div className="analysis-card period-intensity">
                <h4>Period Intensity</h4>
                <div className="intensity-meter">
                  <div className="intensity-bar">
                    <div
                      className="intensity-fill"
                      style={{ width: `${(analysis.periodAnalysis.periodIntensity / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="intensity-value">{analysis.periodAnalysis.periodIntensity.toFixed(1)}/10</span>
                </div>
                <p className="intensity-description">
                  {analysis.periodAnalysis.periodIntensity > 7 ? 'High intensity period' :
                   analysis.periodAnalysis.periodIntensity > 4 ? 'Moderate intensity period' :
                   'Low intensity period'}
                </p>
              </div>

              <div className="analysis-card dominant-areas">
                <h4>Dominant Life Areas</h4>
                <div className="areas-list">
                  {analysis.periodAnalysis.dominantLifeAreas.map((area, index) => (
                    <div key={index} className="area-item">
                      <span className="area-name">{area}</span>
                      <span className="area-indicator"></span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="analysis-card transit-count">
                <h4>Transit Statistics</h4>
                <div className="stats-list">
                  <div className="stat">
                    <span className="stat-label">Total Active Transits</span>
                    <span className="stat-value">{analysis.periodAnalysis.transitCount}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Overall Theme</span>
                    <span className="stat-value">{analysis.periodAnalysis.overallTheme}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <h3>Analysis Settings</h3>
            <div className="settings-form">
              <div className="setting-group">
                <label>
                  <span>Look Ahead Days</span>
                  <input
                    type="number"
                    value={analysis?.analysisOptions.lookAheadDays || 365}
                    onChange={(e) => {
                      // This would update the analysis options
                      console.log('Update look ahead days:', e.target.value);
                    }}
                    min="1"
                    max="730"
                  />
                </label>
              </div>

              <div className="setting-group">
                <label>
                  <span>Look Back Days</span>
                  <input
                    type="number"
                    value={analysis?.analysisOptions.lookBackDays || 30}
                    onChange={(e) => {
                      // This would update the analysis options
                      console.log('Update look back days:', e.target.value);
                    }}
                    min="0"
                    max="365"
                  />
                </label>
              </div>

              <div className="setting-group">
                <label>
                  <span>Minimum Intensity</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={analysis?.analysisOptions.minIntensity || 5}
                    onChange={(e) => {
                      // This would update the analysis options
                      console.log('Update min intensity:', e.target.value);
                    }}
                  />
                  <span className="range-value">{analysis?.analysisOptions.minIntensity || 5}/10</span>
                </label>
              </div>

              <div className="setting-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={analysis?.analysisOptions.includeMinorAspects || false}
                    onChange={(e) => {
                      // This would update the analysis options
                      console.log('Toggle minor aspects:', e.target.checked);
                    }}
                  />
                  <span>Include Minor Aspects</span>
                </label>
              </div>

              <div className="setting-actions">
                <button className="apply-settings-button">
                  Apply Settings & Re-analyze
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>Analysis Date: {analysis ? new Date(analysis.analysisDate).toLocaleString() : 'Unknown'}</p>
        <p>Western Astrology Transit Analysis - ZC3.2</p>
      </footer>
    </div>
  );
};