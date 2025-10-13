import React, { useState } from 'react';
import { PanchangData } from '../types/astrology';
import { astrologyApi } from '../services/api';
import PanchangInput from './PanchangInput';
import PanchangDisplay from './PanchangDisplay';
import './PanchangDashboard.css';

type ViewState = 'input' | 'display';

const PanchangDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('input');
  const [panchangData, setPanchangData] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePanchang = async (
    date: Date,
    latitude: number,
    longitude: number
  ) => {
    setLoading(true);
    setError(null);

    try {
      const panchang = await astrologyApi.getPanchang(date, latitude, longitude);
      setPanchangData(panchang);
      setCurrentView('display');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating Panchang');
      console.error('Panchang generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToInput = () => {
    setCurrentView('input');
    setPanchangData(null);
    setError(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'input':
        return (
          <PanchangInput
            onGenerate={handleGeneratePanchang}
            loading={loading}
          />
        );

      case 'display':
        return (
          <PanchangDisplay
            panchangData={panchangData!}
            onBack={handleBackToInput}
            loading={loading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="panchang-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🕉️ Vedic Panchang Calendar</h1>
          <p>Discover the five essential elements of traditional Hindu calendar for auspicious timing</p>
        </div>

        {currentView !== 'input' && (
          <button
            className="new-search-btn"
            onClick={handleBackToInput}
            disabled={loading}
          >
            📅 New Date
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
            <h4>About Panchang</h4>
            <p>
              Panchang (पञ्चाङ्ग) is the traditional Hindu calendar system that provides comprehensive
              daily astronomical and astrological information through five essential elements: Tithi,
              Vara, Nakshatra, Yoga, and Karana.
            </p>
          </div>

          <div className="footer-links">
            <h4>The Five Elements</h4>
            <ul>
              <li><strong>Tithi:</strong> Lunar day based on Sun-Moon relationship</li>
              <li><strong>Vara:</strong> Weekday with planetary rulership</li>
              <li><strong>Nakshatra:</strong> Lunar mansion (constellation)</li>
              <li><strong>Yoga:</strong> Auspicious combination of Sun and Moon</li>
              <li><strong>Karana:</strong> Half-tithi period for activities</li>
            </ul>
          </div>

          <div className="footer-disclaimer">
            <h4>Important Note</h4>
            <p>
              Panchang provides traditional astrological guidance based on Vedic calculations.
              For critical decisions, please consult qualified astrologers or priests.
              Results are for informational and educational purposes.
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

export default PanchangDashboard;