import React from 'react';
import { DeepHoroscopeInterpretation } from '../types/astrology';

interface YogasDisplayProps {
  yogas: DeepHoroscopeInterpretation['yogas'];
}

const YogasDisplay: React.FC<YogasDisplayProps> = ({ yogas }) => {
  return (
    <div className="yogas-display">
      <h2>Yogas and Combinations</h2>
      <div className="yoga-section">
        <h3>Raja Yogas</h3>
        {yogas?.rajaYogas?.length > 0 ? (
          yogas.rajaYogas.map((yoga, index) => (
            <div key={index} className="yoga-item">
              <h4>{yoga.name}</h4>
              <p>Strength: {yoga.strength}</p>
              <p>{yoga.effects}</p>
            </div>
          ))
        ) : (
          <p>No significant Raja Yogas found</p>
        )}
      </div>
      <div className="yoga-section">
        <h3>Dhana Yogas</h3>
        {yogas?.dhanYogas?.length > 0 ? (
          yogas.dhanYogas.map((yoga, index) => (
            <div key={index} className="yoga-item">
              <h4>{yoga.name}</h4>
              <p>{yoga.effects}</p>
            </div>
          ))
        ) : (
          <p>No significant Dhana Yogas found</p>
        )}
      </div>
    </div>
  );
};

export default YogasDisplay;