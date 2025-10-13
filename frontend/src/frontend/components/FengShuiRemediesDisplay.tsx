import React, { useState } from 'react';
import { FengShuiGuidance } from '../types/astrology';
import './FengShuiRemediesDisplay.css';

/**
 * Props for FengShuiRemediesDisplay component
 */
interface FengShuiRemediesDisplayProps {
  guidance: FengShuiGuidance;
}

/**
 * Display component for Feng Shui analysis results and remedies
 */
const FengShuiRemediesDisplay: React.FC<FengShuiRemediesDisplayProps> = ({
  guidance
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bagua' | 'elements' | 'flying-stars' | 'remedies' | 'implementation'>('overview');

  /**
   * Get element color
   */
  const getElementColor = (element: string): string => {
    const colors: Record<string, string> = {
      Wood: '#4CAF50',
      Fire: '#F44336',
      Earth: '#FF9800',
      Metal: '#9C27B0',
      Water: '#2196F3'
    };
    return colors[element] || '#666';
  };

  /**
   * Get priority color
   */
  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      Critical: '#F44336',
      High: '#FF9800',
      Medium: '#2196F3',
      Low: '#4CAF50'
    };
    return colors[priority] || '#666';
  };

  /**
   * Get energy level color
   */
  const getEnergyColor = (level: number): string => {
    if (level >= 0.8) return '#4CAF50';
    if (level >= 0.6) return '#FF9800';
    if (level >= 0.4) return '#2196F3';
    return '#F44336';
  };

  /**
   * Render overview tab
   */
  const renderOverview = () => (
    <div className="overview-section">
      <div className="overview-cards">
        <div className="overview-card">
          <h3>Overall Score</h3>
          <div className="score-display">
            <div
              className="score-circle"
              style={{
                background: `conic-gradient(${getEnergyColor(guidance.analysis.overall.score / 10)} ${guidance.analysis.overall.score * 36}deg, #eee 0deg)`
              }}
            >
              <span className="score-number">{guidance.analysis.overall.score.toFixed(1)}</span>
              <span className="score-label">/10</span>
            </div>
          </div>
          <p className="score-rating">{guidance.analysis.overall.rating}</p>
        </div>

        <div className="overview-card">
          <h3>Elemental Balance</h3>
          <div className="elemental-balance">
            {Object.entries(guidance.analysis.elemental.counts).map(([element, count]) => (
              <div key={element} className="element-item">
                <span
                  className="element-dot"
                  style={{ backgroundColor: getElementColor(element) }}
                ></span>
                <span className="element-name">{element}</span>
                <span className="element-count">{count}</span>
              </div>
            ))}
          </div>
          <p className="harmony-score">
            Harmony: {guidance.analysis.elemental.harmonyScore.toFixed(1)}/10
          </p>
        </div>

        <div className="overview-card">
          <h3>Flying Stars</h3>
          <div className="flying-stars-summary">
            <div className="star-item">
              <span className="star-label">Mountain:</span>
              <span className="star-number">{guidance.analysis.flyingStars.annual.mountainStar}</span>
            </div>
            <div className="star-item">
              <span className="star-label">Water:</span>
              <span className="star-number">{guidance.analysis.flyingStars.annual.waterStar}</span>
            </div>
            <div className="star-item">
              <span className="star-label">Rating:</span>
              <span className="star-rating">{guidance.analysis.flyingStars.overallRating.toFixed(1)}/1</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overview-summary">
        <h3>Analysis Summary</h3>
        <p>{guidance.analysis.overall.summary}</p>

        <div className="summary-sections">
          <div className="summary-section">
            <h4>Key Issues</h4>
            <ul>
              {guidance.analysis.overall.keyIssues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>

          <div className="summary-section">
            <h4>Strengths</h4>
            <ul>
              {guidance.analysis.overall.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="summary-section">
            <h4>Opportunities</h4>
            <ul>
              {guidance.analysis.overall.opportunities.map((opportunity, index) => (
                <li key={index}>{opportunity}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Render Bagua analysis tab
   */
  const renderBagua = () => (
    <div className="bagua-section">
      <div className="bagua-grid">
        {Object.entries(guidance.analysis.bagua).map(([areaName, areaData]) => (
          <div key={areaName} className="bagua-area-card">
            <div className="bagua-header">
              <h3>{areaData.chinese} - {areaName}</h3>
              <span
                className="element-badge"
                style={{ backgroundColor: getElementColor(areaData.element) }}
              >
                {areaData.element}
              </span>
            </div>

            <div className="bagua-aspect">
              <strong>{areaData.aspect}</strong>
            </div>

            <div className="energy-level">
              <span className="energy-label">Energy Level:</span>
              <div className="energy-bar">
                <div
                  className="energy-fill"
                  style={{
                    width: `${areaData.energyLevel * 100}%`,
                    backgroundColor: getEnergyColor(areaData.energyLevel)
                  }}
                ></div>
              </div>
              <span className="energy-value">{(areaData.energyLevel * 100).toFixed(0)}%</span>
            </div>

            {areaData.issues.length > 0 && (
              <div className="issues-section">
                <h4>Issues:</h4>
                <ul>
                  {areaData.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {areaData.remedies.length > 0 && (
              <div className="remedies-section">
                <h4>Remedies:</h4>
                <ul>
                  {areaData.remedies.map((remedy, index) => (
                    <li key={index}>{remedy}</li>
                  ))}
                </ul>
              </div>
            )}

            {areaData.recommendations.length > 0 && (
              <div className="recommendations-section">
                <h4>Recommendations:</h4>
                {areaData.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    <span
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(rec.priority) }}
                    >
                      {rec.priority}
                    </span>
                    <p>{rec.description}</p>
                    <ul>
                      {rec.remedies.map((remedy, rIndex) => (
                        <li key={rIndex}>{remedy}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  /**
   * Render elements analysis tab
   */
  const renderElements = () => (
    <div className="elements-section">
      <div className="elemental-overview">
        <h3>Elemental Distribution</h3>
        <div className="elemental-chart">
          {Object.entries(guidance.analysis.elemental.counts).map(([element, count]) => (
            <div key={element} className="elemental-bar">
              <div className="elemental-label">
                <span
                  className="element-dot"
                  style={{ backgroundColor: getElementColor(element) }}
                ></span>
                <span>{element}</span>
              </div>
              <div className="elemental-bar-container">
                <div
                  className="elemental-bar-fill"
                  style={{
                    width: `${(count / 9) * 100}%`,
                    backgroundColor: getElementColor(element)
                  }}
                ></div>
              </div>
              <span className="elemental-count">{count}</span>
            </div>
          ))}
        </div>

        <div className="elemental-balance-info">
          <p><strong>Balance:</strong> {guidance.analysis.elemental.balance}</p>
          <p><strong>Strongest:</strong> {guidance.analysis.elemental.strongest || 'None'}</p>
          <p><strong>Weakest:</strong> {guidance.analysis.elemental.weakest || 'None'}</p>
          <p><strong>Harmony Score:</strong> {guidance.analysis.elemental.harmonyScore.toFixed(1)}/10</p>
        </div>
      </div>

      {guidance.analysis.elemental.imbalances.length > 0 && (
        <div className="imbalances-section">
          <h3>Elemental Imbalances</h3>
          {guidance.analysis.elemental.imbalances.map((imbalance, index) => (
            <div key={index} className="imbalance-item">
              <div className="imbalance-header">
                <span
                  className="element-badge"
                  style={{ backgroundColor: getElementColor(imbalance.element) }}
                >
                  {imbalance.element}
                </span>
                <span className="severity-badge">{imbalance.severity}</span>
              </div>
              <p>{imbalance.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="elemental-relationships">
        <h3>Elemental Relationships</h3>
        <div className="relationships-grid">
          {Object.entries(guidance.analysis.elemental.relationships).map(([element, relations]) => (
            <div key={element} className="relationship-card">
              <h4 style={{ color: getElementColor(element) }}>{element}</h4>
              <div className="relationship-details">
                <p><strong>Generates:</strong> <span style={{ color: getElementColor(relations.generates) }}>{relations.generates}</span></p>
                <p><strong>Controlled by:</strong> <span style={{ color: getElementColor(relations.controlledBy) }}>{relations.controlledBy}</span></p>
                <p><strong>Controls:</strong> <span style={{ color: getElementColor(relations.controls) }}>{relations.controls}</span></p>
                <p><strong>Generated by:</strong> <span style={{ color: getElementColor(relations.generatedBy) }}>{relations.generatedBy}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /**
   * Render Flying Stars analysis tab
   */
  const renderFlyingStars = () => (
    <div className="flying-stars-section">
      <div className="flying-stars-overview">
        <h3>Annual Flying Stars</h3>
        <div className="stars-display">
          <div className="star-card">
            <h4>Mountain Star</h4>
            <div className="star-number">{guidance.analysis.flyingStars.annual.mountainStar}</div>
            <div className="star-influences">
              {guidance.analysis.flyingStars.annual.influences.map((influence, index) => (
                <span key={index} className="influence-tag">{influence}</span>
              ))}
            </div>
          </div>

          <div className="star-card">
            <h4>Water Star</h4>
            <div className="star-number">{guidance.analysis.flyingStars.annual.waterStar}</div>
            <div className="star-influences">
              {guidance.analysis.flyingStars.annual.influences.map((influence, index) => (
                <span key={index} className="influence-tag">{influence}</span>
              ))}
            </div>
          </div>

          <div className="rating-card">
            <h4>Overall Rating</h4>
            <div className="rating-score">{guidance.analysis.flyingStars.annual.rating.toFixed(1)}/1</div>
            <div className="rating-bar">
              <div
                className="rating-fill"
                style={{ width: `${guidance.analysis.flyingStars.annual.rating * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {guidance.analysis.flyingStars.recommendations.length > 0 && (
        <div className="flying-stars-remedies">
          <h3>Flying Stars Remedies</h3>
          {guidance.analysis.flyingStars.recommendations.map((rec, index) => (
            <div key={index} className="remedy-card">
              <div className="remedy-header">
                <h4>{rec.type}</h4>
                <div className="remedy-meta">
                  <span className="star-info">Star {rec.star}</span>
                  <span className="timeframe">{rec.timeframe}</span>
                  <span
                    className="urgency-badge"
                    style={{ backgroundColor: getPriorityColor(rec.urgency) }}
                  >
                    {rec.urgency}
                  </span>
                </div>
              </div>
              <p className="remedy-description">{rec.description}</p>
              <div className="remedy-details">
                <h5>Remedies:</h5>
                <ul>
                  {rec.remedies.map((remedy, rIndex) => (
                    <li key={rIndex}>{remedy}</li>
                  ))}
                </ul>
                <div className="effectiveness">
                  Effectiveness: {(rec.effectiveness * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /**
   * Render remedies tab
   */
  const renderRemedies = () => (
    <div className="remedies-section">
      <div className="remedies-header">
        <h3>Recommended Remedies</h3>
        <p className="remedies-count">
          {guidance.remedies.length} remedies prioritized by effectiveness
        </p>
      </div>

      <div className="remedies-list">
        {guidance.remedies.map((remedy, index) => (
          <div key={remedy.id} className="remedy-card">
            <div className="remedy-header">
              <div className="remedy-title">
                <h4>{remedy.type}</h4>
                {remedy.element && (
                  <span
                    className="element-badge"
                    style={{ backgroundColor: getElementColor(remedy.element) }}
                  >
                    {remedy.element}
                  </span>
                )}
              </div>
              <div className="remedy-priority">
                <span
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(remedy.priority) }}
                >
                  {remedy.priority}
                </span>
              </div>
            </div>

            <p className="remedy-description">{remedy.description}</p>

            <div className="remedy-items">
              <h5>Implementation:</h5>
              {remedy.items.map((item, itemIndex) => (
                <div key={itemIndex} className="remedy-item">
                  <div className="item-type">{item.type}:</div>
                  <div className="item-details">
                    <strong>{item.item}</strong>
                    <br />
                    <em>Placement: {item.placement}</em>
                    {item.cost && <span className="cost-info">Cost: ${item.cost}</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="remedy-implementation">
              <div className="implementation-details">
                <span>Effectiveness: {(remedy.effectiveness * 100).toFixed(0)}%</span>
                <span>Time Required: {remedy.implementation.timeRequired}</span>
                <span>Difficulty: {remedy.implementation.difficulty}</span>
                <span>Total Cost: ${remedy.implementation.cost}</span>
              </div>
              <div className="effect-timeline">
                <div className={`effect-item ${remedy.implementation.immediateEffect ? 'active' : ''}`}>
                  Immediate
                </div>
                <div className={`effect-item ${remedy.implementation.shortTermEffect ? 'active' : ''}`}>
                  Short-term
                </div>
                <div className={`effect-item ${remedy.implementation.longTermEffect ? 'active' : ''}`}>
                  Long-term
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /**
   * Render implementation plan tab
   */
  const renderImplementation = () => (
    <div className="implementation-section">
      <div className="implementation-overview">
        <h3>Implementation Plan</h3>
        <div className="plan-summary">
          <div className="summary-stat">
            <span className="stat-number">{guidance.guidance.implementationPlan.phases.length}</span>
            <span className="stat-label">Phases</span>
          </div>
          <div className="summary-stat">
            <span className="stat-number">${guidance.guidance.implementationPlan.resources.totalCost}</span>
            <span className="stat-label">Total Cost</span>
          </div>
          <div className="summary-stat">
            <span className="stat-number">
              {Math.ceil((guidance.guidance.implementationPlan.timeline.endDate.getTime() -
                         guidance.guidance.implementationPlan.timeline.startDate.getTime()) /
                        (1000 * 60 * 60 * 24))}
            </span>
            <span className="stat-label">Days</span>
          </div>
        </div>
      </div>

      <div className="phases-timeline">
        {guidance.guidance.implementationPlan.phases.map((phase, index) => (
          <div key={index} className="phase-card">
            <div className="phase-header">
              <h4>{phase.name}</h4>
              <div className="phase-meta">
                <span className="phase-duration">{phase.duration}</span>
                <span className="phase-cost">${phase.estimatedCost}</span>
              </div>
            </div>
            <p className="phase-description">{phase.description}</p>
            <div className="phase-remedies">
              <h5>Remedies ({phase.remedies.length}):</h5>
              <ul>
                {phase.remedies.map((remedy, rIndex) => (
                  <li key={rIndex}>{remedy.type}: {remedy.description}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="resources-section">
        <h3>Resources Required</h3>
        <div className="resources-grid">
          <div className="resource-category">
            <h4>Materials</h4>
            <ul>
              {guidance.guidance.implementationPlan.resources.materials.map((material, index) => (
                <li key={index}>
                  {material.item} (x{material.quantity}) - ${material.cost}
                </li>
              ))}
            </ul>
          </div>

          <div className="resource-category">
            <h4>Tools</h4>
            <ul>
              {guidance.guidance.implementationPlan.resources.tools.map((tool, index) => (
                <li key={index}>{tool}</li>
              ))}
            </ul>
          </div>

          <div className="resource-category">
            <h4>Expertise</h4>
            <ul>
              {guidance.guidance.implementationPlan.resources.expertise.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="maintenance-section">
        <h3>Maintenance Schedule</h3>
        <div className="maintenance-grid">
          <div className="maintenance-category">
            <h4>Daily</h4>
            <ul>
              {guidance.guidance.maintenanceSchedule.daily.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>

          <div className="maintenance-category">
            <h4>Weekly</h4>
            <ul>
              {guidance.guidance.maintenanceSchedule.weekly.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>

          <div className="maintenance-category">
            <h4>Monthly</h4>
            <ul>
              {guidance.guidance.maintenanceSchedule.monthly.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>

          <div className="maintenance-category">
            <h4>Seasonal</h4>
            {Object.entries(guidance.guidance.maintenanceSchedule.seasonal).map(([season, tasks]) => (
              <div key={season}>
                <h5>{season.charAt(0).toUpperCase() + season.slice(1)}</h5>
                <ul>
                  {tasks.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="expected-outcomes">
        <h3>Expected Outcomes</h3>
        <div className="outcomes-timeline">
          <div className="outcome-phase">
            <h4>Immediate (1-4 weeks)</h4>
            <ul>
              {guidance.guidance.expectedOutcomes.immediate.effects.map((effect, index) => (
                <li key={index}>
                  <strong>{effect.area}:</strong> {effect.effect}
                  <span className="confidence">({(effect.confidence * 100).toFixed(0)}% confidence)</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="outcome-phase">
            <h4>Short-term (1-3 months)</h4>
            <ul>
              {guidance.guidance.expectedOutcomes.shortTerm.effects.map((effect, index) => (
                <li key={index}>
                  <strong>{effect.area}:</strong> {effect.effect}
                  <span className="confidence">({(effect.confidence * 100).toFixed(0)}% confidence)</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="outcome-phase">
            <h4>Long-term (3-12 months)</h4>
            <ul>
              {guidance.guidance.expectedOutcomes.longTerm.effects.map((effect, index) => (
                <li key={index}>
                  <strong>{effect.area}:</strong> {effect.effect}
                  <span className="confidence">({(effect.confidence * 100).toFixed(0)}% confidence)</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="overall-outcome">
          <h4>Overall Assessment</h4>
          <p><strong>Confidence:</strong> {(guidance.guidance.expectedOutcomes.overall.confidence * 100).toFixed(0)}%</p>
          <p>{guidance.guidance.expectedOutcomes.overall.summary}</p>
          <p className="disclaimer">{guidance.guidance.expectedOutcomes.overall.disclaimer}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="feng-shui-display">
      <div className="display-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'bagua' ? 'active' : ''}`}
          onClick={() => setActiveTab('bagua')}
        >
          Bagua Map
        </button>
        <button
          className={`tab-button ${activeTab === 'elements' ? 'active' : ''}`}
          onClick={() => setActiveTab('elements')}
        >
          Elements
        </button>
        <button
          className={`tab-button ${activeTab === 'flying-stars' ? 'active' : ''}`}
          onClick={() => setActiveTab('flying-stars')}
        >
          Flying Stars
        </button>
        <button
          className={`tab-button ${activeTab === 'remedies' ? 'active' : ''}`}
          onClick={() => setActiveTab('remedies')}
        >
          Remedies
        </button>
        <button
          className={`tab-button ${activeTab === 'implementation' ? 'active' : ''}`}
          onClick={() => setActiveTab('implementation')}
        >
          Implementation
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'bagua' && renderBagua()}
        {activeTab === 'elements' && renderElements()}
        {activeTab === 'flying-stars' && renderFlyingStars()}
        {activeTab === 'remedies' && renderRemedies()}
        {activeTab === 'implementation' && renderImplementation()}
      </div>

      <div className="metadata-section">
        <div className="metadata-item">
          <span className="metadata-label">Analysis Date:</span>
          <span className="metadata-value">{new Date(guidance.generatedAt).toLocaleDateString()}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Version:</span>
          <span className="metadata-value">{guidance.version}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Method:</span>
          <span className="metadata-value">{guidance.metadata.calculationMethod}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Accuracy:</span>
          <span className="metadata-value">{guidance.metadata.accuracy}</span>
        </div>
      </div>

      <div className="cultural-notes">
        <h4>Cultural and Ethical Notes</h4>
        <ul>
          {guidance.metadata.culturalNotes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
        <ul>
          {guidance.metadata.ethicalConsiderations.map((consideration, index) => (
            <li key={index}>{consideration}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FengShuiRemediesDisplay;