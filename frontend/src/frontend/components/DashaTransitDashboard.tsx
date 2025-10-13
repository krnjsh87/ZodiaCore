import React, { useState, useEffect } from 'react';
import { DashaDisplay } from './DashaDisplay';
import { TransitDisplay } from './TransitDisplay';
import { PredictionsDisplay } from './PredictionsDisplay';
import { PeriodAnalysisDisplay } from './PeriodAnalysisDisplay';
import { DashaTransitAnalysis, BirthChart } from '../types/astrology';
import { astrologyApi } from '../services/api';
import './DashaTransitDashboard.css';

export const DashaTransitDashboard: React.FC = () => {
  const [analysis, setAnalysis] = useState<DashaTransitAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Sample birth chart for demonstration
  const sampleBirthChart: BirthChart = {
    birthData: { year: 1990, month: 5, day: 15, hour: 14, minute: 30, second: 0 },
    planets: {
      SUN: { longitude: 45.2 },
      MOON: { longitude: 120.5 },
      MARS: { longitude: 78.3 },
      MERCURY: { longitude: 52.1 },
      JUPITER: { longitude: 234.7 },
      VENUS: { longitude: 67.8 },
      SATURN: { longitude: 301.4 },
      RAHU: { longitude: 156.9 },
      KETU: { longitude: 336.9 }
    },
    dasha: {
      balance: {
        lord: 'VENUS',
        balanceYears: 2.5,
        balanceDays: 912.5
      }
    },
    houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
  };

  const loadAnalysis = async (date: Date) => {
    setLoading(true);
    setError(null);
    try {
      const result = await astrologyApi.calculateDashaTransits(sampleBirthChart, date);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="dasha-transit-dashboard">
      <div className="dashboard-header">
        <h2>Dasha & Planetary Transit Analysis</h2>
        <div className="date-selector">
          <label htmlFor="analysis-date">Analysis Date:</label>
          <input
            id="analysis-date"
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => handleDateChange(new Date(e.target.value))}
          />
        </div>
      </div>

      {loading && (
        <div className="loading-indicator" aria-live="polite">
          Calculating astrological analysis...
        </div>
      )}

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {analysis && (
        <div className="analysis-grid">
          <div className="analysis-section">
            <DashaDisplay dasha={analysis.currentDasha} />
          </div>

          <div className="analysis-section">
            <TransitDisplay
              positions={analysis.transitPositions}
              aspects={analysis.transitAspects}
            />
          </div>

          <div className="analysis-section">
            <PredictionsDisplay predictions={analysis.predictions} />
          </div>

          <div className="analysis-section">
            <PeriodAnalysisDisplay analysis={analysis.periodAnalysis} />
          </div>
        </div>
      )}

      <div className="dashboard-footer">
        <p className="disclaimer">
          This analysis is for educational purposes only. Consult with a qualified astrologer for personal guidance.
        </p>
      </div>
    </div>
  );
};