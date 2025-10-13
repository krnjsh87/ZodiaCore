import React, { useState } from 'react';
import { ZC119RemedyPrescription } from '../types/astrology';
import './RemediesDisplay.css';
import './RemediesDisplay.css';

interface RemediesDisplayProps {
  prescription: ZC119RemedyPrescription;
}

const RemediesDisplay: React.FC<RemediesDisplayProps> = ({ prescription }) => {
  const [activeTab, setActiveTab] = useState<'afflictions' | 'remedies' | 'timing' | 'implementation'>('afflictions');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'SEVERE': return '#dc3545';
      case 'MODERATE': return '#fd7e14';
      case 'MILD': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'SEVERE': return '🚨';
      case 'MODERATE': return '⚠️';
      case 'MILD': return 'ℹ️';
      default: return '✅';
    }
  };

  const renderAfflictions = () => (
    <div className="afflictions-section">
      <h3>Planetary Afflictions Analysis</h3>
      <div className="afflictions-grid">
        {Object.entries(prescription.afflictions).map(([planet, affliction]) => (
          <div
            key={planet}
            className={`affliction-card ${affliction.severity.toLowerCase()}`}
            onClick={() => setSelectedPlanet(selectedPlanet === planet ? null : planet)}
          >
            <div className="affliction-header">
              <h4>{planet}</h4>
              <span
                className="severity-badge"
                style={{ backgroundColor: getSeverityColor(affliction.severity) }}
              >
                {getSeverityIcon(affliction.severity)} {affliction.severity}
              </span>
            </div>
            <div className="affliction-score">
              Affliction Score: {(affliction.score * 100).toFixed(1)}%
            </div>
            {selectedPlanet === planet && (
              <div className="affliction-details">
                <div className="detail-section">
                  <h5>Primary Issues</h5>
                  <ul>
                    {affliction.primaryIssues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
                <div className="detail-section">
                  <h5>House Placement</h5>
                  <p>House {affliction.house.house}: {affliction.house.significance}</p>
                </div>
                <div className="detail-section">
                  <h5>Dignity</h5>
                  <p>{affliction.dignity.dignity} (Score: {affliction.dignity.score.toFixed(2)})</p>
                </div>
                {affliction.aspects.length > 0 && (
                  <div className="detail-section">
                    <h5>Malefic Aspects</h5>
                    <ul>
                      {affliction.aspects.map((aspect, idx) => (
                        <li key={idx}>{aspect.planet} - {aspect.aspect} ({aspect.orb.toFixed(1)}°)</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderRemedies = () => (
    <div className="remedies-section">
      <h3>Personalized Remedies</h3>
      <div className="remedies-tabs">
        {Object.keys(prescription.remedies).map(planet => (
          <button
            key={planet}
            className={`remedy-tab ${selectedPlanet === planet ? 'active' : ''}`}
            onClick={() => setSelectedPlanet(selectedPlanet === planet ? null : planet)}
          >
            {planet} Remedies
          </button>
        ))}
      </div>

      {selectedPlanet && prescription.remedies[selectedPlanet] && (
        <div className="planet-remedies">
          <h4>{selectedPlanet} Remedies</h4>
          {renderRemedyCategory('Mantras', prescription.remedies[selectedPlanet].mantras)}
          {renderRemedyCategory('Poojas', prescription.remedies[selectedPlanet].poojas)}
          {renderRemedyCategory('Gemstones', prescription.remedies[selectedPlanet].gemstones)}
          {renderRemedyCategory('Yantras', prescription.remedies[selectedPlanet].yantras)}
          {renderRemedyCategory('Charities', prescription.remedies[selectedPlanet].charities)}
        </div>
      )}
    </div>
  );

  const renderRemedyCategory = (category: string, items: any[]) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="remedy-category">
        <h5>{category}</h5>
        <div className="remedy-items">
          {items.map((item, index) => (
            <div key={index} className="remedy-item">
              {renderRemedyItem(category, item)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRemedyItem = (category: string, item: any) => {
    switch (category) {
      case 'Mantras':
        return (
          <div className="mantra-item">
            <h6>{item.mantra}</h6>
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Repetitions:</strong> {item.repetitions}</p>
            <p><strong>Timing:</strong> {item.timing}</p>
            <p><strong>Duration:</strong> {item.duration}</p>
            <p><strong>Deity:</strong> {item.deity}</p>
            <details>
              <summary>Procedure</summary>
              <div className="procedure">
                <h6>Preparation:</h6>
                <ul>{item.procedure.preparation.map((step: string, idx: number) => <li key={idx}>{step}</li>)}</ul>
                <h6>Chanting:</h6>
                <ul>{item.procedure.chanting.map((step: string, idx: number) => <li key={idx}>{step}</li>)}</ul>
                <h6>Completion:</h6>
                <ul>{item.procedure.completion.map((step: string, idx: number) => <li key={idx}>{step}</li>)}</ul>
              </div>
            </details>
          </div>
        );

      case 'Poojas':
        return (
          <div className="pooja-item">
            <h6>{item.name}</h6>
            <p><strong>Duration:</strong> {item.duration}</p>
            <p><strong>Frequency:</strong> {item.frequency}</p>
            <p><strong>Cost Estimate:</strong> ₹{item.cost_estimate}</p>
            <details>
              <summary>Materials Needed</summary>
              <ul>{item.materials.map((material: string, idx: number) => <li key={idx}>{material}</li>)}</ul>
            </details>
            <details>
              <summary>Procedure</summary>
              <ol>{item.procedure.map((step: string, idx: number) => <li key={idx}>{step}</li>)}</ol>
            </details>
            <details>
              <summary>Benefits</summary>
              <ul>{item.benefits.map((benefit: string, idx: number) => <li key={idx}>{benefit}</li>)}</ul>
            </details>
          </div>
        );

      case 'Gemstones':
        return (
          <div className="gemstone-item">
            <h6>{item.primary.name}</h6>
            <p><strong>Weight:</strong> {item.primary.weight}</p>
            <p><strong>Metal:</strong> {item.primary.metal}</p>
            <p><strong>Wearing Day:</strong> {item.primary.wearing_day}</p>
            <p><strong>Cost Estimate:</strong> ₹{item.cost_estimate}</p>
            <details>
              <summary>Wearing Instructions</summary>
              <div className="instructions">
                <h6>Preparation:</h6>
                <ul>{item.wearing_instructions.preparation.map((step: string, idx: number) => <li key={idx}>{step}</li>)}</ul>
                <h6>Daily Care:</h6>
                <ul>{item.wearing_instructions.daily_care.map((step: string, idx: number) => <li key={idx}>{step}</li>)}</ul>
                <h6>Special Care:</h6>
                <ul>{item.wearing_instructions.special_care.map((step: string, idx: number) => <li key={idx}>{step}</li>)}</ul>
              </div>
            </details>
          </div>
        );

      case 'Yantras':
        return (
          <div className="yantra-item">
            <h6>{item.name}</h6>
            <p><strong>Material:</strong> {item.material}</p>
            <p><strong>Size:</strong> {item.size}</p>
            <p><strong>Cost:</strong> ₹{item.cost}</p>
            <details>
              <summary>Installation</summary>
              <p>{item.installation}</p>
            </details>
            <details>
              <summary>Energization</summary>
              <p>{item.energization}</p>
            </details>
          </div>
        );

      case 'Charities':
        return (
          <div className="charity-item">
            <h6>{item.type}</h6>
            <p><strong>Items:</strong> {item.items.join(', ')}</p>
            <p><strong>Recipients:</strong> {item.recipients}</p>
            <p><strong>Timing:</strong> {item.timing}</p>
            <p><strong>Benefits:</strong> {item.benefits}</p>
          </div>
        );

      default:
        return <div>Unknown remedy type</div>;
    }
  };

  const renderTiming = () => (
    <div className="timing-section">
      <h3>Auspicious Timing</h3>
      <div className="timing-info">
        <div className="overall-period">
          <h4>Overall Auspicious Period</h4>
          <p><strong>Start:</strong> {prescription.timing.overall_auspicious_period.start.toLocaleDateString()}</p>
          <p><strong>End:</strong> {prescription.timing.overall_auspicious_period.end.toLocaleDateString()}</p>
          <p><strong>Quality:</strong> {prescription.timing.overall_auspicious_period.quality}</p>
          <p><strong>Significance:</strong> {prescription.timing.overall_auspicious_period.significance}</p>
        </div>

        <div className="lunar-phases">
          <h4>Favorable Lunar Phases</h4>
          {prescription.timing.lunar_phases.map((phase, idx) => (
            <div key={idx} className="lunar-phase">
              <h5>{phase.phase}</h5>
              <p><strong>Suitability:</strong> {phase.suitability}</p>
              <p><strong>Dates:</strong> {phase.dates.map(date => date.toLocaleDateString()).join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderImplementation = () => (
    <div className="implementation-section">
      <h3>Implementation Plan</h3>
      <div className="implementation-summary">
        <div className="summary-item">
          <strong>Total Duration:</strong> {prescription.duration}
        </div>
        <div className="summary-item">
          <strong>Estimated Cost:</strong> ₹{prescription.cost_estimate.toLocaleString()}
        </div>
      </div>

      <div className="implementation-phases">
        <h4>Implementation Phases</h4>
        {prescription.implementation_plan.phases.map((phase, idx) => (
          <div key={idx} className="phase">
            <h5>{phase.name}</h5>
            <p><strong>Duration:</strong> {phase.duration}</p>
            <ul>
              {phase.activities.map((activity, actIdx) => (
                <li key={actIdx}>{activity}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="monitoring">
        <h4>Monitoring & Success Metrics</h4>
        <p><strong>Monitoring Frequency:</strong> {prescription.implementation_plan.monitoring.frequency}</p>
        <p><strong>Methods:</strong> {prescription.implementation_plan.monitoring.methods.join(', ')}</p>
        <p><strong>Adjustments:</strong> {prescription.implementation_plan.monitoring.adjustments}</p>

        <h5>Success Metrics</h5>
        <ul>
          {prescription.implementation_plan.success_metrics.map((metric, idx) => (
            <li key={idx}>{metric}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="remedies-display">
      <header className="remedies-header">
        <h2>ZC1.19 Personalized Remedy Prescription</h2>
        <p className="timestamp">Generated on {prescription.timestamp.toLocaleDateString()}</p>
      </header>

      <nav className="remedies-navigation">
        <button
          className={activeTab === 'afflictions' ? 'active' : ''}
          onClick={() => setActiveTab('afflictions')}
        >
          Planetary Afflictions
        </button>
        <button
          className={activeTab === 'remedies' ? 'active' : ''}
          onClick={() => setActiveTab('remedies')}
        >
          Remedies
        </button>
        <button
          className={activeTab === 'timing' ? 'active' : ''}
          onClick={() => setActiveTab('timing')}
        >
          Auspicious Timing
        </button>
        <button
          className={activeTab === 'implementation' ? 'active' : ''}
          onClick={() => setActiveTab('implementation')}
        >
          Implementation Plan
        </button>
      </nav>

      <main className="remedies-content">
        {activeTab === 'afflictions' && renderAfflictions()}
        {activeTab === 'remedies' && renderRemedies()}
        {activeTab === 'timing' && renderTiming()}
        {activeTab === 'implementation' && renderImplementation()}
      </main>
    </div>
  );
};

export default RemediesDisplay;