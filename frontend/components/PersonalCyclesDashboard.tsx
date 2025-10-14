import React, { useState } from 'react';
import { PersonalCyclesAnalysis } from '../types/astrology';
import { astrologyApi } from '../services/api';
import PersonalCyclesInput from './PersonalCyclesInput';
import PersonalCyclesResults from './PersonalCyclesResults';
import './PersonalCyclesDashboard.css';

/**
 * Personal Cycles Dashboard Component
 * Main component that handles ZC4.2 Personal Year/Month/Day Cycles calculation workflow
 */
const PersonalCyclesDashboard: React.FC = () => {
  const [cyclesAnalysis, setCyclesAnalysis] = useState<PersonalCyclesAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'input' | 'results'>('input');

  /**
   * Handle personal cycles calculation
   */
  const handleCalculateCycles = async (birthDate: string, targetDate?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await astrologyApi.calculatePersonalCycles(birthDate, targetDate);

      if (response.success && response.data) {
        setCyclesAnalysis(response.data);
        setCurrentView('results');
      } else {
        setError(response.error || 'Failed to calculate personal cycles');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate personal cycles');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle going back to input form
   */
  const handleBackToInput = () => {
    setCurrentView('input');
    setCyclesAnalysis(null);
    setError(null);
  };

  /**
   * Handle generating a new analysis
   */
  const handleNewCalculation = () => {
    setCurrentView('input');
    setCyclesAnalysis(null);
    setError(null);
  };

  return (
    <div className="personal-cycles-dashboard">
      <header className="dashboard-header">
        <h1>ZodiaCore - ZC4.2 Personal Cycles Calculator</h1>
        <p>Discover your Personal Year, Month, and Day cycles using Pythagorean numerology</p>

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
              onClick={handleNewCalculation}
              className="action-button primary"
              aria-label="Calculate new personal cycles analysis"
            >
              New Calculation
            </button>
          </div>
        )}
      </header>

      <main className="dashboard-content">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Calculating your personal cycles...</p>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <h3>Calculation Error</h3>
              <p>{error}</p>
              <button
                onClick={() => setError(null)}
                className="error-dismiss"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {currentView === 'input' ? (
          <div className="input-section">
            <PersonalCyclesInput
              onSubmit={handleCalculateCycles}
              loading={loading}
              error={error}
            />
          </div>
        ) : (
          <div className="results-section">
            {cyclesAnalysis && (
              <PersonalCyclesResults
                analysis={cyclesAnalysis}
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
            <strong>Important:</strong> Personal cycles provide timing guidance for self-reflection and decision-making.
            Consult qualified professionals for important life decisions.
          </p>
          <p>
            Your personal information is processed locally and not stored on our servers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PersonalCyclesDashboard;