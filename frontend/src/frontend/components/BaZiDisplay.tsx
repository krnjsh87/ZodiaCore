import React from 'react';

/**
 * Props for BaZiDisplay component
 */
interface BaZiDisplayProps {
  baZi: {
    year: { stem: string; branch: string; element: string; polarity: string; animal: string; direction: number };
    month: { stem: string; branch: string; element: string; polarity: string; animal: string; direction: number; solarTerm: string };
    day: { stem: string; branch: string; element: string; polarity: string; animal: string; direction: number; julianDay: number };
    hour: { stem: string; branch: string; element: string; polarity: string; animal: string; direction: number; doubleHour: number; timeRange: string };
    calculationMetadata: { precision: number; algorithm: string; version: string };
  };
}

/**
 * Display component for Ba-Zi (Four Pillars) calculations
 * Shows the stem-branch combinations for each pillar
 */
const BaZiDisplay: React.FC<BaZiDisplayProps> = ({ baZi }) => {
  /**
   * Get element color for styling
   */
  const getElementColor = (element: string) => {
    const colors = {
      Wood: '#4CAF50',
      Fire: '#F44336',
      Earth: '#FF9800',
      Metal: '#9E9E9E',
      Water: '#2196F3'
    };
    return colors[element as keyof typeof colors] || '#666';
  };

  /**
   * Get polarity symbol
   */
  const getPolaritySymbol = (polarity: string) => {
    return polarity === 'Yang' ? '☯️' : '⚫';
  };

  /**
   * Render a single pillar
   */
  const renderPillar = (title: string, pillar: any, additionalInfo?: string) => (
    <div className="pillar-card">
      <h3 className="pillar-title">{title}</h3>

      <div className="pillar-content">
        <div className="stem-branch">
          <div className="stem" style={{ borderColor: getElementColor(pillar.element) }}>
            <div className="stem-text">{pillar.stem}</div>
            <div className="stem-info">
              <span className="element" style={{ color: getElementColor(pillar.element) }}>
                {pillar.element}
              </span>
              <span className="polarity">{getPolaritySymbol(pillar.polarity)}</span>
            </div>
          </div>

          <div className="branch" style={{ borderColor: getElementColor(pillar.element) }}>
            <div className="branch-text">{pillar.branch}</div>
            <div className="branch-info">
              <span className="animal">{pillar.animal}</span>
              <span className="direction">{pillar.direction}°</span>
            </div>
          </div>
        </div>

        {additionalInfo && (
          <div className="pillar-extra">
            {additionalInfo}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bazi-display">
      <div className="bazi-header">
        <h2>Ba-Zi Four Pillars</h2>
        <p>Your Four Pillars of Destiny calculated using advanced astronomical algorithms</p>
      </div>

      <div className="pillars-grid">
        {renderPillar('Year Pillar', baZi.year)}
        {renderPillar('Month Pillar', baZi.month, `Solar Term: ${baZi.month.solarTerm}`)}
        {renderPillar('Day Pillar', baZi.day, `JD: ${baZi.day.julianDay.toFixed(2)}`)}
        {renderPillar('Hour Pillar', baZi.hour, `Time: ${baZi.hour.timeRange}`)}
      </div>

      <div className="calculation-info">
        <h3>Calculation Details</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Algorithm:</span>
            <span className="value">{baZi.calculationMetadata.algorithm}</span>
          </div>
          <div className="info-item">
            <span className="label">Precision:</span>
            <span className="value">{baZi.calculationMetadata.precision}</span>
          </div>
          <div className="info-item">
            <span className="label">Version:</span>
            <span className="value">{baZi.calculationMetadata.version}</span>
          </div>
        </div>
      </div>

      <div className="bazi-explanation">
        <h3>Understanding Your Ba-Zi</h3>
        <div className="explanation-content">
          <p>
            <strong>Heavenly Stems</strong> represent the energy quality and elemental nature of each pillar.
            They show the Yin/Yang balance and elemental influences.
          </p>
          <p>
            <strong>Earthly Branches</strong> represent the animal signs and directional influences.
            They indicate the physical manifestation and timing aspects.
          </p>
          <p>
            Each pillar corresponds to different life aspects:
          </p>
          <ul>
            <li><strong>Year:</strong> Overall life foundation and ancestral influences</li>
            <li><strong>Month:</strong> Personal development and environmental factors</li>
            <li><strong>Day:</strong> Individual personality and life purpose</li>
            <li><strong>Hour:</strong> Career and later life developments</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BaZiDisplay;