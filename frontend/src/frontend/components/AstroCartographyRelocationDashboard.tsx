import React, { useState, useCallback } from 'react';
import { BirthData, AstroCartographyRelocationAnalysis, LocationCompatibilityAnalysis, PlanetaryLine } from '../types/astrology';
import BirthChartInput from './BirthChartInput';
import PlanetaryLinesVisualization from './PlanetaryLinesVisualization';
import './AstroCartographyRelocationDashboard.css';

/**
 * Astro-cartography and Relocation Counseling Dashboard Component
 * Provides comprehensive analysis for location-based astrological counseling
 */
const AstroCartographyRelocationDashboard: React.FC = () => {
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [analysis, setAnalysis] = useState<AstroCartographyRelocationAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    name?: string;
  } | null>(null);
  const [locationPurpose, setLocationPurpose] = useState<'general' | 'career' | 'relationship' | 'health' | 'spiritual'>('general');
  const [selectedLine, setSelectedLine] = useState<PlanetaryLine | null>(null);

  /**
   * Handle birth chart submission
   */
  const handleBirthChartSubmit = useCallback(async (data: BirthData) => {
    setBirthData(data);
    setLoading(true);
    setError(null);

    try {
      // Calculate astro-cartography
      const cartographyResponse = await fetch('/api/v1/astro-cartography', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          birthChart: { birthData: data },
          options: {
            includeParallels: true,
            lineTypes: ['conjunction', 'opposition', 'trine'],
            orbSize: 2.0
          }
        })
      });

      if (!cartographyResponse.ok) {
        throw new Error('Failed to calculate astro-cartography');
      }

      const cartographyData = await cartographyResponse.json();

      // Initialize analysis with cartography data
      setAnalysis({
        analysisId: `analysis_${Date.now()}`,
        birthChart: { birthData: data } as any, // Simplified for now
        astroCartography: cartographyData,
        relocationAnalyses: [],
        counseling: {
          recommendations: {
            immediate: [],
            shortTerm: [],
            longTerm: [],
            precautions: [],
            optimalTiming: []
          },
          summary: {
            overallScore: 0,
            keyStrengths: [],
            mainChallenges: [],
            recommendedActions: []
          },
          actionPlan: {
            immediate: [],
            weekly: [],
            monthly: [],
            ongoing: []
          }
        },
        generatedAt: new Date(),
        confidence: 0.85
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handle location analysis
   */
  const handleLocationAnalysis = useCallback(async () => {
    if (!birthData || !selectedLocation) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/location/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          birthChart: { birthData },
          location: selectedLocation,
          purpose: locationPurpose,
          userProfile: {} // Can be extended
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze location');
      }

      const locationAnalysis: LocationCompatibilityAnalysis = await response.json();

      // Update analysis with new location data
      setAnalysis(prev => prev ? {
        ...prev,
        relocationAnalyses: [...prev.relocationAnalyses, locationAnalysis]
      } : null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze location');
    } finally {
      setLoading(false);
    }
  }, [birthData, selectedLocation, locationPurpose]);

  /**
   * Handle location input change
   */
  const handleLocationChange = useCallback((field: 'latitude' | 'longitude' | 'name', value: string | number) => {
    setSelectedLocation(prev => ({
      ...prev,
      [field]: value
    } as any));
  }, []);

  return (
    <div className="astro-cartography-dashboard">
      <header className="dashboard-header">
        <h1>Astro-cartography & Relocation Counseling</h1>
        <p>Discover how planetary influences affect different locations for your life journey</p>
      </header>

      <div className="dashboard-content">
        {/* Birth Chart Input Section */}
        {!birthData && (
          <section className="input-section" aria-labelledby="birth-chart-heading">
            <h2 id="birth-chart-heading">Enter Your Birth Details</h2>
            <BirthChartInput
              onSubmit={handleBirthChartSubmit}
              loading={loading}
              error={error || undefined}
            />
          </section>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="analysis-results">
            {/* Astro-cartography Overview */}
            <section className="cartography-overview" aria-labelledby="cartography-heading">
              <h2 id="cartography-heading">Planetary Lines Analysis</h2>
              <div className="lines-summary">
                <div className="summary-stat">
                  <span className="stat-number">{analysis.astroCartography.totalLines}</span>
                  <span className="stat-label">Total Lines</span>
                </div>
                <div className="lines-breakdown">
                  {Object.entries(analysis.astroCartography.linesByPlanet).map(([planet, lines]) => (
                    <div key={planet} className="planet-lines">
                      <span className="planet-name">{planet}</span>
                      <span className="line-count">{lines.length} lines</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Planetary Lines Visualization */}
            <section className="visualization-section" aria-labelledby="visualization-heading">
              <h2 id="visualization-heading">Planetary Lines Map</h2>
              <PlanetaryLinesVisualization
                lines={analysis.astroCartography.lines}
                selectedLine={selectedLine}
                onLineSelect={setSelectedLine}
                width={800}
                height={400}
              />
            </section>

            {/* Location Analysis Section */}
            <section className="location-analysis" aria-labelledby="location-heading">
              <h2 id="location-heading">Location Compatibility Analysis</h2>

              <div className="location-input-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="location-name">Location Name (Optional)</label>
                    <input
                      type="text"
                      id="location-name"
                      value={selectedLocation?.name || ''}
                      onChange={(e) => handleLocationChange('name', e.target.value)}
                      placeholder="e.g., New York City"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="latitude">Latitude</label>
                    <input
                      type="number"
                      id="latitude"
                      value={selectedLocation?.latitude || ''}
                      onChange={(e) => handleLocationChange('latitude', parseFloat(e.target.value))}
                      step="0.0001"
                      min="-90"
                      max="90"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="longitude">Longitude</label>
                    <input
                      type="number"
                      id="longitude"
                      value={selectedLocation?.longitude || ''}
                      onChange={(e) => handleLocationChange('longitude', parseFloat(e.target.value))}
                      step="0.0001"
                      min="-180"
                      max="180"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="purpose">Purpose</label>
                    <select
                      id="purpose"
                      value={locationPurpose}
                      onChange={(e) => setLocationPurpose(e.target.value as any)}
                    >
                      <option value="general">General Living</option>
                      <option value="career">Career/Work</option>
                      <option value="relationship">Relationships</option>
                      <option value="health">Health/Wellness</option>
                      <option value="spiritual">Spiritual Growth</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleLocationAnalysis}
                  disabled={loading || !selectedLocation?.latitude || !selectedLocation?.longitude}
                  className="analyze-button"
                >
                  {loading ? 'Analyzing...' : 'Analyze Location'}
                </button>
              </div>

              {/* Location Analysis Results */}
              {analysis.relocationAnalyses.length > 0 && (
                <div className="location-results">
                  {analysis.relocationAnalyses.map((locationAnalysis, index) => (
                    <div key={index} className="location-result-card">
                      <h3>{locationAnalysis.location.name || `${locationAnalysis.location.latitude.toFixed(4)}, ${locationAnalysis.location.longitude.toFixed(4)}`}</h3>

                      <div className="score-display">
                        <div className="overall-score">
                          <span className="score-value">{locationAnalysis.overallScore.toFixed(1)}</span>
                          <span className="score-label">Overall Compatibility</span>
                        </div>
                        <div className="score-bar">
                          <div
                            className="score-fill"
                            style={{ width: `${locationAnalysis.overallScore}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="influences-summary">
                        <div className="beneficial-influences">
                          <h4>Beneficial Influences</h4>
                          <ul>
                            {locationAnalysis.astroCartography.influences.beneficial.slice(0, 3).map((influence, idx) => (
                              <li key={idx}>
                                <strong>{influence.planet} {influence.type}</strong>: {influence.description}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="challenging-influences">
                          <h4>Areas of Growth</h4>
                          <ul>
                            {locationAnalysis.astroCartography.influences.challenging.slice(0, 3).map((influence, idx) => (
                              <li key={idx}>
                                <strong>{influence.planet} {influence.type}</strong>: {influence.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="recommendations">
                        <h4>Key Recommendations</h4>
                        <ul>
                          {locationAnalysis.recommendations.slice(0, 3).map((rec, idx) => (
                            <li key={idx} className={`recommendation-${rec.type}`}>
                              {rec.message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Counseling Recommendations */}
            <section className="counseling-section" aria-labelledby="counseling-heading">
              <h2 id="counseling-heading">Personalized Counseling Recommendations</h2>

              <div className="recommendations-grid">
                <div className="recommendation-category">
                  <h3>Immediate Actions</h3>
                  <ul>
                    {analysis.counseling.recommendations.immediate.map((rec, idx) => (
                      <li key={idx} className={`priority-${rec.priority || 'medium'}`}>
                        {rec.message}
                        {rec.action && <div className="action-item">{rec.action}</div>}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="recommendation-category">
                  <h3>Short-term Goals (3-6 months)</h3>
                  <ul>
                    {analysis.counseling.recommendations.shortTerm.map((rec, idx) => (
                      <li key={idx} className={`priority-${rec.priority || 'medium'}`}>
                        {rec.message}
                        {rec.duration && <span className="duration">({rec.duration})</span>}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="recommendation-category">
                  <h3>Long-term Planning (6-12 months)</h3>
                  <ul>
                    {analysis.counseling.recommendations.longTerm.map((rec, idx) => (
                      <li key={idx} className={`priority-${rec.priority || 'medium'}`}>
                        {rec.message}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="recommendation-category">
                  <h3>Precautions & Awareness</h3>
                  <ul>
                    {analysis.counseling.recommendations.precautions.map((rec, idx) => (
                      <li key={idx} className="caution">
                        {rec.message}
                        {rec.remedy && <div className="remedy">{rec.remedy}</div>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-message" role="alert">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AstroCartographyRelocationDashboard;