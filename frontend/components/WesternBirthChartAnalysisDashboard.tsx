import React, { useState } from 'react';
import { BirthData, WesternBirthChartAnalysis } from '../types/astrology';
import { astrologyApi } from '../services/api';
import WesternBirthChartAnalysisInput from './WesternBirthChartAnalysisInput';
import WesternBirthChartAnalysisDisplay from './WesternBirthChartAnalysisDisplay';
import './WesternBirthChartAnalysisDashboard.css';

/**
 * Western Birth Chart Analysis Dashboard Component
 * Main component that handles Western astrology birth chart analysis workflow
 */
const WesternBirthChartAnalysisDashboard: React.FC = () => {
  const [analysis, setAnalysis] = useState<WesternBirthChartAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'input' | 'analysis'>('input');

  /**
   * Handle Western birth chart analysis
   */
  const handleAnalyzeChart = async (
    birthData: BirthData,
    options: {
      framework?: 'traditional' | 'modern' | 'evolutionary';
      houseSystem?: 'placidus' | 'koch' | 'equal' | 'whole-sign' | 'regiomontanus';
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const result = await astrologyApi.analyzeWesternBirthChart(birthData, options);
      if (result.success && result.data) {
        setAnalysis(result.data);
        setCurrentView('analysis');
      } else {
        setError('Failed to analyze Western birth chart');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze Western birth chart');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle going back to input form
   */
  const handleBackToInput = () => {
    setCurrentView('input');
    setAnalysis(null);
    setError(null);
  };

  /**
   * Handle generating a new analysis
   */
  const handleNewAnalysis = () => {
    setCurrentView('input');
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="western-birth-chart-analysis-dashboard">
      <header className="dashboard-header">
        <h1>ZodiaCore - Western Birth Chart Analysis</h1>
        <p>
          Comprehensive Western astrology birth chart analysis with planetary interpretations,
          house analysis, aspect synthesis, and holistic personality profile
        </p>

        {currentView === 'analysis' && (
          <div className="dashboard-actions">
            <button
              onClick={handleBackToInput}
              className="action-button secondary"
              aria-label="Go back to input form"
            >
              ← Back to Input
            </button>
            <button
              onClick={handleNewAnalysis}
              className="action-button primary"
              aria-label="Generate a new Western birth chart analysis"
            >
              New Analysis
            </button>
          </div>
        )}
      </header>

      <main className="dashboard-content">
        {currentView === 'input' ? (
          <div className="input-section">
            <WesternBirthChartAnalysisInput
              onSubmit={handleAnalyzeChart}
              loading={loading}
              error={error}
            />
          </div>
        ) : (
          <div className="analysis-section">
            {analysis && (
              <WesternBirthChartAnalysisDisplay
                analysis={analysis}
                loading={loading}
                error={error}
              />
            )}
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>
            <strong>Important:</strong> Western astrology analysis is for guidance and self-reflection.
            Consult qualified professionals for important life decisions.
          </p>
          <p>
            Analysis is based on astronomical calculations and astrological frameworks.
            Results may vary based on interpretive approach and house system selection.
          </p>
          <p>
            Your birth data is processed locally and not stored on our servers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WesternBirthChartAnalysisDashboard;