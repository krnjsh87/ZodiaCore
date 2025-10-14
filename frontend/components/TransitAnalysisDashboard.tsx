import React, { useState, useEffect, useCallback } from 'react';
import { BirthChart, TransitPositions, TransitAspect } from '../types/astrology';
import { astrologyApi } from '../services/api';
import './TransitAnalysisDashboard.css';

interface TransitAnalysis {
  timestamp: number;
  currentPositions: TransitPositions;
  activeAspects: TransitAspect[];
  activeTransits: any[];
  overallInfluence: number;
  criticalPeriods: any[];
}

interface Alert {
  id: string;
  type: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: number;
  event?: any;
}

interface TransitEvent {
  type: string;
  planet?: string;
  sign?: number;
  startDate?: Date;
  endDate?: Date;
  timestamp?: number;
  analysis?: any;
}

interface TransitAnalysisDashboardProps {
  birthChart: BirthChart;
}

export const TransitAnalysisDashboard: React.FC<TransitAnalysisDashboardProps> = ({ birthChart }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState<TransitAnalysis | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [transitCalendar, setTransitCalendar] = useState<TransitEvent[]>([]);
  const [predictions, setPredictions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'calendar' | 'predictions' | 'remedies'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  // Load initial data
  const loadTransitData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current transit analysis
      const analysisResponse = await astrologyApi.calculateDashaTransits(birthChart);
      const analysis: TransitAnalysis = {
        timestamp: Date.now(),
        currentPositions: analysisResponse.data.transitPositions,
        activeAspects: analysisResponse.data.transitAspects,
        activeTransits: [], // Will be populated from backend
        overallInfluence: 65, // Mock value
        criticalPeriods: []
      };

      setCurrentAnalysis(analysis);

      // Generate predictions for next 90 days
      const predictionsData = {
        calendar: [],
        alerts: [],
        summary: {
          totalEvents: 15,
          transitPeriods: 8,
          aspectFormations: 12,
          criticalPeriods: 2,
          majorTransits: [
            { planet: 'SATURN', sign: 10, startDate: new Date('2025-03-15'), endDate: new Date('2028-03-15') },
            { planet: 'JUPITER', sign: 3, startDate: new Date('2025-05-15'), endDate: new Date('2026-05-15') }
          ],
          upcomingAlerts: [
            { type: 'transit_entry', message: 'Saturn entering Aquarius', priority: 'high', daysUntil: 15 },
            { type: 'aspect_formation', message: 'Mars squaring natal Sun', priority: 'medium', daysUntil: 7 }
          ]
        }
      };

      setPredictions(predictionsData);

      // Generate sample alerts
      const sampleAlerts: Alert[] = [
        {
          id: 'alert_1',
          type: 'transit_entry',
          priority: 'high',
          message: 'Saturn is entering Aquarius on March 15, 2025',
          timestamp: Date.now() - 86400000,
          event: { planet: 'SATURN', sign: 10 }
        },
        {
          id: 'alert_2',
          type: 'aspect_formation',
          priority: 'medium',
          message: 'Mars will form a square aspect with your natal Venus',
          timestamp: Date.now() - 43200000,
          event: { transitingPlanet: 'MARS', natalPlanet: 'VENUS', aspect: 'square' }
        }
      ];

      setAlerts(sampleAlerts);

      // Generate transit calendar
      const calendarEvents: TransitEvent[] = [
        {
          type: 'transit_period',
          planet: 'SATURN',
          sign: 10,
          startDate: new Date('2025-03-15'),
          endDate: new Date('2028-03-15'),
          analysis: { intensity: 85, lifeAreas: ['Career', 'Authority', 'Responsibilities'] }
        },
        {
          type: 'aspect_formation',
          timestamp: Date.now() + 7 * 24 * 60 * 60 * 1000,
          analysis: { intensity: 70, lifeAreas: ['Relationships', 'Finances'] }
        }
      ];

      setTransitCalendar(calendarEvents);

    } catch (err) {
      setError('Failed to load transit analysis data');
      console.error('Transit analysis error:', err);
    } finally {
      setLoading(false);
    }
  }, [birthChart]);

  // Auto-refresh functionality
  useEffect(() => {
    loadTransitData();

    if (autoRefresh) {
      const interval = setInterval(loadTransitData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [loadTransitData, autoRefresh, refreshInterval]);

  const formatLongitude = (longitude: number) => {
    const degrees = Math.floor(longitude);
    const minutes = Math.floor((longitude - degrees) * 60);
    return `${degrees}°${minutes}'`;
  };

  const getPlanetSymbol = (planet: string) => {
    const symbols: Record<string, string> = {
      SUN: '☉', MOON: '☽', MARS: '♂', MERCURY: '☿',
      JUPITER: '♃', VENUS: '♀', SATURN: '♄', RAHU: '☊', KETU: '☋'
    };
    return symbols[planet] || planet;
  };

  const getSignName = (sign: number) => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    return signs[sign] || 'Unknown';
  };

  const getAspectColor = (aspect: string) => {
    switch (aspect) {
      case 'CONJUNCTION': return 'conjunction';
      case 'OPPOSITION': return 'opposition';
      case 'TRINE': return 'trine';
      case 'SQUARE': return 'square';
      case 'SEXTILE': return 'sextile';
      default: return 'no-aspect';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  if (loading && !currentAnalysis) {
    return (
      <div className="transit-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading transit analysis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transit-dashboard-error">
        <h3>Error Loading Transit Data</h3>
        <p>{error}</p>
        <button onClick={loadTransitData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="transit-analysis-dashboard">
      <header className="dashboard-header">
        <h1>Transit Analysis & Alerts</h1>
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
            <option value={15000}>15 seconds</option>
            <option value={30000}>30 seconds</option>
            <option value={60000}>1 minute</option>
            <option value={300000}>5 minutes</option>
          </select>
          <button onClick={loadTransitData} className="refresh-button">
            Refresh Now
          </button>
        </div>
      </header>

      <nav className="dashboard-tabs">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'alerts', label: 'Alerts', icon: '🚨', count: alerts.length },
          { id: 'calendar', label: 'Calendar', icon: '📅' },
          { id: 'predictions', label: 'Predictions', icon: '🔮' },
          { id: 'remedies', label: 'Remedies', icon: '🙏' }
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
        {activeTab === 'overview' && currentAnalysis && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="overview-card current-positions">
                <h3>Current Planetary Positions</h3>
                <div className="positions-grid">
                  {Object.entries(currentAnalysis.currentPositions).map(([planet, longitude]) => (
                    <div key={planet} className="position-item">
                      <span className="planet-symbol">{getPlanetSymbol(planet)}</span>
                      <div className="position-details">
                        <span className="planet-name">{planet}</span>
                        <span className="longitude">{formatLongitude(longitude)}</span>
                        <span className="sign">{getSignName(Math.floor(longitude / 30))}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overview-card active-aspects">
                <h3>Active Aspects</h3>
                {currentAnalysis.activeAspects.length > 0 ? (
                  <div className="aspects-list">
                    {currentAnalysis.activeAspects.map((aspect, index) => (
                      <div key={index} className={`aspect-item ${getAspectColor(aspect.aspect)}`}>
                        <div className="aspect-planets">
                          <span className="natal-planet">
                            {getPlanetSymbol(aspect.natalPlanet)} {aspect.natalPlanet}
                          </span>
                          <span className="aspect-type">{aspect.aspect}</span>
                          <span className="transit-planet">
                            {getPlanetSymbol(aspect.transitPlanet)} {aspect.transitPlanet}
                          </span>
                        </div>
                        <div className="aspect-details">
                          <span className="orb">Orb: {aspect.orb.toFixed(1)}°</span>
                          <span className="strength">Strength: {(aspect.strength * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-aspects">No significant aspects currently active</p>
                )}
              </div>

              <div className="overview-card transit-strength">
                <h3>Overall Transit Influence</h3>
                <div className="strength-meter">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{ width: `${currentAnalysis.overallInfluence}%` }}
                    ></div>
                  </div>
                  <span className="strength-value">{currentAnalysis.overallInfluence}/100</span>
                </div>
                <p className="strength-description">
                  {currentAnalysis.overallInfluence > 70 ? 'High influence period' :
                   currentAnalysis.overallInfluence > 40 ? 'Moderate influence period' :
                   'Low influence period'}
                </p>
              </div>

              <div className="overview-card critical-periods">
                <h3>Critical Periods</h3>
                {currentAnalysis.criticalPeriods.length > 0 ? (
                  <div className="critical-list">
                    {currentAnalysis.criticalPeriods.map((period, index) => (
                      <div key={index} className="critical-item">
                        <span className="critical-icon">⚠️</span>
                        <div className="critical-details">
                          <span className="critical-title">{period.reason}</span>
                          <span className="critical-intensity">Intensity: {period.criticality}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-critical">No critical periods currently active</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="alerts-tab">
            <div className="alerts-header">
              <h3>Transit Alerts</h3>
              <span className="alerts-count">{alerts.length} active alerts</span>
            </div>

            {alerts.length > 0 ? (
              <div className="alerts-list">
                {alerts.map(alert => (
                  <div key={alert.id} className={`alert-item ${getPriorityColor(alert.priority)}`}>
                    <div className="alert-content">
                      <div className="alert-header">
                        <span className={`alert-priority priority-${alert.priority}`}>
                          {alert.priority.toUpperCase()}
                        </span>
                        <span className="alert-type">{alert.type.replace('_', ' ')}</span>
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="dismiss-button"
                          aria-label="Dismiss alert"
                        >
                          ×
                        </button>
                      </div>
                      <p className="alert-message">{alert.message}</p>
                      <span className="alert-timestamp">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-alerts">
                <p>No active alerts at this time.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="calendar-tab">
            <h3>Transit Calendar</h3>
            <div className="calendar-events">
              {transitCalendar.map((event, index) => (
                <div key={index} className={`calendar-event event-${event.type}`}>
                  <div className="event-header">
                    <span className="event-type">{event.type.replace('_', ' ')}</span>
                    {event.planet && (
                      <span className="event-planet">
                        {getPlanetSymbol(event.planet)} {event.planet}
                      </span>
                    )}
                  </div>
                  <div className="event-details">
                    {event.startDate && event.endDate && (
                      <span className="event-dates">
                        {event.startDate.toLocaleDateString()} - {event.endDate.toLocaleDateString()}
                      </span>
                    )}
                    {event.sign !== undefined && (
                      <span className="event-sign">{getSignName(event.sign)}</span>
                    )}
                    {event.analysis && (
                      <div className="event-analysis">
                        <span className="intensity">Intensity: {event.analysis.intensity}/100</span>
                        <span className="life-areas">
                          Areas: {event.analysis.lifeAreas?.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'predictions' && predictions && (
          <div className="predictions-tab">
            <h3>Transit Predictions</h3>
            <div className="predictions-grid">
              <div className="prediction-card summary">
                <h4>Summary</h4>
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total Events</span>
                    <span className="stat-value">{predictions.summary.totalEvents}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Transit Periods</span>
                    <span className="stat-value">{predictions.summary.transitPeriods}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Critical Periods</span>
                    <span className="stat-value">{predictions.summary.criticalPeriods}</span>
                  </div>
                </div>
              </div>

              <div className="prediction-card major-transits">
                <h4>Major Transits</h4>
                <div className="major-transits-list">
                  {predictions.summary.majorTransits.map((transit: any, index: number) => (
                    <div key={index} className="major-transit-item">
                      <span className="transit-planet">{getPlanetSymbol(transit.planet)} {transit.planet}</span>
                      <span className="transit-sign">{getSignName(transit.sign)}</span>
                      <span className="transit-dates">
                        {transit.startDate.toLocaleDateString()} - {transit.endDate.toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="prediction-card upcoming-alerts">
                <h4>Upcoming Alerts</h4>
                <div className="upcoming-alerts-list">
                  {predictions.summary.upcomingAlerts.map((alert: any, index: number) => (
                    <div key={index} className={`upcoming-alert alert-${alert.priority}`}>
                      <span className="alert-type">{alert.type.replace('_', ' ')}</span>
                      <span className="alert-message">{alert.message}</span>
                      <span className="days-until">{alert.daysUntil} days</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'remedies' && (
          <div className="remedies-tab">
            <h3>Remedial Measures</h3>
            <div className="remedies-grid">
              <div className="remedy-card planetary-remedies">
                <h4>Planetary Remedies</h4>
                <div className="remedy-list">
                  <div className="remedy-item">
                    <h5>Saturn Remedies</h5>
                    <ul>
                      <li>Chant "Om Sham Shanaishcharaye Namaha" 108 times daily</li>
                      <li>Donate black sesame seeds on Saturdays</li>
                      <li>Wear blue sapphire (after proper consultation)</li>
                    </ul>
                  </div>
                  <div className="remedy-item">
                    <h5>Jupiter Remedies</h5>
                    <ul>
                      <li>Chant "Om Gurave Namaha" 108 times daily</li>
                      <li>Donate yellow items (turmeric, saffron) on Thursdays</li>
                      <li>Wear yellow sapphire (after proper consultation)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="remedy-card general-remedies">
                <h4>General Remedies</h4>
                <div className="remedy-list">
                  <div className="remedy-item">
                    <h5>During Challenging Transits</h5>
                    <ul>
                      <li>Perform daily prayer and meditation</li>
                      <li>Avoid major decisions during critical periods</li>
                      <li>Practice patience and maintain positive mindset</li>
                      <li>Consult with experienced astrologer</li>
                    </ul>
                  </div>
                  <div className="remedy-item">
                    <h5>Strengthening Remedies</h5>
                    <ul>
                      <li>Regular charity and donation work</li>
                      <li>Chanting specific mantras</li>
                      <li>Wearing protective gemstones</li>
                      <li>Following spiritual practices</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="remedy-card timing-remedies">
                <h4>Timing-Based Remedies</h4>
                <div className="remedy-list">
                  <div className="remedy-item">
                    <h5>Weekly Remedies</h5>
                    <ul>
                      <li>Sunday: Sun remedies (copper donation)</li>
                      <li>Monday: Moon remedies (white flowers)</li>
                      <li>Tuesday: Mars remedies (red lentils)</li>
                      <li>Wednesday: Mercury remedies (green items)</li>
                      <li>Thursday: Jupiter remedies (yellow items)</li>
                      <li>Friday: Venus remedies (white items)</li>
                      <li>Saturday: Saturn remedies (black items)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>Last updated: {currentAnalysis ? new Date(currentAnalysis.timestamp).toLocaleString() : 'Never'}</p>
        <p>Data refreshes every {refreshInterval / 1000} seconds when auto-refresh is enabled</p>
      </footer>
    </div>
  );
};