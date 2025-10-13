import React, { useState } from 'react';
import { NumerologyProfile } from '../types/astrology';
import { astrologyApi } from '../services/api';
import NumerologyInput from './NumerologyInput';
import NumerologyResults from './NumerologyResults';
import './NumerologyDashboard.css';

/**
 * Numerology Dashboard Component
 * Main component that handles numerology calculation workflow
 */
const NumerologyDashboard: React.FC = () => {
  const [numerologyProfile, setNumerologyProfile] = useState<NumerologyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'input' | 'results'>('input');

  /**
   * Handle numerology calculation
   */
  const handleCalculateNumerology = async (birthDate: string, fullName: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await astrologyApi.calculateNumerology(birthDate, fullName);

      if (response.success && response.data) {
        setNumerologyProfile(response.data);
        setCurrentView('results');
      } else {
        setError(response.error || 'Failed to calculate numerology profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate numerology profile');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle going back to input form
   */
  const handleBackToInput = () => {
    setCurrentView('input');
    setNumerologyProfile(null);
    setError(null);
  };

  /**
   * Handle generating a new profile
   */
  const handleNewCalculation = () => {
    setCurrentView('input');
    setNumerologyProfile(null);
    setError(null);
  };

  return (
    <div className="numerology-dashboard">
      <header className="dashboard-header">
        <h1>ZodiaCore - Numerology Calculator</h1>
        <p>Discover your numerological blueprint with Life Path, Destiny, Soul Urge, and Pinnacle numbers</p>

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
              aria-label="Calculate new numerology profile"
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
            <p>Calculating your numerological blueprint...</p>
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
            <NumerologyInput
              onSubmit={handleCalculateNumerology}
              loading={loading}
              error={error}
            />
          </div>
        ) : (
          <div className="results-section">
            {numerologyProfile && (
              <NumerologyResults
                profile={numerologyProfile}
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
            <strong>Important:</strong> Numerology provides insights for self-reflection and guidance.
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

export default NumerologyDashboard;