import React, { useState } from 'react';
import { BirthData, BirthChart } from '../types/astrology';
import { astrologyApi } from '../services/api';
import BirthChartInput from './BirthChartInput';
import BirthChartDisplay from './BirthChartDisplay';
import './BirthChartDashboard.css';

/**
 * Birth Chart Dashboard Component
 * Main component that handles birth chart generation workflow
 */
const BirthChartDashboard: React.FC = () => {
  const [birthChart, setBirthChart] = useState<BirthChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'input' | 'chart'>('input');

  /**
   * Handle birth chart generation
   */
  const handleGenerateChart = async (birthData: BirthData) => {
    setLoading(true);
    setError(null);

    try {
      const chart = await astrologyApi.generateBirthChart(birthData);
      setBirthChart(chart);
      setCurrentView('chart');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate birth chart');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle going back to input form
   */
  const handleBackToInput = () => {
    setCurrentView('input');
    setBirthChart(null);
    setError(null);
  };

  /**
   * Handle generating a new chart
   */
  const handleNewChart = () => {
    setCurrentView('input');
    setBirthChart(null);
    setError(null);
  };

  return (
    <div className="birth-chart-dashboard">
      <header className="dashboard-header">
        <h1>ZodiaCore - Vedic Birth Chart Generator</h1>
        <p>Generate your complete Janam Kundali with planetary positions, houses, and astrological analysis</p>

        {currentView === 'chart' && (
          <div className="dashboard-actions">
            <button
              onClick={handleBackToInput}
              className="action-button secondary"
              aria-label="Go back to input form"
            >
              ← Back to Input
            </button>
            <button
              onClick={handleNewChart}
              className="action-button primary"
              aria-label="Generate a new birth chart"
            >
              Generate New Chart
            </button>
          </div>
        )}
      </header>

      <main className="dashboard-content">
        {currentView === 'input' ? (
          <div className="input-section">
            <BirthChartInput
              onSubmit={handleGenerateChart}
              loading={loading}
              error={error}
            />
          </div>
        ) : (
          <div className="chart-section">
            {birthChart && (
              <BirthChartDisplay
                birthChart={birthChart}
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
            <strong>Important:</strong> Vedic astrology is for guidance and self-reflection.
            Consult qualified professionals for important life decisions.
          </p>
          <p>
            Your birth data is processed locally and not stored on our servers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BirthChartDashboard;