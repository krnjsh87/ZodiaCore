import React from 'react';
import { DeepHoroscopeInterpretation } from '../types/astrology';
import './LifeAreasDisplay.css';
import './LifeAreasDisplay.css';

interface LifeAreasDisplayProps {
  lifeAreas: DeepHoroscopeInterpretation['lifeAreas'];
}

/**
 * Life Areas Display Component
 * Shows detailed analysis of all 12 houses/life areas
 */
const LifeAreasDisplay: React.FC<LifeAreasDisplayProps> = ({ lifeAreas }) => {
  /**
   * Get house number color
   */
  const getHouseColor = (houseNumber: number) => {
    const colors = [
      '#ef4444', // 1 - Red
      '#f97316', // 2 - Orange
      '#eab308', // 3 - Yellow
      '#22c55e', // 4 - Green
      '#06b6d4', // 5 - Cyan
      '#3b82f6', // 6 - Blue
      '#8b5cf6', // 7 - Violet
      '#ec4899', // 8 - Pink
      '#f59e0b', // 9 - Amber
      '#10b981', // 10 - Emerald
      '#6366f1', // 11 - Indigo
      '#84cc16'  // 12 - Lime
    ];
    return colors[(houseNumber - 1) % colors.length];
  };

  /**
   * Get strength color
   */
  const getStrengthColor = (strength: number) => {
    if (strength >= 0.8) return '#22c55e'; // green
    if (strength >= 0.6) return '#eab308'; // yellow
    if (strength >= 0.4) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  /**
   * Get house significance
   */
  const getHouseSignificance = (houseNumber: number) => {
    const significances = {
      1: "Self, personality, physical appearance, leadership",
      2: "Wealth, family, speech, material possessions",
      3: "Siblings, communication, courage, short journeys",
      4: "Home, mother, emotions, property, education",
      5: "Children, creativity, intelligence, romance",
      6: "Health, service, enemies, obstacles, routine",
      7: "Marriage, partnerships, spouse, relationships",
      8: "Transformation, secrets, longevity, inheritance",
      9: "Fortune, father, higher learning, philosophy",
      10: "Career, reputation, authority, achievements",
      11: "Gains, friends, hopes, wishes, elder siblings",
      12: "Spirituality, expenses, foreign lands, isolation"
    };
    return significances[houseNumber as keyof typeof significances] || "General life area";
  };

  /**
   * Render house card
   */
  const renderHouseCard = (houseNumber: number, houseData: any) => {
    if (!houseData) {
      return (
        <div key={houseNumber} className="house-card error">
          <div className="house-header">
            <div
              className="house-number"
              style={{ backgroundColor: getHouseColor(houseNumber) }}
            >
              {houseNumber}
            </div>
            <h3 className="house-title">House {houseNumber}</h3>
          </div>
          <div className="house-content">
            <p>Analysis unavailable</p>
          </div>
        </div>
      );
    }

    const strengthColor = getStrengthColor(houseData.overallStrength || 0);

    return (
      <div key={houseNumber} className="house-card">
        <div className="house-header">
          <div
            className="house-number"
            style={{ backgroundColor: getHouseColor(houseNumber) }}
          >
            {houseNumber}
          </div>
          <div className="house-info">
            <h3 className="house-title">House {houseNumber}</h3>
            <p className="house-significance">{getHouseSignificance(houseNumber)}</p>
          </div>
        </div>

        <div className="house-strength">
          <div className="strength-bar">
            <div
              className="strength-fill"
              style={{
                width: `${Math.min(100, (houseData.overallStrength || 0) * 100)}%`,
                backgroundColor: strengthColor
              }}
            />
          </div>
          <div className="strength-info">
            <span className="strength-score">
              {((houseData.overallStrength || 0) * 100).toFixed(0)}%
            </span>
            <span className="strength-label">
              {houseData.overallStrength >= 0.8 ? 'Strong' :
               houseData.overallStrength >= 0.6 ? 'Good' :
               houseData.overallStrength >= 0.4 ? 'Moderate' : 'Weak'}
            </span>
          </div>
        </div>

        <div className="house-details">
          <div className="detail-item">
            <span className="detail-label">Lord:</span>
            <span className="detail-value">{houseData.lord || 'Unknown'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Lord Strength:</span>
            <span className="detail-value">
              {((houseData.lordStrength || 0) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Planets:</span>
            <span className="detail-value">
              {houseData.planets?.length > 0 ? houseData.planets.join(', ') : 'None'}
            </span>
          </div>
        </div>

        {houseData.predictions?.general && (
          <div className="house-prediction">
            <h4>General Prediction</h4>
            <p>{houseData.predictions.general}</p>
          </div>
        )}

        {houseData.challenges?.length > 0 && (
          <div className="house-challenges">
            <h4>Challenges</h4>
            <ul>
              {houseData.challenges.map((challenge: string, index: number) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </div>
        )}

        {houseData.favorablePeriods?.length > 0 && (
          <div className="house-periods">
            <h4>Favorable Periods</h4>
            <ul>
              {houseData.favorablePeriods.map((period: string, index: number) => (
                <li key={index}>{period}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  /**
   * Calculate overall statistics
   */
  const calculateStats = () => {
    if (!lifeAreas) return { strong: 0, moderate: 0, weak: 0, average: 0 };

    const houses = Object.values(lifeAreas);
    const strong = houses.filter((h: any) => (h?.overallStrength || 0) >= 0.7).length;
    const moderate = houses.filter((h: any) => (h?.overallStrength || 0) >= 0.4 && (h?.overallStrength || 0) < 0.7).length;
    const weak = houses.filter((h: any) => (h?.overallStrength || 0) < 0.4).length;
    const average = houses.reduce((sum: number, h: any) => sum + (h?.overallStrength || 0), 0) / houses.length;

    return { strong, moderate, weak, average };
  };

  const stats = calculateStats();

  return (
    <div className="life-areas-display">
      <div className="section-header">
        <h2>Life Areas Analysis</h2>
        <p>
          Comprehensive analysis of all 12 houses representing different areas of life,
          their strengths, planetary influences, and predictions.
        </p>
      </div>

      <div className="areas-overview">
        <div className="overview-stats">
          <div className="stat-item">
            <span className="stat-label">Strong Areas:</span>
            <span className="stat-value">{stats.strong}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Moderate Areas:</span>
            <span className="stat-value">{stats.moderate}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Weak Areas:</span>
            <span className="stat-value">{stats.weak}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average Strength:</span>
            <span className="stat-value">{(stats.average * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div className="houses-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(houseNumber =>
          renderHouseCard(houseNumber, lifeAreas?.[houseNumber])
        )}
      </div>

      <div className="areas-notes">
        <h3>Understanding the Houses</h3>
        <div className="notes-content">
          <p>
            In Vedic astrology, the birth chart is divided into 12 houses, each representing
            different areas of life. The strength of each house depends on its lord's position,
            planets placed in it, and aspects received.
          </p>
          <div className="house-categories">
            <div className="category">
              <h4>Kendra Houses (1, 4, 7, 10)</h4>
              <p>Most important houses representing life foundations and achievements.</p>
            </div>
            <div className="category">
              <h4>Trikona Houses (1, 5, 9)</h4>
              <p>Houses of fortune, representing spiritual and material prosperity.</p>
            </div>
            <div className="category">
              <h4>Dusthana Houses (6, 8, 12)</h4>
              <p>Challenging houses representing obstacles, transformation, and spirituality.</p>
            </div>
            <div className="category">
              <h4>Upachaya Houses (3, 6, 10, 11)</h4>
              <p>Houses that improve with time and effort.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeAreasDisplay;