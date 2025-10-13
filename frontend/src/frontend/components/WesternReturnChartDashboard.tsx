import React, { useState } from 'react';
import { BirthData, ReturnChart, ReturnChartRequest, CombinedReturnCharts } from '../types/astrology';
import { astrologyApi } from '../services/api';
import WesternReturnChartInput from './WesternReturnChartInput';
import WesternReturnChartDisplay from './WesternReturnChartDisplay';
import './WesternReturnChartDashboard.css';

/**
 * Western Return Chart Dashboard Component
 * Main component that handles Western astrology return chart generation workflow
 */
const WesternReturnChartDashboard: React.FC = () => {
  const [returnChart, setReturnChart] = useState<ReturnChart | null>(null);
  const [combinedCharts, setCombinedCharts] = useState<CombinedReturnCharts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'input' | 'chart'>('input');
  const [chartType, setChartType] = useState<'single' | 'combined'>('single');

  /**
   * Handle return chart generation
   */
  const handleGenerateChart = async (request: ReturnChartRequest) => {
    setLoading(true);
    setError(null);

    try {
      const chart = await astrologyApi.generateWesternReturnChart(request);
      setReturnChart(chart);
      setCurrentView('chart');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate Western return chart');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle combined return charts generation
   */
  const handleGenerateCombinedCharts = async (birthData: BirthData, targetDate: Date) => {
    setLoading(true);
    setError(null);

    try {
      const charts = await astrologyApi.generateWesternCombinedReturnCharts(birthData, targetDate);
      setCombinedCharts(charts);
      setCurrentView('chart');
      setChartType('combined');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate combined return charts');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle going back to input form
   */
  const handleBackToInput = () => {
    setCurrentView('input');
    setReturnChart(null);
    setCombinedCharts(null);
    setError(null);
  };

  /**
   * Handle generating a new chart
   */
  const handleNewChart = () => {
    setCurrentView('input');
    setReturnChart(null);
    setCombinedCharts(null);
    setError(null);
    setChartType('single');
  };

  return (
    <div className="western-return-chart-dashboard">
      <header className="dashboard-header">
        <h1>ZodiaCore - Western Return Charts</h1>
        <p>Discover insights for your upcoming year (Solar Return) or month (Lunar Return) through Western astrology</p>

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
              aria-label="Generate a new return chart"
            >
              Generate New Chart
            </button>
          </div>
        )}
      </header>

      <main className="dashboard-content">
        {currentView === 'input' ? (
          <div className="input-section">
            <WesternReturnChartInput
              onSubmit={handleGenerateChart}
              onCombinedSubmit={handleGenerateCombinedCharts}
              loading={loading}
              error={error}
            />
          </div>
        ) : (
          <div className="chart-section">
            {(returnChart || combinedCharts) && (
              <WesternReturnChartDisplay
                returnChart={returnChart}
                combinedCharts={combinedCharts}
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
            <strong>Important:</strong> Return charts provide insights into specific time periods.
            They complement rather than replace your birth chart analysis.
          </p>
          <p>
            Your birth data is processed locally and not stored on our servers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WesternReturnChartDashboard;