import React, { useState, useEffect } from 'react';
import { WesternMedicalAstrologyProfile, ApiResponse } from '../types/astrology';
import { astrologyApi } from '../services/api';
import './WesternMedicalAstrologyDashboard.css';

interface WesternMedicalAstrologyDashboardProps {
  birthChartId?: string;
}

/**
 * Western Medical Astrology Dashboard Component
 * Displays comprehensive health analysis based on Western astrology
 */
const WesternMedicalAstrologyDashboard: React.FC<WesternMedicalAstrologyDashboardProps> = ({
  birthChartId
}) => {
  const [profile, setProfile] = useState<WesternMedicalAstrologyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('constitution');

  useEffect(() => {
    if (birthChartId) {
      fetchMedicalProfile();
    }
  }, [birthChartId]);

  const fetchMedicalProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<WesternMedicalAstrologyProfile> = await astrologyApi.getWesternMedicalAstrologyProfile(
        birthChartId!
      );

      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        setError(response.error || 'Failed to fetch Western medical astrology profile');
      }
    } catch (err) {
      setError('An error occurred while fetching the medical profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="western-medical-dashboard loading" role="status" aria-live="polite">
        <div className="loading-spinner"></div>
        <p>Analyzing your Western astrological health profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="western-medical-dashboard error">
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
      <div className="western-medical-dashboard empty">
        <div className="empty-state">
          <h3>Western Medical Astrology Profile</h3>
          <p>Please provide a birth chart to generate your Western medical astrology analysis.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'constitution', label: 'Constitution', icon: '🧬' },
    { id: 'planetary', label: 'Planetary Health', icon: '☉' },
    { id: 'signs', label: 'Sign Health', icon: '♈' },
    { id: 'houses', label: 'House Health', icon: '🏠' },
    { id: 'aspects', label: 'Aspect Health', icon: '△' },
    { id: 'correlations', label: 'Disease Correlations', icon: '⚠️' },
    { id: 'remedies', label: 'Remedies', icon: '💊' },
    { id: 'disclaimer', label: 'Disclaimer', icon: '📋' }
  ];

  return (
    <div className="western-medical-dashboard">
      <header className="dashboard-header">
        <h1>Western Medical Astrology Profile</h1>
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
          <ConstitutionSection constitution={profile.healthAnalysis.constitution} />
        )}

        {activeTab === 'planetary' && (
          <PlanetaryHealthSection planetaryHealth={profile.healthAnalysis.planetaryHealth} />
        )}

        {activeTab === 'signs' && (
          <SignHealthSection signHealth={profile.healthAnalysis.signHealth} />
        )}

        {activeTab === 'houses' && (
          <HouseHealthSection houseHealth={profile.healthAnalysis.houseHealth} />
        )}

        {activeTab === 'aspects' && (
          <AspectHealthSection aspectHealth={profile.healthAnalysis.aspectHealth} />
        )}

        {activeTab === 'correlations' && (
          <DiseaseCorrelationsSection correlations={profile.diseaseCorrelations} />
        )}

        {activeTab === 'remedies' && (
          <RemediesSection remedies={profile.remedies} />
        )}

        {activeTab === 'disclaimer' && (
          <DisclaimerSection disclaimer={profile.disclaimer} />
        )}
      </main>
    </div>
  );
};

export default WesternMedicalAstrologyDashboard;

// Sub-components

/**
 * Constitution Section Component
 */
const ConstitutionSection: React.FC<{ constitution: any }> = ({ constitution }) => (
  <section className="constitution-section">
    <h2>Western Constitutional Analysis</h2>
    <div className="constitution-overview">
      <div className="constitution-card">
        <h3>Basic Information</h3>
        <div className="constitution-info">
          <p><strong>Sun Sign:</strong> {constitution.sunSign}</p>
          <p><strong>Moon Sign:</strong> {constitution.moonSign}</p>
          <p><strong>Ascendant:</strong> {constitution.ascendant}</p>
          <p><strong>Constitution Type:</strong> {constitution.constitutionType}</p>
        </div>
      </div>

      <div className="constitution-card">
        <h3>Temperament Balance</h3>
        <div className="temperament-chart">
          {Object.entries(constitution.temperament).map(([temperament, percentage]) => (
            <div key={temperament} className="temperament-bar">
              <div className="temperament-label">
                <span className="temperament-name">{temperament}</span>
                <span className="temperament-percentage">{percentage}%</span>
              </div>
              <div className="temperament-progress">
                <div
                  className={`temperament-fill ${temperament.toLowerCase()}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="constitution-card">
        <h3>Strengths</h3>
        <ul className="strengths-list">
          {constitution.strengths.map((strength: string, index: number) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="constitution-card">
        <h3>Vulnerabilities</h3>
        <ul className="vulnerabilities-list">
          {constitution.vulnerabilities.map((vulnerability: string, index: number) => (
            <li key={index}>{vulnerability}</li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

/**
 * Planetary Health Section Component
 */
const PlanetaryHealthSection: React.FC<{ planetaryHealth: any }> = ({ planetaryHealth }) => (
  <section className="planetary-health-section">
    <h2>Planetary Health Analysis</h2>
    <div className="planetary-grid">
      {Object.entries(planetaryHealth).map(([planet, health]: [string, any]) => (
        <div key={planet} className={`planetary-card risk-${health.riskLevel.toLowerCase()}`}>
          <div className="planetary-header">
            <h3>{planet}</h3>
            <span className={`risk-badge ${health.riskLevel.toLowerCase()}`}>
              {health.riskLevel}
            </span>
          </div>

          <div className="planetary-metrics">
            <div className="metric">
              <span className="metric-label">Dignity:</span>
              <span className="metric-value">{health.dignity.toFixed(2)}</span>
            </div>
            <div className="metric">
              <span className="metric-label">House:</span>
              <span className="metric-value">{health.house}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Health Score:</span>
              <span className="metric-value">{health.healthScore.toFixed(1)}</span>
            </div>
          </div>

          <div className="planetary-body-parts">
            <h4>Body Parts:</h4>
            <ul>
              {health.bodyParts.map((part: string, index: number) => (
                <li key={index}>{part}</li>
              ))}
            </ul>
          </div>

          <div className="planetary-issues">
            <h4>Potential Issues:</h4>
            <ul>
              {health.potentialIssues.map((issue: string, index: number) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>

          {health.aspects.length > 0 && (
            <div className="planetary-aspects">
              <h4>Aspects:</h4>
              <ul>
                {health.aspects.map((aspect: any, index: number) => (
                  <li key={index}>
                    {aspect.planet} - {aspect.aspect} ({aspect.orb.toFixed(1)}°)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
);

/**
 * Sign Health Section Component
 */
const SignHealthSection: React.FC<{ signHealth: any }> = ({ signHealth }) => (
  <section className="sign-health-section">
    <h2>Zodiac Sign Health Analysis</h2>
    <div className="signs-grid">
      {Object.entries(signHealth).map(([sign, health]: [string, any]) => (
        <div key={sign} className={`sign-card risk-${health.riskLevel.toLowerCase()}`}>
          <div className="sign-header">
            <h3>{sign}</h3>
            <span className={`risk-badge ${health.riskLevel.toLowerCase()}`}>
              {health.riskLevel}
            </span>
          </div>

          <div className="sign-metrics">
            <div className="metric">
              <span className="metric-label">Strength:</span>
              <span className="metric-value">{health.strength.toFixed(1)}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Health Score:</span>
              <span className="metric-value">{health.healthScore.toFixed(1)}</span>
            </div>
          </div>

          <div className="sign-body-parts">
            <h4>Body Parts:</h4>
            <ul>
              {health.bodyParts.map((part: string, index: number) => (
                <li key={index}>{part}</li>
              ))}
            </ul>
          </div>

          <div className="sign-systems">
            <h4>Systems:</h4>
            <ul>
              {health.systems.map((system: string, index: number) => (
                <li key={index}>{system}</li>
              ))}
            </ul>
          </div>

          <div className="sign-planets">
            <h4>Planets in Sign:</h4>
            <div className="planets-list">
              {health.planets.map((planet: string, index: number) => (
                <span key={index} className="planet-tag">{planet}</span>
              ))}
            </div>
          </div>

          <div className="sign-issues">
            <h4>Potential Issues:</h4>
            <ul>
              {health.potentialIssues.map((issue: string, index: number) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/**
 * House Health Section Component
 */
const HouseHealthSection: React.FC<{ houseHealth: any }> = ({ houseHealth }) => (
  <section className="house-health-section">
    <h2>House Health Analysis</h2>
    <div className="houses-grid">
      {Object.entries(houseHealth).map(([house, health]: [string, any]) => (
        <div key={house} className={`house-card risk-${health.riskLevel.toLowerCase()}`}>
          <div className="house-header">
            <h3>House {house}</h3>
            <span className={`risk-badge ${health.riskLevel.toLowerCase()}`}>
              {health.riskLevel}
            </span>
          </div>

          <div className="house-focus">
            <h4>Health Focus:</h4>
            <p>{health.healthFocus}</p>
          </div>

          <div className="house-significator">
            <h4>Significator:</h4>
            <p>{health.significator}</p>
          </div>

          <div className="house-metrics">
            <div className="metric">
              <span className="metric-label">Health Score:</span>
              <span className="metric-value">{health.healthScore.toFixed(1)}</span>
            </div>
          </div>

          <div className="house-planets">
            <h4>Planets:</h4>
            <div className="planets-list">
              {health.planets.map((planet: string, index: number) => (
                <span key={index} className="planet-tag">{planet}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/**
 * Aspect Health Section Component
 */
const AspectHealthSection: React.FC<{ aspectHealth: any[] }> = ({ aspectHealth }) => (
  <section className="aspect-health-section">
    <h2>Aspect Health Impacts</h2>
    {aspectHealth.length === 0 ? (
      <p>No significant aspect health impacts identified.</p>
    ) : (
      <div className="aspects-list">
        {aspectHealth.map((aspect, index) => (
          <div key={index} className="aspect-card">
            <div className="aspect-header">
              <h3>{aspect.planets.join(' - ')}</h3>
              <span className="aspect-type">{aspect.aspect.type}</span>
            </div>

            <div className="aspect-details">
              <div className="aspect-orb">
                <span className="label">Orb:</span>
                <span className="value">{aspect.aspect.orb.toFixed(1)}°</span>
              </div>
              <div className="aspect-impact">
                <span className="label">Health Impact:</span>
                <span className="value">{aspect.healthImpact.toFixed(2)}</span>
              </div>
            </div>

            <div className="aspect-description">
              <p>{aspect.description}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
);

/**
 * Disease Correlations Section Component
 */
const DiseaseCorrelationsSection: React.FC<{ correlations: any[] }> = ({ correlations }) => (
  <section className="correlations-section">
    <h2>Disease Correlations</h2>
    {correlations.length === 0 ? (
      <p>No significant disease correlations identified.</p>
    ) : (
      <div className="correlations-list">
        {correlations.map((correlation, index) => (
          <div key={index} className="correlation-card">
            <div className="correlation-header">
              <h3>{correlation.condition}</h3>
              <span className="correlation-type">{correlation.type}</span>
            </div>

            <div className="correlation-details">
              <div className="correlation-indicator">
                <span className="label">Indicator:</span>
                <span className="value">{correlation.indicator}</span>
              </div>
              <div className="correlation-strength">
                <span className="label">Strength:</span>
                <span className="value">{correlation.strength.toFixed(2)}</span>
              </div>
              <div className="correlation-modern">
                <span className="label">Modern Equivalent:</span>
                <span className="value">{correlation.modern_equivalent}</span>
              </div>
            </div>

            <div className="correlation-description">
              <p>{correlation.description}</p>
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
      <button className="remedy-tab active" data-tab="lifestyle">Lifestyle</button>
      <button className="remedy-tab" data-tab="dietary">Dietary</button>
      <button className="remedy-tab" data-tab="herbal">Herbal</button>
      <button className="remedy-tab" data-tab="gemstone">Gemstones</button>
      <button className="remedy-tab" data-tab="color">Colors</button>
      <button className="remedy-tab" data-tab="planetary">Planetary</button>
      <button className="remedy-tab" data-tab="preventive">Preventive</button>
    </div>

    <div className="remedy-content">
      <div className="remedy-group active" data-content="lifestyle">
        <h3>Lifestyle Recommendations</h3>
        <ul>
          {remedies.lifestyle.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="remedy-group" data-content="dietary">
        <h3>Dietary Recommendations</h3>
        <ul>
          {remedies.dietary.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="remedy-group" data-content="herbal">
        <h3>Herbal Remedies</h3>
        <ul>
          {remedies.herbal.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="remedy-group" data-content="gemstone">
        <h3>Gemstone Therapy</h3>
        {remedies.gemstone.map((gemstone: any, index: number) => (
          <div key={index} className="gemstone-item">
            <h4>{gemstone.name}</h4>
            <p><strong>Properties:</strong> {gemstone.properties}</p>
          </div>
        ))}
      </div>

      <div className="remedy-group" data-content="color">
        <h3>Color Therapy</h3>
        <div className="color-list">
          {remedies.color.map((color: string, index: number) => (
            <span key={index} className="color-tag">{color}</span>
          ))}
        </div>
      </div>

      <div className="remedy-group" data-content="planetary">
        <h3>Planetary Remedies</h3>
        {remedies.planetary.map((remedy: any, index: number) => (
          <div key={index} className="planetary-remedy">
            <h4>{Object.keys(remedy)[0]}</h4>
            <p><strong>Mantra:</strong> {remedy[Object.keys(remedy)[0]].mantra}</p>
            <p><strong>Practice:</strong> {remedy[Object.keys(remedy)[0]].practice}</p>
            <p><strong>Charity:</strong> {remedy[Object.keys(remedy)[0]].charity}</p>
          </div>
        ))}
      </div>

      <div className="remedy-group" data-content="preventive">
        <h3>Preventive Measures</h3>
        <ul>
          {remedies.preventive.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

/**
 * Disclaimer Section Component
 */
const DisclaimerSection: React.FC<{ disclaimer: string }> = ({ disclaimer }) => (
  <section className="disclaimer-section">
    <h2>Medical Disclaimer</h2>
    <div className="disclaimer-content">
      {disclaimer.split('\n').map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  </section>
);