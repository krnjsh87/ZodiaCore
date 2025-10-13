import React from 'react';

interface ComprehensiveAnalysisProps {
  analysis: any;
}

const ComprehensiveAnalysis: React.FC<ComprehensiveAnalysisProps> = ({ analysis }) => {
  return (
    <div className="comprehensive-analysis">
      <h2>Comprehensive Analysis</h2>
      <p>Personalized insights based on your Chinese astrology profile</p>

      <div className="analysis-sections">
        <div className="analysis-section">
          <h3>Personality</h3>
          <ul>
            {analysis.personality.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-section">
          <h3>Career</h3>
          <ul>
            {analysis.career.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-section">
          <h3>Relationships</h3>
          <ul>
            {analysis.relationships.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-section">
          <h3>Health</h3>
          <ul>
            {analysis.health.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-section">
          <h3>Wealth</h3>
          <ul>
            {analysis.wealth.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-section">
          <h3>Timing</h3>
          <ul>
            {analysis.timing.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-section recommendations">
          <h3>Recommendations</h3>
          <ul>
            {analysis.recommendations.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="disclaimer">
        <p><strong>Important Note:</strong> This analysis is for entertainment and self-reflection purposes only.
        Chinese astrology provides insights into personality patterns and life rhythms but should not be used
        for definitive predictions or major life decisions. Consult with qualified professionals for important matters.</p>
      </div>
    </div>
  );
};

export default ComprehensiveAnalysis;