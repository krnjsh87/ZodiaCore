import React from 'react';
import { DivisionalChart } from '../types/astrology';

/**
 * Props for DivisionalChartDisplay component
 */
interface DivisionalChartDisplayProps {
  /** The divisional chart data to display */
  chart: DivisionalChart;
  /** Optional CSS class name */
  className?: string;
  /** Whether to show detailed planet positions */
  showDetails?: boolean;
}

/**
 * Zodiac sign names for display
 */
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

/**
 * Planet symbols for display
 */
const PLANET_SYMBOLS: Record<string, string> = {
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

/**
 * DivisionalChartDisplay Component
 *
 * Displays a Vedic astrology divisional chart (Varga) with planets,
 * houses, and significance information in an accessible, responsive format.
 */
const DivisionalChartDisplay: React.FC<DivisionalChartDisplayProps> = ({
  chart,
  className = '',
  showDetails = true
}) => {
  /**
   * Convert longitude to zodiac sign and degrees
   */
  const getSignAndDegrees = (longitude: number) => {
    const signIndex = Math.floor(longitude / 30);
    const degrees = (longitude % 30).toFixed(1);
    return {
      sign: ZODIAC_SIGNS[signIndex],
      degrees: parseFloat(degrees)
    };
  };

  /**
   * Get planet display information
   */
  const getPlanetInfo = (planet: string, longitude: number) => {
    const { sign, degrees } = getSignAndDegrees(longitude);
    return {
      symbol: PLANET_SYMBOLS[planet] || planet,
      name: planet,
      sign,
      degrees,
      longitude
    };
  };

  /**
   * Render planet position details
   */
  const renderPlanetDetails = () => {
    if (!showDetails) return null;

    return (
      <div className="divisional-chart__planet-details">
        <h4>Planet Positions</h4>
        <div className="planet-grid">
          {Object.entries(chart.positions).map(([planet, longitude]) => {
            const info = getPlanetInfo(planet, longitude);
            return (
              <div key={planet} className="planet-item">
                <span className="planet-symbol" aria-label={`${planet} symbol`}>
                  {info.symbol}
                </span>
                <span className="planet-name">{info.name}</span>
                <span className="planet-position">
                  {info.sign} {info.degrees}°
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * Render house cusps
   */
  const renderHouses = () => {
    if (!showDetails) return null;

    return (
      <div className="divisional-chart__houses">
        <h4>House Cusps</h4>
        <div className="house-grid">
          {chart.houses.map((longitude, index) => {
            const { sign, degrees } = getSignAndDegrees(longitude);
            const houseNumber = index + 1;
            return (
              <div key={index} className="house-item">
                <span className="house-number">{houseNumber}</span>
                <span className="house-position">
                  {sign} {degrees.toFixed(1)}°
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`divisional-chart-display ${className}`}
      role="region"
      aria-labelledby={`chart-${chart.type}-title`}
    >
      {/* Chart Header */}
      <header className="divisional-chart__header">
        <h3 id={`chart-${chart.type}-title`}>
          {chart.name} ({chart.type})
        </h3>
        <p className="chart-significance">{chart.significance}</p>
        <div className="chart-meta">
          <span className="chart-divisor">Division: 1/{chart.divisor}</span>
        </div>
      </header>

      {/* Chart Content */}
      <div className="divisional-chart__content">
        {renderPlanetDetails()}
        {renderHouses()}
      </div>

      {/* Chart Footer with additional info */}
      <footer className="divisional-chart__footer">
        <p className="chart-description">
          This {chart.type} chart provides specialized analysis for {chart.significance.toLowerCase()}.
          Use this chart in conjunction with the main birth chart for comprehensive predictions.
        </p>
      </footer>
    </div>
  );
};

export default DivisionalChartDisplay;