import React from 'react';
import { ReturnChart, CombinedReturnCharts } from '../types/astrology';
import WesternReturnChartInterpretation from './WesternReturnChartInterpretation';

/**
 * Props for WesternReturnChartDisplay component
 */
interface WesternReturnChartDisplayProps {
  returnChart: ReturnChart | null;
  combinedCharts: CombinedReturnCharts | null;
  loading: boolean;
  error: string | null;
}

/**
 * Western Return Chart Display Component
 * Displays the generated return chart with positions, aspects, and interpretation
 */
const WesternReturnChartDisplay: React.FC<WesternReturnChartDisplayProps> = ({
  returnChart,
  combinedCharts,
  loading,
  error
}) => {
  if (loading) {
    return (
      <div className="return-chart-loading">
        <div className="loading-spinner"></div>
        <p>Calculating return chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="return-chart-error">
        <h3>Error Generating Chart</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!returnChart && !combinedCharts) {
    return (
      <div className="return-chart-empty">
        <p>No return chart data available.</p>
      </div>
    );
  }

  return (
    <div className="western-return-chart-display">
      {/* Single Return Chart */}
      {returnChart && (
        <div className="single-return-chart">
          <ReturnChartHeader chart={returnChart} />
          <ReturnChartPositions positions={returnChart.chart.positions} />
          <ReturnChartHouses houses={returnChart.chart.houses} />
          <ReturnChartAspects aspects={returnChart.chart.aspects} />
          <ReturnChartAngularity angularity={returnChart.chart.angularity} />
          <WesternReturnChartInterpretation interpretation={returnChart.interpretation} />
          <ReturnChartValidation validation={returnChart.validation} />
        </div>
      )}

      {/* Combined Return Charts */}
      {combinedCharts && (
        <div className="combined-return-charts">
          <div className="combined-header">
            <h2>Combined Solar & Lunar Return Analysis</h2>
            <p>Understanding how yearly and monthly themes interact</p>
          </div>

          <div className="charts-comparison">
            <div className="chart-section">
              <h3>Solar Return ({combinedCharts.solar.year})</h3>
              <ReturnChartSummary chart={combinedCharts.solar} />
              <WesternReturnChartInterpretation
                interpretation={combinedCharts.solar.interpretation}
                compact={true}
              />
            </div>

            <div className="chart-section">
              <h3>Lunar Return ({combinedCharts.lunar.month}/{combinedCharts.lunar.year})</h3>
              <ReturnChartSummary chart={combinedCharts.lunar} />
              <WesternReturnChartInterpretation
                interpretation={combinedCharts.lunar.interpretation}
                compact={true}
              />
            </div>
          </div>

          <div className="combined-analysis">
            <h3>Combined Analysis</h3>
            <div className="harmony-score">
              <h4>Harmony Score: {Math.round(combinedCharts.combinedAnalysis.harmony * 100)}%</h4>
              <div className="harmony-bar">
                <div
                  className="harmony-fill"
                  style={{ width: `${combinedCharts.combinedAnalysis.harmony * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="combined-insights">
              <div className="conflicts">
                <h4>Potential Conflicts</h4>
                <ul>
                  {combinedCharts.combinedAnalysis.conflicts.map((conflict, index) => (
                    <li key={index}>{conflict}</li>
                  ))}
                </ul>
              </div>

              <div className="opportunities">
                <h4>Opportunities</h4>
                <ul>
                  {combinedCharts.combinedAnalysis.opportunities.map((opportunity, index) => (
                    <li key={index}>{opportunity}</li>
                  ))}
                </ul>
              </div>

              <div className="challenges">
                <h4>Challenges</h4>
                <ul>
                  {combinedCharts.combinedAnalysis.challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="overall-theme">
              <h4>Overall Theme</h4>
              <p>{combinedCharts.combinedAnalysis.overallTheme}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Return Chart Header Component
 */
const ReturnChartHeader: React.FC<{ chart: ReturnChart }> = ({ chart }) => (
  <div className="return-chart-header">
    <h2>{chart.type === 'solar' ? 'Solar' : 'Lunar'} Return Chart</h2>
    <div className="chart-meta">
      <div className="meta-item">
        <span className="label">Return Time:</span>
        <span className="value">{chart.returnTime.toLocaleString()}</span>
      </div>
      <div className="meta-item">
        <span className="label">Location:</span>
        <span className="value">
          {chart.chart.location.latitude.toFixed(4)}°, {chart.chart.location.longitude.toFixed(4)}°
        </span>
      </div>
      <div className="meta-item">
        <span className="label">Validity Period:</span>
        <span className="value">
          {chart.validityPeriod.start.toLocaleDateString()} - {chart.validityPeriod.end.toLocaleDateString()}
        </span>
      </div>
      <div className="meta-item">
        <span className="label">System Version:</span>
        <span className="value">{chart.systemVersion}</span>
      </div>
    </div>
  </div>
);

/**
 * Return Chart Positions Component
 */
const ReturnChartPositions: React.FC<{ positions: Record<string, any> }> = ({ positions }) => (
  <div className="return-chart-positions">
    <h3>Planetary Positions</h3>
    <div className="positions-grid">
      {Object.entries(positions).map(([planet, position]: [string, any]) => (
        <div key={planet} className="position-item">
          <div className="planet-name">{planet}</div>
          <div className="position-data">
            <div className="longitude">{position.longitude.toFixed(2)}°</div>
            <div className="sign">in {getZodiacSign(position.longitude)}</div>
            <div className="house">House {position.house}</div>
            {position.retrograde && <div className="retrograde">R</div>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Return Chart Houses Component
 */
const ReturnChartHouses: React.FC<{ houses: number[] }> = ({ houses }) => (
  <div className="return-chart-houses">
    <h3>House Cusps</h3>
    <div className="houses-grid">
      {houses.map((cusp, index) => (
        <div key={index} className="house-item">
          <div className="house-number">{index + 1}</div>
          <div className="house-cusp">{cusp.toFixed(2)}°</div>
          <div className="house-sign">{getZodiacSign(cusp)}</div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Return Chart Aspects Component
 */
const ReturnChartAspects: React.FC<{ aspects: any[] }> = ({ aspects }) => (
  <div className="return-chart-aspects">
    <h3>Major Aspects</h3>
    <div className="aspects-list">
      {aspects.map((aspect, index) => (
        <div key={index} className="aspect-item">
          <div className="aspect-planets">
            {aspect.planet1} {aspect.aspect} {aspect.planet2}
          </div>
          <div className="aspect-details">
            <span className="orb">{aspect.orb.toFixed(1)}° orb</span>
            <span className="strength">{getAspectStrength(aspect.strength)}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Return Chart Angularity Component
 */
const ReturnChartAngularity: React.FC<{ angularity: any }> = ({ angularity }) => (
  <div className="return-chart-angularity">
    <h3>Angularity Analysis</h3>
    <div className="angularity-info">
      <div className="angular-planets">
        <h4>Angular Planets ({angularity.angularPlanets.length})</h4>
        <div className="planet-list">
          {angularity.angularPlanets.map((planet: string) => (
            <span key={planet} className="planet-tag">{planet}</span>
          ))}
        </div>
      </div>
      <div className="angularity-score">
        <h4>Angularity Score</h4>
        <div className="score-bar">
          <div
            className="score-fill"
            style={{ width: `${angularity.score * 100}%` }}
          ></div>
        </div>
        <span className="score-text">{Math.round(angularity.score * 100)}%</span>
      </div>
    </div>
  </div>
);

/**
 * Return Chart Summary Component
 */
const ReturnChartSummary: React.FC<{ chart: ReturnChart }> = ({ chart }) => (
  <div className="return-chart-summary">
    <div className="summary-item">
      <span className="label">Return Time:</span>
      <span className="value">{chart.returnTime.toLocaleDateString()}</span>
    </div>
    <div className="summary-item">
      <span className="label">Overall Rating:</span>
      <span className="value rating">{chart.interpretation.overall.rating}</span>
    </div>
    <div className="summary-item">
      <span className="label">Score:</span>
      <span className="value">{Math.round(chart.interpretation.overall.score * 100)}%</span>
    </div>
    <div className="summary-item">
      <span className="label">Angular Planets:</span>
      <span className="value">{chart.chart.angularity.angularPlanets.length}</span>
    </div>
  </div>
);

/**
 * Return Chart Validation Component
 */
const ReturnChartValidation: React.FC<{ validation: any }> = ({ validation }) => (
  <div className="return-chart-validation">
    <h3>Chart Validation</h3>
    <div className="validation-status">
      <div className={`status-indicator ${validation.isValid ? 'valid' : 'invalid'}`}>
        {validation.isValid ? '✓ Valid' : '✗ Review Required'}
      </div>
      <div className="accuracy">Accuracy: {validation.accuracy}</div>
    </div>

    <div className="validation-details">
      {Object.entries(validation.validations).map(([key, check]: [string, any]) => (
        <div key={key} className={`validation-item ${check.passed ? 'passed' : 'failed'}`}>
          <span className="check-name">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
          <span className="check-status">{check.passed ? '✓' : '✗'}</span>
          {check.error && <span className="check-error">{check.error}</span>}
        </div>
      ))}
    </div>
  </div>
);

/**
 * Helper function to get zodiac sign from longitude
 */
const getZodiacSign = (longitude: number): string => {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  const signIndex = Math.floor(longitude / 30) % 12;
  return signs[signIndex];
};

/**
 * Helper function to get aspect strength description
 */
const getAspectStrength = (strength: number): string => {
  if (strength >= 0.8) return 'Very Strong';
  if (strength >= 0.6) return 'Strong';
  if (strength >= 0.4) return 'Moderate';
  if (strength >= 0.2) return 'Weak';
  return 'Very Weak';
};

export default WesternReturnChartDisplay;