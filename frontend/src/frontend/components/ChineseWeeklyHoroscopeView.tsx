/**
 * ZodiaCore - Chinese Weekly Horoscope View Component
 *
 * Specialized view for Chinese weekly horoscopes showing lunar cycles, peak/challenging days,
 * and activity recommendations based on traditional Chinese astrology.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

import React from 'react';
import { ChineseHoroscope, ChineseWeeklyHoroscopeData } from '../types/astrology';
import HoroscopeDisplay from './HoroscopeDisplay';
import './ChineseWeeklyHoroscopeView.css';
import './ChineseWeeklyHoroscopeView.css';

interface ChineseWeeklyHoroscopeViewProps {
  horoscope: ChineseHoroscope;
}

/**
 * Chinese Weekly Horoscope View Component
 * Shows weekly-specific Chinese horoscope information including lunar cycles and activity recommendations
 */
const ChineseWeeklyHoroscopeView: React.FC<ChineseWeeklyHoroscopeViewProps> = ({
  horoscope
}) => {
  if (!horoscope.weekly) {
    return <HoroscopeDisplay horoscope={horoscope} />;
  }

  const { weekly } = horoscope;

  /**
   * Render weekly lunar overview
   */
  const renderWeeklyLunarOverview = () => {
    if (!weekly.weeklyLunar || weekly.weeklyLunar.length === 0) return null;

    return (
      <section className="chinese-weekly-horoscope-section chinese-weekly-horoscope-section--lunar-overview">
        <h2 className="chinese-weekly-horoscope-section__title">Weekly Lunar Overview</h2>

        <div className="weekly-lunar-calendar">
          {weekly.weeklyLunar.map((day, index) => (
            <div key={index} className="lunar-day">
              <div className="lunar-day__header">
                <span className="lunar-day__date">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span className={`lunar-day__element element-${day.element.toLowerCase()}`}>
                  {day.element}
                </span>
              </div>
              <div className="lunar-day__details">
                <span className="lunar-day__phase">{day.phase}</span>
                <span className="lunar-day__mansion">Mansion {day.mansion}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /**
   * Render peak days
   */
  const renderPeakDays = () => {
    if (!weekly.peakDays || weekly.peakDays.length === 0) return null;

    return (
      <section className="chinese-weekly-horoscope-section chinese-weekly-horoscope-section--peak-days">
        <h2 className="chinese-weekly-horoscope-section__title">Peak Days</h2>

        <div className="peak-days">
          {weekly.peakDays.map((day, index) => (
            <div key={index} className="peak-day">
              <div className="peak-day__header">
                <h3 className="peak-day__date">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </h3>
                <span className="peak-day__score">
                  {Math.round(day.score * 100)}% favorable
                </span>
              </div>
              <p className="peak-day__reason">{day.reason}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /**
   * Render challenging days
   */
  const renderChallengingDays = () => {
    if (!weekly.challengingDays || weekly.challengingDays.length === 0) return null;

    return (
      <section className="chinese-weekly-horoscope-section chinese-weekly-horoscope-section--challenging-days">
        <h2 className="chinese-weekly-horoscope-section__title">Challenging Days</h2>

        <div className="challenging-days">
          {weekly.challengingDays.map((day, index) => (
            <div key={index} className="challenging-day">
              <div className="challenging-day__header">
                <h3 className="challenging-day__date">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </h3>
                <span className="challenging-day__score">
                  {Math.round(day.score * 100)}% challenging
                </span>
              </div>
              <p className="challenging-day__reason">{day.reason}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  /**
   * Render best activities
   */
  const renderBestActivities = () => {
    if (!weekly.bestActivities || weekly.bestActivities.length === 0) return null;

    return (
      <section className="chinese-weekly-horoscope-section chinese-weekly-horoscope-section--best-activities">
        <h2 className="chinese-weekly-horoscope-section__title">Recommended Activities</h2>

        <div className="best-activities">
          {weekly.bestActivities.map((activity, index) => (
            <div key={index} className="activity-group">
              <div className="activity-group__header">
                <h3 className="activity-group__timing">{activity.timing}</h3>
                <p className="activity-group__reason">{activity.reason}</p>
              </div>
              <ul className="activity-group__list">
                {activity.activities.map((item, itemIndex) => (
                  <li key={itemIndex} className="activity-item">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="chinese-weekly-horoscope-view">
      <HoroscopeDisplay horoscope={horoscope} />

      <div className="chinese-weekly-horoscope-specific">
        {renderWeeklyLunarOverview()}
        {renderPeakDays()}
        {renderChallengingDays()}
        {renderBestActivities()}
      </div>

      <div className="chinese-weekly-horoscope-info">
        <div className="chinese-weekly-horoscope-info__section">
          <h3 className="chinese-weekly-horoscope-info__title">About Chinese Weekly Horoscopes</h3>
          <p className="chinese-weekly-horoscope-info__text">
            Chinese weekly horoscopes analyze the complete lunar cycle for seven days, identifying
            peak performance periods, challenging times, and optimal activities based on elemental
            harmony and lunar mansion positions.
          </p>
        </div>

        <div className="chinese-weekly-horoscope-info__section">
          <h3 className="chinese-weekly-horoscope-info__title">Key Weekly Elements</h3>
          <ul className="chinese-weekly-horoscope-info__list">
            <li><strong>Lunar Overview:</strong> Daily lunar phases and elemental influences throughout the week</li>
            <li><strong>Peak Days:</strong> Days with highest favorable energy (80%+ compatibility)</li>
            <li><strong>Challenging Days:</strong> Days requiring extra caution and preparation</li>
            <li><strong>Activity Recommendations:</strong> Best times for specific types of activities</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChineseWeeklyHoroscopeView;