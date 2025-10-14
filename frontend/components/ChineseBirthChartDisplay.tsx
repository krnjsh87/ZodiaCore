import React from 'react';
import { ChineseBirthChart, BaZiPillar } from '../types/astrology';
import './ChineseBirthChartDisplay.css';

interface ChineseBirthChartDisplayProps {
  chart: ChineseBirthChart;
  className?: string;
}

/**
 * Chinese Birth Chart Display Component
 * Displays the complete Chinese birth chart with Ba-Zi, Five Elements, and Nine Star Ki
 */
const ChineseBirthChartDisplay: React.FC<ChineseBirthChartDisplayProps> = ({
  chart,
  className = ''
}) => {
  const renderPillar = (pillar: BaZiPillar, label: string) => (
    <div className="chinese-pillar" key={label}>
      <div className="pillar-label">{label}</div>
      <div className="pillar-content">
        <div className="pillar-stem" data-element={pillar.element}>
          {pillar.stem.name}
        </div>
        <div className="pillar-branch" data-animal={pillar.animal}>
          {pillar.branch.name}
        </div>
      </div>
      <div className="pillar-info">
        <span className="element">{pillar.element}</span>
        <span className="animal">{pillar.animal}</span>
      </div>
    </div>
  );

  const renderElementBar = (element: string, count: number, maxCount: number) => {
    const percentage = (count / maxCount) * 100;
    return (
      <div className="element-bar" key={element}>
        <div className="element-label">{element}</div>
        <div className="bar-container">
          <div
            className={`bar-fill element-${element.toLowerCase()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="element-count">{count}</div>
      </div>
    );
  };

  const renderDirection = (direction: string, star: string) => (
    <div className="direction-item" key={direction}>
      <div className="direction-name">{direction}</div>
      <div className="direction-star">{star}</div>
    </div>
  );

  const maxElementCount = Math.max(...Object.values(chart.fiveElements.counts));

  return (
    <div className={`chinese-birth-chart ${className}`}>
      {/* Header */}
      <header className="chart-header">
        <h1>Chinese Birth Chart</h1>
        <div className="birth-info">
          <span>Birth Date: {chart.birthData.year}-{String(chart.birthData.month).padStart(2, '0')}-{String(chart.birthData.day).padStart(2, '0')}</span>
          <span>Time: {String(chart.birthData.hour).padStart(2, '0')}:{String(chart.birthData.minute).padStart(2, '0')}</span>
        </div>
      </header>

      {/* Ba-Zi Chart */}
      <section className="ba-zi-section">
        <h2>Four Pillars (Ba-Zi)</h2>
        <div className="pillars-grid">
          {renderPillar(chart.baZi.year, 'Year')}
          {renderPillar(chart.baZi.month, 'Month')}
          {renderPillar(chart.baZi.day, 'Day')}
          {renderPillar(chart.baZi.hour, 'Hour')}
        </div>
        <div className="lunar-info">
          <span>Lunar Year: {chart.baZi.lunarDate.lunarYear}</span>
          <span>Solar Term: {chart.baZi.lunarDate.solarTerm.name}</span>
        </div>
      </section>

      {/* Five Elements Analysis */}
      <section className="five-elements-section">
        <h2>Five Elements Balance</h2>
        <div className="elements-analysis">
          <div className="element-bars">
            {Object.entries(chart.fiveElements.counts).map(([element, count]) =>
              renderElementBar(element, count, maxElementCount)
            )}
          </div>
          <div className="elements-summary">
            <div className="summary-item">
              <strong>Strongest:</strong> {chart.fiveElements.strongest || 'Balanced'}
            </div>
            <div className="summary-item">
              <strong>Weakest:</strong> {chart.fiveElements.weakest || 'Balanced'}
            </div>
            <div className="summary-item">
              <strong>Balance:</strong> {chart.fiveElements.balance}
            </div>
          </div>
        </div>
      </section>

      {/* Nine Star Ki Analysis */}
      <section className="nine-star-ki-section">
        <h2>Nine Star Ki</h2>
        <div className="nine-star-info">
          <div className="star-item">
            <strong>Birth Star:</strong> {chart.nineStarKi.birthStar}
          </div>
          <div className="star-item">
            <strong>Current Star:</strong> {chart.nineStarKi.currentStar}
          </div>
        </div>
        <div className="directions-grid">
          {Object.entries(chart.nineStarKi.directions).map(([direction, star]) =>
            renderDirection(direction, star)
          )}
        </div>
      </section>

      {/* Interpretations */}
      <section className="interpretations-section">
        <h2>Interpretations</h2>

        <div className="interpretation-category">
          <h3>Personality</h3>
          <ul>
            {chart.interpretations.personality.map((trait, index) => (
              <li key={index}>{trait}</li>
            ))}
          </ul>
        </div>

        <div className="interpretation-category">
          <h3>Career</h3>
          <ul>
            {chart.interpretations.career.map((guidance, index) => (
              <li key={index}>{guidance}</li>
            ))}
          </ul>
        </div>

        <div className="interpretation-category">
          <h3>Relationships</h3>
          <ul>
            {chart.interpretations.relationships.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>

        <div className="interpretation-category">
          <h3>Health</h3>
          <ul>
            {chart.interpretations.health.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>

        <div className="interpretation-category">
          <h3>Lucky Elements</h3>
          <div className="lucky-items">
            <div className="lucky-elements">
              <strong>Elements:</strong>
              <div className="element-tags">
                {chart.interpretations.lucky.elements.map((element, index) => (
                  <span key={index} className={`element-tag element-${element.toLowerCase()}`}>
                    {element}
                  </span>
                ))}
              </div>
            </div>
            <div className="lucky-directions">
              <strong>Directions:</strong>
              <div className="direction-tags">
                {chart.interpretations.lucky.directions.map((direction, index) => (
                  <span key={index} className="direction-tag">{direction}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metadata */}
      <footer className="chart-footer">
        <div className="metadata">
          <span>Algorithm: {chart.metadata.calculationMethod}</span>
          <span>Version: {chart.metadata.algorithmVersion}</span>
          <span>Accuracy: {chart.metadata.accuracy}</span>
        </div>
        <div className="disclaimer">
          {chart.metadata.disclaimer}
        </div>
      </footer>
    </div>
  );
};

export default ChineseBirthChartDisplay;