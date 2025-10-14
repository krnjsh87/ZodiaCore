import React, { useState } from 'react';
import { BirthData, WesternBirthChart, WesternRelationshipCounseling } from '../types/astrology';
import { astrologyApi } from '../services/api';
import BirthChartInput from './BirthChartInput';
import './WesternRelationshipCounselingDashboard.css';

/**
 * Western Relationship Counseling Dashboard Component
 * Provides comprehensive Western astrology relationship counseling analysis
 * Integrates synastry, composite, compatibility, and marriage timing analyses
 */
const WesternRelationshipCounselingDashboard: React.FC = () => {
  const [person1Data, setPerson1Data] = useState<BirthData | null>(null);
  const [person2Data, setPerson2Data] = useState<BirthData | null>(null);
  const [person1Chart, setPerson1Chart] = useState<WesternBirthChart | null>(null);
  const [person2Chart, setPerson2Chart] = useState<WesternBirthChart | null>(null);
  const [counselingResult, setCounselingResult] = useState<WesternRelationshipCounseling | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'synastry' | 'composite' | 'compatibility' | 'timing'>('overview');

  /**
   * Handle birth chart generation for person 1
   */
  const handlePerson1Submit = async (birthData: BirthData) => {
    try {
      setLoading(true);
      setError(null);
      const chart = await astrologyApi.generateWesternBirthChart(birthData);
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
      const chart = await astrologyApi.generateWesternBirthChart(birthData);
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
   * Conduct Western relationship counseling session
   */
  const conductCounseling = async () => {
    if (!person1Chart || !person2Chart) {
      setError('Both birth charts are required for counseling analysis');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await astrologyApi.generateWesternRelationshipCounseling(
        person1Chart,
        person2Chart
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
   * Get compatibility score color
   */
  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#3b82f6'; // Blue
    if (score >= 40) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  /**
   * Get aspect strength color
   */
  const getAspectColor = (strength: string): string => {
    const colors: Record<string, string> = {
      excellent: '#10b981',
      strong: '#3b82f6',
      moderate: '#f59e0b',
      challenging: '#f97316',
      difficult: '#ef4444'
    };
    return colors[strength] || '#6b7280';
  };

  return (
    <div className="western-relationship-counseling-dashboard">
      <header className="dashboard-header">
        <h1>Western Relationship & Marriage Counseling</h1>
        <p>Comprehensive astrological counseling for relationship harmony using Western astrology principles</p>
      </header>

      {error && (
        <div className="error-message" role="alert">
          <p>{error}</p>
        </div>
      )}

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
                <p><strong>Midheaven:</strong> {person1Chart.midheaven.sign}°{person1Chart.midheaven.degree.toFixed(1)}'</p>
                <p><strong>Sun:</strong> {person1Chart.planets.SUN.sign}°{person1Chart.planets.SUN.degree.toFixed(1)}'</p>
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
                <p><strong>Midheaven:</strong> {person2Chart.midheaven.sign}°{person2Chart.midheaven.degree.toFixed(1)}'</p>
                <p><strong>Sun:</strong> {person2Chart.planets.SUN.sign}°{person2Chart.planets.SUN.degree.toFixed(1)}'</p>
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
              {loading ? 'Conducting Counseling Session...' : 'Start Western Relationship Counseling'}
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
              className={activeTab === 'synastry' ? 'active' : ''}
              onClick={() => setActiveTab('synastry')}
            >
              Synastry
            </button>
            <button
              className={activeTab === 'composite' ? 'active' : ''}
              onClick={() => setActiveTab('composite')}
            >
              Composite
            </button>
            <button
              className={activeTab === 'compatibility' ? 'active' : ''}
              onClick={() => setActiveTab('compatibility')}
            >
              Compatibility
            </button>
            <button
              className={activeTab === 'timing' ? 'active' : ''}
              onClick={() => setActiveTab('timing')}
            >
              Marriage Timing
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="counseling-header">
                <div className="session-info">
                  <h3>Analysis Generated: {new Date(counselingResult.generatedAt).toLocaleString()}</h3>
                  <p>System Version: {counselingResult.systemVersion}</p>
                </div>
              </div>

              <div className="overall-assessment">
                <div className="assessment-score">
                  <div className="score-circle" style={{ borderColor: getScoreColor(counselingResult.compatibility.overall) }}>
                    <div className="score-value">{Math.round(counselingResult.compatibility.overall)}</div>
                    <div className="score-label">Overall</div>
                  </div>
                  <div className="assessment-text">
                    <h3>{counselingResult.summary.overallCompatibility}</h3>
                    <p>{counselingResult.summary.relationshipType}</p>
                  </div>
                </div>

                <div className="compatibility-breakdown">
                  <h4>Compatibility Breakdown</h4>
                  <div className="breakdown-grid">
                    <div className="breakdown-item">
                      <span className="breakdown-label">Synastry:</span>
                      <span className="breakdown-value" style={{ color: getScoreColor(counselingResult.compatibility.breakdown.synastry) }}>
                        {Math.round(counselingResult.compatibility.breakdown.synastry)}%
                      </span>
                    </div>
                    <div className="breakdown-item">
                      <span className="breakdown-label">Composite:</span>
                      <span className="breakdown-value" style={{ color: getScoreColor(counselingResult.compatibility.breakdown.composite) }}>
                        {Math.round(counselingResult.compatibility.breakdown.composite)}%
                      </span>
                    </div>
                    <div className="breakdown-item">
                      <span className="breakdown-label">Dynamics:</span>
                      <span className="breakdown-value" style={{ color: getScoreColor(counselingResult.compatibility.breakdown.dynamics) }}>
                        {Math.round(counselingResult.compatibility.breakdown.dynamics)}%
                      </span>
                    </div>
                    <div className="breakdown-item">
                      <span className="breakdown-label">Timing:</span>
                      <span className="breakdown-value" style={{ color: getScoreColor(counselingResult.compatibility.breakdown.timing) }}>
                        {Math.round(counselingResult.compatibility.breakdown.timing)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="key-insights">
                  <h4>Key Strengths</h4>
                  <ul>
                    {counselingResult.summary.keyStrengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>

                  <h4>Main Challenges</h4>
                  <ul>
                    {counselingResult.summary.mainChallenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>

                <div className="counseling-recommendations">
                  <h4>Counseling Recommendations</h4>
                  <div className="recommendations-grid">
                    {counselingResult.recommendations.map((rec, index) => (
                      <div key={index} className={`recommendation-item ${rec.type}`}>
                        <div className="recommendation-category">{rec.category}</div>
                        <div className="recommendation-advice">{rec.advice}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'synastry' && (
            <div className="synastry-tab">
              <h3>Synastry Analysis</h3>
              <p>Inter-chart aspects and planetary interactions between partners</p>

              <div className="synastry-compatibility">
                <div className="compatibility-score">
                  <h4>Synastry Compatibility Score</h4>
                  <div className="score-display">
                    <div className="score-circle" style={{ borderColor: getScoreColor(counselingResult.synastry.compatibility.score) }}>
                      <div className="score-value">{counselingResult.synastry.compatibility.score}</div>
                      <div className="score-label">{counselingResult.synastry.compatibility.rating}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="inter-aspects">
                <h4>Key Inter-Aspects</h4>
                <div className="aspects-grid">
                  {counselingResult.synastry.interAspects.slice(0, 10).map((aspect, index) => (
                    <div key={index} className="aspect-item">
                      <div className="aspect-planets">
                        {aspect.planet1} ↔ {aspect.planet2}
                      </div>
                      <div className="aspect-details">
                        <span className="aspect-type">{aspect.aspect}</span>
                        <span className="aspect-angle">{aspect.angle.toFixed(1)}°</span>
                        <span className="aspect-orb">(orb: {aspect.orb.toFixed(1)}°)</span>
                      </div>
                      <div className="aspect-strength" style={{ color: getAspectColor(aspect.counseling.strength) }}>
                        {aspect.counseling.strength}
                      </div>
                      <div className="aspect-description">
                        {aspect.counseling.description}
                      </div>
                      <div className="aspect-counseling">
                        {aspect.counseling.counseling}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="house-overlays">
                <h4>House Overlays</h4>
                <div className="overlays-grid">
                  {counselingResult.synastry.houseOverlays.slice(0, 8).map((overlay, index) => (
                    <div key={index} className="overlay-item">
                      <div className="overlay-header">
                        <span className="overlay-planet">{overlay.planet}</span>
                        <span className="overlay-house">in House {overlay.house}</span>
                        <span className="overlay-person">(Person {overlay.person})</span>
                      </div>
                      <div className="overlay-significance">
                        Significance: {overlay.significance.toFixed(1)}
                      </div>
                      <div className="overlay-interpretation">
                        {overlay.counseling.interpretation}
                      </div>
                      <div className="overlay-advice">
                        {overlay.counseling.advice}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="synastry-insights">
                <h4>Relationship Insights</h4>
                <div className="insights-sections">
                  <div className="insight-section">
                    <h5>Communication</h5>
                    <ul>
                      {counselingResult.synastry.counseling.communication.insights.map((insight, idx) => (
                        <li key={idx}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="insight-section">
                    <h5>Emotional Connection</h5>
                    <ul>
                      {counselingResult.synastry.counseling.emotional.insights.map((insight, idx) => (
                        <li key={idx}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="insight-section">
                    <h5>Intimacy</h5>
                    <ul>
                      {counselingResult.synastry.counseling.intimacy.insights.map((insight, idx) => (
                        <li key={idx}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="insight-section">
                    <h5>Growth & Development</h5>
                    <ul>
                      {counselingResult.synastry.counseling.growth.insights.map((insight, idx) => (
                        <li key={idx}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'composite' && (
            <div className="composite-tab">
              <h3>Composite Chart Analysis</h3>
              <p>The relationship as a third entity with its own astrological blueprint</p>

              <div className="composite-planets">
                <h4>Composite Planetary Positions</h4>
                <div className="planets-grid">
                  {Object.entries(counselingResult.composite.positions).map(([planet, position]) => (
                    <div key={planet} className="planet-position">
                      <div className="planet-name">{planet}</div>
                      <div className="planet-coordinates">
                        {Math.floor(position.longitude / 30)}° {Math.floor(position.longitude % 30)}'
                      </div>
                      <div className="planet-sign">
                        {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][Math.floor(position.longitude / 30)]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="composite-aspects">
                <h4>Composite Chart Aspects</h4>
                <div className="aspects-grid">
                  {counselingResult.composite.aspects.slice(0, 8).map((aspect, index) => (
                    <div key={index} className="aspect-item">
                      <div className="aspect-planets">
                        {aspect.planet1} {aspect.aspect} {aspect.planet2}
                      </div>
                      <div className="aspect-angle">{aspect.angle.toFixed(1)}°</div>
                      <div className="aspect-strength" style={{ color: getAspectColor(aspect.counseling.strength) }}>
                        {aspect.counseling.strength}
                      </div>
                      <div className="aspect-description">
                        {aspect.counseling.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="composite-angulariy">
                <h4>Angular Planets & Chart Emphasis</h4>
                <div className="angularity-info">
                  <div className="angular-planets">
                    <h5>Angular Planets:</h5>
                    <div className="planets-list">
                      {counselingResult.composite.angularity.angularPlanets.map((planet, idx) => (
                        <span key={idx} className="planet-tag">{planet}</span>
                      ))}
                    </div>
                  </div>
                  <div className="angularity-score">
                    <h5>Angularity Score:</h5>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{
                          width: `${counselingResult.composite.angularity.score}%`,
                          backgroundColor: getScoreColor(counselingResult.composite.angularity.score)
                        }}
                      ></div>
                    </div>
                    <span className="score-value">{counselingResult.composite.angularity.score}/100</span>
                  </div>
                </div>
              </div>

              <div className="composite-counseling">
                <h4>Relationship Dynamics</h4>
                <div className="dynamics-sections">
                  <div className="dynamics-section">
                    <h5>Relationship Dynamics</h5>
                    <ul>
                      {counselingResult.composite.counseling.relationshipDynamics.map((dynamic, idx) => (
                        <li key={idx}>{dynamic}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="dynamics-section">
                    <h5>Challenges</h5>
                    <ul>
                      {counselingResult.composite.counseling.challenges.map((challenge, idx) => (
                        <li key={idx}>{challenge}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="dynamics-section">
                    <h5>Opportunities</h5>
                    <ul>
                      {counselingResult.composite.counseling.opportunities.map((opportunity, idx) => (
                        <li key={idx}>{opportunity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compatibility' && (
            <div className="compatibility-tab">
              <h3>Compatibility Analysis</h3>
              <p>Detailed compatibility assessment with counseling recommendations</p>

              <div className="compatibility-overview">
                <div className="compatibility-score-large">
                  <div className="score-circle-large" style={{ borderColor: getScoreColor(counselingResult.compatibility.overall) }}>
                    <div className="score-value-large">{Math.round(counselingResult.compatibility.overall)}</div>
                    <div className="score-label-large">Overall Compatibility</div>
                  </div>
                  <div className="compatibility-rating">
                    <h3>{counselingResult.compatibility.rating}</h3>
                  </div>
                </div>
              </div>

              <div className="compatibility-strengths-challenges">
                <div className="strengths-section">
                  <h4>Relationship Strengths</h4>
                  <ul>
                    {counselingResult.compatibility.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="challenges-section">
                  <h4>Areas for Growth</h4>
                  <ul>
                    {counselingResult.compatibility.challenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="counseling-plan">
                <h4>Counseling Plan</h4>
                <div className="plan-sections">
                  <div className="plan-section">
                    <h5>Overall Assessment</h5>
                    <div className="assessment-type">{counselingResult.counseling.overallAssessment.type}</div>
                    <p>{counselingResult.counseling.overallAssessment.description}</p>
                    <p><strong>Counseling Focus:</strong> {counselingResult.counseling.overallAssessment.counseling}</p>
                  </div>

                  <div className="plan-section">
                    <h5>Module Plans</h5>
                    <div className="modules-grid">
                      {Object.entries(counselingResult.counseling.modulePlans).map(([module, plan]) => (
                        <div key={module} className="module-item">
                          <div className="module-name">{module.charAt(0).toUpperCase() + module.slice(1)}</div>
                          <div className="module-priority">Priority: {plan.priority}</div>
                          <div className="module-plan">{plan.plan.join(', ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="plan-section">
                    <h5>Counseling Timeline</h5>
                    <div className="timeline">
                      {counselingResult.counseling.timeline.map((phase, index) => (
                        <div key={index} className="timeline-phase">
                          <div className="phase-header">
                            <div className="phase-name">{phase.phase}</div>
                            <div className="phase-duration">{phase.duration}</div>
                          </div>
                          <div className="phase-focus">{phase.focus}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="plan-section">
                    <h5>Professional Referral</h5>
                    <div className={`referral-status ${counselingResult.counseling.professionalReferral.recommended ? 'recommended' : 'optional'}`}>
                      <div className="referral-recommended">
                        {counselingResult.counseling.professionalReferral.recommended ? 'Recommended' : 'Optional'}
                      </div>
                      <div className="referral-urgency">Urgency: {counselingResult.counseling.professionalReferral.urgency}</div>
                      <div className="referral-type">Type: {counselingResult.counseling.professionalReferral.type}</div>
                      <div className="referral-reason">{counselingResult.counseling.professionalReferral.reason}</div>
                    </div>
                  </div>

                  <div className="plan-section">
                    <h5>Self-Help Resources</h5>
                    <div className="self-help-sections">
                      <div className="self-help-books">
                        <h6>Recommended Books</h6>
                        <ul>
                          {counselingResult.counseling.selfHelp.books.map((book, idx) => (
                            <li key={idx}>{book}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="self-help-exercises">
                        <h6>Exercises</h6>
                        <ul>
                          {counselingResult.counseling.selfHelp.exercises.map((exercise, idx) => (
                            <li key={idx}>{exercise}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="self-help-practices">
                        <h6>Practices</h6>
                        <ul>
                          {counselingResult.counseling.selfHelp.practices.map((practice, idx) => (
                            <li key={idx}>{practice}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timing' && (
            <div className="timing-tab">
              <h3>Marriage Timing Analysis</h3>
              <p>Auspicious timing analysis for relationship commitments and marriage</p>

              <div className="current-timing">
                <h4>Current Timing Assessment</h4>
                <div className="timing-score">
                  <div className="score-circle" style={{ borderColor: getScoreColor(counselingResult.marriageTiming.currentTiming.score) }}>
                    <div className="score-value">{counselingResult.marriageTiming.currentTiming.score}</div>
                    <div className="score-label">{counselingResult.marriageTiming.currentTiming.rating}</div>
                  </div>
                </div>
                <div className="timing-factors">
                  <h5>Timing Factors</h5>
                  <ul>
                    {counselingResult.marriageTiming.currentTiming.factors.map((factor, idx) => (
                      <li key={idx}>
                        <span className={`factor-type ${factor.type}`}>{factor.type}:</span> {factor.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="future-windows">
                <h4>Future Auspicious Windows</h4>
                <div className="windows-grid">
                  {counselingResult.marriageTiming.futureWindows.map((window, index) => (
                    <div key={index} className="window-item">
                      <div className="window-date">{window.date}</div>
                      <div className="window-score" style={{ color: getScoreColor(window.score) }}>
                        Score: {window.score}
                      </div>
                      <div className="window-rating">{window.rating}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="challenging-periods">
                <h4>Challenging Periods to Avoid</h4>
                <div className="periods-grid">
                  {counselingResult.marriageTiming.challengingPeriods.map((period, index) => (
                    <div key={index} className="period-item">
                      <div className="period-date">{period.date}</div>
                      <div className="period-score" style={{ color: getScoreColor(period.score) }}>
                        Score: {period.score}
                      </div>
                      <div className="period-rating">{period.rating}</div>
                      <div className="period-counseling">{period.counseling}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="optimal-dates">
                <h4>Optimal Dates</h4>
                <div className="dates-grid">
                  {counselingResult.marriageTiming.optimalDates.map((date, index) => (
                    <div key={index} className="date-item">
                      <div className="date-value">{date.date}</div>
                      <div className="date-type">{date.type}</div>
                      <div className="date-significance">{date.significance}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="timing-counseling">
                <h4>Timing Counseling Advice</h4>
                <div className="counseling-advice">
                  <div className="advice-section">
                    <h5>Current Timing Advice</h5>
                    <p>{counselingResult.marriageTiming.counseling.currentAdvice}</p>
                  </div>
                  <div className="advice-section">
                    <h5>Long-term Planning</h5>
                    <p>{counselingResult.marriageTiming.counseling.longTermPlanning}</p>
                  </div>
                  <div className="advice-section">
                    <h5>Decision Making</h5>
                    <p>{counselingResult.marriageTiming.counseling.decisionMaking}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="disclaimer">
        <div className="disclaimer-box">
          <h4>Important Disclaimer</h4>
          <p>This Western astrological relationship counseling provides guidance based on traditional Western astrology principles. It is not a substitute for professional psychological counseling, therapy, or medical advice. For serious relationship issues, please consult qualified professionals.</p>
          <p>Western astrology involves interpretive elements that vary by practitioner. Results should be considered as one factor among many in relationship decision-making.</p>
        </div>
      </div>
    </div>
  );
};

export default WesternRelationshipCounselingDashboard;