import React from 'react';
import { MeditationGuidelines } from '../types/astrology';

interface YantraMeditationGuideProps {
  guidelines: MeditationGuidelines;
}

/**
 * Yantra Meditation Guide Component
 * Provides step-by-step meditation instructions
 */
const YantraMeditationGuide: React.FC<YantraMeditationGuideProps> = ({ guidelines }) => {
  return (
    <div className="yantra-meditation-guide">
      <h2>Yantra Meditation Guide</h2>

      <div className="meditation-section">
        <h3>Preparation Steps</h3>
        {guidelines.preparation.map((step, index) => (
          <div key={index} className="meditation-step">
            <div className="step-number">{step.step}</div>
            <div className="step-content">
              <p>{step.instruction}</p>
              <small>{step.purpose}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="meditation-section">
        <h3>Daily Practice</h3>
        <p><strong>Duration:</strong> {guidelines.dailyPractice.duration.daily} minutes daily</p>
        <p><strong>Mantras:</strong> {guidelines.dailyPractice.mantras.join(', ')}</p>
      </div>

      <div className="meditation-section">
        <h3>Completion Ritual</h3>
        {guidelines.completion.map((step, index) => (
          <div key={index} className="meditation-step">
            <div className="step-number">{step.step}</div>
            <div className="step-content">
              <p>{step.instruction}</p>
              <small>{step.purpose}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YantraMeditationGuide;