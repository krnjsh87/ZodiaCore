import React, { useState } from 'react';
import { MundaneAstrologyRequest, MundaneAstrologyAnalysis } from '../types/astrology';
import { astrologyApi } from '../services/api';
import MundaneAstrologyInput from './MundaneAstrologyInput';
import MundaneAstrologyResults from './MundaneAstrologyResults';
import './MundaneAstrologyDashboard.css';

/**
 * Mundane Astrology Dashboard Component
 * Main component that handles mundane astrology analysis workflow
 * Analyzes world events, politics, economy, weather patterns, and regional influences
 */
const MundaneAstrologyDashboard: React.FC = () => {
  const [analysis, setAnalysis] = useState<MundaneAstrologyAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'input' | 'results'>('input');

  /**
   * Handle mundane astrology analysis generation
   */
  const handleGenerateAnalysis = async (request: MundaneAstrologyRequest) => {
    setLoading(true);
    setError(null);

    try {
      const result = await astrologyApi.generateMundaneAnalysis(request);
      setAnalysis(result);
      setCurrentView('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate mundane analysis');
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
    <div className="mundane-astrology-dashboard">
      <header className="dashboard-header">
        <h1>ZodiaCore - Complex Mundane Astrology Analysis</h1>
        <p>
          Analyze world events, politics, economy, weather patterns, and regional influences
          using Vedic astrological principles for comprehensive mundane forecasting
        </p>

        {currentView === 'results' && (
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
              aria-label="Generate a new mundane analysis"
            >
              Generate New Analysis
            </button>
          </div>
        )}
      </header>

      <main className="dashboard-content">
        {currentView === 'input' ? (
          <div className="input-section">
            <MundaneAstrologyInput
              onSubmit={handleGenerateAnalysis}
              loading={loading}
              error={error}
            />
          </div>
        ) : (
          <div className="results-section">
            {analysis && (
              <MundaneAstrologyResults
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
            <strong>Important:</strong> Mundane astrology provides astrological insights for world events
            and collective experiences. Results are for informational purposes and should not be used
            as the sole basis for important decisions.
          </p>
          <p>
            Analysis is based on Vedic astrological principles and historical correlations.
            Consult qualified professionals for comprehensive world event analysis.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MundaneAstrologyDashboard;