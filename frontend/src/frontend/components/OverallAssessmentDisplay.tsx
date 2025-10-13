import React from 'react';
import { DeepHoroscopeInterpretation } from '../types/astrology';

interface OverallAssessmentDisplayProps {
  overallAssessment: DeepHoroscopeInterpretation['overallAssessment'];
  confidence: DeepHoroscopeInterpretation['confidence'];
}

const OverallAssessmentDisplay: React.FC<OverallAssessmentDisplayProps> = ({
  overallAssessment,
  confidence
}) => {
  return (
    <div className="overall-assessment-display">
      <h2>Overall Assessment</h2>
      <div className="assessment-summary">
        <div className="assessment-item">
          <h3>Chart Strength</h3>
          <p>{overallAssessment?.strength ? (overallAssessment.strength * 100).toFixed(0) + '%' : 'N/A'}</p>
        </div>
        <div className="assessment-item">
          <h3>Summary</h3>
          <p>{overallAssessment?.summary || 'Analysis available'}</p>
        </div>
        <div className="assessment-item">
          <h3>Key Themes</h3>
          <ul>
            {overallAssessment?.keyThemes?.map((theme, index) => (
              <li key={index}>{theme}</li>
            )) || <li>No themes identified</li>}
          </ul>
        </div>
        <div className="assessment-item">
          <h3>Confidence Level</h3>
          <p>{confidence ? (confidence * 100).toFixed(0) + '%' : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default OverallAssessmentDisplay;