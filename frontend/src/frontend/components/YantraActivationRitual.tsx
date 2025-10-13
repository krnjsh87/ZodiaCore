import React from 'react';
import { ActivationRitual, YantraPackage } from '../types/astrology';

interface YantraActivationRitualProps {
  ritual: ActivationRitual;
  yantraPackage: YantraPackage;
}

/**
 * Yantra Activation Ritual Component
 * Guides users through Yantra activation process
 */
const YantraActivationRitual: React.FC<YantraActivationRitualProps> = ({ ritual, yantraPackage }) => {
  return (
    <div className="yantra-activation-ritual">
      <h2>Yantra Activation Ritual</h2>

      <div className="ritual-materials">
        <h3>Materials Needed</h3>
        <ul>
          {ritual.materials.map((material, index) => (
            <li key={index}>{material}</li>
          ))}
        </ul>
      </div>

      <div className="ritual-steps">
        <h3>Activation Steps</h3>
        <ol>
          {ritual.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="ritual-details">
        <p><strong>Duration:</strong> {ritual.duration}</p>
        <p><strong>Best Time:</strong> {ritual.bestTime}</p>
      </div>
    </div>
  );
};

export default YantraActivationRitual;