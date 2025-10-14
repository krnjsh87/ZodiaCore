import React, { useState } from 'react';
import { ActivityType, MuhuratPreferences, MuhuratResult, MuhuratReport } from '../types/astrology';
import { astrologyApi } from '../services/api';
import MuhuratInput from './MuhuratInput';
import MuhuratResults from './MuhuratResults';
import MuhuratDetails from './MuhuratDetails';
import './MuhuratDashboard.css';
import './MuhuratInput.css';
import './MuhuratResults.css';
import './MuhuratDetails.css';

type ViewState = 'input' | 'results' | 'details';

const MuhuratDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('input');
  const [results, setResults] = useState<MuhuratResult[]>([]);
  const [selectedReport, setSelectedReport] = useState<MuhuratReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (
    activityType: ActivityType,
    startDate: Date,
    endDate: Date,
    preferences: MuhuratPreferences
  ) => {
    setLoading(true);
    setError(null);

    try {
      const searchResults = await astrologyApi.findAuspiciousMuhurat(
        activityType,
        startDate,
        endDate,
        preferences
      );

      setResults(searchResults);
      setCurrentView('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching for muhurats');
      console.error('Muhurat search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMuhurat = async (muhurat: MuhuratResult) => {
    setLoading(true);
    setError(null);

    try {
      const report = await astrologyApi.generateMuhuratReport(muhurat, muhurat.activityType);
      setSelectedReport(report);
      setCurrentView('details');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the report');
      console.error('Report generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToResults = () => {
    setCurrentView('results');
    setSelectedReport(null);
  };

  const handleBackToInput = () => {
    setCurrentView('input');
    setResults([]);
    setSelectedReport(null);
    setError(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'input':
        return (
          <MuhuratInput
            onSearch={handleSearch}
            loading={loading}
          />
        );

      case 'results':
        return (
          <MuhuratResults
            results={results}
            onSelectMuhurat={handleSelectMuhurat}
            loading={loading}
          />
        );

      case 'details':
        return (
          <MuhuratDetails
            report={selectedReport}
            onBack={handleBackToResults}
            loading={loading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="muhurat-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🕉️ Vedic Muhurat Finder</h1>
          <p>Discover auspicious timing for your important activities using traditional Vedic astrology</p>
        </div>

        {currentView !== 'input' && (
          <button
            className="new-search-btn"
            onClick={handleBackToInput}
            disabled={loading}
          >
            🔍 New Search
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
            <h4>About Vedic Muhurat</h4>
            <p>
              Muhurat is the selection of auspicious timing for commencing important activities in Vedic astrology.
              It combines astronomical calculations with traditional wisdom to identify periods when planetary
              influences are most favorable for success, prosperity, and harmony.
            </p>
          </div>

          <div className="footer-links">
            <h4>Key Features</h4>
            <ul>
              <li>Complete Panchang calculations</li>
              <li>30 Muhurats per day analysis</li>
              <li>Activity-specific recommendations</li>
              <li>Comprehensive scoring system</li>
              <li>Detailed validation reports</li>
            </ul>
          </div>

          <div className="footer-disclaimer">
            <h4>Important Note</h4>
            <p>
              This tool provides traditional astrological guidance. For critical decisions,
              please consult qualified astrologers or priests. Results are for informational purposes only.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 ZodiaCore. Traditional Vedic Astrology Tools.</p>
        </div>
      </footer>
    </div>
  );
};

export default MuhuratDashboard;