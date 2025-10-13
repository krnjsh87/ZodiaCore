import React from 'react';
import { YantraRecommendation } from '../types/astrology';

interface YantraRecommendationsProps {
  recommendations: {
    primary?: YantraRecommendation;
    secondary?: YantraRecommendation[];
    complementary?: YantraRecommendation[];
  };
}

/**
 * Yantra Recommendations Component
 * Displays personalized Yantra recommendations with reasoning
 */
const YantraRecommendations: React.FC<YantraRecommendationsProps> = ({ recommendations }) => {
  const renderRecommendationCard = (rec: YantraRecommendation, type: string, index?: number) => (
    <div key={`${type}-${index || 0}`} className={`recommendation-card ${type.toLowerCase()}`}>
      <div className="recommendation-header">
        <h4>{rec.yantra.name}</h4>
        <span className={`priority-badge ${rec.priority?.toLowerCase()}`}>
          {rec.priority || 'MEDIUM'}
        </span>
      </div>

      <div className="recommendation-content">
        <div className="yantra-info">
          <p><strong>Type:</strong> {rec.yantra.name.replace(' Yantra', '')}</p>
          <p><strong>Purpose:</strong> {rec.yantra.purpose}</p>
          <p><strong>Compatibility Score:</strong> {rec.score}/100</p>
        </div>

        <div className="recommendation-reasons">
          <h5>Why this Yantra?</h5>
          <ul>
            {rec.reasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>

        <div className="yantra-details">
          <p><strong>Mantra:</strong> {rec.yantra.mantra}</p>
          {rec.yantra.elements && rec.yantra.elements.length > 0 && (
            <p><strong>Elements:</strong> {rec.yantra.elements.join(', ')}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="yantra-recommendations">
      <h2>Your Personalized Yantra Recommendations</h2>

      <div className="recommendations-section">
        <h3>Primary Yantra</h3>
        <p className="section-description">
          This is your main recommended Yantra based on your birth chart analysis.
          It addresses your primary astrological needs and should be your focus for practice.
        </p>
        {recommendations.primary ? (
          renderRecommendationCard(recommendations.primary, 'PRIMARY')
        ) : (
          <p>No primary recommendation available.</p>
        )}
      </div>

      {recommendations.secondary && recommendations.secondary.length > 0 && (
        <div className="recommendations-section">
          <h3>Secondary Yantras</h3>
          <p className="section-description">
            These Yantras provide additional support and can be practiced alongside your primary Yantra.
          </p>
          <div className="recommendations-grid">
            {recommendations.secondary.map((rec, index) =>
              renderRecommendationCard(rec, 'SECONDARY', index)
            )}
          </div>
        </div>
      )}

      {recommendations.complementary && recommendations.complementary.length > 0 && (
        <div className="recommendations-section">
          <h3>Complementary Yantras</h3>
          <p className="section-description">
            These Yantras can enhance your practice for specific goals or situations.
          </p>
          <div className="recommendations-grid">
            {recommendations.complementary.map((rec, index) =>
              renderRecommendationCard(rec, 'COMPLEMENTARY', index)
            )}
          </div>
        </div>
      )}

      <div className="recommendations-guidance">
        <h3>Important Guidance</h3>
        <div className="guidance-content">
          <div className="guidance-item">
            <h4>🕉️ Start with Primary Yantra</h4>
            <p>Begin your practice with the primary recommended Yantra. Master it before adding secondary Yantras.</p>
          </div>

          <div className="guidance-item">
            <h4>📅 Practice Schedule</h4>
            <p>Consistency is key. Practice daily at the same time, preferably during your planetary hour.</p>
          </div>

          <div className="guidance-item">
            <h4>🙏 Proper Activation</h4>
            <p>Always activate your Yantra properly with the prescribed rituals and mantras before use.</p>
          </div>

          <div className="guidance-item">
            <h4>📚 Learn and Understand</h4>
            <p>Study the meaning and symbolism of your Yantra to deepen your connection and practice.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YantraRecommendations;