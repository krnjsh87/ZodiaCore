import React, { useState } from 'react';
import { ChineseBirthData, ChineseBirthChart as ChineseBirthChartType } from '../types/astrology';
import ChineseBirthChartInput from './ChineseBirthChartInput';
import ChineseBirthChartDisplay from './ChineseBirthChartDisplay';
import './ChineseBirthChart.css';

/**
 * Main Chinese Birth Chart Component
 * Combines input form and display with loading/error states
 */
const ChineseBirthChart: React.FC = () => {
  const [chart, setChart] = useState<ChineseBirthChartType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateChart = async (birthData: ChineseBirthData) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call - in real implementation, this would call the backend
      // For now, we'll create a mock response based on the structure
      const mockChart: ChineseBirthChartType = {
        birthData,
        baZi: {
          year: {
            stem: { name: 'Jia', element: 'Wood', yinYang: 'Yang' },
            branch: { name: 'Zi', animal: 'Rat', element: 'Water', direction: 'North' },
            element: 'Wood',
            animal: 'Rat'
          },
          month: {
            stem: { name: 'Yi', element: 'Wood', yinYang: 'Yin' },
            branch: { name: 'Chou', animal: 'Ox', element: 'Earth', direction: 'NorthEast' },
            element: 'Wood',
            animal: 'Ox'
          },
          day: {
            stem: { name: 'Bing', element: 'Fire', yinYang: 'Yang' },
            branch: { name: 'Yin', animal: 'Tiger', element: 'Wood', direction: 'East' },
            element: 'Fire',
            animal: 'Tiger'
          },
          hour: {
            stem: { name: 'Ding', element: 'Fire', yinYang: 'Yin' },
            branch: { name: 'Mao', animal: 'Rabbit', element: 'Wood', direction: 'East' },
            element: 'Fire',
            animal: 'Rabbit'
          },
          lunarDate: {
            lunarYear: birthData.year,
            solarTerm: { name: 'Spring Begins', longitude: 315 },
            isLeapMonth: false
          }
        },
        fiveElements: {
          counts: { Wood: 3, Fire: 2, Earth: 1, Metal: 0, Water: 1 },
          strongest: 'Wood',
          weakest: 'Metal',
          balance: 'Moderately Balanced',
          relationships: {
            Wood: { generates: 'Fire', controlledBy: 'Metal', controls: 'Earth', generatedBy: 'Water' },
            Fire: { generates: 'Earth', controlledBy: 'Water', controls: 'Metal', generatedBy: 'Wood' },
            Earth: { generates: 'Metal', controlledBy: 'Wood', controls: 'Water', generatedBy: 'Fire' },
            Metal: { generates: 'Water', controlledBy: 'Fire', controls: 'Wood', generatedBy: 'Earth' },
            Water: { generates: 'Wood', controlledBy: 'Earth', controls: 'Fire', generatedBy: 'Metal' }
          }
        },
        nineStarKi: {
          birthStar: '1-White',
          currentStar: '1-White',
          directions: {
            North: '1-White',
            NorthEast: '2-Black',
            East: '3-Jade',
            SouthEast: '4-Green',
            South: '5-Yellow',
            SouthWest: '6-White',
            West: '7-Red',
            NorthWest: '8-White',
            Center: '9-Purple'
          },
          analysis: {
            personality: ['Creative and innovative', 'Natural leader', 'Strong sense of justice'],
            career: ['Entrepreneurship', 'Creative fields', 'Leadership roles'],
            health: ['Strong constitution', 'Pay attention to heart health'],
            luckyDirections: ['North', 'South', 'East']
          }
        },
        interpretations: {
          personality: [
            'You have a strong creative energy and natural leadership abilities.',
            'Your Wood element dominance suggests you are ambitious and determined.',
            'The Tiger in your day pillar indicates courage and independence.'
          ],
          career: [
            'Consider careers in creative fields, leadership, or entrepreneurship.',
            'Your strong Wood element suggests success in growing and developing projects.',
            'Leadership positions would suit your natural commanding presence.'
          ],
          relationships: [
            'You value harmony and balance in relationships.',
            'Your Fire element in the day pillar suggests passionate connections.',
            'Look for partners who complement your strong personality.'
          ],
          health: [
            'Generally strong constitution with good vitality.',
            'Pay attention to liver health due to Wood element dominance.',
            'Regular exercise and stress management are important.'
          ],
          lucky: {
            elements: ['Wood', 'Fire'],
            directions: ['East', 'South', 'North'],
            remedies: ['Wear green colors', 'Practice meditation', 'Use wooden furniture']
          }
        },
        metadata: {
          calculationMethod: 'Traditional Chinese Astrology',
          algorithmVersion: '1.0',
          accuracy: '99.5%',
          lastUpdated: new Date().toISOString(),
          disclaimer: 'This is for entertainment and self-reflection purposes only'
        },
        getElementBalance: function() { return this.fiveElements; },
        getLuckyDirections: function() { return this.nineStarKi.directions; },
        getPersonalityTraits: function() { return this.interpretations.personality; },
        getCareerGuidance: function() { return this.interpretations.career; },
        getHealthInsights: function() { return this.interpretations.health; },
        getRelationshipAdvice: function() { return this.interpretations.relationships; },
        getLuckyElements: function() { return this.interpretations.lucky.elements; }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setChart(mockChart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate birth chart');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setChart(null);
    setError(null);
  };

  return (
    <div className="chinese-birth-chart-container">
      <div className="chart-header-section">
        <h1>Chinese Birth Chart Generator</h1>
        <p>Discover your Ba-Zi (Four Pillars of Destiny) and gain insights into your life path</p>
      </div>

      {!chart ? (
        <div className="input-section">
          <ChineseBirthChartInput
            onSubmit={handleGenerateChart}
            loading={loading}
          />

          {error && (
            <div className="error-message" role="alert">
              <h3>Error Generating Chart</h3>
              <p>{error}</p>
              <button onClick={() => setError(null)} className="retry-button">
                Try Again
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="results-section">
          <div className="results-header">
            <h2>Your Chinese Birth Chart</h2>
            <button onClick={handleReset} className="reset-button">
              Generate New Chart
            </button>
          </div>

          <ChineseBirthChartDisplay chart={chart} />
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay" aria-live="polite">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h3>Generating Your Birth Chart</h3>
            <p>Calculating Ba-Zi pillars and analyzing elements...</p>
            <div className="loading-steps">
              <div className="step active">Analyzing birth data</div>
              <div className="step active">Calculating Four Pillars</div>
              <div className="step">Analyzing Five Elements</div>
              <div className="step">Processing Nine Star Ki</div>
              <div className="step">Generating interpretations</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChineseBirthChart;