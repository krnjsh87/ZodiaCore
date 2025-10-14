import React from 'react';

/**
 * Props for FiveElementsAnalysis component
 */
interface FiveElementsAnalysisProps {
  elements: {
    counts: Record<string, number>;
    strengths: Record<string, number>;
    relationships: Record<string, any>;
    balance: { level: string; range: number; variance: number; maxElement: string; minElement: string };
    harmony: number;
    strongest: string;
    weakest: string;
    analysis: { summary: string; recommendations: string[]; strengths: string[]; weaknesses: string[] };
  };
}

/**
 * Display component for Five Elements analysis
 * Shows elemental balance, relationships, and recommendations
 */
const FiveElementsAnalysis: React.FC<FiveElementsAnalysisProps> = ({ elements }) => {
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
   * Get element symbol
   */
  const getElementSymbol = (element: string) => {
    const symbols = {
      Wood: '🌳',
      Fire: '🔥',
      Earth: '🌍',
      Metal: '⚡',
      Water: '💧'
    };
    return symbols[element as keyof typeof symbols] || '❓';
  };

  /**
   * Render element strength bar
   */
  const renderStrengthBar = (element: string, strength: number) => {
    const percentage = Math.min((strength / 3) * 100, 100); // Assuming max strength of 3
    return (
      <div className="strength-bar">
        <div
          className="strength-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: getElementColor(element)
          }}
        />
        <span className="strength-value">{strength.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="five-elements-analysis">
      <div className="analysis-header">
        <h2>Five Elements Analysis</h2>
        <p>Understanding your elemental balance and relationships</p>
      </div>

      {/* Element Counts */}
      <div className="element-counts">
        <h3>Element Distribution</h3>
        <div className="elements-grid">
          {Object.entries(elements.counts).map(([element, count]) => (
            <div key={element} className="element-card" style={{ borderColor: getElementColor(element) }}>
              <div className="element-symbol">{getElementSymbol(element)}</div>
              <div className="element-name">{element}</div>
              <div className="element-count">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Element Strengths */}
      <div className="element-strengths">
        <h3>Element Strengths</h3>
        <div className="strengths-list">
          {Object.entries(elements.strengths).map(([element, strength]) => (
            <div key={element} className="strength-item">
              <div className="strength-label">
                <span className="element-symbol">{getElementSymbol(element)}</span>
                <span className="element-name">{element}</span>
              </div>
              {renderStrengthBar(element, strength)}
            </div>
          ))}
        </div>
      </div>

      {/* Balance Assessment */}
      <div className="balance-assessment">
        <h3>Elemental Balance</h3>
        <div className="balance-card">
          <div className="balance-level" data-level={elements.balance.level.toLowerCase()}>
            {elements.balance.level} Balance
          </div>
          <div className="balance-metrics">
            <div className="metric">
              <span className="label">Range:</span>
              <span className="value">{elements.balance.range}</span>
            </div>
            <div className="metric">
              <span className="label">Variance:</span>
              <span className="value">{elements.balance.variance.toFixed(2)}</span>
            </div>
            <div className="metric">
              <span className="label">Harmony:</span>
              <span className="value">{(elements.harmony * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div className="balance-summary">
            <p><strong>Strongest:</strong> {elements.strongest}</p>
            <p><strong>Weakest:</strong> {elements.weakest}</p>
          </div>
        </div>
      </div>

      {/* Elemental Relationships */}
      <div className="element-relationships">
        <h3>Element Relationships</h3>
        <div className="relationships-grid">
          {Object.entries(elements.relationships).map(([element, relations]) => (
            <div key={element} className="relationship-card">
              <h4 style={{ color: getElementColor(element) }}>{element}</h4>
              <div className="relationships">
                <div className="relationship">
                  <span className="type">Generates:</span>
                  <span className="element">{relations.generates}</span>
                </div>
                <div className="relationship">
                  <span className="type">Controls:</span>
                  <span className="element">{relations.controls}</span>
                </div>
                <div className="relationship">
                  <span className="type">Generated by:</span>
                  <span className="element">{relations.generatedBy}</span>
                </div>
                <div className="relationship">
                  <span className="type">Controlled by:</span>
                  <span className="element">{relations.controlledBy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis and Recommendations */}
      <div className="analysis-section">
        <h3>Analysis & Recommendations</h3>

        <div className="analysis-summary">
          <h4>Summary</h4>
          <p>{elements.analysis.summary}</p>
        </div>

        <div className="analysis-strengths">
          <h4>Strengths</h4>
          <ul>
            {elements.analysis.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-weaknesses">
          <h4>Areas for Attention</h4>
          <ul>
            {elements.analysis.weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-recommendations">
          <h4>Recommendations</h4>
          <ul>
            {elements.analysis.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FiveElementsAnalysis;