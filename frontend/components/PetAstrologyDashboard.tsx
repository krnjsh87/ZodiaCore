import React, { useState, useEffect } from 'react';
import { PetAstrologyProfile, PetBirthData, ApiResponse } from '../types/astrology';
import { astrologyApi } from '../services/api';
import './PetAstrologyDashboard.css';

interface PetAstrologyDashboardProps {
  petData?: PetBirthData;
}

/**
 * Pet Astrology Dashboard Component
 * Displays comprehensive astrological analysis for pets
 */
const PetAstrologyDashboard: React.FC<PetAstrologyDashboardProps> = ({
  petData
}) => {
  const [profile, setProfile] = useState<PetAstrologyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('chart');

  useEffect(() => {
    if (petData) {
      fetchPetProfile();
    }
  }, [petData]);

  const fetchPetProfile = async () => {
    if (!petData) return;

    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<PetAstrologyProfile> = await astrologyApi.getPetAstrologyProfile(petData);

      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        setError(response.error || 'Failed to fetch pet astrology profile');
      }
    } catch (err) {
      setError('An error occurred while fetching the pet profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pet-dashboard loading" role="status" aria-live="polite">
        <div className="loading-spinner"></div>
        <p>Analyzing your pet's astrological profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pet-dashboard error">
        <div className="error-message">
          <h3>Error Loading Pet Profile</h3>
          <p>{error}</p>
          <button onClick={fetchPetProfile} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="pet-dashboard empty">
        <div className="empty-state">
          <h3>Pet Astrology Profile</h3>
          <p>Please provide your pet's birth information to generate their astrological analysis.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'chart', label: 'Birth Chart', icon: '📊' },
    { id: 'behavior', label: 'Behavior', icon: '🐾' },
    { id: 'health', label: 'Health', icon: '❤️' },
    { id: 'training', label: 'Training', icon: '🎾' },
    { id: 'compatibility', label: 'Compatibility', icon: '👨‍👩‍👧‍👦' },
    { id: 'remedies', label: 'Remedies', icon: '💎' },
    { id: 'predictions', label: 'Predictions', icon: '🔮' }
  ];

  return (
    <div className="pet-dashboard">
      <header className="dashboard-header">
        <h1>Pet Astrology Profile</h1>
        <div className="pet-info">
          <h2>{profile.petInfo.name}</h2>
          <p>{profile.petInfo.species} {profile.petInfo.breed && `(${profile.petInfo.breed})`}</p>
        </div>
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
        {activeTab === 'chart' && (
          <ChartAnalysisSection chartAnalysis={profile.chartAnalysis} />
        )}

        {activeTab === 'behavior' && (
          <BehavioralProfileSection behavioralProfile={profile.behavioralProfile} />
        )}

        {activeTab === 'health' && (
          <HealthAnalysisSection healthAnalysis={profile.healthAnalysis} />
        )}

        {activeTab === 'training' && (
          <TrainingAnalysisSection trainingAnalysis={profile.trainingAnalysis} />
        )}

        {activeTab === 'compatibility' && (
          <CompatibilityAnalysisSection compatibilityAnalysis={profile.compatibilityAnalysis} />
        )}

        {activeTab === 'remedies' && (
          <RemediesSection remedies={profile.remedies} />
        )}

        {activeTab === 'predictions' && (
          <PredictionsSection predictions={profile.predictions} />
        )}
      </main>
    </div>
  );
};

export default PetAstrologyDashboard;

// Sub-components

/**
 * Chart Analysis Section Component
 */
const ChartAnalysisSection: React.FC<{ chartAnalysis: any }> = ({ chartAnalysis }) => (
  <section className="chart-analysis-section">
    <h2>Astrological Birth Chart Analysis</h2>
    <div className="chart-overview">
      <div className="ascendant-info">
        <h3>Rising Sign (Ascendant)</h3>
        <p className="sign-display">{chartAnalysis.ascendant.sign} {chartAnalysis.ascendant.degree.toFixed(1)}°</p>
        <p>Ruled by: {chartAnalysis.ascendant.lord}</p>
      </div>

      <div className="sun-moon-info">
        <div className="celestial-sign">
          <h4>Sun Sign</h4>
          <p>{chartAnalysis.sunSign}</p>
        </div>
        <div className="celestial-sign">
          <h4>Moon Sign</h4>
          <p>{chartAnalysis.moonSign}</p>
        </div>
      </div>

      <div className="planetary-influences">
        <h3>Dominant Planets</h3>
        <div className="planet-tags">
          {chartAnalysis.dominantPlanets.map((planet: string) => (
            <span key={planet} className="planet-tag dominant">{planet}</span>
          ))}
        </div>

        <h3>Favorable Planets</h3>
        <div className="planet-tags">
          {chartAnalysis.favorablePlanets.map((planet: string) => (
            <span key={planet} className="planet-tag favorable">{planet}</span>
          ))}
        </div>

        <h3>Challenging Planets</h3>
        <div className="planet-tags">
          {chartAnalysis.challengingPlanets.map((planet: string) => (
            <span key={planet} className="planet-tag challenging">{planet}</span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/**
 * Behavioral Profile Section Component
 */
const BehavioralProfileSection: React.FC<{ behavioralProfile: any }> = ({ behavioralProfile }) => (
  <section className="behavioral-profile-section">
    <h2>Behavioral Profile</h2>
    <div className="behavioral-overview">
      <div className="temperament-grid">
        <div className="temperament-item">
          <h3>Temperament</h3>
          <p>{behavioralProfile.temperament}</p>
        </div>
        <div className="temperament-item">
          <h3>Energy Level</h3>
          <p>{behavioralProfile.energyLevel}</p>
        </div>
        <div className="temperament-item">
          <h3>Social Nature</h3>
          <p>{behavioralProfile.socialNature}</p>
        </div>
        <div className="temperament-item">
          <h3>Intelligence</h3>
          <p>{behavioralProfile.intelligence}</p>
        </div>
        <div className="temperament-item">
          <h3>Loyalty</h3>
          <p>{behavioralProfile.loyalty}</p>
        </div>
        <div className="temperament-item">
          <h3>Adaptability</h3>
          <p>{behavioralProfile.adaptability}</p>
        </div>
      </div>

      <div className="behavioral-tendencies">
        <h3>Key Behavioral Tendencies</h3>
        <div className="tendencies-list">
          {behavioralProfile.behavioralTendencies.map((tendency: any, index: number) => (
            <div key={index} className="tendency-item">
              <div className="tendency-header">
                <h4>{tendency.trait}</h4>
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{ width: `${tendency.strength}%` }}
                  ></div>
                  <span className="strength-value">{tendency.strength}%</span>
                </div>
              </div>
              <p>{tendency.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/**
 * Health Analysis Section Component
 */
const HealthAnalysisSection: React.FC<{ healthAnalysis: any }> = ({ healthAnalysis }) => (
  <section className="health-analysis-section">
    <h2>Health Analysis</h2>
    <div className="health-overview">
      <div className="health-status">
        <h3>Overall Health: <span className={`status-${healthAnalysis.overallHealth.toLowerCase()}`}>{healthAnalysis.overallHealth}</span></h3>
        <p>Constitution: {healthAnalysis.constitution}</p>
      </div>

      <div className="vulnerable-areas">
        <h3>Vulnerable Areas</h3>
        <ul>
          {healthAnalysis.vulnerableAreas.map((area: string, index: number) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="health-issues">
        <h3>Common Health Issues</h3>
        {healthAnalysis.commonHealthIssues.map((issue: any, index: number) => (
          <div key={index} className="health-issue">
            <h4>{issue.condition}</h4>
            <p>Risk Level: {issue.likelihood}%</p>
            <div className="prevention">
              <h5>Prevention:</h5>
              <ul>
                {issue.prevention.map((prevent: string, idx: number) => (
                  <li key={idx}>{prevent}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="dietary-recommendations">
        <h3>Dietary Recommendations</h3>
        <div className="diet-grid">
          <div className="diet-section">
            <h4>Preferred Foods</h4>
            <ul>
              {healthAnalysis.dietaryRecommendations.preferredFoods.map((food: string, index: number) => (
                <li key={index}>{food}</li>
              ))}
            </ul>
          </div>
          <div className="diet-section">
            <h4>Foods to Avoid</h4>
            <ul>
              {healthAnalysis.dietaryRecommendations.foodsToAvoid.map((food: string, index: number) => (
                <li key={index}>{food}</li>
              ))}
            </ul>
          </div>
          <div className="diet-section">
            <h4>Recommended Supplements</h4>
            <ul>
              {healthAnalysis.dietaryRecommendations.supplements.map((supplement: string, index: number) => (
                <li key={index}>{supplement}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="care-schedule">
        <h3>Care Schedule</h3>
        <div className="care-items">
          <div className="care-item">
            <h4>Exercise</h4>
            <p>{healthAnalysis.careSchedule.exercise}</p>
          </div>
          <div className="care-item">
            <h4>Grooming</h4>
            <p>{healthAnalysis.careSchedule.grooming}</p>
          </div>
          <div className="care-item">
            <h4>Veterinary Care</h4>
            <p>{healthAnalysis.careSchedule.veterinary}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/**
 * Training Analysis Section Component
 */
const TrainingAnalysisSection: React.FC<{ trainingAnalysis: any }> = ({ trainingAnalysis }) => (
  <section className="training-analysis-section">
    <h2>Training Analysis</h2>
    <div className="training-overview">
      <div className="training-basics">
        <div className="training-item">
          <h3>Learning Style</h3>
          <p>{trainingAnalysis.learningStyle}</p>
        </div>
        <div className="training-item">
          <h3>Best Training Methods</h3>
          <ul>
            {trainingAnalysis.bestMethods.map((method: string, index: number) => (
              <li key={index}>{method}</li>
            ))}
          </ul>
        </div>
        <div className="training-item">
          <h3>Optimal Training Timing</h3>
          <ul>
            {trainingAnalysis.optimalTiming.map((time: string, index: number) => (
              <li key={index}>{time}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="training-challenges">
        <h3>Training Challenges</h3>
        <ul>
          {trainingAnalysis.challenges.map((challenge: string, index: number) => (
            <li key={index}>{challenge}</li>
          ))}
        </ul>
      </div>

      <div className="recommended-activities">
        <h3>Recommended Activities</h3>
        <ul>
          {trainingAnalysis.recommendedActivities.map((activity: string, index: number) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>

      <div className="training-tips">
        <h3>Training Tips</h3>
        <ul>
          {trainingAnalysis.trainingTips.map((tip: string, index: number) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

/**
 * Compatibility Analysis Section Component
 */
const CompatibilityAnalysisSection: React.FC<{ compatibilityAnalysis: any }> = ({ compatibilityAnalysis }) => (
  <section className="compatibility-analysis-section">
    <h2>Compatibility Analysis</h2>
    <div className="compatibility-overview">
      <div className="owner-compatibility">
        <h3>Owner Compatibility</h3>
        <div className="compatibility-score">
          <div className="score-display">
            <span className="score-number">{compatibilityAnalysis.ownerCompatibility.score}</span>
            <span className="score-label">/100</span>
          </div>
          <div className="score-bar">
            <div
              className="score-fill"
              style={{ width: `${compatibilityAnalysis.ownerCompatibility.score}%` }}
            ></div>
          </div>
        </div>
        <div className="compatibility-factors">
          <h4>Key Factors</h4>
          <ul>
            {compatibilityAnalysis.ownerCompatibility.factors.map((factor: string, index: number) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>
        <div className="compatibility-recommendations">
          <h4>Recommendations</h4>
          <ul>
            {compatibilityAnalysis.ownerCompatibility.recommendations.map((rec: string, index: number) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="family-compatibility">
        <h3>Family Compatibility</h3>
        <div className="compatibility-score">
          <div className="score-display">
            <span className="score-number">{compatibilityAnalysis.familyCompatibility.score}</span>
            <span className="score-label">/100</span>
          </div>
          <div className="score-bar">
            <div
              className="score-fill"
              style={{ width: `${compatibilityAnalysis.familyCompatibility.score}%` }}
            ></div>
          </div>
        </div>
        <div className="compatibility-considerations">
          <h4>Considerations</h4>
          <ul>
            {compatibilityAnalysis.familyCompatibility.considerations.map((consideration: string, index: number) => (
              <li key={index}>{consideration}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pet-compatibility">
        <h3>Compatibility with Other Pets</h3>
        <div className="compatible-species">
          <h4>Compatible Species</h4>
          <ul>
            {compatibilityAnalysis.otherPets.compatibleSpecies.map((species: string, index: number) => (
              <li key={index}>{species}</li>
            ))}
          </ul>
        </div>
        <div className="compatibility-notes">
          <h4>Important Notes</h4>
          <ul>
            {compatibilityAnalysis.otherPets.compatibilityNotes.map((note: string, index: number) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

/**
 * Remedies Section Component
 */
const RemediesSection: React.FC<{ remedies: any }> = ({ remedies }) => (
  <section className="remedies-section">
    <h2>Astrological Remedies</h2>
    <div className="remedies-overview">
      <div className="gemstones">
        <h3>Recommended Gemstones</h3>
        <div className="gemstone-list">
          {remedies.gemstones.map((gemstone: any, index: number) => (
            <div key={index} className="gemstone-item">
              <h4>{gemstone.stone}</h4>
              <p><strong>Purpose:</strong> {gemstone.purpose}</p>
              <p><strong>Placement:</strong> {gemstone.placement}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="colors">
        <h3>Favorable Colors</h3>
        <div className="color-tags">
          {remedies.colors.map((color: string, index: number) => (
            <span key={index} className="color-tag" style={{ backgroundColor: color.toLowerCase() }}>
              {color}
            </span>
          ))}
        </div>
        <p>Use these colors in clothing, bedding, and environment to enhance positive planetary influences.</p>
      </div>

      <div className="mantras">
        <h3>Recommended Mantras</h3>
        <div className="mantra-list">
          {remedies.mantras.map((mantra: any, index: number) => (
            <div key={index} className="mantra-item">
              <h4>{mantra.mantra}</h4>
              <p><strong>Purpose:</strong> {mantra.purpose}</p>
              <p><strong>Timing:</strong> {mantra.timing}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rituals">
        <h3>Recommended Rituals</h3>
        <div className="ritual-list">
          {remedies.rituals.map((ritual: any, index: number) => (
            <div key={index} className="ritual-item">
              <h4>{ritual.ritual}</h4>
              <p><strong>Frequency:</strong> {ritual.frequency}</p>
              <p><strong>Benefits:</strong> {ritual.benefits}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="charitable-acts">
        <h3>Charitable Activities</h3>
        <ul>
          {remedies.charitableActs.map((act: string, index: number) => (
            <li key={index}>{act}</li>
          ))}
        </ul>
        <p>These activities help balance karma and enhance positive planetary influences.</p>
      </div>
    </div>
  </section>
);

/**
 * Predictions Section Component
 */
const PredictionsSection: React.FC<{ predictions: any[] }> = ({ predictions }) => (
  <section className="predictions-section">
    <h2>Future Predictions</h2>
    <div className="predictions-timeline">
      {predictions.map((prediction, index) => (
        <div key={index} className="prediction-item">
          <div className="prediction-period">
            <h3>{prediction.period}</h3>
          </div>
          <div className="prediction-content">
            <p className="prediction-text">{prediction.prediction}</p>
            <p className="prediction-advice"><strong>Advice:</strong> {prediction.advice}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="prediction-note">
      <p><em>Note: These predictions are based on astrological analysis and should be used as guidance alongside professional veterinary care and training advice.</em></p>
    </div>
  </section>
);