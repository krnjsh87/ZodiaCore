import React, { useState, useEffect } from 'react';
import { BirthChart, PersonalizedDashaGuidance } from '../types/astrology';
import { getPersonalizedDashaGuidance } from '../services/api';
import './PersonalizedDashaGuidanceDashboard.css';

interface PersonalizedDashaGuidanceDashboardProps {
  birthChart?: BirthChart;
}

const PersonalizedDashaGuidanceDashboard: React.FC<PersonalizedDashaGuidanceDashboardProps> = ({
  birthChart
}) => {
  const [guidance, setGuidance] = useState<PersonalizedDashaGuidance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'career' | 'relationships' | 'remedies' | 'timing'>('overview');

  useEffect(() => {
    if (birthChart) {
      fetchGuidance();
    }
  }, [birthChart]);

  const fetchGuidance = async () => {
    if (!birthChart) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getPersonalizedDashaGuidance(birthChart);
      setGuidance(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch guidance');
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => {
    if (!guidance) return null;

    const { currentPeriod } = guidance;

    return (
      <div className="guidance-overview">
        <div className="guidance-header">
          <h2>Current Period: {currentPeriod.dasha.mahadasha.planet} Mahadasha</h2>
          <div className="dasha-info">
            <span className="mahadasha">Mahadasha: {currentPeriod.dasha.mahadasha.planet}</span>
            <span className="antardasha">Antardasha: {currentPeriod.dasha.antardasha.antarLord}</span>
            <span className="remaining">Remaining: {currentPeriod.dasha.remainingPeriod.days} days</span>
          </div>
        </div>

        <div className="overall-guidance">
          <h3>{currentPeriod.overallGuidance.theme}</h3>
          <div className="confidence-meter">
            <div className="confidence-bar" style={{ width: `${currentPeriod.overallGuidance.confidence * 100}%` }}></div>
            <span className="confidence-text">{Math.round(currentPeriod.overallGuidance.confidence * 100)}% Confidence</span>
          </div>

          <div className="opportunities-challenges">
            <div className="opportunities">
              <h4>🌟 Opportunities</h4>
              <ul>
                {currentPeriod.overallGuidance.opportunities.map((opp, index) => (
                  <li key={index}>{opp}</li>
                ))}
              </ul>
            </div>

            <div className="challenges">
              <h4>⚠️ Challenges</h4>
              <ul>
                {currentPeriod.overallGuidance.challenges.map((challenge, index) => (
                  <li key={index}>{challenge}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="general-advice">
            <h4>💡 General Advice</h4>
            <p>{currentPeriod.overallGuidance.generalAdvice}</p>
          </div>
        </div>

        <div className="life-areas-grid">
          <h3>Life Area Guidance</h3>
          <div className="life-areas">
            {Object.entries(currentPeriod.lifeAreaGuidance).map(([area, guidance]) => (
              <div key={area} className={`life-area-card ${guidance.rating.toLowerCase()}`}>
                <h4>{area.charAt(0).toUpperCase() + area.slice(1)}</h4>
                <div className="influence-bar">
                  <div className="influence-fill" style={{ width: `${guidance.influence * 100}%` }}></div>
                </div>
                <span className="rating">{guidance.rating}</span>
                <p>{guidance.specificGuidance}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCareerGuidance = () => {
    if (!guidance) return null;

    const career = guidance.currentPeriod.careerGuidance;

    return (
      <div className="career-guidance">
        <h2>🎯 Career Guidance</h2>

        <div className="career-strength">
          <h3>Career Strength</h3>
          <div className="strength-meter">
            <div className="strength-bar" style={{ width: `${career.overallStrength * 100}%` }}></div>
            <span>{Math.round(career.overallStrength * 100)}%</span>
          </div>
        </div>

        <div className="suitable-fields">
          <h3>Suitable Career Fields</h3>
          <div className="fields-grid">
            {career.suitableFields.map((field, index) => (
              <span key={index} className="field-tag">{field}</span>
            ))}
          </div>
        </div>

        <div className="career-sections">
          <div className="opportunities">
            <h4>Current Opportunities</h4>
            <ul>
              {career.currentOpportunities.map((opp, index) => (
                <li key={index}>{opp}</li>
              ))}
            </ul>
          </div>

          <div className="challenges">
            <h4>Challenges to Address</h4>
            <ul>
              {career.challenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="timing-advice">
          <h4>⏰ Timing Advice</h4>
          <p>{career.timingAdvice}</p>
        </div>

        <div className="recommended-actions">
          <h4>✅ Recommended Actions</h4>
          <ul>
            {career.recommendedActions.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderRelationshipGuidance = () => {
    if (!guidance) return null;

    const relationships = guidance.currentPeriod.relationshipGuidance;

    return (
      <div className="relationship-guidance">
        <h2>💕 Relationship Guidance</h2>

        <div className="relationship-strength">
          <h3>Relationship Strength</h3>
          <div className="strength-meter">
            <div className="strength-bar" style={{ width: `${relationships.overallStrength * 100}%` }}></div>
            <span>{Math.round(relationships.overallStrength * 100)}%</span>
          </div>
        </div>

        <div className="marriage-timing">
          <h3>Marriage Timing</h3>
          <div className="timing-card">
            <div className="likelihood">Likelihood: {relationships.marriageTiming.likelihood}</div>
            <div className="timeframe">{relationships.marriageTiming.timeframe}</div>
            {relationships.marriageTiming.favorableFactors && (
              <div className="factors">
                <h4>Favorable Factors:</h4>
                <ul>
                  {relationships.marriageTiming.favorableFactors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="compatibility-factors">
          <h3>Compatibility Factors</h3>
          <div className="factors-grid">
            <div className="factor">
              <span>Emotional</span>
              <div className="factor-bar">
                <div className="factor-fill" style={{ width: `${relationships.compatibilityFactors.emotional * 100}%` }}></div>
              </div>
              <span>{relationships.compatibilityFactors.emotional * 100}%</span>
            </div>
            <div className="factor">
              <span>Intellectual</span>
              <div className="factor-bar">
                <div className="factor-fill" style={{ width: `${relationships.compatibilityFactors.intellectual * 100}%` }}></div>
              </div>
              <span>{relationships.compatibilityFactors.intellectual * 100}%</span>
            </div>
            <div className="factor">
              <span>Physical</span>
              <div className="factor-bar">
                <div className="factor-fill" style={{ width: `${relationships.compatibilityFactors.physical * 100}%` }}></div>
              </div>
              <span>{relationships.compatibilityFactors.physical * 100}%</span>
            </div>
          </div>
        </div>

        <div className="relationship-status">
          <h4>Current Status</h4>
          <p>{relationships.currentRelationshipStatus}</p>
        </div>

        <div className="relationship-advice">
          <h4>💡 Advice</h4>
          <ul>
            {relationships.advice.map((advice, index) => (
              <li key={index}>{advice}</li>
            ))}
          </ul>
        </div>

        <div className="relationship-remedies">
          <h4>🔮 Remedies</h4>
          <ul>
            {relationships.remedies.map((remedy, index) => (
              <li key={index}>{remedy}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderRemedies = () => {
    if (!guidance) return null;

    const remedies = guidance.currentPeriod.remedies;

    return (
      <div className="remedies-section">
        <h2>🔮 Remedial Measures</h2>

        <div className="remedy-header">
          <p><strong>Primary Planet:</strong> {remedies.primaryPlanet}</p>
          <p><strong>Secondary Planet:</strong> {remedies.secondaryPlanet}</p>
        </div>

        <div className="recommended-remedies">
          <h3>Recommended Remedies</h3>
          {remedies.recommendedRemedies.map((remedyGroup, index) => (
            <div key={index} className="remedy-group">
              <h4>{remedyGroup.planet} Remedies ({remedyGroup.priority} Priority)</h4>
              <p className="remedy-reason">{remedyGroup.reason}</p>

              {remedyGroup.remedies.map((remedy, rIndex) => (
                <div key={rIndex} className="remedy-item">
                  {remedy.gemstone && <p><strong>Gemstone:</strong> {remedy.gemstone}</p>}
                  {remedy.mantra && <p><strong>Mantra:</strong> {remedy.mantra}</p>}
                  {remedy.donation && <p><strong>Donation:</strong> {remedy.donation}</p>}
                  {remedy.fasting && <p><strong>Fasting:</strong> {remedy.fasting}</p>}
                  {remedy.other && remedy.other.length > 0 && (
                    <div>
                      <strong>Other Practices:</strong>
                      <ul>
                        {remedy.other.map((practice, pIndex) => (
                          <li key={pIndex}>{practice}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="implementation-schedule">
          <h3>Implementation Schedule</h3>

          <div className="schedule-phase">
            <h4>Immediate ({remedies.implementationSchedule.immediate.timeframe})</h4>
            <ul>
              {remedies.implementationSchedule.immediate.actions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>

          <div className="schedule-phase">
            <h4>Short Term ({remedies.implementationSchedule.shortTerm.timeframe})</h4>
            <ul>
              {remedies.implementationSchedule.shortTerm.actions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>

          <div className="schedule-phase">
            <h4>Long Term ({remedies.implementationSchedule.longTerm.timeframe})</h4>
            <ul>
              {remedies.implementationSchedule.longTerm.actions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="expected-benefits">
          <h4>Expected Benefits</h4>
          <p>{remedies.expectedBenefits}</p>
        </div>
      </div>
    );
  };

  const renderTiming = () => {
    if (!guidance) return null;

    const timing = guidance.currentPeriod.timingRecommendations;

    return (
      <div className="timing-section">
        <h2>⏰ Auspicious Timing</h2>

        <div className="timing-grid">
          <div className="timing-card">
            <h3>Daily Timing</h3>
            <div className="best-hours">
              <h4>Best Hours</h4>
              <div className="hours-list">
                {timing.dailyTiming.bestHours.map((hour, index) => (
                  <span key={index} className="hour-tag">{hour}</span>
                ))}
              </div>
            </div>
            <div className="favorable-activities">
              <h4>Favorable Activities</h4>
              <ul>
                {timing.dailyTiming.favorableActivities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
            <p><strong>Auspicious Yoga:</strong> {timing.dailyTiming.auspiciousYoga}</p>
          </div>

          <div className="timing-card">
            <h3>Weekly Timing</h3>
            <div className="best-days">
              <h4>Best Days</h4>
              <div className="days-list">
                {timing.weeklyTiming.bestDays.map((day, index) => (
                  <span key={index} className="day-tag">{day}</span>
                ))}
              </div>
            </div>
            <div className="weekly-activities">
              <h4>Favorable Activities</h4>
              <ul>
                {timing.weeklyTiming.favorableActivities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="timing-card">
            <h3>Monthly Timing</h3>
            <div className="best-dates">
              <h4>Best Dates</h4>
              <div className="dates-list">
                {timing.monthlyTiming.bestDates.map((date, index) => (
                  <span key={index} className="date-tag">{date}</span>
                ))}
              </div>
            </div>
            <div className="monthly-activities">
              <h4>Favorable Activities</h4>
              <ul>
                {timing.monthlyTiming.favorableActivities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="major-activities">
          <h3>Major Activity Timing</h3>
          <div className="activities-grid">
            <div className="activity-item">
              <h4>Marriage</h4>
              <p>{timing.majorActivities.marriage}</p>
            </div>
            <div className="activity-item">
              <h4>Business</h4>
              <p>{timing.majorActivities.business}</p>
            </div>
            <div className="activity-item">
              <h4>Travel</h4>
              <p>{timing.majorActivities.travel}</p>
            </div>
          </div>
        </div>

        <div className="avoidance-periods">
          <h4>Avoidance Periods</h4>
          <ul>
            {timing.avoidancePeriods.map((period, index) => (
              <li key={index}>{period}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  if (!birthChart) {
    return (
      <div className="dashboard-container">
        <div className="no-data">
          <h2>Personalized Dasha Guidance</h2>
          <p>Please provide birth chart data to generate personalized guidance.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Generating your personalized dasha guidance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchGuidance} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🕉️ Personalized Dasha Guidance</h1>
        <p>Individualized astrological counseling based on your current planetary periods</p>
      </div>

      <div className="guidance-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'career' ? 'active' : ''}`}
          onClick={() => setActiveTab('career')}
        >
          Career
        </button>
        <button
          className={`tab-btn ${activeTab === 'relationships' ? 'active' : ''}`}
          onClick={() => setActiveTab('relationships')}
        >
          Relationships
        </button>
        <button
          className={`tab-btn ${activeTab === 'remedies' ? 'active' : ''}`}
          onClick={() => setActiveTab('remedies')}
        >
          Remedies
        </button>
        <button
          className={`tab-btn ${activeTab === 'timing' ? 'active' : ''}`}
          onClick={() => setActiveTab('timing')}
        >
          Timing
        </button>
      </div>

      <div className="guidance-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'career' && renderCareerGuidance()}
        {activeTab === 'relationships' && renderRelationshipGuidance()}
        {activeTab === 'remedies' && renderRemedies()}
        {activeTab === 'timing' && renderTiming()}
      </div>

      {guidance && (
        <div className="guidance-footer">
          <div className="metadata">
            <p>Analysis Date: {new Date(guidance.metadata.analysisDate).toLocaleDateString()}</p>
            <p>System Version: {guidance.metadata.systemVersion}</p>
            <p>Overall Confidence: {Math.round(guidance.metadata.confidence * 100)}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedDashaGuidanceDashboard;