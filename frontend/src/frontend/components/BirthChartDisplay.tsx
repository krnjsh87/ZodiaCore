import React from 'react';
import { BirthChart } from '../types/astrology';
import './BirthChartDisplay.css';

interface BirthChartDisplayProps {
  birthChart: BirthChart;
  loading?: boolean;
  error?: string;
}

/**
 * Comprehensive Birth Chart Display Component
 * Displays Vedic birth chart with chart wheel, planetary positions, and analysis
 */
const BirthChartDisplay: React.FC<BirthChartDisplayProps> = ({
  birthChart,
  loading = false,
  error
}) => {
  if (loading) {
    return (
      <div className="birth-chart-loading" role="status" aria-label="Loading birth chart">
        <div className="loading-spinner"></div>
        <p>Generating your Vedic birth chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="birth-chart-error" role="alert">
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
      <div className="birth-chart-empty">
        <p>No birth chart data available. Please enter your birth details.</p>
      </div>
    );
  }

  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];

  return (
    <div className="birth-chart-display">
      <header className="birth-chart-header">
        <h1>Vedic Birth Chart (Janam Kundali)</h1>
        <div className="birth-info">
          <p><strong>Birth Date:</strong> {birthChart.birthData.day}/{birthChart.birthData.month}/{birthChart.birthData.year}</p>
          <p><strong>Birth Time:</strong> {birthChart.birthData.hour}:{String(birthChart.birthData.minute).padStart(2, '0')}</p>
          <p><strong>Location:</strong> {birthChart.birthData.latitude.toFixed(2)}°, {birthChart.birthData.longitude.toFixed(2)}°</p>
        </div>
      </header>

      <div className="birth-chart-content">
        {/* Chart Wheel */}
        <section className="chart-wheel-section" aria-labelledby="chart-wheel-title">
          <h2 id="chart-wheel-title">Birth Chart Wheel</h2>
          <ChartWheel birthChart={birthChart} />
        </section>

        {/* Planetary Positions */}
        <section className="planetary-positions-section" aria-labelledby="planetary-positions-title">
          <h2 id="planetary-positions-title">Planetary Positions</h2>
          <div className="planetary-table">
            <table role="table" aria-label="Planetary positions in the birth chart">
              <thead>
                <tr>
                  <th>Planet</th>
                  <th>Sign</th>
                  <th>Degree</th>
                  <th>House</th>
                  <th>Retrograde</th>
                  <th>Nakshatra</th>
                </tr>
              </thead>
              <tbody>
                {planets.map(planet => {
                  const position = birthChart.planets[planet];
                  if (!position) return null;

                  return (
                    <tr key={planet}>
                      <td className={`planet-${planet.toLowerCase()}`}>{planet}</td>
                      <td>{zodiacSigns[position.sign]}</td>
                      <td>{position.degree.toFixed(2)}°</td>
                      <td>{position.house}</td>
                      <td>{position.retrograde ? 'R' : '-'}</td>
                      <td>
                        {position.nakshatra ? (
                          <span title={`Pada ${position.nakshatra.pada}`}>
                            {position.nakshatra.nakshatraName}
                          </span>
                        ) : '-'}
                      </td>
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

        {/* Lunar Information */}
        <section className="lunar-info-section" aria-labelledby="lunar-info-title">
          <h2 id="lunar-info-title">Lunar Information</h2>
          <div className="lunar-details">
            <div className="nakshatra-info">
              <h3>Moon Nakshatra</h3>
              <p><strong>Nakshatra:</strong> {birthChart.moonDetails.nakshatra.nakshatraName}</p>
              <p><strong>Pada:</strong> {birthChart.moonDetails.nakshatra.pada}</p>
              <p><strong>Lord:</strong> {birthChart.moonDetails.nakshatra.lord}</p>
            </div>
            <div className="tithi-info">
              <h3>Tithi</h3>
              <p><strong>Tithi:</strong> {birthChart.moonDetails.tithi.name}</p>
              <p><strong>Paksha:</strong> {birthChart.moonDetails.tithi.paksha}</p>
              <p><strong>Progress:</strong> {(birthChart.moonDetails.tithi.progress * 100).toFixed(1)}%</p>
            </div>
          </div>
        </section>

        {/* Dasha Information */}
        <section className="dasha-section" aria-labelledby="dasha-title">
          <h2 id="dasha-title">Vimshottari Dasha</h2>
          <div className="dasha-balance">
            <h3>Dasha Balance at Birth</h3>
            <p><strong>Lord:</strong> {birthChart.dasha.balance.lord}</p>
            <p><strong>Balance:</strong> {birthChart.dasha.balance.balanceYears} years, {birthChart.dasha.balance.balanceDays} days</p>
          </div>
          {birthChart.dasha.current && (
            <div className="current-dasha">
              <h3>Current Dasha</h3>
              <p><strong>Mahadasha:</strong> {birthChart.dasha.current.mahadasha.planet}</p>
              <p><strong>Progress:</strong> {(birthChart.dasha.current.mahadasha.progress * 100).toFixed(1)}%</p>
              {birthChart.dasha.current.antardasha && (
                <p><strong>Antardasha:</strong> {birthChart.dasha.current.antardasha.planet} ({(birthChart.dasha.current.antardasha.progress * 100).toFixed(1)}%)</p>
              )}
            </div>
          )}
        </section>

        {/* Planetary Strengths */}
        <section className="strengths-section" aria-labelledby="strengths-title">
          <h2 id="strengths-title">Planetary Strengths</h2>
          <div className="strengths-table">
            <table role="table" aria-label="Planetary strengths analysis">
              <thead>
                <tr>
                  <th>Planet</th>
                  <th>Shadbala</th>
                  <th>Dignity</th>
                  <th>Aspectual</th>
                  <th>Positional</th>
                  <th>Overall</th>
                </tr>
              </thead>
              <tbody>
                {planets.map(planet => {
                  const strength = birthChart.strengths[planet];
                  if (!strength) return null;

                  return (
                    <tr key={planet}>
                      <td className={`planet-${planet.toLowerCase()}`}>{planet}</td>
                      <td>{strength.shadbala.toFixed(1)}</td>
                      <td>{strength.dignity.toFixed(1)}</td>
                      <td>{strength.aspectual.toFixed(1)}</td>
                      <td>{strength.positional.toFixed(1)}</td>
                      <td className="overall-strength">{strength.overall.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Yogas */}
        {birthChart.yogas && birthChart.yogas.length > 0 && (
          <section className="yogas-section" aria-labelledby="yogas-title">
            <h2 id="yogas-title">Yogas Formed</h2>
            <div className="yogas-list">
              {birthChart.yogas.map((yoga, index) => (
                <div key={index} className="yoga-item">
                  <h3>{yoga.name}</h3>
                  <p><strong>Type:</strong> {yoga.type}</p>
                  <p><strong>Planets:</strong> {yoga.planets.join(', ')}</p>
                  <p><strong>Strength:</strong> {yoga.strength.toFixed(1)}</p>
                  <p><strong>Effects:</strong> {yoga.effects.join(', ')}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Details */}
        <section className="technical-section" aria-labelledby="technical-title">
          <h2 id="technical-title">Technical Details</h2>
          <div className="technical-details">
            <p><strong>Julian Day:</strong> {birthChart.julianDay.toFixed(5)}</p>
            <p><strong>Ayanamsa:</strong> {birthChart.ayanamsa.toFixed(5)}°</p>
            <p><strong>LST:</strong> {birthChart.lst.toFixed(5)}°</p>
            <p><strong>Ascendant:</strong> {zodiacSigns[birthChart.ascendant.sign]} {birthChart.ascendant.degree.toFixed(2)}°</p>
          </div>
        </section>
      </div>
    </div>
  );
};

/**
 * Chart Wheel Component - Simple SVG-based birth chart visualization
 */
const ChartWheel: React.FC<{ birthChart: BirthChart }> = ({ birthChart }) => {
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
    <div className="chart-wheel-container">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="chart-wheel-svg"
        role="img"
        aria-label="Vedic birth chart wheel visualization"
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
          const planetSymbols: Record<string, string> = {
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
                {planetSymbols[planet] || planet[0]}
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
      </svg>

      <div className="chart-legend">
        <h3>Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-symbol ascendant-marker"></span>
            <span>Ascendant</span>
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

export default BirthChartDisplay;