/**
 * ZodiaCore - Horoscope Dashboard
 *
 * Main dashboard component for Vedic horoscope generation and display.
 * Provides interface for selecting horoscope types and viewing predictions.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

import React, { useState, useEffect } from 'react';
import { Horoscope, HoroscopeType, BirthChart } from '../types/astrology';
import { astrologyApi } from '../services/api';
import HoroscopeInput from './HoroscopeInput';
import HoroscopeDisplay from './HoroscopeDisplay';
import DailyHoroscopeView from './DailyHoroscopeView';
import WeeklyHoroscopeView from './WeeklyHoroscopeView';
import MonthlyHoroscopeView from './MonthlyHoroscopeView';
import YearlyHoroscopeView from './YearlyHoroscopeView';
import './HoroscopeDashboard.css';

interface HoroscopeDashboardProps {
  birthChart?: BirthChart;
  className?: string;
}

/**
 * Horoscope Dashboard Component
 * Main interface for horoscope generation and display
 */
const HoroscopeDashboard: React.FC<HoroscopeDashboardProps> = ({
  birthChart,
  className = ''
}) => {
  const [selectedType, setSelectedType] = useState<HoroscopeType>('daily');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [horoscope, setHoroscope] = useState<Horoscope | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate horoscope for selected type and date
   */
  const generateHoroscope = async () => {
    if (!birthChart) {
      setError('Birth chart is required for horoscope generation');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await astrologyApi.generateHoroscope(selectedType, selectedDate, birthChart);
      setHoroscope(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate horoscope');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate all horoscopes for current period
   */
  const generateAllHoroscopes = async () => {
    if (!birthChart) {
      setError('Birth chart is required for horoscope generation');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await astrologyApi.generateAllHoroscopes(selectedDate, birthChart);
      // Set the current selected type's horoscope
      setHoroscope(result[selectedType]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate horoscopes');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle type change
   */
  const handleTypeChange = (type: HoroscopeType) => {
    setSelectedType(type);
    setHoroscope(null); // Clear current horoscope when type changes
  };

  /**
   * Handle date change
   */
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setHoroscope(null); // Clear current horoscope when date changes
  };

  /**
   * Render horoscope content based on type
   */
  const renderHoroscopeContent = () => {
    if (!horoscope) return null;

    const commonProps = {
      horoscope,
      birthChart
    };

    switch (horoscope.type) {
      case 'daily':
        return <DailyHoroscopeView {...commonProps} />;
      case 'weekly':
        return <WeeklyHoroscopeView {...commonProps} />;
      case 'monthly':
        return <MonthlyHoroscopeView {...commonProps} />;
      case 'yearly':
        return <YearlyHoroscopeView {...commonProps} />;
      default:
        return <HoroscopeDisplay {...commonProps} />;
    }
  };

  return (
    <div className={`horoscope-dashboard ${className}`}>
      <div className="horoscope-dashboard__header">
        <h1 className="horoscope-dashboard__title">Vedic Horoscopes</h1>
        <p className="horoscope-dashboard__subtitle">
          Discover your astrological predictions based on Vedic principles
        </p>
      </div>

      <div className="horoscope-dashboard__controls">
        <HoroscopeInput
          selectedType={selectedType}
          selectedDate={selectedDate}
          onTypeChange={handleTypeChange}
          onDateChange={handleDateChange}
          onGenerate={generateHoroscope}
          onGenerateAll={generateAllHoroscopes}
          loading={loading}
        />
      </div>

      {error && (
        <div className="horoscope-dashboard__error" role="alert">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="horoscope-dashboard__content">
        {loading && (
          <div className="horoscope-dashboard__loading" aria-live="polite">
            <div className="loading-spinner"></div>
            <p>Generating your {selectedType} horoscope...</p>
          </div>
        )}

        {!loading && horoscope && renderHoroscopeContent()}
      </div>

      {!birthChart && (
        <div className="horoscope-dashboard__warning" role="alert">
          <div className="warning-message">
            <span className="warning-icon">ℹ️</span>
            <span>Please generate or load a birth chart first to view horoscopes</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoroscopeDashboard;