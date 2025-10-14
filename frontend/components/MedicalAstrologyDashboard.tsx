import React, { useState, useEffect } from 'react';
import { MedicalAstrologyProfile, ApiResponse } from '../types/astrology';
import { astrologyApi } from '../services/api';
import './MedicalAstrologyDashboard.css';

interface MedicalAstrologyDashboardProps {
  birthChartId?: string;
  medicalHistory?: {
    name: string;
    age: number;
    conditions: Array<{
      name: string;
      treatment: string;
    }>;
  };
}

/**
 * Medical Astrology Dashboard Component
 * Displays comprehensive health analysis based on Vedic astrology
 */
const MedicalAstrologyDashboard: React.FC<MedicalAstrologyDashboardProps> = ({
  birthChartId,
  medicalHistory
}) => {
  const [profile, setProfile] = useState<MedicalAstrologyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('constitution');

  useEffect(() => {
    if (birthChartId) {
      fetchMedicalProfile();
    }
  }, [birthChartId, medicalHistory]);

  const fetchMedicalProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<MedicalAstrologyProfile> = await astrologyApi.getMedicalAstrologyProfile(
        birthChartId!,
        medicalHistory
      );

      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        setError(response.error || 'Failed to fetch medical astrology profile');
      }
    } catch (err) {
      setError('An error occurred while fetching the medical profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="medical-dashboard loading" role="status" aria-live="polite">
        <div className="loading-spinner"></div>
        <p>Analyzing your astrological health profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="medical-dashboard error">
        <div className="error-message">
          <h3>Error Loading Medical Profile</h3>
          <p>{error}</p>
          <button onClick={fetchMedicalProfile} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="medical-dashboard empty">
        <div className="empty-state">
          <h3>Medical Astrology Profile</h3>
          <p>Please provide a birth chart to generate your medical astrology analysis.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'constitution', label: 'Constitution', icon: '🧬' },
    { id: 'health', label: 'Current Health', icon: '❤️' },
    { id: 'risks', label: 'Disease Risks', icon: '⚠️' },
    { id: 'predictions', label: 'Future Predictions', icon: '🔮' },
    { id: 'remedies', label: 'Remedies', icon: '💊' },
    ...(profile.medicalIntegration ? [{ id: 'integration', label: 'Medical Integration', icon: '🏥' }] : [])
  ];

  return (
    <div className="medical-dashboard">
      <header className="dashboard-header">
        <h1>Medical Astrology Profile</h1>
        <div className="profile-meta">
          <span className="generated-at">
            Generated: {new Date(profile.generatedAt).toLocaleDateString()}
          </span>
          <span className="version">v{profile.systemVersion}</span>
        </div>
      </header>

      <nav className="dashboard-tabs" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        {activeTab === 'constitution' && (
          <ConstitutionSection constitution={profile.constitution} />
        )}

        {activeTab === 'health' && (
          <CurrentHealthSection currentHealth={profile.currentHealth} />
        )}

        {activeTab === 'risks' && (
          <DiseaseRisksSection diseaseRisks={profile.diseaseRisks} />
        )}

        {activeTab === 'predictions' && (
          <PredictionsSection predictions={profile.futurePredictions} />
        )}

        {activeTab === 'remedies' && (
          <RemediesSection remedies={profile.remedies} />
        )}

        {activeTab === 'integration' && profile.medicalIntegration && (
          <MedicalIntegrationSection integration={profile.medicalIntegration} />
        )}
      </main>
    </div>
  );
};

export default MedicalAstrologyDashboard;

// Sub-components

/**
 * Constitution Section Component
 */
const ConstitutionSection: React.FC<{ constitution: any }> = ({ constitution }) => (
  <section className="constitution-section">
    <h2>Ayurvedic Constitution Analysis</h2>
    <div className="constitution-chart">
      {Object.entries(constitution).map(([dosha, percentage]) => (
        <div key={dosha} className="dosha-bar">
          <div className="dosha-label">
            <span className="dosha-name">{dosha}</span>
            <span className="dosha-percentage">{percentage}%</span>
          </div>
          <div className="dosha-progress">
            <div
              className={`dosha-fill ${dosha.toLowerCase()}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
    <div className="constitution-info">
      <p>Your dominant dosha indicates your natural constitution and helps determine appropriate health practices.</p>
    </div>
  </section>
);

/**
 * Current Health Section Component
 */
const CurrentHealthSection: React.FC<{ currentHealth: any }> = ({ currentHealth }) => (
  <section className="current-health-section">
    <h2>Current Health Assessment</h2>
    <div className="health-overview">
      <div className="health-status">
        <h3>Overall Health: <span className={`status-${currentHealth.overallHealth.toLowerCase()}`}>{currentHealth.overallHealth}</span></h3>
        <p>Risk Level: <strong>{currentHealth.riskLevel}</strong></p>
        <p>Active Risks: <strong>{currentHealth.activeRisks}</strong></p>
      </div>
      <div className="constitution-balance">
        <h3>Constitution Balance</h3>
        {Object.entries(currentHealth.constitutionBalance).map(([dosha, percentage]) => (
          <div key={dosha} className="balance-item">
            <span>{dosha}:</span>
            <span>{percentage}%</span>
          </div>
        ))}
      </div>
    </div>
    <div className="health-recommendations">
      <h3>Recommendations</h3>
      <ul>
        {currentHealth.recommendations.map((rec: any, index: number) => (
          <li key={index} className={`priority-${rec.priority.toLowerCase()}`}>
            <strong>{rec.type}:</strong> {rec.advice}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/**
 * Disease Risks Section Component
 */
const DiseaseRisksSection: React.FC<{ diseaseRisks: any[] }> = ({ diseaseRisks }) => (
  <section className="disease-risks-section">
    <h2>Disease Risk Assessment</h2>
    {diseaseRisks.length === 0 ? (
      <p>No significant disease risks identified in current analysis.</p>
    ) : (
      <div className="risks-grid">
        {diseaseRisks.map((risk, index) => (
          <div key={index} className={`risk-card severity-${risk.severity.toLowerCase()}`}>
            <div className="risk-header">
              <h3>{risk.planet} Influence</h3>
              <span className="severity-badge">{risk.severity}</span>
            </div>
            <div className="risk-likelihood">
              <span>Likelihood: {risk.likelihood}%</span>
            </div>
            <div className="risk-body-parts">
              <h4>Body Parts:</h4>
              <ul>
                {risk.bodyParts.map((part: string, i: number) => (
                  <li key={i}>{part}</li>
                ))}
              </ul>
            </div>
            <div className="risk-diseases">
              <h4>Potential Diseases:</h4>
              <ul>
                {risk.diseases.map((disease: string, i: number) => (
                  <li key={i}>{disease}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
);

/**
 * Predictions Section Component
 */
const PredictionsSection: React.FC<{ predictions: any[] }> = ({ predictions }) => (
  <section className="predictions-section">
    <h2>Future Health Predictions</h2>
    {predictions.length === 0 ? (
      <p>No significant future health predictions for the analyzed period.</p>
    ) : (
      <div className="predictions-timeline">
        {predictions.map((prediction, index) => (
          <div key={index} className="prediction-card">
            <div className="prediction-period">
              <h3>{prediction.period.planet} Period</h3>
              <p>{prediction.period.start} - {prediction.period.end} ({prediction.period.years} years)</p>
            </div>
            <div className="prediction-severity">
              <span className={`severity-${prediction.severity.toLowerCase()}`}>{prediction.severity} Risk</span>
            </div>
            <div className="prediction-risks">
              <h4>Health Risks:</h4>
              <ul>
                {prediction.risks.map((risk: any, i: number) => (
                  <li key={i}>
                    {risk.diseases.join(', ')} ({risk.likelihood}% likelihood)
                  </li>
                ))}
              </ul>
            </div>
            <div className="prediction-recommendations">
              <h4>Recommendations:</h4>
              <ul>
                {prediction.recommendations.map((rec: any, i: number) => (
                  <li key={i}>
                    <strong>{rec.type}:</strong> {rec.bodyParts.join(', ')} - {rec.frequency} checkups with {rec.specialist.join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
);

/**
 * Remedies Section Component
 */
const RemediesSection: React.FC<{ remedies: any }> = ({ remedies }) => (
  <section className="remedies-section">
    <h2>Remedial Recommendations</h2>

    <div className="remedies-tabs">
      <button className="remedy-tab active" data-tab="gemstones">Gemstones</button>
      <button className="remedy-tab" data-tab="mantras">Mantras</button>
      <button className="remedy-tab" data-tab="colors">Colors</button>
      <button className="remedy-tab" data-tab="diet">Diet</button>
      <button className="remedy-tab" data-tab="lifestyle">Lifestyle</button>
      <button className="remedy-tab" data-tab="charity">Charity</button>
    </div>

    <div className="remedy-content">
      <div className="remedy-group active" data-content="gemstones">
        <h3>Gemstone Therapy</h3>
        {remedies.gemstoneTherapy.map((gemstone: any, index: number) => (
          <div key={index} className="remedy-item">
            <h4>{gemstone.gemstone.name}</h4>
            <p><strong>Planet:</strong> {gemstone.planet}</p>
            <p><strong>Weight:</strong> {gemstone.gemstone.weight}</p>
            <p><strong>Metal:</strong> {gemstone.gemstone.metal}</p>
            <p><strong>Finger:</strong> {gemstone.gemstone.finger}</p>
            <p><strong>Purpose:</strong> {gemstone.purpose}</p>
            <p><strong>Wearing Instructions:</strong> {gemstone.wearingInstructions}</p>
            <p><strong>Duration:</strong> {gemstone.duration}</p>
          </div>
        ))}
      </div>

      <div className="remedy-group" data-content="mantras">
        <h3>Mantra Therapy</h3>
        {remedies.mantraTherapy.map((mantra: any, index: number) => (
          <div key={index} className="remedy-item">
            <h4>{mantra.planet} Mantra</h4>
            <p><strong>Mantra:</strong> {mantra.mantra.mantra}</p>
            <p><strong>Count:</strong> {mantra.mantra.count} times</p>
            <p><strong>Time:</strong> {mantra.mantra.time}</p>
            <p><strong>Duration:</strong> {mantra.mantra.duration}</p>
            <p><strong>Purpose:</strong> {mantra.purpose}</p>
            <p><strong>Benefits:</strong> {mantra.benefits}</p>
          </div>
        ))}
      </div>

      <div className="remedy-group" data-content="colors">
        <h3>Color Therapy</h3>
        {remedies.colorTherapy.map((color: any, index: number) => (
          <div key={index} className="remedy-item">
            <h4>{color.planet} Colors</h4>
            <p><strong>Colors:</strong> {color.colors.join(', ')}</p>
            <p><strong>Usage:</strong> {color.usage}</p>
          </div>
        ))}
      </div>

      <div className="remedy-group" data-content="diet">
        <h3>Dietary Recommendations</h3>
        <div className="diet-section">
          <h4>Foods to Eat:</h4>
          <ul>
            {remedies.dietaryRecommendations.foods.map((food: string, index: number) => (
              <li key={index}>{food}</li>
            ))}
          </ul>
        </div>
        <div className="diet-section">
          <h4>Foods to Avoid:</h4>
          <ul>
            {remedies.dietaryRecommendations.avoid.map((food: string, index: number) => (
              <li key={index}>{food}</li>
            ))}
          </ul>
        </div>
        <div className="diet-section">
          <h4>Recommended Herbs:</h4>
          <ul>
            {remedies.dietaryRecommendations.herbs.map((herb: string, index: number) => (
              <li key={index}>{herb}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="remedy-group" data-content="lifestyle">
        <h3>Lifestyle Modifications</h3>
        <ul>
          {remedies.lifestyleModifications.map((modification: string, index: number) => (
            <li key={index}>{modification}</li>
          ))}
        </ul>
      </div>

      <div className="remedy-group" data-content="charity">
        <h3>Charitable Activities</h3>
        {remedies.charitableActivities.map((charity: any, index: number) => (
          <div key={index} className="remedy-item">
            <h4>{charity.planet} Charity</h4>
            <ul>
              {charity.activities.map((activity: string, i: number) => (
                <li key={i}>{activity}</li>
              ))}
            </ul>
            <p><strong>Frequency:</strong> {charity.frequency}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/**
 * Medical Integration Section Component
 */
const MedicalIntegrationSection: React.FC<{ integration: any }> = ({ integration }) => (
  <section className="medical-integration-section">
    <h2>Medical Integration Analysis</h2>

    <div className="patient-profile">
      <h3>Patient Profile</h3>
      <p><strong>Name:</strong> {integration.patientProfile.name}</p>
      <p><strong>Age:</strong> {integration.patientProfile.age}</p>
      <p><strong>Dominant Dosha:</strong> {integration.patientProfile.dominantDosha}</p>
    </div>

    <div className="correlations">
      <h3>Astrological-Medical Correlations</h3>
      {integration.medicalCorrelations.map((correlation: any, index: number) => (
        <div key={index} className="correlation-item">
          <h4>{correlation.astrologicalRisk.planet} Influence</h4>
          <p><strong>Medical Condition:</strong> {correlation.medicalConditions[0].name}</p>
          <p><strong>Treatment:</strong> {correlation.medicalConditions[0].treatment}</p>
          <p><strong>Correlation:</strong> {correlation.correlationStrength}</p>
          <p><strong>Explanation:</strong> {correlation.explanation}</p>
        </div>
      ))}
    </div>

    <div className="integrated-recommendations">
      <h3>Integrated Treatment Recommendations</h3>
      {integration.integratedRecommendations.map((rec: any, index: number) => (
        <div key={index} className="integrated-rec">
          <h4>{rec.condition}</h4>
          <div className="treatment-plan">
            <div className="conventional">
              <h5>Conventional Treatment:</h5>
              <p>{rec.conventionalTreatment}</p>
            </div>
            <div className="astrological">
              <h5>Astrological Support:</h5>
              <p><strong>Gemstones:</strong> {rec.astrologicalSupport.gemstones.map((g: any) => g.gemstone.name).join(', ')}</p>
              <p><strong>Mantras:</strong> {rec.astrologicalSupport.mantras.map((m: any) => m.mantra.mantra).join(', ')}</p>
              <p><strong>Diet:</strong> {rec.astrologicalSupport.diet.foods.slice(0, 3).join(', ')}...</p>
              <p><strong>Lifestyle:</strong> {rec.astrologicalSupport.lifestyle.slice(0, 2).join(', ')}...</p>
            </div>
            <div className="integrated-approach">
              <h5>Integrated Approach:</h5>
              <p>{rec.integratedApproach.primaryTreatment}</p>
              <p>{rec.integratedApproach.astrologicalEnhancement}</p>
              <p>{rec.integratedApproach.timing}</p>
              <p>{rec.integratedApproach.complementary}</p>
              <p>{rec.integratedApproach.monitoring}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);