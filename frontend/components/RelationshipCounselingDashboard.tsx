import React, { useState } from 'react';
import { BirthData, BirthChart } from '../types/astrology';
import { astrologyApi } from '../services/api';
import BirthChartInput from './BirthChartInput';
import './RelationshipCounselingDashboard.css';

/**
 * Relationship Counseling Dashboard Component
 * Provides comprehensive relationship counseling analysis and guidance
 * Integrates synastry, composite, and Guna Milan analyses for holistic counseling
 */
const RelationshipCounselingDashboard: React.FC = () => {
  const [person1Data, setPerson1Data] = useState<BirthData | null>(null);
  const [person2Data, setPerson2Data] = useState<BirthData | null>(null);
  const [person1Chart, setPerson1Chart] = useState<BirthChart | null>(null);
  const [person2Chart, setPerson2Chart] = useState<BirthChart | null>(null);
  const [counselingResult, setCounselingResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'dynamics' | 'priorities' | 'remedies' | 'session'>('overview');

  // Session context
  const [sessionContext, setSessionContext] = useState({
    clientId: '',
    partnerId: '',
    relationshipType: 'marriage',
    duration: '2_years',
    currentIssues: [] as string[],
    goals: [] as string[]
  });

  /**
   * Handle birth chart generation for person 1
   */
  const handlePerson1Submit = async (birthData: BirthData) => {
    try {
      setLoading(true);
      setError(null);
      const chart = await astrologyApi.generateBirthChart(birthData);
      setPerson1Data(birthData);
      setPerson1Chart(chart);
    } catch (err) {
      setError('Failed to generate birth chart for Person 1');
      console.error('Chart generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle birth chart generation for person 2
   */
  const handlePerson2Submit = async (birthData: BirthData) => {
    try {
      setLoading(true);
      setError(null);
      const chart = await astrologyApi.generateBirthChart(birthData);
      setPerson2Data(birthData);
      setPerson2Chart(chart);
    } catch (err) {
      setError('Failed to generate birth chart for Person 2');
      console.error('Chart generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Conduct relationship counseling session
   */
  const conductCounseling = async () => {
    if (!person1Chart || !person2Chart) {
      setError('Both birth charts are required for counseling analysis');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await astrologyApi.conductRelationshipCounseling(
        person1Chart,
        person2Chart,
        sessionContext
      );

      if (result.success) {
        setCounselingResult(result.data);
      } else {
        setError('Counseling analysis failed');
      }

    } catch (err) {
      setError('Failed to conduct relationship counseling');
      console.error('Counseling error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get priority level color
   */
  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      critical: '#ef4444',
      high: '#f59e0b',
      medium: '#3b82f6',
      low: '#10b981'
    };
    return colors[priority] || '#6b7280';
  };

  /**
   * Get score color for relationship dynamics
   */
  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return '#10b981'; // Green
    if (score >= 0.6) return '#3b82f6'; // Blue
    if (score >= 0.4) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  /**
   * Handle session context changes
   */
  const updateSessionContext = (field: string, value: any) => {
    setSessionContext(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="relationship-counseling-dashboard">
      <header className="dashboard-header">
        <h1>Relationship & Marriage Counseling</h1>
        <p>Comprehensive astrological counseling for relationship harmony, conflict resolution, and long-term compatibility</p>
      </header>

      {error && (
        <div className="error-message" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="session-context-section">
        <h2>Counseling Session Details</h2>
        <div className="session-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="relationshipType">Relationship Type</label>
              <select
                id="relationshipType"
                value={sessionContext.relationshipType}
                onChange={(e) => updateSessionContext('relationshipType', e.target.value)}
              >
                <option value="marriage">Marriage</option>
                <option value="dating">Dating</option>
                <option value="partnership">Business Partnership</option>
                <option value="friendship">Friendship</option>
                <option value="family">Family Relationship</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="duration">Relationship Duration</label>
              <select
                id="duration"
                value={sessionContext.duration}
                onChange={(e) => updateSessionContext('duration', e.target.value)}
              >
                <option value="new">New Relationship</option>
                <option value="6_months">6 Months</option>
                <option value="1_year">1 Year</option>
                <option value="2_years">2 Years</option>
                <option value="5_years">5+ Years</option>
                <option value="long_term">Long Term</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Current Issues (select all that apply)</label>
              <div className="checkbox-group">
                {['communication', 'emotional', 'intimacy', 'conflict_resolution', 'trust', 'compatibility', 'future_goals'].map(issue => (
                  <label key={issue} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={sessionContext.currentIssues.includes(issue)}
                      onChange={(e) => {
                        const issues = e.target.checked
                          ? [...sessionContext.currentIssues, issue]
                          : sessionContext.currentIssues.filter(i => i !== issue);
                        updateSessionContext('currentIssues', issues);
                      }}
                    />
                    {issue.charAt(0).toUpperCase() + issue.slice(1).replace('_', ' ')}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="input-section">
        <div className="person-inputs">
          <div className="person-input">
            <h2>Partner 1</h2>
            <BirthChartInput
              onSubmit={handlePerson1Submit}
              loading={loading}
              error={error || undefined}
            />
            {person1Chart && (
              <div className="chart-summary">
                <h3>Birth Chart Generated</h3>
                <p><strong>Ascendant:</strong> {person1Chart.ascendant.sign}°{person1Chart.ascendant.degree.toFixed(1)}'</p>
                <p><strong>Moon:</strong> {person1Chart.planets.MOON.sign}°{person1Chart.planets.MOON.degree.toFixed(1)}'</p>
              </div>
            )}
          </div>

          <div className="compatibility-connector">
            <div className="connector-line"></div>
            <div className="hearts">💕</div>
          </div>

          <div className="person-input">
            <h2>Partner 2</h2>
            <BirthChartInput
              onSubmit={handlePerson2Submit}
              loading={loading}
              error={error || undefined}
            />
            {person2Chart && (
              <div className="chart-summary">
                <h3>Birth Chart Generated</h3>
                <p><strong>Ascendant:</strong> {person2Chart.ascendant.sign}°{person2Chart.ascendant.degree.toFixed(1)}'</p>
                <p><strong>Moon:</strong> {person2Chart.planets.MOON.sign}°{person2Chart.planets.MOON.degree.toFixed(1)}'</p>
              </div>
            )}
          </div>
        </div>

        {person1Chart && person2Chart && !counselingResult && (
          <div className="analyze-section">
            <button
              onClick={conductCounseling}
              disabled={loading}
              className="counseling-button"
            >
              {loading ? 'Conducting Counseling Session...' : 'Start Relationship Counseling'}
            </button>
          </div>
        )}
      </div>

      {counselingResult && (
        <div className="results-section">
          <div className="results-tabs">
            <button
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={activeTab === 'dynamics' ? 'active' : ''}
              onClick={() => setActiveTab('dynamics')}
            >
              Relationship Dynamics
            </button>
            <button
              className={activeTab === 'priorities' ? 'active' : ''}
              onClick={() => setActiveTab('priorities')}
            >
              Counseling Priorities
            </button>
            <button
              className={activeTab === 'remedies' ? 'active' : ''}
              onClick={() => setActiveTab('remedies')}
            >
              Remedies & Actions
            </button>
            <button
              className={activeTab === 'session' ? 'active' : ''}
              onClick={() => setActiveTab('session')}
            >
              Session Progress
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="counseling-header">
                <div className="session-info">
                  <h3>Session ID: {counselingResult.sessionId}</h3>
                  <p>Generated: {new Date(counselingResult.counselingReport.generatedAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="overall-assessment">
                <div className="assessment-score">
                  <div className="score-circle" style={{ borderColor: getScoreColor(counselingResult.counselingReport.counselingData.overallAssessment.score) }}>
                    <div className="score-value">{Math.round(counselingResult.counselingReport.counselingData.overallAssessment.score * 100)}</div>
                    <div className="score-label">Overall</div>
                  </div>
                  <div className="assessment-text">
                    <h3>{counselingResult.counselingReport.counselingData.overallAssessment.assessment}</h3>
                  </div>
                </div>

                <div className="key-recommendations">
                  <h4>Key Recommendations</h4>
                  <ul>
                    {counselingResult.counselingReport.counselingData.overallAssessment.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dynamics' && (
            <div className="dynamics-tab">
              <h3>Relationship Dynamics Analysis</h3>
              <p>Analysis of key relationship areas based on astrological compatibility</p>

              <div className="dynamics-grid">
                <div className="dynamic-item">
                  <div className="dynamic-header">
                    <h4>Communication</h4>
                    <div className="dynamic-score" style={{ color: getScoreColor(counselingResult.counselingReport.counselingData.relationshipDynamics.communicationScore) }}>
                      {Math.round(counselingResult.counselingReport.counselingData.relationshipDynamics.communicationScore * 100)}%
                    </div>
                  </div>
                  <div className="dynamic-bar">
                    <div
                      className="dynamic-fill"
                      style={{
                        width: `${counselingResult.counselingReport.counselingData.relationshipDynamics.communicationScore * 100}%`,
                        backgroundColor: getScoreColor(counselingResult.counselingReport.counselingData.relationshipDynamics.communicationScore)
                      }}
                    ></div>
                  </div>
                </div>

                <div className="dynamic-item">
                  <div className="dynamic-header">
                    <h4>Emotional Connection</h4>
                    <div className="dynamic-score" style={{ color: getScoreColor(counselingResult.counselingReport.counselingData.relationshipDynamics.emotionalScore) }}>
                      {Math.round(counselingResult.counselingReport.counselingData.relationshipDynamics.emotionalScore * 100)}%
                    </div>
                  </div>
                  <div className="dynamic-bar">
                    <div
                      className="dynamic-fill"
                      style={{
                        width: `${counselingResult.counselingReport.counselingData.relationshipDynamics.emotionalScore * 100}%`,
                        backgroundColor: getScoreColor(counselingResult.counselingReport.counselingData.relationshipDynamics.emotionalScore)
                      }}
                    ></div>
                  </div>
                </div>

                <div className="dynamic-item">
                  <div className="dynamic-header">
                    <h4>Intimacy</h4>
                    <div className="dynamic-score" style={{ color: getScoreColor(counselingResult.counselingReport.counselingData.relationshipDynamics.intimacyScore) }}>
                      {Math.round(counselingResult.counselingReport.counselingData.relationshipDynamics.intimacyScore * 100)}%
                    </div>
                  </div>
                  <div className="dynamic-bar">
                    <div
                      className="dynamic-fill"
                      style={{
                        width: `${counselingResult.counselingReport.counselingData.relationshipDynamics.intimacyScore * 100}%`,
                        backgroundColor: getScoreColor(counselingResult.counselingReport.counselingData.relationshipDynamics.intimacyScore)
                      }}
                    ></div>
                  </div>
                </div>

                <div className="dynamic-item">
                  <div className="dynamic-header">
                    <h4>Conflict Resolution</h4>
                    <div className="dynamic-score" style={{ color: getScoreColor(counselingResult.counselingReport.counselingData.relationshipDynamics.conflictResolutionScore) }}>
                      {Math.round(counselingResult.counselingReport.counselingData.relationshipDynamics.conflictResolutionScore * 100)}%
                    </div>
                  </div>
                  <div className="dynamic-bar">
                    <div
                      className="dynamic-fill"
                      style={{
                        width: `${counselingResult.counselingReport.counselingData.relationshipDynamics.conflictResolutionScore * 100}%`,
                        backgroundColor: getScoreColor(counselingResult.counselingReport.counselingData.relationshipDynamics.conflictResolutionScore)
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'priorities' && (
            <div className="priorities-tab">
              <h3>Counseling Priorities</h3>
              <p>Areas requiring attention, prioritized by urgency and impact</p>

              <div className="priorities-list">
                {counselingResult.counselingReport.counselingData.priorities.map((priority: any, index: number) => (
                  <div key={index} className={`priority-item priority-${priority.priority}`}>
                    <div className="priority-header">
                      <div className="priority-area">{priority.area.charAt(0).toUpperCase() + priority.area.slice(1).replace('_', ' ')}</div>
                      <div className="priority-badge" style={{ backgroundColor: getPriorityColor(priority.priority) }}>
                        {priority.priority.toUpperCase()}
                      </div>
                    </div>

                    <div className="priority-content">
                      <div className="priority-issues">
                        <h5>Issues Identified:</h5>
                        <ul>
                          {priority.issues.map((issue: string, idx: number) => (
                            <li key={idx}>{issue}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="priority-recommendations">
                        <h5>Recommendations:</h5>
                        <ul>
                          {priority.recommendations.map((rec: string, idx: number) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'remedies' && (
            <div className="remedies-tab">
              <h3>Remedial Measures & Actions</h3>
              <p>Personalized remedies and actions based on astrological analysis</p>

              <div className="remedies-sections">
                {Object.entries(counselingResult.counselingReport.counselingData.remedies).map(([category, remedies]: [string, any]) => (
                  <div key={category} className="remedies-category">
                    <h4>{category.charAt(0).toUpperCase() + category.slice(1)} Actions</h4>
                    <div className="remedies-list">
                      {remedies.map((remedy: any, index: number) => (
                        <div key={index} className="remedy-item">
                          <div className="remedy-header">
                            <div className="remedy-type">{remedy.type}</div>
                            <div className="remedy-priority" style={{ color: getPriorityColor(remedy.priority.toLowerCase()) }}>
                              {remedy.priority}
                            </div>
                          </div>
                          <div className="remedy-action">{remedy.action}</div>
                          <div className="remedy-duration">Duration: {remedy.duration}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'session' && (
            <div className="session-tab">
              <h3>Session Progress & Management</h3>
              <p>Track your counseling journey and next steps</p>

              <div className="session-progress">
                <div className="progress-stages">
                  {counselingResult.counselingReport.sessionProgress.completedStages.map((stage: string, index: number) => (
                    <div key={stage} className="progress-stage completed">
                      <div className="stage-number">{index + 1}</div>
                      <div className="stage-name">{stage.charAt(0).toUpperCase() + stage.slice(1)}</div>
                    </div>
                  ))}
                  {counselingResult.counselingReport.sessionProgress.nextSteps.map((step: string, index: number) => (
                    <div key={step} className="progress-stage pending">
                      <div className="stage-number">{counselingResult.counselingReport.sessionProgress.completedStages.length + index + 1}</div>
                      <div className="stage-name">{step}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="session-actions">
                <h4>Immediate Action Items</h4>
                <ul>
                  {counselingResult.counselingReport.sessionProgress.actionItems.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="session-disclaimer">
                <div className="disclaimer-box">
                  <h4>Important Disclaimer</h4>
                  <p>This astrological counseling provides guidance based on traditional Vedic astrology principles. It is not a substitute for professional psychological counseling, therapy, or medical advice. For serious relationship issues, please consult qualified professionals.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RelationshipCounselingDashboard;