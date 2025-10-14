import React from 'react';
import { WesternBirthChart } from '../types/astrology';
import './WesternBirthChartDisplay.css';

interface WesternBirthChartDisplayProps {
  birthChart: WesternBirthChart;
  loading?: boolean;
  error?: string;
}

/**
 * Western Birth Chart Display Component
 * Displays Western astrology birth chart with chart wheel, planetary positions, aspects, and analysis
 */
const WesternBirthChartDisplay: React.FC<WesternBirthChartDisplayProps> = ({
  birthChart,
  loading = false,
  error
}) => {
  if (loading) {
    return (
      <div className="western-birth-chart-loading" role="status" aria-label="Loading Western birth chart">
        <div className="loading-spinner"></div>
        <p>Generating your Western birth chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="western-birth-chart-error" role="alert">
        <h3>Error Generating Birth Chart</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (!birthChart) {
    return (
      <div className="western-birth-chart-empty">
        <p>No birth chart data available. Please enter your birth details.</p>
      </div>
    );
  }

  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const planets = ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO'];

  return (
    <div className="western-birth-chart-display">
      <header className="western-birth-chart-header">
        <h1>Western Birth Chart (Natal Chart)</h1>
        <div className="birth-info">
          <p><strong>Birth Date:</strong> {birthChart.birthData.day}/{birthChart.birthData.month}/{birthChart.birthData.year}</p>
          <p><strong>Birth Time:</strong> {birthChart.birthData.hour}:{String(birthChart.birthData.minute).padStart(2, '0')}</p>
          <p><strong>Location:</strong> {birthChart.birthData.latitude.toFixed(2)}°, {birthChart.birthData.longitude.toFixed(2)}°</p>
        </div>
      </header>

      <div className="western-birth-chart-content">
        {/* Chart Wheel */}
        <section className="chart-wheel-section" aria-labelledby="chart-wheel-title">
          <h2 id="chart-wheel-title">Birth Chart Wheel</h2>
          <WesternChartWheel birthChart={birthChart} />
        </section>

        {/* Key Chart Points */}
        <section className="key-points-section" aria-labelledby="key-points-title">
          <h2 id="key-points-title">Key Chart Points</h2>
          <div className="key-points-grid">
            <div className="key-point">
              <h3>Ascendant (Rising Sign)</h3>
              <p className="sign-name">{zodiacSigns[birthChart.ascendant.sign]}</p>
              <p className="degree">{birthChart.ascendant.degree.toFixed(2)}°</p>
            </div>
            <div className="key-point">
              <h3>Midheaven (MC)</h3>
              <p className="sign-name">{zodiacSigns[birthChart.midheaven.sign]}</p>
              <p className="degree">{birthChart.midheaven.degree.toFixed(2)}°</p>
            </div>
          </div>
        </section>

        {/* Planetary Positions */}
        <section className="planetary-positions-section" aria-labelledby="planetary-positions-title">
          <h2 id="planetary-positions-title">Planetary Positions</h2>
          <div className="planetary-table">
            <table role="table" aria-label="Planetary positions in the Western birth chart">
              <thead>
                <tr>
                  <th>Planet</th>
                  <th>Sign</th>
                  <th>Degree</th>
                  <th>House</th>
                  <th>Retrograde</th>
                </tr>
              </thead>
              <tbody>
                {planets.map(planet => {
                  const position = birthChart.planets[planet];
                  if (!position) return null;

                  return (
                    <tr key={planet}>
                      <td className={`planet-${planet.toLowerCase()}`}>
                        <span className="planet-symbol">{getPlanetSymbol(planet)}</span>
                        {planet}
                      </td>
                      <td>{zodiacSigns[position.sign]}</td>
                      <td>{position.degree.toFixed(2)}°</td>
                      <td>{position.house}</td>
                      <td>{position.retrograde ? 'R' : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* House Cusps */}
        <section className="houses-section" aria-labelledby="houses-title">
          <h2 id="houses-title">House Cusps</h2>
          <div className="houses-grid">
            {birthChart.houses.map((house, index) => (
              <div key={index} className="house-cusp">
                <span className="house-number">{index + 1}</span>
                <span className="house-sign">{zodiacSigns[Math.floor(house / 30)]}</span>
                <span className="house-degree">{(house % 30).toFixed(1)}°</span>
              </div>
            ))}
          </div>
        </section>

        {/* Aspects */}
        {birthChart.aspects && birthChart.aspects.length > 0 && (
          <section className="aspects-section" aria-labelledby="aspects-title">
            <h2 id="aspects-title">Major Aspects</h2>
            <div className="aspects-table">
              <table role="table" aria-label="Planetary aspects in the birth chart">
                <thead>
                  <tr>
                    <th>Planet 1</th>
                    <th>Planet 2</th>
                    <th>Aspect</th>
                    <th>Angle</th>
                    <th>Orb</th>
                    <th>Exact</th>
                  </tr>
                </thead>
                <tbody>
                  {birthChart.aspects.map((aspect, index) => (
                    <tr key={index}>
                      <td className={`planet-${aspect.planet1.toLowerCase()}`}>
                        <span className="planet-symbol">{getPlanetSymbol(aspect.planet1)}</span>
                        {aspect.planet1}
                      </td>
                      <td className={`planet-${aspect.planet2.toLowerCase()}`}>
                        <span className="planet-symbol">{getPlanetSymbol(aspect.planet2)}</span>
                        {aspect.planet2}
                      </td>
                      <td className={`aspect-${aspect.aspect.toLowerCase().replace(' ', '-')}`}>
                        {aspect.aspect}
                      </td>
                      <td>{aspect.angle.toFixed(1)}°</td>
                      <td>{aspect.orb.toFixed(1)}°</td>
                      <td>{aspect.exact ? '✓' : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Technical Details */}
        <section className="technical-section" aria-labelledby="technical-title">
          <h2 id="technical-title">Technical Details</h2>
          <div className="technical-details">
            <p><strong>Julian Day:</strong> {birthChart.julianDay.toFixed(5)}</p>
            <p><strong>Local Sidereal Time:</strong> {birthChart.lst.toFixed(5)}°</p>
            <p><strong>Ascendant:</strong> {zodiacSigns[birthChart.ascendant.sign]} {birthChart.ascendant.degree.toFixed(2)}°</p>
            <p><strong>Midheaven:</strong> {zodiacSigns[birthChart.midheaven.sign]} {birthChart.midheaven.degree.toFixed(2)}°</p>
          </div>
        </section>
      </div>
    </div>
  );
};

/**
 * Get planet symbol for Western astrology
 */
const getPlanetSymbol = (planet: string): string => {
  const symbols: Record<string, string> = {
    SUN: '☉',
    MOON: '☽',
    MERCURY: '☿',
    VENUS: '♀',
    MARS: '♂',
    JUPITER: '♃',
    SATURN: '♄',
    URANUS: '⛢',
    NEPTUNE: '♆',
    PLUTO: '♇'
  };
  return symbols[planet] || planet[0];
};

/**
 * Western Chart Wheel Component - SVG-based birth chart visualization
 */
const WesternChartWheel: React.FC<{ birthChart: WesternBirthChart }> = ({ birthChart }) => {
  const size = 400;
  const center = size / 2;
  const radius = center - 20;

  // Calculate positions for houses and planets
  const getPosition = (longitude: number) => {
    const angle = (longitude * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(angle - Math.PI / 2),
      y: center + radius * Math.sin(angle - Math.PI / 2)
    };
  };

  return (
    <div className="western-chart-wheel-container">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="western-chart-wheel-svg"
        role="img"
        aria-label="Western birth chart wheel visualization"
      >
        {/* Outer circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#333"
          strokeWidth="2"
        />

        {/* Inner circle for houses */}
        <circle
          cx={center}
          cy={center}
          r={radius * 0.7}
          fill="none"
          stroke="#666"
          strokeWidth="1"
        />

        {/* House divisions */}
        {birthChart.houses.map((_, index) => {
          const angle = (index * 30 * Math.PI) / 180;
          const x1 = center + radius * Math.cos(angle - Math.PI / 2);
          const y1 = center + radius * Math.sin(angle - Math.PI / 2);
          const x2 = center + (radius * 0.7) * Math.cos(angle - Math.PI / 2);
          const y2 = center + (radius * 0.7) * Math.sin(angle - Math.PI / 2);

          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#999"
              strokeWidth="1"
            />
          );
        })}

        {/* House numbers */}
        {birthChart.houses.map((_, index) => {
          const angle = ((index * 30) + 15) * Math.PI / 180;
          const x = center + (radius * 0.85) * Math.cos(angle - Math.PI / 2);
          const y = center + (radius * 0.85) * Math.sin(angle - Math.PI / 2);

          return (
            <text
              key={`house-${index}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="house-number-text"
              fontSize="12"
            >
              {index + 1}
            </text>
          );
        })}

        {/* Planetary positions */}
        {Object.entries(birthChart.planets).map(([planet, position]) => {
          const pos = getPosition(position.longitude);

          return (
            <g key={planet}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="8"
                fill="#fff"
                stroke="#333"
                strokeWidth="2"
                className={`planet-symbol ${planet.toLowerCase()}`}
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                className="planet-text"
              >
                {getPlanetSymbol(planet)}
              </text>
            </g>
          );
        })}

        {/* Ascendant marker */}
        <polygon
          points={`${center + radius},${center} ${center + radius + 10},${center - 5} ${center + radius + 10},${center + 5}`}
          fill="#ff6b6b"
          className="ascendant-marker"
        />

        {/* Midheaven marker (top of chart) */}
        <polygon
          points={`${center},${center - radius} ${center - 5},${center - radius - 10} ${center + 5},${center - radius - 10}`}
          fill="#4ecdc4"
          className="midheaven-marker"
        />
      </svg>

      <div className="western-chart-legend">
        <h3>Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-symbol ascendant-marker"></span>
            <span>Ascendant</span>
          </div>
          <div className="legend-item">
            <span className="legend-symbol midheaven-marker"></span>
            <span>Midheaven (MC)</span>
          </div>
          {Object.entries(birthChart.planets).map(([planet, position]) => (
            <div key={planet} className="legend-item">
              <span className={`legend-symbol planet-${planet.toLowerCase()}`}></span>
              <span>{planet} (House {position.house})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WesternBirthChartDisplay;