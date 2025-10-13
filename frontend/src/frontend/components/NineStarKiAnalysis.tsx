import React from 'react';

interface NineStarKiAnalysisProps {
  nineStarKi: any;
}

const NineStarKiAnalysis: React.FC<NineStarKiAnalysisProps> = ({ nineStarKi }) => {
  return (
    <div className="nine-star-ki-analysis">
      <h2>Nine Star Ki Analysis</h2>
      <p>Directional energy and life path analysis</p>

      <div className="star-info">
        <div className="birth-star">
          <h3>Birth Star: {nineStarKi.birthStar.number} {nineStarKi.birthStar.color}</h3>
          <p>Element: {nineStarKi.birthStar.element}</p>
          <p>Energy: {nineStarKi.birthStar.energy}</p>
        </div>

        <div className="current-star">
          <h3>Current Star: {nineStarKi.currentStar.number} {nineStarKi.currentStar.color}</h3>
          <p>Element: {nineStarKi.currentStar.element}</p>
        </div>
      </div>

      <div className="directional-stars">
        <h3>Directional Energies</h3>
        <div className="directions-grid">
          {Object.entries(nineStarKi.directionalStars).map(([direction, star]: [string, any]) => (
            <div key={direction} className="direction-card">
              <h4>{direction}</h4>
              <div className="star-number">{star.number}</div>
              <div className="energy">Energy: {(star.energy * 100).toFixed(0)}%</div>
              <div className="compatibility">Compatibility: {(star.compatibility * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="temporal-influences">
        <h3>Temporal Influences</h3>
        <p>Life Period: {nineStarKi.temporalInfluences.lifePeriod}</p>
        <p>Year Influence: {(nineStarKi.temporalInfluences.yearInfluence * 100).toFixed(0)}%</p>
        <p>Energy Flow: {nineStarKi.interactions.energyFlow}</p>
      </div>

      <div className="analysis">
        <h3>Analysis</h3>
        <div className="personality">
          <h4>Personality Traits</h4>
          <ul>
            {nineStarKi.analysis.personalityTraits.map((trait: string, index: number) => (
              <li key={index}>{trait}</li>
            ))}
          </ul>
        </div>

        <div className="life-purpose">
          <h4>Life Purpose</h4>
          <p>{nineStarKi.analysis.lifePurpose}</p>
        </div>

        <div className="favorable-directions">
          <h4>Favorable Directions</h4>
          <ul>
            {nineStarKi.analysis.favorableDirections.map((direction: string, index: number) => (
              <li key={index}>{direction}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NineStarKiAnalysis;