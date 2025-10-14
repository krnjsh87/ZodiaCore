import React from 'react';
import { PetAstrologyProfile } from '../types/astrology';
import './PetAstrologyDisplay.css';

interface PetAstrologyDisplayProps {
  profile: PetAstrologyProfile;
  onBack?: () => void;
}

/**
 * Pet Astrology Display Component
 * Displays a read-only view of pet astrology profile
 */
const PetAstrologyDisplay: React.FC<PetAstrologyDisplayProps> = ({
  profile,
  onBack
}) => {
  return (
    <div className="pet-display-container">
      <header className="display-header">
        <h1>Pet Astrology Profile</h1>
        <div className="pet-summary">
          <h2>{profile.petInfo.name}</h2>
          <p>{profile.petInfo.species} {profile.petInfo.breed && `(${profile.petInfo.breed})`}</p>
          <small>Generated: {new Date(profile.generatedAt).toLocaleDateString()}</small>
        </div>
        {onBack && (
          <button onClick={onBack} className="back-button">
            ← Back to Dashboard
          </button>
        )}
      </header>

      <div className="display-content">
        <section className="summary-section">
          <h3>Profile Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <strong>Temperament:</strong> {profile.behavioralProfile.temperament}
            </div>
            <div className="summary-item">
              <strong>Energy Level:</strong> {profile.behavioralProfile.energyLevel}
            </div>
            <div className="summary-item">
              <strong>Overall Health:</strong> {profile.healthAnalysis.overallHealth}
            </div>
            <div className="summary-item">
              <strong>Learning Style:</strong> {profile.trainingAnalysis.learningStyle}
            </div>
          </div>
        </section>

        <section className="details-section">
          <h3>Detailed Analysis</h3>
          <div className="details-grid">
            <div className="detail-card">
              <h4>Behavioral Profile</h4>
              <ul>
                <li><strong>Social Nature:</strong> {profile.behavioralProfile.socialNature}</li>
                <li><strong>Intelligence:</strong> {profile.behavioralProfile.intelligence}</li>
                <li><strong>Loyalty:</strong> {profile.behavioralProfile.loyalty}</li>
                <li><strong>Adaptability:</strong> {profile.behavioralProfile.adaptability}</li>
              </ul>
            </div>

            <div className="detail-card">
              <h4>Health Analysis</h4>
              <ul>
                <li><strong>Constitution:</strong> {profile.healthAnalysis.constitution}</li>
                <li><strong>Vulnerable Areas:</strong> {profile.healthAnalysis.vulnerableAreas.join(', ')}</li>
                <li><strong>Care Schedule:</strong> {profile.healthAnalysis.careSchedule.exercise}</li>
              </ul>
            </div>

            <div className="detail-card">
              <h4>Training Analysis</h4>
              <ul>
                <li><strong>Best Methods:</strong> {profile.trainingAnalysis.bestMethods.join(', ')}</li>
                <li><strong>Challenges:</strong> {profile.trainingAnalysis.challenges.join(', ')}</li>
                <li><strong>Recommended Activities:</strong> {profile.trainingAnalysis.recommendedActivities.slice(0, 2).join(', ')}</li>
              </ul>
            </div>

            <div className="detail-card">
              <h4>Compatibility</h4>
              <ul>
                <li><strong>Owner Compatibility:</strong> {profile.compatibilityAnalysis.ownerCompatibility.score}/100</li>
                <li><strong>Family Compatibility:</strong> {profile.compatibilityAnalysis.familyCompatibility.score}/100</li>
                <li><strong>Compatible Species:</strong> {profile.compatibilityAnalysis.otherPets.compatibleSpecies.join(', ')}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="remedies-section">
          <h3>Astrological Remedies</h3>
          <div className="remedies-grid">
            <div className="remedy-category">
              <h4>Gemstones</h4>
              <ul>
                {profile.remedies.gemstones.map((gemstone, index) => (
                  <li key={index}>
                    <strong>{gemstone.stone}:</strong> {gemstone.purpose}
                  </li>
                ))}
              </ul>
            </div>

            <div className="remedy-category">
              <h4>Colors</h4>
              <div className="color-list">
                {profile.remedies.colors.map((color, index) => (
                  <span key={index} className="color-item" style={{ backgroundColor: color.toLowerCase() }}>
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div className="remedy-category">
              <h4>Mantras</h4>
              <ul>
                {profile.remedies.mantras.map((mantra, index) => (
                  <li key={index}>
                    <strong>{mantra.mantra}:</strong> {mantra.purpose}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="predictions-section">
          <h3>Future Predictions</h3>
          <div className="predictions-list">
            {profile.predictions.map((prediction, index) => (
              <div key={index} className="prediction-item">
                <h4>{prediction.period}</h4>
                <p>{prediction.prediction}</p>
                <p><em>Advice: {prediction.advice}</em></p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PetAstrologyDisplay;