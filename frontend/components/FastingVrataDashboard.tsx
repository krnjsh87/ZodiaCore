import React, { useState, useEffect } from 'react';
import { astrologyApi } from '../services/api';
import {
  FastingRecommendations,
  FastingCompletion,
  FastingStatistics,
  BirthChart,
  FastingApiResponse
} from '../types/astrology';
import './FastingVrataDashboard.css';

// Mock birth chart for demonstration
const mockBirthChart: BirthChart = {
  birthData: {
    year: 1990,
    month: 1,
    day: 15,
    hour: 12,
    minute: 0,
    second: 0,
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 5.5 // IST offset in hours
  },
  julianDay: 2447892.0,
  ayanamsa: 23.5,
  lst: 120.5,
  ascendant: {
    longitude: 45.2,
    sign: 1,
    degree: 15.2
  },
  houses: Array.from({ length: 12 }, (_, i) => i * 30),
  planets: {
    SUN: { longitude: 45.2, sign: 1, degree: 15.2, house: 1, retrograde: false },
    MOON: { longitude: 120.5, sign: 4, degree: 0.5, house: 7, retrograde: false },
    MARS: { longitude: 78.3, sign: 2, degree: 18.3, house: 4, retrograde: false },
    MERCURY: { longitude: 52.1, sign: 1, degree: 22.1, house: 1, retrograde: false },
    JUPITER: { longitude: 234.7, sign: 7, degree: 24.7, house: 10, retrograde: false },
    VENUS: { longitude: 67.8, sign: 2, degree: 7.8, house: 3, retrograde: false },
    SATURN: { longitude: 301.4, sign: 10, degree: 1.4, house: 12, retrograde: false },
    RAHU: { longitude: 156.9, sign: 5, degree: 6.9, house: 8, retrograde: false },
    KETU: { longitude: 336.9, sign: 11, degree: 6.9, house: 2, retrograde: false }
  },
  moonDetails: {
    nakshatra: {
      nakshatraNumber: 4,
      nakshatraName: 'Rohini',
      nakshatra: 4,
      pada: 2,
      lord: 'MOON',
      degreesInNakshatra: 8.5,
      degreesInPada: 2.5,
      remainingDegrees: 10.5
    },
    tithi: {
      number: 11,
      name: 'Ekadashi',
      progress: 0.5,
      paksha: 'Shukla'
    }
  },
  dasha: {
    balance: {
      lord: 'VENUS',
      balanceYears: 15,
      balanceDays: 120
    },
    mahadashas: [{
      planet: 'VENUS',
      startDate: new Date('2020-01-15'),
      endDate: new Date('2040-01-15'),
      duration: 20
    }]
  },
  divisionalCharts: {},
  yogas: [],
  strengths: {
    SUN: { shadbala: 0.8, dignity: 0.7, aspectual: 0.6, positional: 0.5, overall: 0.65 },
    MOON: { shadbala: 0.75, dignity: 0.8, aspectual: 0.7, positional: 0.6, overall: 0.71 },
    MARS: { shadbala: 0.6, dignity: 0.5, aspectual: 0.8, positional: 0.7, overall: 0.65 },
    MERCURY: { shadbala: 0.85, dignity: 0.9, aspectual: 0.75, positional: 0.8, overall: 0.83 },
    JUPITER: { shadbala: 0.9, dignity: 0.85, aspectual: 0.8, positional: 0.75, overall: 0.83 },
    VENUS: { shadbala: 0.88, dignity: 0.92, aspectual: 0.85, positional: 0.8, overall: 0.86 },
    SATURN: { shadbala: 0.55, dignity: 0.6, aspectual: 0.5, positional: 0.45, overall: 0.53 },
    RAHU: { shadbala: 0.7, dignity: 0.65, aspectual: 0.75, positional: 0.7, overall: 0.7 },
    KETU: { shadbala: 0.65, dignity: 0.7, aspectual: 0.6, positional: 0.65, overall: 0.65 }
  }
};

/**
 * FastingVrataDashboard - Main component for Vedic fasting recommendations
 * Displays personalized fasting recommendations based on birth chart and current tithi
 */
const FastingVrataDashboard: React.FC = () => {
  const [recommendations, setRecommendations] = useState<FastingRecommendations | null>(null);
  const [statistics, setStatistics] = useState<FastingStatistics | null>(null);
  const [history, setHistory] = useState<FastingCompletion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVrata, setSelectedVrata] = useState<string | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');

  // Mock birth chart for demonstration - in production, this would come from user data
  const mockBirthChart: BirthChart = {
    birthData: {
      year: 1990,
      month: 1,
      day: 15,
      hour: 12,
      minute: 30,
      second: 0,
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: 5.5 // UTC offset in hours
    },
    julianDay: 2447892.0,
    ayanamsa: 23.5,
    lst: 45.2,
    ascendant: {
      longitude: 45.2,
      sign: 1,
      degree: 15.2
    },
    houses: Array.from({ length: 12 }, (_, i) => i * 30),
    planets: {
      SUN: { longitude: 45.2, sign: 1, degree: 15.2, house: 1, retrograde: false },
      MOON: { longitude: 120.5, sign: 4, degree: 0.5, house: 7, retrograde: false },
      MARS: { longitude: 78.3, sign: 2, degree: 18.3, house: 11, retrograde: false },
      MERCURY: { longitude: 52.1, sign: 1, degree: 22.1, house: 10, retrograde: false },
      JUPITER: { longitude: 234.7, sign: 7, degree: 24.7, house: 4, retrograde: false },
      VENUS: { longitude: 67.8, sign: 2, degree: 7.8, house: 11, retrograde: false },
      SATURN: { longitude: 301.4, sign: 10, degree: 1.4, house: 6, retrograde: false },
      RAHU: { longitude: 156.9, sign: 5, degree: 6.9, house: 12, retrograde: false },
      KETU: { longitude: 336.9, sign: 11, degree: 6.9, house: 6, retrograde: false }
    },
    moonDetails: {
      nakshatra: {
        nakshatraNumber: 4,
        nakshatraName: 'Rohini',
        nakshatra: 4,
        lord: 'MOON',
        pada: 2,
        degreesInNakshatra: 13.5,
        degreesInPada: 3.5,
        remainingDegrees: 9.0
      },
      tithi: {
        number: 11,
        name: 'Ekadashi',
        progress: 0.5,
        paksha: 'Shukla'
      }
    },
    dasha: {
      balance: {
        lord: 'VENUS',
        balanceYears: 15,
        balanceDays: 120
      },
      mahadashas: [{
        planet: 'VENUS',
        startDate: new Date('2020-01-15'),
        endDate: new Date('2040-01-15'),
        duration: 20
      }]
    },
    divisionalCharts: {},
    yogas: [],
    strengths: {
      SUN: { shadbala: 0.8, dignity: 0.7, aspectual: 0.6, positional: 0.5, overall: 0.65 },
      MOON: { shadbala: 0.75, dignity: 0.8, aspectual: 0.7, positional: 0.6, overall: 0.71 },
      MARS: { shadbala: 0.6, dignity: 0.5, aspectual: 0.8, positional: 0.7, overall: 0.65 },
      MERCURY: { shadbala: 0.85, dignity: 0.9, aspectual: 0.75, positional: 0.8, overall: 0.83 },
      JUPITER: { shadbala: 0.9, dignity: 0.85, aspectual: 0.8, positional: 0.75, overall: 0.83 },
      VENUS: { shadbala: 0.88, dignity: 0.92, aspectual: 0.85, positional: 0.8, overall: 0.86 },
      SATURN: { shadbala: 0.55, dignity: 0.6, aspectual: 0.5, positional: 0.45, overall: 0.53 },
      RAHU: { shadbala: 0.7, dignity: 0.65, aspectual: 0.75, positional: 0.7, overall: 0.7 },
      KETU: { shadbala: 0.65, dignity: 0.7, aspectual: 0.6, positional: 0.65, overall: 0.65 }
    }
  };

  const currentLocation = { latitude: 28.6139, longitude: 77.2090 };
  const userId = 'demo-user-123';

  useEffect(() => {
    loadFastingData();
  }, []);

  const loadFastingData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load recommendations, statistics, and history in parallel
      const [recResult, statsResult, historyResult] = await Promise.all([
        astrologyApi.generateFastingRecommendations(userId, mockBirthChart, currentLocation),
        astrologyApi.getFastingStatistics(userId),
        astrologyApi.getFastingHistory(userId)
      ]);

      if (recResult.success && recResult.data) {
        setRecommendations(recResult.data);
      }

      if (statsResult.success && statsResult.data) {
        setStatistics(statsResult.data);
      }

      if (historyResult.success && historyResult.data) {
        setHistory(historyResult.data);
      }
    } catch (err) {
      setError('Failed to load fasting data. Please try again.');
      console.error('Error loading fasting data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVrataCompletion = async (vrataType: string, completed: boolean) => {
    if (!selectedVrata) return;

    try {
      const result = await astrologyApi.trackFastingCompletion(
        userId,
        vrataType,
        completed,
        completionNotes.trim() || undefined
      );

      if (result.success) {
        // Refresh data
        await loadFastingData();
        setSelectedVrata(null);
        setCompletionNotes('');
      } else {
        setError('Failed to track fasting completion.');
      }
    } catch (err) {
      setError('Failed to track fasting completion.');
      console.error('Error tracking completion:', err);
    }
  };

  if (loading) {
    return (
      <div className="fasting-dashboard" role="main" aria-labelledby="fasting-title">
        <div className="fasting-loading">
          <div className="fasting-spinner" aria-hidden="true"></div>
          <p>Loading fasting recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fasting-dashboard" role="main" aria-labelledby="fasting-title">
        <div className="fasting-error">
          <h2 id="fasting-title">🕉️ Fasting Vrata Recommendations</h2>
          <div className="error-message" role="alert">
            <p>{error}</p>
            <button
              onClick={loadFastingData}
              className="retry-button"
              aria-label="Retry loading fasting data"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fasting-dashboard" role="main" aria-labelledby="fasting-title">
      <header className="fasting-header">
        <h1 id="fasting-title">🕉️ Vedic Fasting (Vrata) Recommendations</h1>
        <p className="fasting-subtitle">
          Personalized fasting recommendations based on your birth chart and current planetary positions
        </p>
      </header>

      <div className="fasting-content">
        {/* Current Tithi Information */}
        {recommendations?.tithiInfo && (
          <section className="fasting-section" aria-labelledby="tithi-heading">
            <h2 id="tithi-heading">Current Tithi</h2>
            <div className="tithi-card">
              <div className="tithi-info">
                <h3>{recommendations.tithiInfo.name}</h3>
                <p className="tithi-details">
                  Tithi {recommendations.tithiInfo.number} - {recommendations.tithiInfo.paksha} Paksha
                </p>
                <p className="tithi-significance">{recommendations.tithiInfo.significance}</p>
                {recommendations.tithiInfo.fastingRecommended && (
                  <div className="fasting-recommended" role="status" aria-live="polite">
                    <span className="recommended-badge">Fasting Recommended</span>
                  </div>
                )}
              </div>
              <div className="tithi-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${recommendations.tithiInfo.progress * 100}%` }}
                    aria-valuenow={recommendations.tithiInfo.progress * 100}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    role="progressbar"
                    aria-label={`Tithi progress: ${Math.round(recommendations.tithiInfo.progress * 100)}%`}
                  ></div>
                </div>
                <span className="progress-text">
                  {Math.round(recommendations.tithiInfo.progress * 100)}% Complete
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Recommended Vratas */}
        {recommendations?.recommendedVratas && recommendations.recommendedVratas.length > 0 && (
          <section className="fasting-section" aria-labelledby="recommendations-heading">
            <h2 id="recommendations-heading">Recommended Vratas</h2>
            <div className="vrata-grid">
              {recommendations.recommendedVratas.map((vrata, index) => (
                <div key={index} className={`vrata-card priority-${vrata.priority.toLowerCase()}`}>
                  <div className="vrata-header">
                    <h3>{vrata.type} Fasting</h3>
                    <span className={`priority-badge ${vrata.priority.toLowerCase()}`}>
                      {vrata.priority}
                    </span>
                  </div>

                  {vrata.tithi && (
                    <div className="vrata-tithi">
                      <p><strong>Tithi:</strong> {vrata.tithi.name} ({vrata.tithi.paksha})</p>
                      <p><strong>Significance:</strong> {vrata.tithi.significance}</p>
                    </div>
                  )}

                  <div className="vrata-details">
                    <p><strong>Duration:</strong> {vrata.duration}</p>
                    <p><strong>Rules:</strong> {vrata.rules?.join(', ')}</p>
                    {vrata.rituals && (
                      <p><strong>Rituals:</strong> {vrata.rituals.join(', ')}</p>
                    )}
                  </div>

                  <div className="vrata-actions">
                    <button
                      onClick={() => setSelectedVrata(vrata.type)}
                      className="complete-button"
                      aria-label={`Mark ${vrata.type} fasting as completed`}
                    >
                      Mark as Completed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Planetary Fasting */}
        {recommendations?.planetaryFasting && (
          <section className="fasting-section" aria-labelledby="planetary-heading">
            <h2 id="planetary-heading">Planetary Fasting</h2>
            <div className="planetary-grid">
              {Object.entries(recommendations.planetaryFasting).map(([planet, data]) => (
                <div key={planet} className="planetary-card">
                  <div className="planetary-header">
                    <h3>{planet} Fasting</h3>
                    <span className="planet-day">{data.recommendedDay}</span>
                  </div>
                  <div className="planetary-details">
                    <p><strong>Type:</strong> {data.fastingType}</p>
                    <p><strong>Benefits:</strong> {data.benefits.join(', ')}</p>
                    <p><strong>Next Date:</strong> {data.nextDate.toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Remedial Fasting */}
        {recommendations?.remedialFasting && recommendations.remedialFasting.length > 0 && (
          <section className="fasting-section" aria-labelledby="remedial-heading">
            <h2 id="remedial-heading">Remedial Fasting</h2>
            <div className="remedial-list">
              {recommendations.remedialFasting.map((remedy, index) => (
                <div key={index} className="remedial-card">
                  <h3>{remedy.condition}</h3>
                  <div className="remedial-details">
                    <p><strong>Fasting:</strong> {remedy.fasting}</p>
                    <p><strong>Duration:</strong> {remedy.duration} days</p>
                    <p><strong>Frequency:</strong> {remedy.frequency}</p>
                    <p><strong>Rules:</strong> {remedy.rules.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Statistics */}
        {statistics && (
          <section className="fasting-section" aria-labelledby="statistics-heading">
            <h2 id="statistics-heading">Your Fasting Journey</h2>
            <div className="statistics-grid">
              <div className="stat-card">
                <div className="stat-value">{statistics.totalFasts}</div>
                <div className="stat-label">Total Fasts</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{statistics.completedFasts}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{statistics.successRate}%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{statistics.currentStreak}</div>
                <div className="stat-label">Current Streak</div>
              </div>
            </div>
            {statistics.favoriteVrata && (
              <p className="favorite-vrata">
                <strong>Favorite Vrata:</strong> {statistics.favoriteVrata}
              </p>
            )}
          </section>
        )}

        {/* Recent History */}
        {history.length > 0 && (
          <section className="fasting-section" aria-labelledby="history-heading">
            <h2 id="history-heading">Recent Fasting History</h2>
            <div className="history-list">
              {history.slice(0, 5).map((item, index) => (
                <div key={index} className={`history-item ${item.completed ? 'completed' : 'not-completed'}`}>
                  <div className="history-info">
                    <span className="vrata-type">{item.vrataType}</span>
                    <span className="completion-date">
                      {new Date(item.completionDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="history-status">
                    <span className={`status-badge ${item.completed ? 'completed' : 'pending'}`}>
                      {item.completed ? 'Completed' : 'Not Completed'}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="history-notes">{item.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Completion Modal */}
      {selectedVrata && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-content">
            <h2 id="modal-title">Mark Fasting as Completed</h2>
            <p>Have you completed your {selectedVrata} fasting?</p>

            <div className="notes-section">
              <label htmlFor="completion-notes">Notes (optional):</label>
              <textarea
                id="completion-notes"
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Add any notes about your fasting experience..."
                rows={3}
                aria-describedby="notes-help"
              />
              <small id="notes-help">Share your experience or any challenges faced</small>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setSelectedVrata(null)}
                className="cancel-button"
                aria-label="Cancel completion tracking"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVrataCompletion(selectedVrata, false)}
                className="not-completed-button"
                aria-label="Mark fasting as not completed"
              >
                Not Completed
              </button>
              <button
                onClick={() => handleVrataCompletion(selectedVrata, true)}
                className="completed-button"
                aria-label="Mark fasting as completed"
              >
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FastingVrataDashboard;