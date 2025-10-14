import React from 'react';
import { TransitPositions, TransitAspect } from '../types/astrology';
import './TransitDisplay.css';

interface TransitDisplayProps {
  positions: TransitPositions;
  aspects: TransitAspect[];
}

export const TransitDisplay: React.FC<TransitDisplayProps> = ({ positions, aspects }) => {
  const formatLongitude = (longitude: number) => {
    const degrees = Math.floor(longitude);
    const minutes = Math.floor((longitude - degrees) * 60);
    return `${degrees}°${minutes}'`;
  };

  const getPlanetSymbol = (planet: string) => {
    const symbols: Record<string, string> = {
      SUN: '☉',
      MOON: '☽',
      MARS: '♂',
      MERCURY: '☿',
      JUPITER: '♃',
      VENUS: '♀',
      SATURN: '♄',
      RAHU: '☊',
      KETU: '☋'
    };
    return symbols[planet] || planet;
  };

  const getAspectColor = (aspect: string) => {
    switch (aspect) {
      case 'CONJUNCTION': return 'conjunction';
      case 'OPPOSITION': return 'opposition';
      case 'TRINE': return 'trine';
      case 'SQUARE': return 'square';
      case 'SEXTILE': return 'sextile';
      default: return 'no-aspect';
    }
  };

  return (
    <div className="transit-display">
      <h3>Current Planetary Transits</h3>

      <div className="transit-positions">
        <h4>Planetary Positions</h4>
        <div className="positions-grid">
          {Object.entries(positions).map(([planet, longitude]) => (
            <div key={planet} className="position-item">
              <span className="planet-symbol">{getPlanetSymbol(planet)}</span>
              <span className="planet-name">{planet}</span>
              <span className="longitude">{formatLongitude(longitude)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="transit-aspects">
        <h4>Current Aspects</h4>
        {aspects.length > 0 ? (
          <div className="aspects-list">
            {aspects.map((aspect, index) => (
              <div key={index} className={`aspect-item ${getAspectColor(aspect.aspect)}`}>
                <div className="aspect-planets">
                  <span className="natal-planet">
                    {getPlanetSymbol(aspect.natalPlanet)} {aspect.natalPlanet}
                  </span>
                  <span className="aspect-type">{aspect.aspect}</span>
                  <span className="transit-planet">
                    {getPlanetSymbol(aspect.transitPlanet)} {aspect.transitPlanet}
                  </span>
                </div>
                <div className="aspect-details">
                  <span className="orb">Orb: {aspect.orb.toFixed(1)}°</span>
                  <span className="strength">Strength: {(aspect.strength * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-aspects">No significant aspects currently active</p>
        )}
      </div>
    </div>
  );
};