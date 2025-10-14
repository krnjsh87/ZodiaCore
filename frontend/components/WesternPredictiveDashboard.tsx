import React, { useState, useCallback } from 'react';
import { BirthData, WesternBirthChart } from '../types/astrology';
import { astrologyApi } from '../services/api';
import './WesternPredictiveDashboard.css';

interface PredictiveResult {
  analysisTime: string;
  birthChart: WesternBirthChart;
  targetDate: string;
  options: any;
  progressions: {
    secondary: any;
    solarArc: any;
  };
  transits: any;
  timing: any;
  interpretation: any;
  integration: any;
  summary: {
    overallDirection: any;
    keyPeriods: any[];
    confidence: number;
    recommendations: any[];
  };
}

const WesternPredictiveDashboard: React.FC = () => {
  const [birthData, setBirthData] = useState<BirthData>({
    year: 1990,
    month: 6,
    day: 15,
    hour: 14,
    minute: 30,
    second: 0,
    latitude: 28.6139,
    longitude: 77.2090
  });

  const [targetDate, setTargetDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [eventType, setEventType] = useState<string>('general');
  const [framework, setFramework] = useState<string>('modern');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PredictiveResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('input');

  const handleInputChange = useCallback((field: string, value: any) => {
    if (field.startsWith('birthData.')) {
      const birthField = field.replace('birthData.', '');
      setBirthData(prev => ({
        ...prev,
        [birthField]: value
      }));
    } else {
      switch (field) {
        case 'targetDate':
          setTargetDate(value);
          break;
        case 'eventType':
          setEventType(value);
          break;
        case 'framework':
          setFramework(value);
          break;
      }
    }
  }, []);

  const generatePredictions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First generate the birth chart
      const birthChart = await astrologyApi.generateWesternBirthChart(birthData);

      // Then generate predictions using the Western Predictive System
      // Note: This would need to be added to the API service
      const predictions = await astrologyApi.generateWesternPredictions(birthChart, targetDate, {
        eventType,
        framework
      });

      setResult(predictions);
      setActiveTab('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [birthData, targetDate, eventType, framework]);

  const resetForm = useCallback(() => {
    setResult(null);
    setError(null);
    setActiveTab('input');
  }, []);

  return (
    <div className="western-predictive-dashboard">
      <header className="dashboard-header">
        <h1>Western Astrology Predictive Analysis</h1>
        <p>Discover your life's unfolding patterns through progressions and transits</p>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-tab ${activeTab === 'input' ? 'active' : ''}`}
          onClick={() => setActiveTab('input')}
        >
          Input Data
        </button>
        {result && (
          <>
            <button
              className={`nav-tab ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              Analysis Results
            </button>
            <button
              className={`nav-tab ${activeTab === 'progressions' ? 'active' : ''}`}
              onClick={() => setActiveTab('progressions')}
            >
              Progressions
            </button>
            <button
              className={`nav-tab ${activeTab === 'transits' ? 'active' : ''}`}
              onClick={() => setActiveTab('transits')}
            >
              Transits
            </button>
            <button
              className={`nav-tab ${activeTab === 'timing' ? 'active' : ''}`}
              onClick={() => setActiveTab('timing')}
            >
              Timing
            </button>
            <button
              className={`nav-tab ${activeTab === 'interpretation' ? 'active' : ''}`}
              onClick={() => setActiveTab('interpretation')}
            >
              Interpretation
            </button>
          </>
        )}
      </nav>

      <main className="dashboard-content">
        {error && (
          <div className="error-message" role="alert">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {activeTab === 'input' && (
          <div className="input-section">
            <div className="input-form">
              <h2>Birth Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="birth-year">Birth Year</label>
                  <input
                    id="birth-year"
                    type="number"
                    value={birthData.year}
                    onChange={(e) => handleInputChange('birthData.year', parseInt(e.target.value))}
                    min="1900"
                    max="2025"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="birth-month">Birth Month</label>
                  <select
                    id="birth-month"
                    value={birthData.month}
                    onChange={(e) => handleInputChange('birthData.month', parseInt(e.target.value))}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="birth-day">Birth Day</label>
                  <input
                    id="birth-day"
                    type="number"
                    value={birthData.day}
                    onChange={(e) => handleInputChange('birthData.day', parseInt(e.target.value))}
                    min="1"
                    max="31"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="birth-hour">Birth Hour</label>
                  <input
                    id="birth-hour"
                    type="number"
                    value={birthData.hour}
                    onChange={(e) => handleInputChange('birthData.hour', parseInt(e.target.value))}
                    min="0"
                    max="23"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="birth-minute">Birth Minute</label>
                  <input
                    id="birth-minute"
                    type="number"
                    value={birthData.minute}
                    onChange={(e) => handleInputChange('birthData.minute', parseInt(e.target.value))}
                    min="0"
                    max="59"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="latitude">Latitude</label>
                  <input
                    id="latitude"
                    type="number"
                    value={birthData.latitude}
                    onChange={(e) => handleInputChange('birthData.latitude', parseFloat(e.target.value))}
                    step="0.0001"
                    min="-90"
                    max="90"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="longitude">Longitude</label>
                  <input
                    id="longitude"
                    type="number"
                    value={birthData.longitude}
                    onChange={(e) => handleInputChange('birthData.longitude', parseFloat(e.target.value))}
                    step="0.0001"
                    min="-180"
                    max="180"
                  />
                </div>
              </div>
            </div>

            <div className="analysis-options">
              <h2>Analysis Options</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="target-date">Target Date for Predictions</label>
                  <input
                    id="target-date"
                    type="date"
                    value={targetDate}
                    onChange={(e) => handleInputChange('targetDate', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="event-type">Event Type</label>
                  <select
                    id="event-type"
                    value={eventType}
                    onChange={(e) => handleInputChange('eventType', e.target.value)}
                  >
                    <option value="general">General Life</option>
                    <option value="career">Career</option>
                    <option value="relationship">Relationships</option>
                    <option value="health">Health</option>
                    <option value="finance">Finance</option>
                    <option value="spiritual">Spiritual</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="framework">Astrological Framework</label>
                  <select
                    id="framework"
                    value={framework}
                    onChange={(e) => handleInputChange('framework', e.target.value)}
                  >
                    <option value="traditional">Traditional</option>
                    <option value="modern">Modern</option>
                    <option value="evolutionary">Evolutionary</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="generate-btn"
                onClick={generatePredictions}
                disabled={isLoading}
              >
                {isLoading ? 'Generating Analysis...' : 'Generate Predictive Analysis'}
              </button>
              {result && (
                <button className="reset-btn" onClick={resetForm}>
                  New Analysis
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'results' && result && (
          <div className="results-section">
            <div className="summary-card">
              <h2>Analysis Summary</h2>
              <div className="summary-grid">
                <div className="summary-item">
                  <h3>Overall Direction</h3>
                  <p>{result.summary.overallDirection?.theme || 'Analysis in progress'}</p>
                  <div className="confidence-meter">
                    <span>Confidence: {Math.round(result.summary.confidence * 100)}%</span>
                    <div className="confidence-bar">
                      <div
                        className="confidence-fill"
                        style={{ width: `${result.summary.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="summary-item">
                  <h3>Key Periods</h3>
                  <ul>
                    {result.summary.keyPeriods?.slice(0, 3).map((period: any, index: number) => (
                      <li key={index}>
                        {period.significance} ({new Date(period.start).toLocaleDateString()})
                      </li>
                    )) || <li>No key periods identified</li>}
                  </ul>
                </div>
                <div className="summary-item">
                  <h3>Recommendations</h3>
                  <ul>
                    {result.summary.recommendations?.slice(0, 3).map((rec: any, index: number) => (
                      <li key={index}>{rec}</li>
                    )) || <li>No specific recommendations</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progressions' && result && (
          <div className="progressions-section">
            <h2>Planetary Progressions</h2>
            <div className="progression-tabs">
              <button className="tab-btn active">Secondary Progressions</button>
              <button className="tab-btn">Solar Arc Progressions</button>
            </div>
            <div className="progression-content">
              <div className="progression-table">
                <h3>Secondary Progressions (Day-for-a-Year)</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Planet</th>
                      <th>Natal Position</th>
                      <th>Progressed Position</th>
                      <th>Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.progressions.secondary?.planets &&
                      Object.entries(result.progressions.secondary.planets).map(([planet, data]: [string, any]) => (
                        <tr key={planet}>
                          <td>{planet}</td>
                          <td>{result.birthChart.planets[planet]?.longitude.toFixed(2)}°</td>
                          <td>{data.longitude.toFixed(2)}°</td>
                          <td>{(data.longitude - result.birthChart.planets[planet]?.longitude).toFixed(2)}°</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transits' && result && (
          <div className="transits-section">
            <h2>Current Planetary Transits</h2>
            <div className="transits-grid">
              {result.transits?.aspects &&
                Object.entries(result.transits.aspects).map(([natalPlanet, aspects]: [string, any]) => (
                  <div key={natalPlanet} className="transit-card">
                    <h3>{natalPlanet} Transits</h3>
                    <ul>
                      {Object.entries(aspects).map(([transitPlanet, aspect]: [string, any]) => (
                        <li key={transitPlanet}>
                          {transitPlanet} {aspect.aspect} ({aspect.strength.toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'timing' && result && (
          <div className="timing-section">
            <h2>Predictive Timing Analysis</h2>
            <div className="timing-content">
              <div className="timing-windows">
                <h3>Key Timing Windows</h3>
                {result.timing?.windows?.map((window: any, index: number) => (
                  <div key={index} className="timing-window">
                    <h4>{window.name || `Window ${index + 1}`}</h4>
                    <p>Strength: {window.strength?.toFixed(2) || 'N/A'}</p>
                    <p>Duration: {window.duration || 'N/A'}</p>
                  </div>
                )) || <p>No timing windows identified</p>}
              </div>
              <div className="peak-periods">
                <h3>Peak Periods</h3>
                {result.timing?.peakPeriods?.map((period: any, index: number) => (
                  <div key={index} className="peak-period">
                    <h4>{period.significance}</h4>
                    <p>Start: {new Date(period.start).toLocaleDateString()}</p>
                    <p>Duration: {period.duration}</p>
                  </div>
                )) || <p>No peak periods identified</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'interpretation' && result && (
          <div className="interpretation-section">
            <h2>Comprehensive Interpretation</h2>
            <div className="interpretation-content">
              <div className="overall-theme">
                <h3>Overall Life Theme</h3>
                <p>{result.interpretation?.overall?.theme || 'Analysis in progress'}</p>
                <p>Strength: {result.interpretation?.overall?.strength || 'N/A'}</p>
                <p>Duration: {result.interpretation?.overall?.duration || 'N/A'}</p>
              </div>
              <div className="life-areas">
                <h3>Life Area Analysis</h3>
                {result.interpretation?.areas &&
                  Object.entries(result.interpretation.areas).map(([area, analysis]: [string, any]) => (
                    <div key={area} className="life-area">
                      <h4>{area.charAt(0).toUpperCase() + area.slice(1)}</h4>
                      <p>Influence: {analysis.strength?.toFixed(2) || 'N/A'}</p>
                      <p>Key Themes: {analysis.themes?.join(', ') || 'N/A'}</p>
                    </div>
                  ))}
              </div>
              <div className="recommendations">
                <h3>Practical Recommendations</h3>
                <ul>
                  {result.interpretation?.recommendations?.map((rec: any, index: number) => (
                    <li key={index}>{rec}</li>
                  )) || <li>No specific recommendations available</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>
          Western Astrology Predictive Analysis - ZC3.6 Implementation
          <br />
          Based on comprehensive astrological algorithms for accurate forecasting
        </p>
      </footer>
    </div>
  );
};

export default WesternPredictiveDashboard;