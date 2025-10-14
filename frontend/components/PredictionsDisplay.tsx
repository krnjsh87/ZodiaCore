import React from 'react';
import { DeepHoroscopeInterpretation } from '../types/astrology';

interface PredictionsDisplayProps {
  predictions: DeepHoroscopeInterpretation['predictions'];
}

const PredictionsDisplay: React.FC<PredictionsDisplayProps> = ({ predictions }) => {
  return (
    <div className="predictions-display">
      <h2>Life Predictions</h2>
      <div className="prediction-section">
        <h3>Career Predictions</h3>
        <p>{predictions?.careerPredictions?.overall || 'Career analysis available'}</p>
      </div>
      <div className="prediction-section">
        <h3>Relationship Predictions</h3>
        <p>{predictions?.relationshipPredictions?.overall || 'Relationship analysis available'}</p>
      </div>
      <div className="prediction-section">
        <h3>Major Life Events</h3>
        {predictions?.majorLifeEvents?.length > 0 ? (
          predictions.majorLifeEvents.map((event, index) => (
            <div key={index} className="event-item">
              <h4>{event.type}</h4>
              <p>{event.description}</p>
            </div>
          ))
        ) : (
          <p>No major events predicted</p>
        )}
      </div>
    </div>
  );
};

export default PredictionsDisplay;