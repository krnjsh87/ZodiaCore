import React, { useState } from 'react';
import { ActivityType, ZC111Analysis, ZC111QuickAnalysis } from '../types/astrology';
import { astrologyApi } from '../services/api';
import ZC111Input from './ZC111Input';
import ZC111Results from './ZC111Results';
import ZC111Details from './ZC111Details';
import './ZC111Dashboard.css';

type ViewState = 'input' | 'results' | 'details';

const ZC111Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('input');
  const [results, setResults] = useState<ZC111Analysis | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ZC111Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (
    birthDate: Date,
    fullName: string,
    activityType: ActivityType,
    dateRange: { start: Date; end: Date },
    preferences?: { latitude?: number; longitude?: number }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const analysis = await astrologyApi.generateZC111Analysis(
        birthDate,
        fullName,
        activityType,
        dateRange,
        preferences
      );

      setResults(analysis);
      setCurrentView('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the analysis');
      console.error('ZC1.11 analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnalysis = (analysis: ZC111Analysis) => {
    setSelectedAnalysis(analysis);
    setCurrentView('details');
  };

  const handleBackToResults = () => {
    setCurrentView('results');
    setSelectedAnalysis(null);
  };

  const handleBackToInput = () => {
    setCurrentView('input');
    setResults(null);
    setSelectedAnalysis(null);
    setError(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'input':
        return (
          <ZC111Input
            onAnalysis={handleAnalysis}
            loading={loading}
          />
        );

      case 'results':
        return (
          <ZC111Results
            analysis={results}
            onSelectAnalysis={handleSelectAnalysis}
            loading={loading}
          />
        );

      case 'details':
        return (
          <ZC111Details
            analysis={selectedAnalysis}
            onBack={handleBackToResults}
            loading={loading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="zc111-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🔢 ZC1.11 Lucky Number & Auspicious Timing</h1>
          <p>Discover your lucky numbers and optimal timing using Vedic numerology and muhurat principles</p>
        </div>

        {currentView !== 'input' && (
          <button
            className="new-search-btn"
            onClick={handleBackToInput}
            disabled={loading}
          >
            🔍 New Analysis
          </button>
        )}
      </header>

      <main className="dashboard-content">
        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <h3>Error</h3>
              <p>{error}</p>
              <button
                className="error-retry-btn"
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {renderCurrentView()}
      </main>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-info">
            <h4>About ZC1.11 Lucky Number & Auspicious Timing</h4>
            <p>
              ZC1.11 combines Vedic numerology with traditional muhurat (auspicious timing) principles
              to provide personalized lucky numbers and optimal timing recommendations for important life activities.
              This system integrates numerological calculations with astrological timing to offer comprehensive guidance.
            </p>
          </div>

          <div className="footer-links">
            <h4>Key Features</h4>
            <ul>
              <li>Complete numerology profile analysis</li>
              <li>Lucky number generation and categorization</li>
              <li>Auspicious timing integration</li>
              <li>Activity-specific recommendations</li>
              <li>Comprehensive compatibility scoring</li>
            </ul>
          </div>

          <div className="footer-disclaimer">
            <h4>Important Note</h4>
            <p>
              This analysis provides traditional numerological and astrological guidance.
              For critical decisions, please consult qualified numerologists and astrologers.
              Results are for informational purposes only.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 ZodiaCore. Traditional Vedic Numerology & Astrology Tools.</p>
        </div>
      </footer>
    </div>
  );
};

export default ZC111Dashboard;