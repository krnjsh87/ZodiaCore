/**
 * ZodiaCore - Weekly Horoscope View Component
 *
 * Specialized view for weekly horoscopes showing transit analysis and peak days.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

import React from 'react';
import { Horoscope, BirthChart } from '../types/astrology';
import HoroscopeDisplay from './HoroscopeDisplay';

interface WeeklyHoroscopeViewProps {
  horoscope: Horoscope;
  birthChart?: BirthChart;
}

/**
 * Weekly Horoscope View Component
 * Shows weekly-specific horoscope information
 */
const WeeklyHoroscopeView: React.FC<WeeklyHoroscopeViewProps> = ({
  horoscope,
  birthChart
}) => {
  if (!horoscope.weekly) {
    return <HoroscopeDisplay horoscope={horoscope} birthChart={birthChart} />;
  }

  const { weekly } = horoscope;

  /**
   * Render weekly transit analysis
   */
  const renderWeeklyTransits = () => {
    if (!weekly.weeklyTransit || weekly.weeklyTransit.length === 0) return null;

    return (
      <section className="weekly-horoscope-section weekly-horoscope-section--transits">
        <h2 className="weekly-horoscope-section__title">Weekly Transit Analysis</h2>

        <div className="weekly-transits">
          {weekly.weeklyTransit.map((transit, index) => (
            <div key={index} className="weekly-transit">
              <div className="weekly-transit__header">
                <h3 className="weekly-transit__date">
                  {transit.date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </h3>
                <span className="weekly-transit__moon-sign">
                  Moon in {getSignName(transit.moonSign)}
                </span>
              </div>

              {transit.keyTransits && transit.keyTransits.length > 0 && (
                <ul className="weekly-transit__events">
                  {transit.keyTransits.map((event, eventIndex) => (
                    <li key={eventIndex} className="weekly-transit__event">{event}</li>
                  ))}
                </ul>
              )}
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
      <section className="weekly-horoscope-section weekly-horoscope-section--peak-days">
        <h2 className="weekly-horoscope-section__title">Peak Days</h2>

        <div className="peak-days">
          {weekly.peakDays.map((peakDay, index) => (
            <div key={index} className="peak-day peak-day--positive">
              <div className="peak-day__header">
                <h3 className="peak-day__date">
                  {peakDay.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </h3>
                <span className="peak-day__score">{Math.round(peakDay.score * 100)}%</span>
              </div>
              <p className="peak-day__reason">{peakDay.reason}</p>
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
      <section className="weekly-horoscope-section weekly-horoscope-section--challenging-days">
        <h2 className="weekly-horoscope-section__title">Challenging Days</h2>

        <div className="challenging-days">
          {weekly.challengingDays.map((challengingDay, index) => (
            <div key={index} className="challenging-day challenging-day--caution">
              <div className="challenging-day__header">
                <h3 className="challenging-day__date">
                  {challengingDay.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </h3>
                <span className="challenging-day__score">{Math.round(challengingDay.score * 100)}%</span>
              </div>
              <p className="challenging-day__reason">{challengingDay.reason}</p>
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
      <section className="weekly-horoscope-section weekly-horoscope-section--activities">
        <h2 className="weekly-horoscope-section__title">Recommended Activities</h2>

        <div className="best-activities">
          <ul className="best-activities__list">
            {weekly.bestActivities.map((activity, index) => (
              <li key={index} className="best-activity">{activity}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  };

  /**
   * Get sign name from sign number
   */
  const getSignName = (signNumber: number): string => {
    const signs = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    return signs[signNumber] || 'Unknown';
  };

  return (
    <div className="weekly-horoscope-view">
      <HoroscopeDisplay horoscope={horoscope} birthChart={birthChart} />

      <div className="weekly-horoscope-specific">
        {renderWeeklyTransits()}
        {renderPeakDays()}
        {renderChallengingDays()}
        {renderBestActivities()}
      </div>

      <div className="weekly-horoscope-info">
        <div className="weekly-horoscope-info__section">
          <h3 className="weekly-horoscope-info__title">About Weekly Horoscopes</h3>
          <p className="weekly-horoscope-info__text">
            Weekly horoscopes provide an overview of planetary movements and their influences
            throughout the week. They highlight peak performance days, challenging periods,
            and recommend the best activities for each day based on your birth chart.
          </p>
        </div>

        <div className="weekly-horoscope-info__section">
          <h3 className="weekly-horoscope-info__title">Key Features</h3>
          <ul className="weekly-horoscope-info__list">
            <li><strong>Daily Moon Signs:</strong> Track lunar influences each day</li>
            <li><strong>Peak Days:</strong> Optimal days for important activities</li>
            <li><strong>Challenging Days:</strong> Days requiring extra caution</li>
            <li><strong>Activity Recommendations:</strong> Best times for different pursuits</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WeeklyHoroscopeView;