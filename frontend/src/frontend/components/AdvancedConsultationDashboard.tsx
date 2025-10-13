import React, { useState } from 'react';
import {
  BirthData,
  BirthChart,
  AdvancedConsultationResult,
  AdvancedConsultationOptions
} from '../types/astrology';
import { astrologyApi } from '../services/api';
import BirthChartInput from './BirthChartInput';
import './AdvancedConsultationDashboard.css';

/**
 * Advanced Astrology Consultation Dashboard Component
 * Provides comprehensive advanced astrological analysis using KP, Nadi, Lal Kitab, and Varshaphal systems
 */
const AdvancedConsultationDashboard: React.FC = () => {
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [birthChart, setBirthChart] = useState<BirthChart | null>(null);
  const [consultationOptions, setConsultationOptions] = useState<AdvancedConsultationOptions>({
    includeKP: true,
    includeNadi: false,
    includeLalKitab: true,
    includeVarshaphal: true,
    currentTime: new Date(),
    year: new Date().getFullYear()
  });
  const [consultationResult, setConsultationResult] = useState<AdvancedConsultationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'options' | 'results'>('options');
  const [resultsTab, setResultsTab] = useState<'overview' | 'kp' | 'nadi' | 'lal-kitab' | 'varshaphal' | 'integrated' | 'remedies' | 'timing'>('overview');

  /**
   * Handle birth chart generation
   */
  const handleBirthChartSubmit = async (data: BirthData) => {
    try {
      setLoading(true);
      setError(null);
      const chart = await astrologyApi.generateBirthChart(data);
      setBirthData(data);
      setBirthChart(chart);
    } catch (err) {
      setError('Failed to generate birth chart');
      console.error('Birth chart generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle consultation options change
   */
  const handleOptionsChange = (field: keyof AdvancedConsultationOptions, value: any) => {
    setConsultationOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Generate advanced consultation
   */
  const generateConsultation = async () => {
    if (!birthChart) {
      setError('Birth chart is required for consultation');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await astrologyApi.generateAdvancedConsultation(birthChart, consultationOptions);
      setConsultationResult(result);
      setActiveTab('results');
    } catch (err) {
      setError('Failed to generate advanced consultation');
      console.error('Consultation generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get confidence color
   */
  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 80) return '#10b981';
    if (confidence >= 60) return '#3b82f6';
    if (confidence >= 40) return '#f59e0b';
    return '#ef4444';
  };

  /**
   * Get priority color
   */
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'important': return '#f59e0b';
      case 'routine': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="advanced-consultation-dashboard">
      <header className="dashboard-header">
        <h1>Advanced Astrology Consultation</h1>
        <p>Comprehensive analysis using KP, Nadi, Lal Kitab, and Varshaphal methodologies</p>
      </header>

      {error && (
        <div className="error-message" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'options' ? 'active' : ''}
          onClick={() => setActiveTab('options')}
        >
          Consultation Setup
        </button>
        <button
          className={activeTab === 'results' ? 'active' : ''}
          onClick={() => setActiveTab('results')}
          disabled={!consultationResult}
        >
          Results
        </button>
      </div>

      {activeTab === 'options' && (
        <div className="options-section">
          <div className="birth-chart-section">
            <h2>Birth Chart</h2>
            <BirthChartInput
              onSubmit={handleBirthChartSubmit}
              loading={loading}
              error={error || undefined}
            />
            {birthChart && (
              <div className="chart-summary">
                <h3>Birth Chart Generated</h3>
                <p><strong>Ascendant:</strong> {birthChart.ascendant.sign}°{birthChart.ascendant.degree.toFixed(1)}'</p>
                <p><strong>Moon:</strong> {birthChart.planets.MOON.sign}°{birthChart.planets.MOON.degree.toFixed(1)}'</p>
              </div>
            )}
          </div>

          {birthChart && (
            <div className="consultation-options">
              <h2>Consultation Options</h2>

              <div className="options-grid">
                <div className="option-group">
                  <h3>Systems to Include</h3>
                  <label className="option-item">
                    <input
                      type="checkbox"
                      checked={consultationOptions.includeKP}
                      onChange={(e) => handleOptionsChange('includeKP', e.target.checked)}
                    />
                    <span className="option-label">KP Astrology (Krishnamurti Paddhati)</span>
                  </label>
                  <label className="option-item">
                    <input
                      type="checkbox"
                      checked={consultationOptions.includeNadi}
                      onChange={(e) => handleOptionsChange('includeNadi', e.target.checked)}
                    />
                    <span className="option-label">Nadi Astrology</span>
                  </label>
                  <label className="option-item">
                    <input
                      type="checkbox"
                      checked={consultationOptions.includeLalKitab}
                      onChange={(e) => handleOptionsChange('includeLalKitab', e.target.checked)}
                    />
                    <span className="option-label">Lal Kitab</span>
                  </label>
                  <label className="option-item">
                    <input
                      type="checkbox"
                      checked={consultationOptions.includeVarshaphal}
                      onChange={(e) => handleOptionsChange('includeVarshaphal', e.target.checked)}
                    />
                    <span className="option-label">Varshaphal (Annual Horoscope)</span>
                  </label>
                </div>

                <div className="option-group">
                  <h3>Additional Settings</h3>
                  <div className="option-item">
                    <label htmlFor="current-time">Current Time:</label>
                    <input
                      id="current-time"
                      type="datetime-local"
                      value={consultationOptions.currentTime?.toISOString().slice(0, 16)}
                      onChange={(e) => handleOptionsChange('currentTime', new Date(e.target.value))}
                    />
                  </div>
                  <div className="option-item">
                    <label htmlFor="year">Varshaphal Year:</label>
                    <input
                      id="year"
                      type="number"
                      min="1900"
                      max="2100"
                      value={consultationOptions.year}
                      onChange={(e) => handleOptionsChange('year', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                {consultationOptions.includeNadi && (
                  <div className="option-group">
                    <h3>Nadi Astrology Details</h3>
                    <div className="option-item">
                      <label htmlFor="thumb-shape">Thumb Shape:</label>
                      <select
                        id="thumb-shape"
                        value={consultationOptions.thumbImpression?.shape || ''}
                        onChange={(e) => handleOptionsChange('thumbImpression', {
                          ...consultationOptions.thumbImpression,
                          shape: e.target.value
                        })}
                      >
                        <option value="">Select shape</option>
                        <option value="conical">Conical</option>
                        <option value="square">Square</option>
                        <option value="oval">Oval</option>
                      </select>
                    </div>
                    <div className="option-item">
                      <label htmlFor="father-name">Father's Name:</label>
                      <input
                        id="father-name"
                        type="text"
                        value={consultationOptions.birthDetails?.parents?.father || ''}
                        onChange={(e) => handleOptionsChange('birthDetails', {
                          ...consultationOptions.birthDetails,
                          parents: {
                            ...consultationOptions.birthDetails?.parents,
                            father: e.target.value
                          }
                        })}
                      />
                    </div>
                    <div className="option-item">
                      <label htmlFor="mother-name">Mother's Name:</label>
                      <input
                        id="mother-name"
                        type="text"
                        value={consultationOptions.birthDetails?.parents?.mother || ''}
                        onChange={(e) => handleOptionsChange('birthDetails', {
                          ...consultationOptions.birthDetails,
                          parents: {
                            ...consultationOptions.birthDetails?.parents,
                            mother: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="generate-section">
                <button
                  onClick={generateConsultation}
                  disabled={loading}
                  className="generate-button"
                >
                  {loading ? 'Generating Consultation...' : 'Generate Advanced Consultation'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'results' && consultationResult && (
        <div className="results-section">
          <div className="results-tabs">
            <button
              className={resultsTab === 'overview' ? 'active' : ''}
              onClick={() => setResultsTab('overview')}
            >
              Overview
            </button>
            {consultationResult.kpAnalysis && (
              <button
                className={resultsTab === 'kp' ? 'active' : ''}
                onClick={() => setResultsTab('kp')}
              >
                KP Analysis
              </button>
            )}
            {consultationResult.nadiReading && (
              <button
                className={resultsTab === 'nadi' ? 'active' : ''}
                onClick={() => setResultsTab('nadi')}
              >
                Nadi Reading
              </button>
            )}
            {consultationResult.lalKitabAnalysis && (
              <button
                className={resultsTab === 'lal-kitab' ? 'active' : ''}
                onClick={() => setResultsTab('lal-kitab')}
              >
                Lal Kitab
              </button>
            )}
            {consultationResult.varshaphal && (
              <button
                className={resultsTab === 'varshaphal' ? 'active' : ''}
                onClick={() => setResultsTab('varshaphal')}
              >
                Varshaphal
              </button>
            )}
            <button
              className={resultsTab === 'integrated' ? 'active' : ''}
              onClick={() => setResultsTab('integrated')}
            >
              Integrated View
            </button>
            <button
              className={resultsTab === 'remedies' ? 'active' : ''}
              onClick={() => setResultsTab('remedies')}
            >
              Remedies
            </button>
            <button
              className={resultsTab === 'timing' ? 'active' : ''}
              onClick={() => setResultsTab('timing')}
            >
              Timing
            </button>
          </div>

          {resultsTab === 'overview' && (
            <div className="overview-tab">
              <div className="consultation-summary">
                <h3>Consultation Summary</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <div className="summary-label">Systems Used</div>
                    <div className="summary-value">{consultationResult.metadata.systemsUsed.join(', ')}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Processing Time</div>
                    <div className="summary-value">{consultationResult.metadata.processingTime}ms</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Accuracy</div>
                    <div className="summary-value">{consultationResult.metadata.accuracy}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Confidence</div>
                    <div className="summary-value" style={{ color: getConfidenceColor(consultationResult.integratedPredictions.confidence) }}>
                      {consultationResult.integratedPredictions.confidence}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="key-insights">
                <h3>Key Insights</h3>
                <div className="insights-grid">
                  <div className="insight-card">
                    <h4>Short Term (0-6 months)</h4>
                    <ul>
                      {consultationResult.integratedPredictions.shortTerm.slice(0, 3).map((prediction, index) => (
                        <li key={index}>{prediction.prediction}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="insight-card">
                    <h4>Medium Term (6-18 months)</h4>
                    <ul>
                      {consultationResult.integratedPredictions.mediumTerm.slice(0, 3).map((prediction, index) => (
                        <li key={index}>{prediction.prediction}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="insight-card">
                    <h4>Long Term (2+ years)</h4>
                    <ul>
                      {consultationResult.integratedPredictions.longTerm.slice(0, 3).map((prediction, index) => (
                        <li key={index}>{prediction.prediction}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="recommendations">
                <h3>Recommendations</h3>
                <ul>
                  {consultationResult.metadata.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {resultsTab === 'integrated' && (
            <div className="integrated-tab">
              <h3>Integrated Predictions</h3>
              <p>Predictions synthesized from all consulted systems</p>

              <div className="predictions-sections">
                <div className="predictions-section">
                  <h4>Short Term Predictions</h4>
                  <div className="predictions-list">
                    {consultationResult.integratedPredictions.shortTerm.map((prediction, index) => (
                      <div key={index} className="prediction-item">
                        <div className="prediction-content">
                          <strong>{prediction.type}:</strong> {prediction.prediction}
                        </div>
                        <div className="prediction-meta">
                          <span className="source">Source: {prediction.source}</span>
                          {prediction.confidence && (
                            <span className="confidence" style={{ color: getConfidenceColor(prediction.confidence) }}>
                              {prediction.confidence}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="predictions-section">
                  <h4>Medium Term Predictions</h4>
                  <div className="predictions-list">
                    {consultationResult.integratedPredictions.mediumTerm.map((prediction, index) => (
                      <div key={index} className="prediction-item">
                        <div className="prediction-content">
                          <strong>{prediction.type}:</strong> {prediction.prediction}
                        </div>
                        <div className="prediction-meta">
                          <span className="source">Source: {prediction.source}</span>
                          {prediction.confidence && (
                            <span className="confidence" style={{ color: getConfidenceColor(prediction.confidence) }}>
                              {prediction.confidence}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="predictions-section">
                  <h4>Long Term Predictions</h4>
                  <div className="predictions-list">
                    {consultationResult.integratedPredictions.longTerm.map((prediction, index) => (
                      <div key={index} className="prediction-item">
                        <div className="prediction-content">
                          <strong>{prediction.type}:</strong> {prediction.prediction}
                        </div>
                        <div className="prediction-meta">
                          <span className="source">Source: {prediction.source}</span>
                          {prediction.confidence && (
                            <span className="confidence" style={{ color: getConfidenceColor(prediction.confidence) }}>
                              {prediction.confidence}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="agreements-analysis">
                <h4>System Agreements</h4>
                <div className="agreements-list">
                  {consultationResult.integratedPredictions.agreements.map((agreement, index) => (
                    <div key={index} className="agreement-item">
                      <strong>{agreement.theme}:</strong> Agreed by {agreement.systems.join(', ')} ({agreement.count} systems)
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {resultsTab === 'remedies' && (
            <div className="remedies-tab">
              <h3>Recommended Remedies</h3>
              <p>Remedies prioritized based on urgency and system agreement</p>

              <div className="remedies-sections">
                <div className="remedies-section">
                  <h4 style={{ color: getPriorityColor('critical') }}>Critical Remedies (Immediate)</h4>
                  <ul>
                    {consultationResult.remedies.priority.critical.map((remedy, index) => (
                      <li key={index}>{remedy}</li>
                    ))}
                  </ul>
                </div>

                <div className="remedies-section">
                  <h4 style={{ color: getPriorityColor('important') }}>Important Remedies (Weekly)</h4>
                  <ul>
                    {consultationResult.remedies.priority.important.map((remedy, index) => (
                      <li key={index}>{remedy}</li>
                    ))}
                  </ul>
                </div>

                <div className="remedies-section">
                  <h4 style={{ color: getPriorityColor('routine') }}>Routine Remedies (Monthly/Annual)</h4>
                  <ul>
                    {consultationResult.remedies.priority.routine.map((remedy, index) => (
                      <li key={index}>{remedy}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="remedies-by-frequency">
                <h4>All Remedies by Frequency</h4>
                <div className="frequency-sections">
                  <div className="frequency-section">
                    <h5>Immediate</h5>
                    <ul>
                      {consultationResult.remedies.immediate.map((remedy, index) => (
                        <li key={index}>{remedy}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="frequency-section">
                    <h5>Weekly</h5>
                    <ul>
                      {consultationResult.remedies.weekly.map((remedy, index) => (
                        <li key={index}>{remedy}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="frequency-section">
                    <h5>Monthly</h5>
                    <ul>
                      {consultationResult.remedies.monthly.map((remedy, index) => (
                        <li key={index}>{remedy}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="frequency-section">
                    <h5>Annual</h5>
                    <ul>
                      {consultationResult.remedies.annual.map((remedy, index) => (
                        <li key={index}>{remedy}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="frequency-section">
                    <h5>Permanent</h5>
                    <ul>
                      {consultationResult.remedies.permanent.map((remedy, index) => (
                        <li key={index}>{remedy}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {resultsTab === 'timing' && (
            <div className="timing-tab">
              <h3>Timing Analysis</h3>
              <p>Favorable and challenging periods identified across systems</p>

              <div className="timing-sections">
                <div className="timing-section">
                  <h4>Favorable Periods</h4>
                  <div className="timing-list">
                    {consultationResult.timing.favorable.map((period, index) => (
                      <div key={index} className="timing-item favorable">
                        <div className="timing-event">{period.event}</div>
                        <div className="timing-period">
                          {period.period.startDate ? new Date(period.period.startDate).toLocaleDateString() : 'Ongoing'} -
                          {period.period.endDate ? new Date(period.period.endDate).toLocaleDateString() : 'Ongoing'}
                        </div>
                        <div className="timing-source">Source: {period.source}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="timing-section">
                  <h4>Challenging Periods</h4>
                  <div className="timing-list">
                    {consultationResult.timing.challenging.map((period, index) => (
                      <div key={index} className="timing-item challenging">
                        <div className="timing-event">{period.event}</div>
                        <div className="timing-period">
                          {period.period.startDate ? new Date(period.period.startDate).toLocaleDateString() : 'Ongoing'} -
                          {period.period.endDate ? new Date(period.period.endDate).toLocaleDateString() : 'Ongoing'}
                        </div>
                        <div className="timing-source">Source: {period.source}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="timing-section">
                  <h4>Peak Periods</h4>
                  <div className="timing-list">
                    {consultationResult.timing.peak.map((period, index) => (
                      <div key={index} className="timing-item peak">
                        <div className="timing-name">{period.name}</div>
                        <div className="timing-period">
                          {new Date(period.start).toLocaleDateString()} - {period.duration}
                        </div>
                        <div className="timing-significance">{period.significance}</div>
                        <div className="timing-strength">Strength: {period.strength}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="timing-recommendations">
                <h4>Timing Recommendations</h4>
                <ul>
                  {consultationResult.timing.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedConsultationDashboard;