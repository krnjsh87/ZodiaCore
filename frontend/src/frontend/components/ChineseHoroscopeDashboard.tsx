/**
 * ZodiaCore - Chinese Horoscope Dashboard Component
 *
 * Unified dashboard for Chinese horoscopes providing navigation between daily, weekly,
 * monthly, and yearly views with seamless transitions and consistent design.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

import React, { useState, useEffect } from 'react';
import { ChineseHoroscope } from '../types/astrology';
import ChineseDailyHoroscopeView from './ChineseDailyHoroscopeView';
import ChineseWeeklyHoroscopeView from './ChineseWeeklyHoroscopeView';
import ChineseMonthlyHoroscopeView from './ChineseMonthlyHoroscopeView';
import ChineseYearlyHoroscopeView from './ChineseYearlyHoroscopeView';
import './ChineseHoroscopeDashboard.css';
import './ChineseHoroscopeDashboard.css';

interface ChineseHoroscopeDashboardProps {
  horoscopes: {
    daily: ChineseHoroscope;
    weekly: ChineseHoroscope;
    monthly: ChineseHoroscope;
    yearly: ChineseHoroscope;
  };
  onDateChange?: (date: Date) => void;
  selectedDate?: Date;
}

/**
 * Chinese Horoscope Dashboard Component
 * Provides unified navigation and display for all Chinese horoscope types
 */
const ChineseHoroscopeDashboard: React.FC<ChineseHoroscopeDashboardProps> = ({
  horoscopes,
  onDateChange,
  selectedDate = new Date()
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [currentDate, setCurrentDate] = useState(selectedDate);

  useEffect(() => {
    setCurrentDate(selectedDate);
  }, [selectedDate]);

  /**
   * Handle tab change
   */
  const handleTabChange = (tab: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    setActiveTab(tab);
  };

  /**
   * Handle date navigation
   */
  const handleDateNavigation = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);

    switch (activeTab) {
      case 'daily':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'weekly':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'yearly':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }

    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  /**
   * Get formatted date range for current tab
   */
  const getDateRangeText = () => {
    switch (activeTab) {
      case 'daily':
        return currentDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'weekly':
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'monthly':
        return currentDate.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        });
      case 'yearly':
        return currentDate.getFullYear().toString();
      default:
        return '';
    }
  };

  /**
   * Render navigation tabs
   */
  const renderTabs = () => {
    const tabs = [
      { key: 'daily', label: 'Daily', icon: '📅' },
      { key: 'weekly', label: 'Weekly', icon: '📊' },
      { key: 'monthly', label: 'Monthly', icon: '🌙' },
      { key: 'yearly', label: 'Yearly', icon: '🎯' }
    ];

    return (
      <nav className="chinese-horoscope-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`chinese-horoscope-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.key as any)}
            aria-pressed={activeTab === tab.key}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    );
  };

  /**
   * Render date navigation
   */
  const renderDateNavigation = () => {
    return (
      <div className="date-navigation">
        <button
          className="nav-button nav-button--prev"
          onClick={() => handleDateNavigation('prev')}
          aria-label="Previous period"
        >
          ← Previous
        </button>

        <div className="current-date-range">
          <span className="date-range-text">{getDateRangeText()}</span>
          <span className="date-range-type">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Horoscope</span>
        </div>

        <button
          className="nav-button nav-button--next"
          onClick={() => handleDateNavigation('next')}
          aria-label="Next period"
        >
          Next →
        </button>
      </div>
    );
  };

  /**
   * Render active horoscope view
   */
  const renderActiveView = () => {
    switch (activeTab) {
      case 'daily':
        return <ChineseDailyHoroscopeView horoscope={horoscopes.daily} />;
      case 'weekly':
        return <ChineseWeeklyHoroscopeView horoscope={horoscopes.weekly} />;
      case 'monthly':
        return <ChineseMonthlyHoroscopeView horoscope={horoscopes.monthly} />;
      case 'yearly':
        return <ChineseYearlyHoroscopeView horoscope={horoscopes.yearly} />;
      default:
        return <ChineseDailyHoroscopeView horoscope={horoscopes.daily} />;
    }
  };

  /**
   * Render quick overview cards
   */
  const renderOverviewCards = () => {
    const cards = [
      {
        type: 'daily',
        title: 'Today',
        horoscope: horoscopes.daily,
        icon: '☀️'
      },
      {
        type: 'weekly',
        title: 'This Week',
        horoscope: horoscopes.weekly,
        icon: '📈'
      },
      {
        type: 'monthly',
        title: 'This Month',
        horoscope: horoscopes.monthly,
        icon: '🌙'
      },
      {
        type: 'yearly',
        title: 'This Year',
        horoscope: horoscopes.yearly,
        icon: '🎯'
      }
    ];

    return (
      <div className="overview-cards">
        {cards.map(card => (
          <div
            key={card.type}
            className={`overview-card ${activeTab === card.type ? 'active' : ''}`}
            onClick={() => handleTabChange(card.type as any)}
          >
            <div className="overview-card__icon">{card.icon}</div>
            <div className="overview-card__content">
              <h3 className="overview-card__title">{card.title}</h3>
              <div className="overview-card__rating">
                <span className={`rating-badge rating-${card.horoscope.predictions.overall.rating.toLowerCase().replace(' ', '-')}`}>
                  {card.horoscope.predictions.overall.rating}
                </span>
              </div>
              <p className="overview-card__summary">
                {card.horoscope.predictions.overall.summary.substring(0, 60)}...
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="chinese-horoscope-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1 className="dashboard-title__main">Chinese Horoscopes</h1>
          <p className="dashboard-title__subtitle">
            Traditional Chinese astrology predictions based on lunar cycles and elemental energies
          </p>
        </div>
      </header>

      {renderOverviewCards()}

      <div className="dashboard-controls">
        {renderTabs()}
        {renderDateNavigation()}
      </div>

      <main className="dashboard-content">
        {renderActiveView()}
      </main>

      <footer className="dashboard-footer">
        <div className="dashboard-footer__content">
          <p className="dashboard-footer__text">
            Chinese horoscopes are based on traditional lunar calendar calculations and Five Elements theory.
            Results are for entertainment and guidance purposes.
          </p>
          <div className="dashboard-footer__links">
            <a href="#about" className="footer-link">About Chinese Astrology</a>
            <a href="#methodology" className="footer-link">Calculation Methodology</a>
            <a href="#disclaimer" className="footer-link">Disclaimer</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChineseHoroscopeDashboard;